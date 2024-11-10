import { useState, useCallback } from 'react';
import type { GeneratorType, GeneratorConfig } from '@/types';

export const useDummyData = (formData: Record<string, string>) => {
  const [generatedData, setGeneratedData] = useState<Record<GeneratorType, string[]>>({
    uuid: [],
    name: [],
    number: [],
    string: [],
  });

  const handleGenerate = useCallback(
    (generator: GeneratorConfig) => {
      const params = generator.fields.reduce(
        (acc, field) => {
          acc[field.id] = parseInt(formData[field.id]);
          return acc;
        },
        {} as Record<string, number>
      );

      const newData = generator.generate(params);
      setGeneratedData((prev) => ({ ...prev, [generator.id]: newData }));
    },
    [formData]
  );

  return {
    generatedData,
    handleGenerate,
  };
};
