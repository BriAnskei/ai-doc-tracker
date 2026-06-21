// src/hooks/useFilteredNav.ts
// Hook that returns the navigation items the current user is allowed to see.
// It reads the role from UserContext (numeric IDs) and filters the config.

import { useMemo } from 'react'
import { NAV_ITEMS, NavItem as ConfigNavItem } from '@/config/navConfig'
import { userUser } from '@/context/UserContext' // exported helper (named userUser)
import { NavItem, Role } from '@/types/nav'

/**
 * Convert the raw config items (which use the same NavItem shape) into the
 * filtered list based on the current role. This hook is tiny and memoised so
 * the sidebar re‑renders only when the role changes.
 */
export const useFilteredNav = (): NavItem[] => {
  const { role } = userUser()

  // If no role is set (e.g., not logged in) we return an empty array – the UI
  // can decide to show a guest navigation set elsewhere.
  const currentRole = role as Role | undefined

  return useMemo(() => {
    if (!currentRole) return []

    const filterItem = (item: ConfigNavItem): NavItem | null => {
      if (!item.roles.includes(currentRole)) return null

      const filteredSub = item.subItems?.filter((sub) =>
        sub.roles.includes(currentRole),
      )

      return {
        name: item.name,
        icon: item.icon,
        path: item.path,
        roles: item.roles,
        subItems: filteredSub
          ? filteredSub.map((s) => ({
              name: s.name,
              path: s.path,
              // sub items never have further nesting, so we omit roles here
            }))
          : undefined,
      }
    }

    return NAV_ITEMS.map(filterItem).filter(Boolean) as NavItem[]
  }, [currentRole])
}
