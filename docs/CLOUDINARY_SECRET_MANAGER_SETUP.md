# Cloudinary Secret Manager Setup - Issue Resolution

## Problem Overview

Image uploads were failing in production with "Failed to fetch" errors, then later "Unknown API key" errors after attempting to fix with Secret Manager integration.

## Root Cause Analysis

### Issue #1: Frontend API URL Configuration
**Problem**: Hardcoded `localhost:8000` in `NewItemModal.tsx` caused fetch failures in production.

**Solution**: Updated to use dynamic API base URL:
```typescript
const API_BASE = import.meta.env.PROD ? '' : 'http://localhost:8000';
```

### Issue #2: Missing Cloudinary Credentials in Production
**Problem**: Cloud Run deployment was overwriting environment variables, losing Cloudinary credentials.

**Root Cause**: `cloudbuild.yaml` only set 3 environment variables using `--set-env-vars`, which overwrote all existing environment variables.

**Solution**: Implemented Google Secret Manager integration to securely store and access credentials.

### Issue #3: Missing Secret Manager Permissions
**Problem**: Cloud Run service account didn't have permission to access Secret Manager secrets.

**Error**: 
```
Permission denied on secret: projects/121679401521/secrets/cloudinary-cloud-name/versions/latest 
for Revision service account 121679401521-compute@developer.gserviceaccount.com
```

**Solution**: Granted Secret Manager access to Cloud Run service account:
```bash
gcloud projects add-iam-policy-binding mnemos-web \
  --member="serviceAccount:121679401521-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### Issue #4: Trailing Newlines in Secret Values
**Problem**: Created secrets using `echo` which automatically added `\n` characters, causing Cloudinary to reject credentials as malformed.

**Error**: `"Unknown API key 816175828943839"` (credentials were valid but had trailing newline)

**Detection**: Used `hexdump -C` to reveal hidden characters:
```bash
gcloud secrets versions access latest --secret="cloudinary-api-key" | hexdump -C
# Showed: 38 31 36 31 37 35 38 32 38 39 34 33 38 33 39 0a
#         |816175828943839.|
#                            ^^ trailing newline (0a)
```

**Solution**: Recreated secrets using `printf` without newlines:
```bash
printf "ddwecvjjj" | gcloud secrets versions add cloudinary-cloud-name --data-file=-
printf "816175828943839" | gcloud secrets versions add cloudinary-api-key --data-file=-
printf -- "-Iqv0VE2TytyhpHcwHQxcER1WNA" | gcloud secrets versions add cloudinary-api-secret --data-file=-
```

## Final Working Configuration

### cloudbuild.yaml
```yaml
- name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
  entrypoint: gcloud
  args:
    - 'run'
    - 'deploy'
    - 'mnemos-web'
    - '--image'
    - 'gcr.io/$PROJECT_ID/mnemos-web'
    - '--region'
    - 'us-central1'
    - '--platform'
    - 'managed'
    - '--allow-unauthenticated'
    - '--port'
    - '80'
    - '--memory'
    - '256Mi'
    - '--cpu'
    - '1000m'
    - '--max-instances'
    - '3'
    - '--concurrency'
    - '100'
    - '--set-env-vars'
    - 'USE_CLOUD_STORAGE=true,STORAGE_BUCKET_NAME=mnemos-data-bucket,GOOGLE_CLOUD_PROJECT=$PROJECT_ID'
    - '--set-secrets'
    - 'CLOUDINARY_CLOUD_NAME=cloudinary-cloud-name:latest,CLOUDINARY_API_KEY=cloudinary-api-key:latest,CLOUDINARY_API_SECRET=cloudinary-api-secret:latest'
```

### Required Permissions
```bash
# Secret Manager API
gcloud services enable secretmanager.googleapis.com

# Service account permissions
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### Secret Creation (Correct Method)
```bash
# WRONG - adds trailing newlines
echo "value" | gcloud secrets create secret-name --data-file=-

# CORRECT - no trailing newlines
printf "value" | gcloud secrets versions add secret-name --data-file=-
```

## Lessons Learned

1. **Always test credentials directly** before assuming they're invalid
2. **Use `hexdump -C` to check for hidden characters** in secret values
3. **Use `printf` instead of `echo`** when creating secrets to avoid trailing newlines
4. **Verify Secret Manager permissions** before deployment
5. **Check environment variables are properly mounted** using Cloud Run service description

## Verification Steps

1. Check environment variables are set correctly:
```bash
gcloud run services describe SERVICE_NAME --region=REGION --format json | jq '.spec.template.spec.containers[0].env'
```

2. Verify secrets don't have trailing characters:
```bash
gcloud secrets versions access latest --secret=SECRET_NAME | hexdump -C
```

3. Test credentials work externally:
```bash
curl -X GET "https://api.cloudinary.com/v1_1/CLOUD_NAME/usage" \
  -u "API_KEY:API_SECRET"
```

4. Check deployment logs for Cloudinary errors:
```bash
gcloud logging read "resource.type=cloud_run_revision AND textPayload:\"Cloudinary\"" --limit 10
```

## Result

✅ Image uploads now work correctly in production using Cloudinary cloud storage
✅ Credentials are securely managed via Google Secret Manager
✅ No credentials exposed in Git repository
✅ Deployment process is consistent and repeatable