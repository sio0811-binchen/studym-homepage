import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);

        // 청크 로드 에러(배포 후 흔한 이슈) 감지 시 자동 새로고침
        if (
            error.message.includes('Failed to fetch dynamically imported module') ||
            error.message.includes('Loading chunk') ||
            error.message.includes('Importing a module script failed') ||
            error.message.includes('Cannot read properties of undefined')
        ) {
            const hasReloaded = sessionStorage.getItem('retry-reload');
            if (!hasReloaded) {
                sessionStorage.setItem('retry-reload', 'true');
                window.location.reload();
            }
        }
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center">
                        <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="h-10 w-10 text-red-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">
                            문제가 발생했습니다
                        </h2>
                        <p className="text-gray-600 mb-8">
                            일시적인 오류이거나 네트워크 문제일 수 있습니다.<br />
                            페이지를 새로고침 해보세요.
                        </p>

                        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left overflow-auto max-h-32 text-xs text-gray-500 font-mono">
                            {this.state.error?.toString()}
                        </div>

                        <button
                            onClick={() => {
                                sessionStorage.removeItem('retry-reload');
                                window.location.reload();
                            }}
                            className="w-full bg-blue-600 text-white rounded-xl py-4 font-bold text-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                        >
                            <RefreshCw className="h-5 w-5" />
                            화면 새로고침
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
