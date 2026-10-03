const nodemailer = require('nodemailer');

const sendEmailNotification = async ({ to, subject, text, html }) => {
  try {
    let transporter;

    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
    } else {
      // Ethereal test account fallback
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
    }

    const info = await transporter.sendMail({
      from: `"SmartHire ATS" <${process.env.FROM_EMAIL || 'no-reply@smarthire.com'}>`,
      to,
      subject,
      text,
      html
    });

    console.log('📧 Email sent: %s', info.messageId);
    if (nodemailer.getTestMessageUrl(info)) {
      console.log('🔗 Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
    return true;
  } catch (error) {
    console.error('⚠️ Failed to send email notification:', error.message);
    return false;
  }
};

module.exports = sendEmailNotification;
