import { useState } from 'react';
import {
  translateWithDeepL,
  translateWithGoogle,
} from '@/components/pages/hooks/TranslationPage/translate';
import { SourceLanguageCode, TargetLanguageCode } from 'deepl-node/dist/types';
import { useTranslations } from '@/components/pages/hooks/TranslationPage/useTranslationCRUD';

interface TranslationResults {
  google: {
    translatedText: string;
    error?: string;
  };
  deepl: {
    translatedText: string;
    error?: string;
  };
}

const initialResults: TranslationResults = {
  google: {
    translatedText: '',
  },
  deepl: {
    translatedText: '',
  },
};

export const useTranslation = () => {
  const {
    translations,
    loading,
    error,
    createTranslation,
    updateTranslation,
    deleteTranslation,
    refetch: fetchTranslations,
  } = useTranslations();
  const [results, setResults] = useState<TranslationResults>(initialResults);
  const [isLoading, setIsLoading] = useState(false);

  const translateWithProviders = async (
    text: string,
    sourceLang: string = 'ja',
    targetLang: string = 'en'
  ) => {
    setIsLoading(true);
    setResults(initialResults);

    try {
      // Convert language codes for DeepL
      const deeplSourceLang = sourceLang as SourceLanguageCode;
      const deeplTargetLang = (targetLang === 'en' ? 'en-US' : targetLang) as TargetLanguageCode;

      // DeepL Translation
      const deeplResult = await translateWithDeepL(text, deeplSourceLang, deeplTargetLang);

      // Google Translation (Google uses simpler language codes)
      const googleResult = await translateWithGoogle(text, sourceLang, targetLang);

      const newResults: TranslationResults = {
        deepl: {
          translatedText: deeplResult.text || '',
          error: deeplResult.error,
        },
        google: {
          translatedText: googleResult.text || '',
          error: googleResult.error,
        },
      };

      setResults(newResults);
    } catch (error: any) {
      setResults({
        deepl: {
          translatedText: '',
          error: 'Failed to fetch translations',
        },
        google: {
          translatedText: '',
          error: 'Failed to fetch translations',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    translations,
    translate: translateWithProviders,
    createTranslation,
    results,
    isLoading: isLoading || loading,
  };
};
