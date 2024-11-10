import { FC, ChangeEventHandler } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface NumberInputProps {
  id: string;
  name: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  error?: string;
  label: string;
}

export const NumberInput: FC<NumberInputProps> = ({ id, name, value, onChange, error, label }) => (
  <div>
    <Label htmlFor={id}>{label}</Label>
    <Input
      type="text"
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className={error ? 'border-red-500' : ''}
    />
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);
