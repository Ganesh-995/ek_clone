/** @type {import('next').NextConfig} */
const nextConfig = {
  // mongodb pulls in optional native/driver deps (kerberos, snappy, aws4, etc.)
  // that break when bundled into the Netlify serverless function. Keep it external
  // so it's required from node_modules at runtime instead.
  serverExternalPackages: ['mongodb'],
};

export default nextConfig;
