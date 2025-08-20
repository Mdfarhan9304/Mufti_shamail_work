import { baseStyles } from "./styles";

const emailStyles = `
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
            color: #e57373;
            font-size: 28px;
            margin-bottom: 24px;
            text-align: center;
        }
        h3 {
            color: #c3e5a5;
            font-size: 18px;
            margin-bottom: 16px;
            margin-top: 24px;
        }
        p {
            color: #a0a0a0;
            margin-bottom: 16px;
        }
        .rto-notice {
            background-color: #4a2626;
            border-left: 4px solid #e57373;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .order-details {
            background-color: #1a1d15;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            padding: 4px 0;
        }
        .label {
            color: #a0a0a0;
        }
        .value {
            color: #ffffff;
            font-weight: 500;
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
        }
        .button-container {
            text-align: center;
            margin: 24px 0;
        }
        .footer {
            text-align: center;
            color: #666666;
            font-size: 14px;
            margin-top: 32px;
        }
        .contact-info {
            background-color: #1a1d15;
            border-radius: 8px;
            padding: 16px;
            margin: 16px 0;
            text-align: center;
        }
    </style>
`;

export const createOrderRTOTemplate = (order: any) => {
    const customerName = order.user?.name || order.billingAddress?.name || 'Customer';
    const orderId = order._id;
    const totalAmount = order.items.reduce((total: number, item: any) => total + (item.price * item.quantity), 0);
    const trackingInfo = order.fulfillment?.trackingNumber || 'Not available';
    const shippingProvider = order.fulfillment?.shippingProvider || 'Courier Partner';

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Return Notice - Mufti Shamail Books</title>
        ${emailStyles}
    </head>
    <body>
        <div class="container">
            <div class="card">
                <div class="logo">📚 Mufti Shamail Books</div>
                
                <h1>🔄 Order Return Notice</h1>
                
                <p>Dear ${customerName},</p>
                
                <div class="rto-notice">
                    <h3>⚠️ Delivery Attempt Failed</h3>
                    <p>We regret to inform you that our courier partner was unable to deliver your order. Multiple delivery attempts were made, and our team tried to contact you at the provided phone number, but we couldn't reach you.</p>
                </div>
                
                <p>Your order has been marked as <strong>RTO (Return to Origin)</strong> and is being returned to our warehouse.</p>
                
                <div class="order-details">
                    <h3>📦 Order Details</h3>
                    <div class="detail-row">
                        <span class="label">Order ID:</span>
                        <span class="value">#${orderId}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Courier Partner:</span>
                        <span class="value">${shippingProvider}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Tracking Number:</span>
                        <span class="value">${trackingInfo}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Order Value:</span>
                        <span class="value">₹${totalAmount}</span>
                    </div>
                </div>

                <h3>📞 What Happened?</h3>
                <p>Our courier partner attempted delivery multiple times but:</p>
                <ul style="color: #a0a0a0; margin-left: 20px;">
                    <li>Could not reach you at the provided contact number</li>
                    <li>No one was available at the delivery address</li>
                    <li>Address was found to be incorrect or incomplete</li>
                </ul>

                <h3>🔄 Next Steps</h3>
                <p>Your order is now being returned to our warehouse. Here's what will happen next:</p>
                <ul style="color: #a0a0a0; margin-left: 20px;">
                    <li><strong>Refund Processing:</strong> Once we receive the returned package, we'll process your refund within 3-5 business days</li>
                    <li><strong>Refund Method:</strong> Amount will be credited back to your original payment method</li>
                    <li><strong>Reorder Option:</strong> You can place a new order with updated contact details</li>
                </ul>

                <div class="contact-info">
                    <h3>📞 Need Help?</h3>
                    <p>If you believe this was an error or need to update your contact information, please reach out to us:</p>
                    <p><strong>Email:</strong> support@muftishamailbooks.com</p>
                    <p><strong>Phone:</strong> +91-XXXX-XXXX-XX</p>
                    <p><strong>WhatsApp:</strong> +91-XXXX-XXXX-XX</p>
                </div>

                <div class="button-container">
                    <a href="${process.env.FRONTEND_URL}/orders" class="button">View Order History</a>
                </div>

                <p>We apologize for any inconvenience caused. We're always here to help ensure you receive your books without any hassle.</p>
                
                <p>Thank you for choosing Mufti Shamail Books!</p>

                <div class="footer">
                    <p>This is an automated email. Please do not reply to this email.</p>
                    <p>© 2025 Mufti Shamail Books. All rights reserved.</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
};
