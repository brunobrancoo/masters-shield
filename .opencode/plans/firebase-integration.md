# Firebase Integration Implementation Plan

## Overview
Replace localStorage-based storage with Firebase Firestore for real-time collaboration between master and players. Enable user authentication, campaign management, and real-time sync.

---

## Database Schema

```
users (collection)
  └── userId (document)
      ├── email: string
      ├── displayName: string
      └── campaigns: array of {campaignId, role}

campaigns (collection)
  └── campaignId (document)
      ├── name: string
      ├── masterId: string
      ├── members: array of userIds
      ├── inviteCode: string (8 characters, no I/O/0/1)
      ├── createdAt: timestamp
      ├── updatedAt: timestamp
      │
      ├── monsters (subcollection) → Monster documents
      ├── npcs (subcollection) → NPC documents
      ├── players (subcollection) → Player documents
      └── combat (nested document) → CombatData
```

---

## Phase 1: Firebase Foundation

### 1.1 Install Dependencies
```bash
npm install firebase@^10.8.0
```

### 1.2 Create Configuration Files

**File: `lib/firebase-config.ts`**
- Initialize Firebase app using existing config
- Configure Firestore with offline persistence (`enableIndexedDbPersistence`)
- Export `db` and `auth` instances

**File: `lib/utils/invite-code.ts`**
- `generateInviteCode()`: Generate 8-character code (no I/O/0/1)
- `regenerateInviteCode()`: Wrapper for code generation

**File: `lib/firebase-auth.ts`**
- `signIn(email, password)`: Sign in existing user
- `signUp(email, password, displayName)`: Create new account
- `signOut()`: Sign out current user
- `onAuthStateChange(callback)`: Listen to auth changes
- `getCurrentUser()`: Get current user

**File: `lib/auth-context.tsx`**
- Auth provider component
- User state management with loading states
- `useAuth()` hook
- `withAuth()` HOC for protected routes

### 1.3 Update App Layout
**File: `app/layout.tsx`**
- Wrap application with `<AuthProvider>`

---

## Phase 2: Firebase Storage Layer

### 2.1 Main Storage
**File: `lib/firebase-storage.ts`**

#### Campaign Operations
- `createCampaign(name, userId) → campaignId`
- `joinCampaign(campaignId, userId)`
- `getCampaign(campaignId) → Campaign`
- `regenerateInviteCode(campaignId) → string`

#### Player Operations
- `getPlayers(campaignId) → QuerySnapshot`
- `getPlayer(campaignId, playerId) → Player | null`
- `createPlayer(campaignId, player) → playerId`
- `updatePlayer(campaignId, playerId, updates)`
- `deletePlayer(campaignId, playerId)`

#### Monster Operations
- `getMonsters(campaignId) → QuerySnapshot`
- `getMonster(campaignId, monsterId) → Monster | null`
- `createMonster(campaignId, monster) → monsterId`
- `updateMonster(campaignId, monsterId, updates)`
- `deleteMonster(campaignId, monsterId)`

#### NPC Operations
- `getNPCs(campaignId) → QuerySnapshot`
- `getNPC(campaignId, npcId) → NPC | null`
- `createNPC(campaignId, npc) → npcId`
- `updateNPC(campaignId, npcId, updates)`
- `deleteNPC(campaignId, npcId)`

#### Real-time Listeners
- `onPlayersChange(campaignId, callback) → unsubscribe`
- `onMonstersChange(campaignId, callback) → unsubscribe`
- `onNPCsChange(campaignId, callback) → unsubscribe`

### 2.2 Combat Storage
**File: `lib/firebase-combat-storage.ts`**

#### Combat Operations
- `getCombat(campaignId) → CombatData | null`
- `updateCombat(campaignId, updates)` (merge)
- `clearCombat(campaignId)`
- `onCombatChange(campaignId, callback) → unsubscribe`

---

## Phase 3: Campaign Management Pages

### 3.1 Create Campaign Page
**File: `app/campaign/new/page.tsx`**
- Campaign creation form with name input
- Call `createCampaign()` with user ID
- Redirect to campaign select on success
- Loading and error states

### 3.2 Join Campaign Page
**File: `app/campaign/join/page.tsx`**
- Invite code input (8 chars, uppercase, centered)
- Query campaigns by invite code
- Call `joinCampaign()` with user ID
- Error handling for invalid codes
- Redirect to campaign select on success

### 3.3 Campaign Selection Page
**File: `app/campaign/select/page.tsx`**
- List user's campaigns (filter by membership)
- Display role badge (Master/Player)
- "Create Campaign" and "Join with Code" buttons
- Click to enter:
  - Master: → `/master?campaignId={id}`
  - Player: → `/player?campaignId={id}`
- Empty state with creation prompt

### 3.4 Components
**File: `components/campaign-card.tsx`**
- Reusable campaign display
- Show name, member count, invite code
- Role badge
- Enter button

**File: `components/invite-code-display.tsx`**
- Display 8-character code
- Copy to clipboard button
- Optional: Share link generation

---

## Phase 4: Context Updates

### 4.1 Game Context
**File: `app/_contexts/game-context.tsx`**

#### Changes Required
- Add `campaignId` to context state
- Remove `loadGameData()` and `saveGameData()` calls
- Remove localStorage dependencies
- Add `campaignId` prop to context provider

#### New Implementation
- Use `onPlayersChange()` listener to sync players
- Use `onMonstersChange()` listener to sync monsters
- Use `onNPCsChange()` listener to sync NPCs
- Update all CRUD handlers to call Firebase functions:
  - `handleSavePlayer()` → `createPlayer()` / `updatePlayer()`
  - `handleDeletePlayer()` → `deletePlayer()`
  - `handleSaveMonster()` → `createMonster()` / `updateMonster()`
  - `handleDeleteMonster()` → `deleteMonster()`
  - `handleGenerateNPC()` → `createNPC()`
  - `handleUpdateNPC()` → `updateNPC()`
  - `handleDeleteNPC()` → `deleteNPC()`
- Add loading states for Firebase operations
- Add error handling with user feedback

### 4.2 Combat Context
**File: `app/_contexts/combat-context.tsx`**

#### Changes Required
- Add `campaignId` to context state
- Remove `loadCombatData()`, `saveCombatData()`, `clearCombatData()`

#### New Implementation
- Use `onCombatChange(campaignId, callback)` for real-time sync
- Update handlers:
  - `updateCombat()` → call Firebase `updateCombat()`
  - `clearCombat()` → call Firebase `clearCombat()`
- Handle initial load from Firebase

---

## Phase 5: Page Updates

### 5.1 Master Page
**File: `app/master/page.tsx`**

#### Changes Required
- Get `campaignId` from URL query param
- Pass `campaignId` to game context
- Update context provider to use `campaignId`

### 5.2 Player Selection Page
**File: `app/player/page.tsx`**

#### Changes Required
- Get `campaignId` from URL query param
- Update Firebase queries to use `campaignId`
- Filter logic:
  - If user is master: Show all players in campaign
  - If user is player: Show only players they "own" (can select/create)
- "Create Character" option
- Pass `campaignId` to context

### 5.3 Player Sheet Page
**File: `app/player/[id]/page.tsx`**

#### Changes Required
- Minimal changes (already uses single player query)
- Update storage calls to use Firebase functions
- Remove localStorage dependencies

---

## Phase 6: Login Page Update

### 6.1 Replace Existing Login
**File: `app/login/page.tsx`**

#### Changes Required
- Replace existing login form with Firebase auth
- Add sign-up option
- Use `signIn()` and `signUp()` from firebase-auth
- Redirect to campaign select on success
- Error handling for auth failures

---

## Phase 7: Components & UI Updates

### 7.1 Navigation
- Update `components/app-sidebar.tsx` to include:
  - Sign out button
  - Campaign switch option
  - Current campaign indicator

### 7.2 Loading States
- Add loading spinners for Firebase operations
- Show "Syncing..." indicators for real-time updates

### 7.3 Error Handling
- Toast notifications for errors
- Retry buttons for failed operations
- Offline indicator in header

---

## Phase 8: Security Rules

### 8.1 Firestore Rules
**File: `firestore.rules`**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /campaigns/{campaignId} {
      // Allow creating campaigns
      allow create: if request.auth != null;
      
      // Helper functions
      function isMember() {
        return request.auth != null && 
               resource.data.members.includes(request.auth.uid);
      }
      
      function isMaster() {
        return request.auth != null && 
               resource.data.masterId == request.auth.uid;
      }
      
      // Members can read campaign info
      allow read: if isMember();
      
      // Only master can update campaign (regenerate code, etc)
      allow update: if isMaster();
      
      // Only master can delete campaign
      allow delete: if isMaster();
      
      // Master-only subcollections
      match /monsters/{docId} {
        allow read, write: if isMaster();
      }
      
      match /npcs/{docId} {
        allow read, write: if isMaster();
      }
      
      // Players: all members can read, master writes
      match /players/{docId} {
        allow read: if isMember();
        allow write: if isMaster();
      }
      
      // Combat: all members can read/write
      match /combat {
        allow read: if isMember();
        allow write: if isMember();
      }
    }
  }
}
```

---

## Phase 9: Data Migration (Future)

### 9.1 Migration Utilities
**File: `lib/migration.ts`**

#### Functions
- `exportLocalStorageData()`: Export current localStorage as JSON
- `validateGameData(data)`: Ensure data integrity
- `importGameDataToCampaign(campaignId, data)`: Import to Firebase
- `deleteLocalStorage()`: Clear old data

### 9.2 Migration UI (Temporary)
**File: `app/migrate/page.tsx`**
- Load and display localStorage data
- Create or select target campaign
- Migrate in batches with progress indicator
- Validation and error reporting
- Option to delete localStorage after success

---

## Phase 10: Testing & Polish

### 10.1 Testing Checklist
- [ ] User can sign up and sign in
- [ ] Master can create campaign
- [ ] Master can regenerate invite code
- [ ] Player can join via invite code
- [ ] Campaign select shows correct campaigns
- [ ] Master can create/edit/delete monsters
- [ ] Master can create/edit/delete NPCs
- [ ] Master can create/edit/delete players
- [ ] Player can view their players only
- [ ] Master can view all players on player page
- [ ] Real-time sync works for all entities
- [ ] Combat state syncs correctly
- [ ] Offline persistence works
- [ ] Sign out works correctly
- [ ] Security rules prevent unauthorized access

### 10.2 Edge Cases
- User with no campaigns: Redirect to create campaign
- Invalid invite code: Show error, allow retry
- Multiple tabs open: Persistence handles correctly
- Network disconnect: Show offline indicator, sync on reconnect
- Concurrent edits: Firestore resolves conflicts

---

## Configuration

### Environment Variables
**File: `.env.local`**
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyB7ry3EeEDz5r-HcZJ3DQtnZRF8rVqihXk
NEXT_PUBLIC_FIREBASE_APP_ID=1:522829524294:web:f2197c9b3ba9a379ea8947
```

### Package Dependencies
**File: `package.json`**
Add to dependencies:
```json
{
  "firebase": "^10.8.0"
}
```

---

## Key Decisions & Constraints

### Storage Strategy
- **Subcollections** for `monsters`, `npcs`, `players` (not nested documents)
  - Enables fine-grained security rules
  - Players can only see `players` subcollection
- **Nested document** for `combat`
  - Single unified object
  - Simpler to query and update

### Access Control
- **Master**: Full read/write on all subcollections
- **Player**: Read-only on `players`, read/write on `combat`
- **Non-members**: No access to campaign data

### Real-time Updates
- Use `onSnapshot()` listeners in contexts
- Automatic sync for all connected clients
- No polling required

### Offline Support
- Firestore offline persistence enabled
- Works without internet
- Syncs automatically when back online
- Conflict resolution: Last-write-wins (Firestore default)

### Character Ownership
- Players can create their own characters via `/player` route
- Master can create characters for players via `/master` route
- Characters persist if player leaves (master can reassign)

### Invite Codes
- 8 characters, alphanumeric (no I/O/0/1 to avoid confusion)
- Master can regenerate anytime
- Simple join flow (no email invites needed)

---

## Files to Create (18 total)

1. `lib/firebase-config.ts`
2. `lib/utils/invite-code.ts`
3. `lib/firebase-auth.ts`
4. `lib/auth-context.tsx`
5. `lib/firebase-storage.ts`
6. `lib/firebase-combat-storage.ts`
7. `app/campaign/new/page.tsx`
8. `app/campaign/join/page.tsx`
9. `app/campaign/select/page.tsx`
10. `components/campaign-card.tsx`
11. `components/invite-code-display.tsx`
12. `lib/migration.ts` (future)
13. `app/migrate/page.tsx` (future)
14. `firestore.rules`

## Files to Modify (6 total)

1. `app/layout.tsx` - Add AuthProvider
2. `app/_contexts/game-context.tsx` - Replace localStorage with Firebase
3. `app/_contexts/combat-context.tsx` - Replace localStorage with Firebase
4. `app/master/page.tsx` - Add campaignId handling
5. `app/player/page.tsx` - Add campaignId handling and filtering
6. `app/player/[id]/page.tsx` - Update storage calls

## Files to Keep (Backup)

1. `lib/storage.ts` - Mark as deprecated
2. `lib/combat-storage.ts` - Mark as deprecated

---

## Implementation Order

1. Install Firebase SDK
2. Create Firebase config and auth utilities
3. Create Auth context
4. Create campaign pages (new, join, select)
5. Create Firebase storage layer
6. Update game context
7. Update combat context
8. Update login page
9. Update existing pages for campaignId
10. Create UI components
11. Deploy security rules to Firebase console
12. Test complete user flow
13. **(Future)** Build migration tool
14. **(Future)** Migrate existing localStorage data
