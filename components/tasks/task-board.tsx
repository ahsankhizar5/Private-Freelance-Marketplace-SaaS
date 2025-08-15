"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, CheckCircle, Circle, AlertCircle } from "lucide-react"
import type { Task } from "@/lib/supabase/client"
import TaskDetailModal from "./task-detail-modal"

interface TaskBoardProps {
  tasks: Task[]
  jobId: string
  isAdmin: boolean
  currentUserId: string
}

export default function TaskBoard({ tasks, jobId, isAdmin, currentUserId }: TaskBoardProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const tasksByStatus = {
    pending: tasks.filter((task) => task.status === "pending"),
    in_progress: tasks.filter((task) => task.status === "in_progress"),
    completed: tasks.filter((task) => task.status === "completed"),
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Circle className="h-4 w-4 text-muted-foreground" />
      case "in_progress":
        return <AlertCircle className="h-4 w-4 text-blue-500" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Circle className="h-4 w-4" />
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

  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No tasks yet</h3>
          <p className="text-muted-foreground">
            {isAdmin
              ? "Create your first task to start organizing the project."
              : "Tasks will appear here once the admin creates them."}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pending Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Circle className="h-5 w-5 text-muted-foreground" />
              Pending ({tasksByStatus.pending.length})
            </CardTitle>
            <CardDescription>Tasks waiting to be started</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {tasksByStatus.pending.map((task) => (
              <Card
                key={task.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedTask(task)}
              >
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium line-clamp-2">{task.title}</h4>
                      <Badge variant={getStatusColor(task.status)} className="ml-2">
                        {task.status.replace("_", " ")}
                      </Badge>
                    </div>
                    {task.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
                    )}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      {task.due_date && (
                        <div className={`flex items-center gap-1 ${isOverdue(task.due_date) ? "text-red-500" : ""}`}>
                          <Calendar className="h-3 w-3" />
                          <span>Due {formatDate(task.due_date)}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(task.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        {/* In Progress Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-blue-500" />
              In Progress ({tasksByStatus.in_progress.length})
            </CardTitle>
            <CardDescription>Tasks currently being worked on</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {tasksByStatus.in_progress.map((task) => (
              <Card
                key={task.id}
                className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-blue-500"
                onClick={() => setSelectedTask(task)}
              >
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium line-clamp-2">{task.title}</h4>
                      <Badge variant={getStatusColor(task.status)} className="ml-2">
                        {task.status.replace("_", " ")}
                      </Badge>
                    </div>
                    {task.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
                    )}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      {task.due_date && (
                        <div className={`flex items-center gap-1 ${isOverdue(task.due_date) ? "text-red-500" : ""}`}>
                          <Calendar className="h-3 w-3" />
                          <span>Due {formatDate(task.due_date)}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(task.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        {/* Completed Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Completed ({tasksByStatus.completed.length})
            </CardTitle>
            <CardDescription>Finished tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {tasksByStatus.completed.map((task) => (
              <Card
                key={task.id}
                className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-green-500 opacity-75"
                onClick={() => setSelectedTask(task)}
              >
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium line-clamp-2">{task.title}</h4>
                      <Badge variant={getStatusColor(task.status)} className="ml-2">
                        {task.status.replace("_", " ")}
                      </Badge>
                    </div>
                    {task.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
                    )}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      {task.completed_at && (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="h-3 w-3" />
                          <span>Completed {formatDate(task.completed_at)}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(task.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          isAdmin={isAdmin}
          currentUserId={currentUserId}
          onClose={() => setSelectedTask(null)}
          onUpdate={() => window.location.reload()}
        />
      )}
    </>
  )
}
