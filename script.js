let dados = [];
let categoriaAtual = 'Todas';
let buscaAtual = '';

// Tema Claro/Escuro
const themeBtn = document.getElementById('toggle-theme');
const body = document.body;

// Verifica se o usuário já escolheu um tema antes
if (localStorage.getItem('theme') === 'light') {
  body.classList.add('light-theme');
  themeBtn.textContent = '☀️';
}

themeBtn.addEventListener('click', () => {
  body.classList.toggle('light-theme');
  const isLight = body.classList.contains('light-theme');
  themeBtn.textContent = isLight ? '☀️' : '🌙';
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
});

async function carregar() {
  try {
    const res = await fetch('dados.json');
    dados = await res.json();
    montarCategorias();
    renderizar();
  } catch (error) {
    console.error("Erro ao carregar dados.json:", error);
    document.getElementById('grid').innerHTML = '<p style="grid-column:1/-1;text-align:center;opacity:0.6">Erro ao carregar os materiais. Verifique o arquivo dados.json.</p>';
  }
}

function montarCategorias() {
  const cats = ['Todas', ...new Set(dados.map(d => d.categoria))];
  const div = document.getElementById('categorias');
  div.innerHTML = cats.map(c => 
    `<button onclick="filtrar('${c}')" class="${c === categoriaAtual ? 'ativo' : ''}">${c}</button>`
  ).join('');
}

function filtrar(cat) {
  categoriaAtual = cat;
  montarCategorias();
  renderizar();
}

function icone(tipo) {
  return { pdf: '📄', pasta: '📁', video: '🎥', imagem: '🖼️', doc: '📝', artigo: '📰', audio: '🎵' }[tipo] || '📦';
}

function renderizar() {
  const termo = buscaAtual.toLowerCase();
  const filtrados = dados.filter(d => 
    (categoriaAtual === 'Todas' || d.categoria === categoriaAtual) &&
    d.titulo.toLowerCase().includes(termo)
  );

  document.getElementById('grid').innerHTML = filtrados.map(d => `
    <a href="${d.link}" target="_blank" class="card">
      <div class="icone">${icone(d.tipo)}</div>
      <div class="info">
        <h3>${d.titulo}</h3>
        <span>${d.categoria}</span>
      </div>
    </a>
  `).join('') || '<p style="grid-column:1/-1;text-align:center;opacity:0.6">Nada encontrado 😕</p>';
}

document.getElementById('busca').addEventListener('input', e => {
  buscaAtual = e.target.value;
  renderizar();
});

carregar();
