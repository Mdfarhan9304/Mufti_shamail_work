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
            /* Use same base styles as password reset */
            body {
                background-color: #121510;
                color: #ffffff;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.5;
                margin: 0;
                padding: 0;
            }
            /* ... other shared styles ... */
            
            /* Order-specific styles */
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
