import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

// Function to send email
const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const info = await transporter.sendMail({
      from: `"Your Name" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      html, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

/**
 * Send Welcome Email For Registered User
 */
export async function SendRegisterationMail(params: {
  name: string;
  email: string;
}) {
  const mailSubject = `Welcome to BANKHUB! 🚀 Let’s get you started`;
  const mailBody = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; }
        .header { background-color: #3584e4; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; }
        .button-container { text-align: center; margin-top: 30px; }
        .button { background-color: #3584e4; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; }
        .footer { background-color: #f9f9f9; color: #777; padding: 20px; text-align: center; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to the Community!</h1>
        </div>
        <div class="content">
            <p>Hi <strong>{${params.name}}</strong>,</p>
            <p>We're excited to have you on board! Your account is officially set up and ready to go.</p>
            <p>To get started and explore your new dashboard, click the button below:</p>
            <div class="button-container">
                <p class="button">Log In to Your Account</p>
            </div>
            <p>If you have any questions, just reply to this email—we're always here to help.</p>
        </div>
        <div class="footer">
            <p>&copy; 2026 BankHub. All rights reserved.</p>
            <p>123 Tech Lane, Silicon Valley</p>
        </div>
    </div>
</body>
</html>`;
  sendEmail(params.email, mailSubject, mailBody);
}
