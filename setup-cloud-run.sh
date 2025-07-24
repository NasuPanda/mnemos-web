#!/bin/bash

# Cloud Run Setup Script for Mnemos Web Application
# This script sets up all required permissions and services for the project

set -e  # Exit on any error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID="${GOOGLE_CLOUD_PROJECT:-mnemos-web}"
REGION="us-central1"
SERVICE_NAME="mnemos-web"
BUCKET_NAME="mnemos-data-bucket"

echo -e "${BLUE}🚀 Setting up Cloud Run environment for ${PROJECT_ID}${NC}"

# Function to print status
print_status() {
    echo -e "${GREEN}✅${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️${NC} $1"
}

print_error() {
    echo -e "${RED}❌${NC} $1"
}

# Check if gcloud is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    print_error "No active gcloud authentication found"
    echo "Please run: gcloud auth login"
    exit 1
fi

# Set the project
echo -e "${BLUE}Setting project to ${PROJECT_ID}${NC}"
gcloud config set project "${PROJECT_ID}" || {
    print_error "Failed to set project. Please check if project ${PROJECT_ID} exists."
    exit 1
}

# Get project number for service account names
PROJECT_NUMBER=$(gcloud projects describe "${PROJECT_ID}" --format="value(projectNumber)")
COMPUTE_SA="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"

print_status "Project: ${PROJECT_ID} (${PROJECT_NUMBER})"

# Enable required APIs
echo -e "${BLUE}📡 Enabling required Google Cloud APIs${NC}"
apis=(
    "run.googleapis.com"
    "cloudbuild.googleapis.com"
    "containerregistry.googleapis.com"
    "secretmanager.googleapis.com"
    "storage.googleapis.com"
)

for api in "${apis[@]}"; do
    echo "  Enabling ${api}..."
    gcloud services enable "${api}" || {
        print_error "Failed to enable ${api}"
        exit 1
    }
done

print_status "All required APIs enabled"

# Grant required IAM permissions
echo -e "${BLUE}🔐 Setting up IAM permissions${NC}"

# Cloud Run service account permissions
permissions=(
    "roles/secretmanager.secretAccessor"
    "roles/storage.objectAdmin"
)

for role in "${permissions[@]}"; do
    echo "  Granting ${role} to ${COMPUTE_SA}..."
    gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
        --member="serviceAccount:${COMPUTE_SA}" \
        --role="${role}" \
        --quiet || {
        print_error "Failed to grant ${role}"
        exit 1
    }
done

print_status "IAM permissions configured"

# Create Cloud Storage bucket if it doesn't exist
echo -e "${BLUE}🪣 Setting up Cloud Storage${NC}"
if ! gsutil ls "gs://${BUCKET_NAME}" >/dev/null 2>&1; then
    echo "  Creating bucket gs://${BUCKET_NAME}..."
    gsutil mb "gs://${BUCKET_NAME}" || {
        print_error "Failed to create bucket"
        exit 1
    }
    print_status "Cloud Storage bucket created"
else
    print_status "Cloud Storage bucket already exists"
fi

# Setup Secret Manager secrets for Cloudinary
echo -e "${BLUE}🔑 Setting up Secret Manager for Cloudinary${NC}"

# Check if user wants to create/update Cloudinary secrets
echo -e "${YELLOW}Do you want to set up Cloudinary secrets? (y/n)${NC}"
read -r setup_cloudinary

if [[ $setup_cloudinary =~ ^[Yy]$ ]]; then
    echo "Please provide your Cloudinary credentials:"
    
    # Get Cloudinary credentials
    echo -n "Cloudinary Cloud Name: "
    read -r cloudinary_cloud_name
    
    echo -n "Cloudinary API Key: "
    read -r cloudinary_api_key
    
    echo -n "Cloudinary API Secret: "
    read -rs cloudinary_api_secret
    echo  # New line after secret input
    
    # Create/update secrets (using printf to avoid trailing newlines)
    echo "  Creating/updating Cloudinary secrets..."
    
    printf "%s" "$cloudinary_cloud_name" | gcloud secrets create cloudinary-cloud-name --data-file=- --quiet 2>/dev/null || \
    printf "%s" "$cloudinary_cloud_name" | gcloud secrets versions add cloudinary-cloud-name --data-file=- --quiet
    
    printf "%s" "$cloudinary_api_key" | gcloud secrets create cloudinary-api-key --data-file=- --quiet 2>/dev/null || \
    printf "%s" "$cloudinary_api_key" | gcloud secrets versions add cloudinary-api-key --data-file=- --quiet
    
    printf "%s" "$cloudinary_api_secret" | gcloud secrets create cloudinary-api-secret --data-file=- --quiet 2>/dev/null || \
    printf "%s" "$cloudinary_api_secret" | gcloud secrets versions add cloudinary-api-secret --data-file=- --quiet
    
    print_status "Cloudinary secrets configured"
    
    # Test credentials
    echo "  Testing Cloudinary credentials..."
    if curl -s -u "${cloudinary_api_key}:${cloudinary_api_secret}" \
        "https://api.cloudinary.com/v1_1/${cloudinary_cloud_name}/usage" | grep -q "plan"; then
        print_status "Cloudinary credentials verified"
    else
        print_warning "Cloudinary credentials may be invalid. Please check them manually."
    fi
else
    print_warning "Skipping Cloudinary setup. You'll need to configure these manually."
fi

# Verify cloudbuild.yaml exists and is configured correctly
echo -e "${BLUE}📋 Checking cloudbuild.yaml configuration${NC}"
if [[ -f "cloudbuild.yaml" ]]; then
    if grep -q "set-secrets" cloudbuild.yaml; then
        print_status "cloudbuild.yaml is configured for Secret Manager"
    else
        print_warning "cloudbuild.yaml exists but may need Secret Manager configuration"
    fi
else
    print_warning "cloudbuild.yaml not found. Make sure it's configured properly."
fi

# Summary
echo
echo -e "${GREEN}🎉 Setup completed successfully!${NC}"
echo
echo -e "${BLUE}Summary of what was configured:${NC}"
echo "  • Project: ${PROJECT_ID}"
echo "  • Region: ${REGION}"
echo "  • APIs: Cloud Run, Cloud Build, Container Registry, Secret Manager, Cloud Storage"
echo "  • Service Account: ${COMPUTE_SA}"
echo "  • Permissions: secretmanager.secretAccessor, storage.objectAdmin"
echo "  • Cloud Storage: gs://${BUCKET_NAME}"
if [[ $setup_cloudinary =~ ^[Yy]$ ]]; then
    echo "  • Cloudinary secrets: ✅ Configured"
else
    echo "  • Cloudinary secrets: ⚠️  Manual setup required"
fi

echo
echo -e "${BLUE}Next steps:${NC}"
echo "  1. Ensure your cloudbuild.yaml is properly configured"
echo "  2. Deploy using: git push (if auto-deploy is set up)"
echo "  3. Or manually: gcloud builds submit"
echo "  4. Test image uploads in your application"

echo
echo -e "${BLUE}Useful commands:${NC}"
echo "  • Check service status: gcloud run services describe ${SERVICE_NAME} --region=${REGION}"
echo "  • View logs: gcloud logging read \"resource.type=cloud_run_revision AND resource.labels.service_name=${SERVICE_NAME}\" --limit=20"
echo "  • List secrets: gcloud secrets list"
echo "  • Check IAM: gcloud projects get-iam-policy ${PROJECT_ID}"