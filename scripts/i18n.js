// ---------- language (EN / PT) ----------
const PT = {
    "nav.about": "Sobre",
    "nav.expertise": "Áreas",
    "nav.work": "Projetos",
    "nav.contact": "Contato",
    "hero.domains": "Ciências da Vida <i>×</i> IA <i>×</i> Software",
    "hero.statement": "Onde o código<br>encontra a vida.",
    "hero.support": "Farmacêutico e desenvolvedor de software explorando a interseção entre ciências da vida, inteligência artificial e engenharia de software.",
    "hero.cta1": "Ver projetos",
    "hero.cta2": "Fale comigo",
    "hero.fig": "fig. 0, o sistema",
    "stage.0": "Vida",
    "stage.1": "Moléculas",
    "stage.2": "Dados",
    "stage.3": "Código",
    "stage.4": "IA",
    "about.index": "01 / Sobre",
    "about.title": "Trabalho na interseção entre tecnologia e ciências da vida.",
    "about.lead": "Com formação em Farmácia e atualmente em formação em Desenvolvimento de Software, atuo na interseção entre ciências da vida, inteligência artificial e engenharia de software, desenvolvendo soluções computacionais para problemas biológicos e farmacêuticos.",
    "about.edu": "Farmácia na Universidade Federal do Rio de Janeiro (UFRJ), último ano.<br>Análise e Desenvolvimento de Sistemas na UNINTER, com conclusão no fim de 2027.<br>CS50x em Harvard.",
    "about.interests": "Interesses",
    "exp.index": "02 / Áreas",
    "exp.title": "Três sistemas, uma prática.",
    "exp.c": "Computacional",
    "exp.l": "Ciências da Vida",
    "int.index": "03 / A interseção",
    "int.title": "Ciência computacional.",
    "claim.1": "A tecnologia fornece as ferramentas.",
    "claim.2": "As ciências da vida trazem os problemas.",
    "claim.3": "A IA traz novas formas de explorá-los.",
    "int.close": "É aqui que estou construindo minha carreira.",
    "work.index": "04 / Projetos selecionados",
    "work.title": "Projetos selecionados.",
    "work.repos": "Repositórios em",
    "cv.title": "Currículo.",
    "cv.lead": "Formação, projetos e habilidades em um único documento.",
    "cv.format": "Formato",
    "cv.updated": "Atualizado",
    "cv.date": "Outubro de 2026",
    "cv.file": "Arquivo",
    "cv.download": "Baixar CV",
    "cv.view": "Ver currículo",
    "contact.index": "06 / Contato",
    "contact.title": "Construir na interseção.",
    "contact.lead": "Aberto a conversas em ciências da vida, IA e software.",
    "contact.where": "Rio de Janeiro, Brasil (UTC−3)",
    "footer": "Código. Ciência. Descoberta.",
    "skip": "Pular para o conteúdo",
    "int.0": "Planejamento de Fármacos Auxiliado por Computador (CADD)",
    "int.1": "Engenharia de Software",
    "int.2": "Inteligência Artificial",
    "int.3": "Descoberta Computacional de Fármacos",
    "int.4": "Quimioinformática",
    "int.5": "Toxicologia In Silico",
    "vox.desc": "Plataforma para transcrição e geração de casos clínicos voltada ao ensino farmacêutico.",
"vox.meta": "TCC, Farmácia, UFRJ. C# / .NET",
"pt.desc": "Sistema de rastreabilidade farmacêutica que simula o controle de lotes, movimentações de estoque e suporte a recall.",
"pt.link": "Ver demonstração",
"soon.title": "Em breve",
"soon.desc": "Um projeto em modelagem molecular e predição.",
"soon.meta": "Modelagem molecular / Predição / Machine learning",
"slot.building": "estrutura em construção",
"slot.prep": "estudo de caso em preparação",
    "slot.title": "Projeto",
    "li.0": "Engenharia de Software",
    "li.1": "Desenvolvimento Backend",
    "li.2": "Sistemas",
    "li.3": "Bancos de Dados",
    "li.4": "Tecnologias Web",
    "li.5": "Inteligência Artificial",
    "li.6": "Computação Científica",
    "li.7": "Quimioinformática",
    "li.8": "Processamento de Dados",
    "li.9": "Modelagem Computacional",
    "li.10": "Ciências Farmacêuticas",
    "li.11": "Descoberta de Fármacos",
    "li.12": "Toxicologia Computacional",
    "li.13": "Farmacologia",
    "li.14": "Dados Biológicos",
    "li.15": "Desenvolvimento de Fármacos",
    "meta.title": "Jakson Bonfim · Ciências da Vida, IA, Software",
    "meta.desc": "Jakson Bonfim, farmacêutico e desenvolvedor de software trabalhando na interseção entre ciências da vida, inteligência artificial e engenharia de software.",
    "caption.0": "Dupla hélice de DNA, 45 pares de bases",
    "caption.1": "Grafos moleculares, 6 estruturas, 180 átomos",
    "caption.2": "Grafo de dados, k vizinhos mais próximos, k = 2",
    "caption.3": "Código-fonte, 22 linhas",
    "caption.4": "Rede neural, 7 camadas, 180 neurônios"
};
const EN = {};
document.querySelectorAll('[data-i18n]').forEach((el) => { EN[el.dataset.i18n] = el.innerHTML; });
EN['meta.title'] = document.title;
EN['meta.desc'] = document.querySelector('meta[name=description]').content;
window.I18N = { en: EN, pt: PT, lang: 'en' };

function setLang(lang) {
    window.I18N.lang = lang;
    const dict = lang === 'pt' ? PT : EN;
    document.querySelectorAll('[data-i18n]').forEach((el) => {
        const v = dict[el.dataset.i18n];
        if (v !== undefined) el.innerHTML = v;
    });
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
    document.title = dict['meta.title'];
    document.querySelector('meta[name=description]').content = dict['meta.desc'];
    const t = document.getElementById('lang-toggle');
    t.querySelector('[data-l="en"]').className = lang === 'en' ? '' : 'off';
    t.querySelector('[data-l="pt"]').className = lang === 'pt' ? '' : 'off';
    t.setAttribute('aria-label', lang === 'pt' ? 'Switch language to English' : 'Mudar idioma para português');
    window.dispatchEvent(new Event('langchange'));
    try { localStorage.setItem('lang', lang); } catch {}
}

let startLang = 'en';
try { startLang = localStorage.getItem('lang') || (navigator.language.startsWith('pt') ? 'pt' : 'en'); } catch {}
setLang(startLang);
document.getElementById('lang-toggle').addEventListener('click', () => setLang(window.I18N.lang === 'pt' ? 'en' : 'pt'));

// ---------- theme (light / dark) ----------
const themeBtn = document.getElementById('theme-toggle');
function syncThemeBtn() {
    const dark = document.documentElement.dataset.theme === 'dark';
    themeBtn.textContent = dark ? '☀' : '☾';
    themeBtn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    document.querySelector('meta[name=theme-color]').content = dark ? '#050607' : '#F6F6F3';
}
themeBtn.addEventListener('click', () => {
    const dark = document.documentElement.dataset.theme !== 'dark';
    if (dark) document.documentElement.dataset.theme = 'dark';
    else delete document.documentElement.dataset.theme;
    try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch {}
    syncThemeBtn();
    window.dispatchEvent(new Event('themechange'));
});
syncThemeBtn();
