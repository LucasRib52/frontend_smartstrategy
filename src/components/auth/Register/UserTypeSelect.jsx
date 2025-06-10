import React from 'react';
import { FiUser, FiBriefcase } from 'react-icons/fi';

const UserTypeSelect = ({ onSelect }) => {
    return (
        <div className="register-type-select">
            <div 
                className="register-type-option"
                onClick={() => onSelect('PF')}
            >
                <FiUser className="register-type-icon" />
                <h3 className="register-type-title">Pessoa Física</h3>
                <p className="register-type-description">
                    Cadastre-se como pessoa física para acessar nossos serviços
                </p>
            </div>
            
            <div 
                className="register-type-option"
                onClick={() => onSelect('PJ')}
            >
                <FiBriefcase className="register-type-icon" />
                <h3 className="register-type-title">Empresa</h3>
                <p className="register-type-description">
                    Cadastre sua empresa para acessar nossos serviços
                </p>
            </div>
        </div>
    );
};

export default UserTypeSelect; 