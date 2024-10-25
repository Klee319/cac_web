import Image from "next/image";
import "./location.css";

export default function Location(){
    return(
        <>
            <div className=" pb-48">
                <h1 className=" text-center location-title text-7xl font-moon">Location & Dates</h1>
                <p className="pb-2 text-center">活動場所、日時</p>
                <div className="w-2/3 mx-auto  h-0.5 bg-blue-400 mb-20"></div>
                <div className="flex flex-wrap justify-center w-full">

                    <div className="">
                        <Image src="/about/state2.jpg" alt="作業風景" width={640} height={360}></Image>
                    </div>
                    <div className="flex-row mx-28 date-content text-center">
                        <p className="text-3xl font-zen-kurenaido pt-10 mb-1 date">水曜日</p>
                        <p className="text-3xl font-zen-kurenaido place">10201情報処理教室 (13:15-19:30)</p>
                        <p className="text-3xl font-zen-kurenaido pt-32 mb-1 date top-m">木曜日 </p>
                        <p className="text-3xl font-zen-kurenaido place">10202情報処理教室 (16:45-19:30)</p>
                    </div>

                </div>
            </div>
        </>
    );
}
