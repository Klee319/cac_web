import EachPart from './each_part';

export default function Group() {
    return (
        <>
            <div className="pb-48">
                <div className="text-center">
                    <h1 className="text-7xl font-moon">Group</h1>
                    <p className="pb-2">班活動</p>
                    <div className="w-1/3 mx-auto h-0.5 border-color-dark mb-10"></div>
                </div>

                {/* レスポンシブなグリッドレイアウト */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 px-6">
                    {/* 各班のコンポーネントを順番通りに配置 */}
                    <EachPart
                        group="Programing"
                        omit="P"
                        description="ゲームやシステムの制作"
                        link="https://drive.google.com/file/d/1j7T_4WnvK2_v1Pnql69QrSxdXAuAl8d6/view?usp=sharing"
                        image="/about/state1.jpg"
                    />
                    <EachPart
                        group="CG"
                        omit="C"
                        description="Blender, Mayaなどを使った3Dモデルの制作"
                        link="https://drive.google.com/file/d/1u-eOinEmJv83LldyxdJx3dppJV02gh1u/view?usp=sharing"
                        image="/about/state_CG.jpg"
                    />
                    <EachPart
                        group="Graphic"
                        omit="G"
                        description="イラスト、アニメーションなどのデザインに関わるものの制作"
                        link="https://drive.google.com/file/d/1skGF-XcmbFUwyt1PcDCKuJoNCR6wD00V/view?usp=sharing"
                        image="/about/state_grafic.jpg"
                    />
                    <EachPart
                        group="Music"
                        omit="M"
                        description="BGM, 効果音やボカロなどの音楽、音源を制作"
                        link="https://drive.google.com/file/d/1-uBKgkBWpiepk3tw6bN2YTGIOJCBS_8u/view?usp=sharing"
                        image="/about/state_music.jpg"
                    />
                    <EachPart
                        group="Video"
                        omit="V"
                        description="MVなどの映像作品の制作"
                        link="https://new.express.adobe.com/id/urn:aaid:sc:AP:0878c656-cf67-541e-8c36-ebccf8396cce?promoid=Z2G1FQKR&mv=other&learn=for-you&category=search"
                        image="/about/state_video.png"
                    />
                    <EachPart
                        group="Scenario"
                        omit="S"
                        description="小説やノベルゲームのシナリオの制作"
                        link="https://docs.google.com/presentation/d/1cdtyOHLxPyyC3PLS1H9F8wHHKWRQ6PFiiwdO_p91rMQ/edit#slide=id.g2c5129b0614_0_896"
                        image="/about/state_scenario.png"
                    />
                </div>
            </div>
        </>
    );
}
