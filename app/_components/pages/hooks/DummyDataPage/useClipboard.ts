import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useClipboard = () => {
  const { toast } = useToast();

  const copyToClipboard = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        toast({
          title: 'コピー成功',
          description: 'クリップボードにコピーしました',
          duration: 3000,
        });
      } catch (err) {
        console.error('Failed to copy:', err);
        toast({
          title: 'コピー失敗',
          description: 'クリップボードへのコピーに失敗しました',
          duration: 3000,
          variant: 'destructive',
        });
      }
    },
    [toast]
  );

  return { copyToClipboard };
};
