import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Translation } from '@/db/schema';
import { Check, Clock, Copy } from 'lucide-react';
import React, { type FC } from 'react';

type Props = {
  translations: Translation[];
};

export const TranslationHistoryModal: FC<Props> = ({ translations }) => {
  const [copied, setCopied] = React.useState<string | null>(null);

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString.replace(' ', 'T'));
      return new Intl.DateTimeFormat('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(date);
    } catch (error) {
      console.error('Date parsing error:', error);
      return 'Invalid date';
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Clock className="h-4 w-4" />
          History
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Translation History</DialogTitle>
          <DialogDescription>
            Your recent translation history with DeepL and Google Translate results
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {translations.length > 0 ? (
              translations.map((translation) => (
                <div key={translation.id} className="rounded-lg border bg-card p-4 shadow-sm">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {formatDate(translation.createdAt.toString())}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 gap-2"
                      onClick={() => handleCopy(translation.sourceText, translation.id)}
                    >
                      {copied === translation.id ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      Copy
                    </Button>
                  </div>

                  {/* 元のテキスト */}
                  <div className="mb-3">
                    <div className="text-sm font-medium text-muted-foreground">Source Text</div>
                    <div className="rounded-lg bg-muted p-3">
                      <p className="text-sm leading-relaxed">{translation.sourceText}</p>
                    </div>
                  </div>

                  {/* 翻訳結果を横並びで表示 */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* DeepL の結果 */}
                    <div>
                      <div className="mb-1 flex items-center justify-between">
                        <div className="text-sm font-medium text-muted-foreground">DeepL 🤖</div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6"
                          onClick={() =>
                            handleCopy(translation.sourceText, `deepl-${translation.id}`)
                          }
                        >
                          {copied === `deepl-${translation.id}` ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                      <div className="rounded-lg bg-muted p-3">
                        <p className="text-sm leading-relaxed">DeepL translation result here</p>
                      </div>
                    </div>

                    {/* Google の結果 */}
                    <div>
                      <div className="mb-1 flex items-center justify-between">
                        <div className="text-sm font-medium text-muted-foreground">
                          Google Translate 🌐
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6"
                          onClick={() =>
                            handleCopy(translation.sourceText, `google-${translation.id}`)
                          }
                        >
                          {copied === `google-${translation.id}` ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                      <div className="rounded-lg bg-muted p-3">
                        <p className="text-sm leading-relaxed">Google translation result here</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                No translation history yet
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
