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
  connectionTimeout: 10000, 
  greetingTimeout: 10000,
  socketTimeout: 10000,
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
            <p>Hi <strong>${params.name}</strong>,</p>
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


/** 
 * Send Email For Transaction Success
 */
export async function SendTransactionSuccessMail(params: {
  name: string;
  email: string;
  amount: number;
  transactionId: string;
  date: string;
  accountLast4: string;
  currency: string;
  newBalance: number;
  dashboardUrl: string;
}) {
  const mailSubject = `Transaction Success`;
  const mailBody = `
  <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f7f9; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e1e8ed; }
        .header { background-color: #007bff; color: #ffffff; padding: 20px; text-align: center; }
        .content { padding: 30px; color: #333333; line-height: 1.6; }
        .receipt-box { background-color: #f8f9fa; border: 1px dashed #ced4da; border-radius: 6px; padding: 20px; margin: 20px 0; }
        .receipt-row { display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #eeeeee; padding-bottom: 5px; }
        .label { color: #6c757d; font-weight: bold; font-size: 14px; }
        .value { color: #212529; font-weight: bold; font-size: 14px; }
        .status-badge { background-color: #28a745; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #999999; }
        .btn { display: inline-block; padding: 12px 25px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Transaction Successful</h2>
        </div>
        <div class="content">
            <p>Hi <strong>${params.name}</strong>,</p>
            <p>Your recent transaction has been processed successfully. Below are the details of your transfer:</p>
            
            <div class="receipt-box">
                <div class="receipt-row">
                    <span class="label">Amount</span>
                    <span class="value" style="color: #dc3545;">- ${params.amount}</span>
                </div>
                <div class="receipt-row">
                    <span class="label">Status</span>
                    <span class="status-badge">Completed</span>
                </div>
                <div class="receipt-row">
                    <span class="label">Transaction ID</span>
                    <span class="value">${params.transactionId}</span>
                </div>
                <div class="receipt-row">
                    <span class="label">Date</span>
                    <span class="value">${params.date}</span>
                </div>
                <div class="receipt-row">
                    <span class="label">Account</span>
                    <span class="value">**** ${params.accountLast4}</span>
                </div>
            </div>

            <p>Your new account balance is: <strong>${params.currency} ${params.newBalance}</strong></p>
            
            <center>
                <a href="${params.dashboardUrl}" class="btn">View Statement</a>
            </center>

            <p style="font-size: 13px; margin-top: 25px;">
                If you did not authorize this movement, please <a href="mailto:support@yourcompany.com">contact support</a> immediately.
            </p>
        </div>
        <div class="footer">
            &copy; 2026 BankHub. All rights reserved.<br>
            123 Tech Lane, Silicon Valley
        </div>
    </div>
</body>
</html>`;
  sendEmail(params.email, mailSubject, mailBody);
}
/** 
 * Send Email For Transaction Received Amount
 */
export async function SendTransactionReceivedAmountMail(params: {
  name: string;
  email: string;
  amount: number;
  transactionId: string;
  senderName: string;
  description: string;
  date: string;
  accountLast4: string;
  currency: string;
  newBalance: number;
  dashboardUrl: string;

}) {
  const mailSubject = `Transaction Got Amount`;
  const mailBody = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f7f9; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e1e8ed; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .header { background-color: #28a745; color: #ffffff; padding: 25px; text-align: center; }
        .content { padding: 30px; color: #333333; line-height: 1.6; }
        .receipt-box { background-color: #f0fff4; border: 1px solid #c3e6cb; border-radius: 6px; padding: 20px; margin: 20px 0; }
        .receipt-row { display: flex; justify-content: space-between; margin-bottom: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; }
        .receipt-row:last-child { border-bottom: none; }
        .label { color: #666666; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; }
        .value { color: #2d3748; font-weight: bold; font-size: 14px; }
        .amount-highlight { color: #28a745; font-size: 24px; font-weight: 800; display: block; margin-top: 5px; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #a0aec0; background: #f8fafc; }
        .btn { display: inline-block; padding: 12px 30px; background-color: #28a745; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2 style="margin:0;">Money Received!</h2>
        </div>
        <div class="content">
            <p>Hi <strong>${params.name}</strong>,</p>
            <p>Good news! Your account has been credited. The funds are now available in your balance.</p>
            
            <div class="receipt-box">
                <div style="text-align: center; margin-bottom: 20px;">
                    <span class="label">Amount Received</span>
                    <span class="amount-highlight">+ ${params.currency} ${params.amount}</span>
                </div>
                
                <div class="receipt-row">
                    <span class="label">From</span>
                    <span class="value">${params.senderName}</span>
                </div>
                <div class="receipt-row">
                    <span class="label">Reference</span>
                    <span class="value">${params.description}</span>
                </div>
                <div class="receipt-row">
                    <span class="label">Transaction ID</span>
                    <span class="value" style="font-family: monospace;">${params.transactionId}</span>
                </div>
                <div class="receipt-row">
                    <span class="label">Date</span>
                    <span class="value">${ params.date}</span>
                </div>
            </div>

            <p style="text-align: center;">Your new available balance is: <strong>${params.currency} ${params.newBalance}</strong></p>
            
            <center>
                <a href="${params.dashboardUrl}" class="btn">View Transactions</a>
            </center>
        </div>
        <div class="footer">
            You are receiving this because you enabled transaction alerts.<br>
            &copy; 2026 BankHub. All rights reserved.
        </div>
    </div>
</body>
</html>`;
  sendEmail(params.email, mailSubject, mailBody);
}

/** 
 * Send Email For Transaction Failed
 */
export async function SendTransactionFailedMail(params: {
  name: string;
  email: string;
  amount: number;
  type: string;
}) {
  const mailSubject = `Transaction Failed`;
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
            <h1>Transaction Failed</h1>
        </div>
        <div class="content">
            <p>Hi <strong>${params.name}</strong>,</p>
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

/** 
 * Send Email For Transaction Refunded
 */
export async function SendTransactionRefundedMail(params: {
  name: string;
  email: string;
  amount: number;
  type: string;
}) {
  const mailSubject = `Transaction Refunded`;
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
            <h1>Transaction Refunded</h1>
        </div>
        <div class="content">
            <p>Hi <strong>${params.name}</strong>,</p>
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


