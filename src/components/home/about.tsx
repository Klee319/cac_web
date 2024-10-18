"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";

const descriptions = [
    {
        title: "1.デジタル系創作団体",
        description: [
            "CAC、正式名称:電子計算機応用部はデジタル系の創作活動を行っている団体です。",
            "活動日には新歓祭や神山祭に向けて創作活動に取り組んでおり、仲間と切磋琢磨することで、1人では作れなかった創作物を生み出すことができます。",
            "クリエイターの高みを目指して一歩を踏み出してみませんか。"
        ],
    },
    {
        title: "2.独自の班制度",
        description: [
            "専攻している分野に分かれた「班」システムを採用。",
            "誰が何班に所属しているかが分かるので「専門外だけど...」という場合に気軽に教えてもらえる相手を見つけたり、創作活動を進めていて自分にはできないところを助けてくれたり人を探したりすることが簡単にできます。" ,
            "技術習得のために欲しかった書籍を買ってもらえることも...",
            "班の種類と班ごとの詳しい概要は「GROUP」で確認できます。"




        ],
    },
    {
        title: "3.溢れ出る創作意欲",
        description: [
            "創作活動をするといいことがたくさん。",
            "毎月各班が主催するコンテストが開催。入賞すれば賞金を手に入れられるチャンスです。どの班からも参加できるので新たな道を踏み出すきっかけになるかもしれません。" ,
            "コンテスト以外でも作った作品は必ず日の目を浴びてくれます。オンラインでメンバーからリアクションをもらったり、神山祭に展示したり..."
        ],
    },
    {
        title: "4.自由な活動",
        description: [
            "部活から強制的に渡されるタスクは基本ありません。",
            "活動時間中には好きなことができます。絵を描いたり、プログラミングをしたり...。迷惑さえかけなければ、雑談やゲームをしてもらっても大丈夫です。",
            "自分のやりたいことを見つけて、自分で進めることができる部活です。そんな人たちを尊重すべく所属する班の数にさえ制限はありません"
        ],
    },
    {
        title: "5.主体性",
        description: [
            "自ら進んで活動することが求められます。",
            "自由で強制されない、すなわち自分から動かなければ何も起こらない環境です。主体的に活動するほど部活の恩恵が大きくなっていくことでしょう",
        ],
    },
];

const variants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 100 : -100,
        opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({
        x: direction < 0 ? 100 : -100,
        opacity: 0,
    }),
};

export default function About() {
    const [pageIndex, setPageIndex] = useState(0);
    const [direction, setDirection] = useState(1);

    const nextPage = () => {
        setDirection(1);
        setPageIndex((prevIndex) =>
            prevIndex < descriptions.length - 1 ? prevIndex + 1 : 0
        );
    };

    const prevPage = () => {
        setDirection(-1);
        setPageIndex((prevIndex) =>
            prevIndex > 0 ? prevIndex - 1 : descriptions.length - 1
        );
    };

    return (
        <div className="pb-48 max-w-7xl mx-auto px-4">
            <div className="text-center mb-8">
                <h1 className="text-7xl font-moon">About</h1>
                <p className="pb-2">C.A.C.について</p>
                <div className="w-1/3 mx-auto h-0.5 bg-blue-400 mb-10"></div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between space-y-12 md:space-y-0 md:space-x-12 w-full">
                <div className="w-full md:w-1/2 flex justify-between items-center">
                    <span
                        onClick={prevPage}
                        className="text-4xl cursor-pointer nextButton"
                    >
                        &#60;
                    </span>

                    <div className="relative w-[80%] max-w-[600px] h-[300px]">
                        <AnimatePresence initial={false} custom={direction} mode="wait">
                            <motion.div
                                key={pageIndex}
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                                className="absolute w-full h-full"
                                style={{ willChange: "transform, opacity" }}
                            >
                                <div className="text-left break-words md:px-0 max-w-[400px] mx-auto pb-10">
                                    <h2 className="text-2xl font-bold mb-12 ">
                                        {descriptions[pageIndex].title}
                                    </h2>
                                    {descriptions[pageIndex].description.map(
                                        (line, index) => (
                                            <p key={index} className="mb-1.5 leading-relaxed">
                                                {line}
                                            </p>
                                        )
                                    )}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <span
                        onClick={nextPage}
                        className="text-4xl cursor-pointer nextButton"
                    >
                        &#62;
                    </span>
                </div>

                <div className="w-full md:w-1/2 flex justify-center mt-8 md:mt-0">
                    <Image
                        src="/about/state_board.jpg"
                        alt="作業風景"
                        width={520}
                        height={490}
                        className="object-contain"
                    />
                </div>
            </div>
        </div>
    );
}