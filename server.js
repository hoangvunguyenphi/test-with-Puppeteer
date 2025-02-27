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
            headless: "false"
        });

        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 800 });

        // Truy cập trang đăng nhập, chỉ chờ DOM tải xong
        await page.goto('http://blueprint.cyberlogitec.com.vn/', { waitUntil: 'domcontentloaded', timeout: 5000 });

        // Nhập thông tin nhanh hơn
        await page.type('input[name="username"]', username, { delay: 10 });
        await page.type('input[name="password"]', password, { delay: 10 });

        // Nhấn nút đăng nhập
        await page.click('button[type="submit"]');

        // Chờ xác định login thành công dựa trên sự thay đổi UI
        await Promise.race([
            page.waitForSelector('#UI_DMM_HomeBody', { timeout: 5000 }), // Chờ trang chính xuất hiện
            page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 5000 }) // Hoặc điều hướng xong
        ]);

        // Lấy cookies
        const storedCookies = await page.cookies();

        await browser.close();
        res.json({ status: 'success', cookies: storedCookies });
    } catch (err) {
        console.error('Lỗi đăng nhập:', err);
        res.status(500).json({ status: 'error', message: 'Đăng nhập thất bại hoặc quá thời gian chờ' });
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
