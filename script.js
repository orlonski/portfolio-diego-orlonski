/* =========================================================
   script.js — Portfólio de Diego Davi Orlonski
   JavaScript puro (sem bibliotecas ou frameworks).
   Funções: tema claro/escuro, menu responsivo, destaque do
   item ativo no menu, validação e envio simulado do formulário.
   ========================================================= */

(function () {
  'use strict';

  var raiz = document.documentElement;

  /* ---------------------------------------------------------
     1) TEMA CLARO / ESCURO
     Troca o atributo data-tema no <html>; o CSS reage às variáveis.
     A escolha fica salva no localStorage para as próximas visitas.
     --------------------------------------------------------- */
  var btnTema = document.getElementById('btnTema');

  function aplicarTema(tema) {
    if (tema === 'escuro') {
      raiz.setAttribute('data-tema', 'escuro');
      btnTema.textContent = '☀️';
    } else {
      raiz.removeAttribute('data-tema');
      btnTema.textContent = '🌙';
    }
  }

  // Tema inicial: o salvo pelo usuário ou, na falta dele, a preferência do sistema
  var temaSalvo = null;
  try { temaSalvo = localStorage.getItem('tema'); } catch (e) { /* ignora */ }
  if (!temaSalvo) {
    temaSalvo = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro';
  }
  aplicarTema(temaSalvo);

  btnTema.addEventListener('click', function () {
    var novo = raiz.getAttribute('data-tema') === 'escuro' ? 'claro' : 'escuro';
    aplicarTema(novo);
    try { localStorage.setItem('tema', novo); } catch (e) { /* ignora */ }
  });

  /* ---------------------------------------------------------
     2) MENU RESPONSIVO (hambúrguer no celular)
     --------------------------------------------------------- */
  var btnMenu = document.getElementById('btnMenu');
  var listaMenu = document.getElementById('listaMenu');

  btnMenu.addEventListener('click', function () {
    var aberto = listaMenu.classList.toggle('aberto');
    btnMenu.setAttribute('aria-expanded', aberto ? 'true' : 'false');
  });

  // Ao clicar em um link, fecha o menu (no celular)
  listaMenu.addEventListener('click', function (ev) {
    if (ev.target.tagName === 'A') {
      listaMenu.classList.remove('aberto');
      btnMenu.setAttribute('aria-expanded', 'false');
    }
  });

  /* ---------------------------------------------------------
     3) DESTAQUE DO ITEM ATIVO NO MENU
     IntersectionObserver detecta qual seção está visível na tela
     e marca o link correspondente com a classe "ativo".
     --------------------------------------------------------- */
  var links = listaMenu.querySelectorAll('a');
  var secoes = document.querySelectorAll('main section');

  if ('IntersectionObserver' in window) {
    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          links.forEach(function (a) {
            a.classList.toggle('ativo', a.getAttribute('href') === '#' + entrada.target.id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' }); // considera a seção que cruza o meio da tela

    secoes.forEach(function (s) { observador.observe(s); });
  }

  /* ---------------------------------------------------------
     4) FORMULÁRIO DE CONTATO: VALIDAÇÃO + ENVIO SIMULADO
     --------------------------------------------------------- */
  var form = document.getElementById('formContato');
  var campoNome = document.getElementById('nome');
  var campoEmail = document.getElementById('email');
  var campoMsg = document.getElementById('mensagem');

  // Expressão regular simples para formato de e-mail: algo@dominio.ext
  var regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  // Mostra ou limpa a mensagem de erro de um campo
  function marcarErro(campo, idErro, texto) {
    document.getElementById(idErro).textContent = texto;
    campo.parentElement.classList.toggle('invalido', texto !== '');
  }

  // Cada função devolve true se o campo é válido
  function validarNome() {
    var ok = campoNome.value.trim().length >= 3;
    marcarErro(campoNome, 'erroNome', ok ? '' : 'Informe seu nome (mínimo 3 caracteres).');
    return ok;
  }

  function validarEmail() {
    var valor = campoEmail.value.trim();
    var texto = '';
    if (valor === '') texto = 'Informe seu e-mail.';
    else if (!regexEmail.test(valor)) texto = 'E-mail inválido. Exemplo: usuario@dominio.com';
    marcarErro(campoEmail, 'erroEmail', texto);
    return texto === '';
  }

  function validarMensagem() {
    var ok = campoMsg.value.trim().length >= 10;
    marcarErro(campoMsg, 'erroMensagem', ok ? '' : 'Escreva uma mensagem (mínimo 10 caracteres).');
    return ok;
  }

  // Validação em tempo real: ao sair do campo
  campoNome.addEventListener('blur', validarNome);
  campoEmail.addEventListener('blur', validarEmail);
  campoMsg.addEventListener('blur', validarMensagem);

  // Envio do formulário
  form.addEventListener('submit', function (ev) {
    ev.preventDefault(); // impede o envio real: o envio é apenas simulado

    // Executa todas as validações (sem curto-circuito, para exibir todos os erros de uma vez)
    var valido = [validarNome(), validarEmail(), validarMensagem()].every(Boolean);

    if (!valido) {
      // Foca o primeiro campo com erro
      var primeiro = form.querySelector('.invalido input, .invalido textarea');
      if (primeiro) primeiro.focus();
      return;
    }

    // Simulação do envio: limpa os campos e mostra o modal de confirmação
    form.reset();
    abrirModal();
  });

  /* ---------------------------------------------------------
     5) MODAL DE CONFIRMAÇÃO
     --------------------------------------------------------- */
  var modal = document.getElementById('modal');
  var btnFechar = document.getElementById('fecharModal');

  function abrirModal() {
    modal.hidden = false;
    btnFechar.focus();
  }
  function fecharModal() {
    modal.hidden = true;
  }

  btnFechar.addEventListener('click', fecharModal);
  modal.addEventListener('click', function (ev) {
    if (ev.target === modal) fecharModal();      // clique fora da caixa fecha
  });
  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape' && !modal.hidden) fecharModal();
  });

  /* ---------------------------------------------------------
     6) ANO ATUAL NO RODAPÉ
     --------------------------------------------------------- */
  document.getElementById('ano').textContent = new Date().getFullYear();
})();
