import { ArrowRight, Loader2 } from 'lucide-react';
import React, { type KeyboardEvent } from 'react';

interface TranslationInputProps {
  value: string;
  onChange: (value: string) => void;
  onTranslate: () => void;
  isLoading: boolean;
  sourceLang: string;
  targetLang: string;
  onSwapLanguages: () => void;
}

function TranslationInput({
  value,
  onChange,
  onTranslate,
  isLoading,
  sourceLang,
  targetLang,
  onSwapLanguages,
}: TranslationInputProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl + Enter または Command + Enter で実行
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (value.trim() && !isLoading) {
        onTranslate();
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-4">
        <button
          className="rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 hover:bg-gray-200"
          onClick={onSwapLanguages}
        >
          {sourceLang}
        </button>
        <ArrowRight className="h-5 w-5 text-gray-400" />
        <button
          className="rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 hover:bg-gray-200"
          onClick={onSwapLanguages}
        >
          {targetLang}
        </button>
      </div>

      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-[200px] w-full rounded-lg border border-gray-200 p-4 focus:border-indigo-300 focus:outline-none focus:ring focus:ring-indigo-200"
          placeholder={`Enter text to translate... (Press ${navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'} + Enter to translate)`}
        />
        <button
          onClick={onTranslate}
          disabled={isLoading || !value.trim()}
          className="absolute bottom-4 right-4 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition-colors hover:bg-indigo-700 disabled:bg-gray-300"
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Translate'}
        </button>
      </div>
    </div>
  );
}

export default TranslationInput;
