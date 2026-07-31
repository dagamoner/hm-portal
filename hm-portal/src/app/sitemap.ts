import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://mhhigieneyseguridad.com',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://mhhigieneyseguridad.com/nosotros',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://mhhigieneyseguridad.com/contacto',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://mhhigieneyseguridad.com/login',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    }
  ]
}
