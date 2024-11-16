'use client';

import type { JSONValue } from '@/types';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface TreeNodeProps {
  data: JSONValue;
  path: string[];
  onSelect: (path: string[], value: JSONValue) => void;
  expanded: Set<string>;
  onToggle: (path: string) => void;
}

export function TreeNode({ data, path, onSelect, expanded, onToggle }: TreeNodeProps) {
  const pathKey = path.join('.');
  const isExpanded = expanded.has(pathKey);

  if (Array.isArray(data)) {
    return (
      <div className="ml-4">
        <div
          className="flex cursor-pointer items-center gap-1 rounded px-2 py-1 hover:bg-gray-100"
          onClick={() => onToggle(pathKey)}
        >
          {data.length > 0 ? (
            isExpanded ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )
          ) : null}
          <span className="text-purple-600">[{data.length}]</span>
        </div>
        {isExpanded && (
          <div className="ml-4">
            {data.map((item, index) => (
              <TreeNode
                key={index.toString()}
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
          className="flex cursor-pointer items-center gap-1 rounded px-2 py-1 hover:bg-gray-100"
          onClick={() => onToggle(pathKey)}
        >
          {entries.length > 0 ? (
            isExpanded ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )
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
      className="inline-block cursor-pointer rounded px-2 py-1 hover:bg-gray-100"
      onClick={() => onSelect(path, data)}
    >
      {data === null ? (
        <span className="text-gray-400">null</span>
      ) : typeof data === 'string' ? (
        <span className="text-green-600">{data}</span>
      ) : typeof data === 'number' ? (
        <span className="text-orange-600">{data}</span>
      ) : (
        <span className="text-purple-600">{String(data)}</span>
      )}
    </span>
  );
}
