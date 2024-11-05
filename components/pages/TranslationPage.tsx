import React, { useState } from 'react';
import { Languages } from 'lucide-react';
import TranslationResult from '@/components/TranslationResult';
import TranslationInput from '@/components/TranslationInput';
import { translate } from '@/app/actions/translate';

function TranslationPage() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<{
    provider: string;
    result: string;
    icon: string;
    error?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTranslate = async (text: string) => {
    if (!text.trim()) return;

    setIsLoading(true);
    setResult(null);

    try {
      const response = await translate(text, 'ja', 'en-US');

      if (response.text) {
        setResult({
          provider: 'DeepL',
          result: response.text,
          icon: '🤖',
        });
      } else {
        setResult({
          provider: 'DeepL',
          result: '',
          icon: '🤖',
          error: response.error || 'Translation failed',
        });
      }
    } catch (error: any) {
      setResult({
        provider: 'DeepL',
        result: '',
        icon: '🤖',
        error: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <div className="mb-2 flex items-center justify-center gap-2">
            <Languages className="h-8 w-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">DeepL Translation</h1>
          </div>
          <p className="text-gray-600">Translate text using DeepL advanced AI</p>
        </div>

        <div className="mb-6 rounded-xl bg-white p-6 shadow-lg">
          <TranslationInput
            value={text}
            onChange={setText}
            onTranslate={() => handleTranslate(text)}
            isLoading={isLoading}
          />
        </div>

        {text && result && (
          <div className="space-y-4">
            <TranslationResult
              provider={result.provider}
              result={result.result}
              icon={result.icon}
              isLoading={isLoading}
              error={result.error}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default TranslationPage;
