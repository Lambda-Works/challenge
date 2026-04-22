import axios from 'axios';
import { Contact, CreateContactRequest, UpdateContactRequest, ApiResponse } from '@/types/contact';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const contactsApi = {
  // Get all contacts or search
  getAll: async (search?: string): Promise<Contact[]> => {
    try {
      const params = search ? { search } : {};
      const response = await apiClient.get<ApiResponse<Contact[]>>('/contacts', { params });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // Get single contact
  getOne: async (id: number): Promise<Contact> => {
    try {
      const response = await apiClient.get<ApiResponse<Contact>>(`/contacts/${id}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // Create contact
  create: async (data: CreateContactRequest): Promise<Contact> => {
    try {
      const response = await apiClient.post<ApiResponse<Contact>>('/contacts', data);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // Update contact
  update: async (id: number, data: UpdateContactRequest): Promise<Contact> => {
    try {
      const response = await apiClient.put<ApiResponse<Contact>>(`/contacts/${id}`, data);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete contact
  delete: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/contacts/${id}`);
    } catch (error) {
      throw error;
    }
  },
};
