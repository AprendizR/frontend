export interface PageResponse<T> {
  content: T[]
  page: {
    totalPages: number
    totalElements: number
    number: number
    size: number
  }
}