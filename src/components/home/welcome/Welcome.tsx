"use client";
import Image from "next/image";
import "./welcome.css";
import {useEffect,useRef} from "react";
export default function Welcome() {
    const imageRef = useRef<HTMLImageElement | null>(null);
    const angle = 5;
    const angleRef = useRef(-angle - 35);
    const directionRef = useRef(1);

    const animateBoard = () => {
        const image = imageRef.current;
        angleRef.current += directionRef.current * 0.05;
        if (angleRef.current > angle - 35 || angleRef.current < -angle - 35) {
            directionRef.current *= -1;
        }
        if (!image) return;
        image.style.transform = `rotate(${angleRef.current}deg)`;
        requestAnimationFrame(animateBoard);
    };

    const createAnimation = (
        element: HTMLElement,
        finalPositionY: number,
        amplitude = 20,
        frequency = 0.02,
        gravity = 1.5,
        bounceFactor = 0.6
    ) => {
        let positionY = -750; // 初期位置から開始
        let velocity = 0;
        let angle = -1;
        let isBouncing = true;
        let animationId: number | null = null;

        const startAnimation = () => {
            velocity += gravity;
            positionY += velocity;

            if (positionY >= finalPositionY) {
                positionY = finalPositionY;
                velocity = -velocity * bounceFactor;

                if (Math.abs(velocity) < 1) {
                    isBouncing = false; // バウンド終了
                }
            }

            angle += frequency;
            const swayOffset = Math.sin(angle) * amplitude;

            element.style.transform = `translate(${swayOffset}px, ${positionY}px)`;

            animationId = requestAnimationFrame(startAnimation);
        };

        window.addEventListener('click', () => {
            if (animationId !== null) cancelAnimationFrame(animationId);

            velocity = 0;
            positionY = -750; // 初期位置に戻す
            isBouncing = true; // バウンド再開
            angle = 0;

            animationId = requestAnimationFrame(startAnimation); // アニメーション再開
        });

        animationId = requestAnimationFrame(startAnimation); // アニメーション開始
    };

    useEffect(() => {
        const catA = document.querySelector('.catA') as HTMLElement | null;
        const catB = document.querySelector('.catB') as HTMLElement | null;

        if (catA) {
            catA.classList.remove('del');
            createAnimation(catA, -380); // 最終位置まで落下アニメーション
        }

        if (catB) {
            catB.classList.remove('del');
            createAnimation(catB, -80); // 最終位置まで落下アニメーション
        }

        if (imageRef.current) {
            imageRef.current.classList.remove('del');
        }

        animateBoard();

        return () => {
            if (catA || catB) window.removeEventListener('click', () => {});
        };
    }, []);
    return (
        <div className="relative w-full overflow-hidden welcome --vh-custom">
            <div className="absolute welcome-background"></div>
            <div className="spotlight"></div>
            <div className="animation-container">
                    <Image src="/home/welcome/cacCat1.png" width={100} height={100} alt="Character" className="catA del" />
                <Image src="/home/welcome/cacCat5.png" width={100} height={100} alt="Character" className="catB del" />
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center content">

                <Image
                    ref={imageRef}
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
                    className="cac-cat-main"
                />
                <Image
                    src="/home/welcome/CACmainLogo.png"
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






