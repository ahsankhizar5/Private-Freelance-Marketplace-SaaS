export function generateWebApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "FreelanceHub",
    "description": "Professional SaaS freelancing marketplace platform connecting businesses with top freelancers. Built with Next.js 14, Supabase, and TypeScript by Ahsan Khizar.",
    "url": "https://freelancehub-saas.vercel.app",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "description": "Free tier available with premium subscriptions"
    },
    "creator": {
      "@type": "Person",
      "name": "Ahsan Khizar",
      "url": "https://github.com/ahsankhizar5",
      "sameAs": [
        "https://www.linkedin.com/in/ahsankhizar",
        "https://github.com/ahsankhizar5"
      ]
    },
    "author": {
      "@type": "Person", 
      "name": "Ahsan Khizar"
    },
    "featureList": [
      "Real-time messaging",
      "Job marketplace",
      "Bidding system", 
      "Task management",
      "User ratings and reviews",
      "Subscription tiers",
      "Advanced analytics",
      "Community features"
    ],
    "screenshot": "https://freelancehub-saas.vercel.app/og-image.png"
  }
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization", 
    "name": "FreelanceHub",
    "url": "https://freelancehub-saas.vercel.app",
    "logo": "https://freelancehub-saas.vercel.app/logo.png",
    "founder": {
      "@type": "Person",
      "name": "Ahsan Khizar"
    },
    "description": "Premier SaaS freelancing marketplace platform built with modern technologies"
  }
}

export function generateSoftwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "FreelanceHub",
    "operatingSystem": "Web Browser",
    "applicationCategory": "BusinessApplication",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "150"
    },
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    }
  }
}
