import React, { useState } from 'react';
import { Languages } from 'lucide-react';
import TranslationResult from '@/components/TranslationResult';
import TranslationInput from '@/components/TranslationInput';
import { useTranslation } from '@/components/pages/hooks/TranslationPage/useTranslation';

function TranslationPage() {
  const [text, setText] = useState('');
  const [sourceLang, setSourceLang] = useState('Japanese');
  const [targetLang, setTargetLang] = useState('English');
  const { translate, results, isLoading } = useTranslation();

  const handleTranslate = async (text: string) => {
    if (!text.trim()) return;
    await translate(
      text,
      sourceLang === 'Japanese' ? 'ja' : 'en',
      targetLang === 'Japanese' ? 'ja' : 'en'
    );
  };

  const handleSwapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <div className="mb-2 flex items-center justify-center gap-2">
            <Languages className="h-8 w-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">AI Translation</h1>
          </div>
          <p className="text-gray-600">Compare translations from DeepL and Google Translate</p>
        </div>

        <div className="mb-6 rounded-xl bg-white p-6 shadow-lg">
          <TranslationInput
            value={text}
            onChange={setText}
            onTranslate={() => handleTranslate(text)}
            isLoading={isLoading}
            sourceLang={sourceLang}
            targetLang={targetLang}
            onSwapLanguages={handleSwapLanguages}
          />
        </div>

        {text && results.length > 0 && (
          <div className="space-y-4">
            {results.map((result, index) => (
              <TranslationResult
                key={index}
                provider={result.provider}
                result={result.result}
                icon={result.icon}
                isLoading={isLoading}
                error={result.error}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TranslationPage;
