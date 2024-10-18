"use client";
import { useInstagramImages } from "./useInstagramImages";
import { useState, useEffect } from "react";
import {AnimatePresence, motion} from "framer-motion";


const Gallery = () => {
    const { images, loading, error } = useInstagramImages();
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (images.length === 0) return; // 画像が取得されていない場合は何もしない

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === images.length - 1 ? 0 : prevIndex + 1
            );
        }, 6000); // 6秒ごとに画像を切り替え

        // コンポーネントがアンマウントされたときのクリーンアップ
        return () => clearInterval(interval);
    }, [currentIndex, images.length]);


    if (loading) return <p>Loading images...</p>;
    if (error) return <p>Error: {error}</p>;

    // ランダムな画像を取得
    const image = images[currentIndex];

    return (
        <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
                {image && (
                    <motion.img
                        key={currentIndex}
                        src={image.mediaUrl}
                        alt={`Instagram media ${currentIndex + 1}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.7 }} // なめらかな切り替え
                        className="absolute w-[80%] h-auto max-h-[80%] object-contain"
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Gallery;
