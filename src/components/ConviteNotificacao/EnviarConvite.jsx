import React, { useState } from 'react';
import conviteService from '../../services/conviteService';
import './EnviarConvite.css';

const EnviarConvite = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await conviteService.enviarConvite({ email_convidado: email });
            setSuccess('Convite enviado com sucesso!');
            setEmail('');
        } catch (error) {
            setError(error.response?.data?.error || 'Erro ao enviar convite');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="enviar-convite-container">
            <h2>Enviar Convite</h2>
            <form onSubmit={handleSubmit} className="enviar-convite-form">
                <div className="form-group">
                    <label htmlFor="email">Email do Usuário PF</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Digite o email do usuário"
                        required
                    />
                </div>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <button
                    type="submit"
                    className="botao-enviar-convite"
                    disabled={loading}
                >
                    {loading ? 'Enviando...' : 'Enviar Convite'}
                </button>
            </form>
        </div>
    );
};

export default EnviarConvite; 