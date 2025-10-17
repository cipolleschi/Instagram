# Instagram App Network Removal Tasks

## Overview
This task list ensures the app remains functional after each step by building mock infrastructure first, then gradually replacing components, and finally removing unused dependencies.

## Task Execution Rules
- ✅ App must work after completing each task
- 🔄 Test the app before moving to the next task
- 📝 Mark tasks as completed when done
- ⚠️ If a task breaks the app, fix it before proceeding

---

## Phase 1: Build Mock Infrastructure (App remains working with real APIs)

### Task 1: Create Mock Data Files
**Duration**: 30 minutes  
**Status**: ✅ Completed

**Steps**:
1. Create `assets/data/users.json` with sample user profiles
2. Extend `assets/data/posts.json` with more complete data structure
3. Create `assets/data/likes.json` for like relationships
4. Add local sample images to `assets/images/posts/` and `assets/images/avatars/`

**Files to create**:
- `assets/data/users.json`
- `assets/data/likes.json` 
- `assets/images/posts/post1.jpg`, `post2.jpg`, etc.
- `assets/images/avatars/avatar1.jpg`, `avatar2.jpg`, etc.

**Test**: App should still work normally with Supabase (no changes to app logic yet)

---

### Task 2: Create Mock Authentication Service
**Duration**: 45 minutes  
**Status**: ✅ Completed

**Steps**:
1. Create `src/services/authService.ts` with mock authentication functions
2. Create `src/services/storageService.ts` for AsyncStorage utilities
3. Include functions: `mockLogin()`, `mockSignup()`, `mockLogout()`, `getCurrentUser()`
4. Use predefined users from `users.json`

**Files to create**:
- `src/services/authService.ts`
- `src/services/storageService.ts`

**Test**: App should still work normally (services created but not used yet)

---

### Task 3: Create Mock Post and Profile Services
**Duration**: 1 hour  
**Status**: ✅ Completed

**Steps**:
1. Create `src/services/postService.ts` for post CRUD operations
2. Create `src/services/profileService.ts` for profile management
3. Include functions for fetching, creating, updating posts and profiles
4. Use AsyncStorage for persistence and local JSON for initial data

**Files to create**:
- `src/services/postService.ts`
- `src/services/profileService.ts`

**Test**: App should still work normally (services created but not used yet)

---

## Phase 2: Replace Components Gradually (One component at a time)

### Task 4: Replace Authentication Provider
**Duration**: 1.5 hours  
**Status**: ✅ Completed

**Steps**:
1. Create backup of current `src/providers/AuthProvider.tsx`
2. Replace with mock authentication using `authService.ts`
3. Update context to work with mock users
4. Keep same interface so existing components don't break

**Files to modify**:
- `src/providers/AuthProvider.tsx`

**Test**: App should still work, users can log in with any credentials

---

### Task 5: Replace Authentication Screen
**Duration**: 45 minutes  
**Status**: ✅ Completed

**Steps**:
1. Update `src/app/(auth)/index.tsx` to use mock authentication
2. Remove Supabase auth calls, use `authService.mockLogin()`
3. Accept any email/password combination
4. Show success for any credentials

**Files to modify**:
- `src/app/(auth)/index.tsx`

**Test**: Login screen should work with any credentials

---

### Task 6: Replace Feed Screen
**Duration**: 1 hour  
**Status**: ✅ Completed

**Steps**:
1. Update `src/app/(tabs)/index.tsx` to use mock post service
2. Replace Supabase queries with `postService.getPosts()`
3. Load posts from local data and AsyncStorage
4. Keep same UI and functionality

**Files to modify**:
- `src/app/(tabs)/index.tsx`

**Test**: Feed should display posts from local data

---

### Task 7: Replace Post List Item (Remove Cloudinary)
**Duration**: 1.5 hours  
**Status**: ✅ Completed

**Steps**:
1. Update `src/components/PostListItem.tsx` to use local images
2. Replace Cloudinary avatar display with local images
3. Update like functionality to use local storage
4. Remove all Cloudinary imports and usage

**Files to modify**:
- `src/components/PostListItem.tsx`

**Test**: Posts should display with local images, likes should work locally

---

### Task 8: Replace Post Content Component
**Duration**: 45 minutes  
**Status**: ✅ Completed

**Steps**:
1. Update `src/components/PostContent.tsx` to use local media
2. Replace Cloudinary transformations with basic Image/Video components
3. Use local image URIs from assets folder

**Files to modify**:
- `src/components/PostContent.tsx`

**Test**: Post images and videos should display from local assets

---

### Task 9: Replace Profile Screen
**Duration**: 2 hours  
**Status**: ✅ Completed

**Steps**:
1. Update `src/app/(tabs)/profile.tsx` to use mock profile service
2. Remove Cloudinary avatar upload, use local image picker
3. Save profile updates to AsyncStorage
4. Remove Supabase profile queries

**Files to modify**:
- `src/app/(tabs)/profile.tsx`

**Test**: Profile screen should work with local data, avatar selection should work

---

### Task 10: Replace Post Creation Screen
**Duration**: 2 hours  
**Status**: ✅ Completed

**Steps**:
1. Update `src/app/(tabs)/new.tsx` to save posts locally
2. Remove Cloudinary upload, store images locally using file system
3. Save new posts to AsyncStorage using `postService`
4. Generate unique local post IDs

**Files to modify**:
- `src/app/(tabs)/new.tsx`

**Test**: Users should be able to create new posts that appear in the feed

---

### Task 11: Update Notifications (Remove External API)
**Duration**: 1 hour  
**Status**: ✅ Completed

**Steps**:
1. Update `src/utils/notifications.ts` to remove external API calls
2. Keep local notification triggering using Expo Notifications
3. Update `src/providers/NotificationProvider.tsx` to remove Supabase calls
4. Keep push notification registration for local use

**Files to modify**:
- `src/utils/notifications.ts`
- `src/providers/NotificationProvider.tsx`

**Test**: Like notifications should still work locally (no external API calls)

---

## Phase 3: Clean Up and Remove Dependencies

### Task 12: Remove Unused Library Files
**Duration**: 15 minutes  
**Status**: ✅ Completed

**Steps**:
1. Delete `src/lib/supabase.ts`
2. Delete `src/lib/cloudinary.ts`
3. Verify no imports reference these files

**Files to delete**:
- `src/lib/supabase.ts`
- `src/lib/cloudinary.ts`

**Test**: App should still work without these files

---

### Task 13: Remove External Dependencies
**Duration**: 30 minutes  
**Status**: ✅ Completed

**Steps**:
1. Remove `@supabase/supabase-js` from `package.json`
2. Remove `cloudinary-react-native` from `package.json`
3. Run `npm install` to clean up node_modules
4. Fix any remaining import errors

**Files to modify**:
- `package.json`

**Test**: App should build and run without external dependencies

---

### Task 14: Final Cleanup and Testing
**Duration**: 1 hour  
**Status**: ✅ Completed

**Steps**:
1. Remove any unused imports across all files
2. Test all app functionality:
   - Login/logout
   - View feed
   - Create posts
   - Like/unlike posts
   - Update profile
   - Receive notifications
3. Verify no network requests are made
4. Test app works completely offline

**Test**: Complete app functionality with zero network requests

---

## Validation Checklist

After completing all tasks, verify:

- [ ] App starts without network connection
- [ ] User can log in with any credentials
- [ ] Feed displays posts from local data
- [ ] User can create new posts (stored locally)
- [ ] User can like/unlike posts (stored locally)  
- [ ] User can update profile (stored locally)
- [ ] Local notifications work for likes
- [ ] All images/videos load from local assets
- [ ] No network requests in browser dev tools
- [ ] App works in airplane mode
- [ ] No external dependencies in package.json
- [ ] No unused imports or dead code

## Rollback Strategy

If any task breaks the app:

1. **Git checkout** to previous working state
2. **Identify the issue** - what broke?
3. **Fix incrementally** - make smaller changes
4. **Test frequently** - after each small change
5. **Commit working state** before proceeding

## Development Tips

- Commit after each completed task
- Test thoroughly before moving to next task
- Use feature flags if needed to gradually switch between real/mock services
- Keep browser dev tools open to monitor network requests
- Use React Native Flipper or similar for debugging AsyncStorage

## Estimated Total Time: 16-20 hours

**Breakdown by Phase**:
- Phase 1 (Mock Infrastructure): 2.5 hours
- Phase 2 (Component Replacement): 12 hours  
- Phase 3 (Cleanup): 1.5 hours
- Testing & Validation: 2 hours

This task-driven approach ensures you always have a working app while gradually removing all network dependencies!
