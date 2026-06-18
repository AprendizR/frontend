# 🚚 Transportadora — Sistema de Gestão de Transporte (Front-end)

Interface web para gerenciamento das operações de uma transportadora, consumindo a API REST do [TransportadoraBackEnd](https://github.com/AprendizR/TransporadoraBackEnd). Permite controlar clientes, motoristas, veículos, cargas e notas fiscais, além de acompanhar faturamento e estatísticas em um dashboard.

🌐 Demo: [aprendizr.github.io/TransportadoraFrontEnd](https://aprendizr.github.io/TransportadoraFrontEnd/)
🔗 Back-end deste projeto: [TransportadoraBackEnd](https://github.com/AprendizR/TransporadoraBackEnd)

## 🛠 Tecnologias

- **React 19** + **TypeScript**
- **Vite** — build e dev server
- **Tailwind CSS** — estilização
- **React Router** — navegação entre páginas
- **Axios** — comunicação com a API
- **react-hot-toast** + **SweetAlert2** — feedback visual ao usuário

## ⚙️ Funcionalidades

- **Login** com autenticação JWT, integrado ao back-end
- **Dashboard** com estatísticas gerais do sistema
- **Clientes**: cadastro, listagem, autocomplete e vínculo de fretes
- **Motoristas** e **Veículos**: cadastro, listagem, busca e autocomplete
- **Notas Fiscais**: cadastro, upload de foto comprobatória, listagem com filtros
- **Cargas**: criação vinculando motorista, veículo e notas fiscais; adição de notas a uma carga existente; registro de ocorrências
- **Faturamento**: visualização em tabela dos dados consolidados vindos do back-end
- **Portal do Cliente**: login e área separada para o cliente consultar suas próprias notas fiscais
- Busca automática de endereço por **CEP** e validação de **CNPJ** via hooks customizados (`useCep`, `useCnpj`)

## ▶️ Como executar

```bash
git clone https://github.com/AprendizR/TransportadoraFrontEnd.git
cd TransportadoraFrontEnd
npm install
npm run dev
```

A aplicação ficará disponível em `http://localhost:5173`.

> Por padrão, a aplicação espera o back-end rodando em `http://localhost:8080`. Veja as instruções de execução no [repositório do back-end](https://github.com/AprendizR/TransporadoraBackEnd).

## 🎯 Objetivo

Projeto desenvolvido para praticar front-end moderno com React e TypeScript, consumindo uma API REST real e simulando o fluxo completo de um sistema de gestão logística — do cadastro inicial até a entrega da carga.
