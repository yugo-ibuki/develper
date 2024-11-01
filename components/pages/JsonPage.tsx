import { useState } from 'react';
import { FileJson } from 'lucide-react';
import { TreeNode } from '@/components/TreeNode';
import { JSONValue } from '@/types';

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
    <div className="flex flex-col bg-gray-50">
      <main className="flex-grow p-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-center gap-2">
            <FileJson className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">JSON Explorer</h1>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-4 text-lg font-semibold">JSON Input</h2>
              <textarea
                className="h-64 w-full rounded-lg border p-4 font-mono text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                value={jsonInput}
                onChange={(e) => handleJsonInput(e.target.value)}
                placeholder="Paste your JSON here..."
              />
              {error && <div className="mt-2 text-sm text-red-500">{error}</div>}
            </div>

            <div className="rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-4 text-lg font-semibold">Structure Explorer</h2>
              <div className="h-64 overflow-auto rounded-lg border p-4">
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
            </div>
          </div>

          {selectedValue !== null && (
            <div className="mt-6 rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-4 text-lg font-semibold">Selected Value</h2>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="mb-2 text-sm text-gray-600">Path: {selectedPath.join(' → ')}</p>
                <pre className="overflow-auto rounded-lg bg-gray-100 p-4">
                  {JSON.stringify(selectedValue, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default JsonPage;
