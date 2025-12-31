// VARIÁVEIS GLOBAIS
let rendaMensal = 0;
const despesas = [];
let nomeUsuario = "";
let idadeUsuario = 0;

// VARIÁVEIS PARA O COFRINHO
let metaTotalCofrinho = 0;
let valorAtualCofrinho = 0; // Valor acumulado

// Seleção de Elementos DOM
const inputNome = document.getElementById('input-nome');
const inputIdade = document.getElementById('input-idade');
const inputRenda = document.getElementById('input-renda');
const btnSalvarRenda = document.getElementById('btn-salvar-renda');
const rendaStatusEl = document.getElementById('renda-status');
const registroDespesasCard = document.getElementById('registro-despesas');

const inputValor = document.getElementById('input-valor');
const inputCategoria = document.getElementById('input-categoria');
const btnAdicionarDespesa = document.getElementById('btn-adicionar-despesa');
const listaCategoriasDatalist = document.getElementById('lista-categorias'); 

const totalDespesasEl = document.getElementById('total-despesas');
const saldoFinalEl = document.getElementById('saldo-final');
const resultadosCard = document.getElementById('resultados');
const statusAlertaEl = document.getElementById('status-alerta');
const despesasListEl = document.getElementById('despesas-list');

// Elementos do Cofrinho
const inputMetaValor = document.getElementById('input-meta-valor');
const btnDefinirMeta = document.getElementById('btn-definir-meta');
const inputDepositoValor = document.getElementById('input-deposito-valor'); // NOVO INPUT DE VALOR
const btnDepositarManual = document.getElementById('btn-depositar-manual'); // NOVO BOTÃO DE DEPÓSITO
const metaValorTotalEl = document.getElementById('meta-valor-total');
const cofrinhoValorGuardadoEl = document.getElementById('cofrinho-valor-guardado');
const barraCofrinhoPreenchimentoEl = document.getElementById('barra-cofrinho-preenchimento');
const cofrinhoPercentualEl = document.getElementById('cofrinho-percentual');
const cofrinhoStatusAlertaEl = document.getElementById('cofrinho-status-alerta');
const cofrinhoMetaCard = document.getElementById('cofrinho-meta');

// Outros elementos
const barraProgressoEl = document.querySelector('.barra-progresso');
const barraPreenchimentoEl = document.getElementById('barra-progresso-preenchimento');
const progressoPercentualEl = document.getElementById('progresso-percentual');
const tabelaCategoriasBody = document.querySelector('#tabela-categorias tbody');


// FUNÇÕES DE CÁLCULO
function calcularTotal() {
    return despesas.reduce((acc, despesa) => acc + despesa.valor, 0);
}

function agruparPorCategoria() {
    const agrupado = {};
    despesas.forEach(despesa => {
        const cat = despesa.categoria.toLowerCase();
        agrupado[cat] = (agrupado[cat] || 0) + despesa.valor;
    });
    return agrupado;
}


/**
 * @function atualizarCofrinhoUI
 * Atualiza o display da meta de poupança (independente do saldo).
 */
function atualizarCofrinhoUI() {
    // 1. Lógica de Meta Não Definida
    if (metaTotalCofrinho <= 0) {
        metaValorTotalEl.textContent = "R$ 0.00";
        cofrinhoValorGuardadoEl.textContent = "R$ 0.00";
        cofrinhoStatusAlertaEl.textContent = "Defina uma meta para o seu cofrinho!";
        barraCofrinhoPreenchimentoEl.style.width = '0%';
        cofrinhoPercentualEl.textContent = '0%';
        cofrinhoMetaCard.classList.remove('cofrinho-completo');
        btnDepositarManual.setAttribute('disabled', 'true');
        return;
    }

    // 2. Lógica de Meta Definida
    btnDepositarManual.removeAttribute('disabled');
    
    metaValorTotalEl.textContent = `R$ ${metaTotalCofrinho.toFixed(2)}`;
    cofrinhoValorGuardadoEl.textContent = `R$ ${valorAtualCofrinho.toFixed(2)}`;
    
    let percentual = (valorAtualCofrinho / metaTotalCofrinho) * 100;
    percentual = Math.min(percentual, 100); 

    barraCofrinhoPreenchimentoEl.style.width = `${percentual}%`;
    cofrinhoPercentualEl.textContent = `${percentual.toFixed(1)}%`;
    cofrinhoMetaCard.classList.remove('cofrinho-completo');
    cofrinhoValorGuardadoEl.classList.remove('status-negative', 'status-positive');

    // 3. Lógica de Status
    if (valorAtualCofrinho >= metaTotalCofrinho) {
        cofrinhoStatusAlertaEl.innerHTML = `<span class="status-positive">META ATINGIDA!</span> Parabéns!`;
        cofrinhoMetaCard.classList.add('cofrinho-completo');
        cofrinhoValorGuardadoEl.classList.add('status-positive');
        btnDepositarManual.setAttribute('disabled', 'true'); // Desabilita o depósito se atingiu
    } else {
        const restanteParaMeta = metaTotalCofrinho - valorAtualCofrinho;
        cofrinhoStatusAlertaEl.textContent = `Faltam R$ ${restanteParaMeta.toFixed(2)} para sua meta.`;
        if (valorAtualCofrinho > 0) {
             cofrinhoValorGuardadoEl.classList.add('status-positive');
        }
    }
}


/**
 * @function atualizarBarraProgresso
 */
function atualizarBarraProgresso(totalGasto) {
    if (rendaMensal <= 0) {
        barraPreenchimentoEl.style.width = '0%';
        progressoPercentualEl.textContent = '0%';
        barraProgressoEl.classList.remove('barra-alerta', 'barra-perigo');
        return;
    }

    const percentual = (totalGasto / rendaMensal) * 100;
    const progresso = Math.min(percentual, 100); 

    barraPreenchimentoEl.style.width = `${progresso}%`;
    progressoPercentualEl.textContent = `${percentual.toFixed(1)}%`;
    
    barraProgressoEl.classList.remove('barra-alerta', 'barra-perigo');
    if (percentual > 100) {
        barraProgressoEl.classList.add('barra-perigo');
    } else if (percentual > 75) {
        barraProgressoEl.classList.add('barra-alerta');
    }
}


/**
 * @function atualizarTabelaCategorias
 */
function atualizarTabelaCategorias(gastosPorCategoria) {
    tabelaCategoriasBody.innerHTML = '';
    listaCategoriasDatalist.innerHTML = '';

    const categorias = Object.entries(gastosPorCategoria).sort(([, a], [, b]) => b - a); 

    if (categorias.length === 0) {
        tabelaCategoriasBody.innerHTML = '<tr><td colspan="2" style="text-align: center; color: #999;">Sem dados de categoria.</td></tr>';
        return;
    }

    categorias.forEach(([categoria, total]) => {
        const categoriaFormatada = categoria.charAt(0).toUpperCase() + categoria.slice(1);
        
        const row = tabelaCategoriasBody.insertRow();
        row.innerHTML = `
            <td>${categoriaFormatada}</td>
            <td class="despesa-valor">R$ ${total.toFixed(2)}</td>
        `;
        
        const option = document.createElement('option');
        option.value = categoriaFormatada;
        listaCategoriasDatalist.appendChild(option);
    });
}


/**
 * @function atualizarUI (Função Principal)
 */
function atualizarUI() {
    const totalGasto = calcularTotal();
    const saldo = rendaMensal - totalGasto;

    // 1. Atualiza Saldo e Alerta
    totalDespesasEl.textContent = `R$ ${totalGasto.toFixed(2)}`;
    saldoFinalEl.textContent = `R$ ${saldo.toFixed(2)}`;

    resultadosCard.classList.remove('alerta-vermelho');
    resultadosCard.querySelector('.saldo-display.principal').classList.remove('status-negative', 'status-positive');
    statusAlertaEl.textContent = "";

    if (saldo < 0) {
        resultadosCard.classList.add('alerta-vermelho');
        resultadosCard.querySelector('.saldo-display.principal').classList.add('status-negative');
        statusAlertaEl.innerHTML = `<span class="status-negative">VOCÊ ESTÁ NO VERMELHO!</span><br>Você ultrapassou o orçamento em R$ ${Math.abs(saldo).toFixed(2)}.`;
    } else if (rendaMensal > 0) {
        resultadosCard.querySelector('.saldo-display.principal').classList.add('status-positive');
        statusAlertaEl.innerHTML = `<span class="status-positive">Parabéns ${nomeUsuario}!</span> Você está com saldo positivo.`;
    } else {
        statusAlertaEl.textContent = "Informe sua Renda Mensal para começar.";
    }

    // 2. Atualizar Barra de Progresso de Gastos
    atualizarBarraProgresso(totalGasto);

    // 3. Atualizar Cofrinho
    atualizarCofrinhoUI();

    // 4. Atualizar Tabela de Categorias e Datalist
    atualizarTabelaCategorias(agruparPorCategoria());
    
    // 5. Atualizar Lista Detalhada
    despesasListEl.innerHTML = ''; 
    if (despesas.length === 0) {
        despesasListEl.innerHTML = '<li class="empty-state despesa-item">Nenhuma despesa registrada ainda.</li>';
        return;
    }

    const despesasOrdenadas = [...despesas].sort((a, b) => b.valor - a.valor);
    despesasOrdenadas.forEach((despesa) => {
        const li = document.createElement('li');
        li.className = 'despesa-item despesa-fade-in';
        li.innerHTML = `<span>${despesa.categoria}</span><span class="despesa-valor">R$ ${despesa.valor.toFixed(2)}</span>`;
        despesasListEl.appendChild(li);
        setTimeout(() => { li.classList.add('loaded'); }, 10);
    });
}


// FUNÇÕES DE EVENTOS
function handleSalvarRenda() {
    nomeUsuario = inputNome.value.trim();
    idadeUsuario = parseInt(inputIdade.value); 
    const novaRenda = parseFloat(inputRenda.value);

    // Validações
    if (!nomeUsuario || isNaN(idadeUsuario) || idadeUsuario < 1) {
        rendaStatusEl.textContent = "Erro: Nome e Idade devem ser válidos.";
        return;
    }
    if (idadeUsuario < 18) {
        rendaStatusEl.textContent = "Infelizmente não podemos continuar com o cadastro.";
        registroDespesasCard.setAttribute('disabled', '');
        return;
    }
    if (isNaN(novaRenda) || novaRenda <= 0) {
        rendaStatusEl.textContent = "Erro: Renda inválida! Informe um valor maior que zero.";
        registroDespesasCard.setAttribute('disabled', '');
        return;
    }
    
    rendaMensal = novaRenda;
    
    rendaStatusEl.innerHTML = `<span class="status-positive">Sucesso!</span> Olá ${nomeUsuario}, sua renda de R$ ${rendaMensal.toFixed(2)} foi cadastrada.`;
    registroDespesasCard.removeAttribute('disabled');

    atualizarUI(); 
}

function handleAdicionarDespesa() {
    const valor = parseFloat(inputValor.value);
    const categoria = inputCategoria.value.trim();

    if (isNaN(valor) || valor <= 0) {
        alert("Valor inválido! Informe um valor maior que zero.");
        return;
    }
    if (!categoria) {
        alert("Informe a categoria da despesa.");
        return;
    }

    const categoriaFormatada = categoria.charAt(0).toUpperCase() + categoria.slice(1).toLowerCase();
    
    despesas.push({ valor: valor, categoria: categoriaFormatada });

    inputValor.value = '';
    inputCategoria.value = '';

    atualizarUI(); 
}

function handleDefinirMeta() {
    const novaMeta = parseFloat(inputMetaValor.value);

    if (isNaN(novaMeta) || novaMeta <= 0) {
        alert("Por favor, defina uma meta de poupança válida (maior que zero).");
        return;
    }
    
    if (novaMeta < valorAtualCofrinho) {
        valorAtualCofrinho = novaMeta;
    }

    metaTotalCofrinho = novaMeta;
    inputMetaValor.value = '';

    atualizarUI();
}

/**
 * @function handleDepositarValorManual
 * Adiciona um valor inserido pelo usuário ao cofrinho, sem afetar o saldo/renda.
 */
function handleDepositarValorManual() {
    const valorDeposito = parseFloat(inputDepositoValor.value);

    if (metaTotalCofrinho <= 0) {
        alert("Defina uma meta de poupança primeiro!");
        return;
    }
    
    if (isNaN(valorDeposito) || valorDeposito <= 0) {
        alert("Insira um valor de depósito válido (maior que zero).");
        return;
    }

    const restanteParaMeta = metaTotalCofrinho - valorAtualCofrinho;
    
    if (restanteParaMeta <= 0) {
        alert("Sua meta já foi atingida!");
        return;
    }

    // Deposita o menor valor entre o que o usuário quer depositar e o que falta para a meta
    let valorADepositar = Math.min(valorDeposito, restanteParaMeta);
    
    valorAtualCofrinho += valorADepositar;
    
    // Limpa o campo de depósito
    inputDepositoValor.value = '';

    alert(`R$ ${valorADepositar.toFixed(2)} adicionados ao cofrinho!`);

    atualizarUI();
}


// INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', () => {
    atualizarUI();
    btnSalvarRenda.addEventListener('click', handleSalvarRenda);
    btnAdicionarDespesa.addEventListener('click', handleAdicionarDespesa);
    btnDefinirMeta.addEventListener('click', handleDefinirMeta);
    btnDepositarManual.addEventListener('click', handleDepositarValorManual);
});