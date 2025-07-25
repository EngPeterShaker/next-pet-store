import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "http",
				hostname: "**",
				port: "",
				pathname: "**",
			},
			{
				protocol: "https",
				hostname: "**",
				port: "",
				pathname: "**",
			},
		],
	},
};

export default nextConfig;
