const chatBox = document.getElementById("chat-box");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");

// Функция добавления сообщения в окно
function addMessage(text, sender) {
    const msg = document.createElement("div");
    msg.classList.add("message", sender);
    msg.textContent = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight; // прокрутка вниз
}

// Обработка отправки формы
chatForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const text = userInput.value.trim();
    if (!text) return;

    // добавляем сообщение пользователя
    addMessage(text, "user");
    userInput.value = "";

    // имитация ответа "бота"
    setTimeout(() => {
        const reply = generateBotReply(text);
        addMessage(reply, "bot");
    }, 600);
});

// Простая логика ответов (можно расширять)
function generateBotReply(userText) {
    const msg = userText.toLowerCase();

    if (msg.includes("hello") || msg.includes("hi")) {
        return "Hi there! 👋 How can I help you today?";
    } else if (msg.includes("name")) {
        return "I’m a simple JavaScript chat bot.";
    } else if (msg.includes("time")) {
        return "Current time is " + new Date().toLocaleTimeString();
    } else {
        const replies = [
            "Interesting... tell me more!",
            "I see 🤔",
            "Can you explain that differently?",
            "That's cool!",
            "Let's talk more about it!"
        ];
        return replies[Math.floor(Math.random() * replies.length)];
    }
}
