/** @type {import('next').NextConfig} */
const nextConfig = {
 

  async rewrites() {

    return [
      {
        source: '/pages/api/:path*',
        destination: 'https://boosters-sooty.vercel.app/pages/api/:path*',
      },
    ];

  },
};

export default nextConfig;
