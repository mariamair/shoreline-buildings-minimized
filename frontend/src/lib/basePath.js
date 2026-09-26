/**
 * Helper function to use basePath with all fetch calls.
 * 
 * @author Maria Mair <mm225mz@student.lnu.se>
 */

export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

export function withBasePath(path) {
  return `${basePath}${path.startsWith('/') ? path : `/${path}`}`
}
