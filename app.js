// ============================================================
//  app.js - Mini Ecommerce | Semana 15
//  Funcionalidades: listagem, filtro, detalhes e favoritos
// ============================================================

// Base de dados de produtos
const data = {
  produtos: [
    {
      id: 1,
      nome: "Iphone 15",
      preco: 4999.60,
      categoria: "Celulares",
      imagem: "imagens/iphone15.png",
      descricao: "Iphone, 256gb na cor Preta, tela OLED 6.1'' e câmera 48MP.",
      emEstoque: true
    },
    {
      id: 2,
      nome: "Galaxy S24",
      preco: 3879.60,
      categoria: "Celulares",
      imagem: "imagens/galaxyS24.png",
      descricao: "Smartphone Samsung com IA integrada, tela 6.2'' e bateria de longa duração.",
      emEstoque: true
    },
    {
      id: 3,
      nome: "Notebook Dell Inspiron",
      preco: 3499.90,
      categoria: "Notebooks",
      imagem: "imagens/notebook.png",
      descricao: "Notebook com Intel i5, 8GB RAM, SSD 256GB e tela Full HD 15.6''.",
      emEstoque: true
    },
    {
      id: 4,
      nome: "MacBook Air M2",
      preco: 10995.00,
      categoria: "Notebooks",
      imagem: "imagens/macbook.png",
      descricao: "Notebook Apple ultrafino com chip M2, 8GB RAM e autonomia de 18h.",
      emEstoque: false
    },
    {
      id: 5,
      nome: "Fone Bluetooth JBL",
      preco: 299.90,
      categoria: "Acessórios",
      imagem: "imagens/fone.png",
      descricao: "Fone de ouvido over-ear com cancelamento de ruído e 30h de bateria.",
      emEstoque: true
    },
    {
      id: 6,
      nome: "Mouse Gamer Logitech",
      preco: 589.90,
      categoria: "Acessórios",
      imagem: "imagens/mouse.png",
      descricao: "Mouse gamer com DPI ajustável até 16000 e iluminação RGB.",
      emEstoque: true
    },
    {
      id: 7,
      nome: "PlayStation 5",
      preco: 3999.00,
      categoria: "Games",
      imagem: "imagens/playstation.png",
      descricao: "Console Sony com SSD ultrarrápido, resolução 4K e controle DualSense.",
      emEstoque: false
    },
    {
      id: 8,
      nome: "Xbox Series X",
      preco: 3799.00,
      categoria: "Games",
      imagem: "imagens/xbox.png",
      descricao: "Console Microsoft com 12 teraflops, 1TB SSD e suporte a 4K/120fps.",
      emEstoque: true
    }
  ]
};

// ============================================================
//  Utilitários
// ============================================================

function formatPrice(preco) {
  return "R$ " + preco.toFixed(2).replace(".", ",");
}

/** Exibe um toast de aviso na tela */
function mostrarToast(mensagem, tipo = "info") {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = mensagem;
  toast.className = `toast toast-${tipo}`;
  toast.style.display = "block";
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => { toast.style.display = "none"; }, 3000);
}

// ============================================================
//  Favoritos
// ============================================================

/**
 * Retorna a chave do localStorage para os favoritos do usuário logado.
 * Padrão: favoritos_<idDoUsuario>
 */
function getChaveFavoritos() {
  const usuario = getUsuarioCorrente();
  return usuario ? `favoritos_${usuario.id}` : null;
}

/** Retorna array de IDs favoritos do usuário logado */
function getFavoritos() {
  const chave = getChaveFavoritos();
  if (!chave) return [];
  return JSON.parse(localStorage.getItem(chave) || "[]");
}

/** Verifica se um produto é favorito */
function isFavorito(idProduto) {
  return getFavoritos().includes(idProduto);
}

/**
 * Adiciona ou remove um produto dos favoritos.
 * Retorna true se foi adicionado, false se foi removido.
 * Retorna null se o usuário não está logado.
 */
function toggleFavorito(idProduto) {
  const usuario = getUsuarioCorrente();
  if (!usuario) return null;

  const chave = getChaveFavoritos();
  let favoritos = getFavoritos();

  if (favoritos.includes(idProduto)) {
    favoritos = favoritos.filter(id => id !== idProduto);
    localStorage.setItem(chave, JSON.stringify(favoritos));
    return false; // removido
  } else {
    favoritos.push(idProduto);
    localStorage.setItem(chave, JSON.stringify(favoritos));
    return true; // adicionado
  }
}

// ============================================================
//  Cards de Produto
// ============================================================

function createProductCard(produto) {
  const card = document.createElement("div");
  card.setAttribute("data-id", produto.id);
  card.classList.add("card");

  if (!produto.emEstoque) {
    card.classList.add("sem-estoque-card");
  }

  // Imagem
  const img = document.createElement("img");
  img.setAttribute("src", produto.imagem);
  img.setAttribute("alt", produto.nome);

  // Badge "Fora de estoque"
  if (!produto.emEstoque) {
    const badge = document.createElement("span");
    badge.classList.add("badge-sem-estoque");
    badge.textContent = "Fora de estoque";
    card.appendChild(badge);
  }

  const title = document.createElement("p");
  title.classList.add("card-title");
  title.textContent = produto.nome;

  const price = document.createElement("p");
  price.classList.add("card-price");
  price.textContent = formatPrice(produto.preco);

  const category = document.createElement("p");
  category.classList.add("card-category");
  category.textContent = produto.categoria;

  // Botão Ver Detalhes
  const btnDetails = document.createElement("button");
  btnDetails.classList.add("btn-details");
  btnDetails.textContent = "Ver detalhes";
  btnDetails.addEventListener("click", () => {
    window.location.href = `detalhes.html?id=${produto.id}`;
  });

  // Botão Favoritar
  const btnFav = document.createElement("button");
  btnFav.classList.add("btn-favorito");
  btnFav.setAttribute("data-id", produto.id);
  atualizarBtnFavorito(btnFav, isFavorito(produto.id));

  // Marcar card se já for favorito
  if (isFavorito(produto.id)) {
    card.classList.add("favoritado");
  }

  btnFav.addEventListener("click", () => {
    const usuario = getUsuarioCorrente();

    if (!usuario) {
      mostrarToast("🔒 Faça login para favoritar produtos!", "aviso");
      setTimeout(() => {
        window.location.href = "/modulos/login/index.html";
      }, 1500);
      return;
    }

    const adicionado = toggleFavorito(produto.id);
    atualizarBtnFavorito(btnFav, adicionado);
    card.classList.toggle("favoritado", adicionado);

    if (adicionado) {
      mostrarToast(`❤️ "${produto.nome}" adicionado aos favoritos!`, "sucesso");
    } else {
      mostrarToast(`💔 "${produto.nome}" removido dos favoritos.`, "info");
    }
  });

  card.appendChild(img);
  card.appendChild(title);
  card.appendChild(price);
  card.appendChild(category);
  card.appendChild(btnDetails);
  card.appendChild(btnFav);

  return card;
}

function atualizarBtnFavorito(btn, ativo) {
  if (ativo) {
    btn.textContent = "❤️ Favoritado";
    btn.classList.add("ativo");
  } else {
    btn.textContent = "🤍 Favoritar";
    btn.classList.remove("ativo");
  }
}

// ============================================================
//  Renderização e Filtros
// ============================================================

const productList = document.getElementById("product-list");
const searchInput = document.querySelector("#search");
const categorySelect = document.querySelector("#category");
const btnRender = document.querySelector("#btnRender");

function renderProducts(produtos) {
  if (!productList) return;
  productList.innerHTML = "";
  produtos.forEach(produto => {
    const card = createProductCard(produto);
    productList.appendChild(card);
  });
}

function renderCategories() {
  if (!categorySelect) return;
  const categorias = ["Todas", ...new Set(data.produtos.map(p => p.categoria))];
  categorySelect.innerHTML = "";
  categorias.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });
}

function filterProducts() {
  const texto = searchInput ? searchInput.value.toLowerCase() : "";
  const categoriaSelecionada = categorySelect ? categorySelect.value : "Todas";

  return data.produtos.filter(p => {
    const nomeOk = p.nome.toLowerCase().includes(texto);
    const categoriaOk = categoriaSelecionada === "Todas" || p.categoria === categoriaSelecionada;
    return nomeOk && categoriaOk;
  });
}

if (searchInput) {
  searchInput.addEventListener("input", () => renderProducts(filterProducts()));
}

if (categorySelect) {
  categorySelect.addEventListener("change", () => renderProducts(filterProducts()));
}

if (btnRender) {
  btnRender.addEventListener("click", () => renderProducts(filterProducts()));
}

// Inicializa home
if (document.getElementById("product-list")) {
  renderCategories();
  renderProducts(data.produtos);
}

// ============================================================
//  Página de Detalhes
// ============================================================

const isDetalhes =
  document.getElementById("product-details") &&
  !document.getElementById("product-list");

if (isDetalhes) {
  carregarDetalhes();
}

function carregarDetalhes() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"));
  const produto = data.produtos.find(p => p.id === id);
  const detalhes = document.getElementById("product-details");

  if (!produto || !detalhes) return;

  const statusClass = produto.emEstoque ? "em-estoque" : "sem-estoque";
  const statusTexto = produto.emEstoque ? "✅ Em estoque" : "❌ Fora de estoque";
  const favAtivo = isFavorito(produto.id);

  detalhes.innerHTML = `
    <img src="${produto.imagem}" width="250" alt="${produto.nome}">
    <h2>${produto.nome}</h2>
    <p><strong>Preço:</strong> ${formatPrice(produto.preco)}</p>
    <p><strong>Categoria:</strong> ${produto.categoria}</p>
    <p class="${statusClass}">${statusTexto}</p>
    <p>${produto.descricao}</p>
    <div class="detalhes-acoes">
      <button id="btnFavDetalhe" class="btn-favorito${favAtivo ? " ativo" : ""}">
        ${favAtivo ? "❤️ Favoritado" : "🤍 Favoritar"}
      </button>
      <a href="index.html">← Voltar</a>
    </div>
  `;

  document.getElementById("btnFavDetalhe").addEventListener("click", function () {
    const usuario = getUsuarioCorrente();
    if (!usuario) {
      alert("🔒 Faça login para favoritar produtos!");
      window.location.href = "/modulos/login/index.html";
      return;
    }
    const adicionado = toggleFavorito(produto.id);
    atualizarBtnFavorito(this, adicionado);
  });
}
