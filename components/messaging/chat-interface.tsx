"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, Paperclip, User } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import type { Message, User as UserType } from "@/lib/supabase/client"

interface ChatInterfaceProps {
  jobId: string
  currentUser: UserType
  otherUser: UserType
}

export default function ChatInterface({ jobId, currentUser, otherUser }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<(Message & { sender: UserType })[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Load initial messages
  useEffect(() => {
    loadMessages()
  }, [jobId])

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel(`messages-${jobId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `job_id=eq.${jobId}`,
        },
        async (payload) => {
          const newMessage = payload.new as Message

          // Get sender info
          const { data: sender } = await supabase.from("users").select("*").eq("id", newMessage.sender_id).single()

          if (sender) {
            setMessages((prev) => [...prev, { ...newMessage, sender }])
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [jobId])

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select(`
          *,
          sender:users!messages_sender_id_fkey(*)
        `)
        .eq("job_id", jobId)
        .order("created_at", { ascending: true })

      if (error) throw error

      setMessages(data || [])
    } catch (error) {
      console.error("Error loading messages:", error)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || loading) return

    setLoading(true)
    try {
      const { error } = await supabase.from("messages").insert({
        job_id: jobId,
        sender_id: currentUser.id,
        receiver_id: otherUser.id,
        content: newMessage.trim(),
        message_type: "text",
      })

      if (error) throw error

      setNewMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    }
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {otherUser.full_name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <span>{otherUser.full_name}</span>
            <Badge variant="outline" className="ml-2 text-xs">
              {otherUser.role}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => {
              const isCurrentUser = message.sender_id === currentUser.id
              return (
                <div key={message.id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                  <div className={`flex gap-2 max-w-[70%] ${isCurrentUser ? "flex-row-reverse" : "flex-row"}`}>
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="text-xs">
                        {message.sender.full_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`space-y-1 ${isCurrentUser ? "text-right" : "text-left"}`}>
                      <div
                        className={`rounded-lg px-3 py-2 ${
                          isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{message.sender.full_name}</span>
                        <span>•</span>
                        <span>{formatTime(message.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t p-4">
          <form onSubmit={sendMessage} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={loading}
              className="flex-1"
            />
            <Button type="button" variant="outline" size="icon" disabled>
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button type="submit" disabled={loading || !newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}
