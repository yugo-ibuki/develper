'use client';

import { useState } from 'react';
import { Copy, Play, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface Header {
  key: string;
  value: string;
}

export default function RequestPage() {
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [headers, setHeaders] = useState<Header[]>([{ key: '', value: '' }]);
  const [apiKey, setApiKey] = useState('');
  const [response, setResponse] = useState('');
  const { toast } = useToast();

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  const removeHeader = (index: number) => {
    const newHeaders = headers.filter((_, i) => i !== index);
    setHeaders(newHeaders);
  };

  const updateHeader = (index: number, field: 'key' | 'value', value: string) => {
    const newHeaders = headers.map((header, i) => {
      if (i === index) {
        return { ...header, [field]: value };
      }
      return header;
    });
    setHeaders(newHeaders);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(response);
      toast({
        title: 'Copied to clipboard',
        description: 'Response has been copied to your clipboard',
      });
    } catch (err) {
      toast({
        title: 'Failed to copy',
        description: 'Could not copy response to clipboard',
        variant: 'destructive',
      });
    }
  };

  const executeRequest = async () => {
    try {
      const headerObj: Record<string, string> = {};
      headers.forEach(({ key, value }) => {
        if (key && value) headerObj[key] = value;
      });
      if (apiKey) headerObj['Authorization'] = `Bearer ${apiKey}`;

      const res = await fetch('/api/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          method,
          headers: headerObj,
        }),
      });

      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setResponse(JSON.stringify({ error: 'Failed to execute request' }, null, 2));
    }
  };

  return (
    <div className="bg-background p-4">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={50} minSize={30}>
          <Card className="h-full p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  placeholder="https://api.example.com/endpoint"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Method</Label>
                <Select value={method} onValueChange={setMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Headers</Label>
                <div className="space-y-2">
                  {headers.map((header, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="Key"
                        value={header.key}
                        onChange={(e) => updateHeader(index, 'key', e.target.value)}
                      />
                      <Input
                        placeholder="Value"
                        value={header.value}
                        onChange={(e) => updateHeader(index, 'value', e.target.value)}
                      />
                      <Button variant="ghost" size="icon" onClick={() => removeHeader(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" onClick={addHeader} className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Header
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="Enter your API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>

              <Button onClick={executeRequest} className="w-full">
                <Play className="mr-2 h-4 w-4" />
                Execute Request
              </Button>
            </div>
          </Card>
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize={50} minSize={30}>
          <Card className="h-full p-6">
            <div className="mb-4 flex justify-end">
              <Button variant="outline" onClick={copyToClipboard}>
                <Copy className="mr-2 h-4 w-4" />
                Copy Response
              </Button>
            </div>
            <ScrollArea className="h-[calc(100%-60px)] w-full rounded-md border p-4">
              <pre className="text-sm">{response}</pre>
            </ScrollArea>
          </Card>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
