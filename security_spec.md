# Security Specification & Invariants

## Data Invariants
1. **User Identity Invariant**: Access to `/users/{userId}` and all subcollections under `/users/{userId}/` is strictly constrained to the authenticated user matching `request.auth.uid == userId`.
2. **Item Ownership Invariant**: For any document created or updated in `/users/{userId}/items/{itemId}`, `incoming().userId` must equal `request.auth.uid` and match `{userId}` path parameter.
3. **Volumetric Boundaries**: Item descriptions must be strings of size $\le 100$, amounts must be positive numbers, and dates must match `YYYY-MM-DD` format.
4. **Default Deny Catch-All**: All unlisted paths are denied by default (`match /{document=**} { allow read, write: if false; }`).

## Security Audit Checks
- **Identity Spoofing**: Attempt to write an item with `userId` of another user → DENIED.
- **Cross-User Data Scraping**: Attempt to list or read another user's items → DENIED.
- **Unauthenticated Read/Write**: Attempt to access collections without authentication → DENIED.
