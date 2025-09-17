// Structured Data Templates for SEO
export const structuredDataTemplates = {
  // Organization Schema
  organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "MedYatra",
    "description": "AI-powered medical tourism platform connecting patients with top clinics in India for Hair, IVF, Dental, and Cosmetic treatments.",
    "url": "https://medyatra.space",
    "logo": "https://medyatra.space/logo.webp",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-555-123-4567",
      "contactType": "customer service",
      "email": "contact@medyatra.space"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "New Delhi",
      "addressCountry": "India"
    },
    "sameAs": [
      "https://medyatra.space"
    ]
  },

  // Medical Organization Schema
  medicalOrganization: {
    "@context": "https://schema.org",
    "@type": "MedicalOrganization",
    "name": "MedYatra",
    "description": "Leading medical tourism platform specializing in Hair Transplant, IVF, Dental, and Cosmetic treatments in India.",
    "url": "https://medyatra.space",
    "logo": "https://medyatra.space/logo.webp",
    "medicalSpecialty": [
      "Hair Transplant",
      "IVF Treatment", 
      "Dental Care",
      "Cosmetic Surgery"
    ],
    "areaServed": {
      "@type": "Country",
      "name": "India"
    }
  },

  // Service Schema
  service: (serviceName, description, url) => ({
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    "name": serviceName,
    "description": description,
    "url": url,
    "provider": {
      "@type": "MedicalOrganization",
      "name": "MedYatra",
      "url": "https://medyatra.space"
    },
    "areaServed": {
      "@type": "Country", 
      "name": "India"
    }
  }),

  // WebSite Schema
  website: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "MedYatra",
    "description": "AI-powered medical tourism platform for treatments in India",
    "url": "https://medyatra.space",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://medyatra.space/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  },

  // FAQ Schema
  faq: (faqs) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }),

  // Blog Post Schema
  blogPost: (title, description, url, datePublished, author = "MedYatra Team") => ({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": description,
    "url": url,
    "datePublished": datePublished,
    "dateModified": datePublished,
    "author": {
      "@type": "Organization",
      "name": author
    },
    "publisher": {
      "@type": "Organization",
      "name": "MedYatra",
      "logo": {
        "@type": "ImageObject",
        "url": "https://medyatra.space/logo.webp"
      }
    }
  }),

  // Contact Page Schema
  contactPage: {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact MedYatra",
    "description": "Get in touch with MedYatra for medical tourism inquiries and support",
    "url": "https://medyatra.space/contact",
    "mainEntity": {
      "@type": "Organization",
      "name": "MedYatra",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+1-555-123-4567",
        "contactType": "customer service",
        "email": "contact@medyatra.space"
      }
    }
  }
};

export default structuredDataTemplates;

