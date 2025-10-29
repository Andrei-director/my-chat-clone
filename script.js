const chatBox = document.getElementById("chat-box");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");

// Глобальный массив для хранения всей истории разговора
const conversationHistory = [
    // Начальное сообщение бота, чтобы задать контекст (опционально)
    { role: "model", text: "Hello! I'm your AI assistant. I can remember our conversation." }
]; 

const CHAT_ENDPOINT = "/api/chat"; 

// Функция добавления сообщения в окно И в историю
// Добавлен аргумент 'addToHistory'
function addMessage(text, sender, addToHistory = true) {
    const msg = document.createElement("div");
    msg.classList.add("message", sender);
    msg.textContent = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;

    // ДОБАВЛЯЕМ сообщение в историю, только если явно не запрещено
    if (addToHistory) {
        // Роль 'model' используется для Gemini API, роль 'bot' для CSS
        const role = sender === 'user' ? 'user' : 'model'; 
        conversationHistory.push({ 
            role: role, 
            text: text 
        });
    }
}

// Перерисовка начального сообщения
if (conversationHistory.length > 0) {
    // Выводим, но не добавляем снова в историю (addToHistory = false)
    addMessage(conversationHistory[0].text, 'bot', false); 
}


// Отправка запроса к Vercel Proxy, включая ВСЮ историю
async function sendToGemini(userText) {
    // 1. Временно добавляем сообщение о подключении (НЕ добавляем в историю!)
    addMessage("Connecting to AI...", "bot", false); 
    
    // Создаем чистую историю для отправки: 
    // добавляем новое сообщение пользователя к существующей истории.
    const historyToSend = [...conversationHistory, { role: 'user', text: userText }];
    
    // Последний элемент в chatBox - это заглушка "Connecting to AI..."
    const loadingMessageElement = chatBox.lastChild;

    try {
        const response = await fetch(CHAT_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // Отправляем чистую, полную историю
            body: JSON.stringify({ 
                history: historyToSend 
            })
        });

        const data = await response.json();
        
        // 2. Удаляем элемент заглушки из интерфейса
        if (loadingMessageElement) {
            loadingMessageElement.remove();
        }

        if (data.reply) {
            // Добавляем ответ бота в интерфейс И в историю (addToHistory = true по умолчанию)
            addMessage(data.reply, "bot");
        } else {
            addMessage("Error: Could not get a reply from AI. Check Vercel logs.", "bot", false);
        }
    } catch (error) {
        // Удаляем элемент заглушки и сообщаем об ошибке
        if (loadingMessageElement) {
            loadingMessageElement.remove();
        }
        addMessage("Network Error. Check Vercel status and console.", "bot", false);
    }
}

// Обработка отправки формы
chatForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const text = userInput.value.trim();
    if (!text) return;

    // добавляем сообщение пользователя (добавляем в историю)
    addMessage(text, "user");
    userInput.value = "";

    // Отправляем сообщение на сервер
    sendToGemini(text); 
});
