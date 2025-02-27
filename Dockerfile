FROM node:18

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .

# Cài đặt Puppeteer dependencies
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

EXPOSE 3000
CMD ["node", "index.js"]
