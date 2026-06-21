import { Roles } from "../context/UserContext";
import { GridIcon, Notification } from "../icons";

export interface NavItem {
  name: string;
  icon: React.ReactNode;
  path?: string;

  roles: Roles[];

  subItems?: Omit<NavItem, "subItems">[];
}

export const NAV_ITEMS: NavItem[] = [
  {
    name: "Dashboard",
    icon: <GridIcon />,
    path: "/",
    roles: [1, 2, 3],
  },

  {
    name: "Notification",
    icon: <Notification />,
    path: "/notification",
    roles: [1, 2, 3],
  },
];

// Create src/types/nav.ts

// // src/types/nav.ts
// export type Role = 'admin' | 'editor' | 'viewer' | 'guest' // extend as needed

// export interface NavItem {
//   name: string
//   icon: React.ReactNode
//   path?: string
//   /** list of roles that are allowed to see this entry */
//   roles: Role[]
//   /** optional submenu items – they inherit the same role checking */
//   subItems?: Omit<NavItem, 'subItems'>[]
// }

// 2.2 Write the static navigation configuration

// Create src/config/navConfig.ts

// // src/config/navConfig.ts
// import { NavItem } from '@/types/nav'
// import {
//   GridIcon,
//   ListIcon,
//   BoxCubeIcon,
//   CalenderIcon,
//   // … import any other icons you use
// } from '@/icons'

// export const NAV_ITEMS: NavItem[] = [
//   {
//     name: 'Dashboard',
//     icon: <GridIcon />,
//     path: '/',
//     roles: ['admin', 'editor', 'viewer', 'guest'],
//   },
//   {
//     name: 'Documents',
//     icon: <ListIcon />,
//     roles: ['admin', 'editor'],
//     subItems: [
//       { name: 'Upload', path: '/incoming-upload', roles: ['admin', 'editor']
// },
//       { name: 'Incoming', path: '/incoming', roles: ['admin', 'editor'] },
//       { name: 'Outgoing', path: '/outgoing', roles: ['admin'] },
//     ],
//   },
//   // ← add more top‑level sections here
// ]

//  2.3 Expose the current user’s role(s)

// If you already have a UserContext that supplies user info, just add a roles
// field.
// Otherwise create a tiny context that only returns roles.

// src/context/UserContext.tsx (add/extend)

// import { createContext, useContext, ReactNode } from 'react'

// export type Role = 'admin' | 'editor' | 'viewer' | 'guest' // keep in sync
// with types/nav.ts

// interface User {
//   id: string
//   name: string
//   email: string
//   roles: Role[]
//   // …other fields you need
// }

// interface UserContextProps {
//   user: User | null
//   // optional: a helper `hasRole` to make checks easier
//   hasRole: (role: Role) => boolean
// }

// const UserContext = createContext<UserContextProps>({
//   user: null,
//   hasRole: () => false,
// })

// export const UserProvider = ({ children }: { children: ReactNode }) => {
//   // TODO: replace the stub with real auth logic (e.g. fetch from backend)
//   const fakeUser: User = {
//     id: '123',
//     name: 'Brian Gierze',
//     email: 'brian@example.com',
//     roles: ['admin', 'editor'], // <-- adjust for testing
//   }

//   const hasRole = (role: Role) => fakeUser.roles.includes(role)

//   return (
//     <UserContext.Provider value={{ user: fakeUser, hasRole }}>
//       {children}
//     </UserContext.Provider>
//   )
// }

// export const useUser = () => useContext(UserContext)

// ▎ If you already have a provider, just add roles: Role[] to the user object
// ▎ and export a hasRole helper.

// 2.4 Create a hook that filters the navigation list

// src/hooks/useFilteredNav.ts

// // src/hooks/useFilteredNav.ts
// import { useMemo } from 'react'
// import { NAV_ITEMS } from '@/config/navConfig'
// import { NavItem, Role } from '@/types/nav'
// import { useUser } from '@/context/UserContext'

// /**
//  * Returns a list of navigation items that the current user is allowed to see.
//  * Sub‑items are filtered automatically.
//  */
// export const useFilteredNav = (): NavItem[] => {
//   const { user } = useUser()

//   // If there is no logged‑in user, fall back to an empty array (or a guest
// role)
//   const userRoles: Role[] = user?.roles ?? ['guest']

//   // Helper to test whether any of the item’s allowed roles intersect the
// userRoles
//   const isAllowed = (allowed: Role[]) => allowed.some(r =>
// userRoles.includes(r))

//   // Memoise so we only recompute when user.roles changes
//   return useMemo(() => {
//     return NAV_ITEMS.reduce<NavItem[]>((acc, item) => {
//       if (!isAllowed(item.roles)) return acc // skip whole top‑level item

//       // If the item has a submenu, filter those as well
//       const filteredSub = item.subItems?.filter(si => isAllowed(si.roles))

//       acc.push({
//         ...item,
//         subItems: filteredSub,
//       })
//       return acc
//     }, [])
//   }, [userRoles])
// }

// 2.5 Wire the hook into AppSidebar

// Edit src/layout/AppSidebar.tsx (only a few lines change).

// /* ------------------------------------------------------------------ */
// /* 1️⃣   Imports – replace the hard‑coded nav definition with the hook   */
// /* ------------------------------------------------------------------ */
// import { useFilteredNav } from '@/hooks/useFilteredNav'   // ← NEW
// /* ------------------------------------------------------------------ */

// const AppSidebar: React.FC = () => {
//   // … existing sidebar state hooks …

//   /* ------------------------------------------------------------------ */
//   /* 2️⃣   Get the role‑filtered navigation items                         */
//   /* ------------------------------------------------------------------ */
//   const navItems = useFilteredNav()   // ← now dynamic per role

//   /* ------------------------------------------------------------------ */
//   /* 3️⃣   (optional) keep a static “others” section – you can also move it */
//   /*    to the config file if you want it role‑aware.                   */
//   /* ------------------------------------------------------------------ */
//   const othersItems: NavItem[] = []   // keep empty for now or move to config

//   // … rest of the component stays exactly the same …
// }
