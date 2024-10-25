"use client";
import About from '@/components/home/about/about';
import Group from '@/components/home/group/group';
import Location from '@/components/home/location';
import Event from "@/components/home/event/event";
import Footer from "@/components/main/footer";
import HomeHeader from '@/components/home/header/homeHeader'
import Welcome from "@/components/home/welcome/Welcome";
import GalleryPage from "@/components/home/gallery/GalleryPage";
import {useEffect} from "react";


export default function Page() {

    useEffect(() => {

        const checkEngine = () => {
            const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
            const isGoogleApp = /GSA/i.test(navigator.userAgent);

            if (!isSafari || isGoogleApp) {
                document.body.classList.add("google");
                //alert("このサイトはGoogle");
            } else {
                document.body.classList.add("safari");
                //alert("このサイトはSafari");
            }
        };

        const setViewportHeight = () => {
            const vh = window.innerHeight * 0.01;
            document.body.style.setProperty('--vh', `${vh}px`);
        };

        const checkDevice=()　=> {
            const isTablet = /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);
            if (isTablet) {
                document.body.classList.add('tablet');
            }
        }

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

        setViewportHeight();
        checkEngine();
        checkDevice();
        addViewport();
        window.addEventListener("orientationchange", setViewportHeight);

    }, []); // 空の依存配列でコンポーネントのマウント時のみ実行

    return (
        <>
            <div className="body">

                <div className="main-content relative">

                    <div id="welcome">
                        <Welcome></Welcome>
                    </div>

                    <div>
                        <HomeHeader></HomeHeader>
                    </div>
                    <div className="relative">
                        <div className="stripe"></div>
                        <div className="description-main">
                            <div className="h-[128px]"></div>
                            <div id="about">
                                <About></About>
                            </div>
                            <div id="group">
                                <Group></Group>
                            </div>
                            <div id="location">
                                <Location></Location>
                            </div>
                            <div id="event">
                                <Event></Event>
                            </div>
                            <div id="gallery">
                                <GalleryPage></GalleryPage>
                            </div>
                        </div>
                    </div>
                    <div>
                        <Footer></Footer>
                    </div>
                </div>
            </div>
        </>
    )
};


