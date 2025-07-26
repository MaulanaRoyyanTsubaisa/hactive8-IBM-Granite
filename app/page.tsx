"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MessageSquare, Code } from "lucide-react";
import ChatbotTab from "@/components/chatbot-tab";
import CodeGeneratorTab from "@/components/code-generator-tab";

export default function Home() {
  const [activeTab, setActiveTab] = useState("chatbot");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-2 sm:p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-4 sm:mb-8 px-2">
          <h1 className="text-2xl sm:text-4xl font-bold text-slate-800 mb-2">
            Royyan Granite AI Assistant
          </h1>
          <p className="text-sm sm:text-base text-slate-600 px-2">
            Powered by IBM watsonx Granite - Chat or Generate Code
          </p>
        </div>

        <Card className="shadow-xl border-0 mx-2 sm:mx-0">
          <CardHeader className="pb-2 sm:pb-4 px-3 sm:px-6">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 h-10 sm:h-12">
                <TabsTrigger
                  value="chatbot"
                  className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
                >
                  <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Chatbot</span>
                  <span className="xs:hidden">Chat</span>
                </TabsTrigger>
                <TabsTrigger
                  value="code-generator"
                  className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
                >
                  <Code className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Code Generator</span>
                  <span className="xs:hidden">Code</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent className="p-3 sm:p-6">
            <Tabs value={activeTab} className="w-full">
              <TabsContent value="chatbot" className="mt-0">
                <ChatbotTab />
              </TabsContent>
              <TabsContent value="code-generator" className="mt-0">
                <CodeGeneratorTab />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
