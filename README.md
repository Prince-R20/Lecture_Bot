# Lecture Bot

Lecture Bot is a simple WhatsApp automation bot that connects to WhatsApp Web using the Baileys library. It manages authentication securely and backs up your session credentials to Supabase Storage, so you don’t have to scan the QR code every time you restart the bot.

## Features

- Connects to WhatsApp Web using your account
- Shows a QR code in the terminal for login (first time only)
- Saves and restores your WhatsApp session automatically
- Backs up your session credentials to Supabase Storage
- Includes a basic HTTP server for health checks
