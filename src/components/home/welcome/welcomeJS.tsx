import "./welcome.css";
import React, { useEffect, useState } from 'react';

// 型定義
type Props = {
    isDarkMode: boolean;
};

interface SpotlightPosition {
    x: number;
    y: number;
    r: number;
}

export default function WelcomeJS({ isDarkMode }: Props) {
    // ウィンドウサイズの状態管理
    const [windowSize, setWindowSize] = useState({
        width: 0,
        height: 0,
    });

    // 要素の位置を更新する関数
    const updatePosition = () => {
        const board = document.querySelector('.cac-board') as HTMLElement | null;
        const catMain = document.querySelector('.cac-cat-main') as HTMLElement | null;
        const catA = document.querySelector('.catA') as HTMLElement | null;
        const catB = document.querySelector('.catB') as HTMLElement | null;
        const spotlightL = document.querySelector('.spotlightL') as HTMLElement | null;
        const spotlightR = document.querySelector('.spotlightR') as HTMLElement | null;

        // スマホ表示かどうかを判定
        const isMobile = window.innerWidth <= 428;

        // キャラクターAとスポットライトRの位置調整
        if (catA && spotlightR) {
            const catARect = catA.getBoundingClientRect();
            if (isMobile) {
                // スマホ表示時の位置調整
                spotlightR.style.top = `${window.scrollY + catARect.bottom - catARect.height * 0.5}px`;
                spotlightR.style.right = `${window.scrollX}px`;
            } else {
                // PC表示時の位置調整
                spotlightR.style.top = `${window.scrollY + catARect.bottom - catARect.width * 1.3}px`;
                spotlightR.style.right = `${window.scrollX + catARect.right * 0.01}px`;
            }
        }

        // キャラクターBとスポットライトLの位置調整
        if (catB && spotlightL) {
            const catBRect = catB.getBoundingClientRect();
            if (isMobile) {
                // スマホ表示時の位置調整
                spotlightL.style.top = `${window.scrollY + catBRect.bottom - catBRect.height * 0.5}px`;
                spotlightL.style.left = `${window.scrollX}px`;
            } else {
                // PC表示時の位置調整
                spotlightL.style.top = `${window.scrollY + catBRect.bottom - catBRect.width * 1.5}px`;
                spotlightL.style.left = `${window.scrollX + catBRect.left * 0.6}px`;
            }
        }

        // メインキャラクターとボードの位置調整
        if (!catMain || !board) return;

        const rect = catMain.getBoundingClientRect();
        
        if (isMobile) {
            // スマホ表示時の位置調整
            // PC版と同様の相対位置になるように調整
            const handX = window.scrollX + rect.left - rect.width * 0.04;
            const handY = window.scrollY + rect.top + rect.height * 0.25;
            
            board.style.left = `${handX}px`;
            board.style.top = `${handY}px`;
            
            // transform-originをPC版と同じに設定
            board.style.transformOrigin = 'center bottom';
        } else {
            // PC表示時の位置調整
            const handX = window.scrollX + rect.left - rect.width * 0.04;
            const handY = window.scrollY + rect.top + rect.height * 0.25;
            
            board.style.left = `${handX}px`;
            board.style.top = `${handY}px`;
        }
    };

    // ボードのアニメーション
    const angle = 5;
    let angleValue = -angle - 35;
    let direction = 1;
    
    const animateBoard = (board: HTMLElement | null) => {
        if (!board) return;

        angleValue += direction * 0.01;
        if (angleValue > angle - 35 || angleValue < -angle - 35) {
            direction *= -1;
        }

        board.style.transform = `rotate(${angleValue}deg)`;
        requestAnimationFrame(() => animateBoard(board));
    };

    // キャラクターのアニメーション作成
    const createAnimation = (
        element: HTMLElement,
        finalPositionY: number,
        amplitude: number,
        frequency: number,
        gravity = 1.3,
        bounceFactor = 0.7
    ) => {
        // スマホ表示かどうかを判定
        const isMobile = window.innerWidth <= 428;
        
        // スマホ表示時はパラメータを調整
        const adjustedFinalPositionY = isMobile ? finalPositionY / 2 : finalPositionY;
        const adjustedAmplitude = isMobile ? amplitude / 1.5 : amplitude;
        
        // 初期位置をスマホ表示時は調整
        let positionY = isMobile ? -500 : -1150;
        let velocity = 0;
        let angle = -1;
        let isBouncing = true;
        let animationId: number | null = null;

        // アニメーションの開始
        const startAnimation = () => {
            velocity += gravity;
            positionY += velocity;

            if (positionY >= adjustedFinalPositionY) {
                positionY = adjustedFinalPositionY;
                velocity = -velocity * bounceFactor;

                if (Math.abs(velocity) < 1) {
                    isBouncing = false;
                }
            }

            angle += frequency;
            const swayOffset = Math.sin(angle) * adjustedAmplitude;

            element.style.transform = `translate(${swayOffset}px, ${positionY}px)`;
            updatePosition();
            animationId = requestAnimationFrame(startAnimation);
        };

        // クリックイベントハンドラ
        const onClick = (event: MouseEvent) => {
            const welcome = document.querySelector('.welcome');
            if (!(welcome && welcome.contains(event.target as Node))) {
                return;
            }

            if (animationId !== null) cancelAnimationFrame(animationId);

            velocity = 0;
            positionY = isMobile ? -500 : -1150; // スマホ表示時は初期位置を調整
            isBouncing = true;
            angle = 0;

            animationId = requestAnimationFrame(startAnimation);
        };

        // リサイズイベントハンドラ
        const handleResize = () => {
            const newIsMobile = window.innerWidth <= 428;
            // モバイル状態が変わった場合のみ再調整
            if (newIsMobile !== isMobile) {
                if (animationId !== null) cancelAnimationFrame(animationId);
                velocity = 0;
                positionY = newIsMobile ? -500 : -1150;
                isBouncing = true;
                angle = 0;
                animationId = requestAnimationFrame(startAnimation);
            }
        };

        window.addEventListener('click', onClick);
        window.addEventListener('resize', handleResize);
        animationId = requestAnimationFrame(startAnimation);

        return () => {
            window.removeEventListener('click', onClick);
            window.removeEventListener('resize', handleResize);
            if (animationId !== null) cancelAnimationFrame(animationId);
        };
    };

    // キャラクターとボードのアニメーション設定
    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
            // リサイズ時に位置を更新
            updatePosition();
        };
        
        const board = document.querySelector('.cac-board') as HTMLElement | null;
        const catMain = document.querySelector('.cac-cat-main') as HTMLElement | null;
        const cacLogo = document.querySelector('.cac-logoL') as HTMLElement | null;
        const catA = document.querySelector('.catA') as HTMLElement | null;
        const catB = document.querySelector('.catB') as HTMLElement | null;

        // スマホ表示かどうかを判定
        const isMobile = window.innerWidth <= 428;

        // キャラクターのアニメーション設定
        if (catA && catB) {
            catA.classList.remove('del');
            // スマホ表示時はパラメータを調整
            if (isMobile) {
                createAnimation(catA, 30, 5, 0.05);
            } else {
                createAnimation(catA, 50, 7, 0.05);
            }
            
            catB.classList.remove('del');
            // スマホ表示時はパラメータを調整
            if (isMobile) {
                createAnimation(catB, 30, 10, 0.01);
            } else {
                createAnimation(catB, 50, 20, 0.01);
            }
        }

        // ボードとメインキャラクターの表示とアニメーション
        if (board && catMain && cacLogo) {
            catMain.classList.remove('del');
            cacLogo.classList.remove('del');
            board.classList.remove('del');
            animateBoard(board);
        }
        
        handleResize();
        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleResize);
        window.addEventListener('load', updatePosition);

        // 初期表示時に位置を更新（少し遅延させて要素のレンダリングを待つ）
        setTimeout(updatePosition, 100);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('orientationchange', handleResize);
            window.removeEventListener('load', updatePosition);
        };
    }, []);

    // スポットライトエフェクト
    useEffect(() => {
        let spotlights: SpotlightPosition[] = [];
        let mouseSpot: SpotlightPosition = {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            r: 0
        };
        let animationFrameId: number | null = null;
        let initialized = false;
        const canvas = document.getElementById('spotlightCanvas') as HTMLCanvasElement | null;
        const ctx = canvas?.getContext('2d');

        // イベントリスナーの削除
        const removeListeners = () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', onResize);
        };

        // マウス移動時のハンドラ
        const onMouseMove = (e: MouseEvent) => {
            if (!isDarkMode) return;
            mouseSpot = { x: e.clientX, y: e.clientY, r: window.innerHeight / 2 };
            spotlights[0] = mouseSpot;

            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(() => drawSpotlights(spotlights));
        };

        // リサイズ時のハンドラ
        const onResize = () => {
            resizeCanvas();
            if (isDarkMode) drawSpotlights(spotlights);
        };

        // キャンバスのリサイズ
        const resizeCanvas = () => {
            if (!canvas) return;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        // スポットライトの描画
        const drawSpotlights = (spots: SpotlightPosition[]) => {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

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

        // スポットライトの初期化
        const initializeSpotlight = () => {
            if (!canvas || !ctx) return;

            const spotLightR = document.querySelector('.spotlightR') as HTMLElement | null;
            const spotLightL = document.querySelector('.spotlightL') as HTMLElement | null;

            if (!spotLightR || !spotLightL) return;

            const getSpotPosition = (element: HTMLElement): SpotlightPosition => {
                const rect = element.getBoundingClientRect();
                return {
                    x: rect.left + window.scrollX + rect.width / 2,
                    y: rect.top + window.scrollY + rect.height / 2,
                    r: rect.width / 2,
                };
            };

            const LRSpot = getSpotPosition(spotLightR);
            const LLSpot = getSpotPosition(spotLightL);

            spotlights = [mouseSpot, LLSpot, LRSpot];

            resizeCanvas();
            drawSpotlights(spotlights);
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('resize', onResize);

            initialized = true;
        };

        // ダークモードに応じてスポットライトを初期化または削除
        if (isDarkMode && !initialized) {
            initializeSpotlight();
        } else if (!isDarkMode) {
            removeListeners();
            if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
            initialized = false;
        }

        updatePosition();

        return () => {
            removeListeners();
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
        };
    }, [isDarkMode, windowSize]);

    // 空のフラグメントを返す（実際のレンダリングはwelcome.tsxで行われる）
    return <></>;
}