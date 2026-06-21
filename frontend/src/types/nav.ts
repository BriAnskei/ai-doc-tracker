// src/types/nav.ts
// Role definitions – match the numeric values from UserContext
export type Role = 1 | 2 | 3 // 1 = super_admin, 2 = admin, 3 = receiver

export interface NavItem {
  /** Display name */
  name: string
  /** Icon component */
  icon: React.ReactNode
  /** URL path (if leaf) */
  path?: string
  /** Roles that are allowed to see this entry */
  roles: Role[]
  /** Optional submenu items – they inherit the same shape */
  subItems?: Omit<NavItem, 'subItems'>[]
}
