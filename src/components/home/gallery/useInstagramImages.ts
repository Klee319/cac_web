import { useEffect, useState } from "react";

const INSTAGRAM_API_URL = `https://graph.facebook.com/v18.0/17841452314795723?access_token=EABkbTKMqk5IBOZBZAUzJMizQbjaXl7NCl9sV0yRm0UwyRbxudPY6um3dUJMna1YDdnD0PrMYoaRHDTOpCRjmOxPRMaJ2zk6XhQ7FqAgRaOceNsJ7MG0IUC6Sy8y0IVh3yIpPrSq7tAAKOdTg3YYYPUo8abau7bZASZCjjw53XtUU1IvZBVCxsJZCJ1EJOX3Ngf8u4WM7IZD&fields=media{media_url,thumbnail_url,permalink}`;

export const useInstagramImages = () => {
    const [images, setImages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInstagramImages = async () => {
            try {
                const response = await fetch(INSTAGRAM_API_URL);
                const jsonData = await response.json();

                if (jsonData.media && jsonData.media.data) {
                    const displayMedias: any[] = [];

                    jsonData.media.data.forEach((media: any) => {
                        const imageUrl = media.thumbnail_url || media.media_url;
                        displayMedias.push({
                            mediaUrl: imageUrl,
                            permalink: media.permalink,
                        });
                    });

                    setImages(displayMedias);
                } else {
                    throw new Error("No media data found.");
                }
            } catch (error: any) {
                console.error("Failed to fetch Instagram images:", error);
                setError(error.message || "An error occurred.");
            } finally {
                setLoading(false);
            }
        };

        fetchInstagramImages();
    }, []);

    return { images, loading, error };
};
