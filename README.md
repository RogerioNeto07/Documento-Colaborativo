# Como Executar a Aplicação de Colaboração em Tempo Real

Este guia ajuda a configurar e executar tanto o servidor quanto o cliente da aplicação de colaboração em tempo real.

## Estrutura do Projeto

A estrutura do seu repositório deve ser a seguinte:

```
.
├── client/
|   ├── src/
│   |   ├── main.js
│   |   ├── style.css
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── .gitignore
└── server/
    ├── app.py
    └── requirements.txt
```

## 1\. Configurando e Executando o Servidor

O servidor é construído com Flask e Flask-SocketIO para lidar com a comunicação WebSocket.

### Pré-requisitos do Servidor

Certifique-se de ter o **Python 3** instalado na máquina.

### Passos para Execução do Servidor

1.  **Navegue até o diretório do servidor**:
    Abra o terminal e mude para o diretório `server`:

    ```bash
    cd server
    ```

2.  **Instale as dependências**:
    O arquivo `requirements.txt` lista todas as bibliotecas Python necessárias. Instale-as usando `pip`:

    ```bash
    pip install -r requirements.txt
    ```

3.  **Execute o servidor**:
    Com as dependências instaladas, você pode iniciar o servidor:

    ```bash
    python app.py
    ```

    Você deverá ver uma saída no terminal indicando que o servidor está rodando, provavelmente em `http://0.0.0.0:3000`.

## 2\. Configurando e Executando o Cliente

O cliente é um projeto Vite com Vanilla JavaScript e HTML, que se conectará ao servidor WebSocket.

### Pré-requisitos do Cliente

Certifique-se de ter o **Node.js** e o **npm** instalados em sua máquina.

### Passos para Execução do Cliente

1.  **Navegue até o diretório do cliente**:
    Em um **novo terminal** (mantenha o terminal do servidor aberto), mude para o diretório `client`:

    ```bash
    cd client
    ```

2.  **Instale as dependências do cliente**:
    Instale as dependências do projeto Vite:

    ```bash
    npm install
    ```

3.  **Execute o cliente**:
    Inicie o servidor de desenvolvimento do Vite:

    ```bash
    npm run dev
    ```

    O Vite irá compilar o projeto e fornecer um URL, geralmente `http://localhost:5173` (ou uma porta similar). Abra seu navegador e acesse este URL.
