// 💳 PAYMENT CANCEL PAGE - Página de cancelación de pago
// PROPÓSITO: Manejar cancelación de pago y opciones para el usuario

'use client';

import Link from 'next/link';

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
          <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Payment Cancelled
        </h1>

        <p className="text-gray-600 mb-6">
          Your payment has been cancelled. No charges were made to your account.
        </p>

        <div className="space-y-3">
          <Link
            href="/cart"
            className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors inline-block text-center"
          >
            Return to Cart
          </Link>

          <Link
            href="/products"
            className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors inline-block text-center"
          >
            Continue Shopping
          </Link>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-800">
                If you encountered any issues during payment, please contact our support team.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Need help?{' '}
            <Link href="/support" className="text-green-600 hover:text-green-700 font-medium">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
