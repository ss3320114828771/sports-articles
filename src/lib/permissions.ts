// User roles
export type UserRole = 'super_admin' | 'admin' | 'manager' | 'customer'

// Permission actions
export type PermissionAction = 
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'manage'
  | 'approve'
  | 'export'
  | 'import'

// Resource types
export type ResourceType =
  | 'products'
  | 'orders'
  | 'users'
  | 'categories'
  | 'brands'
  | 'coupons'
  | 'reviews'
  | 'settings'
  | 'reports'
  | 'dashboard'

// Permission definition
export interface Permission {
  action: PermissionAction
  resource: ResourceType
}

// Role permissions mapping
const rolePermissions: Record<UserRole, Permission[]> = {
  super_admin: [
    { action: 'manage', resource: 'products' },
    { action: 'manage', resource: 'orders' },
    { action: 'manage', resource: 'users' },
    { action: 'manage', resource: 'categories' },
    { action: 'manage', resource: 'brands' },
    { action: 'manage', resource: 'coupons' },
    { action: 'manage', resource: 'reviews' },
    { action: 'manage', resource: 'settings' },
    { action: 'manage', resource: 'reports' },
    { action: 'manage', resource: 'dashboard' }
  ],

  admin: [
    { action: 'create', resource: 'products' },
    { action: 'read', resource: 'products' },
    { action: 'update', resource: 'products' },
    { action: 'delete', resource: 'products' },
    { action: 'create', resource: 'orders' },
    { action: 'read', resource: 'orders' },
    { action: 'update', resource: 'orders' },
    { action: 'read', resource: 'users' },
    { action: 'update', resource: 'users' },
    { action: 'create', resource: 'categories' },
    { action: 'read', resource: 'categories' },
    { action: 'update', resource: 'categories' },
    { action: 'delete', resource: 'categories' },
    { action: 'create', resource: 'brands' },
    { action: 'read', resource: 'brands' },
    { action: 'update', resource: 'brands' },
    { action: 'delete', resource: 'brands' },
    { action: 'create', resource: 'coupons' },
    { action: 'read', resource: 'coupons' },
    { action: 'update', resource: 'coupons' },
    { action: 'delete', resource: 'coupons' },
    { action: 'read', resource: 'reviews' },
    { action: 'approve', resource: 'reviews' },
    { action: 'read', resource: 'reports' },
    { action: 'export', resource: 'reports' },
    { action: 'read', resource: 'dashboard' }
  ],

  manager: [
    { action: 'create', resource: 'products' },
    { action: 'read', resource: 'products' },
    { action: 'update', resource: 'products' },
    { action: 'read', resource: 'orders' },
    { action: 'update', resource: 'orders' },
    { action: 'read', resource: 'users' },
    { action: 'read', resource: 'categories' },
    { action: 'read', resource: 'brands' },
    { action: 'read', resource: 'reviews' },
    { action: 'read', resource: 'reports' },
    { action: 'read', resource: 'dashboard' }
  ],

  customer: [
    { action: 'read', resource: 'products' },
    { action: 'create', resource: 'orders' },
    { action: 'read', resource: 'orders' },
    { action: 'create', resource: 'reviews' },
    { action: 'read', resource: 'reviews' }
  ]
}

// Check if user has permission
export function hasPermission(
  userRole: UserRole | undefined,
  action: PermissionAction,
  resource: ResourceType
): boolean {
  if (!userRole) return false

  const permissions = rolePermissions[userRole]
  return permissions.some(
    p => p.action === action && p.resource === resource
  )
}

// Check if user has any of the permissions
export function hasAnyPermission(
  userRole: UserRole | undefined,
  permissions: Array<{ action: PermissionAction; resource: ResourceType }>
): boolean {
  if (!userRole) return false

  return permissions.some(({ action, resource }) =>
    hasPermission(userRole, action, resource)
  )
}

// Check if user has all permissions
export function hasAllPermissions(
  userRole: UserRole | undefined,
  permissions: Array<{ action: PermissionAction; resource: ResourceType }>
): boolean {
  if (!userRole) return false

  return permissions.every(({ action, resource }) =>
    hasPermission(userRole, action, resource)
  )
}

// Get user permissions
export function getUserPermissions(userRole: UserRole): Permission[] {
  return rolePermissions[userRole] || []
}

// Check if user can manage resource
export function canManage(userRole: UserRole | undefined, resource: ResourceType): boolean {
  return hasPermission(userRole, 'manage', resource)
}

// Check if user can create resource
export function canCreate(userRole: UserRole | undefined, resource: ResourceType): boolean {
  return hasPermission(userRole, 'create', resource)
}

// Check if user can read resource
export function canRead(userRole: UserRole | undefined, resource: ResourceType): boolean {
  return hasPermission(userRole, 'read', resource)
}

// Check if user can update resource
export function canUpdate(userRole: UserRole | undefined, resource: ResourceType): boolean {
  return hasPermission(userRole, 'update', resource)
}

// Check if user can delete resource
export function canDelete(userRole: UserRole | undefined, resource: ResourceType): boolean {
  return hasPermission(userRole, 'delete', resource)
}

// Check if user can approve resource
export function canApprove(userRole: UserRole | undefined, resource: ResourceType): boolean {
  return hasPermission(userRole, 'approve', resource)
}

// Check if user can export resource
export function canExport(userRole: UserRole | undefined, resource: ResourceType): boolean {
  return hasPermission(userRole, 'export', resource)
}

// Check if user is admin (super_admin or admin)
export function isAdmin(userRole: UserRole | undefined): boolean {
  return userRole === 'super_admin' || userRole === 'admin'
}

// Check if user is super admin
export function isSuperAdmin(userRole: UserRole | undefined): boolean {
  return userRole === 'super_admin'
}

// Check if user is manager or above
export function isManagerOrAbove(userRole: UserRole | undefined): boolean {
  return userRole === 'super_admin' || userRole === 'admin' || userRole === 'manager'
}

// Get role hierarchy level
export function getRoleLevel(userRole: UserRole): number {
  const levels: Record<UserRole, number> = {
    super_admin: 4,
    admin: 3,
    manager: 2,
    customer: 1
  }
  return levels[userRole] || 0
}

// Check if role has higher or equal level
export function hasMinLevel(userRole: UserRole | undefined, minRole: UserRole): boolean {
  if (!userRole) return false
  return getRoleLevel(userRole) >= getRoleLevel(minRole)
}

// Get all roles
export function getRoles(): UserRole[] {
  return ['super_admin', 'admin', 'manager', 'customer']
}

// Get role display name
export function getRoleDisplayName(role: UserRole): string {
  const names: Record<UserRole, string> = {
    super_admin: 'Super Admin',
    admin: 'Admin',
    manager: 'Manager',
    customer: 'Customer'
  }
  return names[role]
}

// Get role description
export function getRoleDescription(role: UserRole): string {
  const descriptions: Record<UserRole, string> = {
    super_admin: 'Full access to all features and settings',
    admin: 'Access to most features except system settings',
    manager: 'Can manage products and view orders',
    customer: 'Can view products and place orders'
  }
  return descriptions[role]
}

// Get permissions by resource
export function getPermissionsByResource(
  userRole: UserRole,
  resource: ResourceType
): PermissionAction[] {
  const permissions = getUserPermissions(userRole)
  return permissions
    .filter(p => p.resource === resource)
    .map(p => p.action)
}

// Check if user can access dashboard
export function canAccessDashboard(userRole: UserRole | undefined): boolean {
  return hasPermission(userRole, 'read', 'dashboard')
}

// Get accessible resources
export function getAccessibleResources(userRole: UserRole): ResourceType[] {
  const permissions = getUserPermissions(userRole)
  const resources = new Set(permissions.map(p => p.resource))
  return Array.from(resources)
}

// Role-based route protection
export function isRouteAccessible(
  userRole: UserRole | undefined,
  path: string
): boolean {
  if (!userRole) return false

  // Public routes
  const publicRoutes = ['/', '/about', '/contact', '/products', '/shop']
  if (publicRoutes.some(route => path.startsWith(route))) {
    return true
  }

  // Dashboard routes
  if (path.startsWith('/dashboard')) {
    return canAccessDashboard(userRole)
  }

  // Admin routes
  if (path.startsWith('/admin')) {
    return isAdmin(userRole)
  }

  // User profile routes
  if (path.startsWith('/profile')) {
    return true // Any logged in user
  }

  return true
}

// Get role-based redirect path
export function getRoleRedirectPath(userRole: UserRole): string {
  switch (userRole) {
    case 'super_admin':
    case 'admin':
    case 'manager':
      return '/dashboard'
    default:
      return '/'
  }
}