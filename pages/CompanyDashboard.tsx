

import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useAppContext } from '../App';
import { User, UserRole, Lead } from '../types';

// --- ÍCONES ---
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
const ArrowLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
);
const UsersIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const FileTextIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>;
const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const XCircleIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>;
const CalendarIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const CopyIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>;
const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="20 6 9 17 4 12"></polyline></svg>;
const ChartBarIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="20" y2="10" /><line x1="18" x2="18" y1="20" y2="4" /><line x1="6" x2="6" y1="20" y2="16" /></svg>;
const FilterIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>;
const BroomIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19.4 11.6 18.2 21H6.8l-1.2-9.4" /><path d="m2 11.6 4.3-8.8c.2-.4.6-.6 1-.6h9.4c.4 0 .8.2 1 .6L22 11.6" /><path d="M12 2v2.6" /><path d="M10 11.6V21" /><path d="M14 11.6V21" /></svg>;
const FlagIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>;

// --- MODAL COMPONENT ---
const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-md' }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; maxWidth?: string; }) => {
    if (!isOpen) return null;
    const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    useEffect(() => {
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4" aria-modal="true" role="dialog" onClick={onClose}>
            <div className={`bg-card rounded-lg shadow-xl w-full ${maxWidth} border border-border`} onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b border-border">
                    <h2 className="text-xl font-bold text-primary">{title}</h2>
                    <button onClick={onClose} className="text-text-secondary hover:text-text p-1 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
                <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
            </div>
        </div>
    );
};

// --- SETTINGS TAB COMPONENTS ---
const SettingsContent = ({ currentUser, managers, onRemoveManager, onAddManager }: { currentUser: User, managers: User[], onRemoveManager: (userId: string) => void, onAddManager: (managerData: Omit<User, 'id' | 'approved' | 'role' | 'companyId' | 'position' | 'profilePictureUrl'>) => string }) => {
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [managerToRemove, setManagerToRemove] = useState<User | null>(null);
    const [newManagerData, setNewManagerData] = useState({ name: '', email: '', phone: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);

    const handleNewManagerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewManagerData({ ...newManagerData, [name]: name === 'email' ? value.toLowerCase() : value });
    };

    const handleAddManagerSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const result = onAddManager(newManagerData);
        alert(result);
        if (result.includes('sucesso')) {
            setAddModalOpen(false);
            setNewManagerData({ name: '', email: '', phone: '', password: '' });
        }
    };
    
    const handleConfirmRemove = () => { if(managerToRemove) { onRemoveManager(managerToRemove.id); setManagerToRemove(null); }};
    
    const inputStyle = "w-full text-text px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary";
    const btnPrimary = "px-6 py-2 rounded-md text-sm font-bold text-background bg-primary hover:bg-primary-hover hover:shadow-glow-primary transition-all";
    const btnSecondary = "px-4 py-2 rounded-md text-sm font-bold text-white bg-secondary hover:opacity-90 transition-opacity";
    const btnCancel = "px-4 py-2 rounded-md text-sm font-medium bg-border hover:bg-border/70 text-text";
    const btnDanger = "px-6 py-2 rounded-md text-sm font-bold text-white bg-red-600 hover:bg-red-500";

    return (
        <div className="space-y-10">
            <div className="bg-card p-6 rounded-lg shadow-lg border border-border max-w-lg">
                <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-semibold text-primary">Gerenciar Gestores</h2><button onClick={() => setAddModalOpen(true)} className={btnSecondary}>Adicionar</button></div>
                <div className="space-y-3">
                    {managers.map(manager => (
                        <div key={manager.id} className="flex flex-col sm:flex-row justify-between items-center gap-2 p-3 bg-background rounded-md border border-border">
                           <div className="text-center sm:text-left"><p className="font-semibold text-text">{manager.name}</p><p className="text-sm text-text-secondary">{manager.email}</p></div>
                           <button onClick={() => setManagerToRemove(manager)} disabled={manager.id === currentUser.id} className="text-sm text-red-500 hover:underline disabled:text-gray-500 disabled:no-underline disabled:cursor-not-allowed">Remover</button>
                        </div>
                    ))}
                </div>
            </div>
            <Modal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} title="Adicionar Novo Gestor">
                <form onSubmit={handleAddManagerSubmit} className="space-y-4">
                    <input name="name" type="text" placeholder="Nome Completo" value={newManagerData.name} onChange={handleNewManagerChange} className={inputStyle} required />
                    <input name="email" type="email" placeholder="E-mail" value={newManagerData.email} onChange={handleNewManagerChange} className={inputStyle} required />
                    <input name="phone" type="tel" placeholder="Telefone" value={newManagerData.phone} onChange={handleNewManagerChange} className={inputStyle} required />
                    <div className="relative"><input name="password" type={showPassword ? 'text' : 'password'} placeholder="Senha Temporária" value={newManagerData.password} onChange={handleNewManagerChange} className={`${inputStyle} pr-10`} required /><button type="button" onClick={() => setShowPassword(s => !s)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-secondary hover:text-primary" aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}>{showPassword ? <EyeOffIcon /> : <EyeIcon />}</button></div>
                    <div className="flex justify-end gap-3 pt-2"><button type="button" onClick={() => setAddModalOpen(false)} className={btnCancel}>Cancelar</button><button type="submit" className={btnPrimary}>Adicionar</button></div>
                </form>
            </Modal>
            <Modal isOpen={!!managerToRemove} onClose={() => setManagerToRemove(null)} title="Confirmar Remoção">
                <div><p className="text-text">Tem certeza que deseja remover <span className="font-bold text-primary">{managerToRemove?.name}</span>?</p><p className="text-sm text-red-400">Esta ação é irreversível.</p><div className="flex justify-end gap-3 mt-6"><button onClick={() => setManagerToRemove(null)} className={btnCancel}>Cancelar</button><button onClick={handleConfirmRemove} className={btnDanger}>Remover</button></div></div>
            </Modal>
        </div>
    );
};

// --- REASSIGN LEAD MODAL ---
const ReassignLeadModal = ({ isOpen, onClose, lead, employees, onReassign }: { isOpen: boolean; onClose: () => void; lead: Lead | null; employees: User[]; onReassign: (leadId: string, newAssigneeId: string) => void; }) => {
    const [selectedEmployee, setSelectedEmployee] = useState('');
    useEffect(() => { setSelectedEmployee(''); }, [isOpen]);
    if (!isOpen || !lead) return null;

    const availableEmployees = employees.filter(emp => emp.id !== lead.assignedTo);
    const handleSubmit = () => { if (selectedEmployee) { onReassign(lead.id, selectedEmployee); onClose(); } else { alert('Por favor, selecione um colaborador.'); } };
    
    const inputStyle = "w-full text-text px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary";
    const btnPrimary = "px-6 py-2 rounded-md text-sm font-bold text-background bg-primary hover:bg-primary-hover hover:shadow-glow-primary transition-all";
    const btnCancel = "px-4 py-2 rounded-md text-sm font-medium bg-border hover:bg-border/70 text-text";

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Reatribuir Lead: ${lead.name || lead.phone}`}>
            <div className="space-y-4"><p className="text-text-secondary">Selecione o novo colaborador responsável por este lead.</p><select value={selectedEmployee} onChange={e => setSelectedEmployee(e.target.value)} className={inputStyle}><option value="" disabled>Selecione um colaborador...</option>{availableEmployees.map(emp => (<option key={emp.id} value={emp.id}>{emp.name} ({emp.position})</option>))}</select><div className="flex justify-end gap-3 mt-6"><button onClick={onClose} className={btnCancel}>Cancelar</button><button onClick={handleSubmit} className={btnPrimary}>Confirmar</button></div></div>
        </Modal>
    );
};

// --- ENHANCED STAT CARD ---
const EnhancedStatCard = ({ title, value, icon, colorClass }: { title: string; value: string | number; icon: React.ReactNode; colorClass: string; }) => (
    <div className="bg-card p-6 rounded-lg shadow-lg border border-border flex items-start justify-between group transition-all duration-300 hover:border-primary/80 hover:shadow-glow-primary-light h-full">
        <div>
            <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider">{title}</h3>
            <p className="mt-2 text-4xl font-bold text-text">{value}</p>
        </div>
        <div className={`p-3 rounded-lg bg-background group-hover:bg-primary/20 transition-colors duration-300 ${colorClass}`}>
            {icon}
        </div>
    </div>
);

// --- MULTI-SELECT DROPDOWN for Analytics ---
const MultiSelectDropdown = ({ label, options, selected, onToggle, onClear }: { label: string; options: string[]; selected: string[]; onToggle: (option: string) => void; onClear: () => void; }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const buttonText = selected.length > 0 ? `${label} (${selected.length})` : label;

    return (
        <div className="relative flex-grow" ref={dropdownRef}>
            <button type="button" onClick={() => setIsOpen(!isOpen)} className="w-full bg-background border border-border text-text rounded-md py-2 px-3 text-left transition-colors focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/40 flex justify-between items-center">
                <span className="truncate">{buttonText}</span>
                <svg className={`w-4 h-4 ml-2 transition-transform flex-shrink-0 ${isOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-card border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {options.map(option => (
                        <label key={option} className="flex items-center px-4 py-2 text-sm text-text-secondary hover:bg-background cursor-pointer">
                            <input type="checkbox" className="h-4 w-4 rounded bg-background border-border text-primary focus:ring-primary" checked={selected.includes(option)} onChange={() => onToggle(option)} />
                            <span className="ml-3 truncate">{option}</span>
                        </label>
                    ))}
                    {options.length > 5 && selected.length > 0 && <div className="border-t border-border"><button onClick={onClear} className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-background">Limpar Seleção</button></div>}
                </div>
            )}
        </div>
    );
};


// --- NOVA FUNCIONALIDADE: GRÁFICO DE LINHA ---
const generateColor = (index: number) => {
    const hue = (index * 137.508) % 360; // Golden angle
    return `hsl(${hue}, 70%, 60%)`;
};

const LineChart = ({ data }: { data: { labels: string[]; datasets: { label: string; data: number[]; stroke: string; }[]; } }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [tooltip, setTooltip] = useState<{ x: number; y: number; content: { label: string; value: number; color: string; }[]; visible: boolean } | null>(null);
    const { labels, datasets } = data;

    const padding = { top: 20, right: 20, bottom: 60, left: 40 };

    const svgWidth = 800;
    const svgHeight = 400;

    const chartWidth = svgWidth - padding.left - padding.right;
    const chartHeight = svgHeight - padding.top - padding.bottom;

    const maxY = Math.max(10, ...datasets.flatMap(d => d.data));

    const xScale = (index: number) => padding.left + (index / (labels.length - 1)) * chartWidth;
    const yScale = (value: number) => chartHeight + padding.top - (value / maxY) * chartHeight;

    const createPath = (data: number[]) => {
        return data.map((point, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(point)}`).join(' ');
    };

    const handleMouseOver = (e: React.MouseEvent, pointIndex: number) => {
        const content = datasets.map(dataset => ({
            label: dataset.label,
            value: dataset.data[pointIndex],
            color: dataset.stroke,
        })).filter(item => item.value > 0);
        
        if(content.length > 0) {
            setTooltip({
                x: xScale(pointIndex),
                y: e.clientY - (svgRef.current?.getBoundingClientRect().top || 0),
                content: content,
                visible: true,
            });
        }
    };
    
    return (
        <div className="relative h-[400px] w-full text-xs text-text-secondary">
             <svg ref={svgRef} viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full">
                {/* Y-axis grid lines and labels */}
                {Array.from({ length: 6 }).map((_, i) => {
                    const y = padding.top + (i / 5) * chartHeight;
                    const value = Math.round(maxY * (1 - i / 5));
                    return (
                        <g key={i}>
                            <line x1={padding.left} y1={y} x2={svgWidth - padding.right} y2={y} stroke="currentColor" strokeOpacity="0.1" />
                            <text x={padding.left - 8} y={y + 4} textAnchor="end" fill="currentColor">{value}</text>
                        </g>
                    );
                })}

                {/* X-axis labels */}
                {labels.map((label, i) => (
                    <text key={i} x={xScale(i)} y={svgHeight - padding.bottom + 20} textAnchor="middle" fill="currentColor">{label}</text>
                ))}
                
                 {/* Data Lines */}
                {datasets.map((dataset, i) => (
                    <path key={i} d={createPath(dataset.data)} fill="none" stroke={dataset.stroke} strokeWidth="2.5" />
                ))}

                 {/* Data Points & Hover Area */}
                {labels.map((_, i) => (
                    <g key={i}>
                        <rect 
                            x={xScale(i) - (chartWidth / (labels.length -1) / 2)} 
                            y={padding.top} 
                            width={chartWidth / (labels.length -1)} 
                            height={chartHeight}
                            fill="transparent"
                            onMouseOver={(e) => handleMouseOver(e, i)}
                            onMouseOut={() => setTooltip(null)}
                        />
                        {datasets.map((dataset, j) => (
                             <circle key={j} cx={xScale(i)} cy={yScale(dataset.data[i])} r="4" fill={dataset.stroke} />
                        ))}
                    </g>
                ))}
            </svg>
            {tooltip?.visible && (
                <div className="absolute bg-card border border-border p-3 rounded-md shadow-lg pointer-events-none transition-transform" style={{ top: `${tooltip.y - 80}px`, left: `${tooltip.x + 10}px`}}>
                    <p className="font-bold text-text mb-2">{labels[Math.round((tooltip.x - padding.left) / (chartWidth / (labels.length - 1)))]}</p>
                    {tooltip.content.map(item => (
                        <div key={item.label} className="flex items-center gap-2">
                           <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                           <span>{item.label}: <span className="font-bold text-text">{item.value}</span></span>
                        </div>
                    ))}
                </div>
            )}
             <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 mt-4">
                {datasets.map((d, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.stroke }} />
                        <span>{d.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};


// --- MAIN DASHBOARD COMPONENT ---
const LoadingSpinner = () => (
    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
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
};

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

type CompanyDashboardTab = 'dashboard' | 'collaborators' | 'analytics' | 'settings';
type CompanyDashboardView = 'main' | 'collaborators' | 'collaborator_details' | 'finished_leads';

const CompanyDashboard = () => {
    const { currentUser, users, leads, deleteUser, addCompanyManager, requestProof, reassignLead, getUserById, openPhotoViewer } = useAppContext();
    const [activeTab, setActiveTab] = useState<CompanyDashboardTab>('dashboard');
    const [employeeToRemove, setEmployeeToRemove] = useState<User | null>(null);
    const [leadToReassign, setLeadToReassign] = useState<Lead | null>(null);
    const [leadDetailModal, setLeadDetailModal] = useState<Lead | null>(null);
    const [copySuccess, setCopySuccess] = useState('');
    
    // States for Analytics Tab
    const [analyticsView, setAnalyticsView] = useState<'summary' | 'chart'>('summary');
    const [viewingMonth, setViewingMonth] = useState<string | null>(null);
    const [detailedLeads, setDetailedLeads] = useState<{ title: string; leads: Lead[] } | null>(null);
    const [chartType, setChartType] = useState<'performance' | 'distribution'>('performance');
    
    // States for CRM integration
    const [isLoadingCrm, setIsLoadingCrm] = useState(false);
    const [crmError, setCrmError] = useState<string | null>(null);

    // States for Dashboard View
    const [dashboardView, setDashboardView] = useState<CompanyDashboardView>('main');
    type EmployeeWithLeads = User & { leads: Lead[]; qualified: number; unqualified: number; };
    const [selectedCollaborator, setSelectedCollaborator] = useState<EmployeeWithLeads | null>(null);


    const companyData = useMemo(() => {
        if (!currentUser) return { employees: [], totalLeads: 0, managers: [], allLeads: [], qualifiedLeads: 0, unqualifiedLeads: 0, leadsThisMonth: 0 };
        
        const companyEmployeeIds = users.filter(u => u.companyId === currentUser.companyId).map(u => u.id);
        const allLeads = leads.filter(lead => companyEmployeeIds.includes(lead.assignedTo));
        
        const employees = users.filter(user => user.companyId === currentUser.companyId && user.role === UserRole.COLLABORATOR);
        const managers = users.filter(user => user.companyId === currentUser.companyId && user.role === UserRole.COMPANY);
        
        const employeesWithLeads = employees.map(employee => {
            const employeeLeads = allLeads.filter(lead => lead.assignedTo === employee.id);
            const qualified = employeeLeads.filter(l => l.status === 'converted').length;
            const unqualified = employeeLeads.filter(l => l.status === 'not_converted').length;
            return { ...employee, leads: employeeLeads, qualified, unqualified };
        });
        
        const qualifiedLeads = allLeads.filter(l => l.status === 'converted').length;
        const unqualifiedLeads = allLeads.filter(l => l.status === 'not_converted').length;

        const now = new Date();
        const leadsThisMonth = allLeads.filter(l => { const d = new Date(l.receivedAt); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); }).length;

        return { employees: employeesWithLeads, totalLeads: allLeads.length, managers, allLeads, qualifiedLeads, unqualifiedLeads, leadsThisMonth };
    }, [currentUser, users, leads]);

    const leadsByMonth = useMemo(() => {
        const grouped = companyData.allLeads.reduce((acc, lead) => {
            const date = new Date(lead.receivedAt);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            const monthLabel = date.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
            if (!acc[monthKey]) acc[monthKey] = { label: monthLabel, leads: [] };
            acc[monthKey].leads.push(lead);
            return acc;
        }, {} as Record<string, { label: string, leads: Lead[] }>);

        return Object.entries(grouped)
            .sort(([keyA], [keyB]) => keyB.localeCompare(keyA))
            .map(([_, value]) => ({ month: value.label, leads: value.leads }));
    }, [companyData.allLeads]);
    
    // --- ADVANCED ANALYTICS STATES & LOGIC ---
    const [periodType, setPeriodType] = useState<'monthly' | 'weekly' | 'daily'>('monthly');
    const [selectedPeriods, setSelectedPeriods] = useState<string[]>([]);
    const [selectedCollaborators, setSelectedCollaborators] = useState<string[]>([]);
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['converted', 'not_converted']);

    const getWeekNumberLabel = (d: Date) => {
        const firstDayOfYear = new Date(d.getFullYear(), 0, 1);
        const pastDaysOfYear = (d.getTime() - firstDayOfYear.getTime()) / 86400000;
        return `Semana ${Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)}, ${d.getFullYear()}`;
    };

    const filterOptions = useMemo(() => {
        const periods = [...new Set(companyData.allLeads.map(lead => {
            const date = new Date(lead.receivedAt);
            if (periodType === 'daily') return date.toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' });
            if (periodType === 'weekly') return getWeekNumberLabel(date);
            return date.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
        }))];

        const collaborators = companyData.employees.map(e => e.name);
        const statuses = [{id: 'converted', name: 'Qualificado'}, {id: 'not_converted', name: 'Não Qualificado'}];
        
        periods.sort((a, b) => {
            if(periodType === 'daily') {
                const [dayA, monthA, yearA] = a.split('/').map(Number);
                const dateA = new Date(yearA, monthA - 1, dayA);
                const [dayB, monthB, yearB] = b.split('/').map(Number);
                const dateB = new Date(yearB, monthB - 1, dayB);
                return dateB.getTime() - dateA.getTime();
            }
            if(periodType === 'monthly') {
                 const monthMap: { [key: string]: number } = { 'janeiro': 0, 'fevereiro': 1, 'março': 2, 'abril': 3, 'maio': 4, 'junho': 5, 'julho': 6, 'agosto': 7, 'setembro': 8, 'outubro': 9, 'novembro': 10, 'dezembro': 11 };
                const [monthStrA, yearA] = a.split(' de ');
                const dateA = new Date(Number(yearA), monthMap[monthStrA.toLowerCase()]);
                const [monthStrB, yearB] = b.split(' de ');
                const dateB = new Date(Number(yearB), monthMap[monthStrB.toLowerCase()]);
                return dateB.getTime() - dateA.getTime();
            }
             // Logic for 'weekly'
            const yearA = Number(a.split(', ')[1] || new Date().getFullYear());
            const weekA = parseInt(a.match(/\d+/)?.[0] || '1');
            const dateA = new Date(yearA, 0, (weekA - 1) * 7 + 1);
            
            const yearB = Number(b.split(', ')[1] || new Date().getFullYear());
            const weekB = parseInt(b.match(/\d+/)?.[0] || '1');
            const dateB = new Date(yearB, 0, (weekB - 1) * 7 + 1);

            return dateB.getTime() - dateA.getTime();
        });

        return { periods, collaborators, statuses };
    }, [companyData.allLeads, companyData.employees, periodType]);

    const filteredLeads = useMemo(() => {
         let leads = companyData.allLeads;
         if (selectedCollaborators.length > 0) {
            const collaboratorIds = companyData.employees.filter(e => selectedCollaborators.includes(e.name)).map(e => e.id);
            leads = leads.filter(l => collaboratorIds.includes(l.assignedTo));
        }
        if (selectedStatuses.length > 0 && chartType === 'performance') {
            leads = leads.filter(l => selectedStatuses.includes(l.status));
        }
        return leads;
    }, [companyData.allLeads, companyData.employees, selectedCollaborators, selectedStatuses, chartType]);

    const performanceChartData = useMemo(() => {
        const grouped = filteredLeads.reduce((acc, lead) => {
            const date = new Date(lead.receivedAt);
            let key: string = '';
            if (periodType === 'daily') key = date.toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' });
            else if (periodType === 'weekly') key = getWeekNumberLabel(date);
            else key = date.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });

            if (!acc[key]) acc[key] = { qualified: 0, not_qualified: 0 };
            if (lead.status === 'converted') acc[key].qualified++;
            else if (lead.status === 'not_converted') acc[key].not_qualified++;
            return acc;
        }, {} as Record<string, { qualified: number; not_qualified: number; }>);
        
        const periodsToDisplay = selectedPeriods.length > 0 ? selectedPeriods : filterOptions.periods.slice(0, 12);
        
        return {
            labels: periodsToDisplay.map(label => periodType === 'daily' ? label.substring(0,5) : label.split(' ')[0]).reverse(),
            datasets: [
                { label: 'Qualificados', data: periodsToDisplay.map(p => grouped[p]?.qualified || 0).reverse(), stroke: 'hsl(142 76% 44%)' },
                { label: 'Não Qualificados', data: periodsToDisplay.map(p => grouped[p]?.not_qualified || 0).reverse(), stroke: 'hsl(0 84% 60%)' },
            ]
        };
    }, [filteredLeads, periodType, selectedPeriods, filterOptions.periods]);

     const distributionChartData = useMemo(() => {
        const grouped = filteredLeads.reduce((acc, lead) => {
            const date = new Date(lead.receivedAt);
            let key: string = '';
            if (periodType === 'daily') key = date.toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' });
            else if (periodType === 'weekly') key = getWeekNumberLabel(date);
            else key = date.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });

            if (!acc[key]) acc[key] = {};
            const collaboratorName = getUserById(lead.assignedTo)?.name || 'Desconhecido';
            acc[key][collaboratorName] = (acc[key][collaboratorName] || 0) + 1;
            return acc;
        }, {} as Record<string, Record<string, number>>);

        const periodsToDisplay = selectedPeriods.length > 0 ? selectedPeriods : filterOptions.periods.slice(0, 12);
        const collaboratorsInFilter = selectedCollaborators.length > 0 ? selectedCollaborators : filterOptions.collaborators;
        
        return {
            labels: periodsToDisplay.map(label => periodType === 'daily' ? label.substring(0,5) : label.split(' ')[0]).reverse(),
            datasets: collaboratorsInFilter.map((name, index) => ({
                label: name,
                data: periodsToDisplay.map(period => grouped[period]?.[name] || 0).reverse(),
                stroke: generateColor(index),
            })),
        };
    }, [filteredLeads, periodType, selectedPeriods, filterOptions.periods, selectedCollaborators, filterOptions.collaborators, getUserById]);
    
    const clearFilters = () => {
        setSelectedPeriods([]);
        setSelectedCollaborators([]);
        setSelectedStatuses(['converted', 'not_converted']);
    };


    const handleCopyCode = () => { if (!currentUser?.companyId) return; navigator.clipboard.writeText(currentUser.companyId).then(() => { setCopySuccess('Copiado!'); setTimeout(() => setCopySuccess(''), 2000); }); };

    const handleCrmClick = async () => {
        setIsLoadingCrm(true);
        setCrmError(null);
        try {
            const response = await fetch('https://webhook.triad3.io/webhook/prospectai-getcrm');
            if (!response.ok) {
                throw new Error(`Falha ao buscar o CRM. Status: ${response.status}`);
            }
            const data = await response.json();
            const url = data.resposta;

            if (url && typeof url === 'string' && url.startsWith('http')) {
                window.open(url, '_blank', 'noopener,noreferrer');
            } else {
                throw new Error('A resposta recebida não é um link válido ou está no formato incorreto.');
            }
        } catch (error) {
            console.error("Erro ao carregar CRM:", error);
            setCrmError(error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.');
        } finally {
            setIsLoadingCrm(false);
        }
    };

    useEffect(() => {
      // Reset sub-views when main tab changes to avoid state leakage
      setAnalyticsView('summary');
      setViewingMonth(null);
      setDetailedLeads(null);
      setDashboardView('main');
      setSelectedCollaborator(null);
    }, [activeTab]);
    
    useEffect(() => {
        setSelectedPeriods([]);
    }, [periodType]);

    if (!currentUser) return null;
    
    const TabButton = ({ tabId, children }: { tabId: CompanyDashboardTab; children: React.ReactNode }) => (
        <button onClick={() => setActiveTab(tabId)} className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${activeTab === tabId ? 'bg-primary text-background shadow-glow-primary-light' : 'text-text-secondary hover:bg-card hover:text-text'}`}>
            {children}
        </button>
    );

    const getInitials = (name: string) => !name ? '' : name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

    const renderMainDashboard = () => {
        const totalFinalized = companyData.qualifiedLeads + companyData.unqualifiedLeads;
        return (
            <div className="space-y-8 pt-4 animate-zoom-in">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div onClick={() => setDashboardView('collaborators')} className="cursor-pointer">
                         <EnhancedStatCard title="Colaboradores" value={companyData.employees.length} icon={<UsersIcon/>} colorClass="text-cyan-400"/>
                    </div>
                    <EnhancedStatCard title="Leads (Este Mês)" value={companyData.leadsThisMonth} icon={<CalendarIcon/>} colorClass="text-yellow-400"/>
                    <EnhancedStatCard title="Leads Distribuídos" value={companyData.totalLeads} icon={<FileTextIcon/>} colorClass="text-primary"/>
                    <div onClick={() => setDashboardView('finished_leads')} className="cursor-pointer">
                        <EnhancedStatCard title="Leads Finalizados" value={totalFinalized} icon={<FlagIcon/>} colorClass="text-purple-400"/>
                    </div>
                    <EnhancedStatCard title="Leads Qualificados" value={companyData.qualifiedLeads} icon={<CheckCircleIcon/>} colorClass="text-green-400"/>
                    <EnhancedStatCard title="Não Qualificados" value={companyData.unqualifiedLeads} icon={<XCircleIcon/>} colorClass="text-red-400"/>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-card p-6 rounded-lg shadow-lg border border-border">
                        <h2 className="text-xl font-semibold mb-4 text-primary">Desempenho da Equipe</h2>
                        <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
                            {companyData.employees.length > 0 ? companyData.employees.map(employee => {
                                const totalFinished = employee.qualified + employee.unqualified;
                                const conversionRate = totalFinished > 0 ? (employee.qualified / totalFinished) * 100 : 0;
                                return (
                                    <div key={employee.id} className="p-4 bg-background rounded-lg border border-border">
                                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                            <div className="flex items-center gap-4">
                                                {employee.profilePictureUrl ? <img src={employee.profilePictureUrl} alt={employee.name} className="h-12 w-12 rounded-full object-cover"/> : <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">{getInitials(employee.name)}</div>}
                                                <div>
                                                    <h4 className="text-lg font-bold text-text">{employee.name}</h4>
                                                    <p className="text-sm text-text-secondary">{employee.position}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 flex-shrink-0">
                                                <div className="text-center"><p className="text-sm text-text-secondary">Leads</p><p className="font-bold text-lg text-text">{employee.leads.length}</p></div>
                                                <div className="text-center"><p className="text-sm text-text-secondary">Conversão</p><p className="font-bold text-lg text-secondary">{conversionRate.toFixed(0)}%</p></div>
                                                <button onClick={() => setEmployeeToRemove(employee)} className="text-sm text-red-500 hover:underline">Remover</button>
                                            </div>
                                        </div>
                                        <div className="mt-4 space-y-2">
                                            <div className="flex justify-between text-xs text-text-secondary"><p>Qualificados: {employee.qualified}</p><p>Não Qualificados: {employee.unqualified}</p></div>
                                            <div className="w-full bg-border rounded-full h-2.5 flex"><div className="bg-green-500 h-2.5 rounded-l-full" style={{ width: `${conversionRate}%` }}></div><div className="bg-red-500 h-2.5 rounded-r-full" style={{ width: `${100 - conversionRate}%` }}></div></div>
                                        </div>
                                    </div>
                                );
                            }) : <p className="text-center text-text-secondary py-8">Nenhum colaborador cadastrado.</p>}
                        </div>
                    </div>
                    <div className="space-y-8">
                         <div className="bg-card p-6 rounded-lg shadow-lg border border-border">
                            <h3 className="text-lg font-semibold text-primary mb-3">Ações Rápidas</h3>
                            <div className="mt-2 flex items-center justify-between gap-4 p-3 bg-background rounded-md border border-border">
                                <div><h4 className="text-sm font-medium text-text-secondary">Código da Empresa</h4><p className="text-lg font-bold font-mono text-primary">{currentUser.companyId}</p></div>
                                <button onClick={handleCopyCode} className="bg-primary text-background px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-hover transition-all flex items-center justify-center gap-2 w-28">{copySuccess ? <CheckIcon /> : <CopyIcon />}{copySuccess || 'Copiar'}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderCollaboratorsList = () => (
        <div className="pt-4 animate-zoom-in">
            {activeTab === 'dashboard' && (
                <button onClick={() => setDashboardView('main')} className="flex items-center gap-2 mb-4 text-sm font-semibold text-text-secondary hover:text-primary transition-colors">
                    <ArrowLeftIcon /> Voltar para Visão Geral
                </button>
            )}
            <div className="bg-card p-6 rounded-lg shadow-lg border border-border">
                <h2 className="text-2xl font-semibold mb-6 text-primary">Colaboradores</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {companyData.employees.map(employee => (
                        <div key={employee.id} onClick={() => { setSelectedCollaborator(employee); setDashboardView('collaborator_details'); }} className="bg-background p-5 rounded-lg border border-border transition-all duration-300 hover:border-primary hover:shadow-glow-primary-light cursor-pointer space-y-4 flex flex-col justify-between">
                            <div className="flex items-center gap-4">
                                {employee.profilePictureUrl ? <img src={employee.profilePictureUrl} alt={employee.name} className="h-12 w-12 rounded-full object-cover"/> : <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">{getInitials(employee.name)}</div>}
                                <div>
                                    <h4 className="text-lg font-bold text-text">{employee.name}</h4>
                                    <p className="text-sm text-text-secondary">{employee.position}</p>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-border/50 text-center">
                                <p className="text-xs text-text-secondary uppercase">Leads Atribuídos</p>
                                <p className="text-3xl font-bold text-text">{employee.leads.length}</p>
                            </div>
                        </div>
                    ))}
                     {companyData.employees.length === 0 && <p className="text-center text-text-secondary py-8 col-span-full">Nenhum colaborador encontrado.</p>}
                </div>
            </div>
        </div>
    );
    
    const renderCollaboratorDetails = () => {
        if (!selectedCollaborator) return null;
        
        const backTarget = activeTab === 'dashboard' ? 'collaborators' : 'main';

        return (
            <div className="pt-4 animate-zoom-in">
                 <button onClick={() => { setDashboardView(backTarget); setSelectedCollaborator(null); }} className="flex items-center gap-2 mb-4 text-sm font-semibold text-text-secondary hover:text-primary transition-colors">
                    <ArrowLeftIcon /> Voltar para Colaboradores
                </button>
                <div className="bg-card p-6 rounded-lg shadow-lg border border-border">
                    <div className="flex flex-col sm:flex-row items-center gap-6 mb-6 pb-6 border-b border-border">
                        {selectedCollaborator.profilePictureUrl ? <img src={selectedCollaborator.profilePictureUrl} alt={selectedCollaborator.name} className="h-24 w-24 rounded-full object-cover"/> : <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-4xl">{getInitials(selectedCollaborator.name)}</div>}
                        <div className="text-center sm:text-left">
                            <h2 className="text-2xl font-semibold text-primary">{selectedCollaborator.name}</h2>
                            <p className="text-md text-text-secondary">{selectedCollaborator.position}</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <EnhancedStatCard title="Total de Leads Recebidos" value={selectedCollaborator.leads.length} icon={<FileTextIcon />} colorClass="text-primary" />
                        <EnhancedStatCard title="Leads Qualificados" value={selectedCollaborator.qualified} icon={<CheckCircleIcon />} colorClass="text-green-400" />
                        <EnhancedStatCard title="Leads Não Qualificados" value={selectedCollaborator.unqualified} icon={<XCircleIcon />} colorClass="text-red-400" />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-primary mb-4">Lista de Leads de {selectedCollaborator.name}</h3>
                    <div className="overflow-x-auto max-h-96 border border-border rounded-lg">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-background text-text-secondary uppercase sticky top-0">
                                <tr>
                                    <th className="p-3">Lead</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3">Data Recebimento</th>
                                </tr>
                            </thead>
                            <tbody className="bg-card divide-y divide-border/50">
                                {selectedCollaborator.leads.map(lead => (
                                    <tr key={lead.id}>
                                        <td className="p-3 font-medium text-text">{lead.name || lead.phone}</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(lead.status)}`}>
                                                {getStatusLabel(lead.status)}
                                            </span>
                                        </td>
                                        <td className="p-3 text-text-secondary">{new Date(lead.receivedAt).toLocaleString('pt-BR')}</td>
                                    </tr>
                                ))}
                                {selectedCollaborator.leads.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="p-8 text-center text-text-secondary">Este colaborador ainda não recebeu leads.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    const renderFinishedLeads = () => {
        const finishedLeads = companyData.allLeads.filter(
            l => l.status === 'converted' || l.status === 'not_converted'
        ).sort((a, b) => new Date(b.qualifiedAt || b.receivedAt).getTime() - new Date(a.qualifiedAt || a.receivedAt).getTime());
    
        return (
            <div className="pt-4 animate-zoom-in">
                <button onClick={() => setDashboardView('main')} className="flex items-center gap-2 mb-4 text-sm font-semibold text-text-secondary hover:text-primary transition-colors">
                    <ArrowLeftIcon /> Voltar para Visão Geral
                </button>
                <div className="bg-card p-6 rounded-lg shadow-lg border border-border">
                    <h2 className="text-2xl font-semibold mb-6 text-primary">Leads Finalizados ({finishedLeads.length})</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {finishedLeads.map(lead => (
                             <div key={lead.id} onClick={() => setLeadDetailModal(lead)} className="bg-background p-5 rounded-lg border border-border transition-all duration-300 hover:border-primary hover:shadow-glow-primary-light cursor-pointer space-y-3 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-lg font-bold text-text truncate pr-2">{lead.name || lead.phone}</h4>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full flex-shrink-0 ${getStatusClass(lead.status)}`}>
                                            {getStatusLabel(lead.status)}
                                        </span>
                                    </div>
                                    {lead.company && <p className="text-sm text-text-secondary">{lead.company}</p>}
                                </div>
                                <div className="pt-3 border-t border-border/50 text-sm">
                                    <p className="text-text-secondary">
                                        Colaborador: <span className="font-semibold text-text">{getUserById(lead.assignedTo)?.name || 'N/A'}</span>
                                    </p>
                                    <p className="text-text-secondary">
                                        Finalizado em: <span className="font-semibold text-text">{lead.qualifiedAt ? new Date(lead.qualifiedAt).toLocaleDateString('pt-BR') : 'N/A'}</span>
                                    </p>
                                </div>
                            </div>
                        ))}
                        {finishedLeads.length === 0 && <p className="text-center text-text-secondary py-8 col-span-full">Nenhum lead finalizado encontrado.</p>}
                    </div>
                </div>
            </div>
        );
    };

    const renderDashboardContent = () => {
        switch (dashboardView) {
            case 'collaborators':
                return renderCollaboratorsList();
            case 'collaborator_details':
                return renderCollaboratorDetails();
            case 'finished_leads':
                return renderFinishedLeads();
            case 'main':
            default:
                return renderMainDashboard();
        }
    };

     const renderCollaboratorsTab = () => {
        if (dashboardView === 'collaborator_details' && selectedCollaborator) {
            return renderCollaboratorDetails();
        }
        return renderCollaboratorsList();
    };
    
    const renderAnalytics = () => {
        const AnalyticsStatCard = ({ title, value, onClick, colorClass = "text-primary" }: { title: string, value: number, onClick: () => void, colorClass?: string }) => (
            <div onClick={onClick} className="bg-background p-4 rounded-lg border border-border text-center cursor-pointer transition-all hover:border-primary hover:shadow-glow-primary-light">
                <h4 className="text-sm font-semibold text-text-secondary">{title}</h4>
                <p className={`text-3xl font-bold ${colorClass}`}>{value}</p>
            </div>
        );

        if (detailedLeads) {
            return (
                <div className="pt-4 animate-zoom-in">
                    <button onClick={() => setDetailedLeads(null)} className="flex items-center gap-2 mb-4 text-sm font-semibold text-text-secondary hover:text-primary transition-colors"><ArrowLeftIcon /> Voltar para o resumo do mês</button>
                    <div className="bg-card p-6 rounded-lg shadow-lg border border-border">
                        <h3 className="text-xl font-semibold text-primary mb-4">{detailedLeads.title}</h3>
                        <div className="overflow-x-auto max-h-96">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-border/50 text-text-secondary uppercase sticky top-0"><tr><th className="p-3">Lead</th><th className="p-3">Colaborador</th><th className="p-3">Data Qualificação</th><th className="p-3">Data Distribuição</th><th className="p-3 text-center">Ações</th></tr></thead>
                                <tbody>
                                    {detailedLeads.leads.map(lead => (
                                        <tr key={lead.id} className="border-b border-border/30">
                                            <td className="p-3 font-medium text-text">{lead.name || lead.phone}</td>
                                            <td className="p-3 text-text-secondary">{getUserById(lead.assignedTo)?.name || 'N/A'}</td>
                                            <td className="p-3 text-text-secondary">{lead.qualifiedAt ? new Date(lead.qualifiedAt).toLocaleString('pt-BR') : 'N/A'}</td>
                                            <td className="p-3 text-text-secondary">{new Date(lead.receivedAt).toLocaleString('pt-BR')}</td>
                                            <td className="p-3 text-center"><button onClick={() => setLeadDetailModal(lead)} className="text-xs px-3 py-1 rounded bg-primary/20 text-primary hover:bg-primary/30 transition-colors">Detalhes</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {detailedLeads.leads.length === 0 && <p className="text-center p-8 text-text-secondary">Nenhum lead encontrado.</p>}
                        </div>
                    </div>
                </div>
            )
        }
        
        if (viewingMonth) {
            const monthLeads = leadsByMonth.find(({ month }) => month === viewingMonth)?.leads || [];
            const qualified = monthLeads.filter(l => l.status === 'converted');
            const unqualified = monthLeads.filter(l => l.status === 'not_converted');
            const distributed = monthLeads;
            
            return (
                <div className="pt-4 animate-zoom-in">
                    <button onClick={() => setViewingMonth(null)} className="flex items-center gap-2 mb-4 text-sm font-semibold text-text-secondary hover:text-primary transition-colors"><ArrowLeftIcon /> Voltar para todos os meses</button>
                    <h2 className="text-3xl font-bold text-text mb-6">Resumo de <span className="text-primary capitalize">{viewingMonth}</span></h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <AnalyticsStatCard title="Total de Leads Qualificados" value={qualified.length} onClick={() => setDetailedLeads({ title: `Leads Qualificados em ${viewingMonth}`, leads: qualified })} colorClass="text-green-400" />
                        <AnalyticsStatCard title="Total de Leads Não Qualificados" value={unqualified.length} onClick={() => setDetailedLeads({ title: `Leads Não Qualificados em ${viewingMonth}`, leads: unqualified })} colorClass="text-red-400" />
                        <AnalyticsStatCard title="Total de Leads no Mês" value={monthLeads.length} onClick={() => setDetailedLeads({ title: `Total de Leads em ${viewingMonth}`, leads: monthLeads })} />
                        <AnalyticsStatCard title="Total de Leads Distribuídos" value={distributed.length} onClick={() => setDetailedLeads({ title: `Leads Distribuídos em ${viewingMonth}`, leads: distributed })} />
                    </div>
                </div>
            )
        }
        
        return (
            <div className="space-y-8 pt-4">
                 <div className="flex items-center gap-2 p-1 bg-card rounded-lg border border-border self-start">
                    <button onClick={() => setAnalyticsView('summary')} className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${analyticsView === 'summary' ? 'bg-primary text-background' : 'text-text-secondary hover:bg-border'}`}>Resumo por Mês</button>
                    <button onClick={() => setAnalyticsView('chart')} className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${analyticsView === 'chart' ? 'bg-primary text-background' : 'text-text-secondary hover:bg-border'}`}>Gráfico de Desempenho</button>
                </div>

                {analyticsView === 'summary' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-zoom-in">
                        {leadsByMonth.map(({ month, leads }) => (
                            <div key={month} onClick={() => setViewingMonth(month)} className="bg-card p-6 rounded-lg shadow-lg border border-border cursor-pointer transition-all duration-300 hover:border-primary hover:shadow-glow-primary-light text-center">
                                <h3 className="text-xl font-bold text-primary capitalize">{month}</h3>
                                <p className="text-4xl font-extrabold text-text mt-2">{leads.length}</p>
                                <p className="text-sm text-text-secondary">Lead(s) recebido(s)</p>
                            </div>
                        ))}
                    </div>
                )}
                
                {analyticsView === 'chart' && (
                    <div className="space-y-6 pt-4 animate-zoom-in">
                        <div className="bg-card p-6 rounded-lg shadow-lg border border-border">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                                <h2 className="text-2xl font-semibold text-primary">Análise de Desempenho</h2>
                                <div className="flex items-center gap-2 p-1 bg-background rounded-lg border border-border self-start md:self-center">
                                    <button onClick={() => setChartType('performance')} className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${chartType === 'performance' ? 'bg-primary text-background' : 'text-text-secondary hover:bg-border'}`}>Geral</button>
                                    <button onClick={() => setChartType('distribution')} className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${chartType === 'distribution' ? 'bg-primary text-background' : 'text-text-secondary hover:bg-border'}`}>Por Funcionário</button>
                                </div>
                            </div>
                            
                            <div className="p-4 bg-background border border-border rounded-lg grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                                <div className="lg:col-span-1">
                                    <label className="text-xs font-semibold text-text-secondary">Agrupar por</label>
                                    <select value={periodType} onChange={e => setPeriodType(e.target.value as any)} className="w-full mt-1 bg-background border border-border text-text rounded-md py-2 px-3 focus:outline-none focus:border-primary">
                                        <option value="monthly">Mês</option>
                                        <option value="weekly">Semana</option>
                                        <option value="daily">Dia</option>
                                    </select>
                                </div>
                                <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                    <MultiSelectDropdown label="Período" options={filterOptions.periods} selected={selectedPeriods} onToggle={opt => setSelectedPeriods(p => p.includes(opt) ? p.filter(i => i !== opt) : [...p, opt])} onClear={() => setSelectedPeriods([])} />
                                    <MultiSelectDropdown label="Colaborador" options={filterOptions.collaborators} selected={selectedCollaborators} onToggle={opt => setSelectedCollaborators(p => p.includes(opt) ? p.filter(i => i !== opt) : [...p, opt])} onClear={() => setSelectedCollaborators([])} />
                                    {chartType === 'performance' && (
                                        <MultiSelectDropdown label="Status" options={filterOptions.statuses.map(s => s.name)} selected={selectedStatuses.map(s => s === 'converted' ? 'Qualificado' : 'Não Qualificado')} onToggle={opt => { const statusId = opt === 'Qualificado' ? 'converted' : 'not_converted'; setSelectedStatuses(p => p.includes(statusId) ? p.filter(i => i !== statusId) : [...p, statusId]); }} onClear={() => setSelectedStatuses([])} />
                                    )}
                                    <button onClick={clearFilters} className="flex items-center justify-center gap-2 w-full bg-border text-text-secondary rounded-md py-2 px-3 hover:bg-border/70 transition-colors"><BroomIcon /> Limpar</button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-card p-6 rounded-lg shadow-lg border border-border min-h-[480px]">
                           {(chartType === 'performance' && performanceChartData.datasets[0].data.length > 0) || (chartType === 'distribution' && distributionChartData.datasets.length > 0) ? (
                                <LineChart data={chartType === 'performance' ? performanceChartData : distributionChartData} />
                            ) : (
                                <div className="h-96 flex items-center justify-center flex-col text-center">
                                    <ChartBarIcon className="w-12 h-12 text-border mb-4"/>
                                    <h4 className="text-lg font-semibold text-text-secondary">Nenhum dado encontrado</h4>
                                    <p className="text-sm text-text-secondary/70">Tente ajustar seus filtros para visualizar os dados.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        )
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold text-text">Dashboard: <span className="text-primary">{currentUser.name}</span></h1>
                <p className="text-md text-text-secondary">Acompanhe o desempenho da sua equipe e gerencie sua conta.</p>
            </div>
            
            <div className="flex space-x-2 border-b border-border pb-2">
                <TabButton tabId="dashboard">Visão Geral</TabButton>
                <TabButton tabId="collaborators">Colaboradores</TabButton>
                <button 
                    onClick={handleCrmClick} 
                    disabled={isLoadingCrm}
                    className="px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 text-text-secondary hover:bg-card hover:text-text disabled:opacity-50 disabled:cursor-wait flex items-center gap-2"
                >
                    {isLoadingCrm && <LoadingSpinner />}
                    CRM
                </button>
                <TabButton tabId="analytics">Análise de Leads</TabButton>
                <TabButton tabId="settings">Configurações</TabButton>
            </div>
            
            {activeTab === 'dashboard' && renderDashboardContent()}
            {activeTab === 'collaborators' && renderCollaboratorsTab()}
            {activeTab === 'analytics' && renderAnalytics()}
            {activeTab === 'settings' && <div className="pt-4 animate-zoom-in"><SettingsContent currentUser={currentUser} managers={companyData.managers} onRemoveManager={deleteUser} onAddManager={addCompanyManager} /></div>}

            <Modal isOpen={!!crmError} onClose={() => setCrmError(null)} title="Erro ao Carregar CRM">
                <p className="text-text-secondary">{crmError}</p>
                <div className="flex justify-end mt-4">
                    <button onClick={() => setCrmError(null)} className="px-4 py-2 rounded-md text-sm font-medium bg-border hover:bg-border/70 text-text">
                        Fechar
                    </button>
                </div>
            </Modal>

            <Modal isOpen={!!employeeToRemove} onClose={() => setEmployeeToRemove(null)} title="Confirmar Remoção">
                 <div><p className="text-text">Remover <span className="font-bold text-primary">{employeeToRemove?.name}</span>?</p><p className="text-sm text-red-400">Esta ação é irreversível.</p><div className="flex justify-end gap-3 mt-6"><button onClick={() => setEmployeeToRemove(null)} className="px-4 py-2 rounded-md text-sm font-medium bg-border hover:bg-border/70 text-text">Cancelar</button><button onClick={() => {if(employeeToRemove) deleteUser(employeeToRemove.id); setEmployeeToRemove(null);}} className="px-6 py-2 rounded-md text-sm font-bold text-white bg-red-600 hover:bg-red-500">Remover</button></div></div>
            </Modal>
            
            <ReassignLeadModal isOpen={!!leadToReassign} onClose={() => setLeadToReassign(null)} lead={leadToReassign} employees={companyData.employees} onReassign={reassignLead} />
            
            <Modal isOpen={!!leadDetailModal} onClose={() => setLeadDetailModal(null)} title={`Detalhes de: ${leadDetailModal?.name || 'Lead'}`} maxWidth="max-w-2xl">
                {leadDetailModal && (
                    <div className="space-y-6">
                        <div>
                            <h4 className="text-lg font-semibold text-primary mb-2">Detalhes Iniciais</h4>
                            <div className="bg-background border border-border p-4 rounded-lg">
                                <p className="text-text whitespace-pre-wrap">{leadDetailModal.details || 'Nenhum detalhe inicial fornecido.'}</p>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold text-primary mb-2">Histórico de Atendimento</h4>
                            {leadDetailModal.feedbacks.length > 0 ? (
                                <ul className="space-y-3 text-sm max-h-64 overflow-y-auto pr-2">
                                    {leadDetailModal.feedbacks.map(fb => {
                                        const proofUrls = fb.proofUrl ? fb.proofUrl.split(',') : [];
                                        return (
                                            <li key={fb.id} className="p-3 bg-background rounded-md border border-border text-text-secondary">
                                                <p className="mb-2">
                                                    <span className="font-semibold text-text/90">{new Date(fb.createdAt).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}:</span> {fb.text}
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
        </div>
    );
};

export default CompanyDashboard;
