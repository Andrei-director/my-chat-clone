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
function addMessage(text, sender) {
    const msg = document.createElement("div");
    msg.classList.add("message", sender);
    msg.textContent = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;

    // ДОБАВЛЯЕМ сообщение в историю
    conversationHistory.push({ 
        role: sender === 'user' ? 'user' : 'model', 
        text: text 
    });
}

// Перерисовка начального сообщения
// Добавляем начальное сообщение бота при загрузке
if (conversationHistory.length > 0) {
    addMessage(conversationHistory[0].text, 'bot');
    // Удаляем из истории, чтобы не дублировать, если нужно
    conversationHistory.splice(0, 1); 
}


// Отправка запроса к Vercel Proxy, включая ВСЮ историю
async function sendToGemini(userText) {
    // Временно добавляем сообщение о подключении
    addMessage("Connecting to AI...", "bot"); 
    
    // Последнее сообщение, которое мы только что добавили
    const lastUserMessage = conversationHistory[conversationHistory.length - 1];

    try {
        const response = await fetch(CHAT_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // Отправляем ВСЮ историю разговора
            body: JSON.stringify({ 
                history: conversationHistory,
                newMessage: userText
            })
        });

        const data = await response.json();
        
        // Удаляем "Connecting to AI..."
        if (chatBox.lastChild) {
             chatBox.lastChild.remove(); 
             // И удаляем его из истории, так как это не настоящий ответ
             conversationHistory.pop();
        }

        if (data.reply) {
            // Добавляем ответ бота в интерфейс и в историю
            addMessage(data.reply, "bot");
        } else {
            addMessage("Error: Could not get a reply from AI. Check Vercel logs.", "bot");
        }
    } catch (error) {
        // Удаляем "Connecting to AI..."
        if (chatBox.lastChild) {
             chatBox.lastChild.remove(); 
             conversationHistory.pop();
        }
        addMessage("Network Error. Check Vercel status and console.", "bot");
    }
}

// Обработка отправки формы
chatForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const text = userInput.value.trim();
    if (!text) return;

    // добавляем сообщение пользователя
    addMessage(text, "user");
    userInput.value = "";

    // Отправляем сообщение на сервер
    sendToGemini(text); 
});
