import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/admin",
  transpilePackages: ["@kscsystem/ui", "@kscsystem/types"],
};

export default nextConfig;
