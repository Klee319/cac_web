import Image from "next/image";
import "./welcome.css";
import React from 'react';
import WelcomeJS from "@/components/home/welcome/welcomeJS";

type Props = {
    isDarkMode: boolean;
};

export default function Welcome({ isDarkMode }: Props) {
    return (
        <>
            <WelcomeJS isDarkMode={isDarkMode} />
            <div className="relative w-full overflow-hidden welcome">
                <div className="white-layer"></div>
                <div className="absolute welcome-background"></div>
                <canvas id="spotlightCanvas"></canvas>

                <div className="animation-container">
                    <div className="spotlightL"></div>
                    <div className="spotlightR"></div>
                    <Image
                        src="/home/welcome/cacCat1.png"
                        width={100}
                        height={100}
                        alt="Character"
                        className="catA del"
                    />
                    <Image
                        src="/home/welcome/cacCat5.png"
                        width={100}
                        height={100}
                        alt="Character"
                        className="catB del"
                    />
                </div>

                <div className="relative flex flex-col items-center justify-center content">
                    <Image
                        src="/home/welcome/backgroundBoard.png"
                        alt="イメージキャラクター"
                        width={100}
                        height={100}
                        priority
                        className="cac-board del"
                    />
                    <Image
                        src="/home/welcome/imageCAT.png"
                        alt="イメージキャラクター"
                        width={100}
                        height={100}
                        priority
                        className="cac-cat-main del"
                    />
                    <Image
                        src="/home/welcome/CACmainLogo.png"
                        alt="C.A.C. ロゴ"
                        width={460}
                        height={192}
                        priority
                        className="cac-logoL del"
                    />
                </div>
            </div>
        </>
    );
}

