import React, { useState } from 'react';
import { Languages } from 'lucide-react';
import TranslationResult from '@/components/TranslationResult';
import TranslationInput from '@/components/TranslationInput';
import { translate } from '@/app/actions/translate';
import { Switch } from '@/components/ui/switch';

function TranslationPage() {
  const [text, setText] = useState('');
  const [isJapanese, setIsJapanese] = useState(true);
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
      // isJapanese が true の場合は日本語→英語、false の場合は英語→日本語
      const sourceLang = isJapanese ? 'ja' : 'en';
      const targetLang = isJapanese ? 'en-US' : 'ja';

      const response = await translate(text, sourceLang, targetLang);

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

        <div className="mb-4 flex items-center justify-center gap-4">
          <span className="text-gray-600">🇯🇵 日本語</span>
          <div className="flex items-center gap-2">
            <Switch
              checked={isJapanese}
              onCheckedChange={setIsJapanese}
              className="data-[state=checked]:bg-indigo-600"
            />
          </div>
          <span className="text-gray-600">🇺🇸 English</span>
        </div>

        <div className="mb-6 rounded-xl bg-white p-6 shadow-lg">
          <div className="mb-2 text-sm text-gray-500">
            {isJapanese ? '日本語を入力してください' : 'Enter English text'}
          </div>
          <TranslationInput
            value={text}
            onChange={setText}
            onTranslate={() => handleTranslate(text)}
            isLoading={isLoading}
            placeholder={isJapanese ? '日本語のテキスト...' : 'English text...'}
          />
        </div>

        {text && result && (
          <div className="space-y-4">
            <TranslationResult
              provider={`DeepL (${isJapanese ? '日本語→英語' : 'English→日本語'})`}
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
