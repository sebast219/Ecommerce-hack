import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Checkout - Hack 6',
  description: 'Finaliza tu compra de herramientas de ciberseguridad',
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
