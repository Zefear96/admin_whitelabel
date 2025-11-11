import { useTheme } from "../../hooks/useTheme"

export default function DynamicPage({title}: {title?: string}) {
    const {colors} = useTheme();
    
    return (
        <div style={{
            background: colors.background,
            height: '100vh',
            borderRadius: 15,
            padding: 20,
        }}>
            <p style={{
                color: colors.text
            }}>{title || 'Страница'}</p>
        </div>
    )
}