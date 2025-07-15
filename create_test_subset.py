#!/usr/bin/env python3
"""
Create Test Subset for Incremental Migration Testing

Extracts a representative sample from migrated data for production testing.
"""

import json
import random
from pathlib import Path
from typing import Dict, List, Any


def create_test_subset(
    input_file: str = "migrated_mnemos_data.json",
    output_file: str = "test_migrated_data.json",
    target_items: int = 12,
    target_images: int = 8
) -> Dict[str, Any]:
    """Create a test subset with representative data"""
    
    print(f"🧪 Creating test subset from {input_file}")
    print(f"📊 Target: {target_items} items, {target_images} images")
    
    # Load full migrated data
    with open(input_file, 'r', encoding='utf-8') as f:
        full_data = json.load(f)
    
    all_items = full_data['items']
    print(f"📝 Total items available: {len(all_items)}")
    
    # Categorize items by category and image status
    items_by_category = {}
    items_with_images = []
    items_without_images = []
    
    for item in all_items:
        category = item['category']
        if category not in items_by_category:
            items_by_category[category] = []
        items_by_category[category].append(item)
        
        # Check if item has images
        if item.get('answer_images') and any('MIGRATE_TODO' in img for img in item['answer_images']):
            items_with_images.append(item)
        else:
            items_without_images.append(item)
    
    print(f"📂 Categories found: {list(items_by_category.keys())}")
    print(f"🖼️  Items with images: {len(items_with_images)}")
    print(f"📄 Items without images: {len(items_without_images)}")
    
    # Strategy: Representative sampling
    selected_items = []
    
    # 1. Ensure we have items from each category
    items_per_category = max(2, target_items // len(items_by_category))
    for category, category_items in items_by_category.items():
        sample_size = min(items_per_category, len(category_items))
        selected_from_category = random.sample(category_items, sample_size)
        selected_items.extend(selected_from_category)
        print(f"   {category}: {sample_size} items selected")
    
    # 2. Add more items with images if we need them
    remaining_slots = target_items - len(selected_items)
    if remaining_slots > 0:
        # Get items with images that aren't already selected
        available_image_items = [
            item for item in items_with_images 
            if item not in selected_items
        ]
        
        if available_image_items:
            additional_image_items = random.sample(
                available_image_items, 
                min(remaining_slots, len(available_image_items))
            )
            selected_items.extend(additional_image_items)
            print(f"🖼️  Added {len(additional_image_items)} more items with images")
    
    # 3. Fill remaining slots with any items
    remaining_slots = target_items - len(selected_items)
    if remaining_slots > 0:
        available_items = [item for item in all_items if item not in selected_items]
        if available_items:
            final_additions = random.sample(
                available_items, 
                min(remaining_slots, len(available_items))
            )
            selected_items.extend(final_additions)
            print(f"📄 Added {len(final_additions)} additional items")
    
    # Ensure we don't exceed target
    selected_items = selected_items[:target_items]
    
    # Count images in selected subset
    total_images = 0
    for item in selected_items:
        if item.get('answer_images'):
            total_images += len([img for img in item['answer_images'] if 'MIGRATE_TODO' in img])
    
    # Create test data structure
    test_data = {
        "items": selected_items,
        "categories": full_data['categories'],
        "settings": full_data['settings'],
        "last_updated": full_data['last_updated'],
        "test_metadata": {
            "source_file": input_file,
            "total_source_items": len(all_items),
            "selected_items": len(selected_items),
            "flagged_images": total_images,
            "target_items": target_items,
            "target_images": target_images
        }
    }
    
    # Save test subset
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(test_data, f, indent=2, ensure_ascii=True)
    
    # Print summary
    print("\n" + "="*50)
    print("🧪 TEST SUBSET CREATED")
    print("="*50)
    print(f"📁 Output file: {output_file}")
    print(f"📊 Items selected: {len(selected_items)}")
    print(f"🖼️  Images flagged: {total_images}")
    
    # Category breakdown
    subset_by_category = {}
    for item in selected_items:
        category = item['category']
        subset_by_category[category] = subset_by_category.get(category, 0) + 1
    
    print("\n📂 Category distribution:")
    for category, count in subset_by_category.items():
        print(f"   {category}: {count} items")
    
    # Sample items
    print("\n📝 Sample items:")
    for i, item in enumerate(selected_items[:5]):
        has_images = "🖼️" if item.get('answer_images') else "📄"
        print(f"   {i+1}. {has_images} {item['name'][:50]}...")
    
    if len(selected_items) > 5:
        print(f"   ... and {len(selected_items) - 5} more items")
    
    print(f"\n✅ Test subset ready for incremental testing!")
    
    return test_data


def main():
    """Main entry point"""
    # Set random seed for reproducible results
    random.seed(42)
    
    # Create test subset
    test_data = create_test_subset(
        target_items=12,  # Good balance: not too few, not too many
        target_images=8   # Enough to test image workflow
    )
    
    return 0


if __name__ == "__main__":
    exit(main())