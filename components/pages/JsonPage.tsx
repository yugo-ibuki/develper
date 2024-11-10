import { useState } from 'react';
import { FileJson } from 'lucide-react';
import { TreeNode } from '@/components/TreeNode';
import { JSONValue } from '@/types';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

function JsonPage() {
  const [jsonInput, setJsonInput] = useState(
    '{\n  "example": {\n    "nested": {\n      "value": 42,\n      "array": [1, 2, 3]\n    }\n  }\n}'
  );
  const [parsedJson, setParsedJson] = useState<JSONValue | null>(null);
  const [error, setError] = useState<string>('');
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [selectedPath, setSelectedPath] = useState<string[]>([]);
  const [selectedValue, setSelectedValue] = useState<JSONValue | null>(null);

  const handleJsonInput = (value: string) => {
    setJsonInput(value);
    try {
      const parsed = JSON.parse(value);
      setParsedJson(parsed);
      setError('');
    } catch (e) {
      setError((e as Error).message);
      setParsedJson(null);
    }
  };

  const handleToggle = (path: string) => {
    const newExpanded = new Set(expanded);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpanded(newExpanded);
  };

  const handleSelect = (path: string[], value: JSONValue) => {
    setSelectedPath(path);
    setSelectedValue(value);
  };

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <div className="p-4">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-4 flex items-center gap-2">
            <FileJson className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">JSON Explorer</h1>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-4">
        <div className="mx-auto h-full max-w-[1400px]">
          <ResizablePanelGroup direction="horizontal" className="h-full rounded-lg bg-background">
            <ResizablePanel defaultSize={40} minSize={30}>
              <Card className="h-full">
                <div className="flex h-full flex-col">
                  <div className="p-4">
                    <h2 className="text-lg font-semibold">JSON Input</h2>
                  </div>
                  <div className="flex-1 p-4 pt-0">
                    <textarea
                      className="h-full w-full rounded-lg border p-4 font-mono text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                      value={jsonInput}
                      onChange={(e) => handleJsonInput(e.target.value)}
                      placeholder="Paste your JSON here..."
                    />
                    {error && <div className="mt-2 text-sm text-red-500">{error}</div>}
                  </div>
                </div>
              </Card>
            </ResizablePanel>

            <ResizableHandle />

            <ResizablePanel defaultSize={60}>
              <Card className="h-full">
                <div className="flex h-full flex-col">
                  <div className="p-4">
                    <h2 className="text-lg font-semibold">Structure Explorer</h2>
                  </div>
                  <ScrollArea className="flex-1">
                    <div className="space-y-4 p-4 pt-0">
                      <div className="rounded-lg border p-4">
                        {parsedJson ? (
                          <TreeNode
                            data={parsedJson}
                            path={[]}
                            onSelect={handleSelect}
                            expanded={expanded}
                            onToggle={handleToggle}
                          />
                        ) : (
                          <div className="italic text-gray-500">
                            Enter valid JSON to explore its structure
                          </div>
                        )}
                      </div>

                      {selectedValue !== null && (
                        <div className="rounded-lg border p-4">
                          <h3 className="mb-4 text-sm font-semibold">Selected Value</h3>
                          <div className="rounded-lg bg-gray-50 p-4">
                            <p className="mb-2 text-sm text-gray-600">
                              Path: {selectedPath.join(' → ')}
                            </p>
                            <pre className="overflow-auto rounded-lg bg-gray-100 p-4 text-sm">
                              {JSON.stringify(selectedValue, null, 2)}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </Card>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </div>
  );
}

export default JsonPage;
