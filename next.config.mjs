/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep M0's "build doesn't gate on types" behavior. (Next 16 no longer lints
  // during `next build`, so the old `eslint.ignoreDuringBuilds` key is gone.)
  typescript: { ignoreBuildErrors: true },
};
export default nextConfig;
