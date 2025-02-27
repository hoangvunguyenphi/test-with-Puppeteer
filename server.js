const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

let storedCookies = [];

// 📡 Endpoint để lấy cookie từ trang web
app.post('/get-cookies', async (req, res) => {
    const { username, password } = req.body;

    try {
        const browser = await puppeteer.launch({
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
            headless: "new"
        });

        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 800 }); // Tăng tốc render

        // Tải trang nhanh hơn
        await page.goto('http://blueprint.cyberlogitec.com.vn/', { waitUntil: 'domcontentloaded' });

        // Điền thông tin nhanh hơn
        await page.type('input[name="username"]', username, { delay: 10 });
        await page.type('input[name="password"]', password, { delay: 10 });

        // Giới hạn thời gian chờ tối đa 5 giây
        await Promise.race([
            page.click('button[type="submit"]'),
            page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 5000 })
        ]);

        // Lấy cookies
        const storedCookies = await page.cookies();

        await browser.close();
        res.json({ status: 'success', cookies: storedCookies });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.toString() });
    }
});

// 📡 Endpoint để truy vấn lại cookies đã lưu
app.get('/cookies', (req, res) => {
    res.json({ cookies: storedCookies });
});

app.get('/', (req, res) => {
    res.json({ "hello": "world" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
