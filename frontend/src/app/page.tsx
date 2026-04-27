'use client';
//new
import { useState, useEffect } from 'react';
import { SearchBar } from '@/components/SearchBar/SearchBar';
import { ContactTable } from '@/components/ContactTable/ContactTable';
import { ContactModal } from '@/components/ContactForm/ContactModal';
import { useContacts } from '@/hooks/useContacts';
import { Contact, CreateContactRequest, UpdateContactRequest } from '@/types/contact';
import { useTheme } from 'next-themes';

export default function Home() {
  const {
    contacts,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
    createContact,
    updateContact,
    deleteContact,
  } = useContacts();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | undefined>();
  const [modalLoading, setModalLoading] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
            {theme === 'dark' ? 'Claro' : 'Oscuro'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Info section */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Total de contactos: <span className="font-semibold">{contacts.length}</span>
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

        {/* Contact Table */}
        <ContactTable
          contacts={contacts}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          isLoading={isLoading}
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
    </div>
  );
}
