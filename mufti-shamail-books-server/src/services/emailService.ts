import nodemailer from "nodemailer";
import { createOrderShippedTemplate, createOrderDeliveredTemplate, createOrderConfirmationTemplate } from "./emailTemplates/orderConfirmation";
import { createOrderRTOTemplate } from "./emailTemplates/orderRTO";

const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST,
	port: parseInt(process.env.SMTP_PORT || "587"),
	secure: process.env.SMTP_SECURE === "true",
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS,
	},
	tls: {
		rejectUnauthorized: false, // Only use during development!
	},
});

const createPasswordResetTemplate = (name: string, resetUrl: string) => {
	return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
            body {
                background-color: #121510;
                color: #ffffff;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.5;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 40px 20px;
            }
            .card {
                background-color: #191b14;
                border-radius: 16px;
                padding: 32px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .logo {
                color: #c3e5a5;
                font-size: 24px;
                font-weight: bold;
                text-align: center;
                margin-bottom: 32px;
            }
            h1 {
                color: #c3e5a5;
                font-size: 28px;
                margin-bottom: 24px;
                text-align: center;
            }
            p {
                color: #a0a0a0;
                margin-bottom: 24px;
                text-align: center;
            }
            .button {
                background-color: #c3e5a5;
                color: #191b14;
                text-decoration: none;
                padding: 12px 32px;
                border-radius: 9999px;
                font-weight: 500;
                display: inline-block;
                text-align: center;
                margin: 0 auto;
            }
            .button-container {
                text-align: center;
                margin: 32px 0;
            }
            .footer {
                text-align: center;
                color: #666666;
                font-size: 14px;
                margin-top: 32px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="card">
                <div class="logo">Mufti Shamail Books</div>
                <h1>Password Reset Request</h1>
                <p>Hi ${name},</p>
                <p>We received a request to reset your password. Click the button below to create a new password:</p>
                <div class="button-container">
                    <a href="${resetUrl}" class="button">Reset Password</a>
                </div>
                <p>This link will expire in 1 hour for security reasons.</p>
                <p>If you didn't request this password reset, you can safely ignore this email.</p>
                <div class="footer">
                    <p>© ${new Date().getFullYear()} Mufti Shamail Books. All rights reserved.</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
};

export const sendPasswordResetEmail = async (
	email: string,
	name: string,
	resetToken: string
) => {
	const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

	await transporter.sendMail({
		from: process.env.SMTP_FROM,
		to: email,
		subject: "Reset Your Password - Mufti Shamail Books",
		html: createPasswordResetTemplate(name, resetUrl),
	});
};

export const sendOrderConfirmationEmail = async (orderData: any) => {
	// Prepare items for email template
	const items = orderData.items.map((item: any) => ({
		title: item.book?.name || item.book?.title || "Book",
		quantity: item.quantity,
		price: (item.book?.price || 0) * item.quantity
	}));

	await transporter.sendMail({
		from: process.env.SMTP_FROM,
		to: orderData.contactDetails.email,
		subject: `🎉 Order Confirmation - ${orderData.orderNumber}`,
		html: createOrderConfirmationTemplate(
			orderData.contactDetails.name,
			orderData.orderNumber,
			items,
			orderData.amount
		),
	});
};

export const sendOrderShippedEmail = async (orderData: any) => {
	await transporter.sendMail({
		from: process.env.SMTP_FROM,
		// to: orderData.contactDetails.email,
        to: "mdfarhan9304@gmail.com",
		subject: `📦 Your Order ${orderData.orderNumber} Has Been Shipped!`,
		html: createOrderShippedTemplate(orderData),
	});
};

export const sendOrderDeliveredEmail = async (orderData: any) => {
	await transporter.sendMail({
		from: process.env.SMTP_FROM,
		// to: orderData.contactDetails.email,
        to: "mdfarhan9304@gmail.com",
		subject: `✅ Your Order ${orderData.orderNumber} Has Been Delivered!`,
		html: createOrderDeliveredTemplate(orderData),
	});
};

export const sendOrderRTOEmail = async (orderData: any) => {
	await transporter.sendMail({
		from: process.env.SMTP_FROM,
		// to: orderData.contactDetails.email,
        to: "mdfarhan9304@gmail.com",
		subject: `🔄 Order ${orderData.orderNumber} - Return to Origin Notice`,
		html: createOrderRTOTemplate(orderData),
	});
};




