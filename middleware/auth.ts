export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated } = useAuthExtended()
  
  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }
})