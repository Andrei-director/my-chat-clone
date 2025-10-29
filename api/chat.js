// Этот код выполняется на сервере Vercel (безопасно)

// Импортируем Gemini SDK
import { GoogleGenAI } from '@google/genai';

// Инициализируем клиента, используя секретный ключ из Vercel Environment Variables
const ai = new GoogleGenAI({ 
    apiKey: process.env.GEMINI_API_KEY 
});

// Наша основная функция-обработчик (Vercel Edge Function)
export default async function handler(req, res) {
    
    // Проверка, что это POST-запрос
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    try {
        // Парсим сообщение пользователя из тела запроса
        const { message } = await req.body;

        if (!message) {
            res.status(400).json({ error: 'Missing message parameter' });
            return;
        }

        // Отправляем запрос в Gemini
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ role: 'user', parts: [{ text: message }] }],
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
