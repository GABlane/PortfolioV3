import { ogSize, renderOg } from "@/lib/og";

export const alt = "John Gabrielle Ofiangga — Full-Stack Software Developer";
export const size = ogSize;
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOg({
    eyebrow: "Portfolio · Philippines",
    title: "I build software that turns complex ideas into polished digital products.",
    subtitle: "Web applications, backend systems, mobile experiences, and practical AI integrations.",
  });
}
