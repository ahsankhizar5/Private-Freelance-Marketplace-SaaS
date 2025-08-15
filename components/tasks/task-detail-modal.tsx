"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, CheckCircle, Circle, AlertCircle, Loader2 } from "lucide-react"
import type { Task } from "@/lib/supabase/client"
import { supabase } from "@/lib/supabase/client"

interface TaskDetailModalProps {
  task: Task
  isAdmin: boolean
  currentUserId: string
  onClose: () => void
  onUpdate: () => void
}

export default function TaskDetailModal({ task, isAdmin, currentUserId, onClose, onUpdate }: TaskDetailModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Circle className="h-5 w-5 text-muted-foreground" />
      case "in_progress":
        return <AlertCircle className="h-5 w-5 text-blue-500" />
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      default:
        return <Circle className="h-5 w-5" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "in_progress":
        return "default"
      case "completed":
        return "outline"
      default:
        return "secondary"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString()
  }

  const canUpdateStatus = () => {
    // Freelancers can update their own tasks, admins can update any task
    return task.freelancer_id === currentUserId || isAdmin
  }

  const updateTaskStatus = async (newStatus: string) => {
    setLoading(true)
    setError("")

    try {
      const updateData: any = { status: newStatus }

      // If marking as completed, set completed_at timestamp
      if (newStatus === "completed") {
        updateData.completed_at = new Date().toISOString()
      } else {
        updateData.completed_at = null
      }

      const { error: updateError } = await supabase.from("tasks").update(updateData).eq("id", task.id)

      if (updateError) {
        throw updateError
      }

      onUpdate()
      onClose()
    } catch (err: any) {
      setError(err.message || "Failed to update task")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getStatusIcon(task.status)}
            {task.title}
          </DialogTitle>
          <DialogDescription>Task details and status management</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {error && (
            <div className="bg-destructive/10 border border-destructive/50 text-destructive px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Task Info */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status</span>
              <Badge variant={getStatusColor(task.status)}>{task.status.replace("_", " ")}</Badge>
            </div>

            {task.description && (
              <div>
                <span className="text-sm font-medium">Description</span>
                <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{task.description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Created</span>
                <div className="flex items-center gap-1 text-muted-foreground mt-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatDate(task.created_at)}</span>
                </div>
              </div>

              {task.due_date && (
                <div>
                  <span className="font-medium">Due Date</span>
                  <div
                    className={`flex items-center gap-1 mt-1 ${isOverdue(task.due_date) ? "text-red-500" : "text-muted-foreground"}`}
                  >
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(task.due_date)}</span>
                    {isOverdue(task.due_date) && <span className="text-xs">(Overdue)</span>}
                  </div>
                </div>
              )}

              {task.completed_at && (
                <div className="col-span-2">
                  <span className="font-medium">Completed</span>
                  <div className="flex items-center gap-1 text-green-600 mt-1">
                    <CheckCircle className="h-4 w-4" />
                    <span>{formatDate(task.completed_at)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Status Update */}
          {canUpdateStatus() && task.status !== "completed" && (
            <div className="space-y-3">
              <span className="text-sm font-medium">Update Status</span>
              <div className="flex gap-2">
                {task.status === "pending" && (
                  <Button onClick={() => updateTaskStatus("in_progress")} disabled={loading} className="flex-1">
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <AlertCircle className="mr-2 h-4 w-4" />
                    )}
                    Start Task
                  </Button>
                )}

                {task.status === "in_progress" && (
                  <>
                    <Button onClick={() => updateTaskStatus("completed")} disabled={loading} className="flex-1">
                      {loading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="mr-2 h-4 w-4" />
                      )}
                      Mark Complete
                    </Button>
                    <Button variant="outline" onClick={() => updateTaskStatus("pending")} disabled={loading}>
                      Back to Pending
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Admin Controls */}
          {isAdmin && (
            <div className="space-y-3 border-t pt-4">
              <span className="text-sm font-medium">Admin Controls</span>
              <Select value={task.status} onValueChange={updateTaskStatus} disabled={loading}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
