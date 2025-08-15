import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Startup Founder",
    avatar: "/professional-woman-diverse.png",
    content:
      "FreelanceHub helped us find incredible developers who understood our vision. The quality of work exceeded our expectations.",
    rating: 5,
  },
  {
    name: "Marcus Rodriguez",
    role: "Full-Stack Developer",
    avatar: "/professional-man-developer.png",
    content:
      "As a freelancer, this platform has connected me with amazing projects and clients who value quality work. Highly recommended!",
    rating: 5,
  },
  {
    name: "Emily Watson",
    role: "Design Agency Owner",
    avatar: "/professional-woman-designer.png",
    content:
      "The project management tools and communication features make collaboration seamless. Our team productivity has increased significantly.",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 px-4 bg-muted/20">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Trusted by Thousands</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See what our community members say about their experience on FreelanceHub.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-border">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
