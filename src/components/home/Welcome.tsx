"use client";
import Image from "next/image";
import "./welcome.css";

export default function Welcome() {
    return (
        <div className="relative w-full overflow-hidden welcome --vh-custom">
            <Image src="/main/welcomeCAC.png" alt="背景" fill style={{objectFit: "cover", objectPosition: "center"}}
                   priority className="select-none"/>
            <div className="absolute inset-0 flex flex-col items-center justify-center content">

                <Image
                    src="/main/imageCAT.png"
                    alt="イメージキャラクター"
                    width={100}
                    height={100}
                    priority
                    className="cac-cat"
                />

                <Image
                    src="/logo/newCAC.png"
                    alt="C.A.C. ロゴ"
                    width={460}
                    height={192}
                    priority
                    className="cac-logoL"
                />

            </div>

        </div>
    );
}






