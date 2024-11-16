'use client';

import { Footer } from '@/components/Footer';
import DummyDataPage from '@/components/pages/DummyDataPage';
import JsonPage from '@/components/pages/JsonPage';
import RequestPage from '@/components/pages/RequestPage';
import TranslationPage from '@/components/pages/TranslationPage';
import { Button } from '@/components/ui';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/providers/AuthProvider';
import { Database, FileJson, Languages, LogOut, Send } from 'lucide-react';

export default function Component() {
  const { signOut, user } = useAuth();

  const services = [
    {
      id: 'api',
      name: 'APIリクエスト',
      icon: <Send className="h-4 w-4" />,
      description: '簡単にAPIリクエストを送信しレスポンスを確認',
      page: <RequestPage />,
    },
    {
      id: 'json',
      name: 'JSON整形',
      icon: <FileJson className="h-4 w-4" />,
      description: '複雑なJSONデータを見やすく整形',
      page: <JsonPage />,
    },
    {
      id: 'dummy_data_generate',
      name: 'ダミーデータ生成',
      icon: <Database className="h-4 w-4" />,
      description: '指定した形式のダミーデータを生成',
      page: <DummyDataPage />,
    },
    {
      id: 'translation_service',
      name: '翻訳サービス',
      icon: <Languages className="h-4 w-4" />,
      description: '複数翻訳サービスを使って結果を見比べることができる',
      page: <TranslationPage />,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <div className="container mx-auto flex flex-grow flex-col px-4 py-8">
        <h1 className="mb-4 text-center text-3xl font-bold">サービス一覧</h1>
        <div className="flex items-center gap-4">
          {user && (
            <>
              <span className="text-sm text-gray-600">{user.email}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut()}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                ログアウト
              </Button>
            </>
          )}
        </div>
        <Tabs defaultValue="api" className="flex w-full flex-grow flex-col">
          <TabsList className={`grid w-full grid-cols-4`}>
            {services.map((service) => (
              <TabsTrigger key={service.id} value={service.id} className="flex items-center gap-2">
                {service.icon}
                <span className="hidden sm:inline">{service.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          <div>
            {services.map((service) => (
              <TabsContent key={service.id} value={service.id} className="flex-grow">
                <Card className="flex h-full flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {service.icon}
                      {service.name}
                    </CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">{service.page}</CardContent>
                </Card>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
}
