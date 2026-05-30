# Branch: build-users-team-page — Change Log

> Branch created from: `feat/professional-ui-overhaul`
> Purpose: Recreate the Team/Users management page with role-based access, fix backend security issues, add restaurant filtering, and seed test users.

---

## Commits (chronological order)

### 1. `a5f85ac` — Fix backend role middleware
**Merged from:** `fix-backend-role-middleware` branch

**Backend — JWT & Auth:**
- `backend/src/modules/auth/auth.service.js`
  - `generateToken()`: Now includes `role` (object with `name`) and `permissions` (array of permission names) in the JWT payload.
  - Falls back to DB lookup if `user.role` is not already populated.
- `backend/src/middlewares/role.middlewares.js`
  - `requireRole()`: Added null guard — returns `403` instead of crashing when `role` is undefined.
  - `requirePermission()`: Fixed Admin bypass (`role.name === "Admin"` instead of `role === "Admin"`). Added null guard for `permissions`.
- `backend/src/modules/auth/auth.controller.js`
  - `login()`: Added `role: { name: ... }` to the `cleanUser` response so frontend knows the user's role immediately.
  - `changePassword()`: Now refreshes the JWT cookie via `cookieManager.generateCookie()` after password change.

---

### 2. `bbbfec8` — fix-employee-creation-bug
**Merged from:** `fix-employee-creation-bug` branch

**Backend — User Controller:**
- `backend/src/modules/user/user.controller.js`
  - `ROUTE_ROLE_MAP`: Changed `/createUser` and `/createEmployee` from `3` (Manager) to `4` (Employee). Now correctly creates employees.
  - `getAllUsers()`: Added `return` statements to prevent double-response crash. Now excludes `password` from response and includes `role` association.

---

### 3. `65ed771` — add-seeded-users & fixes
**Merged from:** `add-seeded-users` branch

**Backend — Seed Data:**
- `backend/src/seed/rolesAndPermissions.seed.js`
  - Fixed `username: " Super Admin"` → `"Super Admin"` (removed leading space).
  - Added `await` to `findOrCreate` calls (previously fire-and-forget).
  - Added 2 new seeded users:
    - `owner@gmail.com` / `owner123` → **Owner** (roleId 2)
    - `manager@gmail.com` / `manager123` → **Manager** (roleId 3)
  - Existing seeded users preserved:
    - `admin@gmail.com` / `admin123` → **Admin** (roleId 1)
    - `johndoe@gmail.com` / `xxx` → **Employee** (roleId 4, `mustChangePassword: true`)
- `backend/src/seed/runner.js`
  - Fixed crash: now imports all models, builds the `models` object, and passes it to `seedRolesAndPermissions(models)`.
  - Previously called `seedRolesAndPermissions()` with no arguments → `models` was `undefined` → crash.

---

### 4. `8c6163b` — Rename Pgage to pages

**Frontend — Directory rename:**
- Renamed `frontend/src/Pages/` (capital P) → `frontend/src/pages/` (lowercase).
- Updated all imports accordingly.

---

### 5. `281238c` — fixes

**Frontend — General fixes:**
- Various frontend improvements and bug fixes.

---

### 6. `bad165b` — docker-compose : adding db dependency to backend

**DevOps:**
- `docker-compose.yaml`
  - Added `healthcheck` to `db` service (`pg_isready` check).
  - Added `depends_on` to `backend` service with `condition: service_healthy`.
  - **Fixes:** Backend no longer crashes on cold start when Postgres hasn't finished initialization.

---

### 7. `00a754b` — feat(users): add Team page with CRUD, RoleGuard, secure createUser endpoint, conditional nav

**Backend — Security:**
- `backend/src/modules/user/user.routes.js`
  - Added `requireRole("Admin", "Owner", "Manager")` to `/createUser` endpoint. Previously unprotected — anyone could create an employee without logging in.

**Frontend — New Components:**
- `frontend/src/features/auth/components/RoleGuard.jsx` *(new)*
  - Route guard: redirects to `/login` if not authenticated, or to `/` if role is not in `allowedRoles`.
- `frontend/src/features/users/components/UsersTable.jsx` *(new)*
  - Data table showing users (name, email, role).
  - Inline role editing via dropdown + confirm button.
  - Delete button with `window.confirm()`.
- `frontend/src/features/users/components/CreateUserModal.jsx` *(new)*
  - Modal form to create a user: username, email, password, role dropdown.
  - Validates inputs before submit.
  - After successful creation: shows a **"Copy credentials"** screen with email + password, so the creator can manually send them to the new user.
- `frontend/src/pages/Users.jsx` *(new)*
  - Main **Team** page. Fetches users, handles create/delete/updateRole, shows loading state.

**Frontend — Modified:**
- `frontend/src/services/userService.js`
  - Added `fetchUsers()` → `GET /api/users/getAll`
  - Added `createUser()` → `POST /api/users/{endpoint}` (maps role to correct backend endpoint)
  - Added `deleteUser()` → `DELETE /api/users/delete/{id}`
  - Added `updateUserRole()` → `PUT /api/users/updateRole/{id}`
- `frontend/src/routes/AppRoutes.jsx`
  - Added `/users` route wrapped in `<RoleGuard allowedRoles={["Admin", "Owner", "Manager"]}>`.
- `frontend/src/layouts/components/Aside/Aside.jsx`
  - Team link is now **conditional**: only visible to Admin, Owner, or Manager.
  - Uses `useAuth()` to read `user.role?.name`.

---

### 8. `7c76e44` — fix(auth): add restaurantId to JWT and login response, filter getAllUsers by restaurant for non-Admins

**Backend — Restaurant Filtering:**
- `backend/src/modules/auth/auth.service.js`
  - `generateToken()`: Added `restaurantId: user.restaurantId` to JWT payload.
- `backend/src/modules/auth/auth.controller.js`
  - `login()`: Added `restaurantId` to the `cleanUser` response.
- `backend/src/modules/user/user.controller.js`
  - `getAllUsers()`: Now filters by `restaurantId` for non-Admins.
    - Admin → sees all users from all restaurants.
    - Owner/Manager → sees only users from their own restaurant.
  - `createUser()`: Changed `restaurantId` assignment to inherit from creator:
    ```js
    const restaurantId = req.body.restaurantId || req.user.restaurantId || null;
    ```
    - If frontend sends `restaurantId`, use it (for future admin override).
    - Otherwise, use the creator's `restaurantId` from the JWT.
    - Fallback: `null`.

---

## Summary of All Files Changed

| File | Status | Description |
|---|---|---|
| `.gitignore` | Modified | Added `.opencode/` to ignore list |
| `backend/src/middlewares/role.middlewares.js` | Modified | Fixed crashes, fixed Admin bypass |
| `backend/src/modules/auth/auth.controller.js` | Modified | Added `role` to login response, refresh cookie on password change, added `restaurantId` |
| `backend/src/modules/auth/auth.service.js` | Modified | JWT now includes `role`, `permissions`, and `restaurantId` |
| `backend/src/modules/user/user.controller.js` | Modified | Fixed employee roleId (3→4), fixed getAllUsers double response, added restaurant filter, fixed createUser restaurant assignment |
| `backend/src/modules/user/user.routes.js` | Modified | Secured `/createUser` with `requireRole` |
| `backend/src/seed/rolesAndPermissions.seed.js` | Modified | Added Owner + Manager seeded users, fixed Super Admin whitespace, added `await` |
| `backend/src/seed/runner.js` | Modified | Fixed crash — now passes `models` object to seed function |
| `docker-compose.yaml` | Modified | Added DB healthcheck + backend dependency |
| `frontend/src/features/auth/components/RoleGuard.jsx` | **Added** | Route guard by role |
| `frontend/src/features/users/components/CreateUserModal.jsx` | **Added** | Modal to create users with role selection + credential copy |
| `frontend/src/features/users/components/UsersTable.jsx` | **Added** | User list table with inline role edit + delete |
| `frontend/src/layouts/components/Aside/Aside.jsx` | Modified | Team link now conditional (hidden for Employees) |
| `frontend/src/pages/Users.jsx` | **Added** | Main Team page |
| `frontend/src/routes/AppRoutes.jsx` | Modified | Added `/users` route with RoleGuard |
| `frontend/src/services/userService.js` | Modified | Added `fetchUsers`, `createUser`, `deleteUser`, `updateUserRole` |

---

## Test Users (Seeded)

| Email | Password | Role | Restaurant |
|---|---|---|---|
| `admin@gmail.com` | `admin123` | Admin | `null` |
| `owner@gmail.com` | `owner123` | Owner | `null` |
| `manager@gmail.com` | `manager123` | Manager | `null` |
| `johndoe@gmail.com` | `xxx` | Employee | `null` |

---

## Next Steps / Testing Checklist

- [ ] Restart Docker: `docker compose up --build`
- [ ] Login as `admin@gmail.com` / `admin123`
- [ ] Verify "Team" link appears in sidebar
- [ ] Create a new user via Team page
- [ ] Verify created user has correct `restaurantId`
- [ ] Copy credentials and login as new user
- [ ] Login as `johndoe@gmail.com` / `xxx` (Employee)
- [ ] Verify "Team" link is **hidden**
- [ ] Try accessing `/users` directly → should redirect to `/`
