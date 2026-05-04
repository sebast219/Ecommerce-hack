interface OrderConfirmationData {
  customerName: string;
  orderNumber: string;
  orderDate: string;
  items: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  trackingUrl: string;
  supportEmail: string;
}

export function renderOrderConfirmationEmail(data: OrderConfirmationData): {
  subject: string;
  html: string;
} {
  const itemsHtml = data.items
    .map(
      (item) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
            <strong>${escapeHtml(item.name)}</strong><br/>
            <span style="color: #6b7280; font-size: 14px;">Qty: ${item.quantity}</span>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
            $${item.total.toFixed(2)}
          </td>
        </tr>
      `,
    )
    .join('');

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Confirmación de Pedido</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f3f4f6;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #059669; padding: 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">
                ¡Pedido Confirmado!
              </h1>
              <p style="margin: 8px 0 0 0; color: #d1fae5; font-size: 14px;">
                Gracias por tu compra
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 16px 0; color: #111827; font-size: 16px;">
                Hola ${escapeHtml(data.customerName)},
              </p>
              <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 15px; line-height: 1.6;">
                Hemos recibido tu pedido y estamos trabajando en él. A continuación encontrarás los detalles de tu compra.
              </p>

              <!-- Order Info -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f9fafb; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td style="color: #6b7280; font-size: 13px; padding-bottom: 4px;">Número de Pedido</td>
                      </tr>
                      <tr>
                        <td style="color: #111827; font-size: 16px; font-weight: bold; font-family: monospace;">
                          ${escapeHtml(data.orderNumber)}
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #6b7280; font-size: 13px; padding-top: 12px;">Fecha del Pedido</td>
                      </tr>
                      <tr>
                        <td style="color: #111827; font-size: 14px;">
                          ${escapeHtml(data.orderDate)}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Items -->
              <h2 style="margin: 0 0 12px 0; color: #111827; font-size: 16px; font-weight: bold;">
                Artículos del Pedido
              </h2>
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                ${itemsHtml}
              </table>

              <!-- Totals -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 24px;">
                <tr>
                  <td style="padding: 8px 0; color: #4b5563; font-size: 14px;">Subtotal</td>
                  <td style="padding: 8px 0; color: #111827; font-size: 14px; text-align: right;">$${data.subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #4b5563; font-size: 14px;">Envío</td>
                  <td style="padding: 8px 0; color: #111827; font-size: 14px; text-align: right;">
                    ${data.shipping === 0 ? 'GRATIS' : `$${data.shipping.toFixed(2)}`}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #4b5563; font-size: 14px;">Impuestos</td>
                  <td style="padding: 8px 0; color: #111827; font-size: 14px; text-align: right;">$${data.tax.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding: 16px 0 8px 0; border-top: 2px solid #e5e7eb; color: #111827; font-size: 18px; font-weight: bold;">Total</td>
                  <td style="padding: 16px 0 8px 0; border-top: 2px solid #e5e7eb; color: #059669; font-size: 18px; font-weight: bold; text-align: right;">
                    $${data.total.toFixed(2)}
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 32px;">
                <tr>
                  <td align="center">
                    <a href="${escapeHtml(data.trackingUrl)}" 
                       style="display: inline-block; background-color: #059669; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">
                      Rastrear tu Pedido
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 32px 0 0 0; color: #6b7280; font-size: 13px; line-height: 1.6;">
                ¿Necesitas ayuda? Contáctanos en 
                <a href="mailto:${data.supportEmail}" style="color: #059669;">${escapeHtml(data.supportEmail)}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #6b7280; font-size: 12px;">
                © ${new Date().getFullYear()} CyberShield Tools. Todos los derechos reservados.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return {
    subject: `Confirmación de Pedido - ${data.orderNumber}`,
    html,
  };
}

function escapeHtml(unsafe: string): string {
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
