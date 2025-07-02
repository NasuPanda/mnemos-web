#!/usr/bin/env python3
"""
Test script for PUT /api/settings endpoint
"""
import json
import sys
import requests
import time

def test_settings_endpoint():
    """Test PUT /api/settings endpoint functionality"""
    print("🧪 Testing PUT /api/settings endpoint...")
    
    base_url = "http://localhost:8000"
    
    # 1. Get current settings first
    print("\n1. Getting current settings...")
    
    try:
        # Get current settings via /api/data
        response = requests.get(f"{base_url}/api/data")
        if response.status_code == 200:
            app_data = response.json()
            original_settings = app_data.get("settings", {})
            print(f"   ✅ Original settings: {original_settings}")
        else:
            print(f"   ❌ Failed to get current settings: {response.status_code}")
            return False
            
    except requests.exceptions.ConnectionError:
        print(f"   ❌ Could not connect to server at {base_url}")
        print(f"   💡 Make sure backend is running: docker-compose up backend")
        return False
    except Exception as e:
        print(f"   ❌ Unexpected error: {e}")
        return False
    
    # 2. Test successful settings update
    print("\n2. Testing successful settings update...")
    
    try:
        new_settings = {
            "confident_days": 14,
            "medium_days": 5,
            "wtf_days": 2
        }
        
        response = requests.put(f"{base_url}/api/settings", json=new_settings)
        
        if response.status_code == 200:
            updated_settings = response.json()
            print(f"   ✅ Update successful")
            print(f"   ✅ Updated settings: {updated_settings}")
            
            # Verify each setting was updated
            if updated_settings["confident_days"] == new_settings["confident_days"]:
                print(f"   ✅ confident_days updated correctly: {updated_settings['confident_days']}")
            else:
                print(f"   ❌ confident_days not updated correctly")
                return False
                
            if updated_settings["medium_days"] == new_settings["medium_days"]:
                print(f"   ✅ medium_days updated correctly: {updated_settings['medium_days']}")
            else:
                print(f"   ❌ medium_days not updated correctly")
                return False
                
            if updated_settings["wtf_days"] == new_settings["wtf_days"]:
                print(f"   ✅ wtf_days updated correctly: {updated_settings['wtf_days']}")
            else:
                print(f"   ❌ wtf_days not updated correctly")
                return False
            
            # Verify persistence
            verify_response = requests.get(f"{base_url}/api/data")
            if verify_response.status_code == 200:
                verify_data = verify_response.json()
                verify_settings = verify_data.get("settings", {})
                
                if verify_settings == updated_settings:
                    print(f"   ✅ Settings persisted to storage")
                else:
                    print(f"   ❌ Settings not persisted correctly")
                    print(f"   Expected: {updated_settings}")
                    print(f"   Got: {verify_settings}")
                    return False
            else:
                print(f"   ❌ Could not verify persistence")
                return False
                
        else:
            print(f"   ❌ Update failed: {response.status_code} - {response.text}")
            return False
            
    except Exception as e:
        print(f"   ❌ Unexpected error: {e}")
        return False
    
    # 3. Test validation with negative values
    print("\n3. Testing validation with negative values...")
    
    try:
        invalid_settings = {
            "confident_days": -1,
            "medium_days": 3,
            "wtf_days": 1
        }
        
        response = requests.put(f"{base_url}/api/settings", json=invalid_settings)
        
        if response.status_code == 400:
            error_data = response.json()
            print(f"   ✅ Correct 400 response for negative values: {error_data['detail']}")
        else:
            print(f"   ❌ Expected 400, got {response.status_code}")
            return False
            
    except Exception as e:
        print(f"   ❌ Error testing negative values: {e}")
        return False
    
    # 4. Test validation with zero values
    print("\n4. Testing validation with zero values...")
    
    try:
        zero_settings = {
            "confident_days": 7,
            "medium_days": 0,
            "wtf_days": 1
        }
        
        response = requests.put(f"{base_url}/api/settings", json=zero_settings)
        
        if response.status_code == 400:
            error_data = response.json()
            print(f"   ✅ Correct 400 response for zero values: {error_data['detail']}")
        else:
            print(f"   ❌ Expected 400, got {response.status_code}")
            return False
            
    except Exception as e:
        print(f"   ❌ Error testing zero values: {e}")
        return False
    
    # 5. Test validation with missing fields
    print("\n5. Testing validation with missing fields...")
    
    try:
        incomplete_settings = {
            "confident_days": 7,
            "medium_days": 3
            # missing wtf_days
        }
        
        response = requests.put(f"{base_url}/api/settings", json=incomplete_settings)
        
        if response.status_code == 422:  # FastAPI validation error
            error_data = response.json()
            print(f"   ✅ Correct 422 response for missing fields")
        else:
            print(f"   ❌ Expected 422, got {response.status_code}")
            return False
            
    except Exception as e:
        print(f"   ❌ Error testing missing fields: {e}")
        return False
    
    # 6. Test extreme but valid values
    print("\n6. Testing extreme but valid values...")
    
    try:
        extreme_settings = {
            "confident_days": 365,
            "medium_days": 180,
            "wtf_days": 1
        }
        
        response = requests.put(f"{base_url}/api/settings", json=extreme_settings)
        
        if response.status_code == 200:
            updated_settings = response.json()
            print(f"   ✅ Extreme values accepted: {updated_settings}")
        else:
            print(f"   ❌ Extreme values rejected: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"   ❌ Error testing extreme values: {e}")
        return False
    
    # 7. Restore original settings
    print("\n7. Restoring original settings...")
    
    try:
        restore_response = requests.put(f"{base_url}/api/settings", json=original_settings)
        
        if restore_response.status_code == 200:
            restored_settings = restore_response.json()
            print(f"   ✅ Original settings restored: {restored_settings}")
        else:
            print(f"   ⚠️ Could not restore original settings: {restore_response.status_code}")
            
    except Exception as e:
        print(f"   ⚠️ Error restoring original settings: {e}")
    
    print("\n🎉 All PUT /api/settings endpoint tests passed!")
    return True

if __name__ == "__main__":
    print("🚀 Starting PUT /api/settings endpoint tests...")
    print("💡 Make sure backend is running: docker-compose up backend")
    print("⏳ Waiting 3 seconds for you to start the backend...")
    time.sleep(3)
    
    success = test_settings_endpoint()
    sys.exit(0 if success else 1)