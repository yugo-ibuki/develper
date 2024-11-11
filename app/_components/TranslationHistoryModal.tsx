import React from 'react';
import { Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const TranslationHistoryModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Clock className="h-4 w-4" />
          History
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Translation History</DialogTitle>
        </DialogHeader>
        <div>test{/* モーダルの内容はこれから実装 */}</div>
      </DialogContent>
    </Dialog>
  );
};

export default TranslationHistoryModal;
