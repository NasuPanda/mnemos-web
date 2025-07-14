#!/usr/bin/env python3
"""
Migration script to upload existing local images to Cloudinary with optimization
and update the JSON data file with new Cloudinary URLs.

This script:
1. Backs up the original JSON file
2. Uploads all local images to Cloudinary with FREE tier optimization
3. Updates the JSON data with new Cloudinary URLs
4. Creates a mapping file for reference
5. Optionally removes local images after successful migration
"""

import json
import os
import shutil
import sys
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Tuple

# Add the backend directory to the path so we can import our services
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.cloudinary_service import cloudinary_service
from services.data_service import load_data, save_data

# Configuration
DATA_DIR = Path("/app/data") if os.path.exists("/app/data") else Path("data")
IMAGES_DIR = DATA_DIR / "images"
BACKUP_DIR = DATA_DIR / "backup" 
JSON_FILE = "mnemos_data.json"

def create_backup():
    """Create backup of original JSON file"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_file = BACKUP_DIR / f"mnemos_data_backup_{timestamp}.json"
    
    # Create backup directory if it doesn't exist
    BACKUP_DIR.mkdir(exist_ok=True)
    
    # Copy original JSON file
    if os.path.exists(JSON_FILE):
        shutil.copy2(JSON_FILE, backup_file)
        print(f"✅ Created backup: {backup_file}")
        return backup_file
    else:
        print(f"⚠️  JSON file {JSON_FILE} not found")
        return None

def get_local_images() -> List[Path]:
    """Get list of all local image files"""
    if not IMAGES_DIR.exists():
        print(f"⚠️  Images directory {IMAGES_DIR} not found")
        return []
    
    image_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'}
    images = []
    
    for file_path in IMAGES_DIR.iterdir():
        if file_path.is_file() and file_path.suffix.lower() in image_extensions:
            images.append(file_path)
    
    print(f"📁 Found {len(images)} local images to migrate")
    return images

def upload_image_to_cloudinary(image_path: Path) -> Tuple[str, str]:
    """
    Upload a single image to Cloudinary with optimization
    
    Returns:
        Tuple of (original_filename, cloudinary_url)
    """
    try:
        with open(image_path, 'rb') as f:
            file_content = f.read()
        
        cloudinary_url = cloudinary_service.upload_image(file_content, image_path.name)
        print(f"  ✅ {image_path.name} → {cloudinary_url}")
        return image_path.name, cloudinary_url
        
    except Exception as e:
        print(f"  ❌ Failed to upload {image_path.name}: {str(e)}")
        return image_path.name, ""

def migrate_images() -> Dict[str, str]:
    """
    Migrate all local images to Cloudinary
    
    Returns:
        Dictionary mapping original filename to Cloudinary URL
    """
    if not cloudinary_service.is_cloudinary_configured():
        print("❌ Cloudinary not configured. Please check environment variables:")
        print("   - CLOUDINARY_CLOUD_NAME")
        print("   - CLOUDINARY_API_KEY") 
        print("   - CLOUDINARY_API_SECRET")
        return {}
    
    print("🚀 Starting image migration to Cloudinary...")
    
    images = get_local_images()
    if not images:
        print("🎉 No images to migrate")
        return {}
    
    mapping = {}
    successful_uploads = 0
    
    for image_path in images:
        filename, cloudinary_url = upload_image_to_cloudinary(image_path)
        if cloudinary_url:
            mapping[filename] = cloudinary_url
            successful_uploads += 1
        else:
            mapping[filename] = ""  # Mark as failed
    
    print(f"📊 Migration complete: {successful_uploads}/{len(images)} images uploaded")
    return mapping

def update_json_data(mapping: Dict[str, str]) -> bool:
    """
    Update JSON data file to replace local image paths with Cloudinary URLs
    
    Args:
        mapping: Dictionary of filename → Cloudinary URL
        
    Returns:
        True if successful, False otherwise
    """
    try:
        print("📝 Updating JSON data with Cloudinary URLs...")
        data = load_data()
        updated_items = 0
        
        for item in data.items:
            # Update problem images
            if item.problem_images:
                updated_problem_images = []
                for image_path in item.problem_images:
                    # Extract filename from path (handle both "/images/file.jpg" and "file.jpg")
                    filename = os.path.basename(image_path)
                    if filename in mapping and mapping[filename]:
                        updated_problem_images.append(mapping[filename])
                        updated_items += 1
                    else:
                        # Keep original if migration failed
                        updated_problem_images.append(image_path)
                        print(f"  ⚠️  Keeping original path for {filename} (migration failed)")
                item.problem_images = updated_problem_images
            
            # Update answer images
            if item.answer_images:
                updated_answer_images = []
                for image_path in item.answer_images:
                    # Extract filename from path (handle both "/images/file.jpg" and "file.jpg")
                    filename = os.path.basename(image_path)
                    if filename in mapping and mapping[filename]:
                        updated_answer_images.append(mapping[filename])
                        updated_items += 1
                    else:
                        # Keep original if migration failed
                        updated_answer_images.append(image_path)
                        print(f"  ⚠️  Keeping original path for {filename} (migration failed)")
                item.answer_images = updated_answer_images
        
        # Save updated data
        save_data(data)
        print(f"✅ Updated {updated_items} image references in JSON data")
        return True
        
    except Exception as e:
        print(f"❌ Failed to update JSON data: {str(e)}")
        return False

def save_mapping(mapping: Dict[str, str]):
    """Save the filename → URL mapping for reference"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    mapping_file = BACKUP_DIR / f"image_migration_mapping_{timestamp}.json"
    
    try:
        with open(mapping_file, 'w') as f:
            json.dump({
                "migration_date": timestamp,
                "total_images": len(mapping),
                "successful_uploads": len([url for url in mapping.values() if url]),
                "mapping": mapping
            }, f, indent=2)
        print(f"📋 Saved migration mapping to: {mapping_file}")
    except Exception as e:
        print(f"⚠️  Failed to save mapping: {str(e)}")

def cleanup_local_images(mapping: Dict[str, str], confirm: bool = False):
    """
    Remove local image files after successful migration
    
    Args:
        mapping: Dictionary of filename → Cloudinary URL
        confirm: If True, removes files. If False, just shows what would be removed.
    """
    successful_files = [filename for filename, url in mapping.items() if url]
    
    if not successful_files:
        print("🎯 No files to clean up (no successful uploads)")
        return
    
    print(f"🗑️  {'Would remove' if not confirm else 'Removing'} {len(successful_files)} local image files:")
    
    for filename in successful_files:
        file_path = IMAGES_DIR / filename
        if file_path.exists():
            if confirm:
                file_path.unlink()
                print(f"  ✅ Removed: {filename}")
            else:
                print(f"  📄 Would remove: {filename}")
    
    if not confirm:
        print("\n💡 Run with --cleanup flag to actually remove files")

def main():
    """Main migration function"""
    print("🌩️  Mnemos Image Migration to Cloudinary")
    print("=" * 50)
    
    # Parse command line arguments
    cleanup = "--cleanup" in sys.argv
    
    # Step 1: Create backup
    backup_file = create_backup()
    if not backup_file:
        print("❌ Failed to create backup. Aborting migration.")
        return
    
    # Step 2: Migrate images to Cloudinary
    mapping = migrate_images()
    if not mapping:
        print("❌ No images migrated. Aborting.")
        return
    
    # Step 3: Update JSON data
    if not update_json_data(mapping):
        print("❌ Failed to update JSON data. Check backup and try again.")
        return
    
    # Step 4: Save mapping for reference
    save_mapping(mapping)
    
    # Step 5: Cleanup local files (optional)
    cleanup_local_images(mapping, confirm=cleanup)
    
    # Summary
    successful = len([url for url in mapping.values() if url])
    total = len(mapping)
    
    print("\n🎉 Migration Summary:")
    print(f"   📊 {successful}/{total} images successfully migrated")
    print(f"   💾 Backup saved: {backup_file}")
    print(f"   🌩️  Images now served from Cloudinary CDN")
    print(f"   💰 Using FREE tier optimization for maximum efficiency")
    
    if successful < total:
        print(f"\n⚠️  {total - successful} images failed to migrate:")
        for filename, url in mapping.items():
            if not url:
                print(f"   - {filename}")

if __name__ == "__main__":
    main()