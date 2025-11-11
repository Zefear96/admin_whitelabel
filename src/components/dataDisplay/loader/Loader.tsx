import VideoLoader from '../../../assets/video/Loader.mp4';
import { useTheme } from '../../../hooks/useTheme';
import './loaderStyle.css';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
// import LottieAnim from '../../../assets/video/Live chatbot().json';



export default function Loader() {
    const { colors, mode } = useTheme();
    console.log("Loader mounted")

    return (
        <div
            style={{
                backgroundColor: colors.background
            }}
            id='preloader'>
            {/* <DotLottieReact
                src="https://lottie.host/369da733-b69c-4ddc-92b6-80598495c497/38CGcHBgJa.json"
                loop
                autoplay
                style={{
                    width:"20%"
                }}
            /> */}
            <DotLottieReact
                src="video\Live_chatbot_optimized.json"
                loop
                autoplay
                style={{
                    width:"20%"
                }}
                // speed={1}
            />
        </div>
    )
}