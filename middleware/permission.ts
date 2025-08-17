export default defineNuxtRouteMiddleware((to, from) => {
  const { hasPermission } = useAuthExtended()
  
  const requiredPermission = to.meta.permission as string
  
  if (requiredPermission && !hasPermission(requiredPermission)) {
    throw createError({
      statusCode: 403,
      statusMessage: '权限不足'
    })
  }
})