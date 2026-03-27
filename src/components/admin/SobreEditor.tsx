import React, { useState, useEffect } from 'react';
import { Save, Loader2, LayoutTemplate, Type, FileText, User, Image as ImageIcon, Briefcase, Activity, Quote, Plus, Trash2, ChevronRight, MessageSquare, TrendingUp, List } from 'lucide-react';
import { triggerToast } from './CmsToaster';
import { githubApi } from '../../lib/adminApi';
import ImageUpload from './ImageUpload';
import IconPicker from './IconPicker';

type SobreConfig = {
    hero: {
        title: string;
        subtitle: string;
        bgImage: string;
    };
    about: {
        image: string;
        title: string;
        content: string;
        signatureImage: string;
        authorName: string;
        authorRole: string;
    };
    services: {
        title: string;
        description: string;
        items: {
            title: string;
            description: string;
            icon: string;
        }[];
    };
    funFacts: {
        backgroundImage: string;
        items: {
            count: string;
            label: string;
            icon: string;
            suffix?: string;
        }[];
    };
    testimonials: {
        title: string;
        subtitle: string;
        description: string;
        items: {
            name: string;
            role: string;
            text: string;
            image: string;
        }[];
    };
};

const DEFAULT_CONFIG: SobreConfig = {
    hero: { title: '', subtitle: '', bgImage: '' },
    about: {
        image: '',
        title: '',
        content: '',
        signatureImage: '',
        authorName: '',
        authorRole: '',
    },
    services: { title: '', description: '', items: [] },
    funFacts: { backgroundImage: '', items: [] },
    testimonials: { title: '', subtitle: '', description: '', items: [] }
};

type Tab = 'content' | 'services_facts' | 'testimonials';

export default function SobreEditor() {
    const [config, setConfig] = useState<SobreConfig>(DEFAULT_CONFIG);
    const [fileSha, setFileSha] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [tab, setTab] = useState<Tab>('content');

    useEffect(() => {
        async function load() {
            try {
                const data = await githubApi('read', 'src/data/sobre.json');
                if (data) {
                    setConfig(JSON.parse(data.content));
                    setFileSha(data.sha);
                }
            } catch (err: any) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const updateNested = (path: string, value: any) => {
        setConfig(prev => {
            const next = { ...prev };
            const keys = path.split('.');
            let curr: any = next;
            for (let i = 0; i < keys.length - 1; i++) {
                curr = curr[keys[i]];
            }
            curr[keys[keys.length - 1]] = value;
            return { ...next };
        });
    };

    async function save() {
        setSaving(true);
        try {
            await githubApi('write', 'src/data/sobre.json', {
                content: JSON.stringify(config, null, 4),
                sha: fileSha,
            });
            const fresh = await githubApi('read', 'src/data/sobre.json');
            setFileSha(fresh.sha);
            triggerToast('Página Sobre atualizada!', 'success');
        } catch (err: any) {
            triggerToast(err.message, 'error');
        } finally {
            setSaving(false);
        }
    }

    if (loading) return (
        <div className="flex items-center justify-center h-64 gap-3 text-slate-500">
            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
            <span className="text-sm">Carregando configuração...</span>
        </div>
    );

    return (
        <div className="max-w-4xl space-y-6 pb-20">
            {/* Header Sticky */}
            <div className="flex items-center justify-between sticky top-0 bg-slate-50/80 backdrop-blur-md z-10 py-4 -mt-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="font-bold text-slate-800 text-lg">Página Sobre Nós</h2>
                        <p className="text-sm text-slate-500 tracking-tight">Gestão de conteúdo institucional independente</p>
                    </div>
                </div>
                <button
                    onClick={save}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 disabled:opacity-60 transition-all shadow-md active:scale-95"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saving ? 'Gravando...' : 'Salvar Alterações'}
                </button>
            </div>

            {/* Tabs Navigation */}
            <div className="flex gap-1 bg-slate-200/50 p-1 rounded-2xl w-fit">
                {[
                    { id: 'content', icon: FileText, label: 'Conteúdo Principal' },
                    { id: 'services_facts', icon: Activity, label: 'Serviços & Números' },
                    { id: 'testimonials', icon: MessageSquare, label: 'Depoimentos' }
                ].map(t => (
                    <button
                        key={t.id}
                        onClick={() => setTab(t.id as any)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === t.id
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
                            }`}
                    >
                        <t.icon className="w-4 h-4" />
                        {t.label}
                    </button>
                ))}
            </div>

            {tab === 'content' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {/* Hero Section */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                        <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2 border-b pb-3 mb-4">
                            <Type className="w-4 h-4 text-blue-500" /> Cabeçalho (Hero)
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Título Principal</label>
                                <input
                                    type="text"
                                    value={config.hero.title}
                                    onChange={e => updateNested('hero.title', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Subtítulo</label>
                                <input
                                    type="text"
                                    value={config.hero.subtitle}
                                    onChange={e => updateNested('hero.subtitle', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm"
                                />
                            </div>
                        </div>
                        <ImageUpload
                            label="Imagem de Fundo do Banner"
                            value={config.hero.bgImage}
                            onChange={val => updateNested('hero.bgImage', val)}
                        />
                    </div>

                    {/* About Content */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                        <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2 border-b pb-3 mb-4">
                            <FileText className="w-4 h-4 text-emerald-500" /> Seção Sobre Nós
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Título da Seção</label>
                                    <input
                                        type="text"
                                        value={config.about.title}
                                        onChange={e => updateNested('about.title', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Texto Principal</label>
                                    <textarea
                                        value={config.about.content}
                                        onChange={e => updateNested('about.content', e.target.value)}
                                        rows={6}
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm leading-relaxed"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <ImageUpload
                                    label="Imagem Ilustrativa"
                                    value={config.about.image}
                                    onChange={val => updateNested('about.image', val)}
                                />
                                <div className="space-y-4">
                                    <ImageUpload
                                        label="Assinatura"
                                        value={config.about.signatureImage}
                                        onChange={val => updateNested('about.signatureImage', val)}
                                    />
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Autor</label>
                                            <input
                                                type="text"
                                                value={config.about.authorName}
                                                onChange={e => updateNested('about.authorName', e.target.value)}
                                                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-bold"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Cargo</label>
                                            <input
                                                type="text"
                                                value={config.about.authorRole}
                                                onChange={e => updateNested('about.authorRole', e.target.value)}
                                                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {tab === 'services_facts' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {/* Services Text */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                        <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2 border-b pb-3 mb-4">
                            <Activity className="w-4 h-4 text-blue-500" /> Diferenciais da Página Sobre
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Título da Seção</label>
                                <input
                                    type="text"
                                    value={config.services.title}
                                    onChange={e => updateNested('services.title', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Descrição Curta</label>
                                <textarea
                                    value={config.services.description}
                                    onChange={e => updateNested('services.description', e.target.value)}
                                    rows={2}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Service Items Grid */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                        <div className="flex items-center justify-between border-b pb-3 mb-4">
                            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                                <List className="w-4 h-4 text-blue-500" /> Itens de Diferenciais
                            </h4>
                            <button
                                onClick={() => updateNested('services.items', [...config.services.items, { title: '', description: '', icon: 'Briefcase' }])}
                                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                            >
                                <Plus className="w-3.5 h-3.5" /> Adicionar Diferencial
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {config.services.items?.map((item, i) => (
                                <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 group relative">
                                    <div className="flex justify-between items-start">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Diferencial #{i + 1}</span>
                                        <button
                                            onClick={() => updateNested('services.items', config.services.items.filter((_, idx) => idx !== i))}
                                            className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>

                                    <IconPicker
                                        value={item.icon}
                                        onChange={val => {
                                            const items = [...config.services.items];
                                            items[i].icon = val;
                                            updateNested('services.items', items);
                                        }}
                                    />

                                    <input
                                        type="text"
                                        placeholder="Título"
                                        value={item.title}
                                        onChange={e => {
                                            const items = [...config.services.items];
                                            items[i].title = e.target.value;
                                            updateNested('services.items', items);
                                        }}
                                        className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-sm font-bold"
                                    />

                                    <textarea
                                        placeholder="Descrição"
                                        value={item.description}
                                        onChange={e => {
                                            const items = [...config.services.items];
                                            items[i].description = e.target.value;
                                            updateNested('services.items', items);
                                        }}
                                        rows={2}
                                        className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs resize-none"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Fun Facts */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                        <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2 border-b pb-3 mb-4">
                            <TrendingUp className="w-4 h-4 text-emerald-500" /> Números e Estatísticas (FunFacts)
                        </h4>
                        <div className="mb-6">
                            <ImageUpload
                                label="Imagem de Fundo da Seção"
                                value={config.funFacts.backgroundImage}
                                onChange={val => updateNested('funFacts.backgroundImage', val)}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {config.funFacts.items.map((fact, i) => (
                                <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Número</label>
                                        <input
                                            type="text"
                                            value={fact.count}
                                            onChange={e => {
                                                const items = [...config.funFacts.items];
                                                items[i].count = e.target.value;
                                                updateNested('funFacts.items', items);
                                            }}
                                            className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-bold"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Etiqueta</label>
                                        <input
                                            type="text"
                                            value={fact.label}
                                            onChange={e => {
                                                const items = [...config.funFacts.items];
                                                items[i].label = e.target.value;
                                                updateNested('funFacts.items', items);
                                            }}
                                            className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Sufixo (ex: +, %)</label>
                                        <input
                                            type="text"
                                            value={fact.suffix || ''}
                                            onChange={e => {
                                                const items = [...config.funFacts.items];
                                                items[i].suffix = e.target.value;
                                                updateNested('funFacts.items', items);
                                            }}
                                            className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {tab === 'testimonials' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                        <div className="flex items-center justify-between border-b pb-3 mb-4">
                            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-emerald-500" /> Depoimentos Exclusivos (Sobre Nós)
                            </h4>
                            <button
                                onClick={() => updateNested('testimonials.items', [...config.testimonials.items, { name: '', role: '', text: '', image: '' }])}
                                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                            >
                                <Plus className="w-3.5 h-3.5" /> Adicionar Depoimento
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Título Curto</label>
                                <input
                                    type="text"
                                    value={config.testimonials.title}
                                    onChange={e => updateNested('testimonials.title', e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-xl"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Título Principal</label>
                                <input
                                    type="text"
                                    value={config.testimonials.subtitle}
                                    onChange={e => updateNested('testimonials.subtitle', e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-xl"
                                />
                            </div>
                            <div className="col-span-full">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Descrição da Seção</label>
                                <textarea
                                    value={config.testimonials.description}
                                    onChange={e => updateNested('testimonials.description', e.target.value)}
                                    rows={2}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-xl resize-none"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                            {config.testimonials.items?.map((testi, i) => (
                                <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative group">
                                    <button
                                        onClick={() => updateNested('testimonials.items', config.testimonials.items.filter((_, idx) => idx !== i))}
                                        className="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                    <div className="space-y-3">
                                        <ImageUpload
                                            label="Foto do Cliente"
                                            value={testi.image}
                                            onChange={val => {
                                                const items = [...config.testimonials.items];
                                                items[i].image = val;
                                                updateNested('testimonials.items', items);
                                            }}
                                        />
                                        <div className="grid grid-cols-2 gap-2">
                                            <input
                                                type="text"
                                                placeholder="Nome"
                                                value={testi.name}
                                                onChange={e => {
                                                    const items = [...config.testimonials.items];
                                                    items[i].name = e.target.value;
                                                    updateNested('testimonials.items', items);
                                                }}
                                                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-bold"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Cargo/Local"
                                                value={testi.role}
                                                onChange={e => {
                                                    const items = [...config.testimonials.items];
                                                    items[i].role = e.target.value;
                                                    updateNested('testimonials.items', items);
                                                }}
                                                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                                            />
                                        </div>
                                        <textarea
                                            placeholder="O que o cliente disse..."
                                            value={testi.text}
                                            onChange={e => {
                                                const items = [...config.testimonials.items];
                                                items[i].text = e.target.value;
                                                updateNested('testimonials.items', items);
                                            }}
                                            rows={3}
                                            className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs resize-none"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
