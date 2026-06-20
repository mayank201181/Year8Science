import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Year 8 Science Lab",
    short_name: "Science Lab",
    description: "Interactive Year 8 science — guides, quizzes, experiments and more.",
    start_url: "/",
    display: "standalone",
    background_color: "#eef2ff",
    theme_color: "#4f46e5",
    icons: [
      { src: "/api/appicon?size=192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/api/appicon?size=512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/api/appicon?size=512&maskable=1", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
