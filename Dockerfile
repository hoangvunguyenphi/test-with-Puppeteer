# Sử dụng Node.js làm nền tảng
FROM node:18

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép file package.json và package-lock.json trước
COPY package.json package-lock.json ./

RUN apt-get install chromium -y

# Cài đặt Puppeteer (đảm bảo Chromium được tải về)
RUN npm install

# Cài đặt Chromium thủ công
RUN apt-get update && apt-get install -y \
    wget \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libxcomposite1 \
    libxrandr2 \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Mở cổng 3000
EXPOSE 3000

# Khởi động server
CMD ["node", "server.js"]
