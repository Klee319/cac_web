"use client";
import Image from "next/image";

export default function Welcome() {
    return (

        <div className="relative w-full h-[730px] md:h-screen overflow-hidden tablet-portrait:h-[800px]" >
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
            <div className="flex flex-col items-center justify-center">

                {/* イメージキャラクター画像 */}
                <div className="w-[300px] h-[300px] pt-24 md:w-[350px] md:h-[350px]  translate-y-5 translate-x-5 md:translate-x-[50px]
                mobile-landscape:w-[200px] mobile-landscape:h-[200px] mobile-landscape:-translate-y-[80px] mobile-landscape:translate-x-[20px]">
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
                <h1 className="absolute bottom-48 mb-6 md:mb-0 md:bottom-44 text-5xl font-moon text-black text-center mobile-landscape:hidden">
                    WELCOME TO
                </h1>

                {/* ロゴ画像 */}
                <div className="absolute bottom-20 md:bottom-0 md:w-[300px] md:h-[140px] xl:w-[380px] xl:h-[158px]　h-md:w-[200px] h-md:h-[93px]">
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






