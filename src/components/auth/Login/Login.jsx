import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../../services/authService';
import logoIcon from '../../../assets/images/logo.png';
import { FiEye, FiEyeOff, FiMail, FiLock } from 'react-icons/fi';
import './Login.css';

/**
 * Componente de Login
 * Responsável por exibir o formulário de login e gerenciar a autenticação do usuário
 */
const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleEmailChange = useCallback((e) => setEmail(e.target.value), []);
    const handlePasswordChange = useCallback((e) => setPassword(e.target.value), []);
    const handleRememberChange = useCallback((e) => setRememberMe(e.target.checked), []);
    const handleShowPassword = useCallback(() => setShowPassword((v) => !v), []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const userData = await authService.login(email, password);
            if (userData) {
                // Verifica se é PF usando o user_type do objeto user
                const isPF = userData.user?.user_type === 'PF';
                console.log('Tipo de usuário:', userData.user?.user_type);
                
                if (isPF) {
                    console.log('Redirecionando PF para selecionar empresa');
                    navigate('/selecionar-empresa');
                } else {
                    console.log('Redirecionando PJ para home');
                    navigate('/home');
                }
            }
        } catch (err) {
            console.error('Erro no login:', err);
            setError('Credenciais inválidas. Por favor, tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-bg">
            <div className="login-card">
                <div className="login-logo-top">
                    <img src={logoIcon} alt="Logo" className="login-logo-img" />
                </div>
                <h1 className="login-title">Bem-vindo de volta</h1>
                <p className="login-subtitle">Entre com suas credenciais para acessar sua conta</p>
                <form onSubmit={handleSubmit} className="login-form-modern">
                    {error && <div className="login-error">{error}</div>}
                    <div className="login-form-group-modern">
                        <label htmlFor="email" className="login-label-modern">Email*</label>
                        <div className="login-input-icon-group">
                            <FiMail className="login-input-icon" />
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="login-input-modern"
                                value={email}
                                onChange={handleEmailChange}
                                placeholder="mail@exemplo.com"
                                required
                                autoComplete="username"
                            />
                        </div>
                    </div>
                    <div className="login-form-group-modern">
                        <label htmlFor="password" className="login-label-modern">Senha*</label>
                        <div className="login-input-icon-group">
                            <FiLock className="login-input-icon" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                className="login-input-modern"
                                value={password}
                                onChange={handlePasswordChange}
                                placeholder="Min. 8 caracteres"
                                required
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                onClick={handleShowPassword}
                                className="login-eye-btn"
                                tabIndex={-1}
                            >
                                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                            </button>
                        </div>
                    </div>
                    <div className="login-options-modern">
                        <label className="login-remember-modern">
                            <input
                                type="checkbox"
                                name="rememberMe"
                                className="login-checkbox-modern"
                                checked={rememberMe}
                                onChange={handleRememberChange}
                            />
                            <span>Lembrar-me</span>
                        </label>
                        <a href="/forgot-password" className="login-forgot-link-modern">
                            Esqueceu a senha?
                        </a>
                    </div>
                    <button
                        type="submit"
                        className="login-submit-btn-modern"
                        disabled={loading}
                    >
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
                <div className="login-signup-modern">
                    Não tem uma conta?{' '}
                    <a href="/register" className="login-signup-link-modern">
                        Criar conta
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Login; 