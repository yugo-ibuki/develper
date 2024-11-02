'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, FileJson, Database } from 'lucide-react';
import RequestPage from '@/components/pages/request';
import JsonPage from '@/components/pages/JsonPage';
import DummyDataPage from '@/components/pages/DummyDataPage';
import { Footer } from '@/components/Footer';
import { useEffect, useState } from 'react';

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
];

export default function Component() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="container mx-auto flex flex-grow flex-col px-4 py-8">
        <h1 className="mb-4 text-center text-3xl font-bold">サービス一覧</h1>
        <Tabs defaultValue="api" className="flex w-full flex-grow flex-col">
          <TabsList className={`grid w-full grid-cols-${services.length}`}>
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
