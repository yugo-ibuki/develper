import { TreeNode } from '@/components/TreeNode';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { JSONValue } from '@/types';
import { ChevronDown, ChevronUp, FileJson, Search } from 'lucide-react';
import { useState } from 'react';

function getAllPaths(obj: JSONValue, currentPath: string[] = []): string[] {
  const paths: string[] = [];

  if (obj && typeof obj === 'object') {
    paths.push(currentPath.join('.'));

    Object.entries(obj).forEach(([key, value]) => {
      paths.push(...getAllPaths(value, [...currentPath, key]));
    });
  }

  return paths;
}

function findPathsContainingKey(
  obj: JSONValue,
  searchKey: string,
  currentPath: string[] = [],
  results: { path: string[]; fullKey: string }[] = []
): { path: string[]; fullKey: string }[] {
  if (!obj || typeof obj !== 'object') return results;

  Object.entries(obj).forEach(([key, value]) => {
    const newPath = [...currentPath, key];
    if (key.toLowerCase().includes(searchKey.toLowerCase())) {
      results.push({
        path: newPath,
        fullKey: newPath.join(' → '),
      });
    }
    if (value && typeof value === 'object') {
      findPathsContainingKey(value, searchKey, newPath, results);
    }
  });

  return results;
}

function getAllParentPaths(path: string[]): string[] {
  const parentPaths: string[] = [];
  const currentPath: string[] = [];

  path.forEach((segment) => {
    currentPath.push(segment);
    parentPaths.push(currentPath.join('.'));
  });

  return parentPaths;
}

function JsonPage() {
  const [jsonInput, setJsonInput] = useState(
    '{\n  "example": {\n    "nested": {\n      "value": 42,\n      "array": [1, 2, 3]\n    }\n  }\n}'
  );
  const [parsedJson, setParsedJson] = useState<JSONValue | null>(null);
  const [error, setError] = useState<string>('');
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [selectedPath, setSelectedPath] = useState<string[]>([]);
  const [selectedValue, setSelectedValue] = useState<JSONValue | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<{ path: string[]; fullKey: string }[]>([]);

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

  const handleExpandAll = () => {
    if (parsedJson) {
      const allPaths = getAllPaths(parsedJson);
      setExpanded(new Set(allPaths));
    }
  };

  const handleCollapseAll = () => {
    setExpanded(new Set());
  };

  const expandToPath = (path: string[]) => {
    const parentPaths = getAllParentPaths(path);
    const newExpanded = new Set(expanded);
    parentPaths.forEach((path) => newExpanded.add(path));
    setExpanded(newExpanded);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);

    if (!parsedJson || !term.trim()) {
      setSearchResults([]);
      return;
    }

    const results = findPathsContainingKey(parsedJson, term.trim());
    setSearchResults(results);

    // 最初の結果までのパスを自動展開
    if (results.length > 0) {
      expandToPath(results[0].path);
      handleSelect(
        results[0].path,
        // biome-ignore lint: any to error is fine
        results[0].path.reduce((obj: any, key) => obj[key], parsedJson)
      );
    }
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
                  <div className="space-y-4 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <h2 className="text-lg font-semibold">Structure Explorer</h2>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleExpandAll}
                          disabled={!parsedJson}
                        >
                          <ChevronDown className="mr-1 h-4 w-4" />
                          Expand All
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCollapseAll}
                          disabled={!parsedJson}
                        >
                          <ChevronUp className="mr-1 h-4 w-4" />
                          Collapse All
                        </Button>
                      </div>
                    </div>

                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        className="pl-9"
                        placeholder="Search keys..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                      />
                    </div>

                    {searchResults.length > 0 && (
                      <div className="max-h-32 space-y-1 overflow-auto rounded-lg border bg-gray-50 p-2">
                        {searchResults.map((result, index) => (
                          <button
                            key={index.toString()}
                            className="w-full rounded px-2 py-1 text-left text-sm hover:bg-gray-100"
                            onClick={() => {
                              expandToPath(result.path);
                              handleSelect(
                                result.path,
                                // biome-ignore lint: any to error is fine
                                result.path.reduce((obj: any, key) => obj[key], parsedJson)
                              );
                            }}
                          >
                            {result.fullKey}
                          </button>
                        ))}
                      </div>
                    )}
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
