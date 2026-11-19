const button = document.querySelector(".button-add-task");
const input = document.querySelector(".input-task");
const listaCompleta = document.querySelector(".list-task");
const STORAGE_KEY = "lista"; // Mantém compatibilidade com as tarefas já salvas.
let minhaListaDeItens = [];

function salvarTarefas() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(minhaListaDeItens));
  } catch (error) {
    console.warn("Não foi possível salvar as tarefas localmente.", error);
  }
}

function mostrarTarefas() {
  listaCompleta.replaceChildren();
  minhaListaDeItens.forEach((item, index) => {
    const linha = document.createElement("li");
    linha.className = item.concluida ? "task done" : "task";

    const concluir = document.createElement("button");
    concluir.type = "button";
    concluir.setAttribute("aria-label", item.concluida ? "Marcar tarefa como pendente" : "Concluir tarefa");
    concluir.dataset.action = "toggle";
    concluir.dataset.index = String(index);
    const check = document.createElement("img");
    check.src = "src/img/checked.png";
    check.alt = "";
    concluir.append(check);

    const texto = document.createElement("p");
    texto.textContent = item.tarefa; // Texto do usuário nunca é interpretado como HTML.

    const excluir = document.createElement("button");
    excluir.type = "button";
    excluir.setAttribute("aria-label", "Excluir tarefa");
    excluir.dataset.action = "delete";
    excluir.dataset.index = String(index);
    const lixeira = document.createElement("img");
    lixeira.src = "src/img/trash.png";
    lixeira.alt = "";
    excluir.append(lixeira);

    linha.append(concluir, texto, excluir);
    listaCompleta.append(linha);
  });
  salvarTarefas();
}

function adicionarNovaTarefa() {
  const tarefa = input.value.trim();
  if (!tarefa) return;
  minhaListaDeItens.push({ tarefa, concluida: false });
  input.value = "";
  mostrarTarefas();
  input.focus();
}

function recarregarTarefas() {
  try {
    const salvo = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (Array.isArray(salvo)) {
      minhaListaDeItens = salvo.filter((item) =>
        item && typeof item.tarefa === "string" && typeof item.concluida === "boolean"
      );
    }
  } catch (error) {
    console.warn("Histórico local de tarefas inválido; iniciando lista vazia.", error);
  }
  mostrarTarefas();
}

button.addEventListener("click", adicionarNovaTarefa);
input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") adicionarNovaTarefa();
});
listaCompleta.addEventListener("click", (event) => {
  const control = event.target.closest("button[data-action]");
  if (!control || !listaCompleta.contains(control)) return;
  const index = Number(control.dataset.index);
  if (!Number.isInteger(index) || index < 0 || index >= minhaListaDeItens.length) return;
  if (control.dataset.action === "delete") {
    minhaListaDeItens.splice(index, 1);
  } else if (control.dataset.action === "toggle") {
    minhaListaDeItens[index].concluida = !minhaListaDeItens[index].concluida;
  }
  mostrarTarefas();
});
recarregarTarefas();
