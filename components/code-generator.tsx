"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"

interface CodeGeneratorProps {
  result: string
}

const CodeGenerator: React.FC<CodeGeneratorProps> = ({ result }) => {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <div className="relative">
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono whitespace-pre-wrap">
        <code>{result}</code>
      </pre>
      <Button
        onClick={copyToClipboard}
        size="sm"
        variant="outline"
        className="absolute top-2 right-2 bg-gray-800 hover:bg-gray-700 text-gray-200 border-gray-600"
      >
        <Copy className="h-4 w-4 mr-1" />
        {copied ? "Copied!" : "Copy"}
      </Button>
    </div>
  )
}

export default CodeGenerator
