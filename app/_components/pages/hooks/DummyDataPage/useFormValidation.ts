import type { FormData, FormErrors } from '@/types';
import { type ChangeEvent, useCallback, useState } from 'react';

export const useFormValidation = (initialValues: FormData) => {
  const [formData, setFormData] = useState<FormData>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateInput = useCallback((value: string) => {
    const numValue = Number.parseInt(value);
    if (value === '') return 'この項目は必須です';
    if (Number.isNaN(numValue)) return '数値を入力してください';
    if (numValue < 1 || numValue > 100) return '1から100の間の数値を入力してください';
    return '';
  }, []);

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      const error = validateInput(value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    },
    [validateInput]
  );

  const hasErrors = useCallback(
    (fieldIds: string[]) => {
      return fieldIds.some((id) => !!errors[id]);
    },
    [errors]
  );

  return {
    formData,
    errors,
    handleInputChange,
    hasErrors,
  };
};
