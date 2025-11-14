import { Header } from 'antd/es/layout/layout';
import { useAuth } from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import DrawerEib from './DrawerEib';
import { useTheme } from '../../../hooks/useTheme';
import PopoverNotif from '../../../components/dataDisplay/PopoverNotif';

export default function HeaderEib() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { mode, colors, toggleTheme } = useTheme();

  return (
    <Header style={{
      backgroundColor: '#f5f5f5',
      // borderBottom: `1px solid ${colors.surface}`
    }}>
      <div style={{
        display: "flex",
        justifyContent: "end",
        alignItems: "center",
        height: '100%'
      }}>
        <PopoverNotif/>
        <DrawerEib />
      </div>
    </Header>
  );
}