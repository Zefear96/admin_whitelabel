// src/components/ErrorBoundary.tsx
import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import { Result, Button } from 'antd';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    errorCode: 500 | 404 | 403;
}

// Универсальный компонент (в функциональных компонентах навигатор не доступен напрямую)
export class ErrorBoundary extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            errorCode: 500, // по умолчанию 500
        };
    }

    static getDerivedStateFromError(): State {
        return {
            hasError: true,
            errorCode: 500,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Caught by ErrorBoundary:', error, errorInfo);

        // Опционально: определить код ошибки
        if (error.message.includes('403')) {
            this.setState({ errorCode: 403 });
        } else if (error.message.includes('404')) {
            this.setState({ errorCode: 404 });
        } else {
            this.setState({ errorCode: 500 });
        }
    }

    handleBack = () => {
        window.location.assign('/');
    };

    render() {
        if (!this.state.hasError) return this.props.children;

        const messages = {
            403: {
                title: '403',
                subtitle: 'Доступ запрещен',
            },
            404: {
                title: '404',
                subtitle: 'Страница не найдена',
            },
            500: {
                title: '500',
                subtitle: 'Произошла внутренняя ошибка сервера',
            },
        };

        const { title, subtitle } = messages[this.state.errorCode];

        return (
            <Result
                status={this.state.errorCode}
                title={title}
                subTitle={subtitle}
                extra={
                    <Button type="primary" onClick={this.handleBack}>
                        На главную
                    </Button>
                }
            />
        );
    }
}
