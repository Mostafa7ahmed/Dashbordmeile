export interface Pagination {
    moveNext: boolean;
    movePrevious: boolean;
    pageSize: number;
    currentPage: number;
    totalCount: number;
    totalPages: number;
}
