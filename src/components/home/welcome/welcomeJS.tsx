import "./welcome.css";
import React, { useEffect, useState, useRef, useCallback } from 'react';
import catPositionConfig from './catPositionConfig.json';

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

    // オーバーレイ表示状態（モバイル/タブレット用）
    const [overlayVisible, setOverlayVisible] = useState(true);

    // スポットライト配列の参照
    const spotlightsRef = useRef<SpotlightPosition[]>([]);
    const updateSpotlightCallbackRef = useRef<((spots: SpotlightPosition[]) => void) | null>(null);

    // デバイス判定の共通化関数（タッチデバイス検知）
    const getDeviceInfo = () => {
        // タッチデバイスかどうかを判定
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        // スマホサイズかどうか
        const isMobile = window.innerWidth <= 428;

        // タブレットサイズかどうか（タッチデバイスかつスマホより大きい）
        const isTablet = isTouchDevice && window.innerWidth > 428 && window.innerWidth <= 1280;

        // タッチデバイス全般（モバイル/タブレット）
        const isMobileOrTablet = isTouchDevice && window.innerWidth <= 1280;

        return { isTouchDevice, isMobile, isTablet, isMobileOrTablet };
    };

    // デバイスタイプとオリエンテーションを判定してJSON設定キーを取得
    const getDeviceConfigKey = () => {
        const isPortrait = window.innerHeight > window.innerWidth;
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const width = window.innerWidth;
        const height = window.innerHeight;

        // 短辺を基準にデバイス判定
        const shortSide = Math.min(width, height);
        const longSide = Math.max(width, height);

        if (shortSide <= 428) {
            // モバイル: 短辺が428px以下
            return isPortrait ? 'mobile-portrait' : 'mobile-landscape';
        } else if (isTouchDevice && longSide <= 1280) {
            // タブレット: タッチデバイスかつ長辺が1280px以下
            return isPortrait ? 'tablet-portrait' : 'tablet-landscape';
        } else {
            return 'desktop';
        }
    };

    // スポットライト位置を更新する関数
    const updateSpotlightPositions = useCallback(() => {
        const spotlightL = document.querySelector('.spotlightL') as HTMLElement | null;
        const spotlightR = document.querySelector('.spotlightR') as HTMLElement | null;

        if (!spotlightL || !spotlightR) return;

        const getSpotPosition = (element: HTMLElement): SpotlightPosition => {
            const rect = element.getBoundingClientRect();
            return {
                x: rect.left + window.scrollX + rect.width / 2,
                y: rect.top + window.scrollY + rect.height / 2,
                r: rect.width / 2,
            };
        };

        const LLSpot = getSpotPosition(spotlightL);
        const LRSpot = getSpotPosition(spotlightR);

        // スポットライト配列を更新（インデックス1と2）
        if (spotlightsRef.current.length >= 3) {
            spotlightsRef.current[1] = LLSpot;
            spotlightsRef.current[2] = LRSpot;

            // 描画コールバックが登録されていれば呼び出し
            if (updateSpotlightCallbackRef.current) {
                updateSpotlightCallbackRef.current(spotlightsRef.current);
            }
        }
    }, []);

    // 要素の位置を更新する関数
    const updatePosition = useCallback(() => {
        const board = document.querySelector('.cac-board') as HTMLElement | null;
        const catMain = document.querySelector('.cac-cat-main') as HTMLElement | null;
        const catA = document.querySelector('.catA') as HTMLElement | null;
        const catB = document.querySelector('.catB') as HTMLElement | null;
        const spotlightL = document.querySelector('.spotlightL') as HTMLElement | null;
        const spotlightR = document.querySelector('.spotlightR') as HTMLElement | null;

        const { isMobileOrTablet } = getDeviceInfo();

        // JSON設定からデバイス固有の設定を取得
        const deviceKey = getDeviceConfigKey();
        const config = (catPositionConfig as any)[deviceKey];

        // キャラクターAとスポットライトRの位置調整
        if (catA && spotlightR && config) {
            const catARect = catA.getBoundingClientRect();
            const spotlightRConfig = config.spotlightR;
            spotlightR.style.top = `${window.scrollY + catARect.bottom - catARect.height * 0.5 + spotlightRConfig.offsetTop}px`;
            spotlightR.style.right = `${window.scrollX + spotlightRConfig.offsetRight}px`;
        }

        // キャラクターBとスポットライトLの位置調整
        if (catB && spotlightL && config) {
            const catBRect = catB.getBoundingClientRect();
            const spotlightLConfig = config.spotlightL;
            spotlightL.style.top = `${window.scrollY + catBRect.bottom - catBRect.height * 0.5 + spotlightLConfig.offsetTop}px`;
            spotlightL.style.left = `${window.scrollX + spotlightLConfig.offsetLeft}px`;
        }

        // メインキャラクターとボードの位置調整
        if (!catMain || !board) return;

        const rect = catMain.getBoundingClientRect();
        
        if (isMobileOrTablet) {
            // スマホまたはタブレット縦向き表示時の位置調整
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

        // スポットライト位置も更新
        updateSpotlightPositions();
    }, [updateSpotlightPositions]);

    // ボードのアニメーション
    const animateBoard = useCallback((board: HTMLElement | null) => {
        if (!board) return;

        const angle = 5;
        let angleValue = -angle - 35;
        let direction = 1;

        const animate = () => {
            if (!board) return;

            angleValue += direction * 0.01;
            if (angleValue > angle - 35 || angleValue < -angle - 35) {
                direction *= -1;
            }

            board.style.transform = `rotate(${angleValue}deg)`;
            requestAnimationFrame(animate);
        };

        animate();
    }, []);

    // キャラクターのアニメーション作成
    const createAnimation = useCallback((
        element: HTMLElement,
        finalPositionY: number,
        amplitude: number,
        frequency: number,
        gravity = 1.3,
        bounceFactor = 0.7,
        baseOffsetX = 0,  // X方向のベースオフセット
        baseOffsetY = 0   // Y方向のベースオフセット
    ) => {
        const { isMobileOrTablet } = getDeviceInfo();
        const deviceKey = getDeviceConfigKey();
        const isPortrait = deviceKey.includes('portrait');

        // portraitモード時のみパラメータを調整
        const adjustedFinalPositionY = isPortrait ? finalPositionY / 2 : finalPositionY;
        const adjustedAmplitude = isPortrait ? amplitude / 1.5 : amplitude;

        // 初期位置をportraitモード時のみ調整
        let positionY = isPortrait ? -500 : -1150;
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

            element.style.transform = `translate(${swayOffset + baseOffsetX}px, ${positionY + baseOffsetY}px)`;

            // 毎フレームスポットライト位置を更新（高フレームレート）
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
            positionY = isPortrait ? -500 : -1150; // portraitモード時は初期位置を調整
            isBouncing = true;
            angle = 0;

            animationId = requestAnimationFrame(startAnimation);
        };

        // リサイズイベントハンドラ
        const handleResize = () => {
            const newDeviceKey = getDeviceConfigKey();
            const newIsPortrait = newDeviceKey.includes('portrait');

            // portrait状態が変わった場合のみ再調整
            if (newIsPortrait !== isPortrait) {
                if (animationId !== null) cancelAnimationFrame(animationId);
                velocity = 0;
                positionY = newIsPortrait ? -500 : -1150;
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
    }, [updatePosition]);

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

        const { isMobile, isTablet, isMobileOrTablet } = getDeviceInfo();

        // JSON設定からデバイス固有の設定を取得
        const deviceKey = getDeviceConfigKey();
        const config = (catPositionConfig as any)[deviceKey];
        const isPortrait = deviceKey.includes('portrait');

        // キャラクターのアニメーション設定
        if (catA && catB && config) {
            catA.classList.remove('del');
            if (isPortrait) {
                // portraitモード: モバイル/タブレット縦向き用パラメータ
                createAnimation(catA, 60, 5, 0.05, 1.3, 0.7, config.catA.offsetX, config.catA.offsetY);
            } else {
                // landscapeモードまたはPC: デスクトップ用パラメータ
                createAnimation(catA, 50, 7, 0.05, 1.3, 0.7, config.catA.offsetX, config.catA.offsetY);
            }

            catB.classList.remove('del');
            if (isPortrait) {
                // portraitモード: モバイル/タブレット縦向き用パラメータ
                createAnimation(catB, 0, 10, 0.01, 1.3, 0.7, config.catB.offsetX, config.catB.offsetY);
            } else {
                // landscapeモードまたはPC: デスクトップ用パラメータ
                createAnimation(catB, 50, 20, 0.01, 1.3, 0.7, config.catB.offsetX, config.catB.offsetY);
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
    }, [createAnimation, animateBoard, updatePosition]);

    // スポットライトエフェクト
    useEffect(() => {
        let mouseSpot: SpotlightPosition = {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            r: 0
        };
        let lastMousePosition = { x: 0, y: 0 };
        let isAnimating = false;
        let touchStartPos = { x: 0, y: 0 };
        let animationFrameId: number | null = null;
        let initialized = false;
        const canvas = document.getElementById('spotlightCanvas') as HTMLCanvasElement | null;
        const ctx = canvas?.getContext('2d');

        const { isMobileOrTablet } = getDeviceInfo();

        // マウス移動時のハンドラ（PC用 - 高フレームレート）
        const onMouseMove = (e: MouseEvent) => {
            if (!isDarkMode) return;

            // 移動距離が閾値（2px）以上の場合のみ更新
            const dx = e.clientX - lastMousePosition.x;
            const dy = e.clientY - lastMousePosition.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 2) return;

            lastMousePosition = { x: e.clientX, y: e.clientY };
            mouseSpot = { x: e.clientX, y: e.clientY, r: window.innerHeight / 2 };
            spotlightsRef.current[0] = mouseSpot;

            if (isAnimating) return;
            isAnimating = true;

            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(() => {
                drawSpotlights(spotlightsRef.current);
                isAnimating = false;
            });
        };

        // タッチ開始時のハンドラ（モバイル/タブレット用）
        const onTouchStart = (e: TouchEvent) => {
            if (!isDarkMode) return;
            touchStartPos = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            };
        };

        // タッチ終了時のハンドラ（モバイル/タブレット用 - オーバーレイトグル）
        const onTouchEnd = (e: TouchEvent) => {
            if (!isDarkMode) return;

            const touchEndPos = {
                x: e.changedTouches[0].clientX,
                y: e.changedTouches[0].clientY
            };

            // 移動距離が10px以内ならタップとみなす
            const dx = touchEndPos.x - touchStartPos.x;
            const dy = touchEndPos.y - touchStartPos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= 10) {
                // welcomeエリア内のタップの場合、オーバーレイ表示をトグル
                const welcome = document.querySelector('.welcome');
                if (welcome && welcome.contains(e.target as Node)) {
                    e.preventDefault(); // クリックイベントの発火を防止
                    setOverlayVisible(prev => !prev);
                }
            }
        };

        // タッチ移動時のハンドラ（PC用タッチデバイス対応 - 高フレームレート）
        const onTouchMove = (e: TouchEvent) => {
            if (!isDarkMode || isMobileOrTablet) return;

            const touch = e.touches[0];
            const dx = touch.clientX - lastMousePosition.x;
            const dy = touch.clientY - lastMousePosition.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 2) return;

            lastMousePosition = { x: touch.clientX, y: touch.clientY };
            mouseSpot = { x: touch.clientX, y: touch.clientY, r: window.innerHeight / 2 };
            spotlightsRef.current[0] = mouseSpot;

            if (isAnimating) return;
            isAnimating = true;

            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(() => {
                drawSpotlights(spotlightsRef.current);
                isAnimating = false;
            });
        };

        // リサイズ時のハンドラ
        const onResize = () => {
            resizeCanvas();
            if (isDarkMode) drawSpotlights(spotlightsRef.current);
        };

        // イベントリスナーの削除
        const removeListeners = () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('touchstart', onTouchStart);
            window.removeEventListener('touchend', onTouchEnd);
            window.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('resize', onResize);
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

            // ライトモードではオーバーレイを描画しない
            if (!isDarkMode) return;

            // overlayVisibleがfalse（モバイル/タブレットでオフ）の場合はオーバーレイを描画しない
            if (!overlayVisible) {
                return;
            }

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

            spotlightsRef.current = [mouseSpot, LLSpot, LRSpot];

            // 描画コールバックを登録
            updateSpotlightCallbackRef.current = drawSpotlights;

            resizeCanvas();
            drawSpotlights(spotlightsRef.current);

            // モバイル/タブレットの場合はタッチ操作、PCの場合はマウス操作を有効化
            if (isMobileOrTablet) {
                window.addEventListener('touchstart', onTouchStart);
                window.addEventListener('touchend', onTouchEnd);
            } else {
                window.addEventListener('mousemove', onMouseMove);
                window.addEventListener('touchmove', onTouchMove);
            }

            window.addEventListener('resize', onResize);

            initialized = true;
        };

        // ダークモードに応じてスポットライトを初期化または削除
        if (isDarkMode && !initialized) {
            initializeSpotlight();
        } else if (!isDarkMode) {
            // ライトモード時はリソースをクリア
            if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
            spotlightsRef.current = [];
            updateSpotlightCallbackRef.current = null;
            initialized = false;
        }

        updatePosition();

        return () => {
            removeListeners();
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
        };
    }, [isDarkMode, windowSize, overlayVisible, updatePosition]);

    // 空のフラグメントを返す（実際のレンダリングはwelcome.tsxで行われる）
    return <></>;
}