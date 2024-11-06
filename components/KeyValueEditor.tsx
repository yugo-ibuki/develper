'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';

export interface KeyValuePair {
  key: string;
  value: string;
}

interface KeyValueEditorProps {
  title: string;
  items: KeyValuePair[];
  setItems: (items: KeyValuePair[]) => void;
}

export default function KeyValueEditor({ title, items, setItems }: KeyValueEditorProps) {
  const addKeyValuePair = () => {
    setItems([...items, { key: '', value: '' }]);
  };

  const removeKeyValuePair = (index: number) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
    }
  };

  const updateKeyValuePair = (index: number, field: 'key' | 'value', value: string) => {
    const newItems = items.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setItems(newItems);
  };

  return (
    <div className="space-y-2">
      <Label>{title}</Label>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <Input
              placeholder="Key"
              value={item.key}
              onChange={(e) => updateKeyValuePair(index, 'key', e.target.value)}
            />
            <Input
              placeholder="Value"
              value={item.value}
              onChange={(e) => updateKeyValuePair(index, 'value', e.target.value)}
            />
            <Button variant="ghost" size="icon" onClick={() => removeKeyValuePair(index)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button variant="outline" onClick={addKeyValuePair} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add {title.slice(0, -1)}
        </Button>
      </div>
    </div>
  );
}
