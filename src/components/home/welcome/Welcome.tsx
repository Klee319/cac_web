"use client";
import Image from "next/image";
import "./welcome.css";
import {useEffect,useRef} from "react";
export default function Welcome() {
    window.addEventListener('load', () => {

        const canvas = document.getElementById('spotlightCanvas') as HTMLCanvasElement | null;
        const ctx = canvas?.getContext('2d');
        const spotLightR = document.querySelector('.spotlightL') as HTMLElement | null;
        const spotLightL = document.querySelector('.spotlightR') as HTMLElement | null;
        const spotLightMain = document.querySelector('.spotlightMain') as HTMLElement | null;

        setTimeout(() => {
            if(!spotLightR || !spotLightL || !spotLightMain) return;
            // 各要素の位置を取得してデバッグ出力
            console.log('SpotlightL:', spotLightL.getBoundingClientRect());
            console.log('SpotlightR:', spotLightR.getBoundingClientRect());
            console.log('SpotlightMain:', spotLightMain.getBoundingClientRect());
        }, 10000); // 100msの遅延
        // 要素の位置を取得し、スクロール位置を考慮する関数
        function getSpotPosition(element: HTMLElement) {
            const rect = element.getBoundingClientRect();
            console.log(rect);
            return {
                x: rect.left + window.scrollX + rect.width / 2, // 中心のx座標
                y: rect.top + window.scrollY + rect.height / 2, // 中心のy座標
                r: rect.width / 2, // 半径
            };

        }
        if(!spotLightR || !spotLightL || !spotLightMain) return;

        // スポットライトの位置を取得
        const LRSpot = getSpotPosition(spotLightR);
        const LLSpot = getSpotPosition(spotLightL);
        const MainSpot = getSpotPosition(spotLightMain);

        // マウスの位置に応じたスポットライトの更新
        let mouseSpot = { x: window.innerWidth / 2, y: window.innerHeight / 2,r:150 };
        // スポットライトの配列
        let spotlights = [mouseSpot, LLSpot, LRSpot, MainSpot];


        if (!canvas || !ctx) {
            console.error('Canvas or 2D context not available!');
            return;
        }

        // Canvasのサイズをウィンドウに合わせる
        function resizeCanvas() {
            if (!canvas || !ctx) return;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        // 複数のスポットライトを描画する関数
        function drawSpotlights(spots: { x: number; y: number ;r:number}[]) {
            if (!canvas || !ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // 暗いフィルターを描画
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // スポットライトごとに描画
            ctx.globalCompositeOperation = 'destination-out';
            spots.forEach((spot) => {
                const gradient = ctx.createRadialGradient(spot.x, spot.y, 0, spot.x, spot.y, spot.r);
                gradient.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
                gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(spot.x, spot.y, spot.r, 0, Math.PI * 2);
                ctx.fill();
            });

            ctx.globalCompositeOperation = 'source-over';
        }



        window.addEventListener('mousemove', (e: MouseEvent) => {
            spotlights[0] = { x: e.clientX, y: e.clientY ,r:150};
            drawSpotlights(spotlights); // マウスのスポットライトと固定スポットライトを描画
        });



        // ウィンドウサイズ変更時にCanvasをリサイズ
        window.addEventListener('resize', () => {
            resizeCanvas();
            drawSpotlights(spotlights); // サイズ変更時も再描画
        });

        // 初期化
        resizeCanvas();
        drawSpotlights(spotlights);
    });


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
            createAnimation(catB, 20); // 最終位置まで落下アニメーション
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






