# Email Sender

A simple Node.js bulk email sender that uses Gmail and Nodemailer to send a personalized HTML application email with an attached resume.

## Project Overview

This project starts an Express server and automatically sends a list of emails defined in `emails.js` with a custom HTML email body from `mailformat.js`. The email includes a resume attachment named `Megha-MERN-CV-4.pdf`.

## Features

- Sends bulk emails using Gmail via Nodemailer
- Uses a reusable HTML email template
- Automatically starts sending emails when the server launches
- Logs successes and failures to the console

## Prerequisites

- Node.js 18+ installed
- A Gmail account for sending email
- `Megha-MERN-CV-4.pdf` present in the project root

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root with the following values:

```env
EMAIL_USER=your.email@gmail.com
EMAIL_PASS=your_gmail_app_password
PORT=3000
```

> Note: For Gmail, it is recommended to use an App Password instead of your main account password.

## Usage

Start the application:

```bash
npm start
```

The server will launch on `http://localhost:3000` and immediately begin sending emails to the list defined in `emails.js`.

## File Structure

- `server.js` - main application logic and email sending flow
- `emails.js` - list of recipient email addresses
- `mailformat.js` - HTML email template generator
- `package.json` - project dependencies and scripts
- `.env` - environment variables (not committed)

## Customization

- Add or remove recipients in `emails.js`
- Customize the email body in `mailformat.js`
- Change the email subject or attachment in `server.js`

## Notes

- The app uses Gmail's SMTP service, so ensure your account settings allow sending via SMTP.
- If you get authentication errors, verify the `EMAIL_USER` and `EMAIL_PASS` values in `.env`.
- The email sending process runs once on startup and logs the total results.
