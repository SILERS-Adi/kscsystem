import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@kscsystem/ui", "@kscsystem/types", "@kscsystem/email", "@kscsystem/payments"],
};

export default nextConfig;
