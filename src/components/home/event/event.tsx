import "./event.css";
import React, { useEffect, useState } from "react";

// イベントデータの型定義
type EventData = {
    date: string;
    title: string;
    image?: string;
};

// イベントデータ
const events: EventData[] = [
    { date: "4月", title: "新歓祭", image: "/about/state2.jpg" },
    { date: "6月", title: "新入生歓迎コンパ", image: "/about/state_board.jpg" },
    { date: "8月", title: "制作合宿(夏)", image: "/about/state2.jpg" },
    { date: "8月", title: "夏合宿（旅行）", image: "/about/state2.jpg" },
    { date: "9月", title: "サタデージャンボリー", image: "/about/state2.jpg" },
    { date: "11月", title: "神山祭", image: "/about/state2.jpg" },
    { date: "12月", title: "4回生追い出しコンパ", image: "/about/state2.jpg" },
    { date: "2月", title: "春合宿/制作合宿（春）", image: "/about/state2.jpg" },
];

// カードサイズとレスポンシブ対応を考慮したフック
const useRowSize = (): number => {
    // サーバーサイドレンダリング対応のためのデフォルト値
    const DEFAULT_ROW_SIZE = 3;
    
    // CSSカスタムプロパティから行サイズを取得する関数
    const getRowSize = (): number => {
        if (typeof window === "undefined") return DEFAULT_ROW_SIZE;
        
        try {
            const rowSize = getComputedStyle(document.documentElement)
                .getPropertyValue('--row-size')
                .trim();
            return parseInt(rowSize, 10) || DEFAULT_ROW_SIZE;
        } catch {
            return DEFAULT_ROW_SIZE;
        }
    };

    const [rowSize, setRowSize] = useState<number>(DEFAULT_ROW_SIZE);

    useEffect(() => {
        // クライアントサイドでのみ実行
        setRowSize(getRowSize());
        
        const handleResize = () => setRowSize(getRowSize());
        window.addEventListener('resize', handleResize);
        
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return rowSize;
};

// タイムラインの各アイテム（イベントカード）
const TimelineItem = ({ date, title, image }: EventData) => {
    // 背景画像のスタイル（画像がある場合のみ設定）
    const backgroundStyle = image ? {
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
    } : {};

    return (
        <div className="timeline-item" style={backgroundStyle}>
            <div className="overlay z-0"></div>
            <div className="timeline-content z-50">
                <div className="timeline-date font-zen-kurenaido text-color text-2xl">{date}</div>
                <div className="timeline-title font-zen-kurenaido text-color text-3xl">{title}</div>
            </div>
        </div>
    );
};

// タイムラインコンポーネント
const Timeline = ({ events }: { events: EventData[] }) => {
    const ROW_SIZE = useRowSize();
    
    // イベントを行ごとに分割して配置情報を追加
    const rows = Array.from({ length: Math.ceil(events.length / ROW_SIZE) }, (_, rowIndex) => {
        const startIdx = rowIndex * ROW_SIZE;
        const isRight = rowIndex % 2 === 1; // 偶数行は左寄せ、奇数行は右寄せ
        
        // 現在の行のイベントを取得
        let rowEvents = events.slice(startIdx, startIdx + ROW_SIZE);
        
        // 右寄せの行はカードを逆順に
        if (isRight) rowEvents = [...rowEvents].reverse();
        
        return { row: rowEvents, isRight };
    });

    return (
        <div className="timeline">
            {rows.map((rowData, rowIndex) => (
                <div
                    key={rowIndex}
                    className={`timeline-row ${rowData.isRight ? 'right' : 'left'}`}
                >
                    {rowData.row.map((event, index) => (
                        <React.Fragment key={index}>
                            <TimelineItem {...event} />
                            {index < rowData.row.length - 1 && <div className="connector-horizontal connector-color-dark" />}
                        </React.Fragment>
                    ))}
                    {rowIndex < rows.length - 1 && <div className="connector-vertical connector-color-dark" />}
                </div>
            ))}
        </div>
    );
};

// メインの Event コンポーネント
export default function Event() {
    return (
        <>
            <div className="text-center">
                <h1 className="text-7xl font-moon">Event</h1>
                <p className="pb-2">行事</p>
                <div className="w-1/3 mx-auto h-0.5 border-color-dark mb-10"></div>
            </div>
            <Timeline events={events} />
        </>
    );
}
