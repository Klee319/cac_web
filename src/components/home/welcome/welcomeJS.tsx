import "./welcome.css";
import React, { useEffect, useState } from 'react';

type Props = {
    isDarkMode: boolean;
};

type Position = { width: number; height: number };
type Spot = { x: number; y: number; r: number };

function updatePosition() {
    const board = document.querySelector<HTMLElement>('.cac-board');
    const catMain = document.querySelector<HTMLElement>('.cac-cat-main');
    const catA = document.querySelector<HTMLElement>('.catA');
    const catB = document.querySelector<HTMLElement>('.catB');
    const spotlightL = document.querySelector<HTMLElement>('.spotlightL');
    const spotlightR = document.querySelector<HTMLElement>('.spotlightR');

    if (catA && spotlightR) {
        const catARect = catA.getBoundingClientRect();
        spotlightR.style.top = `${window.scrollY + catARect.bottom - catARect.width * 1.3}px`;
        spotlightR.style.right = `${window.scrollX + catARect.right * 0.01}px`;
    }

    if (catB && spotlightL) {
        const catBRect = catB.getBoundingClientRect();
        spotlightL.style.top = `${window.scrollY + catBRect.bottom - catBRect.width * 1.5}px`;
        spotlightL.style.left = `${window.scrollX + catBRect.left * 0.6}px`;
    }

    if (catMain && board) {
        const rect = catMain.getBoundingClientRect();
        board.style.left = `${window.scrollX + rect.left - rect.width * 0.04}px`;
        board.style.top = `${window.scrollY + rect.top + rect.height * 0.25}px`;
    }
}

function animateBoard(board: HTMLElement) {
    const angle = 5;
    let angleValue = -angle - 35;
    let direction = 1;
    function frame() {
        angleValue += direction * 0.01;
        if (angleValue > angle - 35 || angleValue < -angle - 35) direction *= -1;
        board.style.transform = `rotate(${angleValue}deg)`;
        requestAnimationFrame(frame);
    }
    frame();
}

function createAnimation(
    element: HTMLElement,
    finalPositionY: number,
    amplitude: number,
    frequency: number,
    gravity = 1.3,
    bounceFactor = 0.7
) {
    let positionY = -1150;
    let velocity = 0;
    let angle = -1;
    let animationId: number | null = null;

    function startAnimation() {
        velocity += gravity;
        positionY += velocity;
        if (positionY >= finalPositionY) {
            positionY = finalPositionY;
            velocity = -velocity * bounceFactor;
        }
        angle += frequency;
        const swayOffset = Math.sin(angle) * amplitude;
        element.style.transform = `translate(${swayOffset}px, ${positionY}px)`;
        updatePosition();
        animationId = requestAnimationFrame(startAnimation);
    }

    function onClick(event: MouseEvent) {
        const welcome = document.querySelector('.welcome');
        if (!(welcome && welcome.contains(event.target as Node))) return;
        if (animationId !== null) cancelAnimationFrame(animationId);
        velocity = 0;
        positionY = -1150;
        angle = 0;
        animationId = requestAnimationFrame(startAnimation);
    }

    window.addEventListener('click', onClick);
    animationId = requestAnimationFrame(startAnimation);

    return () => {
        window.removeEventListener('click', onClick);
        if (animationId) cancelAnimationFrame(animationId);
    };
}

function getSpotPosition(element: HTMLElement): Spot {
    const rect = element.getBoundingClientRect();
    return {
        x: rect.left + window.scrollX + rect.width / 2,
        y: rect.top + window.scrollY + rect.height / 2,
        r: rect.width / 2,
    };
}

function drawSpotlights(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    spots: Spot[]
) {
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
}

export default function WelcomeJS({ isDarkMode }: Props) {
    const [windowSize, setWindowSize] = useState<Position>({ width: 0, height: 0 });

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
            updatePosition();
        };

        const board = document.querySelector<HTMLElement>('.cac-board');
        const catMain = document.querySelector<HTMLElement>('.cac-cat-main');
        const cacLogo = document.querySelector<HTMLElement>('.cac-logoL');
        const catA = document.querySelector<HTMLElement>('.catA');
        const catB = document.querySelector<HTMLElement>('.catB');

        let cleanupAnimations: (() => void)[] = [];

        if (catA && catB) {
            catA.classList.remove('del');
            cleanupAnimations.push(createAnimation(catA, 50, 7, 0.05));
            catB.classList.remove('del');
            cleanupAnimations.push(createAnimation(catB, 50, 20, 0.01));
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
            cleanupAnimations.forEach(fn => fn());
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('orientationchange', handleResize);
            window.removeEventListener('load', updatePosition);
        };
    }, []);

    useEffect(() => {
        const canvas = document.getElementById('spotlightCanvas') as HTMLCanvasElement | null;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let spotlights: Spot[] = [];
        let mouseSpot: Spot = { x: window.innerWidth / 2, y: window.innerHeight / 2, r: 0 };

        const spotLightR = document.querySelector<HTMLElement>('.spotlightR');
        const spotLightL = document.querySelector<HTMLElement>('.spotlightL');

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const onMouseMove = (e: MouseEvent) => {
            if (!isDarkMode) return;
            mouseSpot = { x: e.clientX, y: e.clientY, r: window.innerHeight / 2 };
            spotlights[0] = mouseSpot;
            drawSpotlights(ctx, canvas, spotlights);
            updatePosition();
        };

        const onResize = () => {
            resizeCanvas();
            if (isDarkMode) {
                drawSpotlights(ctx, canvas, spotlights);
                updatePosition();
            }
        };

        const removeListeners = () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', onResize);
        };

        if (isDarkMode && spotLightR && spotLightL) {
            resizeCanvas();
            const LRSpot = getSpotPosition(spotLightR);
            const LLSpot = getSpotPosition(spotLightL);
            spotlights = [mouseSpot, LLSpot, LRSpot];
            drawSpotlights(ctx, canvas, spotlights);
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('resize', onResize);
        } else {
            removeListeners();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        updatePosition();

        return () => {
            removeListeners();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        };
    }, [isDarkMode, windowSize]);

    return null;
}
