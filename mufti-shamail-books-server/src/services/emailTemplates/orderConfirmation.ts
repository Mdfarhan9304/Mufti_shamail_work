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
	items: Array<{ title: string; quantity: number; price: number; selectedLanguage?: string }>,
	total: number,
	subtotal?: number,
	shippingCharge?: number
) => {
	// Calculate shipping charges if not provided (₹50 per 2 books)
	const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
	const calculatedShipping = shippingCharge || Math.ceil(totalQuantity / 2) * 50;
	const calculatedSubtotal = subtotal || (total - calculatedShipping);

	return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation - Mufti Shamail Books</title>
        <style>
            body {
                background-color: #121510;
                color: #ffffff;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }
            .card {
                background-color: #191b14;
                border-radius: 16px;
                padding: 32px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                border: 1px solid #24271b;
            }
            .header {
                text-align: center;
                margin-bottom: 32px;
                border-bottom: 2px solid #c3e5a5;
                padding-bottom: 24px;
            }
            .logo {
                color: #c3e5a5;
                font-size: 28px;
                font-weight: bold;
                margin-bottom: 8px;
            }
            .tagline {
                color: #a0a0a0;
                font-size: 14px;
            }
            h1 {
                color: #c3e5a5;
                font-size: 24px;
                margin: 0 0 24px 0;
                text-align: center;
            }
            h2 {
                color: #c3e5a5;
                font-size: 18px;
                margin: 24px 0 16px 0;
                border-bottom: 1px solid #24271b;
                padding-bottom: 8px;
            }
            p {
                color: #e0e0e0;
                margin-bottom: 16px;
                font-size: 16px;
            }
            .greeting {
                font-size: 18px;
                color: #c3e5a5;
                font-weight: 500;
            }
            .order-details {
                background-color: #1a1d15;
                border-radius: 12px;
                padding: 24px;
                margin: 24px 0;
                border: 1px solid #24271b;
            }
            .detail-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
                padding: 8px 0;
            }
            .detail-row:last-child {
                margin-bottom: 0;
            }
            .detail-row.highlight {
                background-color: #24271b;
                border-radius: 8px;
                padding: 12px;
                margin: 16px 0;
            }
            .detail-row.total {
                border-top: 2px solid #c3e5a5;
                padding-top: 16px;
                margin-top: 16px;
                font-size: 18px;
                font-weight: bold;
            }
            .label {
                color: #a0a0a0;
                font-weight: 500;
            }
            .value {
                color: #ffffff;
                font-weight: 600;
            }
            .order-item {
                background-color: #24271b;
                border-radius: 8px;
                padding: 16px;
                margin-bottom: 12px;
                border-left: 4px solid #c3e5a5;
            }
            .order-item:last-child {
                margin-bottom: 0;
            }
            .item-name {
                color: #ffffff;
                font-weight: 600;
                font-size: 16px;
                margin-bottom: 8px;
            }
            .item-details {
                color: #a0a0a0;
                font-size: 14px;
            }
            .item-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 4px;
            }
            .button {
                background: linear-gradient(135deg, #c3e5a5 0%, #a1c780 100%);
                color: #191b14;
                text-decoration: none;
                padding: 14px 32px;
                border-radius: 50px;
                font-weight: 600;
                display: inline-block;
                text-align: center;
                font-size: 16px;
                box-shadow: 0 4px 16px rgba(195, 229, 165, 0.3);
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
                padding-top: 24px;
                border-top: 1px solid #24271b;
            }
            .status-badge {
                background-color: #c3e5a5;
                color: #191b14;
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                text-transform: uppercase;
            }
            @media only screen and (max-width: 600px) {
                .container {
                    padding: 10px;
                }
                .card {
                    padding: 20px;
                }
                .detail-row {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 4px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="card">
                <div class="header">
                    <div class="logo">📚 Mufti Shamail Books</div>
                    <div class="tagline">Authentic Islamic Knowledge</div>
                </div>
                
                <h1>✅ Order Confirmed!</h1>
                
                <p class="greeting">Assalamu Alaikum ${name},</p>
                <p>Jazakallahu Khair for your order! We're excited to get these valuable Islamic books to you.</p>
                
                <div class="order-details">
                    <div class="detail-row highlight">
                        <span class="label">Order Number:</span>
                        <span class="value">${orderId}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Order Date:</span>
                        <span class="value">${new Date().toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Status:</span>
                        <span class="status-badge">Processing</span>
                    </div>
                </div>

                <h2>📖 Order Items</h2>
                <div class="order-details">
                    ${items.map(item => `
                        <div class="order-item">
                            <div class="item-name">${item.title}</div>
                            <div class="item-details">
                                <div class="item-row">
                                    <span>Quantity:</span>
                                    <span>${item.quantity}</span>
                                </div>
                                ${item.selectedLanguage ? `
                                <div class="item-row">
                                    <span>Language:</span>
                                    <span>${item.selectedLanguage.charAt(0).toUpperCase() + item.selectedLanguage.slice(1)}</span>
                                </div>
                                ` : ''}
                                <div class="item-row">
                                    <span>Price:</span>
                                    <span>₹${item.price.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <h2>💰 Order Summary</h2>
                <div class="order-details">
                    <div class="detail-row">
                        <span class="label">Subtotal:</span>
                        <span class="value">₹${calculatedSubtotal.toFixed(2)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Shipping Charges:</span>
                        <span class="value">₹${calculatedShipping.toFixed(2)}</span>
                    </div>
                    <div class="detail-row total">
                        <span class="label">Total Amount:</span>
                        <span class="value">₹${total.toFixed(2)}</span>
                    </div>
                </div>
                
                <p>📦 <strong>What's next?</strong></p>
                <p>• We'll process your order within 1-2 business days<br>
                • You'll receive a shipping confirmation with tracking details<br>
                • Expected delivery: 3-7 business days</p>
                
                <div class="button-container">
                    <a href="mailto:contact@muftishamailbooks.com" class="button">Contact Support</a>
                </div>

                <div class="footer">
                    <p><strong>Barakallahu feeki for choosing Mufti Shamail Books!</strong></p>
                    <p>May these books benefit you in this life and the hereafter.</p>
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
    const hasTracking = fulfillment.trackingNumber && fulfillment.trackingNumber.trim() !== '';
    const hasProvider = fulfillment.shippingProvider && fulfillment.shippingProvider.trim() !== '';
    const hasTrackingUrl = fulfillment.trackingUrl && fulfillment.trackingUrl.trim() !== '';
    const hasEstimatedDelivery = fulfillment.estimatedDelivery;

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
                <p>As-Salamu Alaikum <strong>${orderData?.contactDetails?.name ?? "Customer"}</strong>,</p>
                <p>Alhamdulillah! Your order <strong>${orderData?.orderNumber ?? "N/A"}</strong> has been shipped and is on its way to you.</p>
                
                ${hasTracking || hasProvider || hasTrackingUrl || hasEstimatedDelivery ? `
                <div class="order-details">
                    <h3>📦 Shipping Details</h3>
                    ${hasProvider ? `
                    <div class="detail-row">
                        <span class="label">Shipping Provider:</span>
                        <span class="value">${fulfillment.shippingProvider}</span>
                    </div>
                    ` : ''}
                    ${hasTracking ? `
                    <div class="detail-row">
                        <span class="label">Tracking Number:</span>
                        <span class="value">${fulfillment.trackingNumber}</span>
                    </div>
                    ` : ''}
                    ${hasEstimatedDelivery ? `
                    <div class="detail-row">
                        <span class="label">Estimated Delivery:</span>
                        <span class="value">${new Date(fulfillment.estimatedDelivery).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</span>
                    </div>
                    ` : ''}
                    ${hasTrackingUrl ? `
                    <div class="button-container">
                        <a href="${fulfillment.trackingUrl}" class="button">🔍 Track Your Package</a>
                    </div>
                    ` : ''}
                </div>
                ` : ''}

                <div class="order-details">
                    <h3>📚 Your Order</h3>
                    ${orderData?.items?.map((item: any) => `
                        <div class="detail-row">
                            <span class="label">${item?.book?.name || "Book"}</span>
                            <span class="value">Qty: ${item?.quantity ?? 1}${item?.selectedLanguage ? ` (${item.selectedLanguage.charAt(0).toUpperCase() + item.selectedLanguage.slice(1)})` : ''} × ₹${item?.price ?? 0}</span>
                        </div>
                    `).join('')}
                    <div class="detail-row total">
                        <span class="label"><strong>Total Amount</strong></span>
                        <span class="value"><strong>₹${orderData?.amount ?? 0}</strong></span>
                    </div>
                </div>

                <p>📱 <strong>Stay Updated:</strong></p>
                <p>• You'll receive updates as your package moves through our delivery network<br>
                • Keep an eye out for delivery notifications<br>
                • Someone should be available to receive the package</p>

                <div class="button-container">
                    <a href="mailto:support@muftishamailbooks.com" class="button">Contact Support</a>
                </div>

                <div class="footer">
                    <p><strong>Jazakallahu Khair for your patience!</strong></p>
                    <p>May Allah bless you and may these books be a source of beneficial knowledge.</p>
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
    const hasTracking = fulfillment.trackingNumber && fulfillment.trackingNumber.trim() !== '';
    const hasDeliveryDate = fulfillment.deliveredAt;

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
                <h1>🎉 Order Delivered Successfully!</h1>
                <p>As-Salamu Alaikum <strong>${orderData?.contactDetails?.name ?? "Customer"}</strong>,</p>
                <p>Alhamdulillah! Your order <strong>${orderData?.orderNumber ?? "N/A"}</strong> has been successfully delivered. We hope you're excited to dive into these beneficial books!</p>
                
                ${hasDeliveryDate || hasTracking ? `
                <div class="order-details">
                    <h3>📦 Delivery Information</h3>
                    ${hasDeliveryDate ? `
                    <div class="detail-row">
                        <span class="label">Delivered On:</span>
                        <span class="value">${new Date(fulfillment.deliveredAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}</span>
                    </div>
                    ` : ''}
                    ${hasTracking ? `
                    <div class="detail-row">
                        <span class="label">Tracking Number:</span>
                        <span class="value">${fulfillment.trackingNumber}</span>
                    </div>
                    ` : ''}
                </div>
                ` : ''}

                <div class="order-details">
                    <h3>📚 Your Delivered Books</h3>
                    ${orderData?.items?.map((item: any) => `
                        <div class="detail-row">
                            <span class="label">${item?.book?.name || "Book"}</span>
                            <span class="value">Qty: ${item?.quantity ?? 1}${item?.selectedLanguage ? ` (${item.selectedLanguage.charAt(0).toUpperCase() + item.selectedLanguage.slice(1)})` : ''}</span>
                        </div>
                    `).join('')}
                </div>

                <div class="order-details" style="text-align: center; font-style: italic; color: #c3e5a5; background: linear-gradient(135deg, #1a1d15 0%, #24271b 100%); border: 1px solid #c3e5a5;">
                    <h3>🤲 Dua for Beneficial Knowledge</h3>
                    <p style="font-size: 18px; margin: 16px 0;">اللهم انفعني بما علمتني وعلمني ما ينفعني</p>
                    <p style="font-size: 14px; color: #a0a0a0; margin: 0;">
                        "O Allah, benefit me with what You have taught me, and teach me what will benefit me."
                    </p>
                </div>

                <p>💝 <strong>What's Next?</strong></p>
                <p>• Enjoy reading these valuable Islamic books<br>
                • Share the knowledge with family and friends<br>
                • Feel free to reach out if you have any questions</p>

                <div class="button-container">
                    <a href="mailto:contact@muftishamailbooks.com" class="button">Share Feedback</a>
                </div>

                <div class="footer">
                    <p><strong>Barakallahu feeki for choosing Mufti Shamail Books!</strong></p>
                    <p>May Allah make these books a source of continuous reward (Sadaqah Jariyah) for you.</p>
                    <p>© ${new Date().getFullYear()} Mufti Shamail Books. All rights reserved.</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
};

export const createRTOTemplate = (orderData: any) => {
    const fulfillment = orderData?.fulfillment || {};
    const hasTracking = fulfillment.trackingNumber && fulfillment.trackingNumber.trim() !== '';

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Delivery Update Required - Mufti Shamail Books</title>
        ${emailStyles}
    </head>
    <body>
        <div class="container">
            <div class="card">
                <div class="logo">📋 Mufti Shamail Books</div>
                <h1 style="color: #fbbf24;">📞 Unable to Complete Delivery</h1>
                <p>As-Salamu Alaikum <strong>${orderData?.contactDetails?.name ?? "Customer"}</strong>,</p>
                <p>We hope this message finds you in good health. We're writing regarding your order <strong>${orderData?.orderNumber ?? "N/A"}</strong>.</p>
                
                <div class="order-details">
                    <div class="detail-row" style="background-color: #451a03; border-radius: 8px; padding: 16px; border-left: 4px solid #fbbf24;">
                        <div style="color: #fbbf24; font-weight: 600; margin-bottom: 8px;">⚠️ Delivery Attempt Failed</div>
                        <div style="color: #e0e0e0; font-size: 14px;">Our courier partner was unable to deliver your package at the provided address.</div>
                    </div>
                </div>

                <div class="order-details">
                    <h3>📦 Order Details</h3>
                    <div class="detail-row">
                        <span class="label">Order Number:</span>
                        <span class="value">${orderData?.orderNumber ?? "N/A"}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Attempted Delivery:</span>
                        <span class="value">${new Date().toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</span>
                    </div>
                    ${hasTracking ? `
                    <div class="detail-row">
                        <span class="label">Tracking Number:</span>
                        <span class="value">${fulfillment.trackingNumber}</span>
                    </div>
                    ` : ''}
                    <div class="detail-row">
                        <span class="label">Status:</span>
                        <span style="background-color: #fbbf24; color: #451a03; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase;">Return to Origin</span>
                    </div>
                </div>

                <div class="order-details">
                    <h3>❓ Common Reasons for Delivery Failure</h3>
                    <ul style="color: #e0e0e0; margin: 16px 0; padding-left: 20px; line-height: 1.8;">
                        <li>No one available to receive the package</li>
                        <li>Incorrect or incomplete address information</li>
                        <li>Unable to contact via provided phone number</li>
                        <li>Access restrictions to the delivery location</li>
                        <li>Package requires signature but recipient unavailable</li>
                    </ul>
                </div>

                <div class="order-details">
                    <h3>📚 Your Order Items</h3>
                    ${orderData?.items?.map((item: any) => `
                        <div class="detail-row">
                            <span class="label">${item?.book?.name || "Book"}</span>
                            <span class="value">Qty: ${item?.quantity ?? 1}${item?.selectedLanguage ? ` (${item.selectedLanguage.charAt(0).toUpperCase() + item.selectedLanguage.slice(1)})` : ''}</span>
                        </div>
                    `).join('')}
                    <div class="detail-row total">
                        <span class="label"><strong>Order Value</strong></span>
                        <span class="value"><strong>₹${orderData?.amount ?? 0}</strong></span>
                    </div>
                </div>

                <div class="order-details" style="background: linear-gradient(135deg, #c3e5a5 0%, #a1c780 100%); color: #191b14; border: none;">
                    <h3 style="color: #191b14; margin-top: 0;">🔄 Next Steps - Please Act Within 7 Days</h3>
                    <p style="color: #191b14; font-weight: 600; margin-bottom: 16px;">We want to ensure you receive your Islamic books! Please contact us to:</p>
                    <ul style="color: #191b14; margin: 16px 0; padding-left: 20px; line-height: 1.8;">
                        <li><strong>Confirm or update your delivery address</strong></li>
                        <li><strong>Schedule a convenient delivery time</strong></li>
                        <li><strong>Arrange for alternative delivery options</strong></li>
                        <li><strong>Process a refund if preferred</strong></li>
                    </ul>
                </div>

                <div class="button-container">
                    <a href="mailto:contact@muftishamailbooks.com?subject=Redelivery Request - Order ${orderData?.orderNumber ?? "N/A"}" class="button">📧 Request Redelivery</a>
                </div>

                <div class="order-details">
                    <h3>📞 Contact Information</h3>
                    <div class="detail-row">
                        <span class="label">Email:</span>
                        <span class="value">contact@muftishamailbooks.com</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Response Time:</span>
                        <span class="value">Within 24 hours</span>
                    </div>
                    <p style="color: #c3e5a5; text-align: center; margin-top: 16px;">
                        We're here to help ensure you receive your beneficial Islamic knowledge!
                    </p>
                </div>

                <div class="footer">
                    <p><strong>Jazakallahu Khair for your patience and understanding.</strong></p>
                    <p>May Allah make it easy for us to get these valuable books to you.</p>
                    <p>© ${new Date().getFullYear()} Mufti Shamail Books. All rights reserved.</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
};
