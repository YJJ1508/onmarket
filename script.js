import express from 'express';
import fetch from 'node-fetch';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url'; // Node.js 내장 모듈

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const API_KEY = "OPENAI_API_KEY";

// public 폴더를 정적 파일로 제공
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;

        const API_URL = "https://api.openai.com/v1/chat/completions";

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{role: "user", content: userMessage}],
            })
        };

        const response = await fetch(API_URL, requestOptions);
        const data = await response.json();
        const botMessage = data.choices[0].message.content.trim();

        res.json({ message: botMessage });
    } catch (err) {
        console.error("There was a problem:", err.message);
        res.status(500).json({ error: "Oops! Something went wrong. Please try again." });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});