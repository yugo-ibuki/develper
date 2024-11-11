import { useState, useEffect } from 'react';
import { supabase } from '@/configs/supabase';
import { type Translation, type NewTranslation } from '@/db/schema';

interface TranslationResult {
  data: {
    id: string;
    sourceText: string;
    google?: {
      translatedText: string;
      createdAt: string;
    };
    deepl?: {
      translatedText: string;
      createdAt: string;
    };
  } | null;
  error: string | null;
}

interface TranslationTexts {
  googleTranslation: string;
  deeplTranslation: string;
}

export function useTranslations(limit = 10) {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 翻訳一覧の取得
  const fetchTranslations = async () => {
    try {
      const { data, error } = await supabase
        .from('translations')
        .select('*')
        .order('createdAt', { ascending: false })
        .limit(limit);

      if (error) throw error;

      setTranslations(data);
      setError(null);
    } catch (e) {
      console.error('Error fetching translations:', e);
      setError('Failed to load translations');
    } finally {
      setLoading(false);
    }
  };

  // 翻訳の作成
  const createTranslation = async (
    sourceText: string,
    translations: TranslationTexts
  ): Promise<TranslationResult> => {
    try {
      // 1. まず原文を translations テーブルに保存
      const { data: translationData, error: translationError } = await supabase
        .from('translations')
        .insert({ sourceText })
        .select()
        .single();

      console.log('Translation insert response:', { translationData, translationError });

      if (translationError) throw translationError;

      // 2. Google翻訳とDeepL翻訳の結果を同時に保存
      const [googleResult, deeplResult] = await Promise.all([
        supabase
          .from('google_translations')
          .insert({
            translationId: translationData.id,
            translatedText: translations.googleTranslation,
          })
          .select()
          .single(),

        supabase
          .from('deepl_translations')
          .insert({
            translationId: translationData.id,
            translatedText: translations.deeplTranslation,
          })
          .select()
          .single(),
      ]);

      console.log('Provider translations results:', { googleResult, deeplResult });

      // エラーチェック
      if (googleResult.error) throw googleResult.error;
      if (deeplResult.error) throw deeplResult.error;

      // 3. 結果を結合して返す
      const result = {
        ...translationData,
        google: {
          translatedText: googleResult.data.translatedText,
          createdAt: googleResult.data.createdAt,
        },
        deepl: {
          translatedText: deeplResult.data.translatedText,
          createdAt: deeplResult.data.createdAt,
        },
      };

      setTranslations((prev) => [result, ...prev]);
      return { data: result, error: null };
    } catch (error) {
      console.error('Error creating translation:', error);
      return { data: null, error: 'Failed to create translation' };
    }
  };

  // 翻訳の更新
  const updateTranslation = async (id: string, translation: Partial<NewTranslation>) => {
    try {
      const { data, error } = await supabase
        .from('translations')
        .update(translation)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setTranslations((prev) => prev.map((t) => (t.id === id ? data : t)));
      return { data, error: null };
    } catch (error) {
      console.error('Error updating translation:', error);
      return { data: null, error: 'Failed to update translation' };
    }
  };

  // 翻訳の削除
  const deleteTranslation = async (id: string) => {
    try {
      const { error } = await supabase.from('translations').delete().eq('id', id);

      if (error) throw error;

      setTranslations((prev) => prev.filter((t) => t.id !== id));
      return { error: null };
    } catch (error) {
      console.error('Error deleting translation:', error);
      return { error: 'Failed to delete translation' };
    }
  };

  useEffect(() => {
    fetchTranslations();

    // リアルタイム購読のセットアップ
    const channel = supabase
      .channel('translations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'translations',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setTranslations((prev) => [payload.new as Translation, ...prev]);
          } else if (payload.eventType === 'DELETE') {
            setTranslations((prev) => prev.filter((t) => t.id !== (payload.old as Translation).id));
          } else if (payload.eventType === 'UPDATE') {
            setTranslations((prev) =>
              prev.map((t) => (t.id === payload.new.id ? (payload.new as Translation) : t))
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [limit]);

  return {
    translations,
    loading,
    error,
    createTranslation,
    updateTranslation,
    deleteTranslation,
    refetch: fetchTranslations,
  };
}
