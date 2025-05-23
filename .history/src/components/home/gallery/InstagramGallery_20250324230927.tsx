"use client";
import { useInstagramImages } from "./useInstagramImages";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const Gallery = () => {
    const { images, loading, error } = useInstagramImages();
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        // 画像が取得されていない場合は何もしない
        if (images.length === 0) return;

        // 6秒ごとに画像を切り替えるインターバルを設定
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === images.length - 1 ? 0 : prevIndex + 1
            );
        }, 6000);

        // コンポーネントがアンマウントされたときのクリーンアップ
        return () => clearInterval(interval);
    }, [images.length]); // currentIndexを依存配列から削除

    // ローディング状態の表示
    if (loading) {
        return (
            <div className="relative w-full  flex items-center justify-center">
                <p className="text-xl">Loading gallery...</p>
            </div>
        );
    }

    // エラー状態の表示
    if (error) {
        return (
            <div className="relative w-full min-h-screen flex items-center justify-center">
                <p className="text-xl text-red-500">Error: {error}</p>
            </div>
        );
    }

    // 画像がない場合
    if (images.length === 0) {
        return (
            <div className="relative w-full min-h-screen flex items-center justify-center">
                <p className="text-xl">No images available</p>
            </div>
        );
    }

    // 現在表示する画像
    const image = images[currentIndex];

    return (
        <div className="relative w-full h-screen items-center justify-center overflow-hidden content">
            <AnimatePresence mode="wait">
                {image && (
                    <motion.img
                        key={currentIndex}
                        src={image.mediaUrl}
                        alt={`Instagram media ${currentIndex + 1}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.7 }}
                        className="absolute w-[80%] h-auto max-h-[80%] object-contain"
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Gallery;
