'use client';

import { useState, useEffect, useRef } from 'react';
import { Contact, CreateContactRequest, UpdateContactRequest } from '@/types/contact';
import { contactsApi } from '@/services/api';

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch contacts
  const fetchContacts = async (search?: string) => {
    // Diferenciar carga inicial/reset de búsqueda activa
    if (search) {
      setIsSearching(true);
    } else {
      setIsLoading(true);
    }
    setError(null);
    try {
      const data = await contactsApi.getAll(search);
      setContacts(data);
      setCurrentPage(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar contactos');
      console.error('Error fetching contacts:', err);
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  };

  // Create contact
  const createContact = async (data: CreateContactRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const newContact = await contactsApi.create(data);
      setContacts([...contacts, newContact]);
      return newContact;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al crear contacto';
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Update contact
  const updateContact = async (id: number, data: UpdateContactRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = await contactsApi.update(id, data);
      setContacts(contacts.map((c) => (c.id === id ? updated : c)));
      return updated;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al actualizar contacto';
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete contact
  const deleteContact = async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await contactsApi.delete(id);
      setContacts(contacts.filter((c) => c.id !== id));
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al eliminar contacto';
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Get paginated contacts
  const getPaginatedContacts = () => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return contacts.slice(start, end);
  };

  // Get total pages
  const getTotalPages = () => {
    return Math.ceil(contacts.length / itemsPerPage);
  };

  // Flag para evitar el doble fetch en el primer render
  const isFirstRender = useRef(true);

  // Effect for search debounce
  // Bug 3 fix: resetea la página INMEDIATAMENTE al cambiar la búsqueda,
  // sin esperar a que llegue la respuesta del backend.
  // Optimización: salta el debounce en el primer render (el initial fetch lo maneja).
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setCurrentPage(1); // Reset instantáneo de página al buscar

    const debounceTimer = setTimeout(() => {
      fetchContacts(searchQuery || undefined);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Initial fetch (único, sin interferir con el debounce)
  useEffect(() => {
    fetchContacts();
  }, []);

  return {
    contacts: getPaginatedContacts(),
    allContacts: contacts,
    isLoading,
    isSearching,
    error,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages: getTotalPages(),
    fetchContacts,
    createContact,
    updateContact,
    deleteContact,
  };
}
