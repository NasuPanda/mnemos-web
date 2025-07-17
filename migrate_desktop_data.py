#!/usr/bin/env python3
"""
Mnemos Desktop → Web Migration Script

Migrates data from updated desktop data to mnemos web format.
Category mappings: Math → Calculus Ⅰ, Language → Vocabulary, Other → Other
"""

import json
import uuid
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Optional


class MnemosDesktopMigrator:
    """Handles migration from desktop to web format"""
    
    def __init__(self):
        self.section_mappings = {
            "Math": "Calculus Ⅰ",
            "Language": "Vocabulary", 
            "Other": "Other"
        }
        self.migration_stats = {
            "total_items": 0,
            "archived_skipped": 0,
            "migrated_items": 0,
            "failed_items": 0,
            "image_flags": 0
        }
        self.failed_items = []
        
    def load_desktop_data(self, file_path: str) -> List[Dict[str, Any]]:
        """Load and parse desktop JSON data"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                
            if not isinstance(data, list):
                raise ValueError("Desktop data must be a list of items")
                
            print(f"✅ Loaded {len(data)} items from desktop data")
            self.migration_stats["total_items"] = len(data)
            return data
            
        except FileNotFoundError:
            raise FileNotFoundError(f"Desktop data file not found: {file_path}")
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON in desktop data: {e}")
    
    def map_sections(self, desktop_section: str) -> str:
        """Convert desktop section to web section"""
        return self.section_mappings.get(desktop_section, "Other")
    
    def extract_review_dates(self, history: List[Dict[str, str]]) -> List[str]:
        """Extract review dates from desktop history, excluding archived entries"""
        if not history:
            return []
            
        review_dates = []
        for entry in history:
            if entry.get("feedback") != "archived":
                review_dates.append(entry.get("date", ""))
        
        return [date for date in review_dates if date]
    
    def handle_image_paths(self, answer_images: List[str]) -> List[str]:
        """Flag image paths for manual Cloudinary upload"""
        if not answer_images:
            return []
            
        flagged_images = []
        for image_path in answer_images:
            # Extract filename from path like "data/answers/answer_20250526_083225.png"
            filename = Path(image_path).name
            flagged_path = f"MIGRATE_TODO: Upload {filename} to Cloudinary"
            flagged_images.append(flagged_path)
            self.migration_stats["image_flags"] += 1
            
        return flagged_images
    
    def clean_text(self, text: str) -> str:
        """Clean text by removing problematic Unicode characters"""
        if not text:
            return ""
        
        # Encode to UTF-8 and decode with error handling to remove problematic characters
        try:
            cleaned = text.encode('utf-8', errors='ignore').decode('utf-8')
        except UnicodeEncodeError:
            # Fallback: manually remove known problematic characters
            import re
            cleaned = re.sub(r'[\ud800-\udfff]', '', text)  # Remove surrogates
            cleaned = re.sub(r'[\ufeff]', '', cleaned)       # Remove BOM
            # Try encoding again
            try:
                cleaned = cleaned.encode('utf-8', errors='ignore').decode('utf-8')
            except:
                # Last resort: keep only ASCII characters
                cleaned = ''.join(char for char in text if ord(char) < 128)
        
        return cleaned

    def migrate_item(self, desktop_item: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Convert single desktop item to web format"""
        try:
            # Skip archived items
            if desktop_item.get("archived", False):
                self.migration_stats["archived_skipped"] += 1
                return None
            
            # Validate required fields
            if not desktop_item.get("name"):
                raise ValueError("Missing required field: name")
            
            # Extract and process data
            history = desktop_item.get("history", [])
            review_dates = self.extract_review_dates(history)
            answer_images = desktop_item.get("answer_images", [])
            flagged_images = self.handle_image_paths(answer_images)
            
            # Clean text fields to avoid encoding issues
            name = self.clean_text(desktop_item.get("name", ""))
            description = self.clean_text(desktop_item.get("description", ""))
            answer_text = self.clean_text(desktop_item.get("answer_text", ""))
            side_note = self.clean_text(desktop_item.get("side_note", ""))
            
            # Generate web item with correct backend model structure
            web_item = {
                "id": str(uuid.uuid4()),
                "name": name,
                "section": self.map_sections(desktop_item.get("section", "Other")),  # FIXED: category → section
                "side_note": side_note,
                
                # Problem fields
                "problem_text": description,
                "problem_url": desktop_item.get("url", ""),
                "problem_image": None,  # FIXED: Add deprecated but required field
                "problem_images": [],
                
                # Answer fields
                "answer_text": answer_text,
                "answer_url": "",
                "answer_image": None,   # FIXED: Add deprecated but required field
                "answer_images": flagged_images,
                
                # Review fields
                "reviewed": len(review_dates) > 0,
                "next_review_date": desktop_item.get("next_review", ""),
                "review_dates": review_dates,
                
                # Timestamps
                "created_date": desktop_item.get("created", datetime.now().strftime("%Y-%m-%d")),
                "last_accessed": datetime.now().isoformat(),
                "archived": False
            }
            
            self.migration_stats["migrated_items"] += 1
            return web_item
            
        except Exception as e:
            self.migration_stats["failed_items"] += 1
            self.failed_items.append({
                "item_name": desktop_item.get("name", "Unknown"),
                "error": str(e)
            })
            print(f"❌ Failed to migrate item '{desktop_item.get('name', 'Unknown')}': {e}")
            return None
    
    def generate_web_data(self, migrated_items: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Generate final web format with items, categories, and settings"""
        
        # Extract unique sections from migrated items (backend uses "section" but AppData has "categories")
        categories = list(set(item["section"] for item in migrated_items))
        categories.sort()
        
        return {
            "items": migrated_items,
            "categories": categories,  # AppData.categories maps to Item.section values
            "settings": {
                "confident_days": 7,
                "medium_days": 3,
                "wtf_days": 1
            },
            "last_updated": datetime.now().isoformat()
        }
    
    def run_migration(self, input_file: str, output_file: str, incremental_test: bool = False) -> bool:
        """Execute complete migration process"""
        print(f"🚀 Starting Mnemos Desktop → Web Migration")
        print(f"📂 Input: {input_file}")
        print(f"💾 Output: {output_file}")
        
        try:
            # Load desktop data
            desktop_data = self.load_desktop_data(input_file)
            
            # Filter out archived items early to avoid Unicode issues
            active_items = [item for item in desktop_data if not item.get("archived", False)]
            archived_count = len(desktop_data) - len(active_items)
            print(f"📊 Found {len(active_items)} active items ({archived_count} archived items skipped)")
            
            # Incremental testing: process only first 5 items
            if incremental_test:
                active_items = active_items[:5]
                print(f"🧪 INCREMENTAL TEST MODE: Processing first 5 active items only")
            
            # Migrate items
            migrated_items = []
            for i, desktop_item in enumerate(active_items, 1):
                try:
                    item_name = desktop_item.get('name', 'Unknown')
                    print(f"Processing item {i}/{len(active_items)}: {item_name}")
                    
                    web_item = self.migrate_item(desktop_item)
                    if web_item:
                        migrated_items.append(web_item)
                except Exception as e:
                    print(f"🚨 Error processing item {i}: {e}")
                    print(f"   Item name: {repr(desktop_item.get('name', 'Unknown'))}")
                    # Skip this item and continue
                    continue
            
            # Generate final web data
            web_data = self.generate_web_data(migrated_items)
            
            # Save migrated data - new desktop data should be clean
            print(f"📊 Attempting to serialize {len(web_data['items'])} items to JSON...")
            try:
                json_string = json.dumps(web_data, indent=2, ensure_ascii=True)
                print("✅ JSON serialization successful")
            except Exception as e:
                print(f"❌ JSON serialization failed: {e}")
                print("🔍 Attempting to find problematic item...")
                # Test each item individually
                for i, item in enumerate(web_data['items']):
                    try:
                        json.dumps(item, ensure_ascii=True)
                    except Exception as item_error:
                        print(f"🚨 Problem in item {i+1}: {item.get('name', 'unknown')}")
                        print(f"   Error: {item_error}")
                        # Try each field
                        for key, value in item.items():
                            try:
                                json.dumps({key: value}, ensure_ascii=True)
                            except Exception as field_error:
                                print(f"   Problem field '{key}': {field_error}")
                        break
                raise e
            
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(json_string)
            
            # Print migration report
            self.print_migration_report(output_file, incremental_test)
            
            return True
            
        except Exception as e:
            print(f"💥 Migration failed: {e}")
            return False
    
    def print_migration_report(self, output_file: str, incremental_test: bool = False):
        """Print detailed migration statistics"""
        stats = self.migration_stats
        
        print("\n" + "="*60)
        print("📊 MIGRATION REPORT")
        if incremental_test:
            print("🧪 INCREMENTAL TEST MODE")
        print("="*60)
        
        print(f"📝 Total items processed: {stats['total_items']}")
        print(f"⏭️  Archived items skipped: {stats['archived_skipped']}")
        print(f"✅ Items successfully migrated: {stats['migrated_items']}")
        print(f"❌ Items failed: {stats['failed_items']}")
        print(f"🖼️  Images flagged for upload: {stats['image_flags']}")
        
        # Category breakdown
        if Path(output_file).exists():
            with open(output_file, 'r') as f:
                data = json.load(f)
                print(f"📂 Categories created: {', '.join(data['categories'])}")
        
        # Failed items details
        if self.failed_items:
            print("\n❌ FAILED ITEMS:")
            for failed in self.failed_items:
                print(f"   • {failed['item_name']}: {failed['error']}")
        
        # Post-migration tasks
        print("\n📋 NEXT STEPS:")
        if stats['image_flags'] > 0:
            print(f"   1. Upload {stats['image_flags']} images to Cloudinary")
            print(f"      Source folder: /Users/ns/projects/2025/Mnemos/data/answers")
        print(f"   2. Review migrated data in: {output_file}")
        print(f"   3. Test web app with migrated data")
        print(f"   4. Replace production data when ready")
        
        print("\n✨ Migration completed!")


def main():
    """Main entry point for migration script"""
    import sys
    
    migrator = MnemosDesktopMigrator()
    
    # File paths
    input_file = "/Users/ns/projects/2025/Mnemos/data/items.json"
    
    # Check command line arguments for test mode
    incremental_test = "--test" in sys.argv
    
    if incremental_test:
        output_file = "test_migrated_data.json"
        print("🧪 Running incremental test with first 5 items")
    else:
        output_file = "migrated_mnemos_data_updated.json"
        print("🚀 Running full migration with all items")
    
    # Run migration
    success = migrator.run_migration(input_file, output_file, incremental_test)
    
    if success:
        print(f"\n🎉 Migration successful! Output saved to: {output_file}")
        if incremental_test:
            print("🔄 Ready to run full migration: python migrate_desktop_data.py")
    else:
        print("\n💥 Migration failed. Check errors above.")
        return 1
    
    return 0


if __name__ == "__main__":
    exit(main())