import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'TR' | 'EN';

const translations = {
  TR: {
    nav: {
      about: 'Hakkımda',
      experience: 'Deneyim',
      skills: 'Yetenekler',
      projects: 'Projeler',
      faq: 'SSS',
      contact: 'İletişim',
      darknet: 'Karanlık Ağ',
      control: 'Kontrol',
      stats: 'İstatistik',
      bento: 'Bento',
      portfolio: 'Portfolyo',
      profile: 'Profil'
    },
    hero: {
      title: 'Umut',
      subtitle: 'Bilişim sistemleri ve E-ticaret uzmanı. Kapadokya Üniversitesi 2. sınıf öğrencisi.',
      status: 'DÜĞÜM DURUMU: DOĞRULANDI',
      role: 'OPERATÖR v2.4',
      initiate: 'Projeyi Başlat',
    },
    experience: {
      title: 'Kariyer Geçmişi',
      fullstack: 'Full Stack Mühendisi & E-ticaret',
      consultant: 'Amazon Satış Danışmanı',
      period_current: 'Günümüz',
    },
    skills: {
      title: 'Teknolojiler',
      fullstack: 'Full-Stack Geliştirme (React/Firebase)',
      ecommerce: 'Amazon E-Ticaret & Dropshipping',
      data: 'Veri Analizi & SQL',
      bis: 'Bilişim Sistemleri Danışmanlığı',
      pr: 'Dijital Pazarlama & SEO',
    },
    projects: {
      title: 'Seçili Projeler',
      apex_desc: 'Cinar Cappadocia Agency - Lüks turizm ve acente yönetim platformu (cinarcappadociaageny.com).',
      shield_desc: 'Amazon Satış Yönetimi - Küresel pazaryeri otomasyonları ve envanter takibi.',
      bis_desc: 'Apex Hub OS - Yüksek performanslı veri görselleştirme ve sistem kontrol paneli.'
    },
    contact: {
      title: "Geleceği Birlikte İnşa Edelim",
      subtitle: "Yeni bir proje, iş birliği veya sadece merhaba demek için ulaşmanı bekliyorum.",
      name_label: "Varlık Adı",
      email_label: "Frekans Kaynağı",
      message_label: "İletim Yükü",
      name_placeholder: "Kimlik Etiketi",
      email_placeholder: "dugum@ag.io",
      message_placeholder: "Protokol dizisi detayları...",
      button: "İLETİŞİMİ BAŞLAT",
      whatsapp: "Doğrudan Hat",
      email_official: "Resmi Düğüm"
    },
    darknet: {
      title: "Karanlık Ağ",
      subtitle: "Bu bölüme erişmek için kimliğinizi doğrulamanız ve sistem protokollerini kabul etmeniz gerekmektedir.",
      unauthorized: "Düğüm Yetkisiz",
      name_label: "Gerçek İsim / Kimlik",
      email_label: "Kaynak E-posta",
      alias_label: "Gölge Takma Ad",
      password_label: "Protokol Şifresi",
      login_title: "Kimlik Doğrulama",
      login_switch: "Eskiden Kayıtlı mısın?",
      register_switch: "Yeni Düğüm Oluştur",
      button: "Uplink Başlat",
      success_title: "Erişim Onaylandı",
      success_msg: "GÖLGE AĞA HOŞ GELDİN",
      dashboard: {
        active: "DÜĞÜM_AKTİF",
        tunnel: "ŞİFRELİ TÜNEL",
        home: "ANA SAYFA",
        games: "OYUNLAR",
        terminal: "TERMİNAL",
        entities_title: "Gölge Varlıklar",
        entities_desc: "Şu an ağda 14 aktif operatör bulunmaktadır. Tüm veriler uçtan uca şifrelenmiştir.",
        quick_access_title: "Hızlı Erişim",
        quick_access_desc: "Terminal protokollerini başlatmak için 'TERMİNAL' sekmesine gidin.",
        sys_status_title: "Sistem Durumu",
        sys_status_desc: "CPU: %14 // RAM: 2.4GB // SİNYAL: GÜÇLÜ",
        shadow_games: "Gölge Oyunları",
        waiting: "İletim beklemede... Imleç aktif. _",
        chat: "Sohbet",
        cortex: "Korteks",
        missions_title: "Özel Görevler",
        missions_desc: "Şifre çözme ve ağ sızma simülasyonları yakında aktif edilecek."
      }
    },
    faq: {
      q1: 'Hangi alanlarda hizmet veriyorsun?',
      a1: 'E-ticaret stratejisi, web geliştirme, veri analizi, YBS danışmanlığı ve dijital pazarlama konularında profesyonel çözümler sunuyorum.',
      q2: 'Freelance çalışmaya açık mısın?',
      a2: 'Evet! Uygun projeler için freelance çalışmaya açığım. İletişim formu üzerinden ulaşabilirsin.',
      q3: 'Süreç nasıl işliyor?',
      a3: 'İlk toplantı → Analiz & Planlama → Geliştirme → Test → Teslimat & Destek aşamalarıyla şeffaf bir iletişim sağlıyorum.'
    },
    admin: {
      title: "Merkezi Komuta",
      subtitle: "Canlı İstihbarat Akışı",
      restricted: "Kısıtlı Alan",
      auth_needed: "Sadece Yetkili Erişimi",
      password_placeholder: "Ana Protokol Anahtarı",
      login_button: "Auth Çalıştır",
      active_nodes: "Aktif Düğümler",
      nodes_title: "Kayıtlı Düğümler",
      node_profile: "Düğüm Profili",
      delete_confirm: "PROTOKOL_SIL: Düğüm sonlandırılsın mı?"
    }
  },
  EN: {
    nav: {
      about: 'About',
      experience: 'Experience',
      skills: 'Skills',
      projects: 'Projects',
      faq: 'FAQ',
      contact: 'Contact',
      darknet: 'Darknet',
      control: 'Control',
      stats: 'Stats',
      bento: 'Bento',
      portfolio: 'Portfolio',
      profile: 'Profile'
    },
    hero: {
      title: 'Umut',
      subtitle: 'Information systems and E-commerce specialist. 2nd-year student at Cappadocia University.',
      status: 'NODE STATUS: VERIFIED',
      role: 'OPERATOR v2.4',
      initiate: 'Initiate Project',
    },
    experience: {
      title: 'Career Experience',
      fullstack: 'Full Stack Engineer & E-commerce',
      consultant: 'Amazon Sales Consultant',
      period_current: 'Present',
    },
    skills: {
      title: 'Technologies',
      fullstack: 'Full-Stack Development (React/Firebase)',
      ecommerce: 'Amazon E-Commerce & Dropshipping',
      data: 'Data Analysis & SQL',
      bis: 'BIS Consultancy',
      pr: 'Digital Marketing & SEO',
    },
    projects: {
      title: 'Selected Projects',
      apex_desc: 'Cinar Cappadocia Agency - Luxury tourism and agency management platform (cinarcappadociaageny.com).',
      shield_desc: 'Amazon Sales Ops - Global marketplace automations and inventory tracking.',
      bis_desc: 'Apex Hub OS - High-performance data visualization and control dashboard.'
    },
    contact: {
      title: "Let's build the Future together",
      subtitle: "Open for collaboration on high-impact digital platforms and strategic technological infrastructure.",
      name_label: "Entity Name",
      email_label: "Frequency Origin",
      message_label: "Transmission Payload",
      name_placeholder: "Identity Label",
      email_placeholder: "node@network.io",
      message_placeholder: "Protocol sequence details...",
      button: "INITIATE UPLINK",
      whatsapp: "Direct Uplink",
      email_official: "Official Node"
    },
    darknet: {
      title: "Shadow Network",
      subtitle: "To access this section, you must verify your identity and accept system protocols. Real information must be used.",
      unauthorized: "Node Unauthorized",
      name_label: "Real Name / Identity",
      email_label: "Origin Email",
      alias_label: "Shadow Alias",
      password_label: "Protocol Password",
      login_title: "Identity Authentication",
      login_switch: "Already Registered?",
      register_switch: "Register New Node",
      button: "Initiate Uplink",
      success_title: "Access Granted",
      success_msg: "WELCOME TO THE SHADOW NETWORK",
      dashboard: {
        active: "NODE_ACTIVE",
        tunnel: "ENCRYPTED TUNNEL",
        home: "HOME",
        games: "GAMES",
        terminal: "TERMINAL",
        entities_title: "Shadow Entities",
        entities_desc: "Currently 14 active operators on the network. All data is end-to-end encrypted.",
        quick_access_title: "Quick Access",
        quick_access_desc: "Go to 'TERMINAL' tab to initiate terminal protocols.",
        sys_status_title: "System Status",
        sys_status_desc: "CPU: 14% // RAM: 2.4GB // SIGNAL: STRONG",
        shadow_games: "Shadow Games",
        waiting: "Transmission pending... Cursor active. _",
        chat: "Chat",
        cortex: "Cortex",
        missions_title: "Classified Missions",
        missions_desc: "Decrypting and network penetration simulations will be available soon."
      }
    },
    faq: {
      q1: 'Which areas do you provide services in?',
      a1: 'I provide professional solutions in e-commerce strategy, web development, data analysis, BIS consultancy, and digital marketing.',
      q2: 'Are you available for freelance work?',
      a2: 'Yes! I am open to freelance work for suitable projects. You can reach me via the contact form.',
      q3: 'How does the process work?',
      a3: 'I ensure transparent communication through First meeting → Analysis & Planning → Development → Testing → Delivery & Support stages.'
    },
    admin: {
      title: "Central Command",
      subtitle: "Live Intelligence Feed",
      restricted: "Restricted Area",
      auth_needed: "Authorized Access Only",
      password_placeholder: "Master Protocol Key",
      login_button: "Execute Auth",
      active_nodes: "Active Nodes",
      nodes_title: "Registered Nodes",
      node_profile: "Node Profile",
      delete_confirm: "PROTOCOL_DELETE: Confirm node termination?"
    }
  }
};

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: any;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('app_lang');
    return (saved as Language) || 'TR';
  });

  useEffect(() => {
    localStorage.setItem('app_lang', lang);
  }, [lang]);

  const t = (path: string) => {
    return path.split('.').reduce((obj: any, key) => obj?.[key], translations[lang]) || path;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within I18nProvider');
  return context;
};
