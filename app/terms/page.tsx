import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-green-600">
            FreelanceHub
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-green-600">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button className="bg-green-600 hover:bg-green-700">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-lg text-gray-600">Last updated: January 15, 2025</p>
          </div>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 prose prose-gray max-w-none">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600 mb-6">
                By accessing and using FreelanceHub ("the Platform"), you accept and agree to be bound by the terms and
                provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Use License</h2>
              <p className="text-gray-600 mb-4">
                Permission is granted to temporarily download one copy of FreelanceHub per device for personal,
                non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and
                under this license you may not:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                <li>modify or copy the materials</li>
                <li>use the materials for any commercial purpose or for any public display</li>
                <li>attempt to reverse engineer any software contained on the Platform</li>
                <li>remove any copyright or other proprietary notations from the materials</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
              <p className="text-gray-600 mb-6">
                When you create an account with us, you must provide information that is accurate, complete, and current
                at all times. You are responsible for safeguarding the password and for all activities that occur under
                your account.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Payment Terms</h2>
              <p className="text-gray-600 mb-6">
                All payments are processed securely through our payment partners. Freelancers will receive payment
                according to the terms agreed upon in individual project contracts. FreelanceHub charges a service fee
                as outlined in our pricing structure.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Prohibited Uses</h2>
              <p className="text-gray-600 mb-4">You may not use our service:</p>
              <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                <li>
                  To violate any international, federal, provincial, or state regulations, rules, laws, or local
                  ordinances
                </li>
                <li>
                  To infringe upon or violate our intellectual property rights or the intellectual property rights of
                  others
                </li>
                <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                <li>To submit false or misleading information</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Disclaimer</h2>
              <p className="text-gray-600 mb-6">
                The information on this Platform is provided on an 'as is' basis. To the fullest extent permitted by
                law, this Company excludes all representations, warranties, conditions and terms related to our Platform
                and the use of this Platform.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Limitations</h2>
              <p className="text-gray-600 mb-6">
                In no event shall FreelanceHub or its suppliers be liable for any damages (including, without
                limitation, damages for loss of data or profit, or due to business interruption) arising out of the use
                or inability to use the Platform.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Contact Information</h2>
              <p className="text-gray-600 mb-6">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email:</strong> legal@freelancehub.com
                  <br />
                  <strong>Address:</strong> 123 Innovation Drive, San Francisco, CA 94105
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
