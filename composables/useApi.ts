export const useApi = () => {
  const config = useRuntimeConfig()
  const { $fetch } = useNuxtApp()
  
  const api = $fetch.create({
    baseURL: config.public.authUrl,
    onRequest({ request, options }) {
      const { session } = useAuth()
      if (session.value?.token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${session.value.token}`
        }
      }
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        const { signOut } = useAuth()
        signOut()
        navigateTo('/login')
      }
    }
  })
  
  return { api }
}