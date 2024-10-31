import { useState } from 'react';
import { FileJson } from 'lucide-react';
import { TreeNode } from './components/TreeNode';
import { Footer } from './components/Footer';
import { JSONValue } from './types';

function App() {
  const [jsonInput, setJsonInput] = useState('{\n  "example": {\n    "nested": {\n      "value": 42,\n      "array": [1, 2, 3]\n    }\n  }\n}');
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <FileJson className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">JSON Explorer</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">JSON Input</h2>
              <textarea
                className="w-full h-64 p-4 font-mono text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={jsonInput}
                onChange={(e) => handleJsonInput(e.target.value)}
                placeholder="Paste your JSON here..."
              />
              {error && (
                <div className="mt-2 text-red-500 text-sm">{error}</div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Structure Explorer</h2>
              <div className="border rounded-lg p-4 h-64 overflow-auto">
                {parsedJson ? (
                  <TreeNode
                    data={parsedJson}
                    path={[]}
                    onSelect={handleSelect}
                    expanded={expanded}
                    onToggle={handleToggle}
                  />
                ) : (
                  <div className="text-gray-500 italic">
                    Enter valid JSON to explore its structure
                  </div>
                )}
              </div>
            </div>
          </div>

          {selectedValue !== null && (
            <div className="mt-6 bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Selected Value</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">
                  Path: {selectedPath.join(' → ')}
                </p>
                <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
                  {JSON.stringify(selectedValue, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;