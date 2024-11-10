import React, { useState } from 'react';
import { ClipboardCopy, Check, Loader2, AlertCircle } from 'lucide-react';

interface TranslationResultProps {
  provider: string;
  result: string;
  icon: string;
  isLoading: boolean;
  error?: string;
}

function TranslationResult({ provider, result, icon, isLoading, error }: TranslationResultProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          <h3 className="font-semibold text-gray-800">{provider}</h3>
        </div>
        {!isLoading && result && !error && (
          <button
            onClick={handleCopy}
            className="rounded-full p-2 text-gray-500 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
            title="Copy translation"
          >
            {copied ? (
              <Check className="h-5 w-5 text-green-500" />
            ) : (
              <ClipboardCopy className="h-5 w-5" />
            )}
          </button>
        )}
      </div>

      <div className="relative min-h-[100px] rounded-lg bg-gray-50 p-4">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 text-red-500">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        ) : (
          <p className="whitespace-pre-wrap text-gray-700">{result}</p>
        )}
      </div>
    </div>
  );
}

export default TranslationResult;
