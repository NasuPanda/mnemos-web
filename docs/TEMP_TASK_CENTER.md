# Task Center - Mnemos Web App

Remaining Tasks:
  🔴 HIGH PRIORITY

1. [x] BUG FIX: `Failed to upload image: Load failed` from iPhone. I guess the iPhone's weird image format?
2. [x] FIX: When the app is down, the data wouldn't be preserved in the production environment. First we need to look into the cause. The json file that manages data should be read/written/saved through Cloud Storage, and thus, permanent. The likely cause is that the app is incorrectly using Docker mounted json file and when the container restarts, the data get wiped away. But **we do not know** what is the culprit yet.
3. [x] Archive
   1. [x] FIX: When the user clicks "Archived," it should switch "archived" field to "true/True." Currently it only deletes the item, which is not the desired behavior. Related: when "archived" is true, the review item should NOT appear on the Frontend.
   2. [x] Confirmation dialog & Success toast
4. [x] MIGRATION: Write a migration script for migrating data from the mnemos desktop to mnemos web. First understand the structure of `_MNEMOS_DESTOP_DATA.json`. List `section` field, which correspond to our current `category` field.
5. [x] FIX: Implement Global Exception Handlers (PRODUCTION STABILITY)
   1. [x] **CRITICAL**: Prevent any unhandled exceptions from crashing the entire service
   2. [x] Implement FastAPI global exception handler to catch all unhandled errors
   3. [x] Add middleware-level error boundary for request-level error handling
   4. [x] Log errors for debugging while keeping service alive
   5. [x] Return user-friendly error messages instead of 502 Bad Gateway
   6. [x] Test error handling with various failure scenarios
6. [x] FIX: Cloud Run Cloudinary Environment Variables Missing
   1. [x] **HIGH**: Backend crashes when creating items with images (after global handlers)
   2. [x] Root cause: "Cloudinary credentials not found in environment variables"
   3. [x] Missing env vars: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
   4. [x] Solution: Add Cloudinary env vars to Cloud Run deployment
   5. [x] Expected result: Service stays alive, shows "Image upload unavailable" error
6. [x] `Reviewed` status:
	1. [x] `reviewed = true + review data = today` should be checked. Otherwise it shouldn't be.
	2. [x] `reviewed`should be reset to false when the review data = today.
8. [x] It's unclear what "image" button represents. Currently it displays either "image" or the number of images, like "2" or "5" It should be "show problem image(s)."
9. [x] Display "problem image(s)" only when an item has problem images. Currently it displays "problem image(s)" when it only has "**answer** image(s)," which is not how it is supposed to work.
10. [x] Display "review history" on "Review item" modal. That is, list the past review dates as a list of bullet points. The size of modal should adjust according to the amount/size of the content.
11. [x] The vertical positions of the contents (review history, buttons, ...) of "Review Item" modal are not adjusted according to the size/amount of the content as it should be. It comes out of the modal and looks off. The size of the modal should be more flexible. Plus, consider mobile UX too.
13. [x] FIX: Backend Auto-Shutdown Issue (Production Stability)
    **Problem**: Cloud Run auto-shuts down idle instances + 3-minute startup = 502 errors for users
    **Root Cause**: Slow Cloud Storage initialization blocks service startup for 3+ minutes
    **Impact**: Users get 502 errors when service restarts after idle periods

    **Phase 1: Core Backend Fixes (Critical)**
    1. [x] Add service state tracking to data_service.py
        - Add global flags for service readiness (`_service_ready`, `_data_loading`)
        - Add helper functions (`is_data_ready()`, `initialize_default_data()`)
        - Add background loading function

    2. [x] Implement non-blocking startup in main.py
        - Change startup event to be non-blocking (start with default data)
        - Add background task for real data loading (`asyncio.create_task()`)
        - Add basic health check endpoint (`/health`)

    3. [x] Add route protection to prevent 502 errors
        - Add readiness checks to main API routes (`/api/items`, `/api/data`)
        - Return 503 "Service starting" instead of 502 during startup

    **Phase 2: Frontend Resilience (Important)**
    4. [x] Add basic retry logic to API calls
        - Handle 503 responses with simple retry mechanism
        - Add timeout and error handling

    5. [x] Add loading state indicators
        - Show "service starting" message when appropriate
        - Improve user experience during startup
14. [x] Add "Review" button to the review item **only for mobile**.
15. [ ] FEATURE: Category Management in Settings Modal
    **Problem**: Currently no way to manually add/delete categories without creating items
    **Solution**: Extend Settings modal with tabs for Review Intervals and Category Management

    **Phase 1: Backend API Foundation (Critical)**
    1. [x] Create category management API endpoints
        - POST /api/categories (add new category)
        - DELETE /api/categories/{name} (delete category)
        - PUT /api/categories/{old_name} (rename category)
        - Add validation: no duplicates, no empty names, no reserved names

    2. [x] Add category deletion safety checks
        - Check if category is in use before allowing deletion
        - Return proper error messages for conflicts
        - Handle data consistency (what happens to items if category deleted)

    **Phase 2: Frontend Tab Structure (Important)**
    3. [x] Design and implement tabbed Settings modal
        - Add tab navigation (Review Intervals | Categories)
        - Maintain responsive design consistency
        - Preserve existing review intervals functionality

    4. [x] Create Categories tab UI
        - List all existing categories
        - Add "Add Category" input field and button
        - Add delete button for each category
        - Add rename functionality (inline editing)

    **Phase 3: Integration and Data Flow (Important)**
    5. [x] Connect frontend to backend APIs
        - Implement category add/delete/rename functions
        - Add loading states for all operations
        - Ensure real-time updates to category list

    6. [ ] Integrate with existing category system
        - Update NewItemModal dropdown immediately after changes
        - Maintain auto-add behavior for backward compatibility
        - Ensure category changes persist across app reload

    **Phase 4: Error Handling and Polish (Nice to have)**
    7. [ ] Add comprehensive error handling
        - Network errors, validation errors, conflicts
        - User-friendly error messages
        - Graceful degradation if API fails

    8. [ ] End-to-end testing
        - Test add/delete/rename operations
        - Verify NewItemModal integration
        - Test error scenarios and edge cases

    **Success Criteria**:
    - Users can add new categories via Settings modal
    - Users can delete unused categories with safety checks
    - Users can rename categories with items updating accordingly
    - Category changes reflect immediately in NewItemModal dropdown
    - No data loss or inconsistency during category operations
16. [ ] Quick Stats Sidebar
    - Documented: "Finished - unreviewed item count/total item count for the day (e.g., 12/20)"
    - Location: /docs/views/DisplayItem.md
    - Current: No stats display anywhere
    - Missing: Progress tracking sidebar
17. [ ] Display the difference between today (review date) and the last review date (if any) to help the user decide the next review date
18. [ ] Toast for "new item," "update item."
19. [ ] Display `side note` on review items
20.  [ ] Responsive Design (Improvement)
	  1. [ ] Modal is not working well on mobile. (in what way?: I can't scroll until "Create Item" shows up on "New item" modal. The vertical arrangement of the items is too tight.)
21. [ ] Keyboard Shortcuts
Current: Only double-click to review works
Missing:
- Cmd+N: New item
- Cmd+E: Edit item
- Cmd+Space: Review item


---

**IGNORE BELOW**

---


## Status
✅ **Frontend:** Responsive design, modal scroll fix
✅ **Backend:** 9/9 endpoints working, modular architecture
✅ **Integration:** Frontend-Backend fully connected (production + development)
✅ **Images:** Cloudinary integration working in production

## Tasks

### **CRITICAL**

#### **Task 0: Cloud Run 502 Error Fix**
**Status**: ✅ **COMPLETE**

**Problem**: FastAPI backend not starting in Cloud Run, causing 502 Bad Gateway errors for all API endpoints.

**Root Cause**: Environment variable `DATA_FILE=/app/data/mnemos_data.json` points to non-existent file in container.

**Evidence**:
- ✅ Backend works locally when data file is properly mounted
- ✅ `/api/items` returns data when file exists, `[]` when missing
- ❌ No FastAPI startup logs in Cloud Run (crashes immediately on startup)
- ❌ Nginx shows "connect() failed (111: Connection refused)" when trying to proxy to FastAPI

**Immediate Fix Required**:
- [x] **LOCAL ENVIRONMENTS FIXED**: Moved data file to project root and updated config
- [x] Test local development: FastAPI loads data from `../data/mnemos_data.json`
- [x] Test docker-compose: Volume mount provides data file, API returns actual data
- [ ] **NEXT PHASE**: Implement Cloud Storage persistence for production data
- [ ] Test Cloud Run deployment to verify FastAPI starts successfully

**Important Notes**:
- ⚠️ **Data Loss Risk**: This fix will cause user-created items to be lost on container restarts
- ⚠️ **Temporary Solution**: Container includes initial data but doesn't persist changes
- ✅ **Gets App Working**: Allows immediate testing of all other functionality
- 🔄 **Future Task**: Implement Cloud Storage persistence for permanent data storage

**Success Criteria**:
- [x] ✅ **LOCAL DEV**: FastAPI starts and loads data from `../data/mnemos_data.json`
- [x] ✅ **DOCKER COMPOSE**: Backend API returns actual data, frontend accessible
- [x] ✅ **CLOUD RUN**: FastAPI starts successfully (visible in logs)
- [x] ✅ **CLOUD RUN**: All API endpoints return data instead of 502 errors
- [x] ✅ **CLOUD RUN**: Frontend can load categories and items from production API

**Local Environment Changes Made**:
- 📁 **File location**: Moved `backend/data/mnemos_data.json` → `data/mnemos_data.json`
- ⚙️ **Config update**: `DATA_FILE = os.getenv("DATA_FILE", "../data/mnemos_data.json")`
- 🐳 **Docker Compose**: Works with existing volume mount `./data:/app/data`
- ✅ **Verification**: Both local development and docker-compose load actual data

---

#### **Task 0.5: Cloud Storage Implementation (Production Data Persistence)**
**Status**: ✅ **IMPLEMENTATION COMPLETE**

**Objective**: Implement Cloud Storage for JSON data persistence to eliminate data loss in Cloud Run production environment.

**Architecture**: Async writes with memory cache for optimal performance
- **Reads**: Serve from memory cache (~10ms response time)
- **Writes**: Update memory immediately + async save to Cloud Storage (~20ms response time)
- **Startup**: Load from Cloud Storage with fallback to empty data
- **Error handling**: Graceful degradation when Storage unavailable

**Implementation Plan**:

**Phase 1: Storage Service Layer** ✅ **COMPLETE**
- [x] Create `backend/services/storage_service.py` with `CloudStorageService` class
- [x] Implement `async download_json(filename: str) -> dict` method
- [x] Implement `async upload_json(filename: str, data: dict)` method
- [x] Add `is_available() -> bool` health check method

**Phase 2: Data Service Integration** ✅ **COMPLETE**
- [x] Update `backend/services/data_service.py` to use memory cache
- [x] Modify `load_data()`: Try Cloud Storage first, fallback to local file
- [x] Modify `save_data()`: Update memory + async Cloud Storage upload
- [x] Implement global `cached_data` variable for memory storage

**Phase 3: Environment Configuration** ✅ **COMPLETE**
- [x] Add Cloud Storage dependencies to `requirements.txt`: `google-cloud-storage>=2.10.0`
- [x] Create Cloud Storage bucket: `gs://mnemos-data-bucket`
- [x] Upload initial `data/mnemos_data.json` to bucket
- [x] Add environment variables to Docker Compose for testing

**Phase 4: Cloud Run Integration** ✅ **COMPLETE**
- [x] Update `cloudbuild.yaml` with Cloud Storage environment variables
- [x] Configure service account permissions for Cloud Storage access
- [x] Create and populate Cloud Storage bucket
- [x] Ready for deployment to Cloud Run with Cloud Storage integration

**Testing Strategy**:

**Phase 1: Local Async Testing (File-Based)** ✅ **COMPLETE**
- [x] Create `FileStorageService` that simulates Cloud Storage with local files
- [x] Implement async pattern writing to `test_storage/` directory
- [x] Test async write performance: API response <30ms ✅ (Target: <50ms)
- [x] Test memory cache consistency: POST → immediate GET shows new data ✅
- [x] Test failure simulation: Storage unavailable, app continues working ✅
- [x] Test restart simulation: POST → restart → GET loads from storage ✅

**Phase 2: Cloud Storage Testing** ✅ **COMPLETE**
- [x] Create test bucket: `gs://mnemos-data-bucket`
- [x] Swap storage backend from file-based to Cloud Storage
- [x] Run same test suite with real Cloud Storage (159ms write performance)
- [x] Test IAM permissions and authentication ✅
- [x] Verify data persistence in local environment ✅

**Data Flow**:
1. **Container starts** → Try Cloud Storage → Cache in memory → Fallback to local if needed
2. **API reads** → Serve from memory cache (10ms response)
3. **API writes** → Update memory + fire-and-forget async save (20ms response)
4. **Container restarts** → Load latest data from Cloud Storage

**Error Handling Strategy**:
- Storage unavailable → App works in "local mode" with logging
- Async save fails → Log warning, continue (next save includes changes)
- No degradation of user experience for temporary Storage issues

**Success Criteria**:
- [x] API write operations complete in <50ms ✅ (Achieved: <30ms)
- [x] Memory cache provides instant read performance ✅
- [x] App remains functional when Cloud Storage temporarily unavailable ✅
- [x] Zero data loss during normal operations ✅
- [x] Free tier usage (within 5GB storage, 50K reads, 5K writes per month) ✅
- [x] **COMPLETE**: All Cloud Storage configuration ready for production deployment

#### **Task 0.6: Frontend Volume Mount Fix**
**Status**: ✅ **COMPLETE**

**Problem**: Frontend container failing with esbuild version mismatch error after implementing Cloud Storage.

**Root Cause**: Docker Compose volume mount `./frontend:/app` was overriding container's node_modules, causing host esbuild (0.25.5) to conflict with container esbuild (0.25.6).

**Solution**: Changed from anonymous volume to named volume for node_modules isolation:
```yaml
volumes:
  - ./frontend:/app
  - frontend_node_modules:/app/node_modules  # Named volume prevents host override
```

**Result**: Frontend now runs successfully in Docker Compose with hot reload working.

---

#### **Task 1: Frontend-Backend Integration**
**Status**: ✅ **COMPLETE**
- [x] Create API service layer in frontend
- [x] Replace DUMMY_ITEMS with GET /api/items calls
- [x] Connect create/edit/delete operations to backend
- [x] Update settings to use PUT /api/settings
- [x] Fix data persistence (no page refresh data loss)
- [x] Categories loading properly in both development and production

#### **Task 2: Spaced Repetition Logic**
**Status**: ❌ **NOT IMPLEMENTED**
- [x] Implement review date calculation - add XX day(s) to the reviewed date and actually update next_review_date
- [x] Date-based filtering (only show items due on selected date)
- [x] Connect confidence buttons to review scheduling

### **HIGH PRIORITY**

#### **Task 3: Multiple Image Management**
**Status**: ✅ **COMPLETE**
- [x] Update backend data model to support image arrays (problem_images, answer_images)
- [x] Fix API transformation layer to handle multiple images properly
- [x] Test complete upload-to-display workflow
- [x] Verify image persistence across sessions
- [x] Cloudinary integration working in production
- [x] Frontend API base URL working for both development and production environments

#### **Task 4: Review Progression System**
- [x] Connect review buttons to backend API
- [x] Update item status after review
- [x] Handle custom review dates

### **REMAINING TASKS**

#### **Task 5: Keyboard Shortcuts**
- [ ] Cmd+N for new item creation
- [ ] Space key for show answer
- [ ] Enter key to submit review responses
- [ ] Esc key to close modals
- [ ] Double-click to review item

#### **Task 6: Progress Tracking**
- [ ] Show statistics of reviewed vs unreviewed items
- [ ] Display progress indicators in UI
- [ ] Track review streaks or completion rates

#### **Task 7: Polish & User Experience**
- [ ] Advanced touch gestures
- [ ] Performance optimizations
- [ ] Error handling and loading states
- [ ] Improved responsive design
- [ ] Better accessibility features

## Completion Criteria

### **Phase 1: Make It Work**
- [x] Frontend disconnected from DUMMY_ITEMS
- [x] All CRUD operations through backend API
- [x] Review dates calculated based on confidence
- [x] Date filtering shows only relevant items
- [x] Image upload and viewing work end-to-end

### **Phase 2: Core Features**
- [x] Spaced repetition scheduling implemented
- [ ] Progress tracking working
- [x] Multiple image management working
- [ ] Essential keyboard shortcuts implemented

### **Phase 3: Polish**
- [ ] Advanced touch gestures
- [ ] Performance optimizations
- [ ] Error handling and loading states
- [ ] Improved responsive design
- [ ] Better accessibility features

## Manual Testing - Task 1: Frontend-Backend Integration

### **Essential Tests**
- [x] **Data loads**: Page shows items from API, not DUMMY_ITEMS
- [x] **Create item**: Add new item → appears immediately + survives refresh
- [x] **Edit item**: Change item → updates immediately + survives refresh
- [x] **Delete item**: Remove item → disappears immediately + gone after refresh
- [x] **Settings**: Change settings → persist after page refresh
- [x] **Categories**: New categories appear in dropdown

### **Success Criteria**
- [x] No DUMMY_ITEMS in frontend
- [x] All CRUD operations work through API
- [x] Data survives page refresh
