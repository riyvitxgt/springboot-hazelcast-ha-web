import type { MenuItem } from '~/types/auth'

export const useMenu = () => {
  const { hasPermission, hasAnyRole } = useAuthExtended()
  
  const menuItems: MenuItem[] = [
    {
      title: '仪表盘',
      icon: 'mdi-view-dashboard',
      to: '/dashboard',
      permission: 'dashboard:read'
    },
    {
      title: '用户管理',
      icon: 'mdi-account-group',
      children: [
        {
          title: '用户列表',
          icon: 'mdi-account-multiple',
          to: '/users',
          permission: 'user:read'
        },
        {
          title: '角色管理',
          icon: 'mdi-account-key',
          to: '/roles',
          permission: 'role:read'
        },
        {
          title: '权限管理',
          icon: 'mdi-shield-account',
          to: '/permissions',
          permission: 'permission:read'
        }
      ]
    },
    {
      title: '系统管理',
      icon: 'mdi-cog',
      children: [
        {
          title: '系统设置',
          icon: 'mdi-cog-outline',
          to: '/system/settings',
          permission: 'system:manage'
        },
        {
          title: '日志管理',
          icon: 'mdi-text-box-outline',
          to: '/system/logs',
          permission: 'system:log:read'
        }
      ],
      roles: ['ADMIN', 'SUPER_ADMIN']
    }
  ]
  
  const filterMenuItems = (items: MenuItem[]): MenuItem[] => {
    return items.filter(item => {
      // 检查权限
      if (item.permission && !hasPermission(item.permission)) {
        return false
      }
      
      // 检查角色
      if (item.roles && !hasAnyRole(item.roles)) {
        return false
      }
      
      // 如果有子菜单，递归过滤
      if (item.children) {
        item.children = filterMenuItems(item.children)
        return item.children.length > 0
      }
      
      return true
    })
  }
  
  const filteredMenuItems = computed(() => filterMenuItems([...menuItems]))
  
  return {
    menuItems: readonly(filteredMenuItems)
  }
}