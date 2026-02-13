import { Switch } from "antd";
import { useTheme } from "../../hooks/useTheme";

export default function SwitchModeEib() {
    const {colors, menuMode, toggleMenuMode} = useTheme();

    return (
        <Switch
            onChange={toggleMenuMode}
            checked={menuMode === 'inline'}
            style={{
                color: colors.text,
                backgroundColor: colors.primary,
            }}
            checkedChildren="⭣"
            unCheckedChildren="⭢"
        />
    )
}