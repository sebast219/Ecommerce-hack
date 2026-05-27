'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth-store';
import { adminSettingsService, SettingsData as ApiSettingsData } from '@/lib/admin-settings-service';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  Settings,
  Menu,
  Loader2,
  Save,
  Bell,
  Shield,
  Globe,
  CreditCard,
  Mail,
  Palette,
  Database,
  CheckCircle,
  RefreshCw,
  Key,
  XCircle
} from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminSettingsPage() {
  const { user, logout } = useAuthStore();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  
  const [settings, setSettings] = useState<ApiSettingsData>({
    siteName: 'Ecommerce Hack',
    siteDescription: 'Tienda de herramientas de ciberseguridad',
    contactEmail: 'contact@ecommercehack.com',
    supportPhone: '+1234567890',
    currency: 'USD',
    timezone: 'UTC',
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
    freeShippingThreshold: 100,
    lowStockThreshold: 5,
    orderConfirmationEmail: true,
    shippingNotificationEmail: true,
    orderStatusUpdateEmail: true,
    passwordResetEmail: true,
    newsletterEmail: false,
    primaryColor: '#000000',
    secondaryColor: '#6366f1',
    logoUrl: '',
    faviconUrl: '',
  });

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      loadSettings();
    }
  }, [user]);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const response = await adminSettingsService.getAll();
      if (response.success && response.data) {
        setSettings(response.data);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      const response = await adminSettingsService.update(settings);
      if (response.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'security', label: 'Seguridad', icon: Shield },
    { id: 'payments', label: 'Pagos', icon: CreditCard },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'appearance', label: 'Apariencia', icon: Palette },
    { id: 'advanced', label: 'Avanzado', icon: Database },
  ];

  return (
    <>
      <main>
        <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8">
          {/* Header */}
          <AdminHeader
            title="Configuración"
            subtitle="Gestiona la configuración de tu tienda"
            badge="Panel de Administración"
            actions={
              <>
                {saveSuccess && (
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-xl">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Guardado exitosamente</span>
                  </div>
                )}
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 bg-zinc-900 text-white rounded-xl px-6 py-2.5 text-sm font-semibold hover:bg-zinc-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Guardar Cambios
                    </>
                  )}
                </button>
              </>
            }
          />

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Tabs Navigation */}
              <div className="lg:col-span-1">
                <div className="bg-white border border-gray-200 rounded-2xl p-4 sticky top-24">
                  <nav className="space-y-1">
                    {tabs.map((tab) => {
                      const TabIcon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                            activeTab === tab.id
                              ? 'bg-zinc-900 text-white shadow-md'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-zinc-900'
                          }`}
                        >
                          <TabIcon className="h-4 w-4" />
                          {tab.label}
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </div>

              {/* Settings Content */}
              <div className="lg:col-span-3">
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  {activeTab === 'general' && (
                    <div className="space-y-6">
                      <h2 className="text-lg font-bold text-zinc-900 mb-4">Configuración General</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Sitio</label>
                          <input
                            type="text"
                            value={settings.siteName}
                            onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email de Contacto</label>
                          <input
                            type="email"
                            value={settings.contactEmail}
                            onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono de Soporte</label>
                          <input
                            type="tel"
                            value={settings.supportPhone}
                            onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Moneda</label>
                          <select
                            value={settings.currency}
                            onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                          >
                            <option value="USD">USD - Dólar Estadounidense</option>
                            <option value="EUR">EUR - Euro</option>
                            <option value="GBP">GBP - Libra Esterlina</option>
                            <option value="MXN">MXN - Peso Mexicano</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Zona Horaria</label>
                          <select
                            value={settings.timezone}
                            onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                          >
                            <option value="UTC">UTC</option>
                            <option value="America/New_York">America/New_York</option>
                            <option value="America/Los_Angeles">America/Los_Angeles</option>
                            <option value="Europe/Madrid">Europe/Madrid</option>
                            <option value="Europe/London">Europe/London</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Idioma</label>
                          <select
                            value={settings.language}
                            onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                          >
                            <option value="es">Español</option>
                            <option value="en">English</option>
                            <option value="fr">Français</option>
                            <option value="de">Deutsch</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Descripción del Sitio</label>
                        <textarea
                          value={settings.siteDescription}
                          onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                          rows={3}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === 'security' && (
                    <div className="space-y-6">
                      <h2 className="text-lg font-bold text-zinc-900 mb-4">Configuración de Seguridad</h2>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div>
                            <div className="font-medium text-zinc-900">Modo Mantenimiento</div>
                            <div className="text-sm text-gray-500">Desactiva el sitio para mantenimiento</div>
                          </div>
                          <button
                            onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settings.maintenanceMode ? 'bg-zinc-900' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div>
                            <div className="font-medium text-zinc-900">Permitir Registro</div>
                            <div className="text-sm text-gray-500">Permite a nuevos usuarios registrarse</div>
                          </div>
                          <button
                            onClick={() => setSettings({ ...settings, allowRegistration: !settings.allowRegistration })}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settings.allowRegistration ? 'bg-zinc-900' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                settings.allowRegistration ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div>
                            <div className="font-medium text-zinc-900">Verificación de Email</div>
                            <div className="text-sm text-gray-500">Requiere verificación de email para nuevos usuarios</div>
                          </div>
                          <button
                            onClick={() => setSettings({ ...settings, requireEmailVerification: !settings.requireEmailVerification })}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settings.requireEmailVerification ? 'bg-zinc-900' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                settings.requireEmailVerification ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'payments' && (
                    <div className="space-y-6">
                      <h2 className="text-lg font-bold text-zinc-900 mb-4">Configuración de Pagos</h2>
                      
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Stripe Public Key</label>
                          <input
                            type="text"
                            value={settings.stripePublicKey}
                            onChange={(e) => setSettings({ ...settings, stripePublicKey: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent font-mono text-sm"
                            placeholder="pk_live_..."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Stripe Secret Key</label>
                          <input
                            type="password"
                            value={settings.stripeSecretKey}
                            onChange={(e) => setSettings({ ...settings, stripeSecretKey: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent font-mono text-sm"
                            placeholder="sk_live_..."
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tasa de Impuesto (%)</label>
                            <input
                              type="number"
                              value={settings.taxRate}
                              onChange={(e) => setSettings({ ...settings, taxRate: parseFloat(e.target.value) || 0 })}
                              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Costo de Envío</label>
                            <input
                              type="number"
                              value={settings.shippingCost}
                              onChange={(e) => setSettings({ ...settings, shippingCost: parseFloat(e.target.value) || 0 })}
                              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Envío Gratis Desde</label>
                            <input
                              type="number"
                              value={settings.freeShippingThreshold}
                              onChange={(e) => setSettings({ ...settings, freeShippingThreshold: parseFloat(e.target.value) || 0 })}
                              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'notifications' && (
                    <div className="space-y-6">
                      <h2 className="text-lg font-bold text-zinc-900 mb-4">Configuración de Notificaciones</h2>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div className="flex items-center gap-3">
                            <Mail className="h-5 w-5 text-gray-400" />
                            <div>
                              <div className="font-medium text-zinc-900">Notificaciones de Email</div>
                              <div className="text-sm text-gray-500">Habilitar notificaciones por email</div>
                            </div>
                          </div>
                          <button
                            onClick={() => setSettings({ ...settings, enableEmailNotifications: !settings.enableEmailNotifications })}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settings.enableEmailNotifications ? 'bg-zinc-900' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                settings.enableEmailNotifications ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div>
                            <div className="font-medium text-zinc-900">Confirmación de Pedido</div>
                            <div className="text-sm text-gray-500">Enviar email al confirmar pedido</div>
                          </div>
                          <button
                            onClick={() => setSettings({ ...settings, orderConfirmationEmail: !settings.orderConfirmationEmail })}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settings.orderConfirmationEmail ? 'bg-zinc-900' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                settings.orderConfirmationEmail ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div>
                            <div className="font-medium text-zinc-900">Notificación de Envío</div>
                            <div className="text-sm text-gray-500">Enviar email al enviar pedido</div>
                          </div>
                          <button
                            onClick={() => setSettings({ ...settings, shippingNotificationEmail: !settings.shippingNotificationEmail })}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settings.shippingNotificationEmail ? 'bg-zinc-900' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                settings.shippingNotificationEmail ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div>
                            <div className="font-medium text-zinc-900">Actualización de Estado</div>
                            <div className="text-sm text-gray-500">Enviar email al cambiar estado</div>
                          </div>
                          <button
                            onClick={() => setSettings({ ...settings, orderStatusUpdateEmail: !settings.orderStatusUpdateEmail })}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settings.orderStatusUpdateEmail ? 'bg-zinc-900' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                settings.orderStatusUpdateEmail ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div>
                            <div className="font-medium text-zinc-900">Restablecimiento de Contraseña</div>
                            <div className="text-sm text-gray-500">Enviar email de recuperación</div>
                          </div>
                          <button
                            onClick={() => setSettings({ ...settings, passwordResetEmail: !settings.passwordResetEmail })}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settings.passwordResetEmail ? 'bg-zinc-900' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                settings.passwordResetEmail ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div>
                            <div className="font-medium text-zinc-900">Newsletter</div>
                            <div className="text-sm text-gray-500">Permitir suscripción a newsletter</div>
                          </div>
                          <button
                            onClick={() => setSettings({ ...settings, newsletterEmail: !settings.newsletterEmail })}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settings.newsletterEmail ? 'bg-zinc-900' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                settings.newsletterEmail ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'appearance' && (
                    <div className="space-y-6">
                      <h2 className="text-lg font-bold text-zinc-900 mb-4">Configuración de Apariencia</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Color Primario</label>
                          <div className="flex items-center gap-3">
                            <input
                              type="color"
                              value={settings.primaryColor}
                              onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                              className="h-10 w-10 rounded-lg border border-gray-200 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={settings.primaryColor}
                              onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent font-mono text-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Color Secundario</label>
                          <div className="flex items-center gap-3">
                            <input
                              type="color"
                              value={settings.secondaryColor}
                              onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                              className="h-10 w-10 rounded-lg border border-gray-200 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={settings.secondaryColor}
                              onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent font-mono text-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">URL del Logo</label>
                          <input
                            type="url"
                            value={settings.logoUrl}
                            onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                            placeholder="https://..."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">URL del Favicon</label>
                          <input
                            type="url"
                            value={settings.faviconUrl}
                            onChange={(e) => setSettings({ ...settings, faviconUrl: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                            placeholder="https://..."
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'advanced' && (
                    <div className="space-y-6">
                      <h2 className="text-lg font-bold text-zinc-900 mb-4">Configuración Avanzada</h2>
                      
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Umbral de Stock Bajo</label>
                          <input
                            type="number"
                            value={settings.lowStockThreshold}
                            onChange={(e) => setSettings({ ...settings, lowStockThreshold: parseInt(e.target.value) || 0 })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                          />
                          <p className="text-sm text-gray-500 mt-1">Notificar cuando el stock esté por debajo de este valor</p>
                        </div>

                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                          <div className="flex items-start gap-3">
                            <Key className="h-5 w-5 text-yellow-600 mt-0.5" />
                            <div>
                              <div className="font-medium text-yellow-900">API Keys</div>
                              <div className="text-sm text-yellow-700 mt-1">
                                Las claves de API se almacenan de forma segura y se encriptan en la base de datos.
                                No compartas estas claves con terceros.
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                          <div className="flex items-start gap-3">
                            <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                            <div>
                              <div className="font-medium text-red-900">Zona de Peligro</div>
                              <div className="text-sm text-red-700 mt-1">
                                Algunas configuraciones avanzadas pueden afectar el funcionamiento del sitio.
                                Realiza cambios con precaución y siempre realiza copias de seguridad antes.
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
