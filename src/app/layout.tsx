import "./globals.css"; // グローバルCSSの読み込み
import { ReactNode } from "react";
import Head from "next/head";


export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="ja">
        <head>
            <title>C.A.C. Official Website</title>
            <link rel="manifest" href="/site.webmanifest" />
            <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
            <meta name="description" content="introduction of C.A.C." />
            <meta name="keywords" content="C.A.C., 京産, サークル" />
            <meta name="author" content="C.A.C." />
            {/* メタデータ */}
        </head>
            {children}
        </html>
    );
}

