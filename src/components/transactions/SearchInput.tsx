
import React from 'react';
import { Input } from '../ui/input';
import { Search } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({ value, onChange, placeholder = "Buscar transação..." }: SearchInputProps) {
  return (
    <div className="relative">
      <Input
        className="w-56 pl-8 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
    </div>
  );
}
