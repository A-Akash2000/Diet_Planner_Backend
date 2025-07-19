import nodemailer from 'nodemailer';
import config from '../config/config';
import sgMail from '@sendgrid/mail';

export interface MailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmailEmail = async ({ to, subject, html }: MailOptions): Promise<void> => {
  console.log("to, subject, html", to, subject, html, config.HOSTMAIL, config.PASSMAIL)
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: config.HOSTMAIL,
      pass: config.PASSMAIL,
    },
  });

  const mailOptions = {
    from: `"Your App Name" <${config.HOSTMAIL}>`,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
  } catch (error: any) {
    console.error('Failed to send email:', error.response || error.message || error);
    throw error;
  }
};

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
sgMail.setApiKey(config.SENDGRID_API_KEY);

export const sendEmail = async ({ to, subject, html }: MailOptions): Promise<void> => {
  const msg = {
    to,
    from: config.HOSTMAIL,
    subject,
    html,
  };

  try {
    await sgMail.send(msg);
    console.log('Email sent successfully');
  } catch (error: any) {
    console.error('Error sending email:', error.response?.body || error.message);
    throw error;
  }
};

  