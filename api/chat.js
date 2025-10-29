// Этот код выполняется на сервере Vercel (безопасно)
import { GoogleGenAI } from '@google/genai';

// Инициализируем клиента, используя секретный ключ из Vercel Environment Variables
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
        // Принимаем всю историю и новое сообщение
        const { history, newMessage } = await req.body;

        if (!history || !newMessage) {
            res.status(400).json({ error: 'Missing history or message parameter' });
            return;
        }

        // Форматируем историю для API Gemini
        const contents = history.map(item => ({
            // Роли должны быть 'user' или 'model'
            role: item.role, 
            parts: [{ text: item.text }]
        }));

        // Отправляем запрос в Gemini
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            // Отправляем ВСЮ историю
            contents: contents, 
        });

        // Получаем текстовый ответ
        const replyText = response.text;

        // Отправляем ответ обратно клиенту (на твой сайт)
        res.status(200).json({ reply: replyText });

    } catch (error) {
        console.error('Gemini API Error:', error);
        res.status(500).json({ error: 'Internal Server Error during AI request' });
    }
}
