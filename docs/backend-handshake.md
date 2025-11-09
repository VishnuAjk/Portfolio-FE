# Portfolio FE ↔️ BE Contract

This document captures the current frontend expectations so the backend service can expose matching APIs, data shapes, and realtime events.

## Platform Overview
- FE repo: React (Vite) SPA using CSS Modules.
- Auth + Portfolio state stored via React contexts and Axios services.
- All network calls go through `src/services/apiClient.js` which injects the JWT token as `Authorization: Bearer <token>` and targets `VITE_API_BASE_URL` (default `http://localhost:5000/api`).
- Socket.IO client connects to `VITE_SOCKET_URL` (default `http://localhost:5000`).

## Authentication Contract
| Route | Method | Payload | Response | Notes |
|-------|--------|---------|----------|-------|
| `/auth/login` | POST | `{ email, password }` | `{ token, user }` | `user.role === 'owner'` grants editing rights. `token` stored in localStorage key `portfolio_owner_token`. |
| `/auth/me` | GET | – | `{ email, role }` | Called on app load when a token is present. |
| `/auth/logout` | POST | – | 204 / `{ ok: true }` | Failure is ignored on FE but preferred to send 200. |

Backend should return `{ message }` on auth failures so UI can display it.

## Portfolio Data Contract
- `GET /portfolio` returns an object with keys defined in [`src/utils/sectionConfig.js`](../src/utils/sectionConfig.js). Each key must include at least the defaults below:

```json
{
  "about": { "summary": "", "highlights": [] },
  "skills": { "headline": "", "categories": [{ "title": "", "items": [] }] },
  "work": { "roles": [{ "title": "", "company": "", "period": "", "summary": "" }] },
  "journey": { "timeline": [{ "period": "", "title": "", "detail": "" }] },
  "projects": { "items": [{ "name": "", "link": "", "summary": "", "stack": [] }] },
  "education": { "milestones": [{ "period": "", "institution": "", "detail": "" }] },
  "contact": { "email": "", "phone": "", "location": "", "availability": "", "socials": [{ "label": "", "url": "" }] }
}
```

### Section mutations
Current FE uses bulk updates:
- `PUT /portfolio/:sectionKey` with a payload shaped exactly like the section (e.g., `skills` payload above). Response should return the updated section object to keep FE state in sync.

Optional helpers already scaffolded client-side if BE prefers item-level CRUD:
- `POST /portfolio/:sectionKey` expecting `{ ...itemFields }` → returns created item.
- `DELETE /portfolio/:sectionKey/:itemId` → 204.

If BE adopts these, ensure section items include `_id` or similar so FE can reference them. Right now the UI sends entire arrays, so BE may simply overwrite stored values using the provided payload.

## Realtime Updates
- FE calls `getSocketClient()` (`socket.io-client`) and listens for `portfolio:update` events.
- Emit payloads as partial portfolio objects, e.g. `{ skills: { ... } }`. FE merges them into the cached state.
- Connection should require the same auth token if secure updates are needed (e.g., via `auth.token` query or middleware).

## Error Handling Expectations
- Non-2xx responses should include `{ message: string }` so UI can render inline errors.
- Section update failures should return appropriate status codes; FE currently surfaces generic errors but you may extend to include validation details later.

## Environment Variables
Provide actual URLs via `.env` (already present in repo):
```
VITE_API_BASE_URL=https://api.example.com/api
VITE_SOCKET_URL=https://api.example.com
```
Update backend deployment/IPs accordingly so FE can be configured per environment.

## Testing/CI Hooks
- FE CI runs `npm run lint`, `npm run test`, `npm run build` (`.github/workflows/ci.yml`).
- Please provide backend test users that match the owner role so we can run E2E tests later.

## Next Steps for Backend Team
1. Mirror these endpoints and shapes in your Express/Mongo backend (Portfolio-BE repo).
2. Emit `portfolio:update` events whenever section data changes.
3. Optional: publish OpenAPI spec or shared JSON schema so both repos stay aligned (FE already references `sectionConfig.js` as source of truth).
4. If you change data shapes or endpoints, update this doc plus `sectionConfig.js` so both sides stay in sync.

This document should give enough clarity to start wiring the backend without diving into the frontend source.
