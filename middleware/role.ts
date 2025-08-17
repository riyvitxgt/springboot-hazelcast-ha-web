export default defineNuxtRouteMiddleware((to, from) => {
  const { hasAnyRole } = useAuthExtended()
  
  const requiredRoles = to.meta.roles as string[]
  
  if (requiredRoles && !hasAnyRole(requiredRoles)) {
    throw createError({
      statusCode: 403,
      statusMessage: '角色权限不足'
    })
  }
})