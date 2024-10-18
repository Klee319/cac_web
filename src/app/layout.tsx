import "./globals.css"; // グローバルCSSの読み込み
import { ReactNode } from "react";

export let metadata: { keywords: string; viewport: string; author: string; description: string; title: string };
metadata = {
    title: "C.A.C. Official Website",
    description: "introduction of C.A.C.",
    keywords:
        "C.A.C., 部活, 京産, 創作, 神山祭, 京都産業大学, CAC, サークル, パソコン, 情報理工学部, 情理, イラスト, CG, プログラミング, 音楽, 動画編集, シナリオ",
    viewport: "width=device-width, initial-scale=1.0, viewport-fit=cover",
    author: "C.A.C.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="ja">
        <head>
            {/* 正しいパスに修正 */}
            <link rel="manifest" href="/site.webmanifest" />
            <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />

            {/* メタデータ */}
            <title>{metadata.title}</title>
            <meta name="description" content={metadata.description} />
            <meta name="keywords" content={metadata.keywords} />
            <meta name="author" content={metadata.author} />
            <meta name="viewport" content={metadata.viewport} />
        </head>
        <body>
        <div>{children}</div> {/* ページの内容 */}
        </body>
        </html>
    );
}

