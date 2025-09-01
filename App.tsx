

import React, { useState, useEffect, createContext, useContext, useCallback, useRef } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import type { User, Company, Lead, UserRole, BusinessGroup, ExternalCompany, ExternalLead, ExternalBusinessGroup, ExternalCollaborator, LoginLog, Feedback } from './types';
import { UserRole as Roles } from './types';
import AuthPage from './pages/AuthPage';
import AdminPage from './pages/AdminPage';
import ProspectingPage from './pages/ProspectingPage';
import CompanyDashboard from './pages/CompanyDashboard';
import GroupDashboard from './pages/GroupDashboard';
import ProfilePage from './pages/ProfilePage';
import { Logo } from './constants';
import { MOCK_USERS, MOCK_COMPANIES, MOCK_LEADS, MOCK_BUSINESS_GROUPS } from './mockData';

const PhotoViewer = ({ src, onClose }: { src: string; onClose: () => void; }) => {
    if (!src) return null;

    const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
    };

    useEffect(() => {
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-80 z-[101] flex justify-center items-center p-4 transition-opacity duration-300" 
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label="Visualizador de Imagem"
        >
            <img 
                src={src} 
                alt="Visualização do perfil" 
                className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl animate-zoom-in"
                onClick={(e) => e.stopPropagation()}
            />
        </div>
    );
};

// AUTH & DATA MANAGEMENT (Mock Backend)
interface AppContextType {
    currentUser: User | null;
    login: (email: string, password: string, role: UserRole) => Promise<{ user: User | null; error: string | null }>;
    logout: () => void;
    signUp: (userData: Omit<User, 'id' | 'approved' | 'role' | 'profilePictureUrl'> & { role: UserRole, companyCode?: string }) => string;
    users: User[];
    companies: Company[];
    businessGroups: BusinessGroup[];
    leads: Lead[];
    externalCompanies: ExternalCompany[];
    externalLeads: ExternalLead[];
    externalUnqualifiedLeads: ExternalLead[];
    externalBusinessGroups: ExternalBusinessGroup[];
    externalCollaborators: ExternalCollaborator[];
    loginLogs: LoginLog[];
    approveUser: (userId: string) => void;
    updateUser: (user: User) => void;
    deleteUser: (userId: string) => void;
    addCompany: (companyName: string) => void;
    updateCompanyAndManager: (companyId: string, newName: string, newManagerId: string | null, businessGroupId: string | null) => void;
    deleteCompany: (companyId: string) => void;
    addBusinessGroup: (groupName: string) => void;
    updateBusinessGroup: (groupId: string, newName: string) => void;
    deleteBusinessGroup: (groupId: string) => void;
    setGroupCompanies: (groupId: string, companyIds: string[]) => void;
    assignGroupManager: (groupId: string, managerId: string | null) => void;
    updateLead: (updatedLead: Lead) => void;
    requestProof: (leadId: string) => void;
    reassignLead: (leadId: string, newAssigneeId: string) => void;
    getCompanyById: (id: string) => Company | undefined;
    getUserById: (id: string) => User | undefined;
    getBusinessGroupById: (id: string) => BusinessGroup | undefined;
    addCompanyManager: (managerData: Omit<User, 'id' | 'approved' | 'role' | 'companyId' | 'position' | 'profilePictureUrl'>) => string;
    updateCurrentUserProfile: (data: Partial<Pick<User, 'name' | 'password' | 'profilePictureUrl'>>) => Promise<string>;
    changeAdminPassword: (oldPassword: string, newPassword: string) => Promise<string>;
    openPhotoViewer: (url: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error("useAppContext must be used within an AppProvider");
    return context;
};

const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem('currentUser');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [users, setUsers] = useState<User[]>(MOCK_USERS);
    const [companies, setCompanies] = useState<Company[]>(MOCK_COMPANIES);
    const [businessGroups, setBusinessGroups] = useState<BusinessGroup[]>(MOCK_BUSINESS_GROUPS);
    const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
    const [viewingPhotoUrl, setViewingPhotoUrl] = useState<string | null>(null);
    const [externalCompanies, setExternalCompanies] = useState<ExternalCompany[]>([]);
    const [externalLeads, setExternalLeads] = useState<ExternalLead[]>([]);
    const [externalUnqualifiedLeads, setExternalUnqualifiedLeads] = useState<ExternalLead[]>([]);
    const [externalBusinessGroups, setExternalBusinessGroups] = useState<ExternalBusinessGroup[]>([]);
    const [externalCollaborators, setExternalCollaborators] = useState<ExternalCollaborator[]>([]);
    const [loginLogs, setLoginLogs] = useState<LoginLog[]>([]);

    useEffect(() => {
        if (currentUser) {
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        } else {
            localStorage.removeItem('currentUser');
        }
    }, [currentUser]);

    const parseLeadString = (rawString: string): ExternalLead | null => {
        try {
            const lines = rawString.split('\n');
            const leadData: { [key: string]: string } = {};
            const otherInfo: string[] = [];
            const isEmAtendimento = lines.some(line => line.trim().toLowerCase() === 'em atendimento');
    
            lines.forEach(line => {
                const separatorIndex = line.indexOf(': ');
                if (separatorIndex !== -1) {
                    const key = line.substring(0, separatorIndex).trim();
                    const value = line.substring(separatorIndex + 2).trim();
                    leadData[key] = value;
                } else {
                    otherInfo.push(line.trim());
                }
            });

            const feedbackLine = lines.find(line => line.trim().toLowerCase().startsWith('feedback:'));
            const printLine = lines.find(line => line.trim().toLowerCase().startsWith('print:'));
            if (feedbackLine) {
                leadData['Feedback'] = feedbackLine.substring(feedbackLine.indexOf(': ') + 2).trim();
            }
            if (printLine) {
                leadData['Print'] = printLine.substring(printLine.indexOf(': ') + 2).trim();
            }
    
            const paymentMethod = otherInfo.filter(l => l.toLowerCase() !== 'em atendimento').length > 0 ? otherInfo[0] : '';
            let tipoCompra = leadData['Tipo de compra'] || '';
            if (paymentMethod) {
                tipoCompra = tipoCompra ? `${paymentMethod}, ${tipoCompra}` : paymentMethod;
            }
            
            let printUrls: string[] = [];
            if (leadData['Print']) {
                try {
                    printUrls = JSON.parse(leadData['Print']);
                } catch (e) {
                    console.warn("Could not parse Print URLs JSON:", leadData['Print'], e);
                }
            }
    
            if (leadData['Id'] && leadData['Empresa']) {
                return {
                    id: parseInt(leadData['Id'], 10),
                    nome: leadData['Nome'],
                    telefone: leadData['Telefone'],
                    empresa: leadData['Empresa'],
                    data: leadData['Data'],
                    horario: leadData['Horário'],
                    tipo_compra: tipoCompra || 'Não informado',
                    fullDetails: rawString,
                    status: leadData['Status'] || (isEmAtendimento ? 'Em atendimento' : undefined),
                    colaborador: leadData['Colaborador'],
                    feedback: leadData['Feedback'],
                    printUrls: printUrls.length > 0 ? printUrls : undefined,
                };
            }
            console.warn("Failed to parse lead string, missing required fields (Id, Empresa):", rawString, leadData);
            return null;
        } catch (error) {
            console.error("Error parsing lead string:", rawString, error);
            return null;
        }
    }

    const convertExternalToInternalLead = (externalLead: ExternalLead, assigneeId: string): Lead => {
        let receivedAt = new Date().toISOString();
        if (externalLead.data && externalLead.horario) {
            try {
                const [day, month, year] = externalLead.data.split('/').map(Number);
                const [hour, minute] = externalLead.horario.split(':').map(Number);
                // JS month is 0-indexed
                if(day && month && year && !isNaN(hour) && !isNaN(minute)) {
                   receivedAt = new Date(year, month - 1, day, hour, minute).toISOString();
                }
            } catch (e) {
                console.warn(`Could not parse date ${externalLead.data} ${externalLead.horario}`, e);
            }
        }

        let internalStatus: Lead['status'];
        const externalStatus = externalLead.status;
        
        if (externalStatus === 'Finalizado') {
            if (externalLead.fullDetails.toLowerCase().includes('não qualificado')) {
                 internalStatus = 'not_converted';
            } else {
                 internalStatus = 'converted';
            }
        } else if (externalStatus === 'Em atendimento') {
            internalStatus = 'contacted';
        } else {
            internalStatus = 'new';
        }

        const feedbacks: Feedback[] = [];
        if (externalLead.feedback) {
            let feedbackDate = new Date().toISOString(); // Fallback
            
            const fimProspeccaoLine = externalLead.fullDetails.split('\n').find(l => l.startsWith('Fim da prospecção:'));
            if (fimProspeccaoLine) {
                const dateStr = fimProspeccaoLine.replace('Fim da prospecção: ', '').trim();
                const [datePart, timePart] = dateStr.split(' ');
                if (datePart && timePart) {
                    const [day, month, year] = datePart.split('/').map(Number);
                    const [hour, minute] = timePart.split(':').map(Number);
                    if (day && month && year && !isNaN(hour) && !isNaN(minute)) {
                        feedbackDate = new Date(year, month - 1, day, hour, minute).toISOString();
                    }
                }
            }

            feedbacks.push({
                id: `fb-ext-${externalLead.id}`,
                text: externalLead.feedback,
                createdAt: feedbackDate,
                proofUrl: externalLead.printUrls?.join(',') || undefined,
            });
        }
    
        const detailsWithoutPrints = externalLead.fullDetails
            .split('\n')
            .filter(line => !line.trim().toLowerCase().startsWith('print:'))
            .join('\n');

        return {
            id: `ext-${externalLead.id}`,
            name: externalLead.nome,
            company: externalLead.empresa,
            phone: externalLead.telefone || 'N/A',
            receivedAt: receivedAt,
            contactAttempts: 0,
            feedbacks: feedbacks,
            status: internalStatus,
            qualificationStatus: externalLead.status === 'Lead não qualificado' ? 'Lead não qualificado' : (internalStatus === 'converted' ? 'Lead qualificado' : undefined),
            assignedTo: assigneeId,
            proofRequested: false,
            details: detailsWithoutPrints,
        };
    };
    
    const login = useCallback(async (email: string, pass: string, intendedRole: UserRole): Promise<{ user: User | null; error: string | null }> => {
        if (intendedRole === Roles.ADMIN) {
            try {
                const response = await fetch('https://webhook.triad3.io/webhook/login-adm', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password: pass }),
                });

                const data = await response.json();

                if (response.ok && data.resposta?.toLowerCase().includes('bem-vind')) {
                    const adminUser = users.find(u => u.role === Roles.ADMIN);
                    if (adminUser) {
                        const updatedAdmin = {
                            ...adminUser,
                            name: data.nome || adminUser.name,
                            profilePictureUrl: data.foto || adminUser.profilePictureUrl,
                            email: data.email || adminUser.email,
                        };
                        
                        setUsers(prevUsers => prevUsers.map(u => u.id === adminUser.id ? updatedAdmin : u));
                        setCurrentUser(updatedAdmin);

                        // Fetch external data for admin dashboard AND company view feature
                        try {
                            const [
                                companiesRes, 
                                leadsRes, 
                                unqualifiedLeadsRes, 
                                groupsRes, 
                                collaboratorsRes, 
                                logsRes, 
                                finalizedLeadsRes, 
                                inProgressLeadsRes
                            ] = await Promise.all([
                                fetch('https://webhook.triad3.io/webhook/prospectai-getempresas'),
                                fetch('https://webhook.triad3.io/webhook/prospectai-getleads'),
                                fetch('https://webhook.triad3.io/webhook/prospectai-getleadsnaoqualificados'),
                                fetch('https://webhook.triad3.io/webhook/prospectai-grupos'),
                                fetch('https://webhook.triad3.io/webhook/prospectai-getcolaboradores'),
                                fetch('https://webhook.triad3.io/webhook/prospectai-getlogs'),
                                fetch('https://webhook.triad3.io/webhook/prospectai-finalizados'),
                                fetch('https://webhook.triad3.io/webhook/prospectai-leadsematendimento'),
                            ]);

                            // Set external states for the main admin dashboard views
                            const companiesData: ExternalCompany[] = companiesRes.ok ? await companiesRes.json() : [];
                            setExternalCompanies(companiesData);
                            
                            const collaboratorsData: ExternalCollaborator[] = collaboratorsRes.ok ? await collaboratorsRes.json() : [];
                            setExternalCollaborators(collaboratorsData);
                            
                            const groupsData: ExternalBusinessGroup[] = groupsRes.ok ? await groupsRes.json() : [];
                            setExternalBusinessGroups(groupsData);

                            const logsData = logsRes.ok ? await logsRes.json() : [];
                            if (Array.isArray(logsData)) {
                                setLoginLogs(logsData);
                            } else if (logsData && Array.isArray(logsData.Array)) {
                                setLoginLogs(logsData.Array);
                            }

                            // Now, process all external data into internal state for the company view feature
                            
                            // 1. Process Companies into internal format
                            const allInternalCompanies: Company[] = companiesData.map((extComp) => ({
                                id: extComp.codigo,
                                name: extComp.empresa,
                            }));
                            setCompanies(allInternalCompanies);

                            // 2. Process Users (Collaborators and Managers) into internal format
                            let nextUsers: User[] = users.filter(u => u.id === updatedAdmin.id); // Start with just the logged-in admin

                            const internalCollaborators: User[] = collaboratorsData.map((extCollab) => {
                                const company = allInternalCompanies.find(c => c.name.toLowerCase() === extCollab.empresa.toLowerCase());
                                return {
                                    id: `collab-${extCollab.email}`,
                                    name: extCollab.nome,
                                    email: extCollab.email,
                                    phone: extCollab.telefone,
                                    profilePictureUrl: extCollab.foto,
                                    role: Roles.COLLABORATOR,
                                    companyId: company ? company.id : extCollab.empresa,
                                    position: 'Colaborador',
                                    approved: extCollab.status === 'on',
                                };
                            });
                            nextUsers.push(...internalCollaborators);

                            const companyManagers: User[] = companiesData.map((extComp) => ({
                                id: `manager-${extComp.email}`,
                                name: extComp.nome,
                                email: extComp.email,
                                phone: extComp.telefone,
                                profilePictureUrl: extComp.foto,
                                role: Roles.COMPANY,
                                companyId: extComp.codigo,
                                position: 'Gestor da Empresa',
                                approved: true,
                            }));
                            
                            const existingEmails = new Set(nextUsers.map(u => u.email));
                            const newManagers = companyManagers.filter(u => !existingEmails.has(u.email));
                            nextUsers.push(...newManagers);
                            setUsers(nextUsers);

                            // 3. Process all Lead types into internal format
                            const externalLeadsMap = new Map<number, ExternalLead>();
                            const processLeadsResponse = async (res: Response) => {
                                if (res.ok) {
                                    const leadStrings: string[] = await res.json();
                                    return leadStrings.map(parseLeadString).filter((l): l is ExternalLead => l !== null);
                                }
                                return [];
                            };

                            const finalizedLeads = await processLeadsResponse(finalizedLeadsRes);
                            finalizedLeads.forEach(lead => externalLeadsMap.set(lead.id, lead));

                            const inProgressLeads = await processLeadsResponse(inProgressLeadsRes);
                            inProgressLeads.forEach(lead => { if (!externalLeadsMap.has(lead.id)) externalLeadsMap.set(lead.id, lead); });
                            
                            const qualifiedLeads = await processLeadsResponse(leadsRes);
                            setExternalLeads(qualifiedLeads); // Keep for main dashboard
                            qualifiedLeads.forEach(lead => { if (!externalLeadsMap.has(lead.id)) externalLeadsMap.set(lead.id, lead); });

                            const unqualifiedLeads = await processLeadsResponse(unqualifiedLeadsRes);
                            setExternalUnqualifiedLeads(unqualifiedLeads); // Keep for main dashboard
                            unqualifiedLeads.forEach(lead => { if (!externalLeadsMap.has(lead.id)) externalLeadsMap.set(lead.id, lead); });

                            const allExternalLeads = Array.from(externalLeadsMap.values());
                            
                            const allInternalLeads = allExternalLeads.map(extLead => {
                                const assignee = nextUsers.find(u =>
                                    u.role === Roles.COLLABORATOR &&
                                    u.name.trim().toLowerCase() === extLead.colaborador?.trim().toLowerCase()
                                );
                                const assigneeId = assignee ? assignee.id : `unknown-collab-for-${extLead.id}`;
                                return convertExternalToInternalLead(extLead, assigneeId);
                            });
                            setLeads(allInternalLeads);

                        } catch (fetchError) {
                            console.error("Failed to fetch dashboard data:", fetchError);
                        }

                        return { user: updatedAdmin, error: null };
                    }
                    return { user: null, error: "Usuário admin não encontrado no sistema local." };
                } else {
                    return { user: null, error: data.resposta || "Usuário ou senha incorretos. Por favor, tente novamente." };
                }
            } catch (error) {
                console.error("Admin login error:", error);
                return { user: null, error: "Erro de comunicação com o servidor de autenticação." };
            }
        }

        if (intendedRole === Roles.COLLABORATOR) {
            try {
                const response = await fetch('https://webhook.triad3.io/webhook/login-colaborador-prospectai', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password: pass }),
                });

                const data = await response.json();

                if (response.ok && data.resposta?.toLowerCase().includes('bem-vind')) {
                     if (data.status === 'off') {
                        return { user: null, error: "Você não tem permissão para acessar esta ferramenta. Por favor, entre em contato com a diretoria." };
                    }
                    
                    const company = companies.find(c => c.name.toLowerCase() === data.empresa.toLowerCase());

                    const collaboratorUser: User = {
                        id: `collab-${email}`,
                        name: data.nome,
                        email: email,
                        phone: data.telefone,
                        profilePictureUrl: data.foto,
                        role: Roles.COLLABORATOR,
                        companyId: company ? company.id : data.empresa,
                        position: data.cargo,
                        approved: true,
                    };
                    
                    setUsers(prevUsers => {
                        const userExists = prevUsers.some(u => u.email === email);
                        if (userExists) {
                            return prevUsers.map(u => u.email === email ? { ...u, ...collaboratorUser } : u);
                        }
                        return [...prevUsers, collaboratorUser];
                    });

                    setCurrentUser(collaboratorUser);
                    
                    // Fetch leads for the collaborator
                    try {
                        const [leadsRes, unqualifiedLeadsRes, inProgressLeadsRes, finalizedLeadsRes] = await Promise.all([
                            fetch('https://webhook.triad3.io/webhook/prospectai-getleads'),
                            fetch('https://webhook.triad3.io/webhook/prospectai-getleadsnaoqualificados'),
                            fetch('https://webhook.triad3.io/webhook/prospectai-leadsematendimento'),
                            fetch('https://webhook.triad3.io/webhook/prospectai-finalizados'),
                        ]);
                        
                        const externalLeadsMap = new Map<number, ExternalLead>();
                        let myQualifiedExternalLeads: ExternalLead[] = [];
                        let myUnqualifiedExternalLeads: ExternalLead[] = [];

                        // Process finalized leads first, as they have the highest status precedence.
                        if (finalizedLeadsRes.ok) {
                            const finalizedLeadsData: string[] = await finalizedLeadsRes.json();
                            const parsedFinalizedLeads = finalizedLeadsData.map(parseLeadString).filter((lead): lead is ExternalLead => lead !== null);
                            const myFinalizedLeads = parsedFinalizedLeads.filter(lead => lead.colaborador?.trim().toLowerCase() === collaboratorUser.name.trim().toLowerCase());
                            myFinalizedLeads.forEach(lead => externalLeadsMap.set(lead.id, lead));
                        }

                        // Process in-progress leads second, only if not already finalized.
                        if (inProgressLeadsRes.ok) {
                            const inProgressLeadsData: string[] = await inProgressLeadsRes.json();
                            const parsedInProgressLeads = inProgressLeadsData.map(parseLeadString).filter((lead): lead is ExternalLead => lead !== null);
                            const myInProgressLeads = parsedInProgressLeads.filter(lead => lead.colaborador?.trim().toLowerCase() === collaboratorUser.name.trim().toLowerCase());
                            myInProgressLeads.forEach(lead => {
                                if (!externalLeadsMap.has(lead.id)) {
                                    externalLeadsMap.set(lead.id, lead);
                                }
                            });
                        }

                        if (leadsRes.ok) {
                            const leadsData: string[] = await leadsRes.json();
                            const parsedLeads = leadsData.map(parseLeadString).filter((lead): lead is ExternalLead => lead !== null);
                            const myLeads = parsedLeads.filter(lead => lead.colaborador?.trim().toLowerCase() === collaboratorUser.name.trim().toLowerCase());
                            myQualifiedExternalLeads = myLeads;
                            myLeads.forEach(lead => {
                                if (!externalLeadsMap.has(lead.id)) {
                                    externalLeadsMap.set(lead.id, lead);
                                }
                            });
                        }

                        if (unqualifiedLeadsRes.ok) {
                            const unqualifiedLeadsData: string[] = await unqualifiedLeadsRes.json();
                            const parsedUnqualifiedLeads = unqualifiedLeadsData.map(parseLeadString).filter((lead): lead is ExternalLead => lead !== null);
                            const myUnqualifiedLeads = parsedUnqualifiedLeads.filter(lead => lead.colaborador?.trim().toLowerCase() === collaboratorUser.name.trim().toLowerCase());
                            myUnqualifiedExternalLeads = myUnqualifiedLeads;
                            myUnqualifiedLeads.forEach(lead => {
                                if (!externalLeadsMap.has(lead.id)) {
                                    externalLeadsMap.set(lead.id, lead);
                                }
                            });
                        }
                        
                        setExternalLeads(myQualifiedExternalLeads);
                        setExternalUnqualifiedLeads(myUnqualifiedExternalLeads);

                        const allMyExternalLeads = Array.from(externalLeadsMap.values());
                        const internalLeads = allMyExternalLeads.map(extLead => convertExternalToInternalLead(extLead, collaboratorUser.id));
                        setLeads(internalLeads);

                    } catch (fetchError) {
                        console.error("Failed to fetch leads data for collaborator:", fetchError);
                    }

                    return { user: collaboratorUser, error: null };

                } else {
                    return { user: null, error: data.resposta || "Usuário ou senha incorretos. Por favor, tente novamente." };
                }
            } catch (error) {
                console.error("Collaborator login error:", error);
                return { user: null, error: "Erro de comunicação com o servidor de autenticação." };
            }
        }

        if (intendedRole === Roles.COMPANY) {
            try {
                const response = await fetch('https://webhook.triad3.io/webhook/login-empresaprospectai', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password: pass }),
                });

                const data = await response.json();

                if (response.ok && data.resposta?.toLowerCase().includes('bem-vind')) {
                    const companyExists = companies.some(c => c.id === data.codigo || c.name.toLowerCase() === data.empresa.toLowerCase());
                    if (!companyExists) {
                        const newCompany: Company = { id: data.codigo, name: data.empresa };
                        setCompanies(prev => [...prev, newCompany]);
                    } else {
                        setCompanies(prev => prev.map(c => c.id === data.codigo ? { ...c, name: data.empresa } : c));
                    }
                    
                    const companyManagerUser: User = {
                        id: `manager-${email}`,
                        name: data.nome,
                        email: email,
                        phone: data.telefone,
                        profilePictureUrl: data.foto,
                        role: Roles.COMPANY,
                        companyId: data.codigo,
                        position: 'Gestor da Empresa',
                        approved: true,
                    };

                    let nextUsers = [...users];
                    const userExists = nextUsers.some(u => u.email === email);
                    if (userExists) {
                        nextUsers = nextUsers.map(u => u.email === email ? { ...u, ...companyManagerUser } : u);
                    } else {
                        nextUsers.push(companyManagerUser);
                    }

                    setCurrentUser(companyManagerUser);

                    try {
                        const [collaboratorsRes, leadsRes, unqualifiedLeadsRes, inProgressLeadsRes, finalizedLeadsRes] = await Promise.all([
                            fetch('https://webhook.triad3.io/webhook/prospectai-getcolaboradores'),
                            fetch('https://webhook.triad3.io/webhook/prospectai-getleads'),
                            fetch('https://webhook.triad3.io/webhook/prospectai-getleadsnaoqualificados'),
                            fetch('https://webhook.triad3.io/webhook/prospectai-leadsematendimento'),
                            fetch('https://webhook.triad3.io/webhook/prospectai-finalizados'),
                        ]);

                        let companyCollaborators: ExternalCollaborator[] = [];
                        if (collaboratorsRes.ok) {
                            const allCollaborators: ExternalCollaborator[] = await collaboratorsRes.json();
                            companyCollaborators = allCollaborators.filter(c => c.empresa.toLowerCase() === data.empresa.toLowerCase());
                            
                            const internalCollaborators = companyCollaborators.map(extCollab => ({
                                id: `collab-${extCollab.email}`,
                                name: extCollab.nome,
                                email: extCollab.email,
                                phone: extCollab.telefone,
                                profilePictureUrl: extCollab.foto,
                                role: Roles.COLLABORATOR,
                                companyId: data.codigo,
                                position: 'Colaborador',
                                approved: extCollab.status === 'on',
                            }));

                            const existingEmails = new Set(nextUsers.map(u => u.email));
                            const newCollaborators = internalCollaborators.filter(u => !existingEmails.has(u.email));
                            const updatedUsers = nextUsers.map(existingUser => {
                                const updatedCollaborator = internalCollaborators.find(c => c.email === existingUser.email);
                                return updatedCollaborator ? { ...existingUser, ...updatedCollaborator } : existingUser;
                            });
                            nextUsers = [...updatedUsers, ...newCollaborators];
                        }
                        
                        setUsers(nextUsers);

                        const companyCollaboratorNames = new Set(companyCollaborators.map(c => c.nome.trim().toLowerCase()));
                        const externalLeadsMap = new Map<number, ExternalLead>();

                        const processLeadsResponse = async (res: Response) => {
                            if (res.ok) {
                                const leadStrings: string[] = await res.json();
                                const parsedLeads = leadStrings.map(parseLeadString).filter((l): l is ExternalLead => l !== null);
                                const companyLeads = parsedLeads.filter(l => l.colaborador && companyCollaboratorNames.has(l.colaborador.trim().toLowerCase()));
                                return companyLeads;
                            }
                            return [];
                        };
                        
                        const finalizedLeads = await processLeadsResponse(finalizedLeadsRes);
                        finalizedLeads.forEach(lead => externalLeadsMap.set(lead.id, lead));

                        const inProgressLeads = await processLeadsResponse(inProgressLeadsRes);
                        inProgressLeads.forEach(lead => { if (!externalLeadsMap.has(lead.id)) { externalLeadsMap.set(lead.id, lead); } });
                        
                        const qualifiedLeads = await processLeadsResponse(leadsRes);
                        qualifiedLeads.forEach(lead => { if (!externalLeadsMap.has(lead.id)) { externalLeadsMap.set(lead.id, lead); } });

                        const unqualifiedLeads = await processLeadsResponse(unqualifiedLeadsRes);
                        unqualifiedLeads.forEach(lead => { if (!externalLeadsMap.has(lead.id)) { externalLeadsMap.set(lead.id, lead); } });
                        
                        const allCompanyExternalLeads = Array.from(externalLeadsMap.values());
                        
                        const internalLeads = allCompanyExternalLeads.map(extLead => {
                            const assignee = nextUsers.find(u =>
                                u.role === Roles.COLLABORATOR &&
                                u.companyId === companyManagerUser.companyId &&
                                u.name.trim().toLowerCase() === extLead.colaborador?.trim().toLowerCase()
                            );
                            const assigneeId = assignee ? assignee.id : `unknown-collab-for-${extLead.id}`;
                            return convertExternalToInternalLead(extLead, assigneeId);
                        });
                        setLeads(internalLeads);

                    } catch (fetchError) {
                        console.error("Failed to fetch dashboard data for company manager:", fetchError);
                    }

                    return { user: companyManagerUser, error: null };
                } else {
                    return { user: null, error: data.resposta || "Usuário ou senha incorretos. Por favor, tente novamente." };
                }
            } catch (error) {
                console.error("Company login error:", error);
                return { user: null, error: "Erro de comunicação com o servidor de autenticação." };
            }
        }
        
        const user = users.find(u => u.email === email);
        
        if (!user) {
             return { user: null, error: "Credenciais inválidas ou conta não encontrada." };
        }

        if (!user.approved) {
            return { user: null, error: "Sua conta está pendente de aprovação por um administrador." };
        }
        
        if (user.role !== intendedRole) {
            const roleMap = {
                [Roles.ADMIN]: 'Administrador',
                [Roles.COLLABORATOR]: 'Colaborador',
                [Roles.COMPANY]: 'Gestor',
                [Roles.GROUP_MANAGER]: 'Gestor de Grupo',
            };
            const correctAccessType = roleMap[user.role] || 'correto';
            return { user: null, error: `Credenciais inválidas para este tipo de acesso. Tente o acesso de ${correctAccessType}.` };
        }

        // NOTE: In a real app, password check (bcrypt) would happen here.
        setCurrentUser(user);
        return { user, error: null };
    }, [users, companies]);

    const logout = () => {
        setCurrentUser(null);
    };

    const signUp = useCallback((userData: Omit<User, 'id' | 'approved'| 'role' | 'profilePictureUrl'> & { role: UserRole, companyCode?: string }) => {
        if (users.some(u => u.email === userData.email)) {
            return "Já existe uma conta com este e-mail.";
        }
        
        let companyId = userData.companyId;
        if (userData.role === Roles.COLLABORATOR) {
            if (!userData.companyCode) return "O código da empresa é obrigatório para colaboradores.";
            const company = companies.find(c => c.id === userData.companyCode);
            if (!company) return "Código da empresa inválido.";
            companyId = company.id;
        } else if (userData.role === Roles.COMPANY) {
             const newCompanyId = `comp-${Date.now()}`;
             const newCompany: Company = { id: newCompanyId, name: userData.name };
             setCompanies(prev => [...prev, newCompany]);
             companyId = newCompanyId;
        }

        const newUser: User = {
            ...userData,
            id: `user-${Date.now()}`,
            approved: userData.role === Roles.ADMIN,
            companyId,
            profilePictureUrl: undefined,
        };
        setUsers(prev => [...prev, newUser]);
        return "Conta criada com sucesso! Ela estará ativa após a aprovação do administrador.";
    }, [users, companies]);

    const addCompanyManager = useCallback((managerData: Omit<User, 'id' | 'approved' | 'role' | 'companyId' | 'position' | 'profilePictureUrl'>) => {
        if (!currentUser || currentUser.role !== Roles.COMPANY) {
            return "Apenas gestores da empresa podem adicionar novos gestores.";
        }
        if (users.some(u => u.email === managerData.email)) {
            return "Já existe uma conta com este e-mail.";
        }
        
        const newManager: User = {
            ...managerData,
            id: `user-${Date.now()}`,
            approved: true,
            role: Roles.COMPANY,
            companyId: currentUser.companyId,
            position: 'Gestor da Empresa',
            profilePictureUrl: undefined,
        };
        
        setUsers(prev => [...prev, newManager]);
        return "Novo gestor adicionado com sucesso!";
    }, [currentUser, users]);

    const approveUser = (userId: string) => {
        setUsers(users.map(u => u.id === userId ? { ...u, approved: true } : u));
    };
    
    const updateUser = (updatedUser: User) => {
        setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    };

    const deleteUser = (userId: string) => {
        setUsers(users.filter(u => u.id !== userId));
    };
    
    const addCompany = (companyName: string) => {
        const newCompany: Company = { id: `comp-${Date.now()}`, name: companyName };
        setCompanies(prev => [...prev, newCompany]);
    };

    const updateCompanyAndManager = (companyId: string, newName: string, newManagerId: string | null, businessGroupId: string | null) => {
        // Update company name and group
        setCompanies(prev => prev.map(c => c.id === companyId ? { ...c, name: newName, businessGroupId: businessGroupId || undefined } : c));
        
        setUsers(prevUsers => {
            const currentManager = prevUsers.find(u => u.companyId === companyId && u.role === Roles.COMPANY);

            if (currentManager?.id === newManagerId) {
                return prevUsers;
            }

            return prevUsers.map(user => {
                // Case 1: This user is the old manager and needs to be demoted.
                if (currentManager && user.id === currentManager.id && user.id !== newManagerId) {
                    return { ...user, role: Roles.COLLABORATOR, position: 'Colaborador' };
                }

                // Case 2: This user is the new manager and needs to be promoted.
                if (newManagerId && user.id === newManagerId) {
                    return { ...user, role: Roles.COMPANY, position: 'Gestor da Empresa', companyId: companyId };
                }
                
                // Case 3: This user is not affected.
                return user;
            });
        });
    };

    const deleteCompany = (companyId: string) => {
        setCompanies(companies.filter(c => c.id !== companyId));
        setUsers(users.filter(u => u.companyId !== companyId));
    };
    
    const addBusinessGroup = (groupName: string) => {
        const newGroup: BusinessGroup = { id: `group-${Date.now()}`, name: groupName };
        setBusinessGroups(prev => [...prev, newGroup]);
    };

    const updateBusinessGroup = (groupId: string, newName: string) => {
        setBusinessGroups(prev => prev.map(g => g.id === groupId ? { ...g, name: newName } : g));
    };

    const deleteBusinessGroup = (groupId: string) => {
        setBusinessGroups(prev => prev.filter(g => g.id !== groupId));
        // Unassign companies from this group
        setCompanies(prev => prev.map(c => c.businessGroupId === groupId ? { ...c, businessGroupId: undefined } : c));
    };

    const setGroupCompanies = (groupId: string, companyIds: string[]) => {
        setCompanies(prevCompanies => 
            prevCompanies.map(company => {
                if (companyIds.includes(company.id)) {
                    // This company should be in the group.
                    return { ...company, businessGroupId: groupId };
                } else if (company.businessGroupId === groupId) {
                    // This company was in the group, but is not anymore.
                    return { ...company, businessGroupId: undefined };
                }
                // This company is not affected.
                return company;
            })
        );
    };

    const assignGroupManager = (groupId: string, newManagerId: string | null) => {
        setUsers(prevUsers => {
            const currentManager = prevUsers.find(u => u.businessGroupId === groupId && u.role === Roles.GROUP_MANAGER);

            if (currentManager?.id === newManagerId) {
                return prevUsers;
            }

            return prevUsers.map(user => {
                // Case 1: Revert old manager if they are being replaced or removed.
                if (currentManager && user.id === currentManager.id && user.id !== newManagerId) {
                    return { ...user, role: Roles.COMPANY, businessGroupId: undefined, position: 'Gestor da Empresa' };
                }

                // Case 2: Promote new manager.
                if (newManagerId && user.id === newManagerId) {
                    return { ...user, role: Roles.GROUP_MANAGER, businessGroupId: groupId, position: 'Diretor de Operações' };
                }
                
                // Case 3: User is not affected.
                return user;
            });
        });
    };

    const updateLead = (updatedLead: Lead) => {
        setLeads(leads.map(l => l.id === updatedLead.id ? updatedLead : l));
    };

    const requestProof = (leadId: string) => {
        setLeads(prevLeads => prevLeads.map(l => l.id === leadId ? { ...l, proofRequested: true } : l));
    };
    
    const reassignLead = (leadId: string, newAssigneeId: string) => {
        setLeads(prevLeads => prevLeads.map(l => {
            if (l.id === leadId) {
                const historyEntry = {
                    from: l.assignedTo,
                    to: newAssigneeId,
                    date: new Date().toISOString(),
                };
                return {
                    ...l,
                    assignedTo: newAssigneeId,
                    reassignmentHistory: [...(l.reassignmentHistory || []), historyEntry]
                };
            }
            return l;
        }));
    };

    const getCompanyById = (id: string) => companies.find(c => c.id === id);
    const getUserById = (id: string) => users.find(u => u.id === id);
    const getBusinessGroupById = (id: string) => businessGroups.find(g => g.id === id);

    const updateCurrentUserProfile = async (data: Partial<Pick<User, 'name' | 'password' | 'profilePictureUrl'>>): Promise<string> => {
        if (!currentUser) return "Nenhum usuário logado.";

        // If the user is an admin AND it's a profile (name/photo) update
        if (currentUser.role === Roles.ADMIN && (data.name !== undefined || data.profilePictureUrl !== undefined)) {
            try {
                const response = await fetch('https://webhook.triad3.io/webhook/edit-admprospectai', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: currentUser.email,
                        nome: data.name ?? currentUser.name,
                        foto: data.profilePictureUrl ?? currentUser.profilePictureUrl,
                    }),
                });

                const result = await response.json();

                if (response.ok && result.resposta?.includes('sucesso')) {
                    const updatedUser = { ...currentUser, ...data };
                    setUsers(prevUsers => prevUsers.map(u => u.id === currentUser.id ? updatedUser : u));
                    setCurrentUser(updatedUser);
                    return result.resposta;
                } else {
                    return result.resposta || "Falha ao atualizar o perfil do administrador.";
                }
            } catch (error) {
                console.error("Admin profile update error:", error);
                return "Erro de comunicação ao atualizar o perfil.";
            }
        }
        
        // For non-admin profile updates or password changes for any user
        const updatedUser = { ...currentUser, ...data };
        setUsers(prevUsers => prevUsers.map(u => u.id === currentUser.id ? updatedUser : u));
        setCurrentUser(updatedUser);
        
        return "Perfil atualizado com sucesso!";
    };
    
    const changeAdminPassword = async (oldPassword: string, newPassword: string): Promise<string> => {
        if (!currentUser || currentUser.role !== Roles.ADMIN) {
            throw new Error("Apenas administradores podem usar esta função.");
        }
        
        const response = await fetch('https://webhook.triad3.io/webhook/mudar-senha-adm-prospectai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: currentUser.email,
                senha_antiga: oldPassword,
                nova_senha: newPassword,
            }),
        });
    
        const result = await response.json();
    
        if (response.ok && result.resposta?.toLowerCase().includes('sucesso')) {
            return result.resposta;
        } else {
            throw new Error(result.resposta || "Falha ao alterar a senha. Tente novamente.");
        }
    };
    
    const openPhotoViewer = (url: string) => setViewingPhotoUrl(url);
    const closePhotoViewer = () => setViewingPhotoUrl(null);

    return (
        <AppContext.Provider value={{
            currentUser, login, logout, signUp,
            users, companies, leads, businessGroups,
            externalCompanies, externalLeads, externalUnqualifiedLeads, externalBusinessGroups, externalCollaborators, loginLogs,
            approveUser, updateUser, deleteUser,
            addCompany, updateCompanyAndManager, deleteCompany,
            addBusinessGroup, updateBusinessGroup, deleteBusinessGroup, setGroupCompanies, assignGroupManager,
            updateLead, getCompanyById, getUserById, getBusinessGroupById,
            addCompanyManager, requestProof, reassignLead,
            updateCurrentUserProfile,
            changeAdminPassword,
            openPhotoViewer,
        }}>
            {children}
            {viewingPhotoUrl && <PhotoViewer src={viewingPhotoUrl} onClose={closePhotoViewer} />}
        </AppContext.Provider>
    );
};


// ROUTING & LAYOUT
const ProtectedRoute = ({ children, allowedRoles }: { children: JSX.Element, allowedRoles: UserRole[] }) => {
    const { currentUser } = useAppContext();
    if (!currentUser) {
        return <Navigate to="/" replace />;
    }
    if (!allowedRoles.includes(currentUser.role)) {
        // Instead of redirecting to home, maybe show an "Unauthorized" page
        // For now, home redirect is fine.
        return <Navigate to="/" replace />;
    }
    return children;
};

const Header = () => {
    const { currentUser, logout, openPhotoViewer } = useAppContext();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        setDropdownOpen(false);
        logout();
        navigate('/');
    };

    const goToProfile = () => {
        setDropdownOpen(false);
        navigate('/profile');
    };
    
    const getInitials = (name: string) => {
        if (!name) return '';
        return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    }

    return (
         <header className="bg-card/80 backdrop-blur-sm sticky top-0 z-40 shadow-md shadow-black/20 border-b border-border p-4 flex justify-between items-center text-text">
            <div className="flex items-center gap-4">
                <Logo className="h-12 w-12 rounded-full object-cover filter drop-shadow-[0_0_4px_rgba(0,209,255,0.7)] transition-all duration-300 hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(0,209,255,1)]"/>
                <div>
                    <h1 className="text-xl font-bold tracking-wider text-text">PROSPECTAI</h1>
                    <p className="text-xs font-semibold tracking-wider text-primary/80 -mt-1">by TRIAD3</p>
                </div>
            </div>
            {location.pathname !== '/' && (
                <div className="flex items-center gap-4">
                    {currentUser ? (
                        <div className="relative" ref={dropdownRef}>
                            <button onClick={() => setDropdownOpen(o => !o)} className="flex items-center gap-3 rounded-full p-1 hover:bg-background/50 transition-colors">
                                <div className="flex-shrink-0">
                                    {currentUser.profilePictureUrl ? (
                                        <img 
                                            src={currentUser.profilePictureUrl} 
                                            alt="User Avatar" 
                                            className="h-10 w-10 rounded-full object-cover cursor-pointer" 
                                            onClick={(e) => { 
                                                e.stopPropagation(); 
                                                if (currentUser.profilePictureUrl) {
                                                    openPhotoViewer(currentUser.profilePictureUrl);
                                                }
                                            }}
                                        />
                                    ) : (
                                        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-background font-bold text-md">
                                            {getInitials(currentUser.name)}
                                        </div>
                                    )}
                                </div>
                                <div className="text-left hidden md:block">
                                    <p className="font-semibold text-text text-sm leading-tight">{currentUser.name}</p>
                                    <p className="text-xs text-text-secondary leading-tight">{currentUser.position}</p>
                                </div>
                            </button>
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-card rounded-md shadow-lg py-1 z-50 border border-border">
                                    <a onClick={goToProfile} className="cursor-pointer block w-full text-left px-4 py-2 text-sm text-text-secondary hover:bg-background hover:text-text transition-colors">Meu Perfil</a>
                                    <div className="border-t border-border my-1"></div>
                                    <a onClick={handleLogout} className="cursor-pointer block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-background hover:text-red-300 transition-colors">Sair</a>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button 
                            onClick={() => navigate('/')} 
                            className="border border-primary text-primary px-4 py-2 rounded-md text-sm font-semibold hover:bg-primary hover:text-background hover:shadow-glow-primary transition-all duration-300"
                        >
                            Login
                        </button>
                    )}
                </div>
            )}
        </header>
    );
}

const Footer = () => (
    <footer className="text-center p-4 text-xs text-text-secondary border-t border-border">
        Powered By: Triad3 Inteligência Digital
    </footer>
);

const MainLayout = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen flex flex-col bg-background text-text">
        <Header />
        <main className="flex-grow p-4 md:p-6 lg:p-8">
            {children}
        </main>
        <Footer />
    </div>
);


// Main App Component
const App = () => {
    return (
        <AppProvider>
            <HashRouter>
                <MainLayout>
                    <Routes>
                        <Route path="/" element={<AuthPage />} />
                         <Route
                            path="/profile"
                            element={
                                <ProtectedRoute allowedRoles={[Roles.ADMIN, Roles.COLLABORATOR, Roles.COMPANY, Roles.GROUP_MANAGER]}>
                                    <ProfilePage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin"
                            element={
                                <ProtectedRoute allowedRoles={[Roles.ADMIN]}>
                                    <AdminPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/prospecting"
                            element={
                                <ProtectedRoute allowedRoles={[Roles.COLLABORATOR]}>
                                    <ProspectingPage />
                                </ProtectedRoute>
                            }
                        />
                         <Route
                            path="/company-dashboard"
                            element={
                                <ProtectedRoute allowedRoles={[Roles.COMPANY]}>
                                    <CompanyDashboard />
                                </ProtectedRoute>
                            }
                        />
                         <Route
                            path="/group-dashboard"
                            element={
                                <ProtectedRoute allowedRoles={[Roles.GROUP_MANAGER]}>
                                    <GroupDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </MainLayout>
            </HashRouter>
        </AppProvider>
    );
};

export default App;
