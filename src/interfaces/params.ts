export interface ITableQueryParams {
    isActive?: boolean
    isDeleted?: boolean
    maxResult?: number
    sortBy?: string
    sortDirection?: "asc" | "desc"
}