/**
 * script.js – Portfólio Dheicy Gulchinski
 * Disciplina: Fundamentos da Programação Web – UNINTER
 * JavaScript puro (Vanilla JS), sem frameworks ou bibliotecas
 */

// ===========================================================
// 1. TEMA CLARO / ESCURO
//    Lê preferência salva no localStorage e aplica ao carregar
// ===========================================================
const THEME_KEY = 'portfolio-theme';
const body = document.body;
const themeBtn = document.getElementById('themeToggle');

/**
 * Aplica o tema recebido ('dark' ou 'light') ao body
 * e atualiza o ícone do botão.
 * @param {string} theme
 */
function applyTheme(theme) {
  if (theme === 'dark') {
    body.classList.add('dark');
    themeBtn.textContent = '☀️';
    themeBtn.setAttribute('aria-label', 'Ativar tema claro');
  } else {
    body.classList.remove('dark');
    themeBtn.textContent = '🌙';
    themeBtn.setAttribute('aria-label', 'Ativar tema escuro');
  }
}

// Carrega tema salvo (ou padrão: claro)
const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
applyTheme(savedTheme);

// Evento de clique: alterna entre claro e escuro
themeBtn.addEventListener('click', function () {
  const newTheme = body.classList.contains('dark') ? 'light' : 'dark';
  applyTheme(newTheme);
  // Salva preferência para próximas visitas
  localStorage.setItem(THEME_KEY, newTheme);
});


// ===========================================================
// 2. MENU HAMBÚRGUER (responsivo para mobile)
//    Mostra/esconde o menu de navegação em telas pequenas
// ===========================================================
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', function () {
  // Alterna a classe 'open' que exibe o menu dropdown
  navLinks.classList.toggle('open');
  // Atualiza atributo ARIA para acessibilidade
  const isOpen = navLinks.classList.contains('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

// Fecha o menu mobile ao clicar em qualquer link
navLinks.querySelectorAll('.nav-link').forEach(function (link) {
  link.addEventListener('click', function () {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', false);
  });
});


// ===========================================================
// 3. DESTAQUE DO LINK ATIVO NA NAVEGAÇÃO
//    Usa IntersectionObserver para detectar qual seção
//    está visível e marca o link correspondente como ativo
// ===========================================================
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link');

// IntersectionObserver detecta quando uma seção entra na viewport
const observerOptions = {
  root: null,        // viewport
  rootMargin: '-40% 0px -50% 0px',
  threshold: 0
};

const sectionObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      // Remove 'active' de todos os links
      navItems.forEach(function (item) { item.classList.remove('active'); });
      // Adiciona 'active' ao link que corresponde à seção visível
      const activeLink = document.querySelector('.nav-link[href="#' + entry.target.id + '"]');
      if (activeLink) { activeLink.classList.add('active'); }
    }
  });
}, observerOptions);

sections.forEach(function (sec) { sectionObserver.observe(sec); });


// ===========================================================
// 4. ANIMAÇÃO DAS BARRAS DE HABILIDADE E IDIOMAS
//    Ativa as transições CSS somente quando os elementos
//    entram na viewport (melhora performance e experiência)
// ===========================================================
const skillFills = document.querySelectorAll('.skill-fill, .lang-fill');

const skillObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      // Define a largura real (que está no atributo style inline do HTML)
      // O CSS faz a animação de 0% até o valor definido
      const el = entry.target;
      const targetWidth = el.style.width; // ex: "65%"
      el.style.width = '0%';              // reseta para disparar transição
      // Pequeno delay para forçar re-paint antes de animar
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          el.style.width = targetWidth;
        });
      });
      // Para de observar após animar (executa só uma vez)
      skillObserver.unobserve(el);
    }
  });
}, { threshold: 0.3 });

skillFills.forEach(function (fill) { skillObserver.observe(fill); });


// ===========================================================
// 5. VALIDAÇÃO E ENVIO DO FORMULÁRIO DE CONTATO
//    - Verifica campos obrigatórios
//    - Valida formato de e-mail com RegExp
//    - Simula envio e exibe modal de confirmação
// ===========================================================
const contactForm = document.getElementById('contactForm');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose   = document.getElementById('modalClose');

/**
 * Exibe mensagem de erro abaixo de um campo.
 * @param {string} fieldId - id do input/textarea
 * @param {string} errorId - id do span de erro
 * @param {string} msg     - texto do erro
 */
function showError(fieldId, errorId, msg) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  field.classList.add('error');
  error.textContent = msg;
}

/**
 * Limpa mensagem de erro de um campo.
 * @param {string} fieldId
 * @param {string} errorId
 */
function clearError(fieldId, errorId) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  field.classList.remove('error');
  error.textContent = '';
}

/**
 * Valida o formato de um endereço de e-mail.
 * Expressão regular básica: usuario@dominio.extensao
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return regex.test(email);
}

// Evento de envio do formulário
contactForm.addEventListener('submit', function (event) {
  // Previne o comportamento padrão de recarregar a página
  event.preventDefault();

  // Lê valores dos campos
  const nome      = document.getElementById('nome').value.trim();
  const email     = document.getElementById('email').value.trim();
  const mensagem  = document.getElementById('mensagem').value.trim();

  // Limpa erros anteriores
  clearError('nome', 'erroNome');
  clearError('email', 'erroEmail');
  clearError('mensagem', 'erroMensagem');

  // Flag de controle: formulário válido?
  let formValido = true;

  // Validação: nome obrigatório (mínimo 2 caracteres)
  if (nome.length < 2) {
    showError('nome', 'erroNome', 'Por favor, informe seu nome completo.');
    formValido = false;
  }

  // Validação: e-mail obrigatório e formato válido
  if (!email) {
    showError('email', 'erroEmail', 'Por favor, informe seu e-mail.');
    formValido = false;
  } else if (!isValidEmail(email)) {
    showError('email', 'erroEmail', 'E-mail inválido. Use o formato usuario@dominio.com');
    formValido = false;
  }

  // Validação: mensagem obrigatória (mínimo 10 caracteres)
  if (mensagem.length < 10) {
    showError('mensagem', 'erroMensagem', 'A mensagem deve ter pelo menos 10 caracteres.');
    formValido = false;
  }

  // Se todos os campos são válidos, simula o envio
  if (formValido) {
    // Limpa todos os campos do formulário
    contactForm.reset();
    // Exibe o modal de confirmação de envio bem-sucedido
    modalOverlay.classList.add('show');
  }
});

// Fecha o modal ao clicar no botão "Fechar"
modalClose.addEventListener('click', function () {
  modalOverlay.classList.remove('show');
});

// Fecha o modal ao clicar fora da caixa do modal
modalOverlay.addEventListener('click', function (event) {
  if (event.target === modalOverlay) {
    modalOverlay.classList.remove('show');
  }
});

// Fecha o modal ao pressionar ESC no teclado
document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape' && modalOverlay.classList.contains('show')) {
    modalOverlay.classList.remove('show');
  }
});


// ===========================================================
// 6. NAVBAR: muda aparência ao rolar a página
//    Adiciona sombra ao header quando o usuário rola para baixo
// ===========================================================
const header = document.getElementById('header');

window.addEventListener('scroll', function () {
  if (window.scrollY > 50) {
    header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.12)';
  } else {
    header.style.boxShadow = 'none';
  }
});
