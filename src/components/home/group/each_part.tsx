import Image from 'next/image';

// EachPartコンポーネントのプロパティの型定義
interface EachPartProps {
    group: string;
    description: string;
    link: string;
    image: string;
}

// 型定義を利用したEachPartコンポーネント
export default function EachPart({ group, description, link, image }: EachPartProps) {
    return (
        <div className="relative group overflow-hidden m-8">
            <Image
                src={image}
                alt={group}
                width={550}
                height={310}
                className="w-full h-full object-cover transition-transform transform group-hover:scale-105 "
            />
            <a href={link} target="_blank" rel="noopener noreferrer">
                <div className="absolute inset-0 bg-gray-900 bg-opacity-0 group-hover:bg-opacity-50 "></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 ">
                    <h2 className="text-6xl font-bold mb-2">{group}</h2>
                    <p className="text-center">{description}</p>
                </div>
            </a>
        </div>
    );
}

