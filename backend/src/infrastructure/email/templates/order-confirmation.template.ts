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
  shippingAddress?: string;
  estimatedDelivery?: string;
}

// ─── DESIGN TOKENS (from your ecommerce design system) ───
const DESIGN = {
  colors: {
    background: '#fafafa',      // Warm off-white (matches your site bg)
    surface: '#ffffff',          // Card backgrounds
    surfaceAlt: '#f5f5f5',       // Secondary surfaces
    primary: '#000000',          // Primary text
    secondary: '#4a4a4a',        // Secondary text (improved contrast from #666666)
    muted: '#737373',            // Muted text (improved contrast from #888888)
    accent: '#000000',           // CTA buttons (black, consistent with your site)
    border: '#e5e5e5',           // Subtle borders
    borderStrong: '#000000',     // Strong borders for emphasis
    success: '#000000',          // Success states (using your monochrome palette)
    focus: '#000000',            // Focus ring color
  },
  typography: {
    fontStack: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    mono: "'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'Courier New', monospace",
    trackingTight: '-0.03em',    // Editorial tight tracking for headings
    trackingWide: '0.05em',      // Uppercase labels
    leadingTight: '0.92',        // Tight line-height for display text
    leadingNormal: '1.6',        // Body text
  },
  spacing: {
    xs: '8px',
    sm: '16px',
    md: '24px',
    lg: '32px',
    xl: '48px',
    xxl: '64px',
  },
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
  }
} as const;

export function renderOrderConfirmationEmail(data: OrderConfirmationData): {
  subject: string;
  html: string;
  text: string;
} {
  const itemsHtml = data.items
    .map(
      (item) => `
        <tr>
          <td style="padding: 20px 0; border-bottom: 1px solid ${DESIGN.colors.border};">
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td>
                  <strong style="color: ${DESIGN.colors.primary}; font-size: 15px; font-weight: 600; letter-spacing: ${DESIGN.typography.trackingTight}; display: block; margin-bottom: 4px;">
                    ${escapeHtml(item.name)}
                  </strong>
                  <span style="color: ${DESIGN.colors.muted}; font-size: 13px; font-family: ${DESIGN.typography.mono};">
                    Qty: ${item.quantity} × $${item.unitPrice.toFixed(2)}
                  </span>
                </td>
                <td style="text-align: right; vertical-align: top;">
                  <span style="color: ${DESIGN.colors.primary}; font-size: 15px; font-weight: 600; font-family: ${DESIGN.typography.mono};">
                    $${item.total.toFixed(2)}
                  </span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      `,
    )
    .join('');

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>Confirmación de Pedido - HAK6</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; padding: 20px 16px !important; }
      .hide-mobile { display: none !important; }
      .mobile-stack { display: block !important; width: 100% !important; }
      .mobile-center { text-align: center !important; }
      .mobile-padding { padding: 24px 20px !important; }
      .mobile-no-border { border-left: none !important; border-top: 1px solid #e5e5e5 !important; padding-top: 16px !important; padding-left: 0 !important; }
      .mobile-full-width { width: 100% !important; }
    }
    /* Improve button accessibility */
    .cta-button:hover {
      background-color: #1a1a1a !important;
      transform: scale(1.02) !important;
    }
    .cta-button:focus {
      outline: 3px solid #000000 !important;
      outline-offset: 2px !important;
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: ${DESIGN.colors.background}; font-family: ${DESIGN.typography.fontStack}; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
  
  <!-- Ambient Glow Effect (subtle top gradient) -->
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: linear-gradient(180deg, #f0f0f0 0%, ${DESIGN.colors.background} 100%);">
    <tr>
      <td align="center" style="padding: 64px 20px 48px;">
        
        <!-- Main Container -->
        <table class="container" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; width: 100%; background-color: ${DESIGN.colors.surface}; border-radius: ${DESIGN.borderRadius.lg}; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06);">
          
          <!-- Header: Editorial Style -->
          <tr>
            <td style="padding: 48px 40px 32px; text-align: center; border-bottom: 1px solid ${DESIGN.colors.border};">
              <!-- Brand Mark -->
              <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto 24px;">
                <tr>
                  <td style="width: 48px; height: 48px; background-color: ${DESIGN.colors.primary}; border-radius: 12px; text-align: center; vertical-align: middle;">
                    <span style="color: #ffffff; font-size: 24px;">🛡️</span>
                  </td>
                </tr>
              </table>
              
              <!-- Label: Uppercase tracking (consistent with hero.tsx line 56, but fixed) -->
              <p style="margin: 0 0 12px 0; color: ${DESIGN.colors.muted}; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: ${DESIGN.typography.trackingWide};">
                Confirmación de Compra
              </p>
              
              <!-- Display Heading: Editorial typography -->
              <h1 style="margin: 0; color: ${DESIGN.colors.primary}; font-size: 42px; font-weight: 700; letter-spacing: ${DESIGN.typography.trackingTight}; line-height: ${DESIGN.typography.leadingTight}; text-transform: none;">
                Pedido<br/>Confirmado
              </h1>
              
              <p style="margin: 16px 0 0 0; color: ${DESIGN.colors.secondary}; font-size: 15px; line-height: ${DESIGN.typography.leadingNormal}; max-width: 360px; margin-left: auto; margin-right: auto;">
                Tu compra de herramientas de ciberseguridad ha sido procesada exitosamente.
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td class="mobile-padding" style="padding: 40px;">
              
              <!-- Greeting -->
              <p style="margin: 0 0 32px 0; color: ${DESIGN.colors.primary}; font-size: 16px; font-weight: 500; line-height: 1.5;">
                Hola <strong style="font-weight: 600;">${escapeHtml(data.customerName)}</strong>,
              </p>

              <!-- Order Info Card: Consistent spacing (fixed from audit issue #6) -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: ${DESIGN.colors.surfaceAlt}; border-radius: ${DESIGN.borderRadius.sm}; margin-bottom: 32px; border: 1px solid ${DESIGN.colors.border};">
                <tr>
                  <td style="padding: 24px;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <!-- Order Number -->
                        <td class="mobile-stack" style="width: 50%; padding-right: 16px; vertical-align: top;">
                          <p style="margin: 0 0 6px 0; color: ${DESIGN.colors.muted}; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: ${DESIGN.typography.trackingWide};">
                            Número de Pedido
                          </p>
                          <p style="margin: 0; color: ${DESIGN.colors.primary}; font-size: 20px; font-weight: 700; font-family: ${DESIGN.typography.mono}; letter-spacing: 0.5px;">
                            ${escapeHtml(data.orderNumber)}
                          </p>
                        </td>
                        <!-- Order Date -->
                        <td class="mobile-stack mobile-no-border" style="width: 50%; padding-left: 16px; vertical-align: top; border-left: 1px solid ${DESIGN.colors.border};">
                          <p style="margin: 0 0 6px 0; color: ${DESIGN.colors.muted}; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: ${DESIGN.typography.trackingWide};">
                            Fecha
                          </p>
                          <p style="margin: 0; color: ${DESIGN.colors.primary}; font-size: 16px; font-weight: 500;">
                            ${escapeHtml(data.orderDate)}
                          </p>
                        </td>
                      </tr>
                      ${data.estimatedDelivery ? `
                      <tr>
                        <td colspan="2" style="padding-top: 16px; border-top: 1px solid ${DESIGN.colors.border};">
                          <p style="margin: 0 0 6px 0; color: ${DESIGN.colors.muted}; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: ${DESIGN.typography.trackingWide};">
                            Entrega Estimada
                          </p>
                          <p style="margin: 0; color: ${DESIGN.colors.primary}; font-size: 16px; font-weight: 500;">
                            ${escapeHtml(data.estimatedDelivery)}
                          </p>
                        </td>
                      </tr>
                      ` : ''}
                    </table>
                  </td>
                </tr>
              </table>

              ${data.shippingAddress ? `
              <!-- Shipping Address Card -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: ${DESIGN.colors.surfaceAlt}; border-radius: ${DESIGN.borderRadius.sm}; margin-bottom: 32px; border: 1px solid ${DESIGN.colors.border};">
                <tr>
                  <td style="padding: 24px;">
                    <p style="margin: 0 0 12px 0; color: ${DESIGN.colors.muted}; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: ${DESIGN.typography.trackingWide};">
                      Dirección de Envío
                    </p>
                    <p style="margin: 0; color: ${DESIGN.colors.primary}; font-size: 14px; line-height: 1.6;">
                      ${escapeHtml(data.shippingAddress)}
                    </p>
                  </td>
                </tr>
              </table>
              ` : ''}

              <!-- Section Label -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 16px;">
                <tr>
                  <td>
                    <p style="margin: 0; color: ${DESIGN.colors.muted}; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: ${DESIGN.typography.trackingWide};">
                      Artículos del Pedido
                    </p>
                  </td>
                  <td style="text-align: right;">
                    <p style="margin: 0; color: ${DESIGN.colors.muted}; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: ${DESIGN.typography.trackingWide};">
                      ${data.items.length} ${data.items.length === 1 ? 'item' : 'items'}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Items List -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 32px;">
                ${itemsHtml}
              </table>

              <!-- Divider -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 24px;">
                <tr>
                  <td style="border-top: 2px solid ${DESIGN.colors.primary};"></td>
                </tr>
              </table>

              <!-- Totals: Clean monospace alignment -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 8px;">
                <tr>
                  <td style="padding: 8px 0; color: ${DESIGN.colors.secondary}; font-size: 14px;">Subtotal</td>
                  <td style="padding: 8px 0; color: ${DESIGN.colors.primary}; font-size: 14px; text-align: right; font-family: ${DESIGN.typography.mono};">$${data.subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: ${DESIGN.colors.secondary}; font-size: 14px;">Envío</td>
                  <td style="padding: 8px 0; text-align: right; font-family: ${DESIGN.typography.mono};">
                    ${data.shipping === 0 
                      ? `<span style="color: ${DESIGN.colors.primary}; font-size: 14px; font-weight: 600;">GRATIS</span>` 
                      : `<span style="color: ${DESIGN.colors.primary}; font-size: 14px;">$${data.shipping.toFixed(2)}</span>`
                    }
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: ${DESIGN.colors.secondary}; font-size: 14px;">Impuestos</td>
                  <td style="padding: 8px 0; color: ${DESIGN.colors.primary}; font-size: 14px; text-align: right; font-family: ${DESIGN.typography.mono};">$${data.tax.toFixed(2)}</td>
                </tr>
              </table>

              <!-- Total Row -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-top: 2px solid ${DESIGN.colors.border}; margin-bottom: 40px;">
                <tr>
                  <td style="padding: 20px 0 8px 0; color: ${DESIGN.colors.primary}; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: ${DESIGN.typography.trackingWide};">Total</td>
                  <td style="padding: 20px 0 8px 0; color: ${DESIGN.colors.primary}; font-size: 28px; font-weight: 700; text-align: right; font-family: ${DESIGN.typography.mono}; letter-spacing: -0.02em;">
                    $${data.total.toFixed(2)}
                  </td>
                </tr>
              </table>

              <!-- CTA Button: Consistent with your site button system (fixed audit issue #6) -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 32px;">
                <tr>
                  <td align="center">
                    <a href="${escapeHtml(data.trackingUrl)}"
                       class="cta-button"
                       style="display: inline-block; background-color: ${DESIGN.colors.primary}; color: #ffffff; padding: 16px 40px; border-radius: ${DESIGN.borderRadius.sm}; text-decoration: none; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: ${DESIGN.typography.trackingWide}; transition: all 0.2s ease; border: 2px solid ${DESIGN.colors.primary};">
                      Rastrear Pedido
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Secondary CTA: View Order Details -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 32px;">
                <tr>
                  <td align="center">
                    <a href="${escapeHtml(data.trackingUrl)}"
                       style="display: inline-block; color: ${DESIGN.colors.primary}; padding: 12px 24px; border-radius: ${DESIGN.borderRadius.sm}; text-decoration: none; font-weight: 500; font-size: 13px; text-transform: uppercase; letter-spacing: ${DESIGN.typography.trackingWide}; border: 1px solid ${DESIGN.colors.border}; transition: all 0.2s ease;">
                      Ver Detalles del Pedido
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Support -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-top: 1px solid ${DESIGN.colors.border}; padding-top: 24px;">
                <tr>
                  <td style="text-align: center;">
                    <p style="margin: 0; color: ${DESIGN.colors.secondary}; font-size: 14px; line-height: 1.6;">
                      ¿Necesitas ayuda? Escríbenos a<br/>
                      <a href="mailto:${escapeHtml(data.supportEmail)}" style="color: ${DESIGN.colors.primary}; text-decoration: none; font-weight: 600; border-bottom: 1px solid ${DESIGN.colors.border};">
                        ${escapeHtml(data.supportEmail)}
                      </a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: ${DESIGN.colors.surfaceAlt}; padding: 32px 40px; text-align: center; border-top: 1px solid ${DESIGN.colors.border};">
              <p style="margin: 0 0 8px 0; color: ${DESIGN.colors.muted}; font-size: 13px; font-weight: 600; letter-spacing: ${DESIGN.typography.trackingTight};">
                HAK6
              </p>
              <p style="margin: 0 0 4px 0; color: ${DESIGN.colors.muted}; font-size: 12px;">
                Herramientas de Ciberseguridad
              </p>
              <p style="margin: 0; color: ${DESIGN.colors.muted}; font-size: 11px; opacity: 0.7;">
                © ${new Date().getFullYear()} Todos los derechos reservados
              </p>
            </td>
          </tr>
        </table>
        
        <!-- Bottom spacing -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td style="padding: 32px 0;">
              <p style="margin: 0; text-align: center; color: ${DESIGN.colors.muted}; font-size: 11px; opacity: 0.5;">
                Este es un correo automático, por favor no respondas a esta dirección.
              </p>
            </td>
          </tr>
        </table>
        
      </td>
    </tr>
  </table>
</body>
</html>`;

  // Generate plain text version for accessibility
  const text = `HAK6 - Pedido Confirmado: ${data.orderNumber}

Hola ${data.customerName},

Tu pedido ha sido procesado exitosamente.

Número de Pedido: ${data.orderNumber}
Fecha: ${data.orderDate}
${data.estimatedDelivery ? `Entrega Estimada: ${data.estimatedDelivery}
` : ''}

Artículos del Pedido:
${data.items.map(item => `- ${item.name} (Qty: ${item.quantity}) - $${item.total.toFixed(2)}`).join('\n')}

Subtotal: $${data.subtotal.toFixed(2)}
Envío: ${data.shipping === 0 ? 'GRATIS' : `$${data.shipping.toFixed(2)}`}
Impuestos: $${data.tax.toFixed(2)}
Total: $${data.total.toFixed(2)}

Rastrea tu pedido aquí: ${data.trackingUrl}

¿Necesitas ayuda? Contáctanos en ${data.supportEmail}

© ${new Date().getFullYear()} HAK6 - Herramientas de Ciberseguridad
Todos los derechos reservados`;

  return {
    subject: `HAK6 — Pedido Confirmado: ${data.orderNumber}`,
    html,
    text,
  };
}

// ─── SECURITY: XSS Prevention ───
function escapeHtml(unsafe: string): string {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}