import { useEffect, useState } from "react";

// Instagram APIのレスポンス型定義
interface InstagramMedia {
    media_url?: string;
    thumbnail_url?: string;
    permalink: string;
}

interface InstagramResponse {
    media?: {
        data: InstagramMedia[];
    };
    error?: {
        message: string;
    };
}

// 表示用の画像データ型
interface DisplayMedia {
    mediaUrl: string;
    permalink: string;
}

// APIエンドポイント
const INSTAGRAM_API_URL = `https://graph.facebook.com/v18.0/17841452314795723?access_token=EABkbTKMqk5IBOZBZAUzJMizQbjaXl7NCl9sV0yRm0UwyRbxudPY6um3dUJMna1YDdnD0PrMYoaRHDTOpCRjmOxPRMaJ2zk6XhQ7FqAgRaOceNsJ7MG0IUC6Sy8y0IVh3yIpPrSq7tAAKOdTg3YYYPUo8abau7bZASZCjjw53XtUU1IvZBVCxsJZCJ1EJOX3Ngf8u4WM7IZD&fields=media{media_url,thumbnail_url,permalink}`;

export const useInstagramImages = () => {
    const [images, setImages] = useState<DisplayMedia[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchInstagramImages = async () => {
            try {
                const response = await fetch(INSTAGRAM_API_URL);
                
                if (!response.ok) {
                    throw new Error(`API responded with status: ${response.status}`);
                }
                
                const jsonData = await response.json() as InstagramResponse;

                // コンポーネントがアンマウントされていたら処理を中止
                if (!isMounted) return;

                if (jsonData.error) {
                    throw new Error(jsonData.error.message);
                }

                if (jsonData.media?.data?.length) {
                    const displayMedias = jsonData.media.data.map(media => ({
                        mediaUrl: media.thumbnail_url || media.media_url || '',
                        permalink: media.permalink
                    })).filter(media => media.mediaUrl); // 画像URLが存在する項目のみ

                    setImages(displayMedias);
                } else {
                    throw new Error("No media data found.");
                }
            } catch (error) {
                console.error("Failed to fetch Instagram images:", error);
                if (isMounted) {
                    setError(error instanceof Error ? error.message : "An unknown error occurred.");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchInstagramImages();

        // クリーンアップ関数
        return () => {
            isMounted = false;
        };
    }, []);

    return { images, loading, error };
};
