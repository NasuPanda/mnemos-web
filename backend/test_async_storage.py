#!/usr/bin/env python3
"""
Test script for async storage implementation
"""

import asyncio
import time
import json
from services.data_service import load_data, save_data
from models import Item, AppData
from datetime import datetime

async def test_async_performance():
    """Test async write performance"""
    print("🧪 Testing async storage performance...")
    
    # Load initial data
    data = load_data()
    print(f"📊 Initial items count: {len(data.items)}")
    
    # Create a test item
    test_item = Item(
        id="test-async-item",
        name="Test Async Item",
        section="Test",
        problem_text="How fast is async?",
        answer_text="Very fast!",
        created_date=datetime.now().isoformat(),
        last_accessed=datetime.now().isoformat()
    )
    
    # Test write performance
    data.items.append(test_item)
    
    start_time = time.time()
    await save_data(data)
    end_time = time.time()
    
    write_time_ms = (end_time - start_time) * 1000
    print(f"⚡ Async write completed in: {write_time_ms:.2f}ms")
    
    # Verify data persisted
    print("🔍 Checking if data persisted...")
    
    # Wait a moment for async storage to complete
    await asyncio.sleep(0.2)
    
    # Check test_storage directory
    try:
        with open("test_storage/mnemos_data.json", 'r') as f:
            stored_data = json.load(f)
            stored_items = stored_data.get("items", [])
            test_item_found = any(item["id"] == "test-async-item" for item in stored_items)
            print(f"✅ Test item found in storage: {test_item_found}")
    except FileNotFoundError:
        print("❌ Storage file not found")
    
    return write_time_ms

async def test_memory_cache():
    """Test memory cache functionality"""
    print("\n🧪 Testing memory cache...")
    
    # First load (should be from storage)
    start_time = time.time()
    data1 = load_data()
    first_load_time = (time.time() - start_time) * 1000
    
    # Second load (should be from memory cache)
    start_time = time.time()
    data2 = load_data()
    second_load_time = (time.time() - start_time) * 1000
    
    print(f"📊 First load (storage): {first_load_time:.2f}ms")
    print(f"🚀 Second load (cache): {second_load_time:.2f}ms")
    print(f"⚡ Speedup: {first_load_time / second_load_time:.1f}x faster")
    
    # Verify same data
    print(f"✅ Same data object: {data1 is data2}")

async def test_failure_simulation():
    """Test behavior when storage fails"""
    print("\n🧪 Testing failure simulation...")
    
    # Try to make storage directory read-only (if it exists)
    import os
    try:
        if os.path.exists("test_storage"):
            os.chmod("test_storage", 0o444)  # Read-only
            print("📁 Made storage directory read-only")
            
            # Try to save data
            data = load_data()
            test_item = Item(
                id="test-failure-item",
                name="Test Failure Item",
                section="Test",
                problem_text="Will this fail gracefully?",
                answer_text="It should!",
                created_date=datetime.now().isoformat(),
                last_accessed=datetime.now().isoformat()
            )
            data.items.append(test_item)
            
            await save_data(data)
            print("✅ App continued working despite storage failure")
            
            # Restore permissions
            os.chmod("test_storage", 0o755)
            print("📁 Restored storage directory permissions")
            
    except Exception as e:
        print(f"⚠️ Failure test error: {e}")

async def main():
    """Run all tests"""
    print("🚀 Starting async storage tests...\n")
    
    try:
        # Test performance
        write_time = await test_async_performance()
        
        # Test memory cache
        await test_memory_cache()
        
        # Test failure handling
        await test_failure_simulation()
        
        print(f"\n✅ All tests completed!")
        print(f"📈 Performance target: <50ms (actual: {write_time:.2f}ms)")
        
        if write_time < 50:
            print("🎉 Performance target achieved!")
        else:
            print("⚠️ Performance target not met")
            
    except Exception as e:
        print(f"❌ Test failed: {e}")

if __name__ == "__main__":
    asyncio.run(main())