from collections import defaultdict

# --- VARIÁVEIS GLOBAIS ---
renda_mensal = 0.0
despesas = [] # Lista de dicionários: [{'valor': 50.0, 'categoria': 'Alimentação'}, ...]
meta_total_cofrinho = 0.0
valor_atual_cofrinho = 0.0

# --- FUNÇÕES DE CÁLCULO ---

def calcular_total_gasto():
    """Soma o valor de todas as despesas."""
    return sum(despesa['valor'] for despesa in despesas)

def agrupar_por_categoria():
    """Agrupa e soma os gastos por categoria."""
    gastos_por_categoria = defaultdict(float)
    for despesa in despesas:
        # Garante que a categoria seja formatada (Capitalizada)
        categoria_formatada = despesa['categoria'].strip().capitalize()
        gastos_por_categoria[categoria_formatada] += despesa['valor']
    return dict(gastos_por_categoria)

# --- FUNÇÕES DE COFRINHO ---

def definir_meta_cofrinho():
    """Permite ao usuário definir a meta de poupança."""
    global meta_total_cofrinho, valor_atual_cofrinho
    
    while True:
        try:
            nova_meta = float(input("\n[COFRINHO] Informe sua Meta de Poupança (R$): "))
            if nova_meta <= 0:
                print("Valor inválido! Informe um valor maior que zero.")
                continue
            break
        except ValueError:
            print("Entrada inválida. Digite um número.")

    meta_total_cofrinho = nova_meta
    
    # Se a nova meta for menor que o valor guardado, ajusta o valor guardado
    if meta_total_cofrinho < valor_atual_cofrinho:
        valor_atual_cofrinho = meta_total_cofrinho
        
    print(f"Meta de R${meta_total_cofrinho:.2f} definida com sucesso!")


def depositar_manual_cofrinho():
    """Permite ao usuário adicionar um valor ao cofrinho (independente do saldo)."""
    global valor_atual_cofrinho
    
    if meta_total_cofrinho <= 0:
        print("\n[COFRINHO] Por favor, defina uma meta de poupança primeiro!")
        return
        
    restante_para_meta = meta_total_cofrinho - valor_atual_cofrinho
    
    if restante_para_meta <= 0:
        print("\n[COFRINHO] Parabéns! Sua meta já foi atingida.")
        return
        
    while True:
        try:
            valor_deposito = float(input(f"[COFRINHO] Valor a guardar (Máx: R${restante_para_meta:.2f}): "))
            if valor_deposito <= 0:
                print("Valor inválido! Informe um valor maior que zero.")
                continue
            break
        except ValueError:
            print("Entrada inválida. Digite um número.")
            
    # Limita o depósito ao que falta para a meta
    valor_a_depositar = min(valor_deposito, restante_para_meta)
    
    valor_atual_cofrinho += valor_a_depositar
    
    print(f"R${valor_a_depositar:.2f} adicionados ao cofrinho.")


def exibir_cofrinho():
    """Exibe o status atual do cofrinho."""
    if meta_total_cofrinho <= 0:
        print("\n[COFRINHO] Nenhuma meta de poupança definida.")
        return

    print("\n--- 🐷 Status do Meu Cofrinho 🐷 ---")
    print(f"Meta Total:      R${meta_total_cofrinho:.2f}")
    print(f"Valor Guardado:  R${valor_atual_cofrinho:.2f}")
    
    percentual = (valor_atual_cofrinho / meta_total_cofrinho) * 100
    
    if valor_atual_cofrinho >= meta_total_cofrinho:
        print("Status:          META ATINGIDA! 🏆")
    else:
        faltando = meta_total_cofrinho - valor_atual_cofrinho
        print(f"Status:          Faltam R${faltando:.2f} para a meta.")

    print(f"Progresso:       {percentual:.1f}%")
    print("----------------------------------")

# --- FUNÇÃO PRINCIPAL DE REGISTRO E ANÁLISE ---

def registrar_despesas():
    """Loop para registrar despesas."""
    print("--- Registro de Despesas ---")
    
    while True:
        try:
            valor = float(input("Informe o valor da despesa: R$"))
            if valor <= 0:
                print("Valor inválido! Informe um valor maior que zero.\n")
                continue
        except ValueError:
            print("Entrada inválida. Digite um número para o valor.")
            continue

        categoria = input("Informe a categoria/motivo da despesa: ").strip()
        if not categoria:
            print("A categoria não pode ser vazia.")
            continue

        despesas.append({'valor': valor, 'categoria': categoria})
        print("Despesa registrada!\n")

        continuar = input("Deseja registrar outra despesa? (s/n): ").lower()
        if continuar == "n":
            break

def exibir_resultados(nome, saldo, total_gasto):
    """Exibe o resumo financeiro, detalhe de gastos e análise de categorias."""
    
    print("\n" + "="*40)
    print("         📋 RESUMO FINANCEIRO 📋")
    print("="*40)
    print(f"RENDA MENSAL:    R${renda_mensal:.2f}")
    print(f"TOTAL GASTO:     R${total_gasto:.2f}")
    print(f"SALDO FINAL:     R${saldo:.2f}")
    print("="*40)

    # 1. Alerta de Saldo
    if saldo < 0:
        print("\n!!! VOCÊ ESTÁ NO VERMELHO !!!")
        print(f"Você ultrapassou sua renda em R${abs(saldo):.2f}.")

        # 2. Análise de Categoria - PRINCIPAIS MOTIVOS
        print("\n>> Principais Categorias de Gasto:")
        gastos_agrupados = agrupar_por_categoria()
        
        # Ordena os grupos por valor, do maior para o menor
        gastos_ordenados = sorted(gastos_agrupados.items(), key=lambda item: item[1], reverse=True)
        
        for categoria, valor in gastos_ordenados:
            # Exibe apenas os top gastos
            if valor > 0.01:
                 print(f" - {categoria}: R${valor:.2f}")
    else:
        print(f"\nParabéns {nome}! Você está com saldo positivo.")
        
    # 3. Lista Detalhada de Gastos
    if despesas:
        print("\n>> Detalhe de Todas as Despesas:")
        # Ordena a lista de despesas por valor, do maior para o menor
        despesas_ordenadas = sorted(despesas, key=lambda x: x['valor'], reverse=True)
        
        for despesa in despesas_ordenadas:
            print(f" - R${despesa['valor']:.2f} | Categoria: {despesa['categoria']}")


def menu_principal():
    """Exibe o menu de ações após o cadastro inicial."""
    while True:
        print("\n" + "="*40)
        print(f"Olá {nome}! O que você deseja fazer?")
        print("="*40)
        print("1. Registrar Novas Despesas")
        print("2. Ver Resumo Financeiro Completo")
        print("3. Definir Meta do Cofrinho")
        print("4. Depositar no Cofrinho")
        print("5. Ver Status do Cofrinho")
        print("6. Sair do Programa")
        print("="*40)
        
        escolha = input("Digite o número da opção desejada: ")
        
        if escolha == '1':
            registrar_despesas()
        elif escolha == '2':
            total_gasto = calcular_total_gasto()
            saldo = renda_mensal - total_gasto
            exibir_resultados(nome, saldo, total_gasto)
        elif escolha == '3':
            definir_meta_cofrinho()
        elif escolha == '4':
            depositar_manual_cofrinho()
        elif escolha == '5':
            exibir_cofrinho()
        elif escolha == '6':
            print("\nObrigado por usar o Organizador de Finanças! Até a próxima.")
            break
        else:
            print("Opção inválida. Tente novamente.")


# --- INÍCIO DO PROGRAMA ---

# Cadastro de usuário
nome = input("Digite seu nome: ").strip()
try:
    idade = int(input("Digite sua idade: "))
except ValueError:
    print("Idade inválida! Encerrando o programa.")
    exit()

if idade < 18:
    print("Infelizmente não posso continuar com seu cadastro (Idade menor que 18).")
    exit()
else:
    print("Idade validada, prosseguindo com o cadastro")

# Registro de renda
while True:
    try:
        renda_input = float(input("Informe sua renda mensal: R$"))
        if renda_input <= 0:
            print("Renda inválida! Informe um valor maior que zero.")
            continue
        renda_mensal = renda_input
        print(f"Renda de R${renda_mensal:.2f} cadastrada!\n")
        break
    except ValueError:
        print("Entrada inválida. Digite um número para a renda.")

# Inicia o menu de ações
menu_principal()