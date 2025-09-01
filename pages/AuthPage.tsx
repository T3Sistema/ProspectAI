

import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAppContext } from '../App';
import { UserRole } from '../types';
import { Logo } from '../constants';

type AccessType = 'collaborator' | 'manager' | 'group' | 'admin';

const EyeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const EyeOffIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
);


const LoadingOverlay = () => (
    <div className="loading-overlay" aria-live="assertive" role="alert">
        <div className="loader-container">
            <div className="loader triangle">
                <svg viewBox="0 0 86 80">
                    <polygon points="43 8 79 72 7 72"></polygon>
                </svg>
            </div>
            <div className="loadingtext">
                <p>Autenticando</p>
            </div>
        </div>
    </div>
);

const AuthPage = () => {
    const [accessType, setAccessType] = useState<AccessType>('collaborator');
    const { login, currentUser } = useAppContext();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const inputClasses = "w-full bg-background text-text border border-border rounded-md py-3 px-4 transition-colors focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/40";
    const btnPrimaryClasses = "w-full flex justify-center py-3 px-4 border-transparent rounded-md shadow-sm text-sm font-semibold text-background bg-primary transition-all duration-300 hover:bg-primary-hover hover:shadow-glow-primary disabled:opacity-70 disabled:cursor-wait";
    
    const resetForm = () => {
        setEmail('');
        setPassword('');
        setError('');
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        let intendedRole: UserRole;
        switch (accessType) {
            case 'admin':
                intendedRole = UserRole.ADMIN;
                break;
            case 'collaborator':
                intendedRole = UserRole.COLLABORATOR;
                break;
            case 'manager':
                intendedRole = UserRole.COMPANY;
                break;
            case 'group':
                intendedRole = UserRole.GROUP_MANAGER;
                break;
            default:
                setError('Tipo de acesso interno inválido.');
                return;
        }

        setIsLoading(true);
        try {
            const result = await login(email, password, intendedRole);

            if (result.error) {
                setError(result.error);
            } else if (result.user) {
                const user = result.user;
                // Redirect based on the now-verified role
                if (user.role === UserRole.ADMIN) navigate('/admin');
                else if (user.role === UserRole.COLLABORATOR) navigate('/prospecting');
                else if (user.role === UserRole.COMPANY) navigate('/company-dashboard');
                else if (user.role === UserRole.GROUP_MANAGER) navigate('/group-dashboard');
                else navigate('/'); 
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    if (currentUser) {
        if(currentUser.role === UserRole.ADMIN) return <Navigate to="/admin" />;
        if(currentUser.role === UserRole.COLLABORATOR) return <Navigate to="/prospecting" />;
        if(currentUser.role === UserRole.COMPANY) return <Navigate to="/company-dashboard" />;
        if(currentUser.role === UserRole.GROUP_MANAGER) return <Navigate to="/group-dashboard" />;
    }
    
    const AccessSelector = () => (
        <div>
            <label className="block text-sm font-medium text-text-secondary">Tipo de Acesso</label>
            <div className="mt-1 grid grid-cols-3 gap-2 rounded-md bg-background p-1 border border-border">
                <button type="button" onClick={() => { setAccessType('collaborator'); resetForm(); }} className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${accessType === 'collaborator' ? 'bg-primary/20 text-primary shadow' : 'text-text-secondary hover:bg-card'}`}>Colaborador</button>
                <button type="button" onClick={() => { setAccessType('manager'); resetForm(); }} className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${accessType === 'manager' ? 'bg-primary/20 text-primary shadow' : 'text-text-secondary hover:bg-card'}`}>Gestor</button>
                <button type="button" onClick={() => { setAccessType('group'); resetForm(); }} className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${accessType === 'group' ? 'bg-primary/20 text-primary shadow' : 'text-text-secondary hover:bg-card'}`}>Grupo Empresarial</button>
            </div>
        </div>
    );

    const renderLoginForm = () => (
         <div className="space-y-6">
            {accessType !== 'admin' && <AccessSelector />}
            <form onSubmit={handleLogin} className="space-y-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-text-secondary">Endereço de e-mail</label>
                    <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value.toLowerCase())}
                        className={`mt-1 block ${inputClasses}`}/>
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-text-secondary">Senha</label>
                    <div className="relative mt-1">
                        <input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)}
                            className={`block ${inputClasses} pr-10`}/>
                        <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-secondary hover:text-primary" aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}>
                            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                    </div>
                </div>
                <button type="submit" className={btnPrimaryClasses} disabled={isLoading}>
                    {isLoading ? 'Autenticando...' : `Entrar como ${
                        accessType === 'collaborator' ? 'Colaborador' : 
                        accessType === 'manager' ? 'Gestor' :
                        accessType === 'group' ? 'Gestor de Grupo' : 'Admin'
                    }`}
                </button>
            </form>
        </div>
    );
    
    const isUserAccess = accessType !== 'admin';

    return (
        <div className="min-h-full flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
            {isLoading && <LoadingOverlay />}
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Logo className="mx-auto h-28 w-28 rounded-full object-cover filter drop-shadow-[0_0_8px_rgba(0,209,255,0.8)] transition-all duration-300 hover:scale-105 hover:drop-shadow-[0_0_12px_rgba(0,209,255,1)]" />
                <h2 className="mt-6 text-center text-3xl font-extrabold text-text">
                   {isUserAccess ? 'Acesse sua conta' : 'Acesso do Administrador'}
                </h2>
                 {!isUserAccess && (
                     <p className="mt-2 text-center text-sm text-text-secondary">
                        Bem-vindo de volta, admin.
                    </p>
                )}
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-card py-8 px-4 shadow-lg rounded-lg sm:px-10 border border-border">
                    {error && <p className="mb-4 text-center text-sm text-red-400">{error}</p>}
                    
                    {renderLoginForm()}

                    {isUserAccess && (
                         <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-border" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-card text-text-secondary">Ou</span>
                                </div>
                            </div>
                            <div className="mt-6 text-center">
                                <button onClick={() => { setAccessType('admin'); resetForm(); }} className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">
                                    Acessar como Administrador
                                </button>
                            </div>
                        </div>
                    )}
                     {!isUserAccess && (
                         <div className="mt-6 text-center">
                            <button onClick={() => { setAccessType('collaborator'); resetForm(); }} className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">
                                Voltar para o login de usuário
                            </button>
                        </div>
                     )}
                </div>
            </div>
        </div>
    );
};

export default AuthPage;