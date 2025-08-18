export const useApi = () => {
  const config = useRuntimeConfig()
  
  // 创建简单的 API 请求函数
  const api = async (url: string, options: any = {}) => {
    try {
      return await $fetch(url, {
        baseURL: config.public.authUrl,
        ...options
      })
    } catch (error: any) {
      if (error.status === 401 || error.statusCode === 401) {
        await navigateTo('/login')
      }
      throw error
    }
  }
  
  // 便捷方法
  const get = (url: string, options?: any) => 
    api(url, { method: 'GET', ...options })
    
  const post = (url: string, body?: any, options?: any) => 
    api(url, { method: 'POST', body, ...options })
    
  const put = (url: string, body?: any, options?: any) => 
    api(url, { method: 'PUT', body, ...options })
    
  const del = (url: string, options?: any) => 
    api(url, { method: 'DELETE', ...options })
  
  // Nuxt 3 响应式数据获取
  const useApiData = <T = any>(url: string, options?: any) => {
    return useFetch<T>(url, {
      baseURL: config.public.authUrl,
      ...options,
      onResponseError({ response }) {
        if (response.status === 401) {
          navigateTo('/login')
        }
      }
    })
  }
  
  return { 
    api,
    get,
    post,
    put,
    delete: del,
    useApiData
  }
}