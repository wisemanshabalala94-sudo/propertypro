import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PropertyPro",
    short_name: "PropertyPro",
    description: "Property collections, reconciliation, onboarding, and approvals.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0f766e",
    orientation: "portrait",
    icons: [
      {
        src: "/wiseworx-logo.png",
        sizes: "512x512",
        type: "image/png"
      }
    ]
  };
}
