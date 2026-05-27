import { useAuthStore } from '@/store/auth-store';

interface SettingsData {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  supportPhone: string;
  currency: string;
  timezone: string;
  language: string;
  enableNotifications: boolean;
  enableEmailNotifications: boolean;
  enableSmsNotifications: boolean;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  requireEmailVerification: boolean;
  stripePublicKey: string;
  stripeSecretKey: string;
  taxRate: number;
  shippingCost: number;
  freeShippingThreshold: number;
  lowStockThreshold: number;
  orderConfirmationEmail: boolean;
  shippingNotificationEmail: boolean;
  orderStatusUpdateEmail: boolean;
  passwordResetEmail: boolean;
  newsletterEmail: boolean;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
  faviconUrl: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

const DEFAULT_SETTINGS: SettingsData = {
  siteName: 'Ecommerce Hack',
  siteDescription: 'Tienda de herramientas de ciberseguridad',
  contactEmail: 'contact@ecommercehack.com',
  supportPhone: '+1 (555) 123-4567',
  currency: 'USD',
  timezone: 'America/New_York',
  language: 'es',
  enableNotifications: true,
  enableEmailNotifications: true,
  enableSmsNotifications: false,
  maintenanceMode: false,
  allowRegistration: true,
  requireEmailVerification: true,
  stripePublicKey: '',
  stripeSecretKey: '',
  taxRate: 0,
  shippingCost: 0,
  freeShippingThreshold: 0,
  lowStockThreshold: 10,
  orderConfirmationEmail: true,
  shippingNotificationEmail: true,
  orderStatusUpdateEmail: true,
  passwordResetEmail: true,
  newsletterEmail: false,
  primaryColor: '#000000',
  secondaryColor: '#6366f1',
  logoUrl: '',
  faviconUrl: '',
};

class AdminSettingsService {
  private getHeaders() {
    const { token } = useAuthStore.getState();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async getAll(): Promise<ApiResponse<SettingsData>> {
    try {
      // TODO: Replace with actual API call when backend has settings endpoints
      // const response = await fetch('/api/admin/settings', {
      //   headers: this.getHeaders(),
      // });
      // const data = await response.json();
      // return { success: true, data };

      // Simulated response for now
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true, data: DEFAULT_SETTINGS };
    } catch (error: any) {
      console.error('Error fetching settings:', error);
      return { success: false, error: error.message || 'Failed to fetch settings' };
    }
  }

  async update(settings: Partial<SettingsData>): Promise<ApiResponse<SettingsData>> {
    try {
      // TODO: Replace with actual API call when backend has settings endpoints
      // const response = await fetch('/api/admin/settings', {
      //   method: 'PUT',
      //   headers: this.getHeaders(),
      //   body: JSON.stringify(settings),
      // });
      // const data = await response.json();
      // return { success: true, data };

      // Simulated response for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      const updatedSettings = { ...DEFAULT_SETTINGS, ...settings };
      return { success: true, data: updatedSettings };
    } catch (error: any) {
      console.error('Error updating settings:', error);
      return { success: false, error: error.message || 'Failed to update settings' };
    }
  }

  async resetToDefaults(): Promise<ApiResponse<SettingsData>> {
    try {
      // TODO: Replace with actual API call when backend has settings endpoints
      // const response = await fetch('/api/admin/settings/reset', {
      //   method: 'POST',
      //   headers: this.getHeaders(),
      // });
      // const data = await response.json();
      // return { success: true, data };

      // Simulated response for now
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true, data: DEFAULT_SETTINGS };
    } catch (error: any) {
      console.error('Error resetting settings:', error);
      return { success: false, error: error.message || 'Failed to reset settings' };
    }
  }
}

export const adminSettingsService = new AdminSettingsService();
export type { SettingsData, ApiResponse };
