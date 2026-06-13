/**
 * login.js - Módulo de Login de Usuário
 * Mini Ecommerce - Semana 15
 *
 * Funções principais:
 *   initLoginApp()   - inicializa o módulo, carrega usuários e verifica sessão
 *   loginUser(login, senha) - valida credenciais e salva sessão
 *   logoutUser()     - encerra sessão e redireciona para login
 *   getUsuarioCorrente() - retorna o objeto do usuário logado (ou null)
 */

let usuariosBD = [];

/**
 * Retorna o usuário logado a partir do sessionStorage.
 * @returns {object|null} usuarioCorrente ou null
 */
function getUsuarioCorrente() {
  const dados = sessionStorage.getItem("usuarioCorrente");
  return dados ? JSON.parse(dados) : null;
}

/**
 * Salva o usuário logado no sessionStorage.
 * @param {object} usuario
 */
function setUsuarioCorrente(usuario) {
  sessionStorage.setItem("usuarioCorrente", JSON.stringify(usuario));
}

/**
 * Realiza o login: busca o usuário no banco e valida a senha.
 * Se OK, monta o objeto usuarioCorrente, salva no sessionStorage
 * e redireciona para a home.
 * @param {string} login
 * @param {string} senha
 * @returns {boolean} true se login OK, false caso contrário
 */
function loginUser(login, senha) {
  const usuario = usuariosBD.find(
    (u) => u.login === login && u.senha === senha
  );

  if (!usuario) return false;

  const usuarioCorrente = {
    id: usuario.id,
    nome: usuario.nome,
    login: usuario.login,
    senha: usuario.senha,
    email: usuario.email,
  };

  setUsuarioCorrente(usuarioCorrente);
  window.location.href = "/index.html";
  return true;
}

/**
 * Realiza o logout: apaga o usuário do sessionStorage
 * e redireciona para o formulário de login.
 */
function logoutUser() {
  sessionStorage.removeItem("usuarioCorrente");
  window.location.href = "/modulos/login/index.html";
}

/**
 * Inicializa o módulo de login:
 *  1. Carrega os usuários do JSON Server via fetch('/usuarios')
 *  2. Verifica se há usuário logado no sessionStorage
 *  3. Se não houver, redireciona para o formulário de login
 *  4. Atualiza a UI da home com os dados do usuário logado
 */
async function initLoginApp() {
  // Carrega usuários do JSON Server
  try {
    const response = await fetch("/usuarios");
    if (response.ok) {
      usuariosBD = await response.json();
    }
  } catch (err) {
    console.warn("JSON Server indisponível, usando array vazio.", err);
  }

  const usuario = getUsuarioCorrente();

  // Se estamos na home e o usuário não está logado → redireciona para login
  const isHome =
    window.location.pathname === "/" ||
    window.location.pathname.endsWith("index.html") ||
    window.location.pathname === "";

  const isLoginPage = window.location.pathname.includes("modulos/login");

  if (!usuario && isHome) {
    window.location.href = "/modulos/login/index.html";
    return;
  }

  // Atualiza área de login na UI
  atualizarUILogin(usuario);
}

/**
 * Atualiza a área de login na interface conforme o estado do usuário.
 * @param {object|null} usuario
 */
function atualizarUILogin(usuario) {
  const loginArea = document.getElementById("login-area");
  if (!loginArea) return;

  if (usuario) {
    loginArea.innerHTML = `
      <span class="login-greeting">Olá, <strong>${usuario.nome}</strong></span>
      <span class="login-separator">|</span>
      <a href="#" class="login-link" onclick="logoutUser(); return false;">Sair</a>
    `;
  } else {
    loginArea.innerHTML = `
      <a href="/modulos/login/index.html" class="login-link">Entrar</a>
    `;
  }
}

// Inicializa ao carregar a página
document.addEventListener("DOMContentLoaded", initLoginApp);
