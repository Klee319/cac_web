/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
        unoptimized:true, // trueで画像最適化を無効化 (ビルドする場合)
    },
}
module.exports = nextConfig
