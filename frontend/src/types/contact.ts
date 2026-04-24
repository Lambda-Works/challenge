export interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContactRequest {
  name: string;
  email: string;
  phone: string;
}

export interface UpdateContactRequest {
  name?: string;
  email?: string;
  phone?: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  total?: number;
}
