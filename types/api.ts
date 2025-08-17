export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message: string
  code: number
}

export interface PaginationRequest {
  page: number
  size: number
  sort?: string
  direction?: 'asc' | 'desc'
}

export interface PaginationResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
}