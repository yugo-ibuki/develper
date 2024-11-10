import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';

interface GeneratedDataCardProps {
  title: string;
  items: string[];
  onCopy: (text: string) => void;
}

export const GeneratedDataCard: FC<GeneratedDataCardProps> = ({ title, items, onCopy }) => {
  if (items.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {items.map((item, index) => (
          <div key={index} className="mb-2 flex items-center justify-between">
            <span>{item}</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onCopy(item)}
              aria-label={`Copy ${title} ${item}`}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
