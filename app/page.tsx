import { Hero } from "@/components/sections/Hero";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Expertise } from "@/components/sections/Expertise";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { JsonLd } from "@/components/seo/JsonLd";
import { profile } from "@/data/profile";
import { siteUrl } from "@/lib/site";

export default function HomePage() {
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    alternateName: profile.preferredName,
    jobTitle: profile.title,
    url: siteUrl,
    email: `mailto:${profile.email}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Caloocan City",
      addressCountry: "PH",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: profile.education.school,
    },
    sameAs: [profile.social.github, profile.social.linkedin],
    knowsAbout: ["Full-stack development", "React", "Next.js", "TypeScript", "FastAPI", "REST APIs", "AI integration"],
  };

  return (
    <>
      <JsonLd data={person} />
      <Hero />
      <Experience />
      <Projects />
      <Expertise />
      <About />
      <Contact />
    </>
  );
}
