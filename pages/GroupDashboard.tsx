import React, { useMemo } from 'react';
import { useAppContext } from '../App';
import { UserRole } from '../types';

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


const GroupDashboard = () => {
    const { currentUser, companies, users, leads, businessGroups } = useAppContext();

    const groupData = useMemo(() => {
        if (!currentUser || currentUser.role !== UserRole.GROUP_MANAGER || !currentUser.businessGroupId) {
            return {
                groupName: '',
                memberCompanies: [],
                totalCollaborators: 0,
                totalLeads: 0,
                totalConverted: 0,
                groupConversionRate: 0,
            };
        }

        const group = businessGroups.find(g => g.id === currentUser.businessGroupId);
        const memberCompanies = companies.filter(c => c.businessGroupId === currentUser.businessGroupId);
        const memberCompanyIds = memberCompanies.map(c => c.id);

        const collaboratorsInGroup = users.filter(u => memberCompanyIds.includes(u.companyId) && u.role === UserRole.COLLABORATOR);
        const collaboratorIds = collaboratorsInGroup.map(u => u.id);

        const leadsInGroup = leads.filter(l => collaboratorIds.includes(l.assignedTo));
        const totalConverted = leadsInGroup.filter(l => l.status === 'converted').length;
        const groupConversionRate = leadsInGroup.length > 0 ? (totalConverted / leadsInGroup.length) * 100 : 0;

        const companiesWithDetails = memberCompanies.map(company => {
            const companyCollaborators = collaboratorsInGroup.filter(u => u.companyId === company.id);
            const companyLeadIds = companyCollaborators.map(u => u.id);
            const companyLeads = leadsInGroup.filter(l => companyLeadIds.includes(l.assignedTo));
            const companyConverted = companyLeads.filter(l => l.status === 'converted').length;
            const conversionRate = companyLeads.length > 0 ? (companyConverted / companyLeads.length) * 100 : 0;
            return {
                ...company,
                collaboratorCount: companyCollaborators.length,
                leadCount: companyLeads.length,
                conversionRate,
            };
        });

        return {
            groupName: group?.name || 'Grupo Empresarial',
            memberCompanies: companiesWithDetails,
            totalCollaborators: collaboratorsInGroup.length,
            totalLeads: leadsInGroup.length,
            totalConverted,
            groupConversionRate,
        };
    }, [currentUser, companies, users, leads, businessGroups]);
    
    if (!currentUser || currentUser.role !== UserRole.GROUP_MANAGER) return null;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold text-text">Painel do Grupo: <span className="text-primary">{groupData.groupName}</span></h1>
                <p className="text-md text-text-secondary">Acompanhe o desempenho consolidado de todas as empresas do seu grupo.</p>
            </div>
            
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                 <StatCard title="Empresas no Grupo" value={groupData.memberCompanies.length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>} />
                 <StatCard title="Total de Colaboradores" value={groupData.totalCollaborators} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>} />
                 <StatCard title="Total de Leads" value={groupData.totalLeads} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>} />
                 <StatCard title="Conversão do Grupo" value={`${groupData.groupConversionRate.toFixed(1)}%`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>} />
            </div>

            <div className="bg-card p-6 rounded-lg shadow-lg border border-border">
                <h3 className="text-xl font-semibold text-primary mb-6">Desempenho por Empresa</h3>
                <div className="space-y-4">
                    {groupData.memberCompanies.length === 0 ? (
                        <p className="text-text-secondary text-center py-4">Nenhuma empresa neste grupo.</p>
                    ) : (
                        groupData.memberCompanies.map(company => (
                            <div key={company.id} className="p-4 bg-background rounded-lg border border-border space-y-3">
                                <h4 className="font-bold text-lg text-text">{company.name}</h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                                    <div>
                                        <p className="text-sm text-text-secondary">Colaboradores</p>
                                        <p className="text-2xl font-bold text-primary">{company.collaboratorCount}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-text-secondary">Leads</p>
                                        <p className="text-2xl font-bold text-primary">{company.leadCount}</p>
                                    </div>
                                    <div className="col-span-2 md:col-span-1">
                                        <p className="text-sm text-text-secondary">Taxa de Conversão</p>
                                        <p className="text-2xl font-bold text-secondary">{company.conversionRate.toFixed(1)}%</p>
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <div className="w-full bg-border rounded-full h-2.5">
                                        <div className="bg-secondary h-2.5 rounded-full" style={{ width: `${company.conversionRate}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default GroupDashboard;
