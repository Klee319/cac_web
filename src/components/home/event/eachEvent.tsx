type Props = {
    number: string;
    text: string;
}

export default function Event(props: Props) {
    return (
        <div className="container w-event mx-4 my-2 p-4">
            <div className="flex flex-wrap items-center">
                {/* 月の部分 */}
                <div className="flex items-baseline w-44">
                    <p className="text-7xl text-color-dark leading-none font-moon">{props.number}</p>
                    <p className="text-4xl text-color-dark font-moon pl-1">月</p>
                </div>

                {/* テキストの部分 */}
                <p className="text-3xl font-zen-kurenaido ml-4">{props.text}</p>
            </div>

            {/* 線の部分 */}
            <div className="w-full h-1 border-color-dark mt-2"></div>
        </div>
        
    );
}
