import { useTheme } from '../../../hooks/useTheme';
import './loaderStyle.css';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
// import lottieAnim from '../../../assets/lottie/Live_chatbot_optimized.json'



export default function Loader() {
    const { colors, mode } = useTheme();
    console.log("Loader mounted")

    return (
        <div
            style={{
                backgroundColor: colors.background
            }}
            id='preloader'>
            <DotLottieReact
                src={`${import.meta.env.BASE_URL}assets/lottie/Live_chatbot_optimized.json`}
                loop
                autoplay
                style={{
                    width: "20%"
                }}
            // speed={1}
            />
        </div>
    )
}