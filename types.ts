
export enum UserRole {
  ADMIN = 'admin',
  COLLABORATOR = 'collaborator',
  COMPANY = 'company',
  GROUP_MANAGER = 'group_manager',
}

export interface BusinessGroup {
  id: string;
  name: string;
}

export interface Company {
  id: string;
  name: string;
  businessGroupId?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string; // Should not be stored in frontend state long-term
  profilePictureUrl?: string;
  role: UserRole;
  companyId: string;
  businessGroupId?: string; // For Group Managers
  position: string;
  approved: boolean;
}

export interface Feedback {
  id: string;
  text: string;
  createdAt: string;
  proofUrl?: string; // Can be a single URL or comma-separated URLs
}

export interface Lead {
  id: string;
  name?: string;
  company?: string;
  phone: string;
  email?: string;
  receivedAt: string;
  contactAttempts: number;
  feedbacks: Feedback[];
  status: 'new' | 'contacted' | 'scheduled' | 'not_converted' | 'converted';
  qualificationStatus?: 'Lead qualificado' | 'Lead não qualificado';
  assignedTo: string; // userId of the collaborator
  proofRequested: boolean;
  reassignmentHistory?: { from: string; to: string; date: string }[];
  initialSummary?: string;
  resolutionAttempt?: number;
  scheduledAt?: string;
  details?: string;
  qualifiedAt?: string;
}

export interface ExternalCompany {
    id: number;
    nome: string;
    telefone: string;
    email: string;
    empresa: string;
    aprovado_por: string;
    data: string;
    horario: string;
    codigo: string;
    logo: string;
    estado: string;
    cidade: string;
    bairro: string;
    segmento: string;
    status: 'on' | 'off';
    foto: string;
}

export interface ExternalLead {
    id: number;
    nome?: string;
    telefone?: string;
    empresa: string;
    data?: string; // "DD/MM/YYYY"
    horario?: string; // "HH:MM"
    tipo_compra: string;
    fullDetails: string;
    status?: string;
    colaborador?: string;
    feedback?: string;
    printUrls?: string[];
}

export interface ExternalBusinessGroup {
    Responsavel: string;
    Email: string;
    Grupo: string;
    Empresas: string[];
}

export interface ExternalCollaborator {
    id: number;
    nome: string;
    telefone: string;
    email: string;
    empresa: string;
    foto: string;
    status: 'on' | 'off';
}

export interface LoginLog {
    id: number;
    nome: string;
    empresa: string;
    data: string;
    horario: string;
}
