// Этот код выполняется на сервере Vercel (безопасно)
import { GoogleGenAI } from '@google/genai';

// Инициализируем клиента, используя секретный ключ
const ai = new GoogleGenAI({ 
    apiKey: process.env.GEMINI_API_KEY 
});

// Наша основная функция-обработчик
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    try {
        // Принимаем только историю
        const { history } = await req.body;

        if (!history || history.length === 0) {
            res.status(400).json({ error: 'Missing conversation history' });
            return;
        }

        // Форматируем историю для API Gemini
        const contents = history.map(item => ({
            // API требует, чтобы роль была 'user' или 'model'
            role: item.role, 
            parts: [{ text: item.text }]
        }));

        // Отправляем запрос в Gemini
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: contents, // Отправляем ВСЮ историю
        });

        const replyText = response.text;
        res.status(200).json({ reply: replyText });

    } catch (error) {
        console.error('Gemini API Error:', error);
        // Если ошибка API, вернем ее в ответ для лучшей диагностики
        res.status(500).json({ 
            error: 'Internal Server Error during AI request',
            details: error.message 
        });
    }
}
