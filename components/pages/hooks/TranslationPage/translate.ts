'use server';

import * as deepl from 'deepl-node';
import { SourceLanguageCode, TargetLanguageCode } from 'deepl-node/dist/types';

const translator = new deepl.Translator(process.env.DEEPL_API_KEY || '');

interface TranslationResult {
  text: string | null;
  error?: string;
}

export async function translate(
  text: string,
  sourceLang: SourceLanguageCode = 'ja',
  targetLang: TargetLanguageCode = 'en-US'
): Promise<TranslationResult> {
  try {
    const result = await translator.translateText(text, sourceLang, targetLang);
    return {
      text: result.text,
    };
  } catch (error) {
    console.error('Translation error:', error);
    return {
      text: null,
      error: 'Translation failed',
    };
  }
}
