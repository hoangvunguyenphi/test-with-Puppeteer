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
            headless: "new",  // Chạy chế độ headless để tránh lỗi
            executablePath: "/usr/bin/chromium",
        });

        const page = await browser.newPage();
        await page.goto('http://blueprint.cyberlogitec.com.vn/', { waitUntil: 'networkidle2' });

        // ✅ Điền thông tin đăng nhập
        await page.type('input[name="username"]', username);
        await page.type('input[name="password"]', password);

        // 👉 Bấm nút đăng nhập (Cập nhật selector nếu cần)
        await Promise.all([
            page.click('button[type="submit"]'),
            page.waitForNavigation({ waitUntil: 'networkidle2' })
        ]);

        // 🍪 Lấy cookies sau khi đăng nhập
        storedCookies = await page.cookies();

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
