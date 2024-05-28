/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: ["d0shhpzlmtvscizy.public.blob.vercel-storage.com"],

    remotePatterns: [
      {
        protocol: "https",
        hostname: "my-blob-store.public.blob.vercel-storage.com",
        port: "",
      },
    ],
  },
};

export default nextConfig;
