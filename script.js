// ВАЖНО: Никогда не храните ваш настоящий API-ключ в открытом коде на GitHub!
// Этот ключ ниже - это ЗАГЛУШКА. Для работы нужно настроить БЕЗОПАСНЫЙ прокси.
//
// Для ЛОКАЛЬНОГО ТЕСТИРОВАНИЯ (только для себя):
// const GEMINI_API_KEY = "СЮДА_ВСТАВЬ_ТВОЙ_КЛЮЧ_GEMINI"; 
// const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + GEMINI_API_KEY;

const chatBox = document.getElementById("chat-box");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const CHAT_ENDPOINT = "/api/chat"; // Наш будущий безопасный прокси-адрес

// Функция добавления сообщения в окно
function addMessage(text, sender) {
    const msg = document.createElement("div");
    msg.classList.add("message", sender);
    msg.textContent = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Отправка запроса к API
async function sendToGemini(userText) {
    // Временно используем заглушку, пока не настроен безопасный прокси
    addMessage("Connecting to AI...", "bot"); 

    // Здесь должен быть fetch к БЕЗОПАСНОМУ прокси, который спрячет ключ
    /*
    try {
        const response = await fetch(CHAT_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userText })
        });

        const data = await response.json();
        
        // Удаляем "Connecting to AI..."
        chatBox.lastChild.remove(); 
        
        if (data.reply) {
            addMessage(data.reply, "bot");
        } else {
            addMessage("Error: Could not get a reply from AI.", "bot");
        }
    } catch (error) {
        // Удаляем "Connecting to AI..."
        chatBox.lastChild.remove(); 
        addMessage("Network Error. Check your proxy setup.", "bot");
    }
    */
    
    // ВРЕМЕННЫЙ ФЕЙКОВЫЙ ОТВЕТ для демонстрации работы интерфейса:
    setTimeout(() => {
        // Удаляем "Connecting to AI..."
        chatBox.lastChild.remove(); 
        addMessage(`[AI Reply]: You asked "${userText}". To get a real answer, you need to set up a secure proxy server.`, "bot");
    }, 1500);

}

// Обработка отправки формы
chatForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const text = userInput.value.trim();
    if (!text) return;

    // добавляем сообщение пользователя
    addMessage(text, "user");
    userInput.value = "";

    // Отправляем сообщение на сервер (или заглушку)
    sendToGemini(text); 
});
