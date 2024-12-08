import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{
      userAgent: "*",
      allow: "/",
      disallow: ["/private/", "/data/"],
    },
    { userAgent: "Googlebot", allow: "/", disallow: ["/private/"] }],
    sitemap: "https://glowtopia.fr/sitemap.xml",
  };
}