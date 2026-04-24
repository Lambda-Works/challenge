'use client';

import { useState, useEffect, useCallback } from 'react';
import { Contact, CreateContactRequest, UpdateContactRequest } from '@/types/contact';
import { contactsApi } from '@/services/api';
import type { SortOption } from '@/components/SortDropdown/SortDropdown';

// Read initial state from URL params
function getInitialParams() {
  if (typeof window === 'undefined') {
    return { search: '', favorite: 'all' as const, sortBy: 'name_asc' as SortOption };
  }
  const params = new URLSearchParams(window.location.search);
  return {
    search: params.get('search') || '',
    favorite: (params.get('favorite') === 'true' ? 'favorites' : 'all') as 'all' | 'favorites',
    sortBy: (params.get('sortBy') || 'name_asc') as SortOption,
  };
}

export function useContacts() {
  const initial = getInitialParams();

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(initial.search);
  const [currentPage, setCurrentPage] = useState(1);
  const [favoriteFilter, setFavoriteFilter] = useState<'all' | 'favorites'>(initial.favorite);
  const [sortBy, setSortBy] = useState<SortOption>(initial.sortBy);
  const itemsPerPage = 10;

  // Sync filters to URL
  const syncUrlParams = useCallback(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (favoriteFilter === 'favorites') params.set('favorite', 'true');
    if (sortBy !== 'name_asc') params.set('sortBy', sortBy);

    const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;
    window.history.replaceState({}, '', newUrl);
  }, [searchQuery, favoriteFilter, sortBy]);

  // Update URL whenever filters change
  useEffect(() => {
    syncUrlParams();
  }, [syncUrlParams]);

  // Fetch contacts
  const fetchContacts = useCallback(async (search?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const favorite = favoriteFilter === 'favorites' ? true : undefined;
      const data = await contactsApi.getAll(search, favorite, sortBy);
      setContacts(data);
      setCurrentPage(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar contactos');
      console.error('Error fetching contacts:', err);
    } finally {
      setIsLoading(false);
    }
  }, [favoriteFilter, sortBy]);

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

  // Toggle favorite (optimistic update)
  const toggleFavorite = async (id: number) => {
    const previousContacts = [...contacts];
    // Optimistic update
    setContacts(contacts.map((c) =>
      c.id === id ? { ...c, isFavorite: !c.isFavorite } : c
    ));
    try {
      await contactsApi.toggleFavorite(id);
    } catch (err) {
      // Revert on error
      setContacts(previousContacts);
      setError('Error al actualizar favorito');
      throw err;
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setFavoriteFilter('all');
    setSortBy('name_asc');
  };

  // Check if any filter is active (non-default)
  const hasActiveFilters = searchQuery !== '' || favoriteFilter !== 'all' || sortBy !== 'name_asc';

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

  // Effect for search debounce
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery) {
        fetchContacts(searchQuery);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, fetchContacts]);

  // Refetch when favorite filter or sortBy changes
  useEffect(() => {
    fetchContacts(searchQuery || undefined);
  }, [favoriteFilter, sortBy, fetchContacts]);

  // Initial fetch
  useEffect(() => {
    fetchContacts(searchQuery || undefined);
  }, [fetchContacts]);

  return {
    contacts: getPaginatedContacts(),
    allContacts: contacts,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages: getTotalPages(),
    favoriteFilter,
    setFavoriteFilter,
    sortBy,
    setSortBy,
    clearFilters,
    hasActiveFilters,
    fetchContacts,
    createContact,
    updateContact,
    deleteContact,
    toggleFavorite,
  };
}
