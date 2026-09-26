/**
 * Defines the Next.js config options.
 * 
 * @author Maria Mair <mm225mz@student.lnu.se>
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  output: 'standalone',
  basePath: '/shorelinebuildings',
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
}

export default nextConfig
