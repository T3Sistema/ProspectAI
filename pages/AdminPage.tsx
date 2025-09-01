import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useAppContext } from '../App';
import { User, Company, UserRole, BusinessGroup, ExternalCompany, ExternalLead, ExternalBusinessGroup, ExternalCollaborator, LoginLog, Lead } from '../types';

const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

// --- NOVOS ÍCONES PARA O DASHBOARD ---
const FilterIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
);
const BroomIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19.4 11.6 18.2 21H6.8l-1.2-9.4"/><path d="m2 11.6 4.3-8.8c.2-.4.6-.6 1-.6h9.4c.4 0 .8.2 1 .6L22 11.6"/><path d="M12 2v2.6"/><path d="M10 11.6V21"/><path d="M14 11.6V21"/></svg>
);
const ArrowLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
);
const ChartBarIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" x2="12" y1="20" y2="10"></line><line x1="18" x2="18" y1="20" y2="4"></line><line x1="6" x2="6" y1="20" y2="16"></line></svg>
);
const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);
const XCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
);
const UsersIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);
const FileTextIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
);
const ViewIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
    </svg>
);


const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-md' }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; maxWidth?: string }) => {
    if (!isOpen) return null;

    const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
    };

    useEffect(() => {
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4" aria-modal="true" role="dialog" onClick={onClose}>
            <div className={`bg-card rounded-lg shadow-xl w-full ${maxWidth} border border-border`} onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b border-border">
                    <h2 className="text-xl font-bold text-primary">{title}</h2>
                    <button onClick={onClose} className="text-text-secondary hover:text-text p-1 rounded-full" aria-label="Fechar modal">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
            </div>
        </div>
    );
};

// --- NOVA FUNCIONALIDADE DE VISUALIZAÇÃO DE EMPRESAS EXTERNAS ---

const ExternalCompanies = ({ onViewCompany }: { onViewCompany: (company: ExternalCompany) => void; }) => {
    const { externalCompanies } = useAppContext();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const getInitials = (name: string) => {
        if (!name) return '';
        return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    }

    if (loading) {
        return <div className="text-center text-text-secondary py-10">Carregando empresas...</div>;
    }

    if (error) {
        return <div className="text-center text-red-400 py-10">Erro: {error}</div>;
    }

    if (externalCompanies.length === 0) {
        return <div className="text-center text-text-secondary py-10">Nenhuma empresa encontrada. Os dados são carregados no login.</div>;
    }

    return (
        <div className="bg-card p-6 rounded-lg shadow-lg border border-border">
            <h2 className="text-2xl font-semibold mb-6 text-primary">Empresas Cadastradas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {externalCompanies.map(company => (
                    <div key={company.id} onClick={() => onViewCompany(company)} className="bg-background p-5 rounded-lg border border-border transition-all duration-300 hover:border-primary hover:shadow-glow-primary-light cursor-pointer space-y-4 flex flex-col">
                        <div className="flex justify-between items-start gap-4">
                            <div className="flex items-center gap-3 flex-grow min-w-0">
                                {company.logo ? (
                                    <img src={company.logo} alt={`Logo da empresa ${company.empresa}`} loading="lazy" className="h-12 w-12 rounded-full object-cover flex-shrink-0" />
                                ) : (
                                    <div className="h-12 w-12 rounded-full bg-border flex items-center justify-center text-text-secondary flex-shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>
                                    </div>
                                )}
                                <h3 className="text-lg font-bold text-text break-words">{company.empresa}</h3>
                            </div>
                            <span className={`px-3 py-1 text-xs font-bold rounded-full text-white flex-shrink-0 ${company.status === 'on' ? 'bg-green-500' : 'bg-red-500'}`}>
                                {company.status === 'on' ? 'ON' : 'OFF'}
                            </span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                             {company.foto ? (
                                <img src={company.foto} alt={company.nome} className="h-10 w-10 rounded-full object-cover" />
                             ) : (
                                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                    {getInitials(company.nome)}
                                </div>
                             )}
                            <div>
                                <p className="font-semibold text-text-secondary text-sm">Gestor</p>
                                <p className="font-bold text-text">{company.nome}</p>
                            </div>
                        </div>

                        <div>
                            <p className="font-semibold text-text-secondary text-sm">Localização</p>
                            <p className="text-sm text-text">{company.bairro}, {company.cidade} - {company.estado}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
// --- FIM DA NOVA FUNCIONALIDADE ---

const StatCard = ({ title, value, icon }: { title: string, value: string | number, icon: React.ReactNode }) => (
    <div className="bg-card p-6 rounded-lg shadow-lg border border-border flex items-center gap-6">
        <div className="text-primary bg-primary/10 p-4 rounded-full">
            {icon}
        </div>
        <div>
            <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider">{title}</h3>
            <p className="mt-1 text-4xl font-bold text-text">{value}</p>
        </div>
    </div>
);

const getStatusLabel = (status: Lead['status']) => {
    switch (status) {
        case 'new': return 'Novo';
        case 'contacted': return 'Contactado';
        case 'scheduled': return 'Agendado';
        case 'not_converted': return 'Não Convertido';
        case 'converted': return 'Convertido';
        default: return status;
    }
}

const getStatusClass = (status: Lead['status']) => {
    switch (status) {
        case 'new': return 'bg-blue-500/20 text-blue-300';
        case 'contacted': return 'bg-yellow-500/20 text-yellow-300';
        case 'scheduled': return 'bg-cyan-500/20 text-cyan-300';
        case 'not_converted': return 'bg-red-500/20 text-red-300';
        case 'converted': return 'bg-green-500/20 text-green-300';
        default: return 'bg-gray-500/20 text-gray-300';
    }
};

const LeadDetailModal = ({ lead, onClose }: { lead: Lead | null; onClose: () => void; }) => {
    const { getUserById, openPhotoViewer } = useAppContext();
    if (!lead) return null;

    const collaborator = getUserById(lead.assignedTo);
    
    return (
        <Modal isOpen={!!lead} onClose={onClose} title={`Detalhes do Lead: ${lead.name || lead.phone}`} maxWidth="max-w-2xl">
            {lead && (
                <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm p-4 bg-background rounded-lg border border-border">
                        <div>
                            <p className="font-semibold text-text-secondary">Status</p>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(lead.status)}`}>{getStatusLabel(lead.status)}</span>
                        </div>
                        <div>
                            <p className="font-semibold text-text-secondary">Colaborador</p>
                            <p className="font-medium text-text">{collaborator?.name || 'N/A'}</p>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <p className="font-semibold text-text-secondary">Recebido em</p>
                            <p className="font-medium text-text">{new Date(lead.receivedAt).toLocaleString('pt-BR')}</p>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold text-primary mb-2">Detalhes Iniciais</h4>
                        <div className="bg-background border border-border p-4 rounded-lg max-h-48 overflow-y-auto">
                            <p className="text-text whitespace-pre-wrap text-sm">{lead.details || 'Nenhum detalhe inicial fornecido.'}</p>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-primary mb-2">Histórico de Atendimento</h4>
                        {lead.feedbacks.length > 0 ? (
                            <ul className="space-y-3 text-sm max-h-64 overflow-y-auto pr-2">
                                {lead.feedbacks.map(fb => {
                                    const proofUrls = fb.proofUrl ? fb.proofUrl.split(',') : [];
                                    return (
                                        <li key={fb.id} className="p-3 bg-background rounded-md border border-border text-text-secondary">
                                            <p className="mb-2">
                                                <span className="font-semibold text-text/90">{new Date(fb.createdAt).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year:'numeric', hour: '2-digit', minute: '2-digit' })}:</span> {fb.text}
                                            </p>
                                            {proofUrls.length > 0 && (
                                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2">
                                                    {proofUrls.map((url, index) => (
                                                        <img 
                                                            key={index}
                                                            src={url}
                                                            alt={`Comprovante ${index + 1}`}
                                                            className="aspect-square w-full object-cover rounded-md cursor-pointer transition-transform hover:scale-105"
                                                            onClick={() => openPhotoViewer(url)}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <div className="bg-background border border-border p-4 rounded-lg text-center">
                                <p className="text-text-secondary">Nenhum feedback registrado para este lead.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </Modal>
    );
};


const AdminCompanyView = ({ company, onBack }: { company: ExternalCompany; onBack: () => void; }) => {
    const { users, leads, getUserById, openPhotoViewer } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [collaboratorFilter, setCollaboratorFilter] = useState('');
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);


    const companyData = useMemo(() => {
        const companyUsers = users.filter(u => u.companyId === company.codigo);
        const companyCollaborators = companyUsers.filter(u => u.role === UserRole.COLLABORATOR);
        const companyCollaboratorIds = companyCollaborators.map(u => u.id);

        const allCompanyLeads = leads.filter(l => companyCollaboratorIds.includes(l.assignedTo));

        const qualifiedLeads = allCompanyLeads.filter(l => l.status === 'converted').length;
        const unqualifiedLeads = allCompanyLeads.filter(l => l.status === 'not_converted').length;

        const employeesWithStats = companyCollaborators.map(employee => {
            const employeeLeads = allCompanyLeads.filter(lead => lead.assignedTo === employee.id);
            const qualified = employeeLeads.filter(l => l.status === 'converted').length;
            const unqualified = employeeLeads.filter(l => l.status === 'not_converted').length;
            const totalFinished = qualified + unqualified;
            const conversionRate = totalFinished > 0 ? (qualified / totalFinished) * 100 : 0;
            return { ...employee, leadCount: employeeLeads.length, conversionRate, qualified, unqualified };
        });

        return {
            employees: employeesWithStats,
            allLeads: allCompanyLeads,
            totalLeads: allCompanyLeads.length,
            qualifiedLeads,
            unqualifiedLeads,
        };
    }, [company, users, leads]);
    
    const filteredLeads = useMemo(() => {
        return companyData.allLeads.filter(lead => {
            const collaborator = getUserById(lead.assignedTo);
            const searchTermLower = searchTerm.toLowerCase();

            const searchMatch = !searchTerm ||
                lead.name?.toLowerCase().includes(searchTermLower) ||
                lead.phone.toLowerCase().includes(searchTermLower) ||
                collaborator?.name.toLowerCase().includes(searchTermLower);

            const statusMatch = !statusFilter || lead.status === statusFilter;
            const collaboratorMatch = !collaboratorFilter || lead.assignedTo === collaboratorFilter;

            return searchMatch && statusMatch && collaboratorMatch;
        }).sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime());
    }, [companyData.allLeads, searchTerm, statusFilter, collaboratorFilter, getUserById]);

    const getInitials = (name: string) => !name ? '' : name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

    const selectStyle = "w-full bg-background border border-border text-text rounded-md py-2 px-3 transition-colors focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/40";


    return (
        <div className="space-y-6 animate-zoom-in">
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 rounded-full bg-card hover:bg-border text-text-secondary hover:text-primary transition-colors">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <div>
                    <h1 className="text-4xl font-bold text-text">Visão da Empresa: <span className="text-primary">{company.empresa}</span></h1>
                    <p className="text-md text-text-secondary">Dashboard como visto pelo gestor.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Colaboradores" value={companyData.employees.length} icon={<UsersIcon className="h-8 w-8" />} />
                <StatCard title="Total de Leads" value={companyData.totalLeads} icon={<FileTextIcon className="h-8 w-8" />} />
                <StatCard title="Leads Qualificados" value={companyData.qualifiedLeads} icon={<CheckCircleIcon className="h-8 w-8 text-green-400" />} />
                <StatCard title="Leads Não Qualificados" value={companyData.unqualifiedLeads} icon={<XCircleIcon className="h-8 w-8 text-red-400" />} />
            </div>

            <div className="bg-card p-6 rounded-lg shadow-lg border border-border">
                <h2 className="text-2xl font-semibold mb-6 text-primary">Desempenho da Equipe</h2>
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                    {companyData.employees.length > 0 ? companyData.employees.map(employee => (
                        <div key={employee.id} className="p-4 bg-background rounded-lg border border-border">
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                <div className="flex items-center gap-4">
                                    {employee.profilePictureUrl ? (
                                        <img src={employee.profilePictureUrl} alt={employee.name} className="h-12 w-12 rounded-full object-cover"/>
                                    ) : (
                                        <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">{getInitials(employee.name)}</div>
                                    )}
                                    <div>
                                        <h4 className="text-lg font-bold text-text">{employee.name}</h4>
                                        <p className="text-sm text-text-secondary">{employee.position}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 flex-shrink-0">
                                    <div className="text-center">
                                        <p className="text-sm text-text-secondary">Leads</p>
                                        <p className="font-bold text-lg text-text">{employee.leadCount}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm text-text-secondary">Conversão</p>
                                        <p className="font-bold text-lg text-green-400">{employee.conversionRate.toFixed(0)}%</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 space-y-2">
                                <div className="flex justify-between text-xs text-text-secondary">
                                    <p>Qualificados: {employee.qualified}</p>
                                    <p>Não Qualificados: {employee.unqualified}</p>
                                </div>
                                <div className="w-full bg-border rounded-full h-2.5 flex">
                                    <div className="bg-green-500 h-2.5 rounded-l-full" style={{ width: `${employee.conversionRate}%` }}></div>
                                    <div className="bg-red-500 h-2.5 rounded-r-full" style={{ width: `${100 - employee.conversionRate}%` }}></div>
                                </div>
                            </div>
                        </div>
                    )) : <p className="text-center text-text-secondary py-8">Nenhum colaborador encontrado para esta empresa.</p>}
                </div>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-lg border border-border">
                <h2 className="text-2xl font-semibold mb-6 text-primary">Leads da Empresa ({filteredLeads.length})</h2>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-background rounded-lg border border-border">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar por nome, telefone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-background border border-border text-text rounded-md py-2 pl-10 pr-3 transition-colors focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/40"
                        />
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                    </div>
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className={selectStyle}>
                        <option value="">Filtrar por Status</option>
                        <option value="new">Novo</option>
                        <option value="contacted">Contactado</option>
                        <option value="scheduled">Agendado</option>
                        <option value="converted">Convertido</option>
                        <option value="not_converted">Não Convertido</option>
                    </select>
                    <select value={collaboratorFilter} onChange={e => setCollaboratorFilter(e.target.value)} className={selectStyle}>
                        <option value="">Filtrar por Colaborador</option>
                        {companyData.employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                    </select>
                </div>
                
                <div className="overflow-x-auto max-h-[600px] border border-border rounded-lg">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-background text-text-secondary uppercase sticky top-0">
                            <tr>
                                <th className="p-3">Lead</th>
                                <th className="p-3">Colaborador</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Data</th>
                                <th className="p-3 text-center">Ações</th>
                            </tr>
                        </thead>
                         <tbody className="bg-card">
                             {filteredLeads.length > 0 ? filteredLeads.map(lead => (
                                <tr key={lead.id} className="border-t border-border/50">
                                    <td className="p-3 font-medium text-text">{lead.name || lead.phone}</td>
                                    <td className="p-3 text-text-secondary">{getUserById(lead.assignedTo)?.name || 'N/A'}</td>
                                    <td className="p-3"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(lead.status)}`}>{getStatusLabel(lead.status)}</span></td>
                                    <td className="p-3 text-text-secondary">{new Date(lead.receivedAt).toLocaleDateString('pt-BR')}</td>
                                    <td className="p-3 text-center">
                                        <button onClick={() => setSelectedLead(lead)} className="p-2 rounded-md bg-primary/20 text-primary hover:bg-primary/30 transition-colors" aria-label="Ver detalhes do lead">
                                            <ViewIcon />
                                        </button>
                                    </td>
                                </tr>
                             )) : (
                                <tr><td colSpan={5} className="p-8 text-center text-text-secondary">Nenhum lead encontrado com os filtros atuais.</td></tr>
                             )}
                        </tbody>
                    </table>
                </div>
            </div>

            <LeadDetailModal lead={selectedLead} onClose={() => setSelectedLead(null)} />
        </div>
    );
};


const AdminPage = () => {
    const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
    const [viewingCompany, setViewingCompany] = useState<ExternalCompany | null>(null);
    
    type AdminTab = 'dashboard' | 'approvals' | 'companies' | 'groups' | 'users' | 'logs';

    const TabButton = ({ tabId, children }: { tabId: AdminTab; children: React.ReactNode }) => (
        <button
            onClick={() => setActiveTab(tabId)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === tabId
                    ? 'bg-primary text-background shadow-glow-primary-light'
                    : 'text-text-secondary hover:bg-card hover:text-text'
            }`}
        >
            {children}
        </button>
    );
    
    if (viewingCompany) {
        return <AdminCompanyView company={viewingCompany} onBack={() => setViewingCompany(null)} />;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-4xl font-bold text-text">Painel do Administrador</h1>
            <div className="flex space-x-2 border-b border-border pb-2 flex-wrap gap-y-2">
                <TabButton tabId="dashboard">Dashboard</TabButton>
                <TabButton tabId="companies">Empresas</TabButton>
                <TabButton tabId="approvals">Aprovações</TabButton>
                <TabButton tabId="groups">Grupos Empresariais</TabButton>
                <TabButton tabId="users">Colaboradores</TabButton>
                <TabButton tabId="logs">Logs</TabButton>
            </div>
            <div className="pt-4">
                {activeTab === 'dashboard' && <AdminDashboard />}
                {activeTab === 'approvals' && <Approvals />}
                {activeTab === 'companies' && <ExternalCompanies onViewCompany={setViewingCompany} />}
                {activeTab === 'groups' && <ManageBusinessGroups />}
                {activeTab === 'users' && <ManageExternalCollaborators />}
                {activeTab === 'logs' && <LogsViewer />}
            </div>
        </div>
    );
};



// --- INÍCIO DAS NOVAS FUNCIONALIDADES DO DASHBOARD ---

const DropdownCheckbox = ({ label, options, selected, onToggle }: { label: string; options: string[]; selected: Record<string, boolean>; onToggle: (option: string) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedCount = Object.values(selected).filter(Boolean).length;
    const buttonText = selectedCount > 0 ? `${label} (${selectedCount})` : label;

    return (
        <div className="relative flex-grow" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-background border border-border text-text rounded-md py-2 px-3 text-left transition-colors focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/40 flex justify-between items-center"
            >
                {buttonText}
                <svg className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-card border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {options.map(option => (
                        <label key={option} className="flex items-center px-4 py-2 text-sm text-text-secondary hover:bg-background cursor-pointer">
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded bg-background border-border text-primary focus:ring-primary"
                                checked={!!selected[option]}
                                onChange={() => onToggle(option)}
                            />
                            <span className="ml-3">{option}</span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
};

const CompanyDetailsModal = ({ company, leads, internalUsers, internalCompanies, onClose }: { company: ExternalCompany | null; leads: ExternalLead[]; internalUsers: User[]; internalCompanies: Company[]; onClose: () => void }) => {
    if (!company) return null;

    const modalData = useMemo(() => {
        const companyLeads = leads.filter(l => l.empresa === company.empresa);
        const totalLeads = companyLeads.length;
        // Mock data logic
        const totalDistributed = totalLeads > 2 ? totalLeads - 2 : totalLeads; 
        const distributionPercentage = totalLeads > 0 ? (totalDistributed / totalLeads) * 100 : 0;
        
        const matchedInternalCompany = internalCompanies.find(c => c.id === company.codigo || c.name.toLowerCase() === company.empresa.toLowerCase());
        const employees = matchedInternalCompany ? internalUsers.filter(u => u.companyId === matchedInternalCompany.id) : [];

        const leadsPerEmployee: { name: string; leadCount: number; date: string }[] = [];
        if (employees.length > 0) {
            const baseCount = Math.floor(totalDistributed / employees.length);
            let remainder = totalDistributed % employees.length;
            employees.forEach((emp, index) => {
                let leadCount = baseCount;
                if (remainder > 0) {
                    leadCount++;
                    remainder--;
                }
                leadsPerEmployee.push({ name: emp.name, leadCount, date: `0${index + 1}/08/2025 14:30` });
            });
        }
        
        return { totalLeads, totalDistributed, distributionPercentage, leadsPerEmployee, companyLeads, employees };
    }, [company, leads, internalUsers, internalCompanies]);

    return (
        <div className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex flex-col p-4 sm:p-6 lg:p-8 animate-zoom-in" role="dialog" aria-modal="true" aria-labelledby="company-details-title">
            <div className="bg-card rounded-lg shadow-2xl border border-border flex-grow flex flex-col max-w-5xl w-full mx-auto">
                <header className="p-4 flex justify-between items-center border-b border-border">
                    <h2 id="company-details-title" className="text-xl font-bold text-primary">{company.empresa} - Detalhes dos Leads</h2>
                    <button onClick={onClose} className="text-text-secondary hover:text-primary p-1 rounded-full" aria-label="Fechar modal"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                </header>
                <main className="flex-grow p-6 overflow-y-auto space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-background border border-border p-4 rounded-lg text-center">
                            <h3 className="text-md font-semibold text-text-secondary">Total de Leads Recebidos</h3>
                            <p className="text-4xl font-bold text-primary">{modalData.totalLeads}</p>
                        </div>
                        <div className="bg-background border border-border p-4 rounded-lg">
                            <h3 className="text-md font-semibold text-text-secondary text-center">Leads Distribuídos</h3>
                            <div className="flex items-center justify-center gap-4">
                                <p className="text-4xl font-bold text-primary">{modalData.totalDistributed}</p>
                                <div className="w-full bg-border rounded-full h-4">
                                    <div className={`h-4 rounded-full ${modalData.distributionPercentage === 100 ? 'bg-green-500' : 'bg-yellow-500'}`} style={{ width: `${modalData.distributionPercentage}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-background border border-border p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-primary mb-3">Leads por Funcionário</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-border/50 text-text-secondary uppercase"><tr><th className="p-2">Nome do Funcionário</th><th className="p-2">Qtd. Leads</th><th className="p-2">Distribuição (Mock)</th></tr></thead>
                                <tbody>
                                    {modalData.leadsPerEmployee.length > 0 ? modalData.leadsPerEmployee.map(item => (
                                        <tr key={item.name} className="border-b border-border/30">
                                            <td className="p-2 font-medium text-text">{item.name}</td>
                                            <td className="p-2">{item.leadCount}</td>
                                            <td className="p-2 text-text-secondary">{item.date}</td>
                                        </tr>
                                    )) : <tr><td colSpan={3} className="p-4 text-center text-text-secondary">Nenhum funcionário encontrado.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-background border border-border p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-primary mb-3">Distribuição Detalhada</h3>
                        <div className="overflow-x-auto max-h-64">
                             <table className="w-full text-left text-sm">
                                <thead className="bg-border/50 text-text-secondary uppercase sticky top-0"><tr><th className="p-2">ID Lead</th><th className="p-2">Nome do Lead</th><th className="p-2">Funcionário Atribuído (Mock)</th><th className="p-2">Data (Mock)</th></tr></thead>
                                <tbody>
                                    {modalData.companyLeads.length > 0 ? modalData.companyLeads.map((lead, i) => (
                                        <tr key={lead.id} className="border-b border-border/30">
                                            <td className="p-2 font-mono text-primary/80">#{lead.id}</td>
                                            <td className="p-2 font-medium text-text">{lead.nome}</td>
                                            <td className="p-2 text-text-secondary">{modalData.employees[i % modalData.employees.length]?.name || 'N/A'}</td>
                                            <td className="p-2 text-text-secondary">{lead.data} {lead.horario}</td>
                                        </tr>
                                    )) : <tr><td colSpan={4} className="p-4 text-center text-text-secondary">Nenhum lead distribuído.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
                <footer className="p-4 border-t border-border text-center">
                    <button onClick={onClose} className="bg-primary text-background font-bold py-2 px-6 rounded-md hover:bg-primary-hover transition-colors flex items-center gap-2 mx-auto"><ArrowLeftIcon /> Voltar à Lista de Empresas</button>
                </footer>
            </div>
        </div>
    );
};

const ComparisonModal = ({ isOpen, onClose, data }: { isOpen: boolean, onClose: () => void, data: { name: string, leadCount: number }[] }) => {
    if (!isOpen) return null;
    const maxLeads = Math.max(...data.map(d => d.leadCount), 0);

    return (
         <Modal isOpen={isOpen} onClose={onClose} title="Comparativo de Leads por Empresa" maxWidth="max-w-2xl">
            <div className="space-y-4">
                {data.length > 0 ? data.map(item => (
                    <div key={item.name} className="space-y-1">
                        <div className="flex justify-between items-center text-sm font-semibold">
                            <span className="text-text">{item.name}</span>
                            <span className="text-primary">{item.leadCount} Leads</span>
                        </div>
                        <div className="w-full bg-border rounded-full h-4">
                            <div className="bg-secondary h-4 rounded-full" style={{ width: maxLeads > 0 ? `${(item.leadCount / maxLeads) * 100}%` : '0%' }}></div>
                        </div>
                    </div>
                )) : <p className="text-text-secondary text-center">Nenhuma empresa para comparar com os filtros atuais.</p>}
            </div>
        </Modal>
    );
};

// --- FIM DAS NOVAS FUNCIONALIDADES DO DASHBOARD ---


const AdminDashboard = () => {
    const { users, externalCompanies, externalLeads, externalUnqualifiedLeads, externalBusinessGroups, companies: internalCompanies, externalCollaborators } = useAppContext();
    
    const [selectedCompanyDetails, setSelectedCompanyDetails] = useState<ExternalCompany | null>(null);
    const [isComparisonModalOpen, setComparisonModalOpen] = useState(false);

    const [filters, setFilters] = useState(() => {
        try {
            const saved = localStorage.getItem('adminDashboardFilters_v2');
            return saved ? JSON.parse(saved) : { months: {}, companies: {}, purchaseTypes: {} };
        } catch {
            return { months: {}, companies: {}, purchaseTypes: {} };
        }
    });

    const companyStats = useMemo(() => {
        const stats: Record<string, { total: number; qualified: number; unqualified: number }> = {};

        externalCompanies.forEach(c => {
            stats[c.empresa] = { total: 0, qualified: 0, unqualified: 0 };
        });

        externalLeads.forEach(lead => {
            if (!stats[lead.empresa]) {
                stats[lead.empresa] = { total: 0, qualified: 0, unqualified: 0 };
            }
            stats[lead.empresa].total++;
            stats[lead.empresa].qualified++;
        });

        externalUnqualifiedLeads.forEach(lead => {
            if (!stats[lead.empresa]) {
                stats[lead.empresa] = { total: 0, qualified: 0, unqualified: 0 };
            }
            stats[lead.empresa].total++;
            stats[lead.empresa].unqualified++;
        });

        return stats;
    }, [externalLeads, externalUnqualifiedLeads, externalCompanies]);

    useEffect(() => {
        localStorage.setItem('adminDashboardFilters_v2', JSON.stringify(filters));
    }, [filters]);

    const handleFilterToggle = (filterType: 'months' | 'companies' | 'purchaseTypes', value: string) => {
        setFilters((prev: any) => ({
            ...prev,
            [filterType]: {
                ...prev[filterType],
                [value]: !prev[filterType][value],
            }
        }));
    };

    const filterOptions = useMemo(() => {
        const months = [...new Set(externalLeads.map(lead => {
            const parts = lead.data.split('/');
            return `${parts[2]}-${parts[1]}`;
        }))].sort((a, b) => b.localeCompare(a));
        const companies = [...new Set(externalCompanies.map(c => c.empresa))].sort();
        const purchaseTypes = [...new Set(externalLeads.map(l => l.tipo_compra))].sort();
        return { months, companies, purchaseTypes };
    }, [externalLeads, externalCompanies]);

    const filteredData = useMemo(() => {
        const selectedMonths = Object.keys(filters.months).filter(k => filters.months[k]);
        const selectedCompanies = Object.keys(filters.companies).filter(k => filters.companies[k]);
        const selectedPurchaseTypes = Object.keys(filters.purchaseTypes).filter(k => filters.purchaseTypes[k]);

        const leads = externalLeads.filter(lead => {
            const leadMonth = lead.data ? `${lead.data.split('/')[2]}-${lead.data.split('/')[1]}` : '';
            const monthMatch = selectedMonths.length === 0 || selectedMonths.includes(leadMonth);
            const companyMatch = selectedCompanies.length === 0 || selectedCompanies.includes(lead.empresa);
            const typeMatch = selectedPurchaseTypes.length === 0 || selectedPurchaseTypes.includes(lead.tipo_compra);
            return monthMatch && companyMatch && typeMatch;
        });

        const leadsByCompany = leads.reduce((acc, lead) => {
            acc[lead.empresa] = (acc[lead.empresa] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const companies = externalCompanies
            .filter(c => selectedCompanies.length === 0 || selectedCompanies.includes(c.empresa))
            .map(company => ({
                ...company,
                leadCount: leadsByCompany[company.empresa] || 0,
            }))
            .sort((a, b) => b.leadCount - a.leadCount);
        
        return {
            companies,
            totalLeads: leads.length,
            leadsByCompany,
        };
    }, [externalLeads, externalCompanies, filters]);

    const resetFilters = () => {
        setFilters({ months: {}, companies: {}, purchaseTypes: {} });
    };

    const hasActiveFilters = Object.values(filters).some(group => Object.values(group).some(Boolean));
    const comparisonData = useMemo(() => Object.entries(filteredData.leadsByCompany).map(([name, leadCount]) => ({ name, leadCount })), [filteredData.leadsByCompany]);
    
    const qualifiedLeadsCount = externalLeads.length;
    const unqualifiedLeadsCount = externalUnqualifiedLeads.length;
    const totalLeadsCount = qualifiedLeadsCount + unqualifiedLeadsCount;

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-semibold text-primary">Visão Geral da Plataforma</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <StatCard title="Total de Empresas" value={externalCompanies.length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>} />
                 <StatCard title="Grupos Empresariais" value={externalBusinessGroups.length} icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8"><rect x="3" y="14" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect></svg>} />
                 <StatCard title="Colaboradores" value={externalCollaborators.length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>} />
                 <StatCard title="Total de Leads" value={totalLeadsCount} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>} />
                 <StatCard title="Leads Qualificados" value={qualifiedLeadsCount} icon={<CheckCircleIcon className="h-8 w-8 text-green-400" />} />
                 <StatCard title="Leads Não Qualificados" value={unqualifiedLeadsCount} icon={<XCircleIcon className="h-8 w-8 text-red-400" />} />
            </div>

            <div className="bg-card p-6 rounded-lg shadow-lg border border-border">
                <h3 className="text-xl font-semibold text-primary mb-2">Desempenho por Empresa</h3>
                <p className="text-text-secondary mb-6">Selecione os filtros e clique em uma empresa para ver mais detalhes.</p>
                
                <div className="flex flex-col md:flex-row flex-wrap gap-4 items-end mb-6 p-4 bg-background border border-border rounded-lg">
                    <div className="flex-grow grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <DropdownCheckbox label="Mês" options={filterOptions.months.map(m => new Date(m + '-02').toLocaleString('pt-BR', { month: 'long', year: 'numeric' }))} selected={filterOptions.months.reduce((acc, m) => ({...acc, [new Date(m + '-02').toLocaleString('pt-BR', { month: 'long', year: 'numeric' })]: filters.months[`${m}`]}), {})} onToggle={(opt) => handleFilterToggle('months', filterOptions.months.find(m => new Date(m + '-02').toLocaleString('pt-BR', { month: 'long', year: 'numeric' }) === opt) || '')} />
                        <DropdownCheckbox label="Empresa" options={filterOptions.companies} selected={filters.companies} onToggle={(opt) => handleFilterToggle('companies', opt)} />
                        <DropdownCheckbox label="Tipo de Compra" options={filterOptions.purchaseTypes} selected={filters.purchaseTypes} onToggle={(opt) => handleFilterToggle('purchaseTypes', opt)} />
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <button onClick={resetFilters} disabled={!hasActiveFilters} className="flex-grow sm:flex-grow-0 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md text-text-secondary bg-border hover:bg-border/70 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><BroomIcon /> Limpar</button>
                        <button onClick={() => setComparisonModalOpen(true)} className="flex-grow sm:flex-grow-0 flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold rounded-md text-background bg-secondary hover:opacity-90 transition-all"><ChartBarIcon /> Comparar</button>
                    </div>
                </div>

                <p className="mb-4 text-right text-text-secondary">Mostrando <span className="font-bold text-primary">{filteredData.companies.length}</span> empresas com <span className="font-bold text-primary">{totalLeadsCount}</span> leads correspondentes.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredData.companies.map(company => {
                        const stats = companyStats[company.empresa] || { total: 0, qualified: 0, unqualified: 0 };
                        return (
                        <div key={company.id} onClick={() => setSelectedCompanyDetails(company)} className="bg-background p-5 rounded-lg border border-border transition-all duration-300 hover:border-primary hover:shadow-glow-primary-light cursor-pointer flex flex-col justify-between" role="button" tabIndex={0}>
                            <div>
                                <div className="flex items-center gap-3">
                                    {company.logo ? (
                                        <img src={company.logo} alt={`Logo da empresa ${company.empresa}`} loading="lazy" className="h-10 w-10 rounded-full object-contain border border-text-secondary/20 flex-shrink-0" />
                                    ): (
                                        <div className="h-10 w-10 rounded-full bg-border flex items-center justify-center text-text-secondary flex-shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>
                                        </div>
                                    )}
                                    <h4 className="text-lg font-bold text-text truncate">{company.empresa}</h4>
                                </div>
                                <div className="mt-3">
                                    <p className="font-semibold text-text-secondary text-sm">Gestor</p>
                                    <p className="font-medium text-text truncate">{company.nome}</p>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-border/50 grid grid-cols-3 gap-2 text-center">
                                <div>
                                    <p className="text-xs font-medium text-text-secondary uppercase tracking-wider">Total</p>
                                    <p className="text-2xl font-bold text-text">{stats.total}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-green-400 uppercase tracking-wider">Qualif.</p>
                                    <p className="text-2xl font-bold text-green-400">{stats.qualified}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-red-400 uppercase tracking-wider">Não Qualif.</p>
                                    <p className="text-2xl font-bold text-red-400">{stats.unqualified}</p>
                                </div>
                            </div>
                        </div>
                    )})}
                </div>
            </div>

            {selectedCompanyDetails && (
                <CompanyDetailsModal 
                    company={selectedCompanyDetails} 
                    onClose={() => setSelectedCompanyDetails(null)} 
                    leads={externalLeads}
                    internalUsers={users}
                    internalCompanies={internalCompanies}
                />
            )}
             <ComparisonModal isOpen={isComparisonModalOpen} onClose={() => setComparisonModalOpen(false)} data={comparisonData} />
        </div>
    );
};

const Approvals = () => {
    const { users, approveUser, getCompanyById } = useAppContext();
    const pendingUsers = users.filter(u => !u.approved);

    return (
        <div className="bg-card p-6 rounded-lg shadow-lg border border-border">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Aprovações Pendentes</h2>
            {pendingUsers.length === 0 ? <p className="text-text-secondary">Nenhuma aprovação pendente.</p> : (
                <ul className="space-y-3">
                    {pendingUsers.map(user => (
                        <li key={user.id} className="flex justify-between items-center p-4 bg-background rounded-md border border-border transition-shadow hover:shadow-glow-primary-light">
                            <div>
                                <p className="font-semibold text-text">{user.name} ({user.email})</p>
                                <p className="text-sm text-text-secondary">Função: {user.role} | Empresa: {getCompanyById(user.companyId)?.name || user.companyId}</p>
                            </div>
                            <button onClick={() => approveUser(user.id)} className="bg-secondary text-white px-4 py-1 rounded-md text-sm font-semibold hover:opacity-90 transition-opacity">Aprovar</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const ManageCompanies = () => {
    const { companies, users, addCompany, updateCompanyAndManager, deleteCompany, businessGroups, getBusinessGroupById } = useAppContext();
    const [modalState, setModalState] = useState<{ type: 'add' | 'edit' | 'delete' | null, company: Company | null }>({ type: null, company: null });
    const [companyName, setCompanyName] = useState('');
    const [selectedManagerId, setSelectedManagerId] = useState<string | null>(null);
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
    const [filterCompanyId, setFilterCompanyId] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCompanies = useMemo(() => {
        let tempCompanies = companies;
        if (filterCompanyId) {
            tempCompanies = tempCompanies.filter(c => c.id === filterCompanyId);
        }
        if (searchTerm.trim()) {
            tempCompanies = tempCompanies.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        return tempCompanies;
    }, [filterCompanyId, companies, searchTerm]);

    const openModal = (type: 'add' | 'edit' | 'delete', company: Company | null = null) => {
        setModalState({ type, company });
        if (type === 'edit' && company) {
            setCompanyName(company.name);
            const currentManager = users.find(u => u.companyId === company.id && u.role === UserRole.COMPANY);
            setSelectedManagerId(currentManager ? currentManager.id : null);
            setSelectedGroupId(company.businessGroupId || null);
        } else {
            setCompanyName('');
            setSelectedManagerId(null);
            setSelectedGroupId(null);
        }
    };

    const closeModal = () => {
        setModalState({ type: null, company: null });
        setSelectedManagerId(null);
        setSelectedGroupId(null);
    };

    const handleConfirm = () => {
        if (modalState.type === 'add' && companyName.trim()) {
            addCompany(companyName.trim());
        }
        if (modalState.type === 'edit' && modalState.company && companyName.trim()) {
            updateCompanyAndManager(modalState.company.id, companyName.trim(), selectedManagerId, selectedGroupId);
        }
        if (modalState.type === 'delete' && modalState.company) {
            deleteCompany(modalState.company.id);
        }
        closeModal();
    };
    
    const inputStyle = "w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-text";
    const btnPrimary = "px-6 py-2 rounded-md text-sm font-bold text-background bg-primary hover:bg-primary-hover hover:shadow-glow-primary transition-all";
    const btnCancel = "px-4 py-2 rounded-md text-sm font-medium bg-border hover:bg-border/70";
    const btnDanger = "px-6 py-2 rounded-md text-sm font-bold text-white bg-red-600 hover:bg-red-500";


    return (
        <div className="bg-card p-6 rounded-lg shadow-lg border border-border">
             <div className="flex flex-col sm:flex-row flex-wrap justify-between items-center gap-4 mb-6">
                <h2 className="text-2xl font-semibold text-primary w-full sm:w-auto">Gerenciar Empresas (Interno)</h2>
                <div className="flex items-center gap-4 w-full sm:w-auto flex-wrap">
                    <div className="relative flex-grow sm:flex-grow-0">
                        <input
                            type="text"
                            placeholder="Pesquisar por nome..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full sm:w-60 bg-background border border-border text-text rounded-md py-2 pl-10 pr-3 transition-colors focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/40"
                        />
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                    </div>
                    <select
                        id="manage-company-filter"
                        value={filterCompanyId}
                        onChange={(e) => setFilterCompanyId(e.target.value)}
                        className="flex-grow sm:flex-grow-0 w-full sm:w-60 bg-background border border-border text-text rounded-md py-2 px-3 transition-colors focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/40"
                    >
                        <option value="">Todas as Empresas</option>
                        {companies.sort((a,b) => a.name.localeCompare(b.name)).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <button onClick={() => openModal('add')} className={`${btnPrimary} w-full sm:w-auto`}>Adicionar Empresa</button>
                </div>
            </div>

             <div className="space-y-3">
                {filteredCompanies.length > 0 ? (
                    filteredCompanies.map(c => (
                        <div key={c.id} className="flex flex-col sm:flex-row justify-between items-center gap-3 p-4 bg-background rounded-md border border-border">
                            <div className="text-center sm:text-left">
                                <p className="font-semibold text-text">{c.name}</p>
                                <p className="text-sm text-text-secondary">ID: {c.id} {c.businessGroupId && `| Grupo: ${getBusinessGroupById(c.businessGroupId)?.name}`}</p>
                            </div>
                            <div className="flex gap-4 flex-shrink-0">
                                <button onClick={() => openModal('edit', c)} className="text-primary hover:underline">Editar</button>
                                <button onClick={() => openModal('delete', c)} className="text-red-500 hover:underline">Excluir</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-text-secondary text-center py-4">Nenhuma empresa encontrada.</p>
                )}
            </div>
            <Modal isOpen={!!modalState.type} onClose={closeModal} title={modalState.type === 'add' ? 'Nova Empresa' : modalState.type === 'edit' ? 'Editar Empresa' : 'Confirmar Exclusão'}>
                {modalState.type === 'add' || modalState.type === 'edit' ? (
                     <div className="space-y-6">
                        <div>
                           <label htmlFor="companyName" className="block text-sm font-medium mb-2 text-text-secondary">Nome da Empresa</label>
                           <input id="companyName" type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className={inputStyle} autoFocus />
                        </div>
                        
                        {modalState.type === 'edit' && modalState.company && (
                           <>
                                <div>
                                    <label htmlFor="companyGroup" className="block text-sm font-medium mb-2 text-text-secondary">Grupo Empresarial (Opcional)</label>
                                    <select 
                                        id="companyGroup" 
                                        value={selectedGroupId || ''} 
                                        onChange={e => setSelectedGroupId(e.target.value || null)} 
                                        className={inputStyle}
                                    >
                                        <option value="">Nenhum Grupo</option>
                                        {businessGroups.map(group => (
                                            <option key={group.id} value={group.id}>{group.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="companyManager" className="block text-sm font-medium mb-2 text-text-secondary">Gestor da Empresa</label>
                                    <select 
                                        id="companyManager" 
                                        value={selectedManagerId || ''} 
                                        onChange={e => setSelectedManagerId(e.target.value || null)} 
                                        className={inputStyle}
                                    >
                                        <option value="">Nenhum Gestor Designado</option>
                                        {users.filter(user => user.companyId === modalState.company?.id && user.role !== UserRole.ADMIN).map(user => (
                                            <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                                        ))}
                                    </select>
                                    <p className="text-xs text-text-secondary mt-2">
                                        Designar um gestor mudará sua função para 'Gestor da Empresa'. Apenas usuários desta empresa são listados.
                                    </p>
                                </div>
                           </>
                        )}

                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={closeModal} className={btnCancel}>Cancelar</button>
                            <button onClick={handleConfirm} className={btnPrimary}>Salvar</button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <p className="mb-1 text-text">Tem certeza que deseja excluir a empresa <span className="font-bold text-primary">{modalState.company?.name}</span>?</p>
                        <p className="text-sm text-red-400">Atenção: Todos os colaboradores associados também serão excluídos.</p>
                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={closeModal} className={btnCancel}>Cancelar</button>
                            <button onClick={handleConfirm} className={btnDanger}>Excluir</button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

const BusinessIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
    </svg>
);

const ManageBusinessGroups = () => {
    const {
        externalBusinessGroups,
        externalCompanies,
        externalLeads,
        users,
        companies: internalCompanies
    } = useAppContext();
    const [selectedGroup, setSelectedGroup] = useState<ExternalBusinessGroup | null>(null);
    const [selectedCompany, setSelectedCompany] = useState<ExternalCompany | null>(null);

    const companiesInSelectedGroup = useMemo(() => {
        if (!selectedGroup) return [];
        return externalCompanies.filter(c => selectedGroup.Empresas.map(e => e.toLowerCase()).includes(c.empresa.toLowerCase()));
    }, [selectedGroup, externalCompanies]);

    const companyDetailsData = useMemo(() => {
        if (!selectedCompany) return null;

        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();

        const allCompanyLeads = externalLeads.filter(l => l.empresa.toLowerCase() === selectedCompany.empresa.toLowerCase());

        const leadsThisMonth = allCompanyLeads.filter(l => {
            const parts = l.data.split('/');
            if (parts.length !== 3) return false;
            const [, month, year] = parts.map(Number);
            return month === currentMonth && year === currentYear;
        });

        const matchedInternalCompany = internalCompanies.find(c => c.id === selectedCompany.codigo || c.name.toLowerCase() === selectedCompany.empresa.toLowerCase());
        const employees = matchedInternalCompany ? users.filter(u => u.companyId === matchedInternalCompany.id) : [];

        return {
            totalLeadsThisMonth: leadsThisMonth.length,
            totalLeadsEver: allCompanyLeads.length,
            employeeCount: employees.length,
        };
    }, [selectedCompany, externalLeads, internalCompanies, users]);
    
    const getInitials = (name: string) => {
        if (!name) return '';
        return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    }


    if (selectedCompany) {
        return (
            <div className="bg-card p-6 rounded-lg shadow-lg border border-border animate-zoom-in">
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => setSelectedCompany(null)} className="p-2 rounded-full bg-background hover:bg-border text-text-secondary hover:text-primary transition-colors"><ArrowLeftIcon /></button>
                    <h2 className="text-2xl font-semibold text-primary">Detalhes de: {selectedCompany.empresa}</h2>
                </div>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        <div className="flex flex-col items-center md:items-start gap-4">
                            {selectedCompany.logo && <img src={selectedCompany.logo} alt="Logo" className="h-24 w-24 rounded-full object-cover border-4 border-primary/30" />}
                            <div className="text-center md:text-left">
                                <p className="text-2xl font-bold text-primary">{selectedCompany.empresa}</p>
                                <p className="text-text-secondary">{selectedCompany.segmento}</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-center md:items-end gap-3 text-center md:text-right">
                            {selectedCompany.foto ? (
                                <img src={selectedCompany.foto} alt="Gestor" className="h-20 w-20 rounded-full object-cover border-4 border-primary/30" />
                            ) : (
                                <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-3xl border-4 border-primary/30">
                                    {getInitials(selectedCompany.nome)}
                                </div>
                            )}
                            <div>
                                <p className="text-text-secondary">Gestor: <span className="font-bold text-text">{selectedCompany.nome}</span></p>
                                <p className="text-text-secondary">Email: <span className="font-bold text-text">{selectedCompany.email}</span></p>
                                <p className="text-text-secondary">Telefone: <span className="font-bold text-text">{selectedCompany.telefone}</span></p>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-background rounded-lg border border-border grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                            <p className="text-sm font-medium text-text-secondary">Leads (Mês)</p>
                            <p className="font-bold text-2xl text-text">{companyDetailsData?.totalLeadsThisMonth}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-text-secondary">Leads (Total)</p>
                            <p className="font-bold text-2xl text-text">{companyDetailsData?.totalLeadsEver}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-text-secondary">Colaboradores</p>
                            <p className="font-bold text-2xl text-text">{companyDetailsData?.employeeCount}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-text-secondary">Status</p>
                            <p className={`font-bold text-2xl ${selectedCompany.status === 'on' ? 'text-green-400' : 'text-red-400'}`}>{selectedCompany.status === 'on' ? 'ON' : 'OFF'}</p>
                        </div>
                    </div>
                    
                    <div className="p-4 bg-background rounded-lg border border-border">
                        <h3 className="text-lg font-semibold text-primary mb-2">Informações Adicionais</h3>
                        <p className="text-text-secondary">Código da Empresa: <span className="font-mono text-lg bg-border text-primary px-2 py-0.5 rounded">{selectedCompany.codigo || 'N/A'}</span></p>
                        <p className="text-text-secondary">Localização: <span className="text-text">{selectedCompany.bairro}, {selectedCompany.cidade} - {selectedCompany.estado}</span></p>
                        <p className="text-text-secondary">Aprovado por: <span className="text-text">{selectedCompany.aprovado_por} em {selectedCompany.data} às {selectedCompany.horario}</span></p>
                    </div>
                </div>
            </div>
        )
    }

    if (selectedGroup) {
        return (
            <div className="bg-card p-6 rounded-lg shadow-lg border border-border animate-zoom-in">
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => setSelectedGroup(null)} className="p-2 rounded-full bg-background hover:bg-border text-text-secondary hover:text-primary transition-colors"><ArrowLeftIcon /></button>
                    <h2 className="text-2xl font-semibold text-primary">Empresas do Grupo: {selectedGroup.Grupo}</h2>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {companiesInSelectedGroup.length > 0 ? companiesInSelectedGroup.map(company => (
                        <div key={company.id} onClick={() => setSelectedCompany(company)} className="bg-background p-5 rounded-lg border border-border transition-all duration-300 hover:border-primary hover:shadow-glow-primary-light cursor-pointer space-y-4 flex flex-col">
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex items-center gap-3 flex-grow min-w-0">
                                    {company.logo ? (
                                        <img src={company.logo} alt={`Logo da empresa ${company.empresa}`} loading="lazy" className="h-12 w-12 rounded-full object-cover flex-shrink-0" />
                                    ) : (
                                        <div className="h-12 w-12 rounded-full bg-border flex items-center justify-center text-text-secondary flex-shrink-0">
                                            <BusinessIcon className="h-6 w-6" />
                                        </div>
                                    )}
                                    <h3 className="text-lg font-bold text-text break-words">{company.empresa}</h3>
                                </div>
                                <span className={`px-3 py-1 text-xs font-bold rounded-full text-white flex-shrink-0 ${company.status === 'on' ? 'bg-green-500' : 'bg-red-500'}`}>
                                    {company.status === 'on' ? 'ON' : 'OFF'}
                                </span>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                {company.foto ? (
                                    <img src={company.foto} alt={company.nome} className="h-10 w-10 rounded-full object-cover" />
                                ) : (
                                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                        {getInitials(company.nome)}
                                    </div>
                                )}
                                <div>
                                    <p className="font-semibold text-text-secondary text-sm">Gestor</p>
                                    <p className="font-bold text-text">{company.nome}</p>
                                </div>
                            </div>

                            <div>
                                <p className="font-semibold text-text-secondary text-sm">Localização</p>
                                <p className="text-sm text-text">{company.cidade} - {company.estado}</p>
                            </div>
                        </div>
                    )) : (
                        <p className="text-text-secondary col-span-full text-center py-8">Nenhuma empresa correspondente encontrada neste grupo.</p>
                    )}
                </div>
            </div>
        )
    }

    if (externalBusinessGroups.length === 0) {
         return <div className="text-center text-text-secondary py-10">Nenhum grupo empresarial encontrado. Os dados são carregados no login.</div>;
    }

    return (
        <div className="bg-card p-6 rounded-lg shadow-lg border border-border">
            <h2 className="text-2xl font-semibold mb-6 text-primary">Grupos Empresariais</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {externalBusinessGroups.map((group, index) => (
                    <div key={index} onClick={() => setSelectedGroup(group)} className="bg-background p-5 rounded-lg border border-border transition-all duration-300 hover:border-primary hover:shadow-glow-primary-light cursor-pointer space-y-4">
                        <h3 className="text-xl font-bold text-primary">{group.Grupo}</h3>
                        <div>
                            <p className="font-semibold text-text-secondary text-sm">Responsável</p>
                            <p className="font-medium text-text">{group.Responsavel}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-text-secondary text-sm">Nº de Empresas</p>
                            <p className="font-medium text-text">{group.Empresas.length}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ManageExternalCollaborators = () => {
    const { externalCollaborators, externalCompanies, openPhotoViewer } = useAppContext();
    const [selectedCollaborator, setSelectedCollaborator] = useState<ExternalCollaborator | null>(null);
    const [companyFilter, setCompanyFilter] = useState('');

    const companyLogos = useMemo(() => {
        const logoMap = new Map<string, string>();
        externalCompanies.forEach(company => {
            if (company.logo) {
                logoMap.set(company.empresa.toLowerCase(), company.logo);
            }
        });
        return logoMap;
    }, [externalCompanies]);

    const uniqueCompanies = useMemo(() => {
        return [...new Set(externalCollaborators.map(c => c.empresa))].sort();
    }, [externalCollaborators]);

    const filteredCollaborators = useMemo(() => {
        if (!companyFilter) return externalCollaborators;
        return externalCollaborators.filter(c => c.empresa === companyFilter);
    }, [externalCollaborators, companyFilter]);
    
    const getInitials = (name: string) => {
        if (!name) return '';
        return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    }

    if (externalCollaborators.length === 0) {
        return <div className="text-center text-text-secondary py-10">Nenhum colaborador encontrado. Os dados são carregados no login.</div>;
    }

    return (
        <div className="bg-card p-6 rounded-lg shadow-lg border border-border">
             <div className="flex flex-col sm:flex-row flex-wrap justify-between items-center gap-4 mb-6">
                <h2 className="text-2xl font-semibold text-primary w-full sm:w-auto">Colaboradores</h2>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                     <select
                        value={companyFilter}
                        onChange={(e) => setCompanyFilter(e.target.value)}
                        className="w-full sm:w-60 bg-background border border-border text-text rounded-md py-2 px-3 transition-colors focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/40"
                    >
                        <option value="">Todas as Empresas</option>
                        {uniqueCompanies.map(company => <option key={company} value={company}>{company}</option>)}
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCollaborators.map(collab => {
                    const companyLogo = companyLogos.get(collab.empresa.toLowerCase());
                    return (
                        <div key={collab.id} onClick={() => setSelectedCollaborator(collab)} className="bg-background p-5 rounded-lg border border-border transition-all duration-300 hover:border-primary hover:shadow-glow-primary-light cursor-pointer space-y-4 flex flex-col">
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex items-center gap-3 flex-grow min-w-0">
                                    {companyLogo ? (
                                        <img src={companyLogo} alt={`Logo da ${collab.empresa}`} loading="lazy" className="h-10 w-10 rounded-full object-contain bg-white p-1 flex-shrink-0" />
                                    ) : (
                                         <div className="h-10 w-10 rounded-full bg-border flex items-center justify-center text-text-secondary flex-shrink-0">
                                            <BusinessIcon className="h-5 w-5" />
                                        </div>
                                    )}
                                    <p className="text-sm font-semibold text-text-secondary truncate">{collab.empresa}</p>
                                </div>
                                <span className={`px-3 py-1 text-xs font-bold rounded-full text-white flex-shrink-0 ${collab.status === 'on' ? 'bg-green-500' : 'bg-red-500'}`}>
                                    {collab.status === 'on' ? 'ON' : 'OFF'}
                                </span>
                            </div>
                            
                            <div className="flex-grow flex flex-col items-center justify-center text-center pt-2">
                                {collab.foto ? (
                                    <img src={collab.foto} alt={collab.nome} className="h-24 w-24 rounded-full object-cover border-4 border-border" />
                                ) : (
                                    <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-4xl border-4 border-border">
                                        {getInitials(collab.nome)}
                                    </div>
                                )}
                                <h3 className="text-lg font-bold text-text mt-4">{collab.nome}</h3>
                            </div>
                        </div>
                    );
                })}
            </div>

            <Modal isOpen={!!selectedCollaborator} onClose={() => setSelectedCollaborator(null)} title={selectedCollaborator?.nome || 'Detalhes do Colaborador'} maxWidth="max-w-xl">
                {selectedCollaborator && (
                    <div className="space-y-6">
                        <div className="flex flex-col items-center gap-4">
                            {selectedCollaborator.foto ? (
                                <img
                                    src={selectedCollaborator.foto}
                                    alt={`Foto de ${selectedCollaborator.nome}`}
                                    onClick={() => openPhotoViewer(selectedCollaborator.foto)}
                                    className="h-32 w-32 rounded-full object-cover border-4 border-primary/40 cursor-pointer transition-transform hover:scale-105"
                                    title="Clique para ampliar"
                                />
                            ) : (
                                <div className="h-32 w-32 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-5xl border-4 border-primary/40">
                                    {getInitials(selectedCollaborator.nome)}
                                </div>
                            )}
                            <h3 className="text-2xl font-bold text-text">{selectedCollaborator.nome}</h3>
                        </div>

                        <div className="p-4 bg-background rounded-lg border border-border space-y-3 text-sm">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-text-secondary">Email:</span>
                                <span className="font-medium text-text">{selectedCollaborator.email}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-text-secondary">Telefone:</span>
                                <span className="font-medium text-text">{selectedCollaborator.telefone}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-text-secondary">Empresa:</span>
                                <span className="font-medium text-text">{selectedCollaborator.empresa}</span>
                            </div>
                             <div className="flex justify-between items-center">
                                <span className="font-semibold text-text-secondary">Status:</span>
                                <span className={`font-bold ${selectedCollaborator.status === 'on' ? 'text-green-400' : 'text-red-400'}`}>
                                    {selectedCollaborator.status === 'on' ? 'Ativo' : 'Inativo'}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

const SimpleBarChart = ({ data }: { data: { date: string, count: number }[] }) => {
    const maxValue = Math.max(...data.map(d => d.count), 0);
    if (data.length === 0) {
        return (
            <div className="bg-background p-4 rounded-lg border-2 border-dashed border-border h-64 flex items-center justify-center">
                <p className="text-text-secondary">Nenhum dado de log para exibir no gráfico com os filtros atuais.</p>
            </div>
        );
    }
    return (
        <div className="bg-background p-4 rounded-lg border border-border h-64 flex justify-around gap-2">
            {data.map(item => (
                <div key={item.date} className="flex-1 flex flex-col items-center justify-end gap-1 group" title={`${item.date}: ${item.count} logins`}>
                    <div className="text-primary font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity -mb-1">{item.count}</div>
                    <div 
                        className="w-full bg-primary/80 hover:bg-primary rounded-t-md transition-all duration-300"
                        style={{ height: maxValue > 0 ? `${(item.count / maxValue) * 85}%` : '0%' }}
                    ></div>
                    <div className="text-xs text-text-secondary whitespace-nowrap">{item.date.substring(0, 5)}</div>
                </div>
            ))}
        </div>
    );
};

const LogsViewer = () => {
    const { loginLogs, externalBusinessGroups } = useAppContext();
    const [filters, setFilters] = useState({ company: '', collaborator: '', group: '' });

    const filterOptions = useMemo(() => {
        const companies = [...new Set(loginLogs.map(l => l.empresa))].sort();
        const collaborators = [...new Set(loginLogs.map(l => l.nome))].sort();
        const groupMap = new Map<string, string>();
        externalBusinessGroups.forEach(group => {
            group.Empresas.forEach(companyName => {
                groupMap.set(companyName.toLowerCase(), group.Grupo);
            });
        });
        const groups = [...new Set(externalBusinessGroups.map(g => g.Grupo))].sort();
        return { companies, collaborators, groups, groupMap };
    }, [loginLogs, externalBusinessGroups]);

    const filteredLogs = useMemo(() => {
        return loginLogs.filter(log => {
            const companyMatch = !filters.company || log.empresa === filters.company;
            const collaboratorMatch = !filters.collaborator || log.nome === filters.collaborator;
            const groupForLog = filterOptions.groupMap.get(log.empresa.toLowerCase());
            const groupMatch = !filters.group || groupForLog === filters.group;
            return companyMatch && collaboratorMatch && groupMatch;
        }).sort((a, b) => new Date(b.data.split('/').reverse().join('-') + 'T' + b.horario).getTime() - new Date(a.data.split('/').reverse().join('-') + 'T' + a.horario).getTime());
    }, [loginLogs, filters, filterOptions.groupMap]);

    const chartData = useMemo(() => {
        const logsByDate = filteredLogs.reduce((acc, log) => {
            const date = log.data;
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(logsByDate)
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => {
                const [dayA, monthA, yearA] = a.date.split('/').map(Number);
                const [dayB, monthB, yearB] = b.date.split('/').map(Number);
                return new Date(yearA, monthA - 1, dayA).getTime() - new Date(yearB, monthB - 1, dayB).getTime();
            })
            .slice(-15);
    }, [filteredLogs]);

    const handleFilterChange = (filterType: 'company' | 'collaborator' | 'group', value: string) => {
        setFilters(prev => ({ ...prev, [filterType]: value }));
    };

    if (loginLogs.length === 0) {
        return <div className="text-center text-text-secondary py-10">Nenhum log de acesso encontrado.</div>;
    }
    
    const selectStyle = "w-full bg-background border border-border text-text rounded-md py-2 px-3 transition-colors focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/40";

    return (
         <div className="bg-card p-6 rounded-lg shadow-lg border border-border space-y-6">
            <h2 className="text-2xl font-semibold text-primary">Logs de Acesso</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-background rounded-lg border border-border">
                <select value={filters.company} onChange={e => handleFilterChange('company', e.target.value)} className={selectStyle}>
                    <option value="">Filtrar por Empresa</option>
                    {filterOptions.companies.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                 <select value={filters.collaborator} onChange={e => handleFilterChange('collaborator', e.target.value)} className={selectStyle}>
                    <option value="">Filtrar por Colaborador</option>
                    {filterOptions.collaborators.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                 <select value={filters.group} onChange={e => handleFilterChange('group', e.target.value)} className={selectStyle}>
                    <option value="">Filtrar por Grupo</option>
                     {filterOptions.groups.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
            </div>
            
            <div>
                <h3 className="text-lg font-semibold text-text-secondary mb-2">Atividade Recente (Últimos 15 dias com logs)</h3>
                <SimpleBarChart data={chartData} />
            </div>

            <div>
                <h3 className="text-lg font-semibold text-text-secondary mb-2">Registros de Log ({filteredLogs.length})</h3>
                <div className="overflow-x-auto max-h-[500px] border border-border rounded-lg">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-background text-text-secondary uppercase sticky top-0">
                            <tr>
                                <th className="p-3">Data & Hora</th>
                                <th className="p-3">Colaborador</th>
                                <th className="p-3">Empresa</th>
                            </tr>
                        </thead>
                        <tbody className="bg-card">
                            {filteredLogs.map(log => (
                                <tr key={log.id} className="border-t border-border/50">
                                    <td className="p-3 font-mono text-primary/90">{log.data} <span className="text-text-secondary/70">{log.horario}</span></td>
                                    <td className="p-3 font-medium text-text">{log.nome}</td>
                                    <td className="p-3 text-text-secondary">{log.empresa}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {filteredLogs.length === 0 && <p className="text-center p-8 text-text-secondary">Nenhum log encontrado para os filtros selecionados.</p>}
                </div>
            </div>
        </div>
    );
};


export default AdminPage;