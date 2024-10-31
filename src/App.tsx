import React, { useState } from 'react';
import { ChevronRight, ChevronDown, FileJson } from 'lucide-react';

type JSONValue = string | number | boolean | null | JSONObject | JSONArray;
type JSONObject = { [key: string]: JSONValue };
type JSONArray = JSONValue[];

interface TreeNodeProps {
  data: JSONValue;
  path: string[];
  onSelect: (path: string[], value: JSONValue) => void;
  expanded: Set<string>;
  onToggle: (path: string) => void;
}

function TreeNode({ data, path, onSelect, expanded, onToggle }: TreeNodeProps) {
  const pathKey = path.join('.');
  const isExpanded = expanded.has(pathKey);

  if (Array.isArray(data)) {
    return (
      <div className="ml-4">
        <div
          className="flex items-center gap-1 cursor-pointer hover:bg-gray-100 py-1 px-2 rounded"
          onClick={() => onToggle(pathKey)}
        >
          {data.length > 0 ? (
            isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />
          ) : null}
          <span className="text-purple-600">[{data.length}]</span>
        </div>
        {isExpanded && (
          <div className="ml-4">
            {data.map((item, index) => (
              <TreeNode
                key={index}
                data={item}
                path={[...path, index.toString()]}
                onSelect={onSelect}
                expanded={expanded}
                onToggle={onToggle}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (data && typeof data === 'object') {
    const entries = Object.entries(data);
    return (
      <div className="ml-4">
        <div
          className="flex items-center gap-1 cursor-pointer hover:bg-gray-100 py-1 px-2 rounded"
          onClick={() => onToggle(pathKey)}
        >
          {entries.length > 0 ? (
            isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />
          ) : null}
          <span className="text-blue-600">{`{${entries.length}}`}</span>
        </div>
        {isExpanded && (
          <div className="ml-4">
            {entries.map(([key, value]) => (
              <div key={key}>
                <span className="text-gray-500">{key}: </span>
                <TreeNode
                  data={value}
                  path={[...path, key]}
                  onSelect={onSelect}
                  expanded={expanded}
                  onToggle={onToggle}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <span
      className="cursor-pointer hover:bg-gray-100 py-1 px-2 rounded inline-block"
      onClick={() => onSelect(path, data)}
    >
      {data === null ? (
        <span className="text-gray-400">null</span>
      ) : typeof data === 'string' ? (
        <span className="text-green-600">"{data}"</span>
      ) : typeof data === 'number' ? (
        <span className="text-orange-600">{data}</span>
      ) : (
        <span className="text-purple-600">{String(data)}</span>
      )}
    </span>
  );
}

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
    <div className="min-h-screen bg-gray-50 p-8">
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
    </div>
  );
}

export default App;