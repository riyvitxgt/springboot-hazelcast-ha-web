export const useAuthExtended = () => {
  const { data: session, signIn, signOut, getSession } = useAuth()
  
  const user = computed(() => session.value)
  const isAuthenticated = computed(() => !!session.value)
  
  const hasPermission = (permission: string): boolean => {
    if (!user.value) return false
    return user.value.permissions.some(p => p.code === permission)
  }
  
  const hasRole = (role: string): boolean => {
    if (!user.value) return false
    return user.value.roles.some(r => r.code === role)
  }
  
  const hasAnyRole = (roles: string[]): boolean => {
    if (!user.value) return false
    return user.value.roles.some(r => roles.includes(r.code))
  }
  
  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!user.value) return false
    return user.value.permissions.some(p => permissions.includes(p.code))
  }
  
  return {
    user: readonly(user),
    isAuthenticated: readonly(isAuthenticated),
    signIn,
    signOut,
    getSession,
    hasPermission,
    hasRole,
    hasAnyRole,
    hasAnyPermission
  }
}