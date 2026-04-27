'use client';

import { useState, useEffect, useCallback } from 'react';
import { SearchBar } from '@/components/SearchBar/SearchBar';
import { ContactTable } from '@/components/ContactTable/ContactTable';
import { ContactModal } from '@/components/ContactForm/ContactModal';
import { Toast } from '@/components/Toast/Toast';
import { SortDropdown } from '@/components/SortDropdown/SortDropdown';
import { useContacts } from '@/hooks/useContacts';
import { Contact, CreateContactRequest, UpdateContactRequest } from '@/types/contact';
import { useTheme } from 'next-themes';

export default function Home() {
  const {
    contacts,
    allContacts,
    totalCount,
    favoriteCount,
    isLoading,
    isSearching,
    error,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
    favoriteFilter,
    setFavoriteFilter,
    sortBy,
    setSortBy,
    clearFilters,
    hasActiveFilters,
    createContact,
    updateContact,
    deleteContact,
    toggleFavorite,
  } = useContacts();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | undefined>();
  const [modalLoading, setModalLoading] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Toast state
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showToastMessage = useCallback((message: string) => {
    setToastMessage(message);
    setShowToast(true);
  }, []);

  const handleCreateClick = () => {
    setSelectedContact(undefined);
    setIsModalOpen(true);
  };

  const handleEditClick = (contact: Contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedContact(undefined);
  };

  const handleSubmitModal = async (data: CreateContactRequest) => {
    setModalLoading(true);
    try {
      if (selectedContact) {
        await updateContact(selectedContact.id, data as UpdateContactRequest);
      } else {
        await createContact(data);
      }
      handleCloseModal();
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este contacto?')) {
      deleteContact(id);
    }
  };

  const handleToggleFavorite = async (id: number) => {
    const contact = allContacts.find((c) => c.id === id);
    const willBeFavorite = contact ? !contact.isFavorite : true;
    try {
      await toggleFavorite(id);
      showToastMessage(
        willBeFavorite ? '⭐ Agregado a favoritos' : 'Removido de favoritos'
      );
    } catch {
      showToastMessage('❌ Error al actualizar favorito');
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">📇 Mis Contactos</h1>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {theme === 'dark' ? '☀️ Claro' : '🌙 Oscuro'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Info section */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Mostrando: <span className="font-semibold">{contacts.length}</span> de <span className="font-semibold">{totalCount}</span> contactos
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-lg">
            {error}
          </div>
        )}

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onCreateClick={handleCreateClick}
        />

        {/* Filter Bar: Tabs + Sort Dropdown + Clear */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {/* Favorite Tabs */}
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setFavoriteFilter('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                favoriteFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Todos ({totalCount})
            </button>
            <button
              onClick={() => setFavoriteFilter('favorites')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                favoriteFilter === 'favorites'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              ⭐ Favoritos ({favoriteCount})
            </button>
          </div>

          {/* Separator */}
          <div className="hidden sm:block w-px h-8 bg-gray-300 dark:bg-gray-600" />

          {/* Sort Dropdown */}
          <SortDropdown value={sortBy} onChange={setSortBy} />

          {/* Separator */}
          {hasActiveFilters && (
            <div className="hidden sm:block w-px h-8 bg-gray-300 dark:bg-gray-600" />
          )}

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors font-medium"
            >
              ✕ Limpiar filtros
            </button>
          )}
        </div>

        {/* Contact Table */}
        <ContactTable
          contacts={contacts}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onToggleFavorite={handleToggleFavorite}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          isLoading={isLoading}
          isSearching={isSearching}
          searchQuery={searchQuery}
        />
      </main>

      {/* Contact Modal */}
      <ContactModal
        isOpen={isModalOpen}
        contact={selectedContact}
        onClose={handleCloseModal}
        onSubmit={handleSubmitModal}
        isLoading={modalLoading}
      />

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
