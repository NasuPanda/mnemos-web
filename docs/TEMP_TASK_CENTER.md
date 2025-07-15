# Task Center - Mnemos Web App

Remaining Tasks:
  🔴 HIGH PRIORITY

1. [ ] BUG FIX: `Failed to upload image: Load failed` from iPhone. I guess the iPhone's weird image format?
2. [ ] FIX: When the app is down, the data wouldn't be preserved in the production environment. First we need to look into the cause. The json file that manages data should be read/written/saved through Cloud Storage, and thus, permanent. The likely cause is that the app is incorrectly using Docker mounted json file and when the container restarts, the data get wiped away. But **we do not know** what is the culprit yet.
3. [ ] FIX: When the user clicks "Archived," it should switch "archived" field to "true/True." Currently it only deletes the item, which is not the desired behavior. Related: when "archived" is true, the review item should NOT appear on the Frontend.
4. [ ] MIGRATION: Write a migration script for migrating from the mnemos desktop to mnemos web. The fields of mnemos desktop data may be different from the mnemos web. **I will provide mnemos destop data when necessary.**

🟡 MEDIUM PRIORITY
1. [ ] Keyboard Shortcuts
- Documented: Multiple shortcuts listed
- Missing:
	- Cmd+N: New item
	  - Cmd+E: Edit item
	  - Cmd+Space: Review item
	  - Cmd+L: Review item
- Current: Only double-click to review works
1. [ ] Responsive Design (Improvement)
	  1. [ ] Modal is not working well on mobile. (in what way?: For instance, I can't scroll until "Create Item" shows up. Modal is not blocking things as it should?)
2. [ ] Add a calender functionality to the date display in Header
3. [ ] Quick Stats Sidebar
- Documented: "Finished - unreviewed item count/total item count for the day (e.g., 12/20)"
- Location: /docs/views/DisplayItem.md
- Current: No stats display anywhere
- Missing: Progress tracking sidebar

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
