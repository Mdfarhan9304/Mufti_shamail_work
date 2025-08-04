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
            color: #c3e5a5;
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
        .detail-row.total {
            border-top: 1px solid #c3e5a5;
            padding-top: 12px;
            margin-top: 12px;
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
    </style>
`;

export const createOrderConfirmationTemplate = (
	name: string,
	orderId: string,
	items: Array<{ title: string; quantity: number; price: number }>,
	total: number
) => {
	return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
        <style>
            body {
                background-color: #121510;
                color: #ffffff;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.5;
                margin: 0;
                padding: 0;
            }
            .order-items {
                margin: 20px 0;
                border-top: 1px solid #24271b;
                padding-top: 20px;
            }
            .order-item {
                display: flex;
                justify-content: space-between;
                padding: 10px 0;
                border-bottom: 1px solid #24271b;
            }
            .total {
                margin-top: 20px;
                font-size: 1.2em;
                color: #c3e5a5;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="card">
                <div class="logo">Mufti Shamail Books</div>
                <h1>Order Confirmation</h1>
                <p>Hi ${name},</p>
                <p>Thank you for your order! Your order ID is: ${orderId}</p>
                
                <div class="order-items">
                    ${items
						.map(
							(item) => `
                        <div class="order-item">
                            <span>${item.title} x${item.quantity}</span>
                            <span>₹${item.price}</span>
                        </div>
                    `
						)
						.join("")}
                    <div class="total">
                        <strong>Total: ₹${total}</strong>
                    </div>
                </div>
                
                <p>We'll notify you when your order ships.</p>
                
                <div class="footer">
                    <p>© ${new Date().getFullYear()} Mufti Shamail Books. All rights reserved.</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
};

export const createOrderShippedTemplate = (orderData: any) => {
    const fulfillment = orderData?.fulfillment || {};
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Order Has Been Shipped!</title>
        ${emailStyles}
    </head>
    <body>
        <div class="container">
            <div class="card">
                <div class="logo">📦 Mufti Shamail Books</div>
                <h1>Your Order Has Been Shipped!</h1>
                <p>Hi <strong>${orderData?.contactDetails?.name ?? "Customer"}</strong>,</p>
                <p>Great news! Your order <strong>${orderData?.orderNumber ?? "N/A"}</strong> has been shipped and is on its way to you.</p>
                
                <div class="order-details">
            
                    <h3>Shipping Details</h3>
                    <div class="detail-row">
                        <span class="label">Tracking Number:</span>
                        <span class="value">${fulfillment.trackingNumber ?? 'N/A'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Shipping Provider:</span>
                        <span class="value">${fulfillment.shippingProvider ?? 'N/A'}</span>
                    </div>
                    ${
                        fulfillment.trackingUrl
                            ? `<div class="button-container">
                        <a href="${fulfillment.trackingUrl}" class="button">Track Your Package</a>
                    </div>`
                            : ""
                    }
                    ${
                        fulfillment.estimatedDelivery
                            ? `<div class="detail-row">
                        <span class="label">Estimated Delivery:</span>
                        <span class="value">${new Date(
                            fulfillment.estimatedDelivery
                        ).toLocaleDateString()}</span>
                    </div>`
                            : ""
                    }
                </div>

                <div class="order-details">
                    <h3>Order Summary</h3>
                    ${orderData?.items?.map((item: any) => `
                        <div class="detail-row">
                            <span class="label">${item?.book?.title ?? "Untitled Book"}</span>
                            <span class="value">Qty: ${item?.quantity ?? 0} × ₹${item?.price ?? 0}</span>
                        </div>
                    `).join('')}
                    <div class="detail-row total">
                        <span class="label"><strong>Total Amount</strong></span>
                        <span class="value"><strong>₹${orderData?.amount ?? 0}</strong></span>
                    </div>
                </div>

                <div class="footer">
                    <p>Thank you for shopping with us!</p>
                    <p>© ${new Date().getFullYear()} Mufti Shamail Books. All rights reserved.</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
};

export const createOrderDeliveredTemplate = (orderData: any) => {
    const fulfillment = orderData?.fulfillment || {};
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Delivered Successfully!</title>
        ${emailStyles}
    </head>
    <body>
        <div class="container">
            <div class="card">
                <div class="logo">✅ Mufti Shamail Books</div>
                <h1>Order Delivered Successfully!</h1>
                <p>Hi <strong>${orderData?.contactDetails?.name ?? "Customer"}</strong>,</p>
                <p>Wonderful! Your order <strong>${orderData?.orderNumber ?? "N/A"}</strong> has been successfully delivered.</p>
                
                <div class="order-details">
                    <h3>Delivery Information</h3>
                    <div class="detail-row">
                        <span class="label">Delivered On:</span>
                        <span class="value">${fulfillment.deliveredAt ? new Date(fulfillment.deliveredAt).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Tracking Number:</span>
                        <span class="value">${fulfillment.trackingNumber ?? 'N/A'}</span>
                    </div>
                </div>

                <div class="order-details">
                    <h3>Your Order</h3>
                    ${orderData?.items?.map((item: any) => `
                        <div class="detail-row">
                            <span class="label">${item?.book?.title ?? "Untitled Book"}</span>
                            <span class="value">Qty: ${item?.quantity ?? 0}</span>
                        </div>
                    `).join('')}
                </div>

                <p>We hope you enjoy your books! If you have any questions or concerns about your order, please don't hesitate to contact us.</p>
                
                <div class="button-container">
                    <a href="mailto:support@muftishamailbooks.com" class="button">Contact Support</a>
                </div>

                <div class="footer">
                    <p>Thank you for choosing Mufti Shamail Books!</p>
                    <p>© ${new Date().getFullYear()} Mufti Shamail Books. All rights reserved.</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
};
