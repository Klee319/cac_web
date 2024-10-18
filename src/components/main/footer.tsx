import Image from "next-image-export-optimizer"
// @ts-ignore
import localImage from '../../../public/logo/logo.svg'
// @ts-ignore
import insragramSvg from '../../../public/logo/Instagram_logo_2016.svg'
// @ts-ignore
import XSvg from "../../../public/logo/X_logo_2023.svg"

export default function Footer() {
    return (
        <footer className="pb-5">
            {/* 境界線 */}
            <div className="flex items-center justify-center">
            <div className="w-full h-0.5 bg-blue-300 mb-4"></div>
            </div>
            {/* フッターのメイン部分 */}
            <div className="flex flex-col md:flex-row items-center justify-around space-y-4 md:space-y-0">
                {/* ロゴとタイトル */}
                <div className="flex items-center space-x-4">
                    <Image
                        src={"/logo/newCAC.png"}
                        alt="C.A.C. logo"
                        width={220}
                        height={100}
                    />
                    <h1 className="text-2xl font-serif text-color">電子計算機応用部</h1>
                </div>

                {/* ソーシャルリンク */}
                <div className="flex items-center space-x-6">
                    <h1 className="text-2xl font-serif text-color">公式SNS/お問い合わせ</h1>
                    <a href="https://www.instagram.com/c_a_c_official">
                        <Image
                            src={insragramSvg}
                            alt="Instagram"
                            width={40}
                            height={40}
                            className="scale-100 hover:scale-125 transition-transform"
                        />
                    </a>
                    <a href="https://twitter.com/c_a_c_official">
                        <Image
                            src={XSvg}
                            alt="X"
                            width={40}
                            height={40}
                            className="scale-100 hover:scale-125 transition-transform x-icon"
                        />
                    </a>
                </div>
            </div>
        </footer>
    );
}
