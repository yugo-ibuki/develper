import { useState } from 'react';
import {
  translateWithDeepL,
  translateWithGoogle,
} from '@/components/pages/hooks/TranslationPage/translate';
import { SourceLanguageCode, TargetLanguageCode } from 'deepl-node/dist/types';

interface TranslationResult {
  provider: string;
  result: string;
  icon: string;
  error?: string;
}

export const useTranslation = () => {
  const [results, setResults] = useState<TranslationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const translateWithProviders = async (
    text: string,
    sourceLang: string = 'ja',
    targetLang: string = 'en'
  ) => {
    setIsLoading(true);
    setResults([]);

    try {
      // Convert language codes for DeepL
      const deeplSourceLang = sourceLang as SourceLanguageCode;
      const deeplTargetLang = (targetLang === 'en' ? 'en-US' : targetLang) as TargetLanguageCode;

      // DeepL Translation
      const deeplResult = await translateWithDeepL(text, deeplSourceLang, deeplTargetLang);

      // Google Translation (Google uses simpler language codes)
      const googleResult = await translateWithGoogle(text, sourceLang, targetLang);

      const newResults: TranslationResult[] = [
        {
          provider: 'DeepL',
          result: deeplResult.text || '',
          icon: '🤖',
          error: deeplResult.error,
        },
        {
          provider: 'Google',
          result: googleResult.text || '',
          icon: '🌐',
          error: googleResult.error,
        },
      ];

      setResults(newResults);
    } catch (error: any) {
      setResults([
        {
          provider: 'Translation',
          result: '',
          icon: '⚠️',
          error: 'Failed to fetch translations',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    translate: translateWithProviders,
    results,
    isLoading,
  };
};
