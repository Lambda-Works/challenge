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
      const response = await apiClient.get<Contact[]>('/contacts', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
  },

  // Get a single contact
  getById: async (id: number): Promise<Contact> => {
    try {
      const response = await apiClient.get<Contact>(`/contacts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching contact with id ${id}:`, error);
      throw error;
    }
  },

  // Create a new contact
  create: async (contact: CreateContactRequest): Promise<Contact> => {
    try {
      const response = await apiClient.post<Contact>('/contacts', contact);
      return response.data;
    } catch (error) {
      console.error('Error creating contact:', error);
      throw error;
    }
  },

  // Update a contact
  update: async (id: number, contact: UpdateContactRequest): Promise<Contact> => {
    try {
      const response = await apiClient.put<Contact>(`/contacts/${id}`, contact);
      return response.data;
    } catch (error) {
      console.error(`Error updating contact with id ${id}:`, error);
      throw error;
    }
  },

  // Delete a contact
  delete: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/contacts/${id}`);
    } catch (error) {
      console.error(`Error deleting contact with id ${id}:`, error);
      throw error;
    }
  },
};
