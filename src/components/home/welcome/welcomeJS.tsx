import "./welcome.css";
import React, {useEffect, useState} from 'react';

type Props = {
    isDarkMode: boolean;
};

export default function WelcomeJS({isDarkMode}: Props) {
    const [windowSize, setWindowSize] = useState({
        width:0,
        height: 0,
    });

    const updatePosition = () => {
        const board = document.querySelector('.cac-board') as HTMLElement | null;
        const catMain = document.querySelector('.cac-cat-main') as HTMLElement | null;
        const catA = document.querySelector('.catA') as HTMLElement | null;
        const catB = document.querySelector('.catB') as HTMLElement | null;
        const spotlightL = document.querySelector('.spotlightL') as HTMLElement | null;
        const spotlightR = document.querySelector('.spotlightR') as HTMLElement | null;

        if (catA && spotlightR) {
            const catARect = catA.getBoundingClientRect();
            spotlightR.style.top = `${catARect.bottom - catARect.width * 1.3}px`;
            spotlightR.style.right = `${window.innerWidth - catARect.right * 1.05}px`;
        }

        if (catB && spotlightL) {
            const catBRect = catB.getBoundingClientRect();
            spotlightL.style.top = `${catBRect.bottom - catBRect.width * 1.3}px`;
            spotlightL.style.left = `${catBRect.left * 0.85}px`;
        }

        if (!catMain || !board) return;

        const rect = catMain.getBoundingClientRect();
        const handX = rect.left - rect.width * 0.04;
        const handY = rect.top + rect.height * 0.25;

        board.style.left = `${handX}px`;
        board.style.top = `${handY}px`;
    };


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

    const createAnimation = (
        element: HTMLElement,
        finalPositionY: number,
        amplitude: number,
        frequency: number,
        gravity = 1.3,
        bounceFactor = 0.7
    ) => {
        let positionY = -750;
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
                    isBouncing = false;
                }
            }

            angle += frequency;
            const swayOffset = Math.sin(angle) * amplitude;

            element.style.transform = `translate(${swayOffset}px, ${positionY}px)`;
            updatePosition();
            animationId = requestAnimationFrame(startAnimation);
        };

        const onClick = (event: MouseEvent) => {
            const welcome = document.querySelector('.welcome');
            if (!(welcome && welcome.contains(event.target as Node))) {
                return;
            }

            if (animationId !== null) cancelAnimationFrame(animationId);

            velocity = 0;
            positionY = -750;
            isBouncing = true;
            angle = 0;

            animationId = requestAnimationFrame(startAnimation);
        };

        window.addEventListener('click', onClick);
        animationId = requestAnimationFrame(startAnimation);

        return () => {
            window.removeEventListener('click', onClick);
        };
    };

    useEffect(() => {

        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };
        const board = document.querySelector('.cac-board') as HTMLElement | null;
        const catMain = document.querySelector('.cac-cat-main') as HTMLElement | null;
        const cacLogo = document.querySelector('.cac-logoL') as HTMLElement | null;
        const catA = document.querySelector('.catA') as HTMLElement | null;
        const catB = document.querySelector('.catB') as HTMLElement | null;

        if (catA && catB && catMain) {
            catA.classList.remove('del');
            createAnimation(catA, -300, 7, 0.05);
            catB.classList.remove('del');
            createAnimation(catB, 50, 20, 0.01);
        }

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

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('orientationchange', handleResize);
            window.removeEventListener('load', updatePosition);
        };
    }, []);

    useEffect(() => {

        let spotlights: { x: number; y: number; r: number }[] = [];
        let mouseSpot = { x: window.innerWidth / 2, y: window.innerHeight / 2, r: 150 };
        let animationFrameId: number | null = null;
        let initialized = false;
        const canvas = document.getElementById('spotlightCanvas') as HTMLCanvasElement | null;
        const ctx = canvas?.getContext('2d');

        const removeListeners = () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', onResize);
        };

        const onMouseMove = (e: MouseEvent) => {
            if (!isDarkMode) return;
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
            drawSpotlights(spotlights);
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('resize', onResize);

            initialized = true;
        };

        if (isDarkMode && !initialized) {
            initializeSpotlight();
        } else if (!isDarkMode) {
            removeListeners();
            if (ctx) ctx.clearRect(0, 0, canvas!.width, canvas!.height);
            initialized = false;
        }

        updatePosition();

        return () => {
            removeListeners();
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            if (ctx) ctx.clearRect(0, 0, canvas!.width, canvas!.height);
        };
    }, [isDarkMode, windowSize]);

    return (
        <>
        </>
    );
}