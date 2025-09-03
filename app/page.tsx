"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, User, Mic, Paperclip } from "lucide-react"
import Dither from "@/components/Dither"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

const quickReplies = ["Help me plan", "Help me write", "Inspire me", "Save me time"]

export default function ChatbotInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    try {
      const response = await fetch("/api/webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: content.trim(),
          timestamp: new Date().toISOString(),
          sender: "user",
          messageId: userMessage.id,
        }),
      })

      const result = await response.json()

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: result.response,
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Failed to send message:", error)
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I'm experiencing technical difficulties. Please try again later.",
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
    }

    setIsTyping(false)
  }

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSendMessage(inputValue)
  }

  return (
    <div className="flex flex-col h-screen bg-black relative">
      <div className="absolute inset-0 z-0">
        <Dither
          waveColor={[0.2, 0.1, 0.4]}
          disableAnimation={false}
          enableMouseInteraction={true}
          mouseRadius={0.3}
          colorNum={6}
          waveAmplitude={0.2}
          waveFrequency={2}
          waveSpeed={0.02}
          pixelSize={3}
        />
      </div>

      <div className="absolute inset-0 bg-black/40 z-[1]"></div>

      <div className="absolute top-0 left-0 right-0 z-20 bg-transparent py-4">
        <div className="max-w-md mx-auto px-6">
          <div className="bg-white border border-gray-200 rounded-2xl px-6 py-3 flex items-center justify-center shadow-lg">
            <img src="/images/bobbie-banner.png" alt="Bobbie Logo" className="h-8 object-contain" />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pt-20 relative z-10">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <div className="mb-8">
                <div className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6 mx-auto shadow-2xl shadow-purple-500/25 overflow-hidden">
                  <img src="/images/bobbie-profile.png" alt="Bobbie Profile" className="w-full h-full object-cover" />
                </div>
                <h2 className="text-4xl font-bold text-white mb-4 text-balance">Hello, I'm Bobbie</h2>
                <p className="text-gray-300 text-xl">Your AI companion ready to help with anything</p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {messages.map((message) => (
                <div key={message.id} className="space-y-4">
                  {message.sender === "user" && (
                    <div className="flex items-start gap-4 justify-end">
                      <div className="flex-1 max-w-2xl">
                        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl rounded-tr-md px-6 py-4 shadow-xl shadow-purple-500/25 border border-purple-500/30">
                          <p className="leading-relaxed">{message.content}</p>
                        </div>
                      </div>
                      <Avatar className="h-12 w-12 bg-gradient-to-br from-purple-500 to-blue-600 shrink-0 shadow-lg shadow-purple-500/25 border-2 border-purple-400/30">
                        <AvatarFallback className="bg-transparent text-white font-medium">
                          <User className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  )}

                  {message.sender === "ai" && (
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/25 border-2 border-purple-400/30 overflow-hidden">
                        <img
                          src="/images/bobbie-profile.png"
                          alt="Bobbie Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 max-w-2xl">
                        <div className="bg-gray-900/80 backdrop-blur-sm text-gray-100 rounded-2xl rounded-tl-md px-6 py-4 shadow-xl border border-gray-700/50 shadow-gray-900/25">
                          <p className="leading-relaxed">{message.content}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/25 border-2 border-purple-400/30 overflow-hidden">
                    <img src="/images/bobbie-profile.png" alt="Bobbie Profile" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 max-w-2xl">
                    <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl rounded-tl-md px-6 py-4 shadow-xl border border-gray-700/50">
                      <div className="flex gap-2 py-1">
                        <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.3s] shadow-sm shadow-purple-400/50"></div>
                        <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s] shadow-sm shadow-purple-400/50"></div>
                        <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce shadow-sm shadow-purple-400/50"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {messages.length === 0 && (
        <div className="max-w-4xl mx-auto px-6 pb-6 relative z-10">
          <div className="flex flex-wrap justify-center gap-3">
            {quickReplies.map((reply, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => handleQuickReply(reply)}
                className="bg-gray-900/80 backdrop-blur-sm border-gray-700/50 text-gray-100 hover:bg-purple-600/20 hover:border-purple-500/50 hover:text-white rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/25 hover:scale-105"
              >
                {reply}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-black/80 backdrop-blur-md border-t border-gray-800/50 sticky bottom-0 relative z-10">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex items-center gap-4 bg-gray-900/80 backdrop-blur-sm rounded-2xl px-6 py-4 border border-gray-700/50 focus-within:border-purple-500/50 focus-within:shadow-lg focus-within:shadow-purple-500/25 transition-all duration-300 shadow-xl">
              <Paperclip className="h-5 w-5 text-gray-400 shrink-0 cursor-pointer hover:text-purple-400 transition-colors" />
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask Bobbie anything..."
                className="flex-1 bg-transparent border-0 focus:ring-0 focus:outline-none text-white placeholder-gray-400 text-base"
                disabled={isTyping}
              />
              <Mic className="h-5 w-5 text-gray-400 shrink-0 cursor-pointer hover:text-purple-400 transition-colors" />
              <Button
                type="submit"
                size="icon"
                disabled={!inputValue.trim() || isTyping}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white h-10 w-10 rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-200 hover:scale-105"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </form>
          <div className="text-center mt-4">
            <p className="text-xs text-gray-400">
              Bobbie can make mistakes, so double-check important information. Your conversations help improve the AI.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
