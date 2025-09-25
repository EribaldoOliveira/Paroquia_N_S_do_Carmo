// ===== CARROSSEL =====
let indiceSlide = 0;
const slides = document.querySelectorAll('.slide');
const indicadoresContainer = document.querySelector('.indicadores');

// Cria bolinhas automaticamente
slides.forEach((_, i) => {
    const bolinha = document.createElement('span');
    bolinha.classList.add('bolinha');
    if (i === 0) bolinha.classList.add('ativo');
    bolinha.addEventListener('click', () => {
        indiceSlide = i;
        mostrarSlide(indiceSlide);
        resetInterval();
    });
    indicadoresContainer.appendChild(bolinha);
});

const bolinhas = document.querySelectorAll('.bolinha');

// Função para mostrar slide
function mostrarSlide(n) {
    if (n >= slides.length) indiceSlide = 0;
    if (n < 0) indiceSlide = slides.length - 1;

    slides.forEach(slide => slide.classList.remove('ativo'));
    bolinhas.forEach(b => b.classList.remove('ativo'));

    slides[indiceSlide].classList.add('ativo');
    bolinhas[indiceSlide].classList.add('ativo');
}

// Funções para avançar ou voltar slide
function moverSlide(n) {
    indiceSlide += n;
    mostrarSlide(indiceSlide);
    resetInterval();
}

// Intervalo automático
let intervalo = setInterval(() => {
    indiceSlide++;
    mostrarSlide(indiceSlide);
}, 1000); // troca a cada 3 segundos

function resetInterval() {
    clearInterval(intervalo);
    intervalo = setInterval(() => {
        indiceSlide++;
        mostrarSlide(indiceSlide);
    }, 1000);
}

// Botões anterior/proximo
const btnAnterior = document.querySelector('.anterior');
const btnProximo = document.querySelector('.proximo');

if (btnAnterior && btnProximo) {
    btnAnterior.addEventListener('click', () => moverSlide(-1));
    btnProximo.addEventListener('click', () => moverSlide(1));
}

// Inicializa carrossel
mostrarSlide(indiceSlide);

// ===== CARRINHO =====
let cart = [];

// Alterna exibição do campo de troco
function alternarTroco(selectElement) {
    const campoTroco = document.getElementById('campo-troco');
    campoTroco.style.display = selectElement.value === 'sim' ? 'block' : 'none';
}

// Adiciona item ao carrinho
function adicionarCarrinho(nome, preco) {
    cart.push({ name: nome, price: preco });
    atualizarCarrinho();
}

// Atualiza exibição do carrinho
function atualizarCarrinho() {
    const itensCarrinhoDiv = document.getElementById('itens-carrinho');
    const totalCarrinhoP = document.getElementById('total-carrinho');
    itensCarrinhoDiv.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        const divItem = document.createElement('div');
        divItem.classList.add("item-carrinho");
        divItem.textContent = `${item.name} - R$ ${item.price.toFixed(2)}`;
        divItem.style.display = 'flex';
        divItem.style.justifyContent = 'space-between';
        divItem.style.alignItems = 'center';
        divItem.style.marginBottom = '6px';

        // Botão remover item
        const btnRemover = document.createElement('button');
        btnRemover.textContent = '❌';
        btnRemover.classList.add("btn-remover");
        btnRemover.onclick = () => {
            cart.splice(index, 1);
            atualizarCarrinho();
        };

        divItem.appendChild(btnRemover);
        itensCarrinhoDiv.appendChild(divItem);
        total += item.price;
    });

    totalCarrinhoP.textContent = `Total: R$ ${total.toFixed(2)}`;
}

// Finaliza pedido e envia para WhatsApp
function finalizarPedido() {
    const nome = document.getElementById('nome').value.trim();
    const endereco = document.getElementById('endereco').value.trim();
    const referencia = document.getElementById('referencia').value.trim();
    const mensagem = document.getElementById('mensagem').value.trim();
    const troco = document.getElementById('troco').value;
    const valorTroco = document.getElementById('valor-troco').value.trim();

    if (!nome || !endereco || !referencia) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    if (cart.length === 0) {
        alert('Seu carrinho está vazio. Adicione produtos antes de finalizar.');
        return;
    }

    let pedido = `Olá, sou ${nome} e gostaria de finalizar o seguinte pedido:\n\n`;
    let total = 0;

    cart.forEach(prod => {
        pedido += `${prod.name}: R$ ${prod.price.toFixed(2)}\n`;
        total += prod.price;
    });

    pedido += `\nTotal: R$ ${total.toFixed(2)}`;
    pedido += `\nEndereço: ${endereco}\nPonto de Referência: ${referencia}`;

    if (troco === 'sim') {
        pedido += valorTroco ? `\nTroco para: R$ ${valorTroco}` : `\nTroco solicitado (valor não informado)`;
    }

    if (mensagem) {
        pedido += `\nMensagem: ${mensagem}`;
    }

    // Envia para WhatsApp
    const mensagemURL = encodeURIComponent(pedido);
    const numeroWhatsApp = '5579988035219';
    window.open(`https://wa.me/${numeroWhatsApp}?text=${mensagemURL}`, '_blank');
}

// ===== FAQ =====
document.querySelectorAll(".faq-question").forEach(btn => {
  btn.addEventListener("click", () => {
    const item = btn.parentElement;
    item.classList.toggle("active");
  });
});
