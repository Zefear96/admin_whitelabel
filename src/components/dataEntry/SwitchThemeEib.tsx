import { Switch } from "antd";
import { useTheme } from "../../hooks/useTheme";

export default function SwitchThemeEib() {
    const {mode, toggleTheme, colors} = useTheme();

    return (
        <Switch
          checked={mode === 'dark'}
          onChange={toggleTheme}
          checkedChildren="🌙"
          unCheckedChildren="☀️"
          style={{
            background: colors.primary
          }}
        />
    )
}