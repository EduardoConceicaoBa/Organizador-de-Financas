# 💸 Organizador de Finanças Pessoal (Versão Web)

## Visão Geral do Projeto

Este é um projeto web interativo desenvolvido para o controle simplificado de finanças pessoais. Baseado em um script de console originalmente criado em Python, este aplicativo foi totalmente reescrito em JavaScript, HTML e CSS para oferecer uma interface de usuário visual e dinâmica.

O objetivo principal é fornecer uma ferramenta clara para rastrear a renda, registrar despesas e visualizar o saldo financeiro de forma imediata.

## 🌉 A Transição do Python para Web

O projeto nasceu de um script simples em Python para o console. Para transformá-lo em uma aplicação mais acessível e visual, ele foi transcrito para o ecossistema web:

* **HTML (index.html):** Define a estrutura semântica dos cards (Renda, Despesas, Resultados, Cofrinho e Análise).
* **CSS (style.css):** Responsável pelo layout moderno e responsivo, incluindo as barras de progresso dinâmicas e os alertas visuais (ex: cores de alerta para saldo negativo).
* **JavaScript (script.js):** Contém toda a lógica de cálculo, gerenciamento de estado (renda, despesas, cofrinho) e a manipulação do DOM para atualizar a interface em tempo real.

## ✨ Funcionalidades Dinâmicas

A versão web inclui funcionalidades avançadas de visualização e rastreamento de metas:

### 1. Resumo Financeiro e Alertas Visuais
* **Barra de Progresso de Gastos:** Exibe visualmente o percentual da renda que já foi consumido por despesas. Muda de cor para alertar sobre gastos excessivos.
* **Alerta de Saldo:** Notificação instantânea com destaque vermelho (`VOCÊ ESTÁ NO VERMELHO!`) se as despesas excederem a renda.
* **Tabela Dinâmica de Categorias:** Agrupa e lista automaticamente o total gasto em cada categoria (Alimentação, Transporte, etc.), permitindo uma rápida análise de onde o dinheiro está sendo gasto.

### 2. 🐷 Cofrinho de Poupança Independente
O Cofrinho foi implementado como um rastreador de metas isolado, conforme sua necessidade:
* **Definição de Meta:** Permite ao usuário estabelecer um valor alvo de poupança.
* **Depósito Manual:** O usuário pode inserir qualquer valor para ser adicionado ao cofrinho (operação de entrada de dados), e esse valor **não afeta** o cálculo do `SALDO FINAL` mensal.
* **Progresso Visual:** Uma barra de progresso específica mostra o percentual de conclusão da meta de poupança.

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Função no Projeto |
| :--- | :--- |
| **HTML5** | Estrutura de todos os cartões e campos de entrada. |
| **CSS3** | Estilização moderna, uso de Flexbox/Grid para layout e animações de progresso e alerta. |
| **JavaScript** | Núcleo de lógica (cálculos, manipulação de estado, interações do Cofrinho, atualização do DOM). |

## 🚀 Como Executar o Projeto

Este projeto é totalmente *frontend* e não requer servidor backend.

1.  **Baixe os Arquivos:** Certifique-se de ter os três arquivos (`index.html`, `style.css`, `script.js`) na mesma pasta.
2.  **Abra o HTML:** Simplesmente abra o arquivo `index.html` em qualquer navegador moderno (Chrome, Firefox, Edge, etc.).
3.  **Interaja:** O sistema será inicializado, pronto para o cadastro da renda, despesas e gerenciamento do cofrinho.

---
Criado por [EduardoConceicaoBa]
