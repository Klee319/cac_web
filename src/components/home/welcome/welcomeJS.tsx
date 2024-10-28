import "./welcome.css";
import React, {useEffect, useState} from 'react';

type Props = {
    isDarkMode: boolean;
};

export default function WelcomeJS({isDarkMode}: Props) {
    const updatePosition = () => {
        const board = document.querySelector('.cac-board') as HTMLElement | null;
        const catMain = document.querySelector('.cac-cat-main') as HTMLElement | null;
        const catA = document.querySelector('.catA') as HTMLElement | null;
        const catB = document.querySelector('.catB') as HTMLElement | null;
        const spotLightR = document.querySelector('.spotlightR') as HTMLElement | null;
        const spotLightL = document.querySelector('.spotlightL') as HTMLElement | null;

        //猫とスポットライトの位置を更新
        if (spotLightR && spotLightL && catA && catB) {
            const rectR = catA.getBoundingClientRect();
            const rectL = catB.getBoundingClientRect();
            spotLightR.style.top = `${-250+window.innerHeight*0.5}px`;
            spotLightL.style.top = `${550}px`;
        }

        if (!catMain || !board) return;

        // 人の画像内の「手の位置」を計算 (たとえば、横50%、縦70%の位置)
        const rect = catMain.getBoundingClientRect();
        const handX = rect.left-rect.width*0.04;
        const handY = rect.top+rect.height*0.25;

        // 花の画像を「手の位置」に配置
        board.style.left = `${handX}px`;
        board.style.top = `${handY}px`;
    }

    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    // ウィンドウサイズと向き変更の監視
    const handleResize = () => {
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
        });
    };


    const angle = 5;
    let angleValue = -angle - 35; // 現在の角度を管理する変数
    let direction = 1; // 回転の方向
    const animateBoard = (board: HTMLElement | null) => {
        if (!board) return; // 要素が取得できなければ処理を終了

        // 回転角度の更新
        angleValue += direction * 0.01;
        if (angleValue > angle - 35 || angleValue < -angle - 35) {
            direction *= -1; // 回転方向を反転
        }

        // 画像に回転を適用
        board.style.transform = `rotate(${angleValue}deg)`;

        // 次のフレームで再描画
        requestAnimationFrame(() => animateBoard(board));
    };

    const createAnimation = (
        element: HTMLElement,
        finalPositionY: number,
        amplitude : number,
        frequency : number,
        gravity = 1.3,
        bounceFactor = 0.7
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
        window.addEventListener('load', updatePosition);
        window.addEventListener('click', onClick); // クリックイベント登録

        animationId = requestAnimationFrame(startAnimation); // アニメーション開始

        return () => {
            window.removeEventListener('load', updatePosition);
            window.removeEventListener('click', onClick); // クリーンアップ
        };
    };


    //初回のみ実行
    useEffect(() => {
        const board = document.querySelector('.cac-board') as HTMLElement | null;
        const catMain = document.querySelector('.cac-cat-main') as HTMLElement | null;
        const cacLogo = document.querySelector('.cac-logoL') as HTMLElement | null;
        const catA = document.querySelector('.catA') as HTMLElement | null;
        const catB = document.querySelector('.catB') as HTMLElement | null;
        const container = document.querySelector('.animation-container') as HTMLElement | null;

        //常時動作のアニメーション開始
        if (catA && catB && catMain) {
            //準備ができたら非表示解除
            catA.classList.remove('del');
            createAnimation(catA, -300, 7,0.05); // 最終位置まで落下アニメーション
            catB.classList.remove('del');
            createAnimation(catB, 50,20,0.01);
        }

        if (board && catMain && cacLogo) {
            catMain.classList.remove('del');
            cacLogo.classList.remove('del');
            board.classList.remove('del');
            animateBoard(board);


        }



        // リスナーの登録
        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleResize);

        // クリーンアップ
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('orientationchange', handleResize);
            if (catA || catB) window.removeEventListener('click', () => {
            }); // クリーンアップ
        };
    }, []);


    //ダークモードの変更時とリサイズ時に実行
    useEffect(() => {
        let spotlights: { x: number; y: number; r: number }[] = [];
        let mouseSpot = {x: window.innerWidth / 2, y: window.innerHeight / 2, r: 150};
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
            mouseSpot = {x: e.clientX, y: e.clientY, r: 150};
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

        updatePosition();

        // クリーンアップ
        return () => {
            removeListeners();
            if (animationFrameId) cancelAnimationFrame(animationFrameId); // アニメーションのキャンセル
            if (ctx) ctx.clearRect(0, 0, canvas!.width, canvas!.height); // Canvasのクリア
        };
    }, [isDarkMode, windowSize,]);

    return (
        <>
        </>
    );
}