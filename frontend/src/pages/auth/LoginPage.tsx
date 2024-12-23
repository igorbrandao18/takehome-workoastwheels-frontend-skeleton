import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LoginForm } from '../../components/auth/LoginForm';
import { Alert } from '../../components/ui/Alert';

export const LoginPage: React.FC = () => {
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { signIn } = useAuth();

    const from = location.state?.from?.pathname || '/';

    const handleLogin = async (email: string, password: string) => {
        try {
            await signIn({ email, password });
            navigate(from, { replace: true });
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to login');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Sign in to your account
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {error && (
                        <Alert
                            type="error"
                            message={error}
                            className="mb-4"
                        />
                    )}
                    <LoginForm onSubmit={handleLogin} />
                </div>
            </div>
        </div>
    );
}; 