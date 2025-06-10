import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiBriefcase, FiPhone, FiFileText, FiArrowLeft } from 'react-icons/fi';
import InputMask from 'react-input-mask';
import { authService } from '../../../services/auth/authService';
import UserTypeSelect from './UserTypeSelect';
import './Register.css';
import logo from '../../../assets/images/logo.png';

const Register = () => {
    const navigate = useNavigate();
    const [userType, setUserType] = useState(null);
    const [formData, setFormData] = useState({
        // Campos comuns
        email: '',
        password: '',
        confirmPassword: '',
        
        // Campos Pessoa Física
        name: '',
        cpf: '',
        phone: '',
        position: '',
        
        // Campos Empresa
        companyName: '',
        tradeName: '',
        cnpj: '',
        stateRegistration: '',
        municipalRegistration: '',
        phone1: '',
        phone2: '',
        website: '',
        responsibleName: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Limpa o erro quando o usuário começa a digitar
        setError('');
    };

    const validateForm = () => {
        // Validações comuns
        if (!formData.email.trim()) {
            setError('Por favor, insira seu email');
            return false;
        }
        if (!formData.email.includes('@')) {
            setError('Por favor, insira um email válido');
            return false;
        }
        if (formData.password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('As senhas não coincidem');
            return false;
        }

        // Validações específicas por tipo
        if (userType === 'PF') {
            if (!formData.name.trim()) {
                setError('Por favor, insira seu nome');
                return false;
            }
            if (!formData.cpf.trim()) {
                setError('Por favor, insira seu CPF');
                return false;
            }
            // Validação do formato do CPF
            const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
            if (!cpfRegex.test(formData.cpf)) {
                setError('CPF deve estar no formato 000.000.000-00');
                return false;
            }
            if (!formData.phone.trim()) {
                setError('Por favor, insira seu telefone');
                return false;
            }
            if (!formData.position.trim()) {
                setError('Por favor, insira seu cargo');
                return false;
            }
        } else {
            if (!formData.companyName.trim()) {
                setError('Por favor, insira a razão social');
                return false;
            }
            if (!formData.tradeName.trim()) {
                setError('Por favor, insira o nome fantasia');
                return false;
            }
            if (!formData.cnpj.trim()) {
                setError('Por favor, insira o CNPJ');
                return false;
            }
            // Validação do formato do CNPJ
            const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
            if (!cnpjRegex.test(formData.cnpj)) {
                setError('CNPJ deve estar no formato 00.000.000/0000-00');
                return false;
            }
            if (!formData.phone1.trim()) {
                setError('Por favor, insira o telefone principal');
                return false;
            }
            if (!formData.responsibleName.trim()) {
                setError('Por favor, insira o nome do responsável');
                return false;
            }
            if (!formData.municipalRegistration.trim()) {
                setError('Por favor, insira a inscrição municipal');
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!userType) {
            setError('Por favor, selecione o tipo de conta');
            return;
        }
        
        if (!validateForm()) return;
        
        setLoading(true);
        setError('');

        try {
            const registerData = {
                email: formData.email,
                password: formData.password,
                userType,
                ...(userType === 'PF' ? {
                    name: formData.name,
                    cpf: formData.cpf,
                    phone: formData.phone,
                    position: formData.position
                } : {
                    companyName: formData.companyName,
                    tradeName: formData.tradeName,
                    cnpj: formData.cnpj,
                    stateRegistration: formData.stateRegistration,
                    municipalRegistration: formData.municipalRegistration,
                    phone1: formData.phone1,
                    phone2: formData.phone2,
                    website: formData.website,
                    responsibleName: formData.responsibleName
                })
            };

            const result = await authService.register(registerData);
            
            if (result.success) {
                // Mostra mensagem de sucesso
                setError('');
                setSuccess(result.message);
                
                // Redireciona para o login após 2 segundos
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (err) {
            setError(err.message || 'Erro ao criar conta. Por favor, tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        setUserType(null);
        setError('');
    };

    return (
        <div className="register-bg">
            <div className="register-card">
                {userType && (
                    <button className="register-back-btn" onClick={handleBack}>
                        <FiArrowLeft />
                        <span>Voltar</span>
                    </button>
                )}
                
                <div className="register-logo-top">
                    <img src={logo} alt="Logo" className="register-logo-img" />
                </div>

                <h1 className="register-title">
                    {!userType ? 'Criar Conta' : userType === 'PF' ? 'Cadastro de Pessoa Física' : 'Cadastro de Empresa'}
                </h1>
                
                <p className="register-subtitle">
                    {!userType ? 'Escolha o tipo de conta que deseja criar' : 'Preencha os dados abaixo para criar sua conta'}
                </p>

                {error && <div className="register-error">{error}</div>}
                {success && <div className="register-success">{success}</div>}

                {!userType ? (
                    <div className="register-type-select">
                        <div 
                            className="register-type-option"
                            onClick={() => setUserType('PF')}
                        >
                            <FiUser className="register-type-icon" />
                            <h3 className="register-type-title">Pessoa Física</h3>
                            <p className="register-type-description">
                                Cadastre-se como pessoa física para acessar nossos serviços
                            </p>
                        </div>
                        
                        <div 
                            className="register-type-option"
                            onClick={() => setUserType('PJ')}
                        >
                            <FiBriefcase className="register-type-icon" />
                            <h3 className="register-type-title">Empresa</h3>
                            <p className="register-type-description">
                                Cadastre sua empresa para acessar nossos serviços
                            </p>
                        </div>
                    </div>
                ) : (
                    <form className="register-form-modern" onSubmit={handleSubmit}>
                        <div className="register-form-group-modern">
                            <label className="register-label-modern">
                                <FiMail className="register-input-icon" />
                                Email*
                            </label>
                            <div className="register-input-icon-group">
                                <input
                                    type="email"
                                    name="email"
                                    className="register-input-modern"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Digite seu email"
                                    required
                                />
                            </div>
                        </div>

                        <div className="register-form-group-modern">
                            <label className="register-label-modern">
                                <FiLock className="register-input-icon" />
                                Senha*
                            </label>
                            <div className="register-input-icon-group">
                                <input
                                    type="password"
                                    name="password"
                                    className="register-input-modern"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Digite sua senha"
                                    required
                                />
                            </div>
                        </div>

                        <div className="register-form-group-modern">
                            <label className="register-label-modern">
                                <FiLock className="register-input-icon" />
                                Confirmar Senha*
                            </label>
                            <div className="register-input-icon-group">
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    className="register-input-modern"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirme sua senha"
                                    required
                                />
                            </div>
                        </div>

                        {userType === 'PF' ? (
                            <>
                                <div className="register-form-group-modern">
                                    <label className="register-label-modern">
                                        <FiUser className="register-input-icon" />
                                        Nome completo*
                                    </label>
                                    <div className="register-input-icon-group">
                                        <input
                                            type="text"
                                            name="name"
                                            className="register-input-modern"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Digite seu nome completo"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="register-form-group-modern">
                                    <label className="register-label-modern">
                                        <FiFileText className="register-input-icon" />
                                        CPF*
                                    </label>
                                    <div className="register-input-icon-group">
                                        <InputMask
                                            mask="999.999.999-99"
                                            maskChar={null}
                                            value={formData.cpf}
                                            onChange={handleChange}
                                        >
                                            {(inputProps) => (
                                                <input
                                                    {...inputProps}
                                                    type="text"
                                                    name="cpf"
                                                    className="register-input-modern"
                                                    placeholder="000.000.000-00"
                                                    required
                                                />
                                            )}
                                        </InputMask>
                                    </div>
                                </div>

                                <div className="register-form-group-modern">
                                    <label className="register-label-modern">
                                        <FiPhone className="register-input-icon" />
                                        Telefone*
                                    </label>
                                    <div className="register-input-icon-group">
                                        <InputMask
                                            mask="(99) 99999-9999"
                                            maskChar={null}
                                            value={formData.phone}
                                            onChange={handleChange}
                                        >
                                            {(inputProps) => (
                                                <input
                                                    {...inputProps}
                                                    type="tel"
                                                    name="phone"
                                                    className="register-input-modern"
                                                    placeholder="(00) 00000-0000"
                                                    required
                                                />
                                            )}
                                        </InputMask>
                                    </div>
                                </div>

                                <div className="register-form-group-modern">
                                    <label className="register-label-modern">
                                        <FiBriefcase className="register-input-icon" />
                                        Cargo*
                                    </label>
                                    <div className="register-input-icon-group">
                                        <input
                                            type="text"
                                            name="position"
                                            className="register-input-modern"
                                            value={formData.position}
                                            onChange={handleChange}
                                            placeholder="Digite seu cargo"
                                            required
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="register-form-group-modern">
                                    <label className="register-label-modern">
                                        <FiBriefcase className="register-input-icon" />
                                        Razão Social*
                                    </label>
                                    <div className="register-input-icon-group">
                                        <input
                                            type="text"
                                            name="companyName"
                                            className="register-input-modern"
                                            value={formData.companyName}
                                            onChange={handleChange}
                                            placeholder="Digite a razão social"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="register-form-group-modern">
                                    <label className="register-label-modern">
                                        <FiBriefcase className="register-input-icon" />
                                        Nome Fantasia*
                                    </label>
                                    <div className="register-input-icon-group">
                                        <input
                                            type="text"
                                            name="tradeName"
                                            className="register-input-modern"
                                            value={formData.tradeName}
                                            onChange={handleChange}
                                            placeholder="Digite o nome fantasia"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="register-form-group-modern">
                                    <label className="register-label-modern">
                                        <FiFileText className="register-input-icon" />
                                        CNPJ*
                                    </label>
                                    <div className="register-input-icon-group">
                                        <InputMask
                                            mask="99.999.999/9999-99"
                                            maskChar={null}
                                            value={formData.cnpj}
                                            onChange={handleChange}
                                        >
                                            {(inputProps) => (
                                                <input
                                                    {...inputProps}
                                                    type="text"
                                                    name="cnpj"
                                                    className="register-input-modern"
                                                    placeholder="00.000.000/0000-00"
                                                    required
                                                />
                                            )}
                                        </InputMask>
                                    </div>
                                </div>

                                <div className="register-form-group-modern">
                                    <label className="register-label-modern">
                                        <FiFileText className="register-input-icon" />
                                        Inscrição Estadual
                                    </label>
                                    <div className="register-input-icon-group">
                                        <InputMask
                                            mask="999.999.999"
                                            maskChar={null}
                                            value={formData.stateRegistration}
                                            onChange={handleChange}
                                        >
                                            {(inputProps) => (
                                                <input
                                                    {...inputProps}
                                                    type="text"
                                                    name="stateRegistration"
                                                    className="register-input-modern"
                                                    placeholder="000.000.000"
                                                />
                                            )}
                                        </InputMask>
                                    </div>
                                </div>

                                <div className="register-form-group-modern">
                                    <label className="register-label-modern">
                                        <FiFileText className="register-input-icon" />
                                        Inscrição Municipal*
                                    </label>
                                    <div className="register-input-icon-group">
                                        <InputMask
                                            mask="999.999.999"
                                            maskChar={null}
                                            value={formData.municipalRegistration}
                                            onChange={handleChange}
                                        >
                                            {(inputProps) => (
                                                <input
                                                    {...inputProps}
                                                    type="text"
                                                    name="municipalRegistration"
                                                    className="register-input-modern"
                                                    placeholder="000.000.000"
                                                    required
                                                />
                                            )}
                                        </InputMask>
                                    </div>
                                </div>

                                <div className="register-form-group-modern">
                                    <label className="register-label-modern">
                                        <FiPhone className="register-input-icon" />
                                        Telefone Principal*
                                    </label>
                                    <div className="register-input-icon-group">
                                        <InputMask
                                            mask="(99) 99999-9999"
                                            maskChar={null}
                                            value={formData.phone1}
                                            onChange={handleChange}
                                        >
                                            {(inputProps) => (
                                                <input
                                                    {...inputProps}
                                                    type="tel"
                                                    name="phone1"
                                                    className="register-input-modern"
                                                    placeholder="(00) 00000-0000"
                                                    required
                                                />
                                            )}
                                        </InputMask>
                                    </div>
                                </div>

                                <div className="register-form-group-modern">
                                    <label className="register-label-modern">
                                        <FiPhone className="register-input-icon" />
                                        Telefone Secundário
                                    </label>
                                    <div className="register-input-icon-group">
                                        <InputMask
                                            mask="(99) 99999-9999"
                                            maskChar={null}
                                            value={formData.phone2}
                                            onChange={handleChange}
                                        >
                                            {(inputProps) => (
                                                <input
                                                    {...inputProps}
                                                    type="tel"
                                                    name="phone2"
                                                    className="register-input-modern"
                                                    placeholder="(00) 00000-0000"
                                                />
                                            )}
                                        </InputMask>
                                    </div>
                                </div>

                                <div className="register-form-group-modern">
                                    <label className="register-label-modern">
                                        <FiUser className="register-input-icon" />
                                        Nome do Responsável*
                                    </label>
                                    <div className="register-input-icon-group">
                                        <input
                                            type="text"
                                            name="responsibleName"
                                            className="register-input-modern"
                                            value={formData.responsibleName}
                                            onChange={handleChange}
                                            placeholder="Digite o nome do responsável"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="register-form-group-modern">
                                    <label className="register-label-modern">
                                        <FiMail className="register-input-icon" />
                                        Website
                                    </label>
                                    <div className="register-input-icon-group">
                                        <input
                                            type="url"
                                            name="website"
                                            className="register-input-modern"
                                            value={formData.website}
                                            onChange={handleChange}
                                            placeholder="Digite o website da empresa"
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <button 
                            type="submit" 
                            className="register-submit-btn-modern"
                            disabled={loading}
                        >
                            {loading ? 'Criando conta...' : 'Criar Conta'}
                        </button>

                        <p className="register-subtitle">
                            Já tem uma conta? <Link to="/login" className="register-signup-link-modern">Faça login</Link>
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Register; 