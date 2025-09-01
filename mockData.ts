

import type { Company, User, Lead, Feedback, BusinessGroup } from './types';
import { UserRole as Roles } from './types';

export const MOCK_BUSINESS_GROUPS: BusinessGroup[] = [
    { id: 'group-alpha', name: 'Grupo Alpha de Tecnologia' },
];

export const MOCK_COMPANIES: Company[] = [
    { id: 'techcorp', name: 'TechCorp', businessGroupId: 'group-alpha' },
    { id: 'innovateinc', name: 'Innovate Inc.', businessGroupId: 'group-alpha' },
    { id: 'triad3', name: 'Triad3' },
];

export const MOCK_USERS: User[] = [
    { id: 'admin-01', name: 'Paulo Triad', email: 'paulo@triad3.io', phone: '1234567890', role: Roles.ADMIN, companyId: 'prospectai', position: 'Admin da Plataforma', approved: true, profilePictureUrl: undefined },
    { id: 'group-manager-01', name: 'Gestor do Grupo Alpha', email: 'gestor@alpha.com', phone: '1111111111', role: Roles.GROUP_MANAGER, companyId: '', businessGroupId: 'group-alpha', position: 'Diretor de Operações', approved: true },
    { id: 'collab-01', name: 'Bob', email: 'bob@bob.com', phone: '0987654321', role: Roles.COLLABORATOR, companyId: 'techcorp', position: 'Representante de Vendas', approved: true, profilePictureUrl: undefined },
    { id: 'collab-02', name: 'Jane Smith', email: 'jane@innovateinc.com', phone: '1122334455', role: Roles.COLLABORATOR, companyId: 'innovateinc', position: 'SDR', approved: true, profilePictureUrl: undefined },
    { id: 'collab-03', name: 'Peter Jones', email: 'peter@techcorp.com', phone: '5544332211', role: Roles.COLLABORATOR, companyId: 'techcorp', position: 'Executivo de Contas', approved: false, profilePictureUrl: undefined },
    { id: 'comp-user-01', name: 'Gestor Triad3', email: 'triad3@triad3.io', phone: '3333333333', role: Roles.COMPANY, companyId: 'triad3', position: 'Diretor', approved: true, profilePictureUrl: undefined },
    { id: 'collab-05', name: 'Tessa Triad', email: 'tessa@triad3.io', phone: '3333333334', role: Roles.COLLABORATOR, companyId: 'triad3', position: 'SDR', approved: true, profilePictureUrl: undefined },
];

const mockFeedbacks: Feedback[] = [
    { id: 'fb-01', text: "Liguei, deixei um recado.", createdAt: new Date(Date.now() - 172800000).toISOString() },
    { id: 'fb-02', text: "Liguei, deixei um recado.", createdAt: new Date(Date.now() - 259200000).toISOString() },
    { id: 'fb-03', text: "Enviei e-mail de acompanhamento, sem resposta.", createdAt: new Date(Date.now() - 250000000).toISOString() },
    { id: 'fb-04', text: "Tentativa de contato inicial por telefone.", createdAt: new Date(Date.now() - 80000000).toISOString() },
];

export const MOCK_LEADS: Lead[] = [
    { id: 'lead-001', name: 'Alice Williams', company: 'Global Solutions', phone: '555-0101', email: 'alice.w@globalsolutions.com', receivedAt: new Date(Date.now() - 86400000).toISOString(), contactAttempts: 0, feedbacks: [], status: 'new', assignedTo: 'collab-01', proofRequested: false, initialSummary: 'Lead demonstrou interesse em nossa solução de design, mas não agendou a demonstração. Mencionou que o orçamento é uma preocupação.' },
    { id: 'lead-007', phone: '555-0107', receivedAt: new Date(Date.now() - 3600000).toISOString(), contactAttempts: 0, feedbacks: [], status: 'new', assignedTo: 'collab-01', proofRequested: false },
    { id: 'lead-002', name: 'Bob Johnson', company: 'Future Systems', phone: '555-0102', email: 'bob.j@futuresystems.com', receivedAt: new Date(Date.now() - 172800000).toISOString(), contactAttempts: 1, feedbacks: [mockFeedbacks[0]], status: 'contacted', assignedTo: 'collab-01', proofRequested: true },
    { id: 'lead-003', name: 'Charlie Brown', company: 'Dynamic Dynamics', phone: '555-0103', email: 'charlie.b@dynamicdynamics.com', receivedAt: new Date(Date.now() - 259200000).toISOString(), contactAttempts: 2, feedbacks: [mockFeedbacks[1], mockFeedbacks[2]], status: 'not_converted', assignedTo: 'collab-02', proofRequested: false, resolutionAttempt: 2 },
    { id: 'lead-004', phone: '555-0104', receivedAt: new Date(Date.now() - 345600000).toISOString(), contactAttempts: 0, feedbacks: [], status: 'new', assignedTo: 'collab-02', proofRequested: false },
    { id: 'lead-005', name: 'Eva Core', company: 'Core Tech', phone: '555-0105', email: 'eva.c@coretech.com', receivedAt: new Date(Date.now() - 86400000).toISOString(), contactAttempts: 1, feedbacks: [mockFeedbacks[3]], status: 'contacted', assignedTo: 'collab-05', proofRequested: false },
    { id: 'lead-006', name: 'Diana Prince', company: 'Themyscira Enterprises', phone: '555-0106', email: 'diana.p@themyscira.com', receivedAt: new Date(Date.now() - 400000000).toISOString(), contactAttempts: 2, feedbacks: [{ id: 'fb-05', text: "Demonstrou interesse, pediu para agendar.", createdAt: new Date(Date.now() - 300000000).toISOString() }], status: 'scheduled', assignedTo: 'collab-01', proofRequested: false, scheduledAt: new Date(Date.now() + 172800000).toISOString() },
    // --- New leads for Triad3 ---
    { 
        id: 'lead-triad-01', 
        name: 'Maewlly', 
        phone: '558296933853',
        receivedAt: '2025-08-10T10:00:00Z', 
        status: 'converted', 
        assignedTo: 'collab-05', 
        contactAttempts: 1,
        feedbacks: [],
        proofRequested: false,
        qualifiedAt: '2025-08-11T14:30:00Z',
        details: `Nome: Maewlly\nTelefone: 558296933853\nCarro na troca: Jeep Renegade preto, 2023, em ótimo estado\nUso pretendido: Dia a dia\nForma de pagamento: À vista ou financiamento, dependendo da avaliação do Renegade\nTipo de compra: Pessoa física`
    },
    { 
        id: 'lead-triad-02', 
        name: 'João Silva', 
        phone: '5511987654321',
        receivedAt: '2025-08-12T11:00:00Z', 
        status: 'converted', // Alterado de 'not_converted' para diferenciar os dados do gráfico
        assignedTo: 'collab-05',
        contactAttempts: 2,
        feedbacks: [],
        proofRequested: false,
        qualifiedAt: '2025-08-12T16:00:00Z',
        details: `Nome: João Silva\nTelefone: 5511987654321\nInteresse: Carro popular\nForma de pagamento: Financiamento\nObservação: Compra realizada.`
    },
     { 
        id: 'lead-triad-03', 
        name: 'Ana Costa',
        phone: '5521999998888',
        receivedAt: '2025-08-15T09:30:00Z', 
        status: 'new', 
        assignedTo: 'collab-05',
        contactAttempts: 0,
        feedbacks: [],
        proofRequested: false,
        details: `Nome: Ana Costa\nTelefone: 5521999998888\nInteresse: SUV compacto\nCarro na troca: Não possui\nTipo de compra: Pessoa física`
    },
    { 
        id: 'lead-triad-04', 
        name: 'Pedro Martins', 
        phone: '5531912345678',
        receivedAt: '2025-07-20T15:00:00Z', 
        status: 'converted', 
        assignedTo: 'collab-05',
        contactAttempts: 1,
        feedbacks: [],
        proofRequested: false, 
        qualifiedAt: '2025-07-21T11:00:00Z',
        details: `Nome: Pedro Martins\nTelefone: 5531912345678\nInteresse: Sedan médio\nForma de pagamento: Consórcio\nObservação: Cliente com urgência.`
    },
    { 
        id: 'lead-triad-05', 
        name: 'Carla Dias',
        phone: '5541955554444',
        receivedAt: '2025-07-22T12:00:00Z', 
        status: 'not_converted', 
        assignedTo: 'collab-05',
        contactAttempts: 2,
        feedbacks: [],
        proofRequested: false, 
        qualifiedAt: '2025-07-22T18:00:00Z',
        details: `Nome: Carla Dias\nTelefone: 5541955554444\nInteresse: Hatch premium\nCarro na troca: Sim\nObservação: Achou o valor do seguro muito alto.`
    },
    { 
        id: 'lead-triad-06', 
        name: 'Mariana Lima',
        phone: '5548988776655',
        receivedAt: '2025-07-25T10:00:00Z', 
        status: 'not_converted', 
        assignedTo: 'collab-05',
        contactAttempts: 1,
        feedbacks: [],
        proofRequested: false, 
        qualifiedAt: '2025-07-25T14:00:00Z',
        details: `Nome: Mariana Lima\nTelefone: 5548988776655\nInteresse: Carro elétrico\nObservação: Contato inicial realizado, cliente pediu para retornar na próxima semana.`
    },
];