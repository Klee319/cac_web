import About from '@/components/home/about';
import Group from '@/components/home/group/group';
import Location from '@/components/home/location';
import Event from "@/components/home/event/event";
import Footer from "@/components/main/footer";
import Header from '@/components/main/header'
import Welcome from "@/components/main/Welcome";
import GalleryPage from "@/components/home/gallery/GalleryPage";




export default async function Page() {
    return (
        <>
            <div className="flex justify-center ">
                <div className="z-20">
                    <div id="welcome">
                        <Welcome></Welcome>
                    </div>
                    <div>
                        <Header></Header>
                    </div>
                    <div className="h-[128px]">
                    </div>
                    <div id="about" >
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
                    <div>
                        <Footer></Footer>
                    </div>
                </div>
            </div>


        </>
    )
};


