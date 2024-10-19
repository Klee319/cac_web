"use client";
import Image from "next/image";
import "./welcome.css";
import Head from "next/head";

export default function Welcome() {
    return (
        // 画面全体を覆うdiv
        <div className="relative w-full h-screen overflow-hidden welcome " >
            {/* 背景画像 */}
            <div className="absolute inset-0 w-full h-full">
                <Image
                    src="/main/welcomeCAC.png"
                    alt="背景"
                    fill
                    style={{ objectFit: "cover", objectPosition: "center" }}
                    priority
                    className="select-none"
                />
            </div>

            {/* 中央のコンテンツ */}
            <div className="flex flex-col items-center justify-center welcome-main">

                {/* イメージキャラクター画像 */}
                <div className="w-[300px] h-[300px] pt-24 translate-y-5 translate-x-5 cac-cat">
                    <Image
                        src="/main/imageCAT.png"
                        alt="イメージキャラクター"
                        width={400}
                        height={400}
                        priority
                        className="select-none"
                        style={{ objectFit: "cover", objectPosition: "center" }}
                    />
                </div>

                {/* Welcomeテキスト */}
                <h1 className="absolute bottom-48 mb-6 text-5xl font-moon text-black text-center welcome-text">
                    WELCOME TO
                </h1>

                {/* ロゴ画像 */}
                <div className="absolute bottom-20 cac-logoL">
                    <Image
                        src="/logo/newCAC.png"
                        alt="C.A.C. ロゴ"
                        width={460}
                        height={192}
                        priority
                        className="select-none"
                        style={{ objectFit: "contain", objectPosition: "center" }}
                    />
                </div>
            </div>
        </div>
    );
}






