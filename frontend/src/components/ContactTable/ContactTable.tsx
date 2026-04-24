'use client';

import { Contact } from '@/types/contact';
import { useState } from 'react';

interface ContactTableProps {
  contacts: Contact[];
  onEdit?: (contact: Contact) => void;
  onDelete?: (id: number) => void;
  onToggleFavorite?: (id: number) => void;
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  isLoading?: boolean;
}

export function ContactTable({
  contacts,
  onEdit,
  onDelete,
  onToggleFavorite,
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
}: ContactTableProps) {
  const [animatingId, setAnimatingId] = useState<number | null>(null);

  const handleFavoriteClick = (id: number) => {
    setAnimatingId(id);
    onToggleFavorite?.(id);
    setTimeout(() => setAnimatingId(null), 300);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500 dark:text-gray-400">Cargando contactos...</div>
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500 dark:text-gray-400">No hay contactos para mostrar</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600">
              <th className="w-12 px-3 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">
                ★
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                Nombre
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                Email
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                Teléfono
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr
                key={contact.id}
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <td className="w-12 px-3 py-3 text-center">
                  <button
                    onClick={() => handleFavoriteClick(contact.id)}
                    className={`text-xl cursor-pointer select-none transition-all duration-200 hover:scale-110 active:scale-125 ${
                      animatingId === contact.id ? 'scale-125' : ''
                    } ${
                      contact.isFavorite
                        ? 'text-yellow-400 drop-shadow-sm'
                        : 'text-gray-300 dark:text-gray-500 hover:text-yellow-300'
                    }`}
                    title={contact.isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                  >
                    {contact.isFavorite ? '★' : '☆'}
                  </button>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{contact.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{contact.email}</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{contact.phone}</td>
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onEdit?.(contact)}
                      className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => onDelete?.(contact.id)}
                      className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => onPageChange?.(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            ← Anterior
          </button>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => onPageChange?.(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
}
