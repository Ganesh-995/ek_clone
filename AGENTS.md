# EK Celebrations - AI Agent Guide

**Project**: "The Balloon Space" – Event decoration and balloon product showcase platform.  
**Stack**: React 19 + Vite + Netlify Functions + React Router 7 (SPA)  
**Live URL**: https://ek-balloon-space.netlify.app

---

## 🎯 Quick Start for Agents

### Development Commands
```bash
npm run dev      # Vite dev server (localhost:5173)
npm run build    # Production build → dist/
npm run lint     # Oxlint static analysis
npm run preview  # Preview production build locally
```

### Deployment
⚠️ **Manual CLI Deploy Required** (no auto-deploy from GitHub):
```bash
npm run build
npx --yes netlify-cli@17 deploy --prod --dir=dist
```
(Netlify CLI is already authenticated; siteId stored in `.netlify/state.json`)

---

## 🏗️ Architecture Overview

### Frontend Structure
- **Entry**: `src/main.jsx` – wraps app with `BrowserRouter` + `ProductProvider` (React Context)
- **Pages** (8 routes): Home, Location, About, Contact, ManageProducts, ProductDetails, ThemeDetails, SearchResults
- **Components**: Reusable pieces (ProductCard, Navbar, AskFormModal)
- **Styling**: CSS co-located with components (`Component.jsx` + `Component.css`)

### State Management
- **ProductContext** (`src/context/ProductContext.jsx`): Manages products, themes, visitor stats
- **Caching**: localStorage fallback ensures app works if backend fails (resilient offline)
- **Fetch Pattern**: Context fetches on mount, updates lazily when admin makes changes

### Backend: Netlify Functions (`netlify/functions/`)
| Endpoint | Method | Purpose | Auth |
|----------|--------|---------|------|
| `/api/products` | GET/PUT | Product catalog CRUD | PUT requires token |
| `/api/themes` | GET/PUT | Theme collections CRUD | PUT requires token |
| `/api/admin-auth` | POST | Password → HMAC-SHA256 token | Password-based |
| `/api/visitors` | GET | Track total/today/live visitors | Public |

**Storage**: Netlify Blobs (`@netlify/blobs`) with `src/data/` as fallback defaults.

### Data Flow
```
React Components → ProductContext (fetch + cache)
                    ↓
              Netlify Functions
                    ↓
              Netlify Blobs (persistent storage)
```

---

## 📋 Key Conventions

### File Naming
- PascalCase components: `ProductCard.jsx`, `ManageProducts.jsx`
- kebab-case theme IDs: `celebrate-in-color`, `wedding-vibes`
- lowercase utilities: `whatsapp.js`

### Data Schemas
**Product** (products.json):
```javascript
{ id, image, title, description?, bulletPoints?[], price?, ... }
```

**Theme** (themes.js):
```javascript
{ id (kebab-case), title, detail, productIds[] }
```

**Visitor Stats**:
```javascript
{ total: 0, today: 0, live: 0 }
```

### Component Pattern
- Import styles immediately after component file: `import './Component.css'`
- Use React hooks for local state; ProductContext for global data
- Abort signals for async operations (see ProductContext for `isCurrent` pattern)

### Authentication
- Password hashed with HMAC-SHA256 (constant-time comparison for security)
- Token stored in sessionStorage as `ek-admin-token`
- Lost on page refresh (users must re-login)

---

## 🚨 Known Gotchas & Patterns

### ✅ Smart Patterns to Preserve
- **Resilient Offline**: Cached data + fallback defaults = app survives backend failures
- **Optimistic UI**: Updates show immediately, sync in background
- **Visitor Heartbeat**: 60-second polling tracks live users
- **Timing-Safe Crypto**: HMAC tokens use constant-time comparison (security best practice)

### ⚠️ Gotchas to Avoid
- **No Error UI**: Network failures silently use cached data (confusing for debugging)
- **Token Loss**: Admin tokens lost on refresh; users must re-login
- **Client-Side Search Only**: No backend filtering (scales poorly with large catalogs)
- **Netlify Blobs Costs**: Each read/write is metered; consider caching strategies
- **Intermittent 502s**: `/api/products` and `/api/visitors` occasionally fail (monitor externally)

---

## 🔧 Common Tasks

### Adding a New Product
1. Update `src/data/products.json` (default)
2. Admin panel (`/manage`): Login → add product
3. Changes sync to Netlify Blobs

### Adding a New Theme
1. Update `src/data/themes.js` (default)
2. Link product IDs in theme's `productIds[]`
3. New theme appears in ProductContext

### Admin Login Workflow
1. Visit `/manage`
2. Enter password (creates HMAC token in sessionStorage)
3. Can now PUT to `/api/products` and `/api/themes`
4. Visitor analytics displayed (5-min live window)

### WhatsApp Integration
- Configured in `src/utils/whatsapp.js`: `wa.me/917838937047`
- Used in ProductCard and other CTAs
- Pre-formats inquiry messages

### Search Feature
- Client-side only: filters products by title/description
- Route: `/search?q=term`
- No backend query (consider for future optimization)

---

## 📁 Project Structure Snapshot

```
src/
├── main.jsx                 # Entry point + routing
├── App.jsx                  # Root layout
├── Components/              # Reusable (ProductCard, Navbar, AskFormModal)
├── Pages/                   # Routes (ProductDetails, ManageProducts, etc.)
├── context/ProductContext   # Global state: products, themes, visitors
├── data/                    # Defaults: products.json, themes.js
└── utils/whatsapp.js        # WhatsApp integration

netlify/functions/           # Serverless backend
├── admin-auth.mjs
├── products.mjs
├── themes.mjs
└── visitors.mjs
```

---

## 🎓 For New Features

### Add a New Route
1. Create page in `src/Pages/PageName.jsx`
2. Import in `src/App.jsx` and add `<Route path="/route" element={<PageName />} />`
3. Ensure Netlify redirect in `netlify.toml` (SPA routes → `/index.html`)

### Add a New API Endpoint
1. Create function in `netlify/functions/endpoint-name.mjs`
2. Use `@netlify/blobs` to persist data
3. Implement auth check for mutations (PUT/POST)
4. Add TypeScript types if upgrading

### Debugging Data Flow
1. Check ProductContext in browser DevTools → React tab
2. Verify localStorage (`ek-admin-*` keys)
3. Inspect Network tab for `/api/*` requests
4. Check Netlify Function logs: `netlify functions:invoke`

---

## 📚 Documentation References

- [README.md](README.md) – Setup & basic commands
- [vite.config.js](vite.config.js) – Vite build configuration
- [netlify.toml](netlify.toml) – Netlify deployment config (redirects, build settings)
- [package.json](package.json) – Dependencies & scripts

---

## 🤝 Contributing Notes

- Always link to existing docs (not duplicate)
- Preserve offline-resilience patterns
- Keep functions small and stateless
- Use constant-time crypto for auth
- Test against Netlify locally: `netlify dev`
