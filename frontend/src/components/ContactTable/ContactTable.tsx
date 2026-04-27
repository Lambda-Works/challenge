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
  isSearching?: boolean;
  searchQuery?: string;
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
  isSearching,
  searchQuery,
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
        <div className="flex flex-col items-center gap-3 text-gray-500 dark:text-gray-400">
          <div className="w-8 h-8 border-4 border-gray-300 dark:border-gray-600 border-t-blue-500 rounded-full animate-spin" />
          <span>Cargando contactos...</span>
        </div>
      </div>
    );
  }

  if (isSearching) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center gap-3 text-gray-500 dark:text-gray-400">
          <div className="w-8 h-8 border-4 border-gray-300 dark:border-gray-600 border-t-blue-500 rounded-full animate-spin" />
          <span>Buscando usuarios...</span>
        </div>
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500 dark:text-gray-400">
          {searchQuery
            ? `No se encontraron contactos para "${searchQuery}"`
            : 'No hay contactos para mostrar'}
        </div>
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
        <div className="flex justify-center items-center gap-1 mt-6 flex-wrap">
          {/* Botón Anterior */}
          <button
            onClick={() => onPageChange?.(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            ←
          </button>

          {/* Números de página con elipsis */}
          {(() => {
            const pages: (number | null)[] = [];

            if (totalPages <= 7) {
              for (let i = 1; i <= totalPages; i++) pages.push(i);
            } else {
              pages.push(1);
              if (currentPage > 3) pages.push(null);
              for (
                let i = Math.max(2, currentPage - 1);
                i <= Math.min(totalPages - 1, currentPage + 1);
                i++
              ) {
                pages.push(i);
              }
              if (currentPage < totalPages - 2) pages.push(null);
              pages.push(totalPages);
            }

            return pages.map((page, index) =>
              page === null ? (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 py-2 text-sm text-gray-400 dark:text-gray-500 select-none"
                >
                  …
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => onPageChange?.(page)}
                  className={`px-3 py-2 text-sm rounded transition-colors ${
                    page === currentPage
                      ? 'bg-blue-500 text-white font-semibold cursor-default'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {page}
                </button>
              )
            );
          })()}

          {/* Botón Siguiente */}
          <button
            onClick={() => onPageChange?.(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
