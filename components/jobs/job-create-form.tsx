"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

const COMMON_SKILLS = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "PHP",
  "Java",
  "UI/UX Design",
  "Graphic Design",
  "Content Writing",
  "SEO",
  "Marketing",
  "Data Analysis",
  "Mobile Development",
  "WordPress",
  "Shopify",
  "Database Design",
  "DevOps",
  "Testing",
]

export default function JobCreateForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [budgetMin, setBudgetMin] = useState("")
  const [budgetMax, setBudgetMax] = useState("")
  const [deadline, setDeadline] = useState("")
  const [jobType, setJobType] = useState("")
  const [experienceLevel, setExperienceLevel] = useState("")
  const [estimatedHours, setEstimatedHours] = useState("")
  const [requirements, setRequirements] = useState<string[]>([])
  const [skillsRequired, setSkillsRequired] = useState<string[]>([])
  const [newRequirement, setNewRequirement] = useState("")
  const [newSkill, setNewSkill] = useState("")

  const addRequirement = () => {
    if (newRequirement.trim() && !requirements.includes(newRequirement.trim())) {
      setRequirements([...requirements, newRequirement.trim()])
      setNewRequirement("")
    }
  }

  const removeRequirement = (req: string) => {
    setRequirements(requirements.filter((r) => r !== req))
  }

  const addSkill = (skill: string) => {
    if (!skillsRequired.includes(skill)) {
      setSkillsRequired([...skillsRequired, skill])
    }
  }

  const removeSkill = (skill: string) => {
    setSkillsRequired(skillsRequired.filter((s) => s !== skill))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("Not authenticated")
      }

      const jobData = {
        admin_id: user.id,
        title: title.trim(),
        description: description.trim(),
        requirements: requirements.length > 0 ? requirements : null,
        budget_min: budgetMin ? Number.parseFloat(budgetMin) : null,
        budget_max: budgetMax ? Number.parseFloat(budgetMax) : null,
        deadline: deadline || null,
        skills_required: skillsRequired.length > 0 ? skillsRequired : null,
        experience_level: experienceLevel || null,
        job_type: jobType || null,
        estimated_hours: estimatedHours ? Number.parseInt(estimatedHours) : null,
        status: "open",
      }

      const { data, error: insertError } = await supabase.from("jobs").insert(jobData).select().single()

      if (insertError) {
        throw insertError
      }

      router.push(`/admin/jobs/${data.id}`)
    } catch (err: any) {
      setError(err.message || "Failed to create job")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-destructive/10 border border-destructive/50 text-destructive px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Job Title *
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Build a React Dashboard"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2">
                Job Description *
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your project in detail..."
                rows={6}
                required
              />
            </div>
          </div>

          {/* Budget and Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="budgetMin" className="block text-sm font-medium mb-2">
                Budget Range (USD)
              </label>
              <div className="flex space-x-2">
                <Input
                  id="budgetMin"
                  type="number"
                  value={budgetMin}
                  onChange={(e) => setBudgetMin(e.target.value)}
                  placeholder="Min"
                />
                <Input
                  type="number"
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(e.target.value)}
                  placeholder="Max"
                />
              </div>
            </div>

            <div>
              <label htmlFor="deadline" className="block text-sm font-medium mb-2">
                Deadline
              </label>
              <Input id="deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            </div>
          </div>

          {/* Job Type and Experience */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Job Type</label>
              <Select value={jobType} onValueChange={setJobType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed Price</SelectItem>
                  <SelectItem value="hourly">Hourly Rate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Experience Level</label>
              <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Estimated Hours */}
          {jobType === "hourly" && (
            <div>
              <label htmlFor="estimatedHours" className="block text-sm font-medium mb-2">
                Estimated Hours
              </label>
              <Input
                id="estimatedHours"
                type="number"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
                placeholder="e.g., 40"
              />
            </div>
          )}

          {/* Requirements */}
          <div>
            <label className="block text-sm font-medium mb-2">Requirements</label>
            <div className="flex space-x-2 mb-2">
              <Input
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                placeholder="Add a requirement..."
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addRequirement())}
              />
              <Button type="button" onClick={addRequirement} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {requirements.map((req) => (
                <Badge key={req} variant="secondary" className="flex items-center gap-1">
                  {req}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeRequirement(req)} />
                </Badge>
              ))}
            </div>
          </div>

          {/* Skills Required */}
          <div>
            <label className="block text-sm font-medium mb-2">Skills Required</label>
            <div className="mb-3">
              <p className="text-sm text-muted-foreground mb-2">Common skills:</p>
              <div className="flex flex-wrap gap-2">
                {COMMON_SKILLS.map((skill) => (
                  <Badge
                    key={skill}
                    variant={skillsRequired.includes(skill) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => (skillsRequired.includes(skill) ? removeSkill(skill) : addSkill(skill))}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex space-x-2 mb-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add custom skill..."
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill(newSkill), setNewSkill(""))}
              />
              <Button type="button" onClick={() => (addSkill(newSkill), setNewSkill(""))} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skillsRequired.map((skill) => (
                <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                  {skill}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeSkill(skill)} />
                </Badge>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Job...
                </>
              ) : (
                "Post Job"
              )}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
