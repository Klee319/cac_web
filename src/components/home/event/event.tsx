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
    const timelineRef = React.useRef<HTMLDivElement>(null);
    const verticalConnectorsRef = React.useRef<(HTMLDivElement | null)[]>([]);
    
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

    // スクロールイベントとリサイズイベントを監視して縦線の位置を調整
    useEffect(() => {
        // 前回のビューポートの高さを記録
        let lastViewportHeight = window.innerHeight;
        let adjustmentInterval: NodeJS.Timeout | null = null;
        
        // モバイルデバイスかどうかを判定
        const isMobile = () => window.innerWidth <= 1024;
        
        // 縦線の位置を調整する関数
        const adjustVerticalConnectors = () => {
            if (!timelineRef.current) return;
            
            // 現在のビューポートの高さを取得
            const currentViewportHeight = window.innerHeight;
            
            // ビューポートの高さが変わった場合は記録を更新
            if (currentViewportHeight !== lastViewportHeight) {
                lastViewportHeight = currentViewportHeight;
                // 高さが変わった場合は、少し遅延させて調整（メニューバーのアニメーション完了後）
                setTimeout(adjustVerticalConnectors, 300);
            }
            
            const timelineRows = timelineRef.current.querySelectorAll('.timeline-row');
            
            timelineRows.forEach((row, index) => {
                if (index >= rows.length - 1) return; // 最後の行には縦線がない
                
                const connector = verticalConnectorsRef.current[index];
                if (!connector) return;
                
                // PC版とモバイル版で異なる調整を行う
                if (isMobile()) {
                    // モバイル版の調整ロジック
                    // カードの位置を取得
                    const cards = row.querySelectorAll('.timeline-item');
                    if (cards.length === 0) return;
                    
                    // 中央のカードまたは最初のカードを基準にする
                    const targetCardIndex = Math.floor(cards.length / 2);
                    const targetCard = cards[targetCardIndex];
                    const cardRect = targetCard.getBoundingClientRect();
                    
                    // 次の行の位置を取得
                    const nextRow = timelineRows[index + 1];
                    const nextRowCards = nextRow.querySelectorAll('.timeline-item');
                    if (nextRowCards.length === 0) return;
                    
                    // 次の行の中央のカードまたは最初のカードを基準にする
                    const nextTargetCardIndex = Math.floor(nextRowCards.length / 2);
                    const nextTargetCard = nextRowCards[nextTargetCardIndex];
                    const nextCardRect = nextTargetCard.getBoundingClientRect();
                    
                    // 縦線の位置を調整
                    const isLeft = row.classList.contains('left');
                    const rowRect = row.getBoundingClientRect();
                    
                    // 縦線の長さを調整（次の行までの距離）
                    const distance = nextRowCards[0].getBoundingClientRect().top - cardRect.bottom;
                    connector.style.height = `${Math.max(distance, 10)}px`; // 最小高さを設定
                    
                    // 縦線の水平位置を調整（カードの中央に配置）
                    connector.style.left = `${cardRect.left + cardRect.width / 2 - rowRect.left}px`;
                    connector.style.transform = 'translateX(-50%)';
                } else {
                    // PC版の調整ロジック - 特定のカードを縦に繋ぐ
                    const cards = row.querySelectorAll('.timeline-item');
                    if (cards.length === 0) return;
                    
                    const rowRect = row.getBoundingClientRect();
                    const isLeft = row.classList.contains('left');
                    const isRight = row.classList.contains('right');
                    
                    // 行のインデックスに基づいて、特定のカードを縦に繋ぐ
                    let targetCardIndex = 0;
                    
                    // 8月と8月、11月と12月が縦棒で結ばれるように調整
                    if (index === 0) { // 最初の行（4月、6月、8月）
                        targetCardIndex = 2; // 8月のカード（右端）
                    } else if (index === 1) { // 2行目（8月、9月、11月）
                        targetCardIndex = isRight ? 0 : 2; // 右寄せなら左端（11月）、左寄せなら右端（8月）
                    } else if (index === 2) { // 3行目（12月、2月）
                        targetCardIndex = isRight ? 1 : 0; // 右寄せなら右端（12月）、左寄せなら左端（12月）
                    }
                    
                    // 対象のカードを取得
                    const targetCard = cards[Math.min(targetCardIndex, cards.length - 1)];
                    const cardRect = targetCard.getBoundingClientRect();
                    
                    // 次の行の位置を取得
                    const nextRow = timelineRows[index + 1];
                    const nextRowCards = nextRow.querySelectorAll('.timeline-item');
                    if (nextRowCards.length === 0) return;
                    
                    // 次の行の対象カードを決定
                    let nextTargetCardIndex = 0;
                    
                    if (index === 0) { // 最初の行の次は2行目
                        nextTargetCardIndex = isRight ? 0 : 2; // 2行目が右寄せなら左端（11月）、左寄せなら右端（8月）
                    } else if (index === 1) { // 2行目の次は3行目
                        nextTargetCardIndex = isRight ? 1 : 0; // 3行目が右寄せなら右端（12月）、左寄せなら左端（12月）
                    }
                    
                    const nextTargetCard = nextRowCards[Math.min(nextTargetCardIndex, nextRowCards.length - 1)];
                    const nextCardRect = nextTargetCard.getBoundingClientRect();
                    
                    // 縦線の長さを調整（次の行までの距離）
                    const distance = nextCardRect.top - cardRect.bottom;
                    connector.style.height = `${Math.max(distance, 10)}px`; // 最小高さを設定
                    
                    // 縦線の水平位置を調整（対象カードの中央に配置）
                    connector.style.left = `${cardRect.left + cardRect.width / 2 - rowRect.left}px`;
                    connector.style.transform = 'translateX(-50%)';
                }
            });
        };
        
        // 初期調整（PC版とモバイル版の両方）
        adjustVerticalConnectors();
        
        // スクロールとリサイズイベントを監視（PC版とモバイル版の両方）
        window.addEventListener('resize', adjustVerticalConnectors);
        
        // モバイルの場合のみ追加のイベントリスナーを設定
        if (isMobile()) {
            window.addEventListener('scroll', adjustVerticalConnectors, { passive: true });
            
            // ビューポートの高さの変化を検出するための追加対策
            // visibilitychange イベントを監視（タブの切り替え時など）
            document.addEventListener('visibilitychange', adjustVerticalConnectors);
            
            // タッチイベントの終了時にも調整（モバイルでのスクロール後）
            document.addEventListener('touchend', () => {
                // タッチ操作後に少し遅延させて調整（メニューバーのアニメーション完了後）
                setTimeout(adjustVerticalConnectors, 300);
            });
            
            // 定期的な調整（バックアップとして）
            adjustmentInterval = setInterval(adjustVerticalConnectors, 1000);
        }
        
        // クリーンアップ
        return () => {
            window.removeEventListener('scroll', adjustVerticalConnectors);
            window.removeEventListener('resize', adjustVerticalConnectors);
            document.removeEventListener('visibilitychange', adjustVerticalConnectors);
            document.removeEventListener('touchend', adjustVerticalConnectors);
            if (adjustmentInterval) clearInterval(adjustmentInterval);
        };
    }, [rows.length]);

    return (
        <div className="timeline" ref={timelineRef}>
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
                    {rowIndex < rows.length - 1 && (
                        <div
                            className="connector-vertical connector-color-dark"
                            ref={el => {
                                verticalConnectorsRef.current[rowIndex] = el;
                            }}
                        />
                    )}
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
