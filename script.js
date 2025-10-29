const chatBox = document.getElementById("chat-box");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");

// Конечная точка (адрес) нашего безопасного прокси на Vercel
const CHAT_ENDPOINT = "/api/chat"; 

// Функция добавления сообщения в окно
function addMessage(text, sender) {
    const msg = document.createElement("div");
    msg.classList.add("message", sender);
    msg.textContent = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Отправка запроса к Vercel Proxy (и далее к Gemini)
async function sendToGemini(userText) {
    // Временно добавляем сообщение о подключении
    addMessage("Connecting to AI...", "bot"); 

    try {
        const response = await fetch(CHAT_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userText })
        });

        const data = await response.json();
        
        // Удаляем "Connecting to AI..."
        if (chatBox.lastChild) {
             chatBox.lastChild.remove(); 
        }

        if (data.reply) {
            addMessage(data.reply, "bot");
        } else {
            addMessage("Error: Could not get a reply from AI. Check Vercel logs.", "bot");
        }
    } catch (error) {
        // Удаляем "Connecting to AI..."
        if (chatBox.lastChild) {
             chatBox.lastChild.remove(); 
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
