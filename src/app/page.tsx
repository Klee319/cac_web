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


export default async function Page() {
    useEffect(() => {
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        const isGoogleApp = /GSA/i.test(navigator.userAgent); // Googleアプリの判定

        if (!isSafari || isGoogleApp) {
            // Safari以外のブラウザ、またはGoogleアプリにクラスを付与
            document.body.classList.add("google");
        }

        const isTablet = /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);

        if (isTablet) {
            document.body.classList.add('tablet');
            //アラートを出す
        }
    }, []);
    return (
        <>

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


