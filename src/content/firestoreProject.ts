/**
 * Shape of data/projects.json — projects exported from the old Firebase portfolio
 * (scripts/export-firestore.js → scripts/build-projects-json.js). Named
 * FirestoreProject because `Project` in site.ts is the site's own, richer type.
 */
export interface FirestoreProject {
  /** Firestore id, a number as a string ("1"–"12") */
  id: string
  slug: string
  name: string
  type: 'Mobile App' | 'Web App' | 'Mobile & Web'
  status: 'Completed' | 'Development'
  live: boolean
  /** "Self" for own projects, otherwise "Company (domain)" */
  company: string
  role: string
  /** may contain \n line breaks and emoji */
  description: string
  /** empty for 9 of the 12 projects */
  features: string[]
  tech: string[]
  /** Cloudinary URL */
  thumbnail: string
  /** Cloudinary URLs, deduplicated and without the thumbnail */
  images: string[]
  links: {
    web?: string
    ios?: string
    android?: string
    github?: string
  }
}
