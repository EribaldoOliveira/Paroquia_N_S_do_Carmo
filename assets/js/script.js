// ===== FAQ - abrir e fechar respostas =====
document.addEventListener("DOMContentLoaded", () => {
  const perguntas = document.querySelectorAll(".faq-question");

  perguntas.forEach(btn => {
    btn.addEventListener("click", () => {
      const item = btn.parentElement;

      // fecha os outros itens abertos
      document.querySelectorAll(".faq-item").forEach(el => {
        if (el !== item) el.classList.remove("active");
      });

      // abre/fecha o clicado
      item.classList.toggle("active");
    });
  });
});
