"use client";
import Image from "next/image";

export default function Welcome() {
    return (
        <div className="relative w-full h-screen overflow-hidden bg-beige" >
            {/* 背景画像 */}
            <div className="absolute inset-0 w-full h-full">
                <Image
                    src="/main/welcomeCAC.png" // 画像のパス
                    alt="背景"
                    fill // fillを使って親要素にフィット
                    style={{ objectFit: "cover", objectPosition: "center" }} // 以前のobjectFit, objectPositionの代替
                    priority
                    className="select-none"
                />
            </div>

            {/* 中央のコンテンツ */}
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-12">
                {/* イメージキャラクター画像 */}
                <div className="w-75 h-75 translate-x-10 translate-y-10" >
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
                <h1 className="text-5xl sm:text-6xl font-moon text-black text-center pt-5">
                    WELCOME TO
                </h1>

                {/* ロゴ画像 */}
                <div className="w-100 h-32 ">
                    <Image
                        src="/logo/newCAC.png"
                        alt="C.A.C. ロゴ"
                        width={460}
                        height={192}
                        priority
                        className="select-none"
                        style={{ objectFit: "cover", objectPosition: "center" }}
                    />
                </div>
            </div>
        </div>
    );
}





