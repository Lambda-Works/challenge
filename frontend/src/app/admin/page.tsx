'use client';

import { logout } from '@/lib/auth';
import { useContacts } from '@/hooks/useContacts';
import { ContactTable } from '@/components/ContactTable/ContactTable';
import { SearchBar } from '@/components/SearchBar/SearchBar';
import { ContactModal } from '@/components/ContactForm/ContactModal';
import { useState } from 'react';
import { Contact } from '@/types/contact';

export default function AdminPanel() {
  const {
    contacts,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
    deleteContact,
    createContact,
    updateContact,
  } = useContacts();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | undefined>(undefined);

  const handleDeleteClick = (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este contacto como administrador?')) {
      deleteContact(id);
    }
  };

  const handleCreateClick = () => {
    setSelectedContact(undefined);
    setIsModalOpen(true);
  };

  const handleEditClick = (contact: Contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (data: any) => {
    if (selectedContact) {
      await updateContact(selectedContact.id, data);
    } else {
      await createContact(data);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header del Panel */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              🛡️ Panel de Control
            </h1>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded dark:bg-blue-900 dark:text-blue-300">
              Admin Mode
            </span>
          </div>
          <button
            onClick={() => logout()}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Contenido del Panel */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider">
              Total de Contactos Registrados
            </h3>
            <p className="mt-2 text-3xl font-semibold text-blue-600 dark:text-blue-400">
              {contacts.length}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider">
              Estado de la Base de Datos
            </h3>
            <p className="mt-2 text-xl font-semibold text-green-600 dark:text-green-400 flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
              Conectado
            </p>
          </div>
        </div>

        {/* Sección de Gestión */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Gestión de Contactos Global</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Visualiza y administra todos los registros del sistema.</p>
          </div>

          <div className="p-6">
            {/* Buscador */}
            <div className="mb-6">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onCreateClick={handleCreateClick} 
              />
            </div>

            {/* Mensaje de Error */}
            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {/* Tabla de Contactos */}
            <ContactTable
              contacts={contacts}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>

      {/* Modal de Creación/Edición */}
      <ContactModal
        isOpen={isModalOpen}
        contact={selectedContact}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
