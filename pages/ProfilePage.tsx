import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../App';
import { supabase } from '../services/supabaseClient';
import type { User } from '../types';

const ArrowLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
);

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
                <p>Salvando</p>
            </div>
        </div>
    </div>
);

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children }: { isOpen: boolean; onClose: () => void; onConfirm: () => void; title: string; children: React.ReactNode; }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-card rounded-lg shadow-xl w-full max-w-md border border-border animate-zoom-in" onClick={e => e.stopPropagation()}>
                <div className="p-8 text-center space-y-4">
                    <h2 className="text-xl font-bold text-primary">{title}</h2>
                    <div>{children}</div>
                </div>
                <div className="flex justify-center gap-4 p-4 bg-background/50 rounded-b-lg border-t border-border">
                    <button onClick={onClose} className="px-8 py-2 rounded-md text-sm font-medium bg-border hover:bg-border/70 text-text transition-colors">Cancelar</button>
                    <button onClick={onConfirm} className="px-8 py-2 rounded-md text-sm font-bold text-background bg-primary hover:bg-primary-hover transition-colors">Confirmar</button>
                </div>
            </div>
        </div>
    );
};

const ErrorModal = ({ message, onClose }: { message: string, onClose: () => void }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-[120] flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-card rounded-lg shadow-xl w-full max-w-md border border-border animate-zoom-in" onClick={e => e.stopPropagation()}>
                <div className="p-8 text-center space-y-4">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-500/20">
                      <svg className="h-8 w-8 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold text-red-400">Ocorreu um Erro</h2>
                    <p className="text-text-secondary">{message}</p>
                </div>
                <div className="flex justify-center gap-4 p-4 bg-background/50 rounded-b-lg">
                    <button onClick={onClose} className="px-8 py-2 rounded-md text-sm font-bold text-background bg-primary hover:bg-primary-hover transition-colors">OK</button>
                </div>
            </div>
        </div>
    );
};

const Toast = ({ message, onDismiss }: { message: string; onDismiss: () => void; }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onDismiss();
        }, 4000);
        return () => clearTimeout(timer);
    }, [onDismiss]);

    return (
        <div className="fixed bottom-8 right-8 bg-secondary text-white py-3 px-6 rounded-lg shadow-2xl z-[110] animate-zoom-in flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p className="font-semibold">{message}</p>
        </div>
    );
};

const ProfilePage = () => {
    const { currentUser, updateCurrentUserProfile, openPhotoViewer, changeAdminPassword } = useAppContext();
    const navigate = useNavigate();

    const [name, setName] = useState(currentUser?.name || '');
    const [imagePreview, setImagePreview] = useState(currentUser?.profilePictureUrl || null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordVisibility, setPasswordVisibility] = useState({ current: false, new: false, confirm: false });
    
    const [profileMessage, setProfileMessage] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    
    const [isProfileConfirmModalOpen, setProfileConfirmModalOpen] = useState(false);
    const [isPasswordConfirmModalOpen, setPasswordConfirmModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [errorModalMessage, setErrorModalMessage] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!currentUser) {
        return <div className="text-center p-8">Usuário não encontrado.</div>;
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
                setProfileMessage('');
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProfileMessage('');
        if (name.trim() === '') {
            setProfileMessage('O nome não pode ficar em branco.');
            setTimeout(() => setProfileMessage(''), 3000);
            return;
        }
        setProfileConfirmModalOpen(true);
    };

    const handleConfirmProfileUpdate = async () => {
        setProfileConfirmModalOpen(false);
        setIsLoading(true);
        setProfileMessage('');

        try {
             let profileUpdateData: Partial<Pick<User, 'name' | 'profilePictureUrl'>> = {
                name: name,
            };

            if (imageFile && currentUser.role === 'admin') {
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${currentUser.id}-${Date.now()}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('prospectai')
                    .upload(filePath, imageFile);

                if (uploadError) throw new Error('Falha no upload da imagem.');
                
                const { data: publicUrlData } = supabase.storage
                    .from('prospectai')
                    .getPublicUrl(filePath);

                profileUpdateData.profilePictureUrl = publicUrlData.publicUrl;
            } else {
                profileUpdateData.profilePictureUrl = imagePreview || undefined;
            }

            const result = await updateCurrentUserProfile(profileUpdateData);

            if (result.toLowerCase().includes('sucesso')) {
                setToastMessage(result);
                setImageFile(null);
            } else {
                setProfileMessage(result);
            }
        } catch (error: any) {
            setErrorModalMessage(error.message || 'Ocorreu um erro inesperado ao atualizar o perfil.');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordMessage('');

        if (newPassword !== confirmPassword) {
            setPasswordMessage("As novas senhas não coincidem.");
            setTimeout(() => setPasswordMessage(''), 3000);
            return;
        }
        if (newPassword.length < 6) {
            setPasswordMessage("A nova senha deve ter pelo menos 6 caracteres.");
             setTimeout(() => setPasswordMessage(''), 3000);
            return;
        }
        
        if (currentUser.role === 'admin') {
            if (!currentPassword) {
                setPasswordMessage("A senha atual é obrigatória.");
                setTimeout(() => setPasswordMessage(''), 3000);
                return;
            }
            setPasswordConfirmModalOpen(true);
        } else {
            // Mock logic for non-admins
            const result = await updateCurrentUserProfile({ password: newPassword });
            setToastMessage(result);
            setNewPassword('');
            setConfirmPassword('');
        }
    };

    const handleConfirmPasswordChange = async () => {
        setPasswordConfirmModalOpen(false);
        setIsLoading(true);
        setPasswordMessage('');

        try {
            const result = await changeAdminPassword(currentPassword, newPassword);
            setToastMessage(result);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            setErrorModalMessage(error.message || 'Ocorreu um erro ao alterar a senha.');
        } finally {
            setIsLoading(false);
        }
    };

    const getInitials = (nameStr: string) => {
        if (!nameStr) return '';
        return nameStr.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    };
    
    const inputClasses = "w-full bg-background text-text border border-border rounded-md py-3 px-4 transition-colors focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/40";
    const btnPrimaryClasses = "flex justify-center py-3 px-4 border-transparent rounded-md shadow-sm text-sm font-semibold text-background bg-primary transition-all duration-300 hover:bg-primary-hover hover:shadow-glow-primary disabled:opacity-50 disabled:cursor-not-allowed";

    return (
        <>
            {isLoading && <LoadingOverlay />}
            {toastMessage && <Toast message={toastMessage} onDismiss={() => setToastMessage('')} />}
            {errorModalMessage && <ErrorModal message={errorModalMessage} onClose={() => setErrorModalMessage(null)} />}
            
            <ConfirmationModal
                isOpen={isProfileConfirmModalOpen}
                onClose={() => setProfileConfirmModalOpen(false)}
                onConfirm={handleConfirmProfileUpdate}
                title="Confirmar Alteração"
            >
                <p className="text-text-secondary">Tem certeza que deseja salvar as alterações no seu perfil?</p>
            </ConfirmationModal>

             <ConfirmationModal
                isOpen={isPasswordConfirmModalOpen}
                onClose={() => setPasswordConfirmModalOpen(false)}
                onConfirm={handleConfirmPasswordChange}
                title="Confirmar Alteração de Senha"
            >
                <p className="text-text-secondary">Tem certeza que deseja alterar sua senha?</p>
            </ConfirmationModal>

            <div className="max-w-4xl mx-auto space-y-12">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="p-3 rounded-full bg-card border border-border text-text-secondary hover:bg-background hover:text-primary transition-colors"
                        aria-label="Voltar"
                    >
                        <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                    <h1 className="text-4xl font-bold text-text">Meu Perfil</h1>
                </div>


                {/* Profile Details Form */}
                <form onSubmit={handleProfileSubmit} className="bg-card p-8 rounded-lg shadow-lg border border-border grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    <div className="md:col-span-1 flex flex-col items-center gap-4">
                        <div 
                            className="relative cursor-pointer"
                            onClick={() => imagePreview && openPhotoViewer(imagePreview)}
                            title="Clique para ampliar a imagem"
                        >
                            {imagePreview ? (
                                <img src={imagePreview} alt="User Avatar" className="h-40 w-40 rounded-full object-cover border-4 border-primary/50" />
                            ) : (
                                <div className="h-40 w-40 rounded-full bg-primary flex items-center justify-center text-background font-bold text-5xl border-4 border-primary/50">
                                    {getInitials(currentUser.name)}
                                </div>
                            )}
                            <button 
                                type="button" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    fileInputRef.current?.click();
                                }} 
                                className="absolute bottom-2 right-2 bg-card p-2 rounded-full text-text hover:bg-primary hover:text-background transition-colors shadow-lg border border-border"
                                aria-label="Alterar foto do perfil"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                    <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
                        <p className="text-text-secondary text-xs text-center">Clique no ícone para alterar a foto.</p>
                    </div>

                    <div className="md:col-span-2 space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">Nome</label>
                            <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} className={inputClasses} />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">Email</label>
                            <input id="email" type="email" value={currentUser.email} className={`${inputClasses} cursor-not-allowed bg-background/50`} disabled />
                        </div>
                        <div className="flex justify-end items-center gap-4">
                            {profileMessage && <p className={`text-sm ${profileMessage.includes('sucesso') ? 'text-green-400' : 'text-red-400'}`}>{profileMessage}</p>}
                            <button type="submit" className={btnPrimaryClasses} disabled={isLoading}>Salvar Alterações</button>
                        </div>
                    </div>
                </form>

                {/* Password Change Form */}
                <form onSubmit={handlePasswordSubmit} className="bg-card p-8 rounded-lg shadow-lg border border-border space-y-6">
                    <h2 className="text-2xl font-bold text-primary">Alterar Senha</h2>
                    {currentUser.role === 'admin' && (
                         <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Senha Atual</label>
                            <div className="relative">
                                <input type={passwordVisibility.current ? "text" : "password"} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className={`${inputClasses} pr-10`} required />
                                <button type="button" onClick={() => setPasswordVisibility(p => ({ ...p, current: !p.current }))} className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-secondary hover:text-primary" aria-label={passwordVisibility.current ? "Ocultar senha" : "Mostrar senha"}>
                                    {passwordVisibility.current ? <EyeOffIcon /> : <EyeIcon />}
                                </button>
                            </div>
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Nova Senha</label>
                        <div className="relative">
                           <input type={passwordVisibility.new ? "text" : "password"} value={newPassword} onChange={e => setNewPassword(e.target.value)} className={`${inputClasses} pr-10`} required />
                           <button type="button" onClick={() => setPasswordVisibility(p => ({ ...p, new: !p.new }))} className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-secondary hover:text-primary" aria-label={passwordVisibility.new ? "Ocultar senha" : "Mostrar senha"}>
                               {passwordVisibility.new ? <EyeOffIcon /> : <EyeIcon />}
                           </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Confirmar Nova Senha</label>
                        <div className="relative">
                           <input type={passwordVisibility.confirm ? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className={`${inputClasses} pr-10`} required />
                           <button type="button" onClick={() => setPasswordVisibility(p => ({ ...p, confirm: !p.confirm }))} className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-secondary hover:text-primary" aria-label={passwordVisibility.confirm ? "Ocultar senha" : "Mostrar senha"}>
                               {passwordVisibility.confirm ? <EyeOffIcon /> : <EyeIcon />}
                           </button>
                        </div>
                    </div>
                    <div className="flex justify-end items-center gap-4">
                        {passwordMessage && <p className={`text-sm text-red-400`}>{passwordMessage}</p>}
                        <button type="submit" className={btnPrimaryClasses} disabled={isLoading || !newPassword || !confirmPassword || (currentUser.role === 'admin' && !currentPassword)}>Alterar Senha</button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default ProfilePage;