/**
 * JSON Schema
 */
export type JSONValue = string | number | boolean | null | JSONObject | JSONArray;
export type JSONObject = { [key: string]: JSONValue };
export type JSONArray = JSONValue[];

/**
 * Dummy Data Generator
 */
export type GeneratorType = 'uuid' | 'name' | 'number' | 'string';

export interface GeneratorConfig {
  id: GeneratorType;
  title: string;
  fields: GeneratorField[];
  generate: (params: Record<string, number>) => string[];
}

export interface GeneratorField {
  id: string;
  label: string;
}

export interface FormData {
  [key: string]: string;
}

export interface FormErrors {
  [key: string]: string;
}
