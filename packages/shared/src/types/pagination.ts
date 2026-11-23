export type PaginationRequest = {
  page: number;
  pageSize: number;
};

export type Pagination = PaginationRequest & {
  totalItems: number;
  totalPages: number;
};

export type PaginatedResult<Item> = {
  data: Item[];
  pagination: Pagination;
};
