'use client';

import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { useFormValidation } from '@/components/pages/hooks/DummyDataPage/useFormValidation';
import { useGenerators } from '@/components/pages/hooks/DummyDataPage/useGenerators';
import { useDummyData } from '@/components/pages/hooks/DummyDataPage/useDummyData';
import { useClipboard } from '@/components/pages/hooks/DummyDataPage/useClipboard';
import { NumberInput } from '@/components/NumberInput';
import { GeneratedDataCard } from '@/components/GeneratedDataCard';

const INITIAL_FORM_DATA = {
  uuidCount: '1',
  nameCount: '1',
  numberCount: '1',
  numberDigits: '5',
  stringCount: '1',
  stringLength: '10',
};

// メインコンポーネント
export default function DummyDataPage() {
  const { generators } = useGenerators();
  const { formData, errors, handleInputChange, hasErrors } = useFormValidation(INITIAL_FORM_DATA);
  const { generatedData, handleGenerate } = useDummyData(formData);
  const { copyToClipboard } = useClipboard();

  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full overflow-auto bg-gray-100 p-4 md:w-1/3">
        <h2 className="mb-4 text-2xl font-bold">ダミーデータジェネレーター</h2>
        <form className="space-y-4">
          {generators.map((generator) => (
            <div key={generator.id}>
              {generator.fields.map((field) => (
                <NumberInput
                  key={field.id}
                  id={field.id}
                  name={field.id}
                  label={field.label}
                  value={formData[field.id]}
                  onChange={handleInputChange}
                  error={errors[field.id]}
                />
              ))}
              <Button
                type="button"
                onClick={() => handleGenerate(generator)}
                className="mt-2"
                disabled={hasErrors(generator.fields.map((f) => f.id))}
              >
                {generator.title}生成
              </Button>
            </div>
          ))}
        </form>
      </div>
      <div className="w-full overflow-auto bg-white p-4 md:w-2/3">
        <h2 className="mb-4 text-2xl font-bold">生成されたデータ</h2>
        <div className="space-y-4">
          {generators.map((generator) => (
            <GeneratedDataCard
              key={generator.id}
              title={generator.title}
              items={generatedData[generator.id]}
              onCopy={copyToClipboard}
            />
          ))}
        </div>
      </div>
      <Toaster />
    </div>
  );
}
