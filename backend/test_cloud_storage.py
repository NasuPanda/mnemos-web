#!/usr/bin/env python3
"""
Test script for Cloud Storage integration
"""

import asyncio
import os
import json
from services.storage_service import CloudStorageService
from models import Item, AppData
from datetime import datetime

async def test_cloud_storage_basic():
    """Test basic Cloud Storage operations"""
    print("🌥️ Testing Cloud Storage basic operations...")
    
    # Initialize Cloud Storage service
    storage = CloudStorageService("mnemos-test-bucket")
    
    # Test availability
    is_available = storage.is_available()
    print(f"📡 Cloud Storage available: {is_available}")
    
    if not is_available:
        print("❌ Cloud Storage not available, skipping tests")
        return False
    
    # Test download
    print("📥 Testing download...")
    data = await storage.download_json("mnemos_data.json")
    if data:
        print(f"✅ Downloaded data successfully - {len(data.get('items', []))} items")
    else:
        print("❌ Failed to download data")
        return False
    
    # Test upload
    print("📤 Testing upload...")
    test_data = {
        "items": [
            {
                "id": "cloud-test-item",
                "name": "Cloud Storage Test",
                "section": "Testing",
                "problem_text": "Does Cloud Storage work?",
                "answer_text": "Testing now!",
                "created_date": datetime.now().isoformat(),
                "last_accessed": datetime.now().isoformat(),
                "problem_images": [],
                "answer_images": [],
                "reviewed": False,
                "archived": False
            }
        ],
        "categories": ["Testing"],
        "settings": {"confident_days": 7, "medium_days": 3, "wtf_days": 1},
        "last_updated": datetime.now().isoformat()
    }
    
    success = await storage.upload_json("test_data.json", test_data)
    if success:
        print("✅ Upload successful")
    else:
        print("❌ Upload failed")
        return False
    
    # Verify upload by downloading it back
    print("🔍 Verifying upload...")
    downloaded_test_data = await storage.download_json("test_data.json")
    if downloaded_test_data and downloaded_test_data["items"][0]["id"] == "cloud-test-item":
        print("✅ Upload verification successful")
    else:
        print("❌ Upload verification failed")
        return False
    
    return True

async def test_data_service_integration():
    """Test Cloud Storage integration with data service"""
    print("\n🔧 Testing data service integration with Cloud Storage...")
    
    # Set environment variables to use Cloud Storage
    os.environ["USE_CLOUD_STORAGE"] = "true"
    os.environ["STORAGE_BUCKET_NAME"] = "mnemos-test-bucket"
    
    # Import data service (after setting env vars)
    from services.data_service import load_data, save_data, _cached_data
    
    # Clear any cached data
    import services.data_service
    services.data_service._cached_data = None
    services.data_service._storage_service = None
    
    # Test loading data
    print("📥 Testing data service load from Cloud Storage...")
    data = load_data()
    print(f"✅ Loaded {len(data.items)} items from data service")
    
    # Test saving data
    print("📤 Testing data service save to Cloud Storage...")
    test_item = Item(
        id="integration-test-item",
        name="Integration Test Item",
        section="Integration",
        problem_text="Does data service work with Cloud Storage?",
        answer_text="Testing integration!",
        created_date=datetime.now().isoformat(),
        last_accessed=datetime.now().isoformat(),
        problem_images=[],
        answer_images=[],
        reviewed=False,
        archived=False
    )
    
    data.items.append(test_item)
    await save_data(data)
    print("✅ Data saved via data service")
    
    # Verify by clearing cache and reloading
    services.data_service._cached_data = None
    reloaded_data = load_data()
    integration_item_found = any(item.id == "integration-test-item" for item in reloaded_data.items)
    print(f"✅ Integration test item persisted: {integration_item_found}")
    
    return integration_item_found

async def test_performance_with_cloud_storage():
    """Test performance with Cloud Storage"""
    print("\n⚡ Testing performance with Cloud Storage...")
    
    from services.data_service import save_data, load_data
    import time
    
    # Load data
    data = load_data()
    
    # Test write performance
    test_item = Item(
        id="performance-test-item",
        name="Performance Test",
        section="Performance",
        problem_text="How fast is Cloud Storage?",
        answer_text="Measuring now!",
        created_date=datetime.now().isoformat(),
        last_accessed=datetime.now().isoformat(),
        problem_images=[],
        answer_images=[],
        reviewed=False,
        archived=False
    )
    
    data.items.append(test_item)
    
    start_time = time.time()
    await save_data(data)
    end_time = time.time()
    
    write_time_ms = (end_time - start_time) * 1000
    print(f"⚡ Cloud Storage write time: {write_time_ms:.2f}ms")
    
    # Test should be under 200ms for acceptable performance
    if write_time_ms < 200:
        print("🎉 Performance target achieved!")
        return True
    else:
        print("⚠️ Performance slower than expected")
        return write_time_ms < 500  # Still acceptable if under 500ms

async def cleanup_test_data():
    """Clean up test data"""
    print("\n🧹 Cleaning up test data...")
    
    try:
        storage = CloudStorageService("mnemos-test-bucket")
        
        # You could delete test files here if needed
        # For now, just log that cleanup would happen
        print("✅ Cleanup completed (test files left for manual inspection)")
        
    except Exception as e:
        print(f"⚠️ Cleanup warning: {e}")

async def main():
    """Run all Cloud Storage tests"""
    print("🚀 Starting Cloud Storage integration tests...\n")
    
    try:
        # Test basic operations
        basic_test_passed = await test_cloud_storage_basic()
        if not basic_test_passed:
            print("❌ Basic tests failed, stopping")
            return
        
        # Test data service integration
        integration_test_passed = await test_data_service_integration()
        if not integration_test_passed:
            print("❌ Integration tests failed")
        
        # Test performance
        performance_test_passed = await test_performance_with_cloud_storage()
        
        # Cleanup
        await cleanup_test_data()
        
        # Summary
        print(f"\n📊 Test Results:")
        print(f"  Basic Operations: {'✅ PASS' if basic_test_passed else '❌ FAIL'}")
        print(f"  Data Integration: {'✅ PASS' if integration_test_passed else '❌ FAIL'}")
        print(f"  Performance: {'✅ PASS' if performance_test_passed else '❌ FAIL'}")
        
        if basic_test_passed and integration_test_passed and performance_test_passed:
            print("\n🎉 All Cloud Storage tests passed!")
        else:
            print("\n⚠️ Some tests failed - check implementation")
            
    except Exception as e:
        print(f"❌ Test suite failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())