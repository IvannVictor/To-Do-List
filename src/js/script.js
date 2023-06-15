const button = document.querySelector('.button-add-task')  // Pegando o botao no documento;
const input = document.querySelector('.input-task')  // Pegando o input no documeto;
const listaCompleta = document.querySelector('.list-task')  // Pegando a lista para inserir as tasks;

let minhaListaDeItens = []  // Array onde sera armazendo os inputs;

// Funcao para pegar o valor do input;
function adicionarNovaTarefa(){
    minhaListaDeItens.push({tarefa: input.value, concluida: false})  // Adiconando dois parametros, o valor da task e se ela foi concluida ou nao;

    input.value = ''  // Fazendo o input ficar vazio;

    mostraTarefa()
}

function mostraTarefa(){
    let novaLI = ''

    // forEach passa por cada item da lista;
    minhaListaDeItens.forEach((item, index) => {  // index e a posicao do intem;
        // Caso concluida seja verdadeira ele ira adicionar uma nova classe e mudar a cor;
        novaLI = novaLI + `
        <li class="task ${item.concluida && 'done'}">
            <img src="src/img/checked.png" alt="check-na-tarefa" onclick="concluirTarefa(${index})">
            <p>${item.tarefa}</p>
            <img src="src/img/trash.png" alt="tarefa-para-o-lixo" onclick="deletarItem(${index})">
        </li>
        `
    })

    // Vai pegar os valores que estao no novaLI e inserir no HTML;
    listaCompleta.innerHTML = novaLI

    // Vamos estar armazendo os itens no localstorage, usando JSOn.stringify para converter os objetos da lista em string;
    localStorage.setItem('lista', JSON.stringify(minhaListaDeItens))
}

// Funcao para apagar os itens;
function deletarItem(index){
    minhaListaDeItens.splice(index, 1)  // Permite deletar as coisas dentro do array;

    mostraTarefa()  // Apos remover chamar a funcao para atualizar as tasks;
}

function concluirTarefa(index){
    minhaListaDeItens[index].concluida = !minhaListaDeItens[index].concluida  // Vamos estar invertendo os valores;

    mostraTarefa()  // Atualizando os valores;
}

// Pegando os valores salvos no localstorage e mostrando na tela
function recarregarTarefa(){
    const tarefasDoLocalStorage = localStorage.getItem('lista')

    // So vai fazer isso se tiver algum item no local;
    if (tarefasDoLocalStorage) {
        minhaListaDeItens = JSON.parse(tarefasDoLocalStorage)
        // Transformando novamente em objetos;
    }

    mostraTarefa()  // Mostrando as tarefas;
}

// Verificando os eventos de click do botao referente ao valor do input;
button.addEventListener('click', adicionarNovaTarefa)

recarregarTarefa()  // Chamando a funcao parar recarregar as tarefas;