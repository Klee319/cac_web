import React from "react";
import "./event.css";

// イベントデータの型定義
type EventData = {
    date: string;
    title: string;
    location: string;
    image?: string;
};

const events: EventData[] = [
    { date: "11/05", title: "第58回 神山祭", location: "京都産業大学", image: "path/to/image1.png" },
    { date: "10/07", title: "あまてく一周年 記念パーティー", location: "京都産業大学", image: "path/to/image2.png" },
    { date: "09/13", title: "あまてくアイディアソン feat. ベガコーポレーション", location: "TOMOSUBA 京都河原町店", image: "path/to/image3.png" },
    { date: "09/14", title: "あまてく feat. ベガコーポレーション", location: "TOMOSUBA 京都河原町店", image: "path/to/image3.png" },
    { date: "09/15", title: "あまてくアイディア feat. ベガコーポレーション", location: "TOMOSUBA 京都河原町店", image: "path/to/image3.png" },
    { date: "09/16", title: "あまてくアイディアソン feat. ベガコーポレーション", location: "TOMOSUBA 京都河原町店", image: "path/to/image3.png" },
    { date: "09/17", title: "あまてくアイディアソン feat. ベガコーポレーション", location: "TOMOSUBA 京都河原町店", image: "path/to/image3.png" },
    { date: "09/18", title: "あまてくアイディアソン feat. ベガコーポレーション", location: "TOMOSUBA 京都河原町店", image: "path/to/image3.png" },
];

const ROW_SIZE = 3; // PCでの1行のカード数

const TimelineItem = ({ date, title, location, image }: EventData) => (
    <div className="timeline-item">
        <div className="timeline-content">
            <div className="timeline-date">{date}</div>
            <div className="timeline-title">{title}</div>
            <div className="timeline-location">{location}</div>
            {image && <img src={image} alt={title} className="timeline-image" />}
        </div>
    </div>
);

const Timeline = ({ events }: { events: EventData[] }) => {
    // 改行ごとに順序と配置を決定
    const rows = [];
    for (let i = 0; i < events.length; i += ROW_SIZE) {
        const row = events.slice(i, i + ROW_SIZE);
        const rowIndex = Math.floor(i / ROW_SIZE);
        const isRight = rowIndex % 2 === 1; // 偶数行（0,2,4,...)を左寄せ、奇数行を右寄せ
        if (isRight) row.reverse(); // 右寄せの行はカードを逆順に
        rows.push({ row, isRight });
    }

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
                            {index < rowData.row.length - 1 && <div className="connector-horizontal" />}
                        </React.Fragment>
                    ))}
                    {rowIndex < rows.length - 1 && <div className="connector-vertical" />}
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

