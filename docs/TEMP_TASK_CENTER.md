# Task Center - Mnemos Web App

## Status
✅ **Frontend:** Responsive design, modal scroll fix
✅ **Backend:** 9/9 endpoints working, modular architecture
❌ **Integration:** Frontend uses DUMMY_ITEMS
❌ **Core Logic:** Spaced repetition not implemented
❌ **Images:** Upload/display disconnected

## Tasks

### **CRITICAL**

#### **Task 1: Frontend-Backend Integration**
- [x] Create API service layer in frontend
- [x] Replace DUMMY_ITEMS with GET /api/items calls
- [x] Connect create/edit/delete operations to backend
- [x] Update settings to use PUT /api/settings
- [x] Fix data persistence (no page refresh data loss)
- [x] **BUG**: Categories not loading properly - only "Vocabulary" shows in dropdown despite JSON having "Calculus 1", "Vocabulary", "Default"

#### **Task 2: Spaced Repetition Logic**
- [x] Implement review date calculation - add XX day(s) to the reviewed date and actually update next_review_date
- [x] Date-based filtering (only show items due on selected date)
- [x] Connect confidence buttons to review scheduling

### **HIGH PRIORITY**

#### **Task 3: Multiple Image Management**
- [x] Update backend data model to support image arrays (problem_images, answer_images)
- [x] Fix API transformation layer to handle multiple images properly
- [x] Test complete upload-to-display workflow
- [x] Verify image persistence across sessions
- [ ] **CRITICAL**: Fix production image storage using Cloudinary (images lost on container restart)
- [ ] Implement Cloudinary integration for image uploads
- [ ] Normalize all existing image paths to proper format
- [ ] Fix frontend API base URL for production environment

#### **Task 4: Review Progression System**
- [ ] Connect review buttons to backend API
- [ ] Update item status after review
- [ ] Show progress statistics (reviewed vs unreviewed)
- [ ] Handle custom review dates

#### **Task 5: Date Navigation Workflow**
- [ ] Add a calender functionality to the date display in Header

### **MEDIUM PRIORITY**

#### **Task 6: Keyboard Shortcuts**
- [ ] Cmd+N for new item creation
- [ ] Space key for show answer
- [ ] Enter key to submit review responses
- [ ] Esc key to close modals
- [ ] Double-click to review item

## Completion Criteria

### **Phase 1: Make It Work**
- [ ] Frontend disconnected from DUMMY_ITEMS
- [ ] All CRUD operations through backend API
- [ ] Review dates calculated based on confidence
- [ ] Date filtering shows only relevant items
- [ ] Image upload and viewing work end-to-end

### **Phase 2: Core Features**
- [ ] Spaced repetition scheduling implemented
- [ ] Progress tracking working
- [ ] Multiple image management working
- [ ] Essential keyboard shortcuts implemented

### **Phase 3: Polish**
- [ ] Advanced touch gestures
- [ ] Performance optimizations
- [ ] Error handling and loading states

## Manual Testing - Task 1: Frontend-Backend Integration

### **Essential Tests**
- [ ] **Data loads**: Page shows items from API, not DUMMY_ITEMS
- [ ] **Create item**: Add new item → appears immediately + survives refresh
- [ ] **Edit item**: Change item → updates immediately + survives refresh
- [ ] **Delete item**: Remove item → disappears immediately + gone after refresh
- [ ] **Settings**: Change settings → persist after page refresh
- [ ] **Categories**: New categories appear in dropdown

### **Success Criteria**
- [ ] No DUMMY_ITEMS in frontend
- [ ] All CRUD operations work through API
- [ ] Data survives page refresh

## Manual Testing - Task 3: Multiple Image Management

### **Essential Tests**

#### **Image Upload Tests**
- [ ] **Upload single image**: Select 1 image → appears in preview → save item → image persists after refresh
- [ ] **Upload multiple images**: Select 3+ images → all appear in preview → save item → all images persist after refresh
- [ ] **Drag and drop**: Drag images from file explorer → appear in preview → save successfully
- [ ] **Clipboard paste**: Copy image (Ctrl/Cmd+C) → paste in modal (Ctrl/Cmd+V) → appears in preview → saves correctly
- [ ] **Mixed upload methods**: Upload via file picker + drag/drop + clipboard in same item → all images save

#### **Image Management Tests**
- [ ] **Remove individual image**: Click X on specific image → only that image removed from preview → save → other images persist
- [ ] **Clear all images**: Click "Clear All" → all images removed from preview → save → no images in saved item
- [ ] **Edit existing item**: Open item with images → add new images → remove some old images → save → changes persist

#### **Image Display Tests**
- [ ] **ItemCard image count**: Items show correct image count badge (e.g., "3 images")
- [ ] **Modal image viewing**: Click on item → ShowAnswerModal shows separate problem/answer image sections with counts
- [ ] **Full-screen viewer**: Click image in modal → ImageViewerModal opens → scroll through all images → ESC/click-outside closes
- [ ] **Multiple image sections**: Item with both problem and answer images → both sections display correctly

#### **Backend Integration Tests**
- [ ] **API persistence**: Upload images → check backend JSON → image paths saved as arrays not single strings
- [ ] **File storage**: Upload images → check `/backend/data/images/` → files exist with UUID names
- [ ] **Cross-session**: Upload images → close browser → reopen → images still display correctly

#### **Error Handling Tests**
- [ ] **Invalid file types**: Try to upload .txt file → error message shown → upload rejected
- [ ] **Large files**: Upload >10MB image → error message → upload rejected
- [ ] **Missing images**: Manually delete image file from server → item still loads without errors

### **Success Criteria**
- [ ] Multiple images upload and save correctly
- [ ] Images persist across page refreshes and browser sessions
- [ ] Image management (add/remove) works in edit mode
- [ ] All image display components show correct counts and images
- [ ] Backend stores image arrays, not single strings
- [ ] No broken image links or 404 errors

## Bug Fix - Task 3: Image Path Inconsistency

### **Issue**
Images not displaying properly in browser due to inconsistent path formats in JSON data.

### **Problem Analysis**
Two different image path formats exist in `mnemos_data.json`:

**✅ Working format (new items):**
```json
"problem_images": ["/images/b7c0641f-853a-4594-b684-c35a392c6583.png"]
```

**❌ Broken format (older items):**
```json
"problem_images": ["1d759c84-2981-4abc-afd7-1f4970f068cb.jpeg"]
```

### **Root Cause**
- Upload endpoint returns correct format: `/images/uuid.ext`
- Manual test data and migration used filename-only format
- Frontend expects consistent URL paths for `<img src={}>`
- **Development**: Filename-only paths resolve to `http://localhost:3000/filename.jpg` instead of `http://localhost:8000/images/filename.jpg`
- **Production**: Filename-only paths resolve to `https://mnemos-web-w7al5cdjra-uc.a.run.app/filename.jpg` instead of `https://mnemos-web-w7al5cdjra-uc.a.run.app/images/filename.jpg`

### **Production Environment Impact**
- **API Base URL Issue**: Frontend hardcoded to `localhost:8000` won't work in production
- **Image Serving**: Production uses nginx → FastAPI proxy for `/images/` but frontend still calls wrong URLs
- **Cloud Run URL**: https://mnemos-web-w7al5cdjra-uc.a.run.app/

### **Fix Required**
- [ ] **URGENT**: Implement Cloudinary integration to prevent image loss in production
- [ ] Add Cloudinary Python SDK to backend dependencies
- [ ] Create Cloudinary upload service with environment configuration
- [ ] Update upload endpoint to use Cloudinary instead of local storage
- [ ] Normalize all image paths in JSON to Cloudinary URLs
- [ ] Fix frontend API base URL for production (use relative URLs or environment config)
- [ ] Test image display in both development and production environments
- [ ] Verify image persistence after Cloud Run container restarts
