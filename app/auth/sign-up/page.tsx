import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import SignUpForm from "@/components/auth/sign-up-form"

export default async function SignUpPage() {
  // If Supabase is not configured, show demo message
  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen bg-background">
        {/* Left side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-primary text-primary-foreground p-12 flex-col justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-4">FreelanceHub</h1>
            <p className="text-xl opacity-90">
              Join our exclusive community of skilled professionals and innovative companies.
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>
              <span>Quality-focused projects</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>
              <span>Fair compensation</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>
              <span>Professional growth</span>
            </div>
          </div>
        </div>

        {/* Right side - Demo message */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center space-y-4 max-w-md">
            <h2 className="text-2xl font-bold text-foreground">Demo Mode</h2>
            <p className="text-muted-foreground">
              This is a demo version of FreelanceHub. To enable full registration functionality, 
              please set up your Supabase database connection.
            </p>
            <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground">
              <p><strong>To set up Supabase:</strong></p>
              <ol className="list-decimal list-inside space-y-1 mt-2">
                <li>Create a Supabase project</li>
                <li>Add your credentials to .env.local</li>
                <li>Run the database scripts</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Check if user is already logged in
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If user is logged in, redirect to home page
  if (session) {
    redirect("/")
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary text-primary-foreground p-12 flex-col justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-4">FreelanceHub</h1>
          <p className="text-xl opacity-90">
            Join our exclusive community of skilled professionals and innovative companies.
          </p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>
            <span>Quality-focused projects</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>
            <span>Fair compensation</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>
            <span>Professional growth</span>
          </div>
        </div>
      </div>

      {/* Right side - Sign up form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <SignUpForm />
      </div>
    </div>
  )
}
