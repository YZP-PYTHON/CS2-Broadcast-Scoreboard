import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: [
    "127.0.0.1",
    "localhost",
  ],
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true, //不要学我
  },
};

export default nextConfig;
