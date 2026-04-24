'use client';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onCreateClick?: () => void;
}

export function SearchBar({ value, onChange, onCreateClick }: SearchBarProps) {
  return (
    <div className="flex gap-2 mb-6">
      <input
        type="text"
        placeholder="Buscar por nombre, email o teléfono..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={onCreateClick}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
      >
        + Nuevo
      </button>
    </div>
  );
}
