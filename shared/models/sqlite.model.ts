export interface DbQueryRequest {
  sql: string;
  params?: any[];
}

export interface DbQueryResponse<T = any> {
  success: boolean;
  data?: T[];
  error?: string;
  changes?: number;
  lastInsertRowid?: number;
}
