const fs = require('fs-extra');
const path = require("path");
const { Sequelize } = require('sequelize');

// Load environment variables if the .env file exists
if (fs.existsSync('set.env')) {
    require('dotenv').config({ path: __dirname + '/set.env' });
}

const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined ? databasePath : process.env.DATABASE_URL;

module.exports = {
    session: process.env.SESSION_ID || 'FLASH-MD-WA-BOT;;;=>eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoidU9DYlhzR2Rjd2ovRjhDdlBlNG0wZkRjeG93YnhrUzByNkRjdGtreXluYz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQ0dLT1BiM25nYXg3UWpBa2hMRm1aS0t2TEZVQW9iVUpiWmJRT3kxV2dCYz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJHQjlxQmJPZllOdWtlU0RwWnQwWDFCY3Fra3pjNFFGQkVmYlVZaTdtQUZjPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJyQzBsMjVUamwyNGtwYzJ4MElLZHU0QUNycExBaU81ZUJFaEt1ckNQQmcwPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkdGQmZnTXppK1NYUWlrUmIxTGh1bFdTTks3NEk5MjIrSGR0RXV2Tm5sMDA9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlpGWUovUVlXT2JUZWdjcm9FWEFGYlFWdmRUMUhrdUNNQ1JmbUxXLytuR0U9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiY0FNN2RiU2ZpWlBkZDBiQURmazZaTEIzVlc4bWFUNGx0VE9rTUlaeFExTT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoidE9IMmNnVTRuMXJJN1hMZkFlaU1ReHJPcy92TmNnbG5zYlVzMyt4MERGYz0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Ik1hTnNrSno1RE5rVFlYSDYzeDUwOWhPUXBNZHdkcGxIajFJWmFqNnoxNlMxcE5QT3RNc3FxcHBLdERXdXdiTUdJV0xtc2N4c0VLVGhYT05GY2h5QWd3PT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MjM2LCJhZHZTZWNyZXRLZXkiOiIycnlKdGx6SmwvVTAveHpwSDl5cXFNWXZvdm12YVlET29lRUlFK2lQVFBNPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiJ4azdHaV9YTFM3SzhLaHI5YWtNNkVRIiwicGhvbmVJZCI6ImY4YmE1MGQ2LTdiNjEtNDY2MC04ZTQ0LTEzNGVkNzE0MTFhYSIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiI4T2g0NjVPa1EzbzBYaU9JQXZZTWNDYkE2bk09In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiY2diOFFDTG5VY2srTkFwbS9Wa2gwcHdGa0xZPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6IkVNWlNXNjIzIiwibWUiOnsiaWQiOiIyNzcxNzU3ODk0MDo2OUBzLndoYXRzYXBwLm5ldCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDSldXbzZjREVQbjZ0c0FHR0FJZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiR3hoL2pxNEdOT1BoNzU3ZVJ5cHRDQnRIVWV2V0xTdkZQUStNM2xrS1dRbz0iLCJhY2NvdW50U2lnbmF0dXJlIjoiMHhDU0l5LzJHaWlGa1Z0K1A1RXJkWEhFeXdsMnU4RlpjOHRhaG9ZOXh3TDRZRzFsVUd0VHp2ZkF6eDRqYU5vZzBub2lBWmIrWnYyT2FwZmh2OEloQUE9PSIsImRldmljZVNpZ25hdHVyZSI6ImxDMW5yWnRkZTgvZENzVGNXYXA4RW0xUlpqUUtvWlZKZEhnck9XeXdGcVVvTWJsbzFrZWxCL3hIQXZqNjhhNXpSSU5DNmY0dDJCc05lMktYRktVcWpRPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjc3MTc1Nzg5NDA6NjlAcy53aGF0c2FwcC5uZXQiLCJkZXZpY2VJZCI6MH0sImlkZW50aWZpZXJLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCUnNZZjQ2dUJqVGo0ZStlM2tjcWJRZ2JSMUhyMWkwcnhUMFBqTjVaQ2xrSyJ9fV0sInBsYXRmb3JtIjoiYW5kcm9pZCIsImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTc0NTczMDk1MiwibXlBcHBTdGF0ZUtleUlkIjoiQUFBQUFMcnkifQ==',
    PREFIXES: (process.env.PREFIX || '').split(',').map(prefix => prefix.trim()).filter(Boolean),
    OWNER_NAME: process.env.OWNER_NAME || "YOUNG TEE",
    OWNER_NUMBER: process.env.OWNER_NUMBER || "27717578940",
    AUTO_READ_STATUS: process.env.AUTO_VIEW_STATUS || "on",
    AUTOREAD_MESSAGES: process.env.AUTO_READ_MESSAGES || "off",
    CHATBOT: process.env.CHAT_BOT || "off",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_SAVE_STATUS || 'off',
    A_REACT: process.env.AUTO_REACTION || 'off',
    L_S: process.env.STATUS_LIKE || 'off',
    AUTO_BLOCK: process.env.BLOCK_ALL || 'off',
    URL: process.env.MENU_LINKS || 'https://files.catbox.moe/izd8l0.jpeg',
    MODE: process.env.BOT_MODE || "private",
    PM_PERMIT: process.env.PM_PERMIT || 'on',
    HEROKU_APP_NAME: process.env.HEROKU_APP_NAME,
    HEROKU_API_KEY: process.env.HEROKU_API_KEY,
    WARN_COUNT: process.env.WARN_COUNT || '3',
    PRESENCE: process.env.PRESENCE || '',
    ADM: process.env.ANTI_DELETE || 'on',
    TZ: process.env.TIME_ZONE || 'Africa/Nairobi',
    DP: process.env.STARTING_MESSAGE || "on",
    ANTICALL: process.env.ANTICALL || 'on',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://flashmd_user:JlUe2Vs0UuBGh0sXz7rxONTeXSOra9XP@dpg-cqbd04tumphs73d2706g-a/flashmd"
        : "postgresql://flashmd_user:JlUe2Vs0UuBGh0sXz7rxONTeXSOra9XP@dpg-cqbd04tumphs73d2706g-a/flashmd",
    W_M: null, // Add this line
};

// Watch for changes in this file and reload it automatically
const fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`Updated ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
