import { Watermark } from "antd";
import { useTheme } from "../../../hooks/useTheme";
import eibBackofficeLogo from "../../../src/assets/eibBackofficeLogo3.png"

export default function WatermarkEib({ children }: { children: React.ReactNode }) {
  const { colors, mode } = useTheme();

  return (
    <div style={{
      position: "relative",
      backgroundColor: colors.background,
      height: '100%',
      backdropFilter: 'blur(8px)',
    }}>
      <Watermark
        height={30}
        width={130}
        image={eibBackofficeLogo}
        gap={[100, 100]}
        zIndex={9}
        rotate={-22}
        font={{
          color: colors.surface
        }}
      >
        {children}
      </Watermark>
    </div>
  );
}