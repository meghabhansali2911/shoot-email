require("dotenv").config();

const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");

const { emails } = require("./emails");
const { emailFormat } = require("./mailformat");

const app = express();

const PORT = process.env.PORT || 3000;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

// ======================================================
// VALIDATION
// ======================================================

if (!EMAIL_USER || !EMAIL_PASS) {
  console.error("❌ EMAIL_USER or EMAIL_PASS missing in .env");
  process.exit(1);
}

// ======================================================
// TRANSPORTER
// ======================================================

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// ======================================================
// HELPERS
// ======================================================

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getHtmlTemplate = emailFormat;

const getCompanyName = (email) => {
  return email?.split("@")[1]?.split(".")[0] || "your company";
};

// ======================================================
// SEND SINGLE EMAIL
// ======================================================

const sendEmail = async (emailId, index) => {
  try {
    console.log(`📤 [${index + 1}] Sending to ${emailId}`);

    const companyName = getCompanyName(emailId);

    const mailOptions = {
      from: EMAIL_USER,
      to: emailId,
      subject: "Application for MERN Stack Developer | 4 Years Experience",
      html: getHtmlTemplate(companyName),

      attachments: [
        {
          filename: "Megha-MERN-CV-4.pdf",
          path: path.join(__dirname, "Megha-MERN-CV-4.pdf"),
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(`✅ Sent to ${emailId}`);

    return {
      success: true,
      email: emailId,
      response: info.response,
    };
  } catch (error) {
    console.error(`❌ Failed for ${emailId}: ${error.message}`);

    return {
      success: false,
      email: emailId,
      error: error.message,
    };
  }
};

// ======================================================
// SEND ALL EMAILS
// ======================================================

const sendEmails = async () => {
  console.log("🚀 Starting bulk email process...\n");

  const promises = emails.map((email, index) => sendEmail(email, index));

  const settledResults = await Promise.allSettled(promises);

  const results = settledResults.map((result) => {
    if (result.status === "fulfilled") {
      return result.value;
    }

    return {
      success: false,
      error: result.reason?.message || "Unknown error",
    };
  });

  const successCount = results.filter((r) => r.success).length;

  console.log("\n==============================");
  console.log("✅ Bulk email process completed");
  console.log(`📨 Total: ${emails.length}`);
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Failed: ${emails.length - successCount}`);
  console.log("==============================\n");

  return results;
};

// ======================================================
// SERVER START
// ======================================================

app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);

  try {
    await transporter.verify();

    console.log("✅ Mail server connected\n");

    // Automatically start sending emails
    await sendEmails();
  } catch (error) {
    console.error("❌ Startup failed:", error.message);
  }
});
