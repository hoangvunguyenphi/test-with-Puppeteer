# Sử dụng Node.js làm nền tảng
FROM node:18

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép file package.json và package-lock.json trước
COPY package.json package-lock.json ./

# Cài đặt Puppeteer (đảm bảo Chromium được tải về)
RUN npm install

# Cài đặt Chromium thủ công
RUN apt-get update && apt-get install curl gnupg -y \
  && curl --location --silent https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install google-chrome-stable -y --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Mở cổng 3000
EXPOSE 8080

# Khởi động server
CMD ["node", "server.js"]
