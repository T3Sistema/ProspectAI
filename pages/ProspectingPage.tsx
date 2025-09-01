

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useAppContext } from '../App';
import type { Lead, User, Feedback } from '../types';
import { supabase } from '../services/supabaseClient';

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

const UploadIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="17 8 12 3 7 8"></polyline>
        <line x1="12" y1="3" x2="12" y2="15"></line>
    </svg>
);

const LoadingSpinner = () => (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const CopyIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
);

const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);


const ScheduleMeetingModal = ({ isOpen, onClose, lead, onSubmit, feedback, onFeedbackChange }: {
    isOpen: boolean,
    onClose: () => void,
    lead: Lead | null,
    onSubmit: (leadId: string, meetingDateTime: string, feedbackText: string) => void,
    feedback: string,
    onFeedbackChange: (value: string) => void
}) => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    useEffect(() => {
        if (isOpen) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const defaultDate = tomorrow.toISOString().split('T')[0];
            setDate(defaultDate);
            setTime('10:00');
        }
    }, [isOpen]);

    if (!isOpen || !lead) return null;

    const handleSubmit = () => {
        if (!date || !time) {
            alert('Por favor, preencha a data e a hora da reunião.');
            return;
        }
        const meetingDateTime = new Date(`${date}T${time}`).toISOString();
        onSubmit(lead.id, meetingDateTime, feedback);
    };

    const inputStyle = "w-full text-text px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary";

    return (
         <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4" aria-modal="true" role="dialog" onClick={onClose}>
            <div className="bg-card rounded-lg shadow-xl w-full max-w-lg border border-border" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b border-border">
                    <h2 className="text-xl font-bold text-primary">Agendar Reunião: {lead.name}</h2>
                    <button onClick={onClose} className="text-text-secondary hover:text-text p-1 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <p className="text-text-secondary">Selecione a data e a hora para a reunião.</p>
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label htmlFor="meeting-date" className="block text-sm font-medium text-text-secondary mb-1">Data</label>
                            <input id="meeting-date" type="date" value={date} onChange={e => setDate(e.target.value)} className={inputStyle} />
                        </div>
                        <div>
                            <label htmlFor="meeting-time" className="block text-sm font-medium text-text-secondary mb-1">Hora</label>
                            <input id="meeting-time" type="time" value={time} onChange={e => setTime(e.target.value)} className={inputStyle} />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="meeting-notes" className="block text-sm font-medium text-text-secondary mb-1">Anotações / Feedback Adicional</label>
                        <textarea
                            id="meeting-notes"
                            value={feedback}
                            onChange={(e) => onFeedbackChange(e.target.value)}
                            placeholder="Ex: 'Cliente pediu para agendar para discutir o plano enterprise.'"
                            className="w-full p-2 rounded-md bg-background border border-border focus:ring-2 focus:ring-primary focus:border-primary text-text"
                            rows={3}
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button onClick={onClose} className="px-4 py-2 rounded-md text-sm font-medium bg-border hover:bg-border/70 text-text">Cancelar</button>
                        <button onClick={handleSubmit} className="px-6 py-2 rounded-md text-sm font-bold text-background bg-primary hover:bg-primary-hover hover:shadow-glow-primary transition-all">Confirmar Agendamento</button>
                    </div>
                </div>
            </div>
        </div>
    );
};


const LeadCard = ({ lead, activeLeadId, feedback, isSubmitting, proofImages, onStartProspecting, onFeedbackChange, onQualifyClick, onFileSelect, onRemoveProof, onScheduleClick, openPhotoViewer }: { 
    lead: Lead, activeLeadId: string | null, feedback: string, isSubmitting: boolean, proofImages: string[],
    onStartProspecting: (lead: Lead) => void, onFeedbackChange: (value: string) => void, onQualifyClick: (lead: Lead, action: 'converted' | 'not_converted') => void, onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void, onRemoveProof: (index: number) => void, onScheduleClick: () => void, openPhotoViewer: (url: string) => void
}) => {
    const isCompleted = lead.status === 'not_converted' || lead.status === 'converted' || lead.status === 'scheduled';
    const [copySuccess, setCopySuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showFeedbackActions, setShowFeedbackActions] = useState(false);
    const feedbackMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (feedbackMenuRef.current && !feedbackMenuRef.current.contains(event.target as Node)) {
                setShowFeedbackActions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const isUnqualified = lead.qualificationStatus === 'Lead não qualificado';

    const handleCopyPhone = (phone: string) => {
        if (!phone) return;
        navigator.clipboard.writeText(phone).then(() => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        });
    };
    
    return (
        <div className={`bg-card p-5 rounded-lg shadow-lg border transition-all hover:border-primary/50 hover:shadow-glow-primary-light space-y-4 flex flex-col ${isUnqualified ? 'border-red-500' : 'border-border'}`}>
            <div className="flex justify-between items-start">
                <div className="flex-grow min-w-0">
                    <h3 className="text-xl font-bold text-primary truncate">{lead.name || `Lead de Anúncio`}</h3>
                    {lead.company && <p className="text-sm text-text-secondary">{lead.company}</p>}
                    <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-2">
                        <p className="text-sm font-semibold text-text-secondary font-mono tracking-wider">{lead.phone}</p>
                         {lead.status === 'contacted' && (
                             <button onClick={() => handleCopyPhone(lead.phone)} className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-border text-text-secondary hover:bg-primary/20 hover:text-primary text-xs font-semibold transition-colors w-24 justify-center">
                                {copySuccess ? <CheckIcon className="w-3 h-3"/> : <CopyIcon className="w-3 h-3"/>}
                                {copySuccess ? 'Copiado!' : 'Copiar'}
                            </button>
                        )}
                    </div>
                    <p className="text-xs text-text-secondary/70 mt-2">Recebido: {new Date(lead.receivedAt).toLocaleString('pt-BR')}</p>
                </div>
                {lead.status === 'new' ? (
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full flex-shrink-0 ${
                        isUnqualified ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'
                    }`}>
                        {isUnqualified ? 'Lead Não Qualificado' : 'Lead Qualificado'}
                    </span>
                ) : (
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full flex-shrink-0 ${getStatusClass(lead.status)}`}>
                        {getStatusLabel(lead.status)}
                    </span>
                )}
            </div>
            
            {activeLeadId === lead.id ? (
                <div className="space-y-4 border-t border-border pt-4">
                    {lead.details && (
                         <div className="bg-background border border-border p-3 rounded-lg">
                            <h4 className="text-sm font-semibold text-primary mb-1">Detalhes do Lead:</h4>
                            <p className="text-text-secondary whitespace-pre-wrap text-sm">{lead.details.split('\n').filter(line => !line.trim().toLowerCase().startsWith('id:')).join('\n')}</p>
                        </div>
                    )}
                    {lead.feedbacks.length > 0 && (
                        <div>
                            <h4 className="text-sm font-semibold text-primary mb-2">Histórico de Contato:</h4>
                            <ul className="space-y-3 text-sm max-h-48 overflow-y-auto pr-2">
                                {lead.feedbacks.map(fb => {
                                    const proofUrls = fb.proofUrl ? fb.proofUrl.split(',') : [];
                                    return (
                                        <li key={fb.id} className="p-3 bg-background rounded-md text-text-secondary">
                                            <p>
                                                <span className="font-semibold text-text/90">{new Date(fb.createdAt).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}:</span> {fb.text}
                                            </p>
                                            {proofUrls.length > 0 && (
                                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2">
                                                    {proofUrls.map((url, index) => (
                                                        <img 
                                                            key={index}
                                                            src={url}
                                                            alt={`Comprovante ${index + 1}`}
                                                            className="h-full w-full object-cover rounded-md cursor-pointer transition-transform hover:scale-105"
                                                            onClick={() => openPhotoViewer(url)}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}
                    
                    {!isCompleted && (
                        <div className="space-y-3">
                             <textarea
                                value={feedback}
                                onChange={(e) => onFeedbackChange(e.target.value)}
                                placeholder="Registre o feedback da interação..."
                                className="w-full p-2 rounded-md bg-background border border-border focus:ring-2 focus:ring-primary focus:border-primary text-text"
                                rows={3}
                            />
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">Anexar Comprovante(s) (Prints)</label>
                                {proofImages.length > 0 && (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-2">
                                        {proofImages.map((image, index) => (
                                            <div key={index} className="relative group aspect-square">
                                                <img src={image} alt={`Comprovante ${index + 1}`} className="h-full w-full object-cover rounded-md"/>
                                                <button 
                                                    onClick={() => onRemoveProof(index)} 
                                                    className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                                                    aria-label="Remover imagem"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md text-text-secondary bg-border hover:bg-border/70 transition-colors">
                                   <UploadIcon/> Adicionar Imagem(s)
                                </button>
                                <input type="file" ref={fileInputRef} onChange={onFileSelect} className="hidden" accept="image/*" multiple />
                            </div>

                             <div className="flex flex-wrap gap-2 justify-end">
                                <button onClick={onScheduleClick} disabled={isSubmitting} className="flex-1 px-3 py-2 text-sm font-semibold rounded-md bg-cyan-600 text-white hover:bg-cyan-500 disabled:opacity-50">Agendar</button>
                                <button onClick={() => onQualifyClick(lead, 'converted')} disabled={isSubmitting} className="flex-1 px-3 py-2 text-sm font-semibold rounded-md bg-green-600 text-white hover:bg-green-500 disabled:opacity-50">Qualificado</button>
                                <button onClick={() => onQualifyClick(lead, 'not_converted')} disabled={isSubmitting} className="flex-1 px-3 py-2 text-sm font-semibold rounded-md bg-red-600 text-white hover:bg-red-500 disabled:opacity-50">Não Qualificado</button>
                             </div>
                        </div>
                    )}
                </div>
            ) : (
                 <>
                    {lead.status === 'new' && (
                         <button onClick={() => onStartProspecting(lead)} className="w-full bg-primary text-background font-bold py-2 rounded-md hover:bg-primary-hover hover:shadow-glow-primary transition-all">
                            Iniciar Prospecção
                        </button>
                    )}
                    {lead.status === 'contacted' && (
                        <div className="flex gap-2">
                            <button
                                onClick={() => onStartProspecting(lead)}
                                className="flex-1 bg-border text-text font-bold py-2 px-4 rounded-md hover:bg-border/70 transition-colors"
                            >
                                Detalhes
                            </button>
                            <div className="relative flex-1" ref={feedbackMenuRef}>
                                <button
                                    onClick={() => setShowFeedbackActions(s => !s)}
                                    className="w-full bg-yellow-600 text-white font-bold py-2 px-4 rounded-md hover:bg-yellow-500 transition-colors"
                                >
                                    Feedback
                                </button>
                                {showFeedbackActions && (
                                    <div className="absolute bottom-full mb-2 w-full bg-card border border-border rounded-lg shadow-lg z-10 animate-zoom-in" style={{animationDuration: '200ms'}}>
                                        <button onClick={() => { onQualifyClick(lead, 'converted'); setShowFeedbackActions(false); }} className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:bg-background hover:text-green-400 transition-colors rounded-t-lg">Qualificado</button>
                                        <button onClick={() => { onQualifyClick(lead, 'not_converted'); setShowFeedbackActions(false); }} className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:bg-background hover:text-red-400 transition-colors">Não Qualificado</button>
                                        <button onClick={() => { onScheduleClick(); setShowFeedbackActions(false); }} className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:bg-background hover:text-cyan-400 transition-colors rounded-b-lg">Agendamento</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    {isCompleted && (
                         <button onClick={() => onStartProspecting(lead)} className="w-full bg-primary text-background font-bold py-2 rounded-md hover:bg-primary-hover hover:shadow-glow-primary transition-all">
                            Ver Detalhes
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

// --- MODAIS E OVERLAYS ---
const ProspectingLoadingOverlay = () => (
    <div className="loading-overlay" aria-live="assertive" role="alert">
        <div className="loader-container">
            <div className="loader triangle">
                <svg viewBox="0 0 86 80">
                    <polygon points="43 8 79 72 7 72"></polygon>
                </svg>
            </div>
            <div className="loadingtext">
                <p>Iniciando</p>
            </div>
        </div>
    </div>
);

const LoadingFeedbackOverlay = () => (
    <div className="loading-overlay" aria-live="assertive" role="alert">
        <div className="loader-container">
            <div className="loader triangle">
                <svg viewBox="0 0 86 80">
                    <polygon points="43 8 79 72 7 72"></polygon>
                </svg>
            </div>
            <div className="loadingtext">
                <p>Enviando Feedback</p>
            </div>
        </div>
    </div>
);


const ConfirmationModal = ({ isOpen, onClose, onConfirm, lead }: { isOpen: boolean, onClose: () => void, onConfirm: () => void, lead: Lead | null }) => {
    if (!isOpen || !lead) return null;
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-card rounded-lg shadow-xl w-full max-w-md border border-border animate-zoom-in" onClick={e => e.stopPropagation()}>
                <div className="p-8 text-center space-y-4">
                    <h2 className="text-xl font-bold text-primary">Iniciar Prospecção</h2>
                    <p className="text-text-secondary">Você confirma o início da prospecção para o lead <span className="font-bold text-text">{lead.name || lead.phone}</span>?</p>
                </div>
                <div className="flex justify-center gap-4 p-4 bg-background/50 rounded-b-lg border-t border-border">
                    <button onClick={onClose} className="px-8 py-2 rounded-md text-sm font-medium bg-border hover:bg-border/70 text-text transition-colors">Cancelar</button>
                    <button onClick={onConfirm} className="px-8 py-2 rounded-md text-sm font-bold text-background bg-primary hover:bg-primary-hover transition-colors">Confirmar</button>
                </div>
            </div>
        </div>
    );
};

const FeedbackConfirmationModal = ({ isOpen, onClose, onConfirm, lead, action }: { 
    isOpen: boolean, 
    onClose: () => void, 
    onConfirm: () => void, 
    lead: Lead | null,
    action: 'converted' | 'not_converted' | null
}) => {
    if (!isOpen || !lead || !action) return null;
    
    const title = action === 'converted' ? 'Confirmar Qualificação' : 'Confirmar Não Qualificação';
    const message = action === 'converted' 
        ? `Você confirma a qualificação do lead ${lead.name || lead.phone}?`
        : `Você confirma a não qualificação do lead ${lead.name || lead.phone}?`;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-card rounded-lg shadow-xl w-full max-w-md border border-border animate-zoom-in" onClick={e => e.stopPropagation()}>
                <div className="p-8 text-center space-y-4">
                    <h2 className="text-xl font-bold text-primary">{title}</h2>
                    <p className="text-text-secondary">{message}</p>
                </div>
                <div className="flex justify-center gap-4 p-4 bg-background/50 rounded-b-lg border-t border-border">
                    <button onClick={onClose} className="px-8 py-2 rounded-md text-sm font-medium bg-border hover:bg-border/70 text-text transition-colors">Cancelar</button>
                    <button onClick={onConfirm} className="px-8 py-2 rounded-md text-sm font-bold text-background bg-primary hover:bg-primary-hover transition-colors">Confirmar</button>
                </div>
            </div>
        </div>
    );
};


const ResultModal = ({ isOpen, onClose, result }: { isOpen: boolean, onClose: () => void, result: { type: 'success' | 'error', message: string } | null }) => {
    if (!isOpen || !result) return null;
    
    const isSuccess = result.type === 'success';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-card rounded-lg shadow-xl w-full max-w-md border border-border animate-zoom-in" onClick={e => e.stopPropagation()}>
                <div className="p-8 text-center space-y-4">
                     <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${isSuccess ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                      {isSuccess ? (
                        <svg className="h-8 w-8 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                         <svg className="h-8 w-8 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                         </svg>
                      )}
                    </div>
                    <h2 className={`text-xl font-bold ${isSuccess ? 'text-primary' : 'text-red-400'}`}>{isSuccess ? 'Sucesso' : 'Erro'}</h2>
                    <p className="text-text-secondary">{result.message}</p>
                </div>
                <div className="flex justify-center gap-4 p-4 bg-background/50 rounded-b-lg">
                    <button onClick={onClose} className="px-8 py-2 rounded-md text-sm font-bold text-background bg-primary hover:bg-primary-hover transition-colors">OK</button>
                </div>
            </div>
        </div>
    );
};


const ProspectingPage = () => {
    const { currentUser, leads, updateLead, externalLeads, externalUnqualifiedLeads, openPhotoViewer } = useAppContext();
    const [activeLeadId, setActiveLeadId] = useState<string | null>(null);
    const [feedback, setFeedback] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [proofImages, setProofImages] = useState<string[]>([]);
    const [proofImageFiles, setProofImageFiles] = useState<File[]>([]);
    const [isScheduling, setIsScheduling] = useState(false);
    const [leadToSchedule, setLeadToSchedule] = useState<Lead | null>(null);
    
    const [isConfirming, setIsConfirming] = useState(false);
    const [leadToProspect, setLeadToProspect] = useState<Lead | null>(null);
    const [isStartingProspecting, setIsStartingProspecting] = useState(false);
    const [prospectingResult, setProspectingResult] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const [isConfirmingFeedback, setIsConfirmingFeedback] = useState(false);
    const [leadToQualify, setLeadToQualify] = useState<Lead | null>(null);
    const [qualificationAction, setQualificationAction] = useState<'converted' | 'not_converted' | null>(null);
    const [feedbackResult, setFeedbackResult] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const myLeads = useMemo(() => {
        if (!currentUser) return [];
        return leads.filter(l => l.assignedTo === currentUser.id);
    }, [currentUser, leads]);

    useEffect(() => {
        // Cleanup object URLs on unmount to prevent memory leaks
        return () => {
            proofImages.forEach(url => URL.revokeObjectURL(url));
        };
    }, [proofImages]);

    const handleStartProspecting = (lead: Lead) => {
        if (activeLeadId !== lead.id) {
            setActiveLeadId(lead.id);
            setFeedback('');
            setProofImages([]);
            setProofImageFiles([]);
        } else {
            setActiveLeadId(null);
        }
    };
    
    const handleInitiateProspectingFlow = (lead: Lead) => {
        setLeadToProspect(lead);
        setIsConfirming(true);
    };

    const handleConfirmStartProspecting = async () => {
        if (!leadToProspect || !currentUser) return;

        setIsConfirming(false);
        setIsStartingProspecting(true);

        try {
            const response = await fetch('https://webhook.triad3.io/webhook/prospeccao-prospectai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    lead: leadToProspect,
                    colaborador: currentUser,
                    qualificacao: leadToProspect.qualificationStatus,
                }),
            });
            const data = await response.json();

            if (response.ok && data.resposta) {
                const updatedLead = { ...leadToProspect, status: 'contacted' as const };
                updateLead(updatedLead);
                setProspectingResult({ type: 'success', message: data.resposta });
            } else {
                throw new Error(data.resposta || 'Falha ao iniciar a prospecção.');
            }

        } catch (error) {
            setProspectingResult({ type: 'error', message: error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.' });
        } finally {
            setIsStartingProspecting(false);
        }
    };
    
    const handleCloseResultModal = () => {
        if (prospectingResult?.type === 'success' && leadToProspect) {
            setActiveLeadId(leadToProspect.id);
        }
        setProspectingResult(null);
        setLeadToProspect(null);
        setFeedback('');
        setProofImages([]);
        setProofImageFiles([]);
    };

    const handleFeedbackChange = (value: string) => {
        setFeedback(value);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const newFiles = Array.from(files);
            setProofImageFiles(prev => [...prev, ...newFiles]);

            const newPreviews = newFiles.map(file => URL.createObjectURL(file));
            setProofImages(prev => [...prev, ...newPreviews]);
        }
        e.target.value = ''; // Reset input to allow re-selecting the same file
    };

    const handleRemoveProof = (indexToRemove: number) => {
        URL.revokeObjectURL(proofImages[indexToRemove]); // Clean up memory
        setProofImages(prev => prev.filter((_, index) => index !== indexToRemove));
        setProofImageFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    };
    
     const handleQualifyClick = (lead: Lead, action: 'converted' | 'not_converted') => {
        setActiveLeadId(lead.id);
        setLeadToQualify(lead);
        setQualificationAction(action);
        setIsConfirmingFeedback(true);
    };
    
    const handleConfirmFeedbackSubmit = async () => {
        if (!leadToQualify || !qualificationAction || !currentUser) return;

        setIsConfirmingFeedback(false);
        setIsSubmitting(true);

        try {
            let proofUrls: string[] = [];

            if (proofImageFiles.length > 0) {
                 const uploadPromises = proofImageFiles.map(async (file) => {
                    const fileExt = file.name.split('.').pop();
                    const fileName = `${currentUser.id}/${leadToQualify.id}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
                    const { data, error } = await supabase.storage
                        .from('prospectaifeedback')
                        .upload(fileName, file);

                    if (error) {
                        throw new Error(`Falha no upload da imagem: ${error.message}`);
                    }
                    
                    const { data: publicUrlData } = supabase.storage
                        .from('prospectaifeedback')
                        .getPublicUrl(data.path);
                    
                    return publicUrlData.publicUrl;
                });
                proofUrls = await Promise.all(uploadPromises);
            }

            const response = await fetch('https://webhook.triad3.io/webhook/prospeccao-feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    lead: leadToQualify,
                    colaborador: currentUser,
                    feedback: feedback,
                    qualificacao: qualificationAction === 'converted' ? 'Lead qualificado' : 'Lead não qualificado',
                    comprovante: proofUrls,
                }),
            });

            const result = await response.json();

            if (!response.ok || !result.resposta) {
                throw new Error(result.resposta || 'Ocorreu um erro ao enviar o feedback.');
            }

            const newFeedbackEntry: Feedback = {
                id: `fb-${Date.now()}`,
                text: feedback,
                createdAt: new Date().toISOString(),
                proofUrl: proofUrls.join(','), // Store as comma-separated string locally
            };

            const updatedLead: Lead = {
                ...leadToQualify,
                status: qualificationAction,
                qualificationStatus: qualificationAction === 'converted' ? 'Lead qualificado' : 'Lead não qualificado',
                feedbacks: [...leadToQualify.feedbacks, newFeedbackEntry],
                qualifiedAt: new Date().toISOString(),
            };
            
            updateLead(updatedLead);
            setFeedbackResult({ type: 'success', message: result.resposta });

        } catch (error) {
            setFeedbackResult({ type: 'error', message: error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseFeedbackResultModal = () => {
        setFeedbackResult(null);
        setLeadToQualify(null);
        setQualificationAction(null);
        setActiveLeadId(null);
        setFeedback('');
        setProofImages([]);
        setProofImageFiles([]);
    };

    const handleScheduleSubmit = async (leadId: string, meetingDateTime: string, feedbackText: string) => {
        const currentLead = myLeads.find(l => l.id === leadId);
        if (!currentLead) return;

        const newFeedback: Feedback = {
            id: `fb-${Date.now()}`,
            text: `Reunião agendada. Anotações: ${feedbackText || 'Nenhuma'}`,
            createdAt: new Date().toISOString(),
        };

        const updatedLead: Lead = {
            ...currentLead,
            status: 'scheduled',
            scheduledAt: meetingDateTime,
            feedbacks: [...currentLead.feedbacks, newFeedback],
        };
        
        updateLead(updatedLead);
        setIsScheduling(false);
        setActiveLeadId(null);
        setLeadToSchedule(null);
        setFeedback('');
    };
    
    const pipelineColumns = useMemo(() => {
        const newLeads = myLeads.filter(l => l.status === 'new');
        const contacted = myLeads.filter(l => l.status === 'contacted');
        const scheduled = myLeads.filter(l => l.status === 'scheduled');
        const finalized = myLeads.filter(l => l.status === 'converted' || l.status === 'not_converted');
        
        return [
            { id: 'new', title: 'Novos Leads', leads: newLeads },
            { id: 'contacted', title: 'Em Contato', leads: contacted },
            { id: 'scheduled', title: 'Agendados', leads: scheduled },
            { id: 'finalized', title: 'Finalizados', leads: finalized }
        ];
    }, [myLeads]);
    
    // Stats
    const myLeadsCount = externalLeads.length + externalUnqualifiedLeads.length;
    const qualifiedLeadsCount = externalLeads.length;
    const unqualifiedLeadsCount = externalUnqualifiedLeads.length;
    const contactedLeadsCount = pipelineColumns.find(c => c.id === 'contacted')?.leads.length || 0;
    const reallocatedLeadsCount = myLeads.filter(l => l.reassignmentHistory && l.reassignmentHistory.length > 0).length;
    
    const StatCard = ({ title, value, color }: { title: string, value: number, color: string }) => (
         <div className="bg-card p-4 rounded-lg shadow-lg border border-border text-center">
            <h3 className="text-sm font-semibold text-text-secondary">{title}</h3>
            <p className={`text-4xl font-bold ${color}`}>{value}</p>
        </div>
    );

    return (
        <div className="space-y-8">
            {isStartingProspecting && <ProspectingLoadingOverlay />}
            {isSubmitting && <LoadingFeedbackOverlay />}
            
            <ConfirmationModal
                isOpen={isConfirming}
                onClose={() => setIsConfirming(false)}
                onConfirm={handleConfirmStartProspecting}
                lead={leadToProspect}
            />

            <FeedbackConfirmationModal
                isOpen={isConfirmingFeedback}
                onClose={() => setIsConfirmingFeedback(false)}
                onConfirm={handleConfirmFeedbackSubmit}
                lead={leadToQualify}
                action={qualificationAction}
            />

            <ResultModal
                isOpen={!!prospectingResult}
                onClose={handleCloseResultModal}
                result={prospectingResult}
            />

            <ResultModal
                isOpen={!!feedbackResult}
                onClose={handleCloseFeedbackResultModal}
                result={feedbackResult}
            />
            
            <ScheduleMeetingModal
                isOpen={isScheduling}
                onClose={() => {
                    setIsScheduling(false);
                    setLeadToSchedule(null);
                }}
                lead={leadToSchedule}
                onSubmit={handleScheduleSubmit}
                feedback={feedback}
                onFeedbackChange={handleFeedbackChange}
            />

            <div>
                <h1 className="text-4xl font-bold text-text">Seu Pipeline de Prospecção</h1>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <StatCard title="Meus Leads Atribuídos" value={myLeadsCount} color="text-primary"/>
                <StatCard title="Leads Qualificados" value={qualifiedLeadsCount} color="text-green-400"/>
                <StatCard title="Em Atendimento" value={contactedLeadsCount} color="text-yellow-400"/>
                <StatCard title="Leads Não Qualificados" value={unqualifiedLeadsCount} color="text-red-400"/>
                <StatCard title="Leads Remanejados" value={reallocatedLeadsCount} color="text-purple-400"/>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
                {pipelineColumns.map(column => (
                    <div key={column.id} className="bg-background/50 p-4 rounded-lg border border-border/50">
                        <h2 className="text-lg font-bold text-text-secondary mb-4 sticky top-[88px] bg-background py-2">
                            {column.title} ({column.leads.length})
                        </h2>
                        <div className="space-y-4">
                            {column.leads.length > 0 ? (
                                column.leads.map(lead => (
                                    <LeadCard 
                                        key={lead.id} 
                                        lead={lead}
                                        activeLeadId={activeLeadId}
                                        feedback={activeLeadId === lead.id ? feedback : ''}
                                        isSubmitting={isSubmitting}
                                        proofImages={activeLeadId === lead.id ? proofImages : []}
                                        onStartProspecting={lead.status === 'new' ? handleInitiateProspectingFlow : handleStartProspecting}
                                        onFeedbackChange={handleFeedbackChange}
                                        onQualifyClick={handleQualifyClick}
                                        onFileSelect={handleFileSelect}
                                        onRemoveProof={handleRemoveProof}
                                        onScheduleClick={() => {
                                            setLeadToSchedule(lead);
                                            setIsScheduling(true);
                                            setActiveLeadId(lead.id);
                                        }}
                                        openPhotoViewer={openPhotoViewer}
                                    />
                                ))
                            ) : (
                                <div className="text-center p-8 border-2 border-dashed border-border rounded-lg">
                                    <p className="text-text-secondary">Nenhum lead nesta etapa.</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProspectingPage;