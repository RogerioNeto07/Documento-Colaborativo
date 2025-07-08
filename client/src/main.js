import { io } from 'socket.io-client';

const docIdInput = document.getElementById('docId');
const connectBtn = document.getElementById('connectBtn');
const disconnectBtn = document.getElementById('disconnectBtn');
const statusEl = document.getElementById('status');
const editor = document.getElementById('editor');

const socket = io('http://localhost:3000', {
    autoConnect: false
});

let currentDocumentId = null;
let isUpdatingEditor = false;

function updateUI(isConnected, message = '') {
    docIdInput.disabled = isConnected;
    connectBtn.disabled = isConnected;
    disconnectBtn.disabled = !isConnected;
    editor.disabled = !isConnected;

    if (isConnected) {
        statusEl.textContent = `Conectado ao documento: ${currentDocumentId}`;
        statusEl.className = 'connected';
        editor.placeholder = "Comece a digitar aqui...";
    } else {
        statusEl.textContent = message || 'Desconectado';
        statusEl.className = 'disconnected';
        editor.value = '';
        editor.placeholder = "Conecte-se a um documento para começar a editar...";
    }
}

function connectToDocument() {
    const docId = docIdInput.value.trim();
    if (!docId) {
        alert("Por favor, insira um ID de documento.");
        return;
    }

    if (socket.connected && currentDocumentId === docId) {
        console.log(`Já conectado e na sala do documento ${docId}.`);
        return;
    }

    if (socket.connected && currentDocumentId !== docId) {
        socket.emit('leaveDocument', currentDocumentId);
        currentDocumentId = null;
    }

    currentDocumentId = docId;
    socket.connect();
    updateUI(false, 'Tentando conectar...');
}

function disconnectFromDocument() {
    if (socket.connected) {
        if (currentDocumentId) {
            socket.emit('leaveDocument', currentDocumentId);
            console.log(`Deixando o documento: ${currentDocumentId}`);
        }
        socket.disconnect();
        currentDocumentId = null;
        updateUI(false, 'Desconectado.');
    } else {
        console.log('Já está desconectado.');
        updateUI(false, 'Já desconectado.');
    }
}

function debounce(func, delay) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
}

const sendDocumentUpdate = debounce(() => {
    if (socket.connected && currentDocumentId && !isUpdatingEditor) {
        socket.emit('documentUpdate', {
            documentId: currentDocumentId,
            content: editor.value
        });
        console.log('Enviando atualização...');
    }
}, 300);

socket.on('connect', () => {
    console.log('Conectado ao servidor Socket.IO!', socket.id);
    if (currentDocumentId) {
        socket.emit('joinDocument', currentDocumentId);
        updateUI(true);
    }
});

socket.on('disconnect', (reason) => {
    console.log('Desconectado do servidor Socket.IO. Razão:', reason);
    updateUI(false, `Desconectado (${reason}).`);
    currentDocumentId = null;
});

socket.on('connect_error', (err) => {
    console.error('Erro de conexão do Socket.IO:', err.message);
    updateUI(false, `Erro de conexão: ${err.message}`);
});

socket.on('documentChanged', (data) => {
    if (data.documentId === currentDocumentId) {
        console.log('Recebida atualização do documento:', data.documentId);
        isUpdatingEditor = true;
        editor.value = data.content;
        editor.selectionStart = editor.selectionEnd = editor.value.length;
        isUpdatingEditor = false;
    }
});

connectBtn.addEventListener('click', connectToDocument);
disconnectBtn.addEventListener('click', disconnectFromDocument);

editor.addEventListener('input', sendDocumentUpdate);

updateUI(false);