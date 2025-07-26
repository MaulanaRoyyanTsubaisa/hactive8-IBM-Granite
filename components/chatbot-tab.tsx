"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Send, Bot, User, Loader2, Zap, CheckCircle, AlertCircle } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  source?: string
  model?: string
}

export default function ChatbotTab() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "error" | "unknown">("unknown")
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Load chat history from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem("granite-chat-history")
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages)
        const messagesWithDates = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }))
        setMessages(messagesWithDates)
      } catch (error) {
        console.error("Error loading chat history:", error)
      }
    }
  }, [])

  // Save chat history to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("granite-chat-history", JSON.stringify(messages))
    }
  }, [messages])

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      const data = await response.json()

      // Update connection status based on response
      if (data.source === "IBM Granite 3.3 8B Instruct") {
        setConnectionStatus("connected")
      } else {
        setConnectionStatus("error")
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content || "I apologize, but I couldn't generate a response. Please try again.",
        timestamp: new Date(),
        source: data.source,
        model: data.model,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error:", error)
      setConnectionStatus("error")
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I'm experiencing some technical difficulties connecting to IBM Granite. Please try again in a moment.",
        timestamp: new Date(),
        source: "Error Handler",
        model: "Fallback",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const clearHistory = () => {
    setMessages([])
    localStorage.removeItem("granite-chat-history")
    setConnectionStatus("unknown")
  }

  const quickPrompts = [
    "Explain how machine learning works",
    "Write a Python function to sort a list",
    "What are the best practices for React development?",
    "How do I optimize database queries?",
  ]

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt)
  }

  const formatTimestamp = (timestamp: Date | string) => {
    try {
      const date = timestamp instanceof Date ? timestamp : new Date(timestamp)
      return date.toLocaleTimeString()
    } catch (error) {
      return new Date().toLocaleTimeString()
    }
  }

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case "connected":
        return <CheckCircle className="w-3 h-3 text-green-600" />
      case "error":
        return <AlertCircle className="w-3 h-3 text-red-600" />
      default:
        return <Zap className="w-3 h-3" />
    }
  }

  const getStatusText = () => {
    switch (connectionStatus) {
      case "connected":
        return "Connected to IBM Granite 3.3"
      case "error":
        return "Connection Issues"
      default:
        return "IBM Granite 3.3 8B"
    }
  }

  const getStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "bg-green-100 text-green-700"
      case "error":
        return "bg-red-100 text-red-700"
      default:
        return "bg-blue-100 text-blue-700"
    }
  }

  return (
    <div className="flex flex-col h-[500px] sm:h-[600px]">
      {/* Header - Mobile Responsive */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <h2 className="text-lg sm:text-xl font-semibold text-slate-800">IBM Granite 3.3 8B Chat</h2>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs w-fit ${getStatusColor()}`}>
            {getStatusIcon()}
            <span className="hidden sm:inline">{getStatusText()}</span>
            <span className="sm:hidden">
              {connectionStatus === "connected" ? "Connected" : connectionStatus === "error" ? "Error" : "Granite 3.3"}
            </span>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={clearHistory} disabled={messages.length === 0}>
          <span className="hidden sm:inline">Clear History</span>
          <span className="sm:hidden">Clear</span>
        </Button>
      </div>

      {/* Chat Area */}
      <ScrollArea className="flex-1 mb-4 border rounded-lg p-2 sm:p-4 bg-slate-50" ref={scrollAreaRef}>
        {messages.length === 0 ? (
          <div className="text-center text-slate-500 mt-4 sm:mt-8">
            <Bot className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-4 opacity-50" />
            <p className="font-medium mb-2 text-sm sm:text-base">Chat with IBM Granite 3.3 8B Instruct</p>
            <p className="text-xs sm:text-sm mb-4 px-2">Real AI model powered by IBM watsonx Granite 3.3</p>

            <div className="grid grid-cols-1 gap-2 max-w-md mx-auto px-2">
              {quickPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickPrompt(prompt)}
                  className="text-left justify-start h-auto p-2 text-xs leading-tight"
                >
                  {prompt}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 sm:gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                )}
                <Card
                  className={`max-w-[85%] sm:max-w-[80%] p-2 sm:p-3 ${
                    message.role === "user" ? "bg-blue-500 text-white" : "bg-white border-slate-200"
                  }`}
                >
                  <p className="text-xs sm:text-sm whitespace-pre-wrap break-words">{message.content}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 mt-2">
                    <p className={`text-xs opacity-70 ${message.role === "user" ? "text-blue-100" : "text-slate-500"}`}>
                      {formatTimestamp(message.timestamp)}
                    </p>
                    {message.source && message.role === "assistant" && (
                      <Badge variant="outline" className="text-xs w-fit">
                        {message.source === "IBM Granite 3.3 8B Instruct" ? "🤖 Real AI" : "⚠️ Fallback"}
                      </Badge>
                    )}
                  </div>
                </Card>
                {message.role === "user" && (
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-slate-500 flex items-center justify-center flex-shrink-0">
                    <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {isLoading && (
          <div className="flex gap-2 sm:gap-3 justify-start mt-4">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
              <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
            <Card className="bg-white border-slate-200 p-2 sm:p-3">
              <div className="flex items-center gap-2">
                <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                <p className="text-xs sm:text-sm text-slate-600">IBM Granite is thinking...</p>
              </div>
            </Card>
          </div>
        )}
      </ScrollArea>

      {/* Input Form - Mobile Responsive */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask IBM Granite..."
          disabled={isLoading}
          className="flex-1 text-sm"
        />
        <Button type="submit" disabled={isLoading || !input.trim()} size="sm" className="px-3 sm:px-4">
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </Button>
      </form>
    </div>
  )
}
