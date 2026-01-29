# SpotDrop Web

> **CRITICAL: YOU CANNOT MAKE DESTRUCTIVE CHANGES TO THE LOCAL CODEBASE. This includes: git reset --hard, git clean -f, git checkout . on uncommitted work, deleting files/directories without explicit user permission, force pushing, or any operation that could result in loss of local work.**

React + Vite + Mapbox web application for SpotDrop.

## Tech Stack

- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** TailwindCSS
- **Maps:** Mapbox GL JS
- **State:** Zustand
- **HTTP:** Axios
- **Testing:** Vitest + React Testing Library

## Project Structure

```
spotdrop-web/
├── src/
│   ├── main.tsx              # React DOM entry point
│   ├── App.tsx               # Root component
│   ├── components/
│   │   ├── ui/               # Reusable UI primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Input.tsx
│   │   ├── auth/             # Authentication components
│   │   │   └── AuthModal.tsx
│   │   ├── map/              # Map-related components
│   │   │   └── Map.tsx
│   │   ├── spots/            # Spot feature components
│   │   │   ├── SpotCard.tsx
│   │   │   └── SpotFilter.tsx
│   │   └── layout/           # Layout components
│   │       ├── Header.tsx
│   │       └── Sidebar.tsx
│   ├── stores/               # Zustand state management
│   │   ├── authStore.ts      # Auth state: user, login, logout
│   │   └── spotsStore.ts     # Spots state: list, filters, selection
│   ├── lib/                  # Utilities and API client
│   │   └── api.ts            # Axios instance with interceptors
│   ├── types/                # TypeScript type definitions
│   │   └── index.ts          # User, Spot, Image, Category types
│   └── styles/               # Global styles
│       └── globals.css       # TailwindCSS imports, dark theme
├── tests/                    # Test files
│   ├── setup.ts
│   └── SpotCard.test.tsx
├── agents/                   # Agent role definitions
├── skills/                   # Skill definitions
├── tailwind.config.js        # Theme configuration
├── vite.config.ts            # Build configuration
└── package.json
```

## Structure Requirements (MUST FOLLOW)

When adding new features, you MUST follow these patterns:

### Adding a New Feature (e.g., "favorites")

1. **Types** - Add to `src/types/index.ts`:
   ```typescript
   export interface Favorite {
     id: number;
     user_id: number;
     spot_id: number;
     created_at: string;
   }
   ```

2. **API Methods** - Add to `src/lib/api.ts`:
   ```typescript
   export const favoritesApi = {
     list: () => api.get<Favorite[]>('/favorites'),
     add: (spotId: number) => api.post<Favorite>('/favorites', { spot_id: spotId }),
     remove: (id: number) => api.delete(`/favorites/${id}`),
   };
   ```

3. **Store** - Create `src/stores/favoritesStore.ts`:
   ```typescript
   import { create } from 'zustand';
   import { favoritesApi } from '../lib/api';
   import type { Favorite } from '../types';

   interface FavoritesState {
     favorites: Favorite[];
     isLoading: boolean;
     fetchFavorites: () => Promise<void>;
     addFavorite: (spotId: number) => Promise<void>;
     removeFavorite: (id: number) => Promise<void>;
   }

   export const useFavoritesStore = create<FavoritesState>((set, get) => ({
     favorites: [],
     isLoading: false,
     fetchFavorites: async () => {
       set({ isLoading: true });
       try {
         const { data } = await favoritesApi.list();
         set({ favorites: data });
       } finally {
         set({ isLoading: false });
       }
     },
     addFavorite: async (spotId) => {
       const { data } = await favoritesApi.add(spotId);
       set({ favorites: [...get().favorites, data] });
     },
     removeFavorite: async (id) => {
       await favoritesApi.remove(id);
       set({ favorites: get().favorites.filter(f => f.id !== id) });
     },
   }));
   ```

4. **Components** - Create in appropriate directory:

   **UI Component** (`src/components/ui/FavoriteButton.tsx`):
   ```tsx
   interface FavoriteButtonProps {
     isFavorited: boolean;
     onToggle: () => void;
   }

   export function FavoriteButton({ isFavorited, onToggle }: FavoriteButtonProps) {
     return (
       <button
         onClick={onToggle}
         className="p-2 rounded-lg hover:bg-slate-700"
       >
         <Heart className={isFavorited ? 'fill-red-500 text-red-500' : 'text-slate-400'} />
       </button>
     );
   }
   ```

   **Feature Component** (`src/components/spots/FavoritesList.tsx`):
   ```tsx
   import { useFavoritesStore } from '../../stores/favoritesStore';
   import { SpotCard } from './SpotCard';

   export function FavoritesList() {
     const { favorites, isLoading } = useFavoritesStore();

     if (isLoading) return <div>Loading...</div>;

     return (
       <div className="space-y-4">
         {favorites.map(fav => (
           <SpotCard key={fav.id} spotId={fav.spot_id} />
         ))}
       </div>
     );
   }
   ```

5. **Tests** - Create `tests/FavoriteButton.test.tsx`

### Component Organization

| Directory | Purpose | Examples |
|-----------|---------|----------|
| `components/ui/` | Reusable, stateless primitives | Button, Card, Input, Modal |
| `components/auth/` | Authentication UI | AuthModal, LoginForm |
| `components/map/` | Map-related components | Map, Marker, Popup |
| `components/spots/` | Spot feature components | SpotCard, SpotFilter, SpotList |
| `components/layout/` | Page layout components | Header, Sidebar, Footer |

### Naming Conventions

- **Files:** PascalCase for components (`SpotCard.tsx`), camelCase for utilities (`api.ts`)
- **Components:** PascalCase, exported named function
- **Stores:** camelCase with `Store` suffix (`authStore.ts`), export `use*Store` hook
- **Types:** PascalCase interfaces (`interface Spot {}`)
- **Props:** `*Props` suffix (`interface SpotCardProps {}`)

### Component Pattern

```tsx
// Always use named exports
// Props interface at top
interface ComponentProps {
  prop1: string;
  onAction: () => void;
}

export function Component({ prop1, onAction }: ComponentProps) {
  // Hooks first
  const store = useStore();
  const [state, setState] = useState();

  // Event handlers
  const handleClick = () => {
    onAction();
  };

  // Return JSX
  return (
    <div className="bg-card rounded-lg p-4">
      {/* content */}
    </div>
  );
}
```

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Add your Mapbox token to .env

# Start dev server
npm run dev
```

## Environment Variables

See `.env.example` for required variables.

**Important:** You need a Mapbox public token from https://mapbox.com

## Scripts

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run test     # Run tests
npm run lint     # Run ESLint
```

## Design System

| Token | Value | Usage |
|-------|-------|-------|
| `bg-background` | #0F172A | Page background |
| `bg-card` | #1E293B | Card backgrounds |
| `text-white` | white | Primary text |
| `text-slate-400` | #94A3B8 | Secondary text |

### Category Colors

```typescript
const CATEGORIES = [
  { value: 'cafe', color: '#22C55E' },      // green
  { value: 'restaurant', color: '#F97316' }, // orange
  { value: 'bar', color: '#A855F7' },        // purple
  { value: 'park', color: '#14B8A6' },       // teal
  { value: 'museum', color: '#3B82F6' },     // blue
  { value: 'shop', color: '#EC4899' },       // pink
  { value: 'other', color: '#6B7280' },      // gray
];
```

## Agents

- `@architect` - React architecture, component design
- `@developer` - Components, hooks, state implementation
- `@debugger` - Frontend debugging, map issues
- `@reviewer` - Code review for React/TypeScript

## Skills

- `/build` - Build for production
- `/func-start` - Start dev server
- `/lint` - Run ESLint
- `/test` - Run Vitest tests
