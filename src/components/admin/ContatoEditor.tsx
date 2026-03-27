import React, { useState, useEffect } from 'react';
import { Save, Loader2, LayoutTemplate, Phone, Mail, MapPin, Type, List, Globe, Image as ImageIcon } from 'lucide-react';
import { triggerToast } from './CmsToaster';
import { githubApi } from '../../lib/adminApi';
import ImageUpload from './ImageUpload';

type ContatoConfig = {
    hero: {
        title: string;
        subtitle: string;
        bgImage: string;
    };
    info: {
        title: string;
        description: string;
        address: string;
        email: string;
        phone: string;
        mapUrl: string;
        formServices: string[];
    };
};

const DEFAULT_CONFIG: ContatoConfig = {
    hero: { title: '', subtitle: '', bgImage: '' },
    info: {
        title: '',
        description: '',
        address: '',
        email: '',
        phone: '',
        mapUrl: '',
        formServices: []
    }
};

export default function ContatoEditor() {
    const [config, setConfig] = useState<ContatoConfig>(DEFAULT_CONFIG);
    const [fileSha, setFileSha] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function load() {
            try {
                const data = await githubApi('read', 'src/data/contato.json');
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
        const newConfig = { ...config };
        const keys = path.split('.');
        let current: any = newConfig;
        for (let i = 0; i < keys.length - 1; i++) {
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        setConfig(newConfig);
    };

    const handleServiceChange = (index: number, value: string) => {
        const newServices = [...config.info.formServices];
        newServices[index] = value;
        updateNested('info.formServices', newServices);
    };

    const addService = () => {
        updateNested('info.formServices', [...config.info.formServices, 'Novo Serviço']);
    };

    const removeService = (index: number) => {
        const newServices = config.info.formServices.filter((_, i) => i !== index);
        updateNested('info.formServices', newServices);
    };

    async function save() {
        setSaving(true);
        try {
            await githubApi('write', 'src/data/contato.json', {
                content: JSON.stringify(config, null, 4),
                sha: fileSha,
            });
            const fresh = await githubApi('read', 'src/data/contato.json');
            setFileSha(fresh.sha);
            triggerToast('Página de Contato atualizada!', 'success');
        } catch (err: any) {
            triggerToast(err.message, 'error');
        } finally {
            setSaving(false);
        }
    }

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-32 text-slate-400 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <LayoutTemplate className="w-10 h-10 animate-pulse mb-6 text-slate-300" />
            <p className="font-bold text-sm animate-pulse text-slate-500 uppercase tracking-widest">Carregando Configurações...</p>
        </div>
    );

    return (
        <div className="max-w-5xl space-y-6 pb-20">
            {/* Header Sticky */}
            <div className="sticky top-0 z-20 flex items-center justify-between bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-sm mb-8">
                <div className="flex items-center gap-3">
                    <div className="bg-violet-100 p-2 rounded-xl">
                        <Phone className="w-5 h-5 text-violet-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Página de Contato</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gestão de Canais de Atendimento</p>
                    </div>
                </div>
                <button
                    onClick={save}
                    disabled={saving}
                    className="group bg-slate-900 hover:bg-black disabled:opacity-50 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg active:scale-95"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />}
                    {saving ? 'Salvando...' : 'Publicar Alterações'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Hero & Text Section */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                        <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2 border-b pb-3 mb-4 uppercase tracking-wider">
                            <Type className="w-4 h-4 text-violet-500" /> Cabeçalho & Chamada
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-widest">Título do Hero</label>
                                <input
                                    type="text"
                                    value={config.hero.title}
                                    onChange={e => updateNested('hero.title', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500/10 focus:border-violet-500 transition-all text-sm font-medium"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-widest">Subtítulo Hero</label>
                                <input
                                    type="text"
                                    value={config.hero.subtitle}
                                    onChange={e => updateNested('hero.subtitle', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500/10 focus:border-violet-500 transition-all text-sm font-medium"
                                />
                            </div>
                        </div>
                        <div className="pt-4 border-t">
                            <ImageUpload
                                label="Imagem de Fundo do Cabeçalho"
                                value={config.hero.bgImage}
                                onChange={val => updateNested('hero.bgImage', val)}
                            />
                        </div>
                        <div className="space-y-4 pt-4 border-t">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-widest">Título da Seção de Dúvidas</label>
                                <input
                                    type="text"
                                    value={config.info.title}
                                    onChange={e => updateNested('info.title', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500/10 focus:border-violet-500 transition-all text-sm font-bold"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-widest">Descrição da Seção</label>
                                <textarea
                                    value={config.info.description}
                                    onChange={e => updateNested('info.description', e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500/10 focus:border-violet-500 transition-all text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Services List */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                        <div className="flex items-center justify-between border-b pb-3 mb-4">
                            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2 uppercase tracking-wider">
                                <List className="w-4 h-4 text-emerald-500" /> Serviços no Formulário
                            </h4>
                            <button onClick={addService} className="text-[10px] bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-bold px-3 py-1 rounded-full transition-colors uppercase tracking-wider">
                                + Adicionar
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {config.info.formServices.map((service, idx) => (
                                <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100 group">
                                    <input
                                        type="text"
                                        value={service}
                                        onChange={e => handleServiceChange(idx, e.target.value)}
                                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium py-1 px-2"
                                    />
                                    <button
                                        onClick={() => removeService(idx)}
                                        className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 p-1.5 transition-all"
                                    >
                                        <Loader2 className="w-3.5 h-3.5 rotate-45" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Contact Info */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                        <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2 border-b pb-3 mb-4 uppercase tracking-wider">
                            <Info className="w-4 h-4 text-blue-500" /> Informações Diretas
                        </h4>
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-widest flex items-center gap-1.5">
                                    <MapPin className="w-3 h-3 text-slate-400" /> Endereço Exibido
                                </label>
                                <textarea
                                    value={config.info.address}
                                    onChange={e => updateNested('info.address', e.target.value)}
                                    rows={2}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500/10 transition-all text-xs font-medium"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-widest flex items-center gap-1.5">
                                    <Mail className="w-3 h-3 text-slate-400" /> E-mail Público
                                </label>
                                <input
                                    type="email"
                                    value={config.info.email}
                                    onChange={e => updateNested('info.email', e.target.value)}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500/10 transition-all text-xs font-medium"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-widest flex items-center gap-1.5">
                                    <Phone className="w-3 h-3 text-slate-400" /> Telefone Público
                                </label>
                                <input
                                    type="text"
                                    value={config.info.phone}
                                    onChange={e => updateNested('info.phone', e.target.value)}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500/10 transition-all text-xs font-medium"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Google Map */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                        <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2 border-b pb-3 uppercase tracking-wider">
                            <Globe className="w-4 h-4 text-orange-500" /> Google Maps (Embed)
                        </h4>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-widest">URL do Iframe (src)</label>
                            <textarea
                                value={config.info.mapUrl}
                                onChange={e => updateNested('info.mapUrl', e.target.value)}
                                rows={4}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500/10 transition-all text-[10px] font-mono leading-tight"
                                placeholder="https://www.google.com/maps/embed?..."
                            />
                        </div>
                        {config.info.mapUrl && (
                            <div className="aspect-video w-full rounded-xl overflow-hidden border border-slate-200 shadow-inner">
                                <iframe src={config.info.mapUrl} className="w-full h-full grayscale opacity-70" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

const Info = ({ className, ...props }: any) => (
    <svg
        {...props}
        className={className}
        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    >
        <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
    </svg>
)
