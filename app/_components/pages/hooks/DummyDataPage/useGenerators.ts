import { firstNames, lastNames } from '@/assets/data/names';
import type { GeneratorConfig } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export const useGenerators = () => {
  const generators: GeneratorConfig[] = [
    {
      id: 'uuid',
      title: 'UUID',
      fields: [{ id: 'uuidCount', label: 'UUID 個数' }],
      generate: ({ uuidCount }) => Array.from({ length: uuidCount }, () => uuidv4()),
    },
    {
      id: 'name',
      title: '人名',
      fields: [{ id: 'nameCount', label: '人名 個数' }],
      generate: ({ nameCount }) =>
        Array.from({ length: nameCount }, () => {
          const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
          const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
          return `${lastName} ${firstName}`;
        }),
    },
    {
      id: 'number',
      title: 'ランダム数字',
      fields: [
        { id: 'numberCount', label: 'ランダム数字 個数' },
        { id: 'numberDigits', label: 'ランダム数字 桁数' },
      ],
      generate: ({ numberCount, numberDigits }) =>
        Array.from({ length: numberCount }, () => {
          const number = Math.floor(Math.random() * Math.pow(10, numberDigits));
          return number.toString().padStart(numberDigits, '0');
        }),
    },
    {
      id: 'string',
      title: 'ランダム文字列',
      fields: [
        { id: 'stringCount', label: 'ランダム文字列 個数' },
        { id: 'stringLength', label: 'ランダム文字列 長さ' },
      ],
      generate: ({ stringCount, stringLength }) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        return Array.from({ length: stringCount }, () =>
          Array.from({ length: stringLength }, () =>
            characters.charAt(Math.floor(Math.random() * characters.length))
          ).join('')
        );
      },
    },
  ];

  return { generators };
};
