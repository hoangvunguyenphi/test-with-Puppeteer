const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

let jsession_id = "";

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
        console.log("-----khởi tạo browser: done");

        // Truy cập trang đăng nhập, chỉ chờ DOM tải xong
        await page.goto('http://blueprint.cyberlogitec.com.vn/', { waitUntil: 'domcontentloaded' });
        console.log("-----login page of blueprint : done");

        // Nhập thông tin nhanh hơn
        await page.type('input[name="username"]', username, { delay: 10 });
        await page.type('input[name="password"]', password, { delay: 10 });
        // Nhấn nút đăng nhập
        await page.click('button[type="submit"]');
        console.log("-----click login button: done");

        // Chờ xác định login thành công dựa trên sự thay đổi UI
        await Promise.race([
            page.waitForSelector('body'),
            page.waitForNavigation({ waitUntil: 'load' }) // Hoặc điều hướng xong
        ]);
        console.log("-----login sucess: done");

        // Lấy cookies
        const storedCookies = await page.cookies();

        await browser.close(); 

        for(cookie in storedCookies["cookies"]){
            if(cookie["name"] == "JSESSIONID"){
                jsession_id = cookie["value"];
                break;
            }
        }
        res.json({ status: 'success', jsessionid: jsession_id });
    } catch (err) {
        console.error('Lỗi xử lý:', err);
        res.status(500).json({ status: 'error', message: err });
    }
});


// 📡 Endpoint để truy vấn lại cookies đã lưu
app.get('/cookies', (req, res) => {
    res.json({ jsession_id: jsession_id });
});

app.get('/', (req, res) => {
    res.json({ "hello": "world" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
