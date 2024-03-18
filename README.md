# 📻 slowreverber
![Apache License 2.0](https://img.shields.io/badge/License-Apache%202.0-FFC0CB?style=for-the-badge&logo=apache&logoColor=white)
[![Telegram](https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white)](https://telegram.org/) 
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)

**Telegram bot for creating slowed/speed up+reverb remixes.**

![](public/banner.png)

## 🚀 Running
1. Copy `example.env` to `.env` and fill it with your data.
2. Install dependencies:
```bash
npm install
```
3. Install ffmpeg and sox:
```bash
sudo apt install ffmpeg sox
```
4. Install and configure [mysql](https://dev.mysql.com/doc/mysql-installation-excerpt/5.7/en/) and [redis](https://redis.io/docs/install/install-redis/).
3. Start:
```bash
npm run bot
```

## ⚒ Configuring
- `BOT_TOKEN` Telegram bot token
- `log` Options: debug / info
- `DB_HOST` Your db hostname or ip
- `DB_HOST` Your db port
- `DB_NAME` Your db name
- `DB_USERNAME` Your db username
- `DB_PASSWORD` Your db user password
- `REDIS_PORT` Your redis port
- `REDIS_HOST` Your redis hostname or ip
- `REDIS_PASS` Your redis password

## 📄 Commands
- `start` - start command ¯\\\_(ツ)\_\/¯
- `settings` - show settings menu

## 📸 Screenshots
![](public/screenshots.png)