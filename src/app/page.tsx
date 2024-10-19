"use client";
import About from '@/components/home/about';
import Group from '@/components/home/group/group';
import Location from '@/components/home/location';
import Event from "@/components/home/event/event";
import Footer from "@/components/main/footer";
import HomeHeader from '@/components/home/homeHeader'
import Welcome from "@/components/home/Welcome";
import GalleryPage from "@/components/home/gallery/GalleryPage";
import {useEffect} from "react";
import Head from "next/head";


export default function Page() {
    useEffect(() => {
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        const isGoogleApp = /GSA/i.test(navigator.userAgent);

        if (!isSafari || isGoogleApp) {
            document.body.classList.add("google");
        } else {
            document.body.classList.add("safari");
        }

        const isTablet = /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);

        if (isTablet) {
            document.body.classList.add('tablet');
        }
    }, []); // 空の依存配列でコンポーネントのマウント時のみ実行
    return (
        <>
            <Head>
            <title>C.A.C. Official Website</title>
            <meta name="description" content="introduction of C.A.C." />
            <meta name="keywords" content="C.A.C., 京産, サークル" />
            <meta name="author" content="C.A.C." />
            <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
            </Head>

            <div className="body">

                <div className="z-20">
                    <div id="welcome">
                        <Welcome></Welcome>
                    </div>
                    <div>
                        <HomeHeader></HomeHeader>
                    </div>
                    <div className="h-[128px]">
                    </div>
                    {/*<div id="about" >*/}
                    {/*    <About></About>*/}
                    {/*</div>*/}

                    {/*<div id="group">*/}
                    {/*    <Group></Group>*/}
                    {/*</div>*/}

                    {/*<div id="location">*/}
                    {/*    <Location></Location>*/}
                    {/*</div>*/}
                    {/*<div id="event">*/}
                    {/*    <Event></Event>*/}
                    {/*</div>*/}
                    {/*<div id="gallery">*/}
                    {/*    <GalleryPage></GalleryPage>*/}
                    {/*</div>*/}
                    <div>
                        <Footer></Footer>
                    </div>
                </div>
            </div>


        </>
    )
};


