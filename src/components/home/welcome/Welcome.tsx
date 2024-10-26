"use client";
import Image from "next/image";
import "./welcome.css";
import {useEffect,useRef} from "react";

type Props = {
    isDarkMode: boolean;
};
export default function Welcome({ isDarkMode }: Props) {
    useEffect(() => {
        let spotlights: { x: number; y: number; r: number }[] = [];
        let mouseSpot = { x: window.innerWidth / 2, y: window.innerHeight / 2, r: 150 };
        let animationFrameId: number | null = null; // アニメーションIDを管理
        let initialized = false; // スポットライト初期化フラグ

        const canvas = document.getElementById('spotlightCanvas') as HTMLCanvasElement | null;
        const ctx = canvas?.getContext('2d');

        const removeListeners = () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', onResize);
        };

        const onMouseMove = (e: MouseEvent) => {
            if (!isDarkMode) return; // ダークモードでのみ実行
            mouseSpot = { x: e.clientX, y: e.clientY, r: 150 };
            spotlights[0] = mouseSpot;

            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(() => drawSpotlights(spotlights));
        };

        const onResize = () => {
            resizeCanvas();
            if (isDarkMode) drawSpotlights(spotlights);
        };

        const resizeCanvas = () => {
            if (!canvas) return;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const drawSpotlights = (spots: { x: number; y: number; r: number }[]) => {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas!.width, canvas!.height);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            ctx.fillRect(0, 0, canvas!.width, canvas!.height);

            ctx.globalCompositeOperation = 'destination-out';
            spots.forEach((spot) => {
                const gradient = ctx.createRadialGradient(spot.x, spot.y, 0, spot.x, spot.y, spot.r);
                gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
                gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(spot.x, spot.y, spot.r, 0, Math.PI * 2);
                ctx.fill();
            });

            ctx.globalCompositeOperation = 'source-over';
        };

        const initializeSpotlight = () => {
            if (!canvas || !ctx) return;

            const spotLightR = document.querySelector('.spotlightR') as HTMLElement | null;
            const spotLightL = document.querySelector('.spotlightL') as HTMLElement | null;
            const spotLightMain = document.querySelector('.spotlightMain') as HTMLElement | null;

            if (!spotLightR || !spotLightL || !spotLightMain) return;

            const getSpotPosition = (element: HTMLElement) => {
                const rect = element.getBoundingClientRect();
                return {
                    x: rect.left + window.scrollX + rect.width / 2,
                    y: rect.top + window.scrollY + rect.height / 2,
                    r: rect.width / 2,
                };
            };

            const LRSpot = getSpotPosition(spotLightR);
            const LLSpot = getSpotPosition(spotLightL);
            const MainSpot = getSpotPosition(spotLightMain);

            spotlights = [mouseSpot, LLSpot, LRSpot, MainSpot];

            resizeCanvas();
            drawSpotlights(spotlights); // 初回描画

            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('resize', onResize);

            initialized = true;
        };

        // モード切り替えに応じたスポットライトの管理
        if (isDarkMode && !initialized) {
            initializeSpotlight();
        } else if (!isDarkMode) {
            removeListeners(); // ライトモードでリスナーを削除
            if (ctx) ctx.clearRect(0, 0, canvas!.width, canvas!.height); // Canvasをクリア
            initialized = false;
        }

        // クリーンアップ
        return () => {
            removeListeners();
            if (animationFrameId) cancelAnimationFrame(animationFrameId); // アニメーションのキャンセル
            if (ctx) ctx.clearRect(0, 0, canvas!.width, canvas!.height); // Canvasのクリア
        };
    }, [isDarkMode]);




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

        const onClick = (event: MouseEvent) => {
            const header = document.querySelector('.header'); // .headerの参照
            const welcome = document.querySelector('.welcome'); // .headerの参照
            if (!(welcome && welcome.contains(event.target as Node))) {
                return; // ヘッダー内のクリックを無視
            }

            if (animationId !== null) cancelAnimationFrame(animationId);

            velocity = 0;
            positionY = -750; // 初期位置に戻す
            isBouncing = true; // バウンド再開
            angle = 0;

            animationId = requestAnimationFrame(startAnimation); // アニメーション再開
        };

        window.addEventListener('click', onClick); // クリックイベント登録

        animationId = requestAnimationFrame(startAnimation); // アニメーション開始

        return () => {
            window.removeEventListener('click', onClick); // クリーンアップ
        };
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
            createAnimation(catB, 20); // 最終位置まで落下アニメーション
        }

        if (imageRef.current) {
            imageRef.current.classList.remove('del');
        }

        animateBoard();

        return () => {
            if (catA || catB) window.removeEventListener('click', () => {}); // クリーンアップ
        };
    }, []);
    return (
        <div className="relative w-full overflow-hidden welcome --vh-custom">
            <div className="white-layer"></div>
            <div className="absolute welcome-background"></div>
            <canvas id="spotlightCanvas"></canvas>
            <div className="spotlightL"></div>
            <div className="spotlightR"></div>
            <div className="spotlightMain"></div>

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






