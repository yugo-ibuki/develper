import React from 'react';
import { Loader2 } from 'lucide-react';

interface TranslationInputProps {
  value: string;
  onChange: (value: string) => void;
  onTranslate: () => void;
  isLoading: boolean;
}

function TranslationInput({ value, onChange, onTranslate, isLoading }: TranslationInputProps) {
  return (
    <div className="space-y-4">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter text to translate..."
        className="h-32 w-full resize-none rounded-lg border border-gray-200 p-4 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
        disabled={isLoading}
      />
      <button
        onClick={onTranslate}
        disabled={!value.trim() || isLoading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Translating...
          </>
        ) : (
          'Translate'
        )}
      </button>
    </div>
  );
}

export default TranslationInput;
