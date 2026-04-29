import React from 'react';
import { motion } from 'motion/react';
import { useI18n } from '../lib/i18n';
import { 
  User, 
  GraduationCap, 
  Code2, 
  FolderRoot, 
  Mail, 
  Github, 
  ExternalLink,
  ChevronRight,
  Send,
  Shield,
  MessageSquare,
  Activity
} from 'lucide-react';

export const PortfolioView: React.FC = () => {
  const { t, lang } = useI18n();
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    const session = localStorage.getItem('darknet_user');
    if (session) setUser(JSON.parse(session));
  }, []);

  const skills = [
    { name: t('skills.fullstack'), progress: 95, icon: '⚛️', desc: 'React, Node.js, Firebase, TypeScript' },
    { name: t('skills.ecommerce'), progress: 98, icon: '🛒', desc: 'Amazon, Dropshipping, Marketing' },
    { name: t('skills.data'), progress: 92, icon: '📊', desc: 'Business Intelligence & Data Analysis' },
    { name: t('skills.bis'), progress: 85, icon: '🏢', desc: 'Information Systems Management' },
    { name: t('skills.pr'), progress: 88, icon: '📣', desc: 'SEO & Performance Marketing' }
  ];

  const experience = [
    { title: t('experience.fullstack'), company: 'Cinar Cappadocia Agency', period: `2024 - ${t('experience.period_current')}`, desc: 'Luxury travel agency management systems. High-performance web architecture.' },
    { title: t('experience.consultant'), company: 'Amazon E-Commerce', period: `2023 - ${t('experience.period_current')}`, desc: 'Global e-commerce management, logistics automation, and sales optimization.' }
  ];

  const faqs = [
    { q: t('faq.q1'), a: t('faq.a1') },
    { q: t('faq.q2'), a: t('faq.a2') },
    { q: t('faq.q3'), a: t('faq.a3') }
  ];

  const projects = [
    {
      title: 'Cinar Cappadocia',
      desc: t('projects.apex_desc'),
      tech: ['React', 'Firebase', 'Live Hosting'],
      link: 'https://cinarcappadociaageny.com'
    },
    {
      title: 'Amazon E-Com Node',
      desc: t('projects.shield_desc'),
      tech: ['Amazon API', 'Inventory Ops'],
      link: '#'
    },
    {
      title: 'Apex Hub OS v1.8',
      desc: t('projects.bis_desc'),
      tech: ['React', 'Motion', 'Tailwind'],
      link: '#'
    }
  ];

  const education = [
    { school: 'Kapadokya Üniversitesi', degree: 'Yönetim Bilişim Sistemleri (BIS)', years: '2024 - 2026', status: lang === 'TR' ? '2. Sınıf' : '2nd Year' },
    { school: 'Anadolu Lisesi', degree: 'Fen Bilimleri', years: '2019 - 2023', status: lang === 'TR' ? 'Mezun' : 'Graduated' }
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-16 pb-24 pr-4">
      {/* Navigation */}
      <nav id="navbar" className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border border-white/5 rounded-3xl p-3 mb-12 hidden md:block shadow-2xl">
        <ul className="flex justify-around items-center">
          {['about', 'experience', 'skills', 'projects', 'faq', 'contact'].map((id) => (
            <li key={id}>
              <button 
                onClick={() => scrollTo(id)}
                className="px-5 py-2 text-[10px] font-mono font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-emerald-400 transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                {t(`nav.${id}`)}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Hero Section */}
      <section id="about" className="scroll-mt-24 glass-panel rounded-[40px] p-10 neon-border relative overflow-hidden group">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 blur-[120px] pointer-events-none transition-all duration-1000 group-hover:bg-emerald-500/20" />
        <div className="flex flex-col md:flex-row gap-12 items-center relative z-10">
          <div className="relative group/avatar mt-10 md:mt-0">
            <div className="w-48 h-48 md:w-64 md:h-64 bg-zinc-900 border-4 border-emerald-500/20 rounded-[48px] md:rounded-[64px] overflow-hidden shadow-2xl transition-all duration-700 group-hover/avatar:rounded-[32px] group-hover/avatar:border-emerald-500 group-hover/avatar:shadow-emerald-500/30">
              <img 
                src={user?.mugshotUrl || "https://artifact.static-assets.app/api/projects/f3n5g6inymql2abq6cw6lo/artifacts/e66b447a-9bd1-4f9b-8e1d-a09c2a6be8b6"} 
                alt="Umut İnce" 
                className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover/avatar:grayscale-0 group-hover/avatar:scale-110"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-emerald-500 text-zinc-950 px-6 py-3 rounded-2xl shadow-2xl font-mono font-black italic text-[11px] uppercase tracking-widest rotate-6 group-hover/avatar:rotate-0 transition-all duration-500">
              {t('hero.role')}
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center gap-3 mb-6 justify-center md:justify-start">
               <span className="px-5 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-black uppercase tracking-[0.4em] rounded-full shadow-lg">
                 {t('hero.status')}
               </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-6 leading-[0.9] text-white">
              {t('hero.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">İnce</span>
            </h1>
            <p className="text-zinc-400 font-medium leading-relaxed max-w-xl text-lg md:text-xl mb-10 border-l-4 border-emerald-500/30 pl-6 md:pl-8 italic">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-6">
              <button 
                onClick={() => scrollTo('contact')} 
                className="px-10 py-5 bg-white text-zinc-950 font-black uppercase tracking-[0.2em] italic rounded-3xl hover:bg-emerald-500 hover:text-black transition-all shadow-3xl active:scale-95 duration-500"
              >
                {t('hero.initiate')}
              </button>
              <div className="flex gap-3">
               <a href="https://github.com/umutberk138" target="_blank" rel="noreferrer" className="p-5 bg-zinc-900/80 border border-white/5 rounded-3xl text-zinc-400 hover:text-white hover:border-emerald-500/50 hover:bg-zinc-900 transition-all shadow-xl"><Github size={24} /></a>
                 <a href="https://instagram.com/umutberknc" target="_blank" rel="noreferrer" className="p-5 bg-zinc-900/80 border border-white/5 rounded-3xl text-zinc-400 hover:text-white hover:border-rose-500/50 hover:bg-zinc-900 transition-all shadow-xl">
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                 </a>
              </div>
            </div>
            
            <div className="flex gap-8 mt-12 justify-center md:justify-start">
               {[
                 { label: t('hero.stat_exp'), target: 3, suffix: '+' },
                 { label: t('hero.stat_proj'), target: 12, suffix: '+' },
                 { label: t('hero.stat_sports'), target: 5, suffix: '+' }
               ].map((stat, i) => (
                 <div key={i} className="flex flex-col items-center md:items-start group">
                    <span className="text-4xl font-black text-white group-hover:text-emerald-400 transition-colors">{stat.target}{stat.suffix}</span>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 mt-2 text-center md:text-left leading-tight">{stat.label}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="scroll-mt-24">
        <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-10 flex items-center gap-5 text-white">
          <Code2 size={32} className="text-emerald-500" /> {t('experience.title')}
        </h2>
        <div className="space-y-8">
          {experience.map((exp, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.8 }}
              viewport={{ once: true }}
              className="glass-panel p-12 rounded-[48px] relative overflow-hidden group hover:neon-border transition-all duration-700"
            >
              <div className="absolute -top-10 -right-10 text-emerald-500/5 group-hover:text-emerald-500/10 transition-all duration-700 rotate-12">
                 <Shield size={200} />
              </div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6 relative z-10">
                <div>
                  <h3 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tight group-hover:text-emerald-400 transition-colors drop-shadow-lg">{exp.title}</h3>
                  <div className="flex items-center flex-wrap gap-4 mt-2">
                    <p className="text-emerald-500 font-mono text-[12px] font-black uppercase tracking-[0.4em]">{exp.company}</p>
                    <span className="w-2 h-2 bg-zinc-700 rounded-full" />
                    <span className="text-zinc-500 font-mono text-[12px] font-bold uppercase tracking-widest">{exp.period}</span>
                  </div>
                </div>
                <div className="p-4 bg-zinc-900 border border-white/5 rounded-2xl group-hover:border-emerald-500/50 transition-all scale-110">
                   <ChevronRight className="text-zinc-500 group-hover:text-emerald-400" />
                </div>
              </div>
              <p className="text-zinc-400 text-xl font-medium leading-relaxed max-w-4xl relative z-10 italic border-l-2 border-zinc-800 pl-8 group-hover:border-emerald-500/30 transition-colors">{exp.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Skills & Education */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <section id="skills" className="scroll-mt-24">
          <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-10 flex items-center gap-5 text-white">
            <Code2 size={32} className="text-emerald-500" /> {t('skills.title')}
          </h2>
          <div className="space-y-8">
            {skills.map((skill, i) => (
              <div key={i} className="group">
                <div className="flex justify-between items-end mb-3">
                  <div className="flex gap-3 items-center">
                    <span className="text-2xl grayscale group-hover:grayscale-0 transition-all">{skill.icon}</span>
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white group-hover:text-emerald-400 transition-colors">{skill.name}</h4>
                      <p className="text-[10px] text-zinc-500 font-mono font-medium uppercase tracking-widest mt-1 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">{skill.desc}</p>
                    </div>
                  </div>
                  <span className="text-emerald-500 font-mono font-black text-xs">{skill.progress}%</span>
                </div>
                <div className="h-2.5 w-full bg-zinc-950 border border-white/5 rounded-full overflow-hidden p-0.5">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.progress}%` }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    viewport={{ once: true }}
                    className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="education" className="scroll-mt-24">
           <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-10 flex items-center gap-5 text-white">
             <GraduationCap size={32} className="text-emerald-500" /> {lang === 'TR' ? 'Eğitim' : 'Education'}
           </h2>
           <div className="space-y-6">
             {education.map((edu, i) => (
               <motion.div 
                 key={i}
                 whileHover={{ x: 10 }}
                 className="bg-zinc-900/50 border border-white/5 p-6 md:p-8 rounded-3xl group transition-all"
               >
                 <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-2">
                   <h3 className="text-lg font-black uppercase tracking-tight text-white group-hover:text-emerald-400 transition-colors italic">{edu.school}</h3>
                   <span className="px-3 py-1 bg-zinc-800 text-zinc-500 text-[10px] font-mono font-black uppercase tracking-widest rounded-lg self-start">{edu.years}</span>
                 </div>
                 <p className="text-zinc-400 font-bold text-sm tracking-wide mb-4">{edu.degree}</p>
                 <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${edu.status === 'Mezun' || edu.status === 'Graduated' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.2)]'}`}>
                    {edu.status}
                 </span>
               </motion.div>
             ))}
           </div>
        </section>
      </div>

      {/* Projects Section */}
      <section id="projects" className="scroll-mt-24">
        <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-10 flex items-center gap-5 text-white">
          <FolderRoot size={32} className="text-emerald-500" /> {t('projects.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -12, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="glass-panel p-10 rounded-[48px] group cursor-pointer relative overflow-hidden active:scale-95 h-full flex flex-col"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="p-5 bg-zinc-950 border border-white/5 rounded-3xl group-hover:neon-border transition-all duration-500">
                  <FolderRoot className="text-emerald-500" />
                </div>
                <a href={project.link} target="_blank" rel="noreferrer" className="p-4 text-zinc-600 hover:text-white transition-all bg-zinc-950 rounded-2xl hover:scale-110 active:scale-90">
                  <ExternalLink size={24} />
                </a>
              </div>
              <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-4 group-hover:text-emerald-400 transition-colors drop-shadow-xl text-white underline decoration-emerald-500/20 group-hover:decoration-emerald-500 underline-offset-8">
                {project.title}
              </h3>
              <p className="text-zinc-500 mb-10 font-medium leading-relaxed text-[15px] flex-grow">
                {project.desc}
              </p>
              <div className="flex flex-wrap gap-2 relative z-10 mt-auto">
                {project.tech.map((t, j) => (
                  <span key={j} className="text-[9px] font-mono font-black bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20 text-emerald-400 uppercase tracking-[0.2em]">{t}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-10 flex items-center gap-5 text-white">
          <MessageSquare size={32} className="text-emerald-500" /> {t('nav.faq')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {faqs.map((faq, i) => (
             <motion.div 
               key={i}
               className="glass-panel p-8 rounded-3xl border-l-4 border-l-emerald-500 hover:scale-[1.02] transition-all"
             >
               <h4 className="text-lg font-black uppercase text-white mb-3 italic tracking-tight">{faq.q}</h4>
               <p className="text-zinc-500 text-sm font-medium leading-relaxed">{faq.a}</p>
             </motion.div>
           ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="scroll-mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
           <div>
             <h2 className="text-6xl font-black italic uppercase tracking-tighter mb-8 leading-[0.8] text-white">
               {t('contact.title').split(' ')[0]} <br/><span className="text-emerald-500">{t('contact.title').split(' ').slice(1).join(' ')}</span>
             </h2>
             <p className="text-zinc-500 mb-12 max-w-sm text-xl font-medium leading-relaxed italic border-l-8 border-emerald-500/10 pl-8">
               {t('contact.subtitle')}
             </p>
             <div className="space-y-8">
               <a href="mailto:umut@umutince.online" className="flex items-center gap-8 text-zinc-500 group cursor-pointer hover:text-emerald-500 transition-all duration-500">
                  <div className="p-5 bg-zinc-950 border border-white/5 rounded-3xl group-hover:neon-border group-hover:bg-emerald-500/10 transition-all shadow-2xl">
                    <Mail size={28} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-mono text-zinc-700 font-black uppercase tracking-[0.3em] mb-1">{t('contact.email_official')}</span>
                    <span className="font-mono text-lg font-black tracking-widest uppercase text-white">umut@umutince.online</span>
                  </div>
               </a>
               <a href="https://wa.me/905400893252" target="_blank" rel="noreferrer" className="flex items-center gap-8 text-zinc-500 group cursor-pointer hover:text-emerald-500 transition-all duration-500">
                  <div className="p-5 bg-zinc-950 border border-white/5 rounded-3xl group-hover:neon-border group-hover:bg-emerald-500/10 transition-all shadow-2xl">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-mono text-zinc-700 font-black uppercase tracking-[0.3em] mb-1">{t('contact.whatsapp')}</span>
                    <span className="font-mono text-lg font-black tracking-widest uppercase text-emerald-500">+90 540 089 32 52</span>
                  </div>
               </a>
             </div>
           </div>
           
           <div className="glass-panel p-12 rounded-[56px] shadow-3xl relative neon-border group">
              <div className="absolute inset-x-0 -top-1 h-2 bg-gradient-to-r from-transparent via-emerald-500 to-transparent blur-sm animate-pulse" />
              <form onSubmit={e => e.preventDefault()} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-3">
                      <label className="text-[12px] font-mono font-black uppercase tracking-[0.4em] text-emerald-500/50 ml-3">{t('contact.name_label')}</label>
                      <input type="text" placeholder={t('contact.name_placeholder')} className="w-full bg-zinc-950/80 border border-white/5 p-5 rounded-3xl focus:outline-none focus:neon-border text-white font-bold placeholder:text-zinc-800 transition-all shadow-inner" />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[12px] font-mono font-black uppercase tracking-[0.4em] text-emerald-500/50 ml-3">{t('contact.email_label')}</label>
                      <input type="email" placeholder={t('contact.email_placeholder')} className="w-full bg-zinc-950/80 border border-white/5 p-5 rounded-3xl focus:outline-none focus:neon-border text-white font-bold placeholder:text-zinc-800 transition-all shadow-inner" />
                   </div>
                </div>
                <div className="space-y-3">
                   <label className="text-[12px] font-mono font-black uppercase tracking-[0.4em] text-emerald-500/50 ml-3">{t('contact.message_label')}</label>
                   <textarea rows={6} placeholder={t('contact.message_placeholder')} className="w-full bg-zinc-950/80 border border-white/5 p-5 rounded-3xl focus:outline-none focus:neon-border text-white font-bold placeholder:text-zinc-800 resize-none transition-all shadow-inner" />
                </div>
                <button className="group/btn w-full py-6 bg-gradient-to-br from-emerald-500 to-teal-700 text-zinc-950 font-black italic uppercase tracking-[0.4em] rounded-[28px] hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-4 transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                  <Send size={24} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" /> 
                  {t('contact.button')}
                </button>
              </form>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-16 border-t border-white/5 text-center">
         <div className="flex justify-center gap-6 mb-8">
            <Shield className="text-zinc-800" size={32} />
            <Activity className="text-emerald-900" size={32} />
            <FolderRoot className="text-zinc-800" size={32} />
         </div>
         <p className="text-[11px] font-mono text-zinc-800 uppercase tracking-[0.5em] font-black italic">
           &copy; 2026 Umut İnce // Node_ID: 24903032 // Kapadokya Üniversitesi BIS // Secured System
         </p>
      </footer>
    </div>
  );
};
