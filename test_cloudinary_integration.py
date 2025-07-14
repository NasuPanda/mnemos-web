#!/usr/bin/env python3
"""
Comprehensive test script for Cloudinary integration in Mnemos Web App

Tests:
1. API endpoints with Cloudinary URLs
2. Image upload functionality 
3. Image accessibility via Cloudinary CDN
4. Frontend-backend integration
5. Responsive image URL generation
6. Free tier optimization features
"""

import requests
import json
import base64
import time
import re
from typing import Dict, List, Optional

# Configuration
BASE_URL = "http://localhost:8000"
FRONTEND_URL = "http://localhost:3000"

class CloudinaryIntegrationTester:
    def __init__(self):
        self.passed_tests = 0
        self.failed_tests = 0
        self.test_results = []

    def log_test(self, test_name: str, passed: bool, details: str = ""):
        """Log test result"""
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"    {details}")
        
        self.test_results.append({
            "test": test_name,
            "passed": passed,
            "details": details
        })
        
        if passed:
            self.passed_tests += 1
        else:
            self.failed_tests += 1

    def test_backend_health(self) -> bool:
        """Test if backend is running"""
        try:
            response = requests.get(f"{BASE_URL}/api/items", timeout=5)
            return response.status_code == 200
        except:
            return False

    def test_frontend_health(self) -> bool:
        """Test if frontend is running"""
        try:
            response = requests.get(FRONTEND_URL, timeout=5)
            return response.status_code == 200
        except:
            return False

    def test_api_returns_cloudinary_urls(self):
        """Test that API returns items with Cloudinary URLs"""
        try:
            response = requests.get(f"{BASE_URL}/api/items")
            items = response.json()
            
            cloudinary_found = False
            cloudinary_count = 0
            
            for item in items:
                # Check problem_images
                if item.get('problem_images'):
                    for img_url in item['problem_images']:
                        if 'res.cloudinary.com' in str(img_url):
                            cloudinary_found = True
                            cloudinary_count += 1
                
                # Check answer_images  
                if item.get('answer_images'):
                    for img_url in item['answer_images']:
                        if 'res.cloudinary.com' in str(img_url):
                            cloudinary_found = True
                            cloudinary_count += 1
            
            self.log_test("API returns Cloudinary URLs", cloudinary_found, 
                         f"Found {cloudinary_count} Cloudinary URLs in items")
            return cloudinary_found
            
        except Exception as e:
            self.log_test("API returns Cloudinary URLs", False, f"Error: {str(e)}")
            return False

    def test_cloudinary_image_accessibility(self):
        """Test that Cloudinary images are accessible"""
        try:
            response = requests.get(f"{BASE_URL}/api/items")
            items = response.json()
            
            cloudinary_urls = []
            for item in items:
                if item.get('problem_images'):
                    cloudinary_urls.extend([url for url in item['problem_images'] if 'res.cloudinary.com' in str(url)])
                if item.get('answer_images'):
                    cloudinary_urls.extend([url for url in item['answer_images'] if 'res.cloudinary.com' in str(url)])
            
            if not cloudinary_urls:
                self.log_test("Cloudinary image accessibility", False, "No Cloudinary URLs found to test")
                return False
            
            accessible_count = 0
            for url in cloudinary_urls[:3]:  # Test first 3 URLs
                try:
                    img_response = requests.head(url, timeout=10)
                    if img_response.status_code == 200:
                        accessible_count += 1
                except:
                    pass
            
            success = accessible_count > 0
            self.log_test("Cloudinary image accessibility", success,
                         f"{accessible_count}/{min(3, len(cloudinary_urls))} images accessible")
            return success
            
        except Exception as e:
            self.log_test("Cloudinary image accessibility", False, f"Error: {str(e)}")
            return False

    def test_image_upload(self):
        """Test image upload functionality"""
        try:
            # Create a small test image (1x1 PNG)
            test_image_data = base64.b64decode(
                "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
            )
            
            files = {'file': ('test_upload.png', test_image_data, 'image/png')}
            response = requests.post(f"{BASE_URL}/api/upload-image", files=files, timeout=15)
            
            if response.status_code == 200:
                result = response.json()
                image_path = result.get('image_path', '')
                
                if 'res.cloudinary.com' in image_path:
                    # Test if uploaded image is accessible
                    img_response = requests.head(image_path, timeout=10)
                    accessible = img_response.status_code == 200
                    
                    self.log_test("Image upload to Cloudinary", accessible,
                                 f"Uploaded to: {image_path}")
                    return accessible
                else:
                    self.log_test("Image upload to Cloudinary", False,
                                 f"Upload succeeded but not to Cloudinary: {image_path}")
                    return False
            else:
                self.log_test("Image upload to Cloudinary", False,
                             f"Upload failed: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Image upload to Cloudinary", False, f"Error: {str(e)}")
            return False

    def test_optimization_features(self):
        """Test that uploaded images have optimization features"""
        try:
            response = requests.get(f"{BASE_URL}/api/items")
            items = response.json()
            
            cloudinary_urls = []
            for item in items:
                if item.get('problem_images'):
                    cloudinary_urls.extend([url for url in item['problem_images'] if 'res.cloudinary.com' in str(url)])
            
            if not cloudinary_urls:
                self.log_test("Optimization features", False, "No Cloudinary URLs to test")
                return False
            
            test_url = cloudinary_urls[0]
            
            # Test responsive URL generation (simulate backend function)
            optimization_tests = {
                "Original URL": test_url,
                "Card size": test_url.replace("/upload/", "/upload/w_400,h_400,c_fit,q_auto:good,f_auto/"),
                "Modal size": test_url.replace("/upload/", "/upload/w_800,h_800,c_fit,q_auto:good,f_auto/"),
                "Thumbnail": test_url.replace("/upload/", "/upload/w_200,h_200,c_fill,q_auto:low,f_auto/")
            }
            
            accessible_optimized = 0
            for name, url in optimization_tests.items():
                try:
                    response = requests.head(url, timeout=8)
                    if response.status_code == 200:
                        accessible_optimized += 1
                except:
                    pass
            
            success = accessible_optimized >= 3  # At least 3 optimized versions work
            self.log_test("Optimization features", success,
                         f"{accessible_optimized}/4 optimized versions accessible")
            return success
            
        except Exception as e:
            self.log_test("Optimization features", False, f"Error: {str(e)}")
            return False

    def test_file_size_validation(self):
        """Test that file size validation works"""
        try:
            # Create a large fake file (simulate 6MB)
            large_data = b"x" * (6 * 1024 * 1024)
            files = {'file': ('large_test.png', large_data, 'image/png')}
            
            response = requests.post(f"{BASE_URL}/api/upload-image", files=files, timeout=10)
            
            # Should fail with 400 or 413 status
            size_validation_works = response.status_code in [400, 413, 422]
            
            self.log_test("File size validation", size_validation_works,
                         f"Large file rejected with status {response.status_code}")
            return size_validation_works
            
        except Exception as e:
            self.log_test("File size validation", False, f"Error: {str(e)}")
            return False

    def test_environment_configuration(self):
        """Test that Cloudinary environment is properly configured"""
        try:
            # Create a minimal test to see if Cloudinary is configured
            test_image_data = base64.b64decode(
                "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
            )
            
            files = {'file': ('env_test.png', test_image_data, 'image/png')}
            response = requests.post(f"{BASE_URL}/api/upload-image", files=files, timeout=15)
            
            if response.status_code == 200:
                result = response.json()
                image_path = result.get('image_path', '')
                
                # Check if it's a Cloudinary URL (not local fallback)
                is_cloudinary = 'res.cloudinary.com' in image_path and 'ddwecvjjj' in image_path
                
                self.log_test("Environment configuration", is_cloudinary,
                             "Cloudinary credentials properly configured" if is_cloudinary 
                             else "Falling back to local storage - check env vars")
                return is_cloudinary
            else:
                self.log_test("Environment configuration", False,
                             f"Upload failed: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Environment configuration", False, f"Error: {str(e)}")
            return False

    def run_all_tests(self):
        """Run all tests and provide summary"""
        print("🌩️  Cloudinary Integration Test Suite")
        print("=" * 50)
        
        # Health checks first
        print("\n📋 Health Checks:")
        backend_healthy = self.test_backend_health()
        self.log_test("Backend health", backend_healthy, 
                     "Backend API responding" if backend_healthy else "Backend not responding")
        
        frontend_healthy = self.test_frontend_health()
        self.log_test("Frontend health", frontend_healthy,
                     "Frontend responding" if frontend_healthy else "Frontend not responding")
        
        if not backend_healthy:
            print("\n❌ Backend not available. Cannot run integration tests.")
            return
        
        # Core functionality tests
        print("\n🧪 Core Integration Tests:")
        self.test_environment_configuration()
        self.test_api_returns_cloudinary_urls()
        self.test_cloudinary_image_accessibility()
        self.test_image_upload()
        
        # Advanced feature tests
        print("\n⚡ Advanced Feature Tests:")
        self.test_optimization_features()
        self.test_file_size_validation()
        
        # Summary
        print(f"\n📊 Test Summary:")
        print(f"   ✅ Passed: {self.passed_tests}")
        print(f"   ❌ Failed: {self.failed_tests}")
        print(f"   📈 Success Rate: {(self.passed_tests/(self.passed_tests + self.failed_tests)*100):.1f}%")
        
        if self.failed_tests == 0:
            print("\n🎉 ALL TESTS PASSED! Cloudinary integration is working perfectly.")
            print("   🌍 Images are served globally via Cloudinary CDN")
            print("   💰 Using FREE tier optimization for maximum efficiency")
            print("   🚀 Ready for production deployment!")
        else:
            print(f"\n⚠️  {self.failed_tests} test(s) failed. Review the issues above.")
            
        return self.failed_tests == 0

if __name__ == "__main__":
    tester = CloudinaryIntegrationTester()
    success = tester.run_all_tests()
    exit(0 if success else 1)