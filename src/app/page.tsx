"use client";
import About from '@/components/home/about/about';
import Group from '@/components/home/group/group';
import Location from '@/components/home/location';
import Event from "@/components/home/event/event";
import Footer from "@/components/main/footer";
import HomeHeader from '@/components/home/header/homeHeader';
import Welcome from "@/components/home/welcome/welcome";
import GalleryPage from "@/components/home/gallery/GalleryPage";
import { useEffect, useState } from "react";

export default function Page() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const toggleMode = () => setIsDarkMode(!isDarkMode);
    
    useEffect(() => {
        // ブラウザエンジンの検出
        const checkEngine = () => {
            const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
            const isGoogleApp = /GSA/i.test(navigator.userAgent);

            if (!isSafari || isGoogleApp) {
                document.body.classList.add("google");
            } else {
                document.body.classList.add("safari");
            }
        };

        // ビューポートの高さを設定
        const setViewportHeight = () => {
            const vh = window.innerHeight * 0.01;
            document.body.style.setProperty('--vh', `${vh}px`);
        };

        // デバイスタイプの検出
        const checkDevice = () => {
            const isTablet = /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);
            if (isTablet) {
                document.body.classList.add('tablet');
            }
        };

        // ビューポートメタタグの追加
        const addViewport = () => {
            // 既存の viewport メタタグを探して削除
            const existingViewport = document.querySelector('meta[name="viewport"]');
            if (existingViewport) {
                existingViewport.remove();
            }
            // 新しい viewport メタタグを作成
            const newViewport = document.createElement('meta');
            newViewport.name = "viewport";
            newViewport.content = "width=device-width, initial-scale=1.0, viewport-fit=cover";
            document.head.appendChild(newViewport);
        };

        // 初期化関数の実行
        setViewportHeight();
        checkEngine();
        checkDevice();
        addViewport();
        
        // イベントリスナーの設定
        window.addEventListener("orientationchange", setViewportHeight);
        
        // ダークモードの適用
        if (isDarkMode) {
            document.documentElement.classList.add('dark-mode');
        } else {
            document.documentElement.classList.remove('dark-mode');
        }
        
        // クリーンアップ関数
        return () => {
            window.removeEventListener("orientationchange", setViewportHeight);
        };
    }, [isDarkMode]); // isDarkModeが変更されたときに実行

    return (
        <div className="body">
            <div className="main-content relative">
                <div id="welcome">
                    <Welcome isDarkMode={isDarkMode} />
                </div>
                
                <HomeHeader isDarkMode={isDarkMode} toggleMode={toggleMode} />
                
                <div className="relative">
                    <div className="stripe"></div>
                    <div className="description-main">
                        <div className="h-[128px]"></div>
                        <div id="about">
                            <About />
                        </div>
                        <div id="group">
                            <Group />
                        </div>
                        <div id="location">
                            <Location />
                        </div>
                        <div id="event">
                            <Event />
                        </div>
                        <div id="gallery">
                            <GalleryPage />
                        </div>
                    </div>
                </div>
                
                <Footer />
            </div>
        </div>
    );
}

