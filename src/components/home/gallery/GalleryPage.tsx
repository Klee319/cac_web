import FacebookGallery from "./InstagramGallery";

export default function GalleryPage() {
    return (
        <div className="min-h-screen ">
            <div className="text-center mb-8">
                <h1 className="text-7xl font-moon">Gallery</h1>
                <p className="pb-2">ギャラリー</p>
                <div className="w-1/3 mx-auto h-0.5 border-color-dark mb-10"></div>
            </div>
            <h1 className="text-center text-4xl  my-10"></h1>
            <FacebookGallery />
        </div>
    );
}
