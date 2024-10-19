import "./globals.css"; // グローバルCSSの読み込み
import { ReactNode } from "react";


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


        </head>
        <body>
        <div>{children}</div> {/* ページの内容 */}
        </body>
        </html>
    );
}

