"use client";
import {useState} from "react";
import Image from "next/image";
// @ts-ignore
import cacLogo from '../../../public/logo/newCAC.png';
import SwitchLightDark from "@/components/main/switchLightDark";

export default function HomeHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false); // メニューの開閉状態
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen); // メニューの開閉をトグル
    const handleLinkClick = () => {
        setIsMenuOpen(false); // メニューを閉じる
    };

    return (
        <>

            {/* ヘッダー */}
            <div className="fixed w-full top-0 left-0 p-3 shadow-md z-50 header">
                <div className="flex items-center justify-between">
                    {/* 左側: ロゴとスイッチボタン */}
                    <div className="flex">
                        <div className="cac-logo h-auto w-[80px]">
                            <Image
                                src="/logo/newCAC.png"
                                  alt="C.A.C. ロゴ"
                                  width={460}
                                  height={192}
                                   className="block"
                            />
                        </div>
                        <div className="dark-switch text-left text-[12px] font-moon pt-1">
                            <SwitchLightDark/>
                        </div>
                    </div>

                    {/* ハンバーガーメニューアイコン (スマホ用) */}
                    <div className="xl:hidden">
                        <button onClick={toggleMenu} aria-label="Open Menu" className="relative z-50">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-8 h-8 hamburger-icon"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"/>
                            </svg>
                        </button>
                    </div>

                    {/* PC用ナビゲーションリンク */}
                    <nav className="nav-bar hidden space-x-8 text-2xl font-moon ">
                        <a href="#welcome" className="hover:text-link-hover-color">Welcome</a>
                        <a href="#about" className="hover:text-link-hover-color">About</a>
                        <a href="#group" className="hover:text-link-hover-color">Group</a>
                        <a href="#location" className="hover:text-link-hover-color">Location & Dates</a>
                        <a href="#event" className="hover:text-link-hover-color">Event</a>
                        <a href="#gallery" className="hover:text-link-hover-color">Gallery</a>
                    </nav>
                </div>
            </div>

            {/* メニュー */}
            <div
                className={`menu-bar top-[40px] fixed right-0 shadow-lg z-40 transition-all duration-300 ease-in-out overflow-hidden p-1 ${
                    isMenuOpen ? "translate-y-0 scale-100 opacity-100" : "-translate-y-full scale-80 opacity-90"
                }`}
                style={{
                    width: "fit-content",
                    maxHeight: isMenuOpen ? "fit-content" : "0",
                    transformOrigin: "top center"
                }}
            >
                <nav className="p-4 text-center font-moon">
                    {["Welcome", "About", "Group", "Location & Dates", "Event", "Gallery"].map((item, index) => (
                        <div key={index} className="flex flex-col">

                            <a
                                href={`#${item.toLowerCase().replace(/ & /g, "-").replace(/\s+/g, "")}`}
                                className="block text-lg py-4"
                                onClick={handleLinkClick}
                            >
                                {item}
                            </a>
                            <hr className="menu-border"/>
                        </div>
                    ))}
                </nav>
            </div>
        </>
    );
}


