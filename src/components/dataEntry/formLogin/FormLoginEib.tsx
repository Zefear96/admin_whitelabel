import type { FormProps } from 'antd';
import { Flex, Form } from 'antd';
import { useAuth } from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import './formLogin.css';
 
import ButtonLogin from '../ButtonLogin';
import eibLogo from '../../../assets/eibLogo.png'
import SwitchThemeEib from '../SwitchThemeEib';
import { useTheme } from '../../../hooks/useTheme';

type FieldType = {
    username: string;
    password: string;
    remember?: boolean;
};

export default function FormLoginEib() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const {colors} = useTheme();

    const onFinish: FormProps<FieldType>['onFinish'] = async () => {
        try {
            const success = await login();
            if (success) navigate('/');
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Ошибка валидации:', errorInfo);
    };

    return (
        <div className="formContainer">
            <SwitchThemeEib/>
            <img
                style={{
                    margin: "20px",
                    width: "150px"
                }}
                // width={200}
                src={eibLogo}
            />
            <Form
                name="login"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                style={{
                    fontSize: "1rem"
                }}
            >
                {/* Keycloak login does not need local credentials; keeping UI minimal */}

                <Form.Item>
                    <Flex justify="end" align="center"></Flex>
                </Form.Item>

                <Form.Item label={null}>
                    <ButtonLogin />
                </Form.Item>
            </Form >
        </div>
    )
}