"use client";
import { useState } from "react";
import Image from "next/image";
// @ts-ignore
import cacLogo from '../../../public/logo/newCAC.png';
import SwitchLightDark from "@/components/useEffect/switchLightDark";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false); // メニューの開閉状態

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen); // メニューの開閉をトグル

    return (
        <header className="fixed w-full top-0 left-0 p-8 shadow-md z-50 ">
            <div className="flex items-center justify-between">
                {/* 左側: ロゴとスイッチボタン */}
                <div className="flex items-center space-x-4">
                    <Image src={cacLogo} alt="C.A.C. logo" style={{ width: 100, height: 'auto' }} className="block" />
                    <div className="text-2xl font-moon">
                        <SwitchLightDark />
                    </div>
                </div>

                {/* ハンバーガーメニューアイコン (スマホ用) */}
                <div className="md:hidden">
                    <button onClick={toggleMenu} aria-label="Open Menu" className="relative z-50">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-8 h-8 hamburger-icon"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
                        </svg>
                    </button>
                </div>

                {/* スライドメニュー */}
                <div
                    className={`fixed top-0 right-0 max-h-screen shadow-lg z-40 transform transition-transform duration-300 ${
                        isMenuOpen ? "translate-x-0" : "translate-x-full"
                    } menu-bar`}
                    style={{ width: '256px' }}
                >
                    <button
                        onClick={toggleMenu}
                        className="absolute top-4 right-4  "
                    >
                        ✕
                    </button>

                    <nav className="mt-16 p-4">
                        {["Welcome", "About", "Group", "Location & Dates", "Event" ,"Gallery"].map((item, index) => (
                            <div key={index} className="flex flex-col">
                                <a
                                    href={`#${item.toLowerCase().replace(/ & /g, "-").replace(/\s+/g, "")}`}
                                    className="block text-lg py-4 "
                                >
                                    {item}
                                </a>
                                {index < 4 && <hr className="border-t " />}
                            </div>
                        ))}
                    </nav>
                </div>

                {/* PC用ナビゲーションリンク */}
                <nav className="hidden md:flex space-x-8 text-2xl font-moon">
                    <a href="#welcome" className="hover:text-link-hover-color">Welcome</a>
                    <a href="#about" className="hover:text-link-hover-color">About</a>
                    <a href="#group" className="hover:text-link-hover-color">Group</a>
                    <a href="#location" className="hover:text-link-hover-color">Location & Dates</a>
                    <a href="#event" className="hover:text-link-hover-color">Event</a>
                    <a href="#gallery" className="hover:text-link-hover-color">Gallery</a>
                </nav>
            </div>
        </header>
    );
}




