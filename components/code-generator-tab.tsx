"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, Code, Loader2, Check, Zap } from "lucide-react"

interface CodeResult {
  id: string
  prompt: string
  code: string
  language: string
  timestamp: Date
}

export default function CodeGeneratorTab() {
  const [prompt, setPrompt] = useState("")
  const [result, setResult] = useState<CodeResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState<CodeResult[]>([])
  const [copied, setCopied] = useState(false)

  // Load code generation history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem("granite-code-history")
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory)
        // Convert timestamp strings back to Date objects
        const historyWithDates = parsedHistory.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }))
        setHistory(historyWithDates)
      } catch (error) {
        console.error("Error loading code history:", error)
      }
    }
  }, [])

  // Save code generation history to localStorage
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem("granite-code-history", JSON.stringify(history))
    }
  }, [history])

  const detectLanguage = (code: string): string => {
    if (code.includes("import React") || code.includes("jsx") || code.includes("tsx")) return "jsx"
    if (code.includes("def ") || code.includes("import ") || code.includes("print(")) return "python"
    if (code.includes("function ") || code.includes("const ") || code.includes("let ")) return "javascript"
    if (code.includes("public class") || code.includes("import java")) return "java"
    if (code.includes("#include") || code.includes("int main")) return "cpp"
    if (code.includes("SELECT") || code.includes("CREATE TABLE")) return "sql"
    if (code.includes("<!DOCTYPE") || code.includes("<html")) return "html"
    if (code.includes("body {") || code.includes(".class")) return "css"
    return "text"
  }

  const formatTimestamp = (timestamp: Date | string) => {
    try {
      const date = timestamp instanceof Date ? timestamp : new Date(timestamp)
      return date.toLocaleString()
    } catch (error) {
      return new Date().toLocaleString()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim() || isLoading) return

    setIsLoading(true)

    try {
      const response = await fetch("/api/generate-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate code")
      }

      const data = await response.json()
      const language = detectLanguage(data.code)

      const newResult: CodeResult = {
        id: Date.now().toString(),
        prompt: prompt.trim(),
        code: data.code,
        language,
        timestamp: new Date(),
      }

      setResult(newResult)
      setHistory((prev) => [newResult, ...prev.slice(0, 9)]) // Keep last 10 results
      setPrompt("")
    } catch (error) {
      console.error("Error:", error)
      setResult({
        id: Date.now().toString(),
        prompt: prompt.trim(),
        code: "// Error: Failed to generate code with IBM Granite model\n// Please try again with a more specific request\n\nconsole.log('Code generation failed');",
        language: "javascript",
        timestamp: new Date(),
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    if (result?.code) {
      await navigator.clipboard.writeText(result.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const clearHistory = () => {
    setHistory([])
    setResult(null)
    localStorage.removeItem("granite-code-history")
  }

  const examplePrompts = [
    "Create a React component for a todo list",
    "Write a Python function to sort a list",
    "Generate a REST API endpoint using Node.js",
    "Create a SQL query to find top customers",
  ]

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header - Mobile Responsive */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <h2 className="text-lg sm:text-xl font-semibold text-slate-800">IBM Granite 3.3 Code Generator</h2>
          <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs w-fit">
            <Zap className="w-3 h-3" />
            3.3 8B Model
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={clearHistory} disabled={history.length === 0}>
          <span className="hidden sm:inline">Clear History</span>
          <span className="sm:hidden">Clear</span>
        </Button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Describe the code you want IBM Granite 3.3 to generate:
          </label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Create a React component for a todo list with add, delete, and toggle functionality"
            disabled={isLoading}
            className="min-h-[80px] sm:min-h-[100px] text-sm"
          />

          {!prompt && (
            <div className="mt-3">
              <p className="text-xs text-slate-500 mb-2">Try these examples:</p>
              <div className="grid grid-cols-1 gap-1">
                {examplePrompts.map((example, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setPrompt(example)}
                    className="text-left justify-start h-auto p-2 text-xs text-slate-600 hover:text-slate-800 leading-tight"
                  >
                    • {example}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        <Button type="submit" disabled={isLoading || !prompt.trim()} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              <span className="hidden sm:inline">IBM Granite 3.3 is generating code...</span>
              <span className="sm:hidden">Generating...</span>
            </>
          ) : (
            <>
              <Code className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Generate Code with Granite 3.3</span>
              <span className="sm:hidden">Generate Code</span>
            </>
          )}
        </Button>
      </form>

      {/* Result */}
      {result && (
        <Card className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-0 mb-4">
            <div className="flex-1">
              <h3 className="font-medium text-slate-800 mb-1 text-sm sm:text-base">Generated by IBM Granite 3.3 8B</h3>
              <p className="text-xs sm:text-sm text-slate-600 mb-2 break-words">{result.prompt}</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs">
                  {result.language}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {formatTimestamp(result.timestamp)}
                </Badge>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="flex items-center gap-2 bg-transparent w-fit"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span className="hidden sm:inline">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span className="hidden sm:inline">Copy</span>
                </>
              )}
            </Button>
          </div>

          <div className="rounded-lg overflow-hidden border bg-slate-900">
            <pre className="p-3 sm:p-4 text-xs sm:text-sm font-mono text-slate-100 overflow-x-auto whitespace-pre-wrap">
              <code>{result.code}</code>
            </pre>
          </div>
        </Card>
      )}

      {/* History */}
      {history.length > 0 && (
        <div>
          <h3 className="text-base sm:text-lg font-medium text-slate-800 mb-4">Recent Generations</h3>
          <div className="space-y-3">
            {history.slice(0, 5).map((item) => (
              <Card
                key={item.id}
                className="p-3 sm:p-4 cursor-pointer hover:bg-slate-50 transition-colors border border-slate-200"
                onClick={() => setResult(item)}
              >
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3">
                    <p className="text-xs sm:text-sm font-medium text-slate-800 line-clamp-3 sm:line-clamp-2 flex-1 leading-relaxed break-words">
                      {item.prompt}
                    </p>
                    <div className="flex gap-2 flex-shrink-0">
                      <Badge variant="secondary" className="text-xs whitespace-nowrap">
                        {item.language}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">{formatTimestamp(item.timestamp)}</span>
                    <span className="text-xs text-slate-400 font-mono">Click to view</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        @media (min-width: 480px) {
          .xs\\:inline {
            display: inline;
          }
          .xs\\:hidden {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}
