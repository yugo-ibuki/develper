'use server';

import { env } from '@/configs/env';
import * as deepl from 'deepl-node';
import type { SourceLanguageCode, TargetLanguageCode } from 'deepl-node/dist/types';
import fetch from 'node-fetch';

const deeplTranslator = new deepl.Translator(env.DEEPL_API_KEY);

interface TranslationResult {
  text: string | null;
  error?: string;
}

export async function translateWithDeepL(
  text: string,
  sourceLang: SourceLanguageCode = 'ja',
  targetLang: TargetLanguageCode = 'en-US'
): Promise<TranslationResult> {
  try {
    const result = await deeplTranslator.translateText(text, sourceLang, targetLang);
    return {
      text: result.text,
    };
  } catch (error) {
    console.error('DeepL translation error:', error);
    return {
      text: null,
      error: 'DeepL translation failed',
    };
  }
}

export async function translateWithGoogle(
  text: string,
  sourceLang = 'ja',
  targetLang = 'en'
): Promise<TranslationResult> {
  try {
    const url = 'https://translation.googleapis.com/language/translate/v2';
    const apiKey = env.GOOGLE_CLOUD_API_KEY;

    const response = await fetch(`${url}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: sourceLang,
        target: targetLang,
        format: 'text',
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // biome-ignore lint: any to error is fine
    const data: any = await response.json();
    return {
      text: data.data.translations[0].translatedText,
    };
  } catch (error) {
    console.error('Google translation error:', error);
    return {
      text: null,
      error: 'Google translation failed',
    };
  }
}
