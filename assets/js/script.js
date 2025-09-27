// assets/js/script.js (substitua todo o conteúdo por este)

(function() {
  document.addEventListener('DOMContentLoaded', () => {

    /* ====== CARROSSEL ====== */
    let indiceSlide = 0;
    const slides = Array.from(document.querySelectorAll('.slide'));
    const indicadoresContainer = document.querySelector('.indicadores');
    let intervalo = null;

    if (slides.length && indicadoresContainer) {
      // cria bolinhas
      slides.forEach((_, i) => {
        const bolinha = document.createElement('span');
        bolinha.className = 'bolinha';
        if (i === 0) bolinha.classList.add('ativo');
        bolinha.addEventListener('click', () => {
          indiceSlide = i;
          mostrarSlide(indiceSlide);
          resetInterval();
        });
        indicadoresContainer.appendChild(bolinha);
      });

      function mostrarSlide(n) {
        if (n >= slides.length) indiceSlide = 0;
        if (n < 0) indiceSlide = slides.length - 1;
        slides.forEach(s => s.classList.remove('ativo'));
        const bolinhas = indicadoresContainer.querySelectorAll('.bolinha');
        bolinhas.forEach(b => b.classList.remove('ativo'));
        slides[indiceSlide].classList.add('ativo');
        if (bolinhas[indiceSlide]) bolinhas[indiceSlide].classList.add('ativo');
      }

      function moverSlide(n) {
        indiceSlide += n;
        mostrarSlide(indiceSlide);
        resetInterval();
      }

      const btnAnterior = document.querySelector('.anterior');
      const btnProximo = document.querySelector('.proximo');
      if (btnAnterior) btnAnterior.addEventListener('click', () => moverSlide(-1));
      if (btnProximo) btnProximo.addEventListener('click', () => moverSlide(1));

      // intervalo automático (3s)
      intervalo = setInterval(() => {
        indiceSlide++;
        mostrarSlide(indiceSlide);
      }, 3000);

      function resetInterval() {
        clearInterval(intervalo);
        intervalo = setInterval(() => {
          indiceSlide++;
          mostrarSlide(indiceSlide);
        }, 3000);
      }

      mostrarSlide(indiceSlide);
    }

    /* ====== CARRINHO ====== */
    window.cart = window.cart || [];

    window.alternarTroco = function(selectElement) {
      const campoTroco = document.getElementById('campo-troco');
      if (!campoTroco) return;
      campoTroco.style.display = selectElement.value === 'sim' ? 'block' : 'none';
    };

    window.adicionarCarrinho = function(nome, preco) {
      window.cart.push({ name: nome, price: preco });
      atualizarCarrinho();
    };

    function atualizarCarrinho() {
      const itensCarrinhoDiv = document.getElementById('itens-carrinho');
      const totalCarrinhoP = document.getElementById('total-carrinho');
      if (!itensCarrinhoDiv || !totalCarrinhoP) return;

      itensCarrinhoDiv.innerHTML = '';
      let total = 0;

      window.cart.forEach((item, index) => {
        const divItem = document.createElement('div');
        divItem.classList.add("item-carrinho");

        const nomeSpan = document.createElement('span');
        nomeSpan.className = 'produto-nome';
        nomeSpan.textContent = `${item.name} - R$ ${item.price.toFixed(2)}`;

        const btnRemover = document.createElement('button');
        btnRemover.textContent = '❌';
        btnRemover.className = "btn-remover";
        btnRemover.onclick = () => {
          window.cart.splice(index, 1);
          atualizarCarrinho();
        };

        divItem.appendChild(nomeSpan);
        divItem.appendChild(btnRemover);
        itensCarrinhoDiv.appendChild(divItem);

        total += item.price;
      });

      totalCarrinhoP.textContent = `Total: R$ ${total.toFixed(2)}`;
    }

    window.atualizarCarrinho = atualizarCarrinho;

    window.finalizarPedido = function() {
      const nomeEl = document.getElementById('nome');
      const enderecoEl = document.getElementById('endereco');
      const referenciaEl = document.getElementById('referencia');
      const mensagemEl = document.getElementById('mensagem');
      const trocoEl = document.getElementById('troco');
      const valorTrocoEl = document.getElementById('valor-troco');

      if (!nomeEl || !enderecoEl || !referenciaEl) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
      }

      const nome = nomeEl.value.trim();
      const endereco = enderecoEl.value.trim();
      const referencia = referenciaEl.value.trim();
      const mensagem = mensagemEl ? mensagemEl.value.trim() : '';
      const troco = trocoEl ? trocoEl.value : 'nao';
      const valorTroco = valorTrocoEl ? valorTrocoEl.value.trim() : '';

      if (!nome || !endereco || !referencia) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
      }

      if (!window.cart || window.cart.length === 0) {
        alert('Seu carrinho está vazio. Adicione produtos antes de finalizar.');
        return;
      }

      let pedido = `Olá, sou ${nome} e gostaria de finalizar o seguinte pedido:\n\n`;
      let total = 0;

      window.cart.forEach(prod => {
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

      const mensagemURL = encodeURIComponent(pedido);
      const numeroWhatsApp = '5579988035219';
      window.open(`https://wa.me/${numeroWhatsApp}?text=${mensagemURL}`, '_blank');
    };

    // inicializa visual do carrinho
    atualizarCarrinho();

    /* ====== FAQ (se existir) ====== */
    document.querySelectorAll(".faq-question").forEach(btn => {
      btn.addEventListener("click", () => {
        const item = btn.parentElement;
        item.classList.toggle("active");
      });
    });

    /* ====== AGENDA (executa somente se os elementos existirem) ====== */
    const diasMesDiv = document.getElementById('dias');
    const mesAnoH2 = document.getElementById('mesAno');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const modal = document.getElementById('evento-modal');
    const closeModal = modal ? modal.querySelector('.close') : null;
    const salvarEventoBtn = document.getElementById('salvar-evento');
    const eventoTituloInput = document.getElementById('evento-titulo');

    if (diasMesDiv && mesAnoH2 && prevMonthBtn && nextMonthBtn && salvarEventoBtn && eventoTituloInput) {
      // lógica do calendário (apenas aqui)
      let dataAtual = new Date();
      let eventoSelecionado = null;
      let eventos = {};

      function atualizarCalendario() {
        const ano = dataAtual.getFullYear();
        const mes = dataAtual.getMonth();
        const primeiroDia = new Date(ano, mes, 1);
        const ultimoDia = new Date(ano, mes + 1, 0);

        diasMesDiv.innerHTML = '';

        for (let i = 0; i < primeiroDia.getDay(); i++) {
          const divVazia = document.createElement('div');
          diasMesDiv.appendChild(divVazia);
        }

        for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
          const divDia = document.createElement('div');
          divDia.classList.add('dia');
          divDia.textContent = dia;

          const dataFormatada = `${ano}-${String(mes+1).padStart(2,'0')}-${String(dia).padStart(2,'0')}`;

          if (eventos[dataFormatada]) {
            divDia.classList.add('evento');
            divDia.title = eventos[dataFormatada];
          }

          divDia.addEventListener('click', () => abrirModal(dataFormatada));
          diasMesDiv.appendChild(divDia);
        }

        const meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
        mesAnoH2.textContent = `${meses[mes]} ${ano}`;
      }

      prevMonthBtn.addEventListener('click', () => {
        dataAtual.setMonth(dataAtual.getMonth() - 1);
        atualizarCalendario();
      });
      nextMonthBtn.addEventListener('click', () => {
        dataAtual.setMonth(dataAtual.getMonth() + 1);
        atualizarCalendario();
      });

      function abrirModal(data) {
        eventoSelecionado = data;
        eventoTituloInput.value = eventos[data] || '';
        if (modal) modal.style.display = 'block';
      }

      if (closeModal) closeModal.addEventListener('click', () => {
        if (modal) modal.style.display = 'none';
      });

      window.addEventListener('click', e => {
        if (e.target == modal) {
          if (modal) modal.style.display = 'none';
        }
      });

      salvarEventoBtn.addEventListener('click', () => {
        const titulo = eventoTituloInput.value.trim();
        if (titulo) {
          eventos[eventoSelecionado] = titulo;
        } else {
          delete eventos[eventoSelecionado];
        }
        if (modal) modal.style.display = 'none';
        atualizarCalendario();
      });

      atualizarCalendario();
    }

    /* ====== BOTÃO VOLTAR AO TOPO ====== */
    const topoBtn = document.getElementById("topoBtn");
    if (topoBtn) {
      topoBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });

      // mostra/esconde o botão conforme scroll
      window.addEventListener('scroll', () => {
        if (window.scrollY > 200) topoBtn.style.display = 'block';
        else topoBtn.style.display = 'none';
      });

      // inicialmente oculto
      topoBtn.style.display = 'none';
    }

  }); // DOMContentLoaded
})(); // IIFE


