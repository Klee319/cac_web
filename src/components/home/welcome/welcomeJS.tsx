import "./welcome.css";
import React, { useEffect, useState, useRef, useCallback } from 'react';

// 型定義
type Props = {
    isDarkMode: boolean;
};

interface SpotlightPosition {
    x: number;
    y: number;
    r: number;
}

// DOM要素の参照型定義
interface CachedElements {
    board: HTMLElement | null;
    catMain: HTMLElement | null;
    catA: HTMLElement | null;
    catB: HTMLElement | null;
    spotlightL: HTMLElement | null;
    spotlightR: HTMLElement | null;
    cacLogo: HTMLElement | null;
}

// デバイス情報のキャッシュ
let cachedDeviceInfo: {
    isMobile: boolean;
    isTabletPortrait: boolean;
    isIPadProPortrait: boolean;
    isMobileOrTabletPortrait: boolean;
    isTouchDevice: boolean;
    timestamp: number;
} | null = null;

// デバイス情報を取得（キャッシュ化）
const getDeviceInfo = () => {
    const now = Date.now();
    // 100ms以内はキャッシュを使用
    if (cachedDeviceInfo && (now - cachedDeviceInfo.timestamp) < 100) {
        return cachedDeviceInfo;
    }

    const isMobile = window.innerWidth <= 428;
    const isTabletPortrait = window.innerWidth > 428 && window.innerWidth <= 1280 &&
                            window.innerHeight >= 768 && window.innerWidth / window.innerHeight < 0.8;
    const isIPadProPortrait = window.innerWidth >= 1024 && window.innerWidth <= 1280 &&
                             window.innerHeight >= 1180 && window.innerWidth / window.innerHeight < 0.8;
    const isMobileOrTabletPortrait = isMobile || isTabletPortrait || isIPadProPortrait;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    cachedDeviceInfo = {
        isMobile,
        isTabletPortrait,
        isIPadProPortrait,
        isMobileOrTabletPortrait,
        isTouchDevice,
        timestamp: now
    };

    return cachedDeviceInfo;
};

// アニメーションマネージャークラス
class AnimationManager {
    private callbacks: Map<string, () => void> = new Map();
    private frameId: number | null = null;
    private lastFrameTime: number = 0;
    private targetFPS: number = 60;

    constructor() {
        // モバイルデバイスでは30FPSに制限
        const deviceInfo = getDeviceInfo();
        this.targetFPS = deviceInfo.isMobileOrTabletPortrait ? 30 : 60;
    }

    register(id: string, callback: () => void) {
        this.callbacks.set(id, callback);
        if (!this.frameId) {
            this.start();
        }
    }

    unregister(id: string) {
        this.callbacks.delete(id);
        if (this.callbacks.size === 0) {
            this.stop();
        }
    }

    private start() {
        const frameInterval = 1000 / this.targetFPS;

        const animate = (currentTime: number) => {
            if (currentTime - this.lastFrameTime >= frameInterval) {
                this.callbacks.forEach(callback => callback());
                this.lastFrameTime = currentTime;
            }
            this.frameId = requestAnimationFrame(animate);
        };

        this.frameId = requestAnimationFrame(animate);
    }

    private stop() {
        if (this.frameId) {
            cancelAnimationFrame(this.frameId);
            this.frameId = null;
        }
    }

    clear() {
        this.callbacks.clear();
        this.stop();
    }
}

// タッチイベントリスナーのオプション定数
const TOUCH_EVENT_OPTIONS = { passive: false };
const TOUCH_EVENT_OPTIONS_PASSIVE = { passive: true };

// アニメーション定数
const ROTATION_ANGLE_RANGE = 5;
const ROTATION_INITIAL_OFFSET = -35;
const ROTATION_SPEED = 0.01;

export default function WelcomeJS({ isDarkMode }: Props) {
    // ウィンドウサイズの状態管理
    const [windowSize, setWindowSize] = useState({
        width: 0,
        height: 0,
    });

    // 位置更新のためのラフ実行防止（useRefで管理）
    const updatePositionFrameIdRef = useRef<number | null>(null);

    // スロットリング用のタイムスタンプ
    const lastUpdateTimeRef = useRef<number>(0);
    const UPDATE_THROTTLE = 100; // 100ms間隔でスロットリング

    // AnimationManagerのインスタンス（コンポーネント毎）
    const animationManagerRef = useRef<AnimationManager | null>(null);

    // DOM要素のキャッシュ
    const elementsRef = useRef<CachedElements>({
        board: null,
        catMain: null,
        catA: null,
        catB: null,
        spotlightL: null,
        spotlightR: null,
        cacLogo: null,
    });

    // アニメーション完了状態の管理
    const animationCompleteRef = useRef<{
        catA: boolean;
        catB: boolean;
    }>({
        catA: false,
        catB: false,
    });

    // スポットライト更新コールバック
    const updateSpotlightsCallbackRef = useRef<(() => void) | null>(null);

    // AnimationManagerの初期化
    useEffect(() => {
        animationManagerRef.current = new AnimationManager();
        return () => {
            if (animationManagerRef.current) {
                animationManagerRef.current.clear();
            }
        };
    }, []);

    // DOM要素をキャッシュする関数
    const cacheElements = useCallback(() => {
        elementsRef.current = {
            board: document.querySelector('.cac-board') as HTMLElement | null,
            catMain: document.querySelector('.cac-cat-main') as HTMLElement | null,
            catA: document.querySelector('.catA') as HTMLElement | null,
            catB: document.querySelector('.catB') as HTMLElement | null,
            spotlightL: document.querySelector('.spotlightL') as HTMLElement | null,
            spotlightR: document.querySelector('.spotlightR') as HTMLElement | null,
            cacLogo: document.querySelector('.cac-logoL') as HTMLElement | null,
        };
    }, []);

    // 要素の位置を更新する関数（最適化版）
    const updatePosition = useCallback(() => {
        // スロットリング実装
        const now = Date.now();
        if (now - lastUpdateTimeRef.current < UPDATE_THROTTLE) {
            return;
        }
        lastUpdateTimeRef.current = now;

        // 連続実行を防止
        if (updatePositionFrameIdRef.current !== null) {
            cancelAnimationFrame(updatePositionFrameIdRef.current);
        }

        updatePositionFrameIdRef.current = requestAnimationFrame(() => {
            const { board, catMain, catA, catB, spotlightL, spotlightR } = elementsRef.current;

            // デバイス情報を取得（キャッシュ使用）
            const deviceInfo = getDeviceInfo();
            const { isMobileOrTabletPortrait } = deviceInfo;

            // キャラクターAとスポットライトRの位置調整
            if (catA && spotlightR) {
                const catARect = catA.getBoundingClientRect();
                if (isMobileOrTabletPortrait) {
                    // スマホまたはタブレット縦向き表示時の位置調整
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
                if (isMobileOrTabletPortrait) {
                    // スマホまたはタブレット縦向き表示時の位置調整
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

            if (isMobileOrTabletPortrait) {
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

            // スポットライト位置更新のコールバックを呼び出し
            if (updateSpotlightsCallbackRef.current && isDarkMode) {
                updateSpotlightsCallbackRef.current();
            }

            updatePositionFrameIdRef.current = null;
        });
    }, [isDarkMode]);

    // ボードのアニメーション
    const boardRotationAngle = ROTATION_ANGLE_RANGE;
    let currentRotation = -boardRotationAngle + ROTATION_INITIAL_OFFSET;
    let rotationDirection = 1;

    const animateBoard = (board: HTMLElement | null) => {
        if (!board || !animationManagerRef.current) return;

        const boardAnimation = () => {
            currentRotation += rotationDirection * ROTATION_SPEED;
            if (currentRotation > boardRotationAngle + ROTATION_INITIAL_OFFSET ||
                currentRotation < -boardRotationAngle + ROTATION_INITIAL_OFFSET) {
                rotationDirection *= -1;
            }

            board.style.transform = `rotate(${currentRotation}deg)`;
        };

        // AnimationManagerに登録
        animationManagerRef.current.register('board', boardAnimation);
    };

    // キャラクターのアニメーション作成
    const createAnimation = (
        element: HTMLElement,
        finalPositionY: number,
        amplitude: number,
        frequency: number,
        animationId: string,
        gravity = 1.3,
        bounceFactor = 0.7
    ) => {
        // デバイス情報を取得（キャッシュ使用）
        let deviceInfo = getDeviceInfo();
        let { isMobileOrTabletPortrait } = deviceInfo;

        // スマホまたはタブレット縦向き表示時はパラメータを調整
        const adjustedFinalPositionY = isMobileOrTabletPortrait ? finalPositionY / 2 : finalPositionY;
        const adjustedAmplitude = isMobileOrTabletPortrait ? amplitude / 1.5 : amplitude;

        // 初期位置をスマホまたはタブレット縦向き表示時は調整
        let positionY = isMobileOrTabletPortrait ? -500 : -1150;
        let velocity = 0;
        let angle = -1;
        let isBouncing = true;
        let hasCompleted = false;

        // アニメーションの実行関数
        const runAnimation = () => {
            // アニメーション完了後は早期リターン
            if (hasCompleted && !isBouncing) {
                return;
            }

            velocity += gravity;
            positionY += velocity;

            if (positionY >= adjustedFinalPositionY) {
                positionY = adjustedFinalPositionY;
                velocity = -velocity * bounceFactor;

                if (Math.abs(velocity) < 1) {
                    isBouncing = false;
                    if (!hasCompleted) {
                        hasCompleted = true;
                        // アニメーション完了をマーク
                        if (animationId === 'catA') {
                            animationCompleteRef.current.catA = true;
                        } else if (animationId === 'catB') {
                            animationCompleteRef.current.catB = true;
                        }
                    }
                }
            }

            angle += frequency;
            const swayOffset = Math.sin(angle) * adjustedAmplitude;

            element.style.transform = `translate(${swayOffset}px, ${positionY}px)`;

            // アニメーション完了していない場合のみ位置更新
            if (!animationCompleteRef.current.catA || !animationCompleteRef.current.catB) {
                updatePosition();
            }
        };

        // AnimationManagerに登録
        if (animationManagerRef.current) {
            animationManagerRef.current.register(animationId, runAnimation);
        }

        // クリックイベントハンドラ
        const onClick = (event: MouseEvent) => {
            const welcome = document.querySelector('.welcome');
            if (!(welcome && welcome.contains(event.target as Node))) {
                return;
            }

            // デバイス情報を再取得
            deviceInfo = getDeviceInfo();
            isMobileOrTabletPortrait = deviceInfo.isMobileOrTabletPortrait;

            velocity = 0;
            positionY = isMobileOrTabletPortrait ? -500 : -1150; // スマホまたはタブレット縦向き表示時は初期位置を調整
            isBouncing = true;
            hasCompleted = false;
            angle = 0;
            // アニメーション完了状態をリセット
            if (animationId === 'catA') {
                animationCompleteRef.current.catA = false;
            } else if (animationId === 'catB') {
                animationCompleteRef.current.catB = false;
            }
        };

        // リサイズイベントハンドラ
        const handleResize = () => {
            const newDeviceInfo = getDeviceInfo();
            const newIsMobileOrTabletPortrait = newDeviceInfo.isMobileOrTabletPortrait;

            // モバイルまたはタブレット縦向き状態が変わった場合のみ再調整
            if (newIsMobileOrTabletPortrait !== isMobileOrTabletPortrait) {
                isMobileOrTabletPortrait = newIsMobileOrTabletPortrait;
                velocity = 0;
                positionY = newIsMobileOrTabletPortrait ? -500 : -1150;
                isBouncing = true;
                hasCompleted = false;
                angle = 0;
                // アニメーション完了状態をリセット
                if (animationId === 'catA') {
                    animationCompleteRef.current.catA = false;
                } else if (animationId === 'catB') {
                    animationCompleteRef.current.catB = false;
                }
            }
        };

        window.addEventListener('click', onClick);
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('click', onClick);
            window.removeEventListener('resize', handleResize);
            if (animationManagerRef.current) {
                animationManagerRef.current.unregister(animationId);
            }
        };
    };

    // キャラクターとボードのアニメーション設定
    useEffect(() => {
        // DOM要素をキャッシュ
        cacheElements();

        // クリーンアップ関数を格納する配列
        const cleanupFunctions: (() => void)[] = [];

        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
            // DOM要素を再キャッシュ
            cacheElements();
            // リサイズ時に位置を更新
            updatePosition();
        };

        const { board, catMain, cacLogo, catA, catB } = elementsRef.current;

        // デバイス情報を取得（キャッシュ使用）
        const deviceInfo = getDeviceInfo();
        const { isMobileOrTabletPortrait } = deviceInfo;

        // キャラクターのアニメーション設定
        if (catA && catB) {
            catA.classList.remove('del');
            // スマホまたはタブレット縦向き表示時はパラメータを調整
            let cleanupCatA: (() => void) | undefined;
            if (isMobileOrTabletPortrait) {
                cleanupCatA = createAnimation(catA, 30, 5, 0.05, 'catA');
            } else {
                cleanupCatA = createAnimation(catA, 50, 7, 0.05, 'catA');
            }
            if (cleanupCatA) cleanupFunctions.push(cleanupCatA);

            catB.classList.remove('del');
            // スマホまたはタブレット縦向き表示時はパラメータを調整
            let cleanupCatB: (() => void) | undefined;
            if (isMobileOrTabletPortrait) {
                cleanupCatB = createAnimation(catB, 30, 10, 0.01, 'catB');
            } else {
                cleanupCatB = createAnimation(catB, 50, 20, 0.01, 'catB');
            }
            if (cleanupCatB) cleanupFunctions.push(cleanupCatB);
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
            // すべてのクリーンアップ関数を実行
            cleanupFunctions.forEach(cleanup => cleanup());
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('orientationchange', handleResize);
            window.removeEventListener('load', updatePosition);
        };
    }, [cacheElements, updatePosition]);

    // スポットライトエフェクト
    useEffect(() => {
        let spotlights: SpotlightPosition[] = [];
        let mouseSpot: SpotlightPosition = {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            r: 0
        };
        let drawFrameId: number | null = null;
        let initialized = false;
        const canvas = document.getElementById('spotlightCanvas') as HTMLCanvasElement | null;
        const ctx = canvas?.getContext('2d');

        // will-changeの動的管理
        const setWillChange = (enable: boolean) => {
            if (canvas) {
                canvas.style.willChange = enable ? 'transform' : 'auto';
            }
        };

        // スポットライト位置の共通更新関数
        const updateSpotlight = (x: number, y: number) => {
            if (!isDarkMode) return;
            mouseSpot = { x, y, r: window.innerHeight / 2 };
            spotlights[0] = mouseSpot;

            // 連続描画を防止
            if (drawFrameId) cancelAnimationFrame(drawFrameId);
            drawFrameId = requestAnimationFrame(() => {
                drawSpotlights(spotlights);
                drawFrameId = null;
            });
        };

        // イベントリスナーの削除
        const removeListeners = () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('touchstart', onTouchStart, TOUCH_EVENT_OPTIONS as AddEventListenerOptions);
            window.removeEventListener('touchmove', onTouchMove, TOUCH_EVENT_OPTIONS as AddEventListenerOptions);
            window.removeEventListener('touchend', onTouchEnd);
            window.removeEventListener('resize', onResize);
        };

        // マウス移動時のハンドラ
        const onMouseMove = (e: MouseEvent) => {
            updateSpotlight(e.clientX, e.clientY);
        };

        // タッチ開始時のハンドラ
        const onTouchStart = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                updateSpotlight(touch.clientX, touch.clientY);
                setWillChange(true);
            }
        };

        // タッチ移動時のハンドラ
        const onTouchMove = (e: TouchEvent) => {
            e.preventDefault(); // スクロールを防止
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                updateSpotlight(touch.clientX, touch.clientY);
            }
        };

        // タッチ終了時のハンドラ
        const onTouchEnd = () => {
            setWillChange(false);
        };

        // リサイズ時のハンドラ
        const onResize = () => {
            // キャッシュをクリア
            cachedDeviceInfo = null;
            // DOM要素を再キャッシュ
            cacheElements();
            resizeCanvas();
            if (isDarkMode) {
                // 位置を再計算してからスポットライトを更新
                updatePosition();
                setTimeout(() => {
                    updateSpotlightPositions();
                }, 50);
            }
        };

        // キャンバスのリサイズ
        const resizeCanvas = () => {
            if (!canvas) return;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        // スポットライトの描画（最適化版）
        const drawSpotlights = (spots: SpotlightPosition[]) => {
            if (!ctx || !canvas) return;

            // 描画開始
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

        // スポットライト位置の更新関数
        const updateSpotlightPositions = () => {
            const { spotlightL, spotlightR } = elementsRef.current;

            if (!spotlightL || !spotlightR) return;

            const getSpotPosition = (element: HTMLElement): SpotlightPosition => {
                const rect = element.getBoundingClientRect();
                return {
                    x: rect.left + window.scrollX + rect.width / 2,
                    y: rect.top + window.scrollY + rect.height / 2,
                    r: rect.width / 2,
                };
            };

            const LRSpot = getSpotPosition(spotlightR);
            const LLSpot = getSpotPosition(spotlightL);

            spotlights = [mouseSpot, LLSpot, LRSpot];

            if (isDarkMode && ctx && canvas) {
                drawSpotlights(spotlights);
            }
        };

        // コールバックを設定
        updateSpotlightsCallbackRef.current = updateSpotlightPositions;

        // スポットライトの初期化
        const initializeSpotlight = () => {
            if (!canvas || !ctx) return;

            // 要素を再キャッシュして最新の位置を取得
            cacheElements();

            // 初期位置更新して最新の位置を反映
            updatePosition();

            // スポットライトの位置を更新
            setTimeout(() => {
                updateSpotlightPositions();
            }, 50);

            resizeCanvas();

            // デバイス判定（キャッシュ使用）
            const deviceInfo = getDeviceInfo();

            // タッチデバイスとマウスデバイスの両方に対応
            if (deviceInfo.isTouchDevice) {
                // タッチイベントを追加（passive: falseで preventDefault を有効化）
                window.addEventListener('touchstart', onTouchStart, TOUCH_EVENT_OPTIONS);
                window.addEventListener('touchmove', onTouchMove, TOUCH_EVENT_OPTIONS);
                window.addEventListener('touchend', onTouchEnd);
            }

            // マウスイベントは常に追加（タッチデバイスでもマウス接続の可能性があるため）
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
            updateSpotlightsCallbackRef.current = null;
        } else if (isDarkMode && initialized) {
            // 既に初期化済みでダークモードの場合、スポットライト位置を更新
            updateSpotlightPositions();
        }

        return () => {
            removeListeners();
            if (drawFrameId) cancelAnimationFrame(drawFrameId);
            if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
            setWillChange(false);
            updateSpotlightsCallbackRef.current = null;
        };
    }, [isDarkMode, windowSize, cacheElements, updatePosition]);

    // 空のフラグメントを返す（実際のレンダリングはwelcome.tsxで行われる）
    return <></>;
}