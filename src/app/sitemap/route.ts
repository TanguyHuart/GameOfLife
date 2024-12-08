
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

const baseUrl = "https://glowtopia.fr"

const staticsUrls = [
  {
    url: `${baseUrl}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 1,
  },
  {
    url: `${baseUrl}/sandbox`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 1,
  },
]

  return [...staticsUrls];

}