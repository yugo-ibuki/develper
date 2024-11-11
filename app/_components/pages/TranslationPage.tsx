import React, { useState } from 'react';
import { Languages } from 'lucide-react';
import TranslationResult from '@/components/TranslationResult';
import TranslationInput from '@/components/TranslationInput';
import { useTranslation } from '@/components/pages/hooks/TranslationPage/useTranslation';
import { TranslationHistoryModal } from '@/components/TranslationHistoryModal';

function TranslationPage() {
  const [text, setText] = useState('');
  const [sourceLang, setSourceLang] = useState('Japanese');
  const [targetLang, setTargetLang] = useState('English');
  const { translations, translate, createTranslation, results, isLoading } = useTranslation();

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

  const handleSaveTranslation = async (
    sourceText: string,
    googleTranslation: string,
    deeplTranslation: string
  ) => {
    if (!sourceText?.trim()) return;

    const result = await createTranslation(sourceText, {
      googleTranslation,
      deeplTranslation,
    });

    if (result.error) {
      // エラーハンドリング
      console.error(result.error);
      // 必要に応じてユーザーに通知
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Languages className="h-8 w-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">AI Translation</h1>
          </div>
          <TranslationHistoryModal translations={translations} />
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

        {text && results.deepl.translatedText !== '' && results.google.translatedText !== '' && (
          <div className="space-y-4">
            <TranslationResult
              provider="Google Translate"
              result={results.google.translatedText}
              icon="🌐"
              isLoading={isLoading}
              error={results.google.error}
            />
            <TranslationResult
              provider="DeepL"
              result={results.deepl.translatedText}
              icon="🤖"
              isLoading={isLoading}
              error={results.deepl.error}
            />

            {/* 保存ボタン - 両方の翻訳が成功した場合のみ表示 */}
            {!results.google.error && !results.deepl.error && (
              <button
                onClick={() =>
                  handleSaveTranslation(
                    text,
                    results.google.translatedText,
                    results.deepl.translatedText
                  )
                }
                className="mt-4 w-full rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition-colors hover:bg-indigo-700 disabled:bg-gray-300"
                disabled={isLoading}
              >
                Save Both Translations
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TranslationPage;
