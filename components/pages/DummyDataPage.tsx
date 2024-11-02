'use client';

import { useState, useCallback, ChangeEventHandler, FC } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';

const lastNames = [
  '佐藤',
  '鈴木',
  '高橋',
  '田中',
  '渡辺',
  '伊藤',
  '山本',
  '中村',
  '小林',
  '加藤',
  '吉田',
  '山田',
  '佐々木',
  '山口',
  '松本',
  '井上',
  '木村',
  '林',
  '斎藤',
  '清水',
  '山崎',
  '阿部',
  '森',
  '池田',
  '橋本',
  '山下',
  '石川',
  '中島',
  '前田',
  '藤田',
  '後藤',
  '小川',
  '岡田',
  '村上',
  '長谷川',
  '近藤',
  '石井',
  '斉藤',
  '坂本',
  '遠藤',
  '藤井',
  '青木',
  '福田',
  '三浦',
  '西村',
  '藤原',
  '太田',
  '松田',
  '原田',
  '岡本',
  '中野',
  '中川',
  '小野',
  '田村',
  '竹内',
  '金子',
  '和田',
  '中山',
  '石田',
  '上田',
  '森田',
  '小島',
  '柴田',
  '原',
  '宮崎',
  '酒井',
  '工藤',
  '横山',
  '宮本',
  '内田',
  '高木',
  '安藤',
  '島田',
  '谷口',
  '大野',
  '高田',
  '丸山',
  '今井',
  '河野',
  '藤本',
  '村田',
  '武田',
  '上野',
  '杉山',
  '増田',
  '平野',
  '大塚',
  '千葉',
  '久保',
  '松井',
  '関',
  '村井',
  '岩崎',
  '渡部',
  '中村',
  '川口',
  '辻',
  '松尾',
  '菅原',
  '久保田',
];

const firstNames = [
  '翔太',
  '陽菜',
  '大輝',
  '美咲',
  '健太',
  '愛',
  '拓海',
  'さくら',
  '悠斗',
  '美羽',
  '蓮',
  '結衣',
  '翔',
  '優花',
  '大和',
  '葵',
  '颯太',
  '陽子',
  '悠',
  '七海',
  '優太',
  '美優',
  '直樹',
  '萌',
  '和也',
  '彩花',
  '拓也',
  '美咲',
  '健一',
  '優奈',
  '翔平',
  '彩乃',
  '大輔',
  '美穂',
  '達也',
  '菜々子',
  '涼太',
  '香織',
  '亮太',
  '麻衣',
  '雄太',
  '由美',
  '健二',
  '智子',
  '浩二',
  '恵',
  '修平',
  '裕子',
  '和樹',
  '美紀',
  '隆太',
  '真由美',
  '浩一',
  '久美子',
  '正樹',
  '典子',
  '誠',
  '直美',
  '博',
  '明美',
  '秀樹',
  '幸子',
  '英樹',
  '和子',
  '勝',
  '洋子',
  '清',
  '京子',
  '稔',
  '節子',
  '勉',
  '美代子',
  '功',
  '信子',
  '浩',
  '陽子',
  '実',
  '真理子',
  '豊',
  '恵子',
  '茂',
  '順子',
  '勝美',
  '良子',
  '昇',
  '智美',
  '孝',
  '裕美',
  '明',
  '由美子',
  '博之',
  '直子',
  '徹',
  '美香',
  '剛',
  '真美',
  '聡',
  '香',
  '学',
  '純子',
];

interface NumberInputProps {
  id: string;
  name: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  error?: string;
}

const NumberInput: FC<NumberInputProps> = ({ id, name, value, onChange, error }) => (
  <div>
    <Input
      type="text"
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className={error ? 'border-red-500' : ''}
    />
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

export default function DummyDataPage() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [names, setNames] = useState<string[]>([]);
  const [numbers, setNumbers] = useState<string[]>([]);
  const [strings, setStrings] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    uuidCount: '1',
    nameCount: '1',
    numberCount: '1',
    numberDigits: '5',
    stringCount: '1',
    stringLength: '10',
  });
  const [errors, setErrors] = useState({
    uuidCount: '',
    nameCount: '',
    numberCount: '',
    numberDigits: '',
    stringCount: '',
    stringLength: '',
  });

  const { toast } = useToast();

  const validateInput = (name: string, value: string) => {
    const numValue = parseInt(value);
    if (value === '') {
      return 'この項目は必須です';
    }
    if (isNaN(numValue)) {
      return '数値を入力してください';
    }
    if (numValue < 1 || numValue > 100) {
      return '1から100の間の数値を入力してください';
    }
    return '';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    const error = validateInput(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const generateUuids = () => {
    const count = parseInt(formData.uuidCount);
    if (!errors.uuidCount && count > 0) {
      const newUuids = Array(count)
        .fill(null)
        .map(() => uuidv4());
      setUuids(newUuids);
    }
  };

  const generateNames = () => {
    const count = parseInt(formData.nameCount);
    if (!errors.nameCount && count > 0) {
      const newNames = Array(count)
        .fill(null)
        .map(() => {
          const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
          const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
          return `${lastName} ${firstName}`;
        });
      setNames(newNames);
    }
  };

  const generateNumbers = () => {
    const count = parseInt(formData.numberCount);
    const digits = parseInt(formData.numberDigits);
    if (!errors.numberCount && !errors.numberDigits && count > 0 && digits > 0) {
      const newNumbers = Array(count)
        .fill(null)
        .map(() => {
          const number = Math.floor(Math.random() * Math.pow(10, digits));
          return number.toString().padStart(digits, '0');
        });
      setNumbers(newNumbers);
    }
  };

  const generateStrings = () => {
    const count = parseInt(formData.stringCount);
    const length = parseInt(formData.stringLength);
    if (!errors.stringCount && !errors.stringLength && count > 0 && length > 0) {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      const newStrings = Array(count)
        .fill(null)
        .map(() => {
          return Array(length)
            .fill(null)
            .map(() => characters.charAt(Math.floor(Math.random() * characters.length)))
            .join('');
        });
      setStrings(newStrings);
    }
  };

  const copyToClipboard = useCallback(
    (text: string) => {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          toast({
            title: 'コピー成功',
            description: 'クリップボードにコピーしました',
            duration: 3000,
          });
        })
        .catch((err) => {
          console.error('Failed to copy: ', err);
          toast({
            title: 'コピー失敗',
            description: 'クリップボードへのコピーに失敗しました',
            duration: 3000,
            variant: 'destructive',
          });
        });
    },
    [toast]
  );

  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full overflow-auto bg-gray-100 p-4 md:w-1/3">
        <h2 className="mb-4 text-2xl font-bold">ダミーデータジェネレーター</h2>
        <form className="space-y-4">
          <div>
            <Label htmlFor="uuidCount">UUID 個数</Label>
            <NumberInput
              id="uuidCount"
              name="uuidCount"
              value={formData.uuidCount}
              onChange={handleInputChange}
              error={errors.uuidCount}
            />
            <Button
              type="button"
              onClick={generateUuids}
              className="mt-2"
              disabled={!!errors.uuidCount}
            >
              UUID生成
            </Button>
          </div>
          <div>
            <Label htmlFor="nameCount">人名 個数</Label>
            <NumberInput
              id="nameCount"
              name="nameCount"
              value={formData.nameCount}
              onChange={handleInputChange}
              error={errors.nameCount}
            />
            <Button
              type="button"
              onClick={generateNames}
              className="mt-2"
              disabled={!!errors.nameCount}
            >
              人名生成
            </Button>
          </div>
          <div>
            <Label htmlFor="numberCount">ランダム数字 個数</Label>
            <NumberInput
              id="numberCount"
              name="numberCount"
              value={formData.numberCount}
              onChange={handleInputChange}
              error={errors.numberCount}
            />
            <Label htmlFor="numberDigits">ランダム数字 桁数</Label>
            <NumberInput
              id="numberDigits"
              name="numberDigits"
              value={formData.numberDigits}
              onChange={handleInputChange}
              error={errors.numberDigits}
            />
            <Button
              type="button"
              onClick={generateNumbers}
              className="mt-2"
              disabled={!!errors.numberCount || !!errors.numberDigits}
            >
              数字生成
            </Button>
          </div>
          <div>
            <Label htmlFor="stringCount">ランダム文字列 個数</Label>
            <NumberInput
              id="stringCount"
              name="stringCount"
              value={formData.stringCount}
              onChange={handleInputChange}
              error={errors.stringCount}
            />
            <Label htmlFor="stringLength">ランダム文字列 長さ</Label>
            <NumberInput
              id="stringLength"
              name="stringLength"
              value={formData.stringLength}
              onChange={handleInputChange}
              error={errors.stringLength}
            />
            <Button
              type="button"
              onClick={generateStrings}
              className="mt-2"
              disabled={!!errors.stringCount || !!errors.stringLength}
            >
              文字列生成
            </Button>
          </div>
        </form>
      </div>
      <div className="w-full overflow-auto bg-white p-4 md:w-2/3">
        <h2 className="mb-4 text-2xl font-bold">生成されたデータ</h2>
        <div className="space-y-4">
          {uuids.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>UUID</CardTitle>
              </CardHeader>
              <CardContent>
                {uuids.map((uuid, index) => (
                  <div key={index} className="mb-2 flex items-center justify-between">
                    <span>{uuid}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(uuid)}
                      aria-label={`Copy UUID ${uuid}`}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          {names.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>人名</CardTitle>
              </CardHeader>
              <CardContent>
                {names.map((name, index) => (
                  <div key={index} className="mb-2 flex items-center justify-between">
                    <span>{name}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(name)}
                      aria-label={`Copy name ${name}`}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          {numbers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>ランダム数字</CardTitle>
              </CardHeader>
              <CardContent>
                {numbers.map((number, index) => (
                  <div key={index} className="mb-2 flex items-center justify-between">
                    <span>{number}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(number)}
                      aria-label={`Copy number ${number}`}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          {strings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>ランダム文字列</CardTitle>
              </CardHeader>
              <CardContent>
                {strings.map((str, index) => (
                  <div key={index} className="mb-2 flex items-center justify-between">
                    <span>{str}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(str)}
                      aria-label={`Copy string ${str}`}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <Toaster />
    </div>
  );
}
