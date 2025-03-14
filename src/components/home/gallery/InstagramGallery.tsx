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

    // ギャラリーの高さを管理するstate
    const [galleryHeight, setGalleryHeight] = useState('80vh');

    // ビューポートの高さを監視し、ギャラリーの高さを調整
    useEffect(() => {
        // 初期高さを設定
        updateGalleryHeight();

        // リサイズイベントとスクロールイベントを監視
        window.addEventListener('resize', updateGalleryHeight);
        window.addEventListener('scroll', updateGalleryHeight);
        
        // visibilitychangeイベントも監視（タブの切り替え時など）
        document.addEventListener('visibilitychange', updateGalleryHeight);
        
        // タッチイベントの終了時にも調整（モバイルでのスクロール後）
        document.addEventListener('touchend', () => {
            // タッチ操作後に少し遅延させて調整
            setTimeout(updateGalleryHeight, 300);
        });

        return () => {
            window.removeEventListener('resize', updateGalleryHeight);
            window.removeEventListener('scroll', updateGalleryHeight);
            document.removeEventListener('visibilitychange', updateGalleryHeight);
            document.removeEventListener('touchend', updateGalleryHeight);
        };
    }, []);

    // ギャラリーの高さを更新する関数
    const updateGalleryHeight = () => {
        // モバイルデバイスの場合のみ特別な処理
        if (window.innerWidth <= 1024) {
            // 固定の高さを設定（ビューポートの高さに依存しない）
            setGalleryHeight('600px');
        } else {
            // PCの場合はビューポートの高さに基づいて設定
            setGalleryHeight('80vh');
        }
    };

    // ローディング状態の表示
    if (loading) {
        return (
            <div className="relative w-full flex items-center justify-center" style={{ height: galleryHeight }}>
                <p className="text-xl">Loading gallery...</p>
            </div>
        );
    }

    // エラー状態の表示
    if (error) {
        return (
            <div className="relative w-full flex items-center justify-center" style={{ height: galleryHeight }}>
                <p className="text-xl text-red-500">Error: {error}</p>
            </div>
        );
    }

    // 画像がない場合
    if (images.length === 0) {
        return (
            <div className="relative w-full flex items-center justify-center" style={{ height: galleryHeight }}>
                <p className="text-xl">No images available</p>
            </div>
        );
    }

    // 現在表示する画像
    const image = images[currentIndex];

    return (
        <div className="relative w-full flex items-center justify-center overflow-hidden" style={{ height: galleryHeight }}>
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
