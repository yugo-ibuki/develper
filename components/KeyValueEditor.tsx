'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Clipboard } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export interface KeyValuePair {
  key: string;
  value: string;
}

interface KeyValueEditorProps {
  title: string;
  items: KeyValuePair[];
  setItems: (items: KeyValuePair[]) => void;
}

export function KeyValueEditor({ title, items, setItems }: KeyValueEditorProps) {
  const [jsonInput, setJsonInput] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const handleJsonPaste = () => {
    try {
      const parsedJson = JSON.parse(jsonInput);
      const newItems: KeyValuePair[] = [];

      // Handle both object and array formats
      if (Array.isArray(parsedJson)) {
        parsedJson.forEach((item) => {
          if (typeof item === 'object' && item !== null) {
            Object.entries(item).forEach(([key, value]) => {
              newItems.push({
                key: key,
                value: typeof value === 'object' ? JSON.stringify(value) : String(value),
              });
            });
          }
        });
      } else if (typeof parsedJson === 'object' && parsedJson !== null) {
        Object.entries(parsedJson).forEach(([key, value]) => {
          newItems.push({
            key: key,
            value: typeof value === 'object' ? JSON.stringify(value) : String(value),
          });
        });
      }

      setItems(newItems.length > 0 ? newItems : [{ key: '', value: '' }]);
      setJsonInput('');
      setIsDialogOpen(false);
    } catch (error) {
      alert('Invalid JSON format. Please check your input.');
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{title}</Label>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Clipboard className="mr-2 h-4 w-4" />
              Paste JSON
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Paste JSON</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder="Paste your JSON here..."
                className="min-h-[200px]"
              />
              <Button onClick={handleJsonPaste} className="w-full">
                Convert to Key-Value Pairs
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
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

export default KeyValueEditor;
