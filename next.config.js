/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
        unoptimized: true, // 画像最適化を無効化 (CDNを使わない場合)
    },
}
const withVideos = require('next-videos')

module.exports = withVideos()
module.exports = nextConfig
