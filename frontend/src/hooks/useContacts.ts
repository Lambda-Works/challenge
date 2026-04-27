'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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
  const [totalCount, setTotalCount] = useState(0);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
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
      const response = await contactsApi.getAll(search, favorite, sortBy);
      setContacts(response.data);
      setTotalCount(response.totalCount || 0);
      setFavoriteCount(response.favoriteCount || 0);
      setCurrentPage(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar contactos');
      console.error('Error fetching contacts:', err);
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  }, [favoriteFilter, sortBy]);

  // Create contact
  const createContact = async (data: CreateContactRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const newContact = await contactsApi.create(data);
      await fetchContacts(searchQuery || undefined); // Refetch to get updated counts
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
      await fetchContacts(searchQuery || undefined); // Refetch to get updated counts
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
      await fetchContacts(searchQuery || undefined); // Refetch to get updated counts
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
    const previousFavCount = favoriteCount;

    // Optimistic update
    setContacts(contacts.map((c) => {
      if (c.id === id) {
        const nextFav = !c.isFavorite;
        setFavoriteCount(prev => nextFav ? prev + 1 : prev - 1);
        return { ...c, isFavorite: nextFav };
      }
      return c;
    }));

    try {
      await contactsApi.toggleFavorite(id);
      // Opcionalmente podrías hacer fetchContacts para sincronizar todo
    } catch (err) {
      // Revert on error
      setContacts(previousContacts);
      setFavoriteCount(previousFavCount);
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
  }, [searchQuery, fetchContacts]);

  // Refetch when favorite filter or sortBy changes
  useEffect(() => {
    fetchContacts(searchQuery || undefined);
  }, [favoriteFilter, sortBy, fetchContacts]);

  return {
    contacts: getPaginatedContacts(),
    allContacts: contacts,
    totalCount,
    favoriteCount,
    isLoading,
    isSearching,
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
