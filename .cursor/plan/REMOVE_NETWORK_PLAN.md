# Instagram App Network Removal Plan

## Overview
This plan outlines the complete removal of all network requests and external dependencies from the Instagram clone app, replacing them with local mock data and simplified functionality.

## Current Network Dependencies

### 1. Supabase Dependencies
- **Authentication**: User login/signup, session management
- **Database**: Posts, profiles, likes, push tokens
- **Real-time**: Auth state changes, auto-refresh
- **Files affected**: 11 components/files

### 2. Cloudinary Dependencies
- **Image/Video Upload**: New post creation, profile avatar updates
- **Image/Video Display**: Post content rendering, avatar display with transformations
- **Files affected**: 5 components/files

### 3. Push Notifications (KEEP - Modified)
- **Keep**: Local Expo notifications for user experience
- **Remove**: External push API calls and token saving to Supabase
- **Modify**: Use local notifications only, no network requests

## Detailed Removal Plan

### Phase 1: Remove External Dependencies

#### 1.1 Remove Supabase
**Files to modify:**
- `package.json` - Remove `@supabase/supabase-js` dependency
- `src/lib/supabase.ts` - Delete entire file
- `src/providers/AuthProvider.tsx` - Replace with mock auth
- `src/app/(auth)/index.tsx` - Replace with mock login
- `src/app/(tabs)/index.tsx` - Replace with local data
- `src/app/(tabs)/new.tsx` - Replace with local storage
- `src/app/(tabs)/profile.tsx` - Replace with local storage
- `src/components/PostListItem.tsx` - Replace with local state
- `src/providers/NotificationProvider.tsx` - Remove Supabase push token saving, keep local functionality
- `src/utils/notifications.ts` - Replace external push API with local notifications

#### 1.2 Remove Cloudinary
**Files to modify:**
- `package.json` - Remove `cloudinary-react-native` dependency
- `src/lib/cloudinary.ts` - Delete entire file
- `src/components/PostContent.tsx` - Replace with local image/video display
- `src/components/PostListItem.tsx` - Replace avatar display
- `src/app/(tabs)/profile.tsx` - Replace image upload/display
- `src/app/(tabs)/new.tsx` - Replace image upload

#### 1.3 Modify Push Notifications (Keep Local Functionality)
**Files to modify:**
- `src/utils/notifications.ts` - Remove external API calls, keep local notifications
- `src/providers/NotificationProvider.tsx` - Remove Supabase token saving, keep local registration

### Phase 2: Create Mock Data Infrastructure

#### 2.1 Mock Data Files
**Create new files:**
- `assets/data/users.json` - Mock user profiles
- `assets/data/likes.json` - Mock likes data
- `assets/data/comments.json` - Mock comments (if needed)
- `assets/images/avatars/` - Local avatar images
- `assets/images/posts/` - Local post images

#### 2.2 Mock Services
**Create new files:**
- `src/services/authService.ts` - Mock authentication
- `src/services/postService.ts` - Mock post CRUD operations
- `src/services/profileService.ts` - Mock profile operations
- `src/services/storageService.ts` - Local storage utilities

#### 2.3 Local Storage Strategy
- Use `AsyncStorage` for persistent data
- Create utilities for CRUD operations
- Implement mock user sessions

### Phase 3: Replace Components

#### 3.1 Authentication System
**Replace `AuthProvider.tsx`:**
- Mock user sessions with local state
- Simple login/logout with predefined users
- No real password validation
- Auto-login functionality for development

**Replace `(auth)/index.tsx`:**
- Simple form that accepts any email/password
- Immediate "authentication" success
- Navigate to main app

#### 3.2 Feed System
**Replace `(tabs)/index.tsx`:**
- Load posts from `assets/data/posts.json`
- Merge with existing posts.json
- Add mock likes/comments data
- Implement local refresh functionality

#### 3.3 Post Creation
**Replace `(tabs)/new.tsx`:**
- Remove image upload to Cloudinary
- Store selected images locally using file system
- Save post data to AsyncStorage
- Generate mock post IDs

#### 3.4 Profile Management
**Replace `(tabs)/profile.tsx`:**
- Remove avatar upload to Cloudinary
- Store avatar selection locally
- Save profile updates to AsyncStorage
- Load from local mock data

#### 3.5 Post Interactions
**Replace `PostListItem.tsx`:**
- Replace Cloudinary image display with local images
- Implement local like/unlike functionality
- Store like state in AsyncStorage
- Remove network-based avatar loading

#### 3.6 Media Display
**Replace `PostContent.tsx`:**
- Replace Cloudinary transformations with basic Image/Video
- Use local image URIs
- Remove advanced image transformations

#### 3.7 Notifications (Keep Local)
**Modify `src/utils/notifications.ts`:**
- Remove external push API calls (`fetch` to exp.host)
- Keep local notification triggering using Expo Notifications
- Use local data for notification content

**Modify `src/providers/NotificationProvider.tsx`:**
- Keep push notification registration for local use
- Remove saving push tokens to Supabase
- Keep notification handling and display

### Phase 4: Data Structure

#### 4.1 Local Data Schema
```json
// assets/data/posts.json (extended)
[
  {
    "id": "1",
    "image": "post1.jpg",
    "media_type": "image",
    "caption": "Sample caption",
    "user_id": "u1",
    "created_at": "2024-01-01T00:00:00Z",
    "likes_count": 0,
    "my_likes": []
  }
]

// assets/data/users.json
[
  {
    "id": "u1",
    "username": "johndoe",
    "email": "john@example.com",
    "avatar_url": "avatar1.jpg",
    "bio": "Sample bio",
    "push_token": null
  }
]

// AsyncStorage keys
- "instagram_user_session" - Current logged in user
- "instagram_posts" - User's posts
- "instagram_likes" - User's likes
- "instagram_profile" - User's profile data
```

#### 4.2 Local Image Assets
**Create directories:**
- `assets/images/posts/` - Store sample post images
- `assets/images/avatars/` - Store sample avatar images
- `assets/videos/` - Store sample video files

### Phase 5: Implementation Steps

#### Step 1: Dependency Cleanup
1. Remove Supabase and Cloudinary from package.json
2. Delete lib files (supabase.ts, cloudinary.ts)
3. Run `npm install` to clean dependencies

#### Step 2: Create Mock Infrastructure
1. Create mock data files
2. Create service files for local operations
3. Add local image assets

#### Step 3: Replace Authentication
1. Implement mock AuthProvider
2. Update auth screen with mock login
3. Test authentication flow

#### Step 4: Replace Feed System
1. Update feed to use local posts data
2. Implement local like functionality
3. Test post display and interactions

#### Step 5: Replace Post Creation
1. Remove Cloudinary upload
2. Implement local image storage
3. Update post creation flow

#### Step 6: Replace Profile System
1. Remove Cloudinary avatar upload
2. Implement local profile storage
3. Update profile display and editing

#### Step 7: Replace Media Display
1. Update PostContent for local media
2. Update PostListItem for local avatars
3. Remove all Cloudinary transformations

#### Step 8: Modify Notifications (Keep Local)
1. Keep push notification registration for local use
2. Replace external push API with local notifications
3. Remove Supabase integration from NotificationProvider

### Phase 6: Testing and Validation

#### 6.1 Functionality Tests
- [ ] User can "login" with any credentials
- [ ] Feed displays posts from local data
- [ ] User can create new posts (stored locally)
- [ ] User can like/unlike posts (stored locally)
- [ ] User can update profile (stored locally)
- [ ] App works completely offline
- [ ] No network requests are made

#### 6.2 Performance Tests
- [ ] App starts quickly without network delays
- [ ] Image loading is immediate (local assets)
- [ ] No network timeouts or errors
- [ ] Smooth navigation between screens

### Phase 7: Cleanup and Optimization

#### 7.1 Code Cleanup
- Remove unused imports
- Remove error handling for network issues
- Simplify component logic
- Remove loading states for network operations

#### 7.2 Asset Optimization
- Optimize local images for mobile
- Ensure reasonable file sizes
- Organize asset directory structure

#### 7.3 Development Experience
- Add development utilities for resetting data
- Implement data seeding for testing
- Add debugging helpers for local storage

## Risk Assessment

### Low Risk
- Authentication removal (simple mock)
- Feed data replacement (already have posts.json)
- Basic image display changes

### Medium Risk
- Post creation without upload (need file system handling)
- Profile management with local storage
- Like/unlike state management

### High Risk
- Media handling (images/videos) without Cloudinary
- Complex data relationships (likes, comments)
- State synchronization across components

## Success Criteria

1. **Zero Network Requests**: App makes no external API calls
2. **Full Functionality**: All core features work with mock data
3. **Offline Operation**: App works without internet connection
4. **Fast Performance**: No network delays, immediate responses
5. **Clean Codebase**: No unused network-related code remains

## Timeline Estimate

- **Phase 1**: 2-3 hours (dependency removal - reduced since keeping notifications)
- **Phase 2**: 3-4 hours (mock infrastructure)
- **Phase 3**: 4-6 hours (component replacement)
- **Phase 4**: 1-2 hours (data structure setup)
- **Phase 5**: 6-8 hours (implementation)
- **Phase 6**: 2-3 hours (testing)
- **Phase 7**: 1-2 hours (cleanup)

**Total Estimated Time**: 19-28 hours (slightly reduced due to keeping notification infrastructure)

## Dependencies to Remove

```json
// From package.json
{
  "@supabase/supabase-js": "^2.44.2",
  "cloudinary-react-native": "^1.0.0"
}
```

## Files to Delete
- `src/lib/supabase.ts`
- `src/lib/cloudinary.ts`

## Files to Heavily Modify (Keep but Remove Network Calls)
- `src/utils/notifications.ts` - Keep local notifications, remove external API
- `src/providers/NotificationProvider.tsx` - Keep notification setup, remove Supabase calls

## Files to Create
- `src/services/authService.ts`
- `src/services/postService.ts`
- `src/services/profileService.ts`
- `src/services/storageService.ts`
- `assets/data/users.json`
- `assets/data/likes.json`
- Various local image assets

This comprehensive plan will transform the Instagram app from a network-dependent application to a fully local, offline-capable demo app with all the same UI functionality but no external dependencies. Local push notifications will be preserved to maintain the full Expo development experience while removing all network API calls.
