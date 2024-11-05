import React from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface TranslationInputProps {
  value: string;
  onChange: (value: string) => void;
  onTranslate: () => void;
  isLoading: boolean;
  placeholder?: string;
}

function TranslationInput({
  value,
  onChange,
  onTranslate,
  isLoading,
  placeholder = 'Enter text to translate...',
}: TranslationInputProps) {
  return (
    <div className="space-y-4">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[120px]"
      />
      <div className="flex justify-end">
        <Button
          onClick={onTranslate}
          disabled={!value.trim() || isLoading}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Translate
        </Button>
      </div>
    </div>
  );
}

export default TranslationInput;
