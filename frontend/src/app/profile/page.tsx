'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  User,
  Mail,
  Package,
  Settings,
  LogOut,
  Edit3,
  Shield,
  ChevronRight,
  Clock,
  MapPin,
  CreditCard,
  Bell,
  Lock,
  X,
  Check,
  Eye,
  EyeOff,
  Trash2,
  Camera,
  FileImage,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { apiClient } from '@/lib/api-client';
import { isAdmin } from '@/types/auth';
import { getAvatarUrl } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Order {
  id: string;
  date: string;
  status: 'completed' | 'processing' | 'shipped';
  total: number;
  items: number;
  orderItems?: Array<{
    id: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      name: string;
      slug: string;
      images: string[];
    };
  }>;
}

// Helper function to format dates
const formatDate = (date: any): string => {
  // Handle empty objects and other invalid cases
  if (!date || 
      date === null || 
      (typeof date === 'object' && Object.keys(date).length === 0)) {
    return 'Sin fecha';
  }
  
  try {
    // If it's already a string, return as is
    if (typeof date === 'string') {
      return date;
    }
    
    // If it's a Date object, use it directly
    if (date instanceof Date) {
      if (isNaN(date.getTime())) {
        return 'Sin fecha';
      }
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
    
    // If it's a string that looks like a date, try to parse it
    if (typeof date === 'string') {
      const parsed = new Date(date);
      if (!isNaN(parsed.getTime())) {
        return parsed.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      }
      return date; // Return as-is if it's not parseable
    }
    
    // Try to convert to Date object
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return 'Sin fecha';
    }
    
    // Format as readable date
    return dateObj.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    return 'Sin fecha';
  }
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, isAuthenticated, token, setUser, isHydrated } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'settings'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Avatar states
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    getAvatarUrl(user?.avatar)
  );
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Payment modal states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardType, setCardType] = useState<'visa' | 'mastercard' | 'amex' | null>(null);
  const [bank, setBank] = useState<'bancolombia' | 'amex' | 'davivienda' | 'generic' | null>(null);
  const [savingCard, setSavingCard] = useState(false);
  const [savedCards, setSavedCards] = useState<Array<{ id: string; last4: string; brand: string; expiry: string; bank: string }>>([]);

  // Password modal states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Notifications state - will be updated with user data
  const [notifications, setNotifications] = useState([
    { id: 'orders', label: 'Pedidos y envíos', desc: 'Actualizaciones sobre tus compras', enabled: true },
    { id: 'promos', label: 'Promociones', desc: 'Ofertas especiales y nuevos productos', enabled: false },
    { id: 'security', label: 'Seguridad', desc: 'Alertas de inicio de sesión', enabled: true },
  ]);

  const toggleNotification = (id: string) => {
    setNotifications(prev => prev.map(item =>
      item.id === id ? { ...item, enabled: !item.enabled } : item
    ));
  };
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressLabel, setAddressLabel] = useState('');
  const [addressStreet, setAddressStreet] = useState('');
  const [addressCity, setAddressCity] = useState('');
  const [addressState, setAddressState] = useState('');
  const [addressZip, setAddressZip] = useState('');
  const [addressPhone, setAddressPhone] = useState('');
  const [gettingLocation, setGettingLocation] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [addressError, setAddressError] = useState('');
  const [savedAddresses, setSavedAddresses] = useState<Array<{ id: string; label: string; street: string; city: string; state: string; zip: string; phone: string }>>([]);

  // Load saved addresses and cards on mount
  useEffect(() => {
    if (isAuthenticated) {
      // Load addresses
      apiClient.get('/users/addresses')
        .then(response => {
          const addressesData = (response.data as any)?.data || response.data;
          
          if (Array.isArray(addressesData)) {
            setSavedAddresses(addressesData.map((addr: any) => ({
              id: addr.id,
              label: addr.label,
              street: addr.street,
              city: addr.city,
              state: addr.state,
              zip: addr.zipCode,
              phone: addr.phone,
            })));
          } else if (addressesData && typeof addressesData === 'object' && addressesData.id) {
            setSavedAddresses([{
              id: addressesData.id,
              label: addressesData.label,
              street: addressesData.street,
              city: addressesData.city,
              state: addressesData.state,
              zip: addressesData.zipCode,
              phone: addressesData.phone,
            }]);
          }
        })
        .catch(err => {
          console.error('Error loading addresses:', err);
        });

      // Load payment methods
      apiClient.get('/users/payment-methods')
        .then(response => {
          const cardsData = (response.data as any)?.data || response.data;
          
          if (Array.isArray(cardsData)) {
            setSavedCards(cardsData.map((pm: any) => ({
              id: pm.id,
              last4: pm.last4,
              brand: pm.brand,
              expiry: `${pm.expiryMonth}/${pm.expiryYear}`,
              bank: pm.bank || 'generic',
            })));
          } else if (cardsData && typeof cardsData === 'object' && cardsData.id) {
            setSavedCards([{
              id: cardsData.id,
              last4: cardsData.last4,
              brand: cardsData.brand,
              expiry: `${cardsData.expiryMonth}/${cardsData.expiryYear}`,
              bank: cardsData.bank || 'generic',
            }]);
          }
        })
        .catch(err => {
          console.error('Error loading payment methods:', err);
        });
    }
  }, [isAuthenticated]);

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Load orders
  useEffect(() => {
    if (isAuthenticated) {
      setOrdersLoading(true);
      apiClient.get('/orders?limit=50')
        .then(response => {
          const ordersData = (response.data as any)?.data || response.data;
          if (Array.isArray(ordersData)) {
            setOrders(ordersData.map((order: any) => ({
              id: order.id || `ORD-${order.id}`,
              date: formatDate(order.createdAt || order.date),
              status: order.status || 'processing',
              total: Number(order.total) || 0,
              items: order.items?.length || order.itemCount || 1,
              orderItems: order.items?.map((item: any) => ({
                id: item.id,
                quantity: item.quantity,
                price: Number(item.price) || 0,
                product: {
                  id: item.product?.id,
                  name: item.product?.name || 'Producto',
                  slug: item.product?.slug || '',
                  images: Array.isArray(item.product?.images) ? item.product.images : [item.product?.images].filter(Boolean),
                },
              })) || [],
            })));
          }
        })
        .catch(err => {
          console.error('Error loading orders:', err);
        })
        .finally(() => {
          setOrdersLoading(false);
        });
    }
  }, [isAuthenticated]);

  // Update notifications when user data or orders change
  useEffect(() => {
    if (user && orders) {
      setNotifications(prev => [
        {
          id: 'orders',
          label: 'Pedidos y envíos',
          desc: `Actualizaciones sobre tus ${orders.length} pedido${orders.length !== 1 ? 's' : ''}`,
          enabled: prev.find(n => n.id === 'orders')?.enabled ?? true
        },
        {
          id: 'promos',
          label: 'Promociones',
          desc: 'Ofertas especiales basadas en tus intereses',
          enabled: prev.find(n => n.id === 'promos')?.enabled ?? false
        },
        {
          id: 'security',
          label: 'Seguridad',
          desc: `Alertas para ${user.firstName || 'tu cuenta'}`,
          enabled: prev.find(n => n.id === 'security')?.enabled ?? true
        },
      ]);
    }
  }, [user, orders, user?.firstName]);

  // Update avatar URL when user data changes
  useEffect(() => {
    if (user?.avatar) {
      setAvatarUrl(getAvatarUrl(user.avatar));
    } else {
      setAvatarUrl(null);
    }
  }, [user?.avatar]);

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isHydrated, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    }
    return v;
  };

  const detectCardType = (number: string) => {
    const clean = number.replace(/\s/g, '');
    if (clean.startsWith('4')) return 'visa';
    if (/^5[1-5]/.test(clean)) return 'mastercard';
    if (/^3[47]/.test(clean)) return 'amex';
    return null;
  };

  const detectBank = (number: string): 'bancolombia' | 'amex' | 'davivienda' | 'generic' | null => {
    const clean = number.replace(/\s/g, '').slice(0, 6);
    
    // American Express (34, 37)
    if (/^3[47]/.test(clean)) return 'amex';
    
    // Bancolombia BINs
    const bancolombiaBins = ['4513', '5303', '5401', '5471', '5528'];
    if (bancolombiaBins.some(bin => clean.startsWith(bin))) return 'bancolombia';
    
    // Davivienda BINs
    const daviviendaBins = ['4237', '4592', '5406', '5520'];
    if (daviviendaBins.some(bin => clean.startsWith(bin))) return 'davivienda';
    
    // If it's a known card type but no specific bank, return generic
    if (detectCardType(number)) return 'generic';
    
    return null;
  };

  const getCardStyle = (bankName: typeof bank) => {
    switch (bankName) {
      case 'bancolombia':
        return {
          gradient: 'from-yellow-400 via-yellow-500 to-yellow-600',
          text: 'text-blue-900',
          chip: 'from-blue-600 to-blue-800',
          logo: 'Bancolombia',
          bgPattern: 'bg-blue-500/10'
        };
      case 'davivienda':
        return {
          gradient: 'from-red-500 via-red-600 to-red-700',
          text: 'text-white',
          chip: 'from-yellow-400 to-yellow-600',
          logo: 'Davivienda',
          bgPattern: 'bg-white/10'
        };
      case 'amex':
        return {
          gradient: 'from-blue-600 via-blue-700 to-blue-800',
          text: 'text-white',
          chip: 'from-gray-300 to-gray-400',
          logo: 'American Express',
          bgPattern: 'bg-white/10'
        };
      default:
        return {
          gradient: 'from-gray-800 via-gray-900 to-black',
          text: 'text-white',
          chip: 'from-yellow-400 to-yellow-600',
          logo: cardType?.toUpperCase() || 'VISA',
          bgPattern: 'bg-white/10'
        };
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
    setCardType(detectCardType(formatted));
    setBank(detectBank(formatted));
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpiryDate(formatExpiryDate(e.target.value));
  };

  const handleSaveCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingCard(true);
    
    try {
      const isEditing = !!editingCardId;
      const payload = {
        brand: cardType || 'card',
        last4: cardNumber.slice(-4),
        expiryMonth: expiryDate.split('/')[0] || '12',
        expiryYear: expiryDate.split('/')[1] || '25',
        bank: bank || 'generic',
        isDefault: false,
      };
      
      const response = isEditing
        ? await apiClient.put(`/users/payment-methods/${editingCardId}`, payload)
        : await apiClient.post('/users/payment-methods', payload);

      const newCard = (response.data as any)?.data || response.data;
      if (!newCard.id) {
        console.error('No ID in response:', newCard);
        throw new Error('Server returned invalid data');
      }
      
      if (isEditing) {
        // Update existing card in the list
        setSavedCards(savedCards.map(c => c.id === editingCardId ? {
          id: newCard.id,
          last4: newCard.last4,
          brand: newCard.brand,
          expiry: `${newCard.expiryMonth}/${newCard.expiryYear}`,
          bank: newCard.bank || 'generic',
        } : c));
      } else {
        // Add new card to the list
        setSavedCards([...savedCards, {
          id: newCard.id,
          last4: newCard.last4,
          brand: newCard.brand,
          expiry: `${newCard.expiryMonth}/${newCard.expiryYear}`,
          bank: newCard.bank || 'generic',
        }]);
      }
      
      // Reset form and close modal
      setShowPaymentModal(false);
      setEditingCardId(null);
      setCardNumber('');
      setCardHolder('');
      setExpiryDate('');
      setCvv('');
      setCardType(null);
      setBank(null);
    } catch (error: any) {
      console.error('Error saving card:', error);
    } finally {
      setSavingCard(false);
    }
  };

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);
    setPasswordStrength(calculatePasswordStrength(value));
    setPasswordError('');
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Completa todos los campos');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('Mínimo 8 caracteres');
      return;
    }

    setSavingPassword(true);
    
    try {
      await apiClient.put('/auth/password', {
        currentPassword,
        newPassword,
      });

      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordStrength(0);
    } catch (error: any) {
      setPasswordError(error.message || 'Error al cambiar la contraseña');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressError('');

    if (!addressStreet || !addressCity || !addressState) {
      setAddressError('Completa la dirección, ciudad y departamento/estado');
      return;
    }

    setSavingAddress(true);
    
    try {
      const isEditing = !!editingAddressId;
      const addressPayload = {
        label: addressLabel || 'Mi dirección',
        street: addressStreet,
        city: addressCity,
        state: addressState,
        zipCode: addressZip,
        phone: addressPhone,
      };

      const response = isEditing
        ? await apiClient.put(`/users/addresses/${editingAddressId}`, addressPayload)
        : await apiClient.post('/users/addresses', addressPayload);

      const newAddress = (response.data as any)?.data || response.data;
      if (!newAddress.id) {
        console.error('No ID in response:', newAddress);
        throw new Error('Server returned invalid data');
      }
      
      if (isEditing) {
        // Update existing address in the list
        setSavedAddresses(savedAddresses.map(a => a.id === editingAddressId ? {
          id: newAddress.id,
          label: newAddress.label,
          street: newAddress.street,
          city: newAddress.city,
          state: newAddress.state,
          zip: newAddress.zipCode,
          phone: newAddress.phone,
        } : a));
      } else {
        // Add new address to the list
        setSavedAddresses([...savedAddresses, {
          id: newAddress.id,
          label: newAddress.label,
          street: newAddress.street,
          city: newAddress.city,
          state: newAddress.state,
          zip: newAddress.zipCode,
          phone: newAddress.phone,
        }]);
      }
      
      // Reset form and close modal
      setShowAddressModal(false);
      setEditingAddressId(null);
      setAddressLabel('');
      setAddressStreet('');
      setAddressCity('');
      setAddressState('');
      setAddressZip('');
      setAddressPhone('');
    } catch (error: any) {
      console.error('Error saving address:', error);
      setAddressError(error.message || 'Error al guardar la dirección');
    } finally {
      setSavingAddress(false);
    }
  };

  // Edit and Delete handlers for Addresses
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  const handleEditAddress = (address: typeof savedAddresses[0]) => {
    setEditingAddressId(address.id);
    setAddressLabel(address.label);
    setAddressStreet(address.street);
    setAddressCity(address.city);
    setAddressState(address.state);
    setAddressZip(address.zip);
    setAddressPhone(address.phone);
    setShowAddressModal(true);
  };

  const handleDeleteAddress = async (id: string) => {
    
    try {
      await apiClient.delete(`/users/addresses/${id}`);
      setSavedAddresses(savedAddresses.filter(a => a.id !== id));
    } catch (error: any) {
    }
  };

  // Edit and Delete handlers for Cards
  const [editingCardId, setEditingCardId] = useState<string | null>(null);

  const handleEditCard = (card: typeof savedCards[0]) => {
    setEditingCardId(card.id);
    setCardNumber(`•••• •••• •••• ${card.last4}`);
    setCardHolder(''); // Card holder not stored in saved card data
    setExpiryDate(card.expiry);
    setCardType(card.brand as 'visa' | 'mastercard' | 'amex' | null);
    setBank(card.bank as 'bancolombia' | 'amex' | 'davivienda' | 'generic' | null);
    setCvv('');
    setShowPaymentModal(true);
  };

  const handleDeleteCard = async (id: string) => {
    
    try {
      await apiClient.delete(`/users/payment-methods/${id}`);
      setSavedCards(savedCards.filter(c => c.id !== id));
    } catch (error: any) {
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setAddressError('Geolocalización no soportada en este navegador');
      return;
    }

    setGettingLocation(true);
    setAddressError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Use reverse geocoding to get address from coordinates
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=es`
          );
          
          if (response.ok) {
            const data = await response.json();
            setAddressStreet(data.streetName || data.locality || '');
            setAddressCity(data.city || data.locality || '');
            setAddressState(data.principalSubdivision || '');
            setAddressZip(data.postcode || '');
          }
        } catch (error) {
          setAddressError('No se pudo obtener la dirección desde tu ubicación');
        } finally {
          setGettingLocation(false);
        }
      },
      (error) => {
        setGettingLocation(false);
        setAddressError('Permiso de ubicación denegado o error al obtener ubicación');
      },
      { timeout: 10000 }
    );
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'completed': return 'bg-black text-white';
      case 'shipped': return 'bg-black/10 text-black';
      case 'processing': return 'bg-black/5 text-black/60';
      default: return 'bg-black/5 text-black/60';
    }
  };

  const getStatusLabel = (status: Order['status']) => {
    switch (status) {
      case 'completed': return 'Completado';
      case 'shipped': return 'Enviado';
      case 'processing': return 'Procesando';
      default: return 'Procesando';
    }
  };

  // Handle avatar file selection
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return;
    }

    setIsUploadingAvatar(true);

    try {
      // Crear FormData para subir el archivo
      const formData = new FormData();
      formData.append('avatar', file);

      // Mostrar preview inmediato
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Enviar al servidor usando el endpoint dedicado para avatar
      const response = await apiClient.request('/users/avatar', {
        method: 'POST',
        headers: {},
        body: formData as any,
      });

      const data = response.data as any;
      
      // Actualizar el usuario con la nueva URL del avatar
      if (data.success && data.data?.user) {
        // Usar el usuario actualizado que devuelve el backend
        const updatedUser = data.data.user;
        setUser(updatedUser);
        // Construir URL completa para el avatar
        setAvatarUrl(getAvatarUrl(updatedUser?.avatar));
      }

      setShowAvatarMenu(false);
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      // Restaurar avatar anterior
      setAvatarUrl(getAvatarUrl(user?.avatar));
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Handle remove avatar
  const handleRemoveAvatar = async () => {

    setIsUploadingAvatar(true);
    try {
      const response = await apiClient.put('/users/me', {
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        avatar: null,
      });

      const data = response.data as any;
      setUser(data.data || data);
      setAvatarUrl(null);
      setShowAvatarMenu(false);
    } catch (error: any) {
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await apiClient.put<any>('/users/me', { firstName, lastName, email });
      setUser(response.data || response);
      setIsEditing(false);
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while hydrating or if not authenticated
  if (!isHydrated || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4 text-black/50">
          <div className="h-8 w-8 border-4 border-black/10 border-t-black rounded-full animate-spin" />
          <span className="text-sm font-medium">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-white flex overflow-hidden">
      {/* ── LEFT SIDEBAR ─────────────────────────────────────────── */}
      <div className="hidden lg:flex flex-col h-full w-[360px] bg-gradient-to-b from-black to-black/95 text-white px-8 py-12 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }} />
        </div>

        {/* Logo */}
        <div className="relative z-10 mb-20">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Image 
                src="/favicon.ico" 
                alt="Hack 6 Logo" 
                width={44}
                height={44}
                className="h-11 w-11 rounded-full relative"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight">Hack 6</span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">Security Store</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="relative z-10 flex-1 space-y-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${
              activeTab === 'overview'
                ? 'bg-white text-black shadow-lg shadow-white/10'
                : 'text-white/50 hover:bg-white/5 hover:text-white'
            }`}
          >
            <User className="h-5 w-5" />
            <span className="text-sm font-semibold">Resumen</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${
              activeTab === 'orders'
                ? 'bg-white text-black shadow-lg shadow-white/10'
                : 'text-white/50 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Package className="h-5 w-5" />
            <span className="text-sm font-semibold">Pedidos</span>
            <span className="ml-auto text-xs bg-white/20 px-2.5 py-1 rounded-full font-medium">
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${
              activeTab === 'settings'
                ? 'bg-white text-black shadow-lg shadow-white/10'
                : 'text-white/50 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Settings className="h-5 w-5" />
            <span className="text-sm font-semibold">Configuración</span>
          </button>
        </nav>

        {/* Back to home */}
        <div className="relative z-10 mt-auto pt-8 border-t border-white/10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>
        </div>
      </div>

      {/* ── MAIN CONTENT ───────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-gradient-to-br from-white to-black/[0.02]">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between px-6 py-5 border-b border-black/[0.08] bg-white/80 backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative">
              <Image 
                src="/favicon.ico" 
                alt="Hack 6 Logo" 
                width={40}
                height={40}
                className="h-10 w-10 rounded-full"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight">Hack 6</span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-black/40">Security Store</span>
            </div>
          </Link>
          <span className="text-xs uppercase tracking-[0.3em] text-black/40 font-semibold">Perfil</span>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden flex gap-2 p-4 border-b border-black/[0.08] bg-white/50 backdrop-blur-sm overflow-x-auto">
          {[
            { id: 'overview', label: 'Resumen', icon: User },
            { id: 'orders', label: 'Pedidos', icon: Package },
            { id: 'settings', label: 'Ajustes', icon: Settings },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as typeof activeTab)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === id
                  ? 'bg-black text-white shadow-lg shadow-black/10'
                  : 'bg-black/[0.03] text-black/60 hover:bg-black/[0.05]'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto h-full">
          <div className="max-w-5xl mx-auto px-6 lg:px-16 py-10 lg:py-16 min-h-full">
            {/* ─── OVERVIEW TAB ───────────────────────────────────── */}
            {activeTab === 'overview' && (
              <div className="space-y-12">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-[0.3em] text-black/40 font-semibold block mb-3">
                      Mi cuenta
                    </span>
                    <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
                      Hola, {user.firstName}
                    </h1>
                  </div>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-black/[0.08] text-sm font-semibold hover:bg-black hover:text-white transition-all duration-300"
                  >
                    <Edit3 className="h-4 w-4" />
                    {isEditing ? 'Cancelar' : 'Editar perfil'}
                  </button>
                </div>

                {/* Profile Card */}
                <div className="border border-black/[0.08] rounded-3xl overflow-hidden bg-white">
                  {/* Avatar & Basic Info */}
                  <div className="p-10 lg:p-12 border-b border-black/[0.08]">
                    <div className="flex items-center gap-8">
                      {/* Avatar with floating menu */}
                      <div className="relative">
                        <div
                          className="w-24 h-24 lg:w-28 lg:h-28 rounded-2xl bg-gradient-to-br from-black/5 to-black/[0.02] border border-black/[0.08] text-black flex items-center justify-center text-3xl lg:text-4xl font-bold overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:shadow-black/10"
                          onClick={() => setShowAvatarMenu(!showAvatarMenu)}
                        >
                          {isUploadingAvatar ? (
                            <div className="h-8 w-8 border-4 border-black/10 border-t-black rounded-full animate-spin" />
                          ) : avatarUrl ? (
                            <Image
                              src={avatarUrl}
                              alt={`${user.firstName} ${user.lastName}`}
                              width={112}
                              height={112}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <>{String(user.firstName?.[0] || '')}{String(user.lastName?.[0] || '')}</>
                          )}
                        </div>

                        {/* Floating Menu Card */}
                        {showAvatarMenu && (
                          <>
                            {/* Backdrop */}
                            <div
                              className="fixed inset-0 z-40"
                              onClick={() => setShowAvatarMenu(false)}
                            />
                            {/* Menu */}
                            <div className="absolute top-full left-0 mt-3 z-50 bg-white rounded-2xl shadow-2xl shadow-black/10 border border-black/[0.08] p-2 min-w-[200px] animate-in fade-in zoom-in-95 duration-200">
                              <button
                                onClick={() => {
                                  fileInputRef.current?.click();
                                }}
                                disabled={isUploadingAvatar}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-black/[0.03] transition-colors text-left text-sm font-semibold disabled:opacity-50"
                              >
                                <div className="w-9 h-9 rounded-xl bg-black/[0.03] flex items-center justify-center">
                                  <Camera className="h-4 w-4" />
                                </div>
                                <span>Cambiar foto</span>
                              </button>

                              {avatarUrl && (
                                <button
                                  onClick={handleRemoveAvatar}
                                  disabled={isUploadingAvatar}
                                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50/50 text-left text-sm font-semibold text-red-600 disabled:opacity-50"
                                >
                                  <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
                                    <Trash2 className="h-4 w-4" />
                                  </div>
                                  <span>Eliminar foto</span>
                                </button>
                              )}

                              <div className="mt-2 pt-2 border-t border-black/[0.08] px-4 py-2">
                                <p className="text-xs text-black/40">
                                  Formatos: JPG, PNG, WebP
                                  <br />
                                  Máximo: 5MB
                                </p>
                              </div>
                            </div>
                          </>
                        )}

                        {/* Hidden file input */}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarChange}
                        />

                        {/* Camera icon overlay on hover */}
                        <button
                          onClick={() => setShowAvatarMenu(!showAvatarMenu)}
                          className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full shadow-lg border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all"
                          title="Cambiar foto de perfil"
                        >
                          <Camera className="h-4 w-4" />
                        </button>
                      </div>
                      <div>
                        <h2 className="text-xl lg:text-2xl font-semibold tracking-tight">
                          {user.firstName} {user.lastName}
                        </h2>
                        <p className="text-black/50 flex items-center gap-2 mt-1">
                          <Mail className="h-4 w-4" />
                          {user.email}
                        </p>
                        <span className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full bg-black text-white text-xs font-medium">
                          <Shield className="h-3 w-3" />
                          {isAdmin(user) ? 'Administrador' : 'Cliente'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Edit Form */}
                  {isEditing ? (
                    <form onSubmit={handleSaveProfile} className="p-8 lg:p-10 space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs uppercase tracking-[0.25em] text-black/40 font-medium">
                            Nombre
                          </label>
                          <Input
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="h-12 rounded-xl border-black/15 focus:border-black"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs uppercase tracking-[0.25em] text-black/40 font-medium">
                            Apellido
                          </label>
                          <Input
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="h-12 rounded-xl border-black/15 focus:border-black"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-[0.25em] text-black/40 font-medium">
                          Correo electrónico
                        </label>
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="h-12 rounded-xl border-black/15 focus:border-black"
                        />
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="px-6 py-3 rounded-full border border-black/15 text-sm font-medium hover:bg-black/5 transition-all"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="px-6 py-3 rounded-full bg-black text-white text-sm font-medium hover:scale-[1.02] hover:shadow-[0_10px_40px_rgba(0,0,0,0.18)] disabled:opacity-50 transition-all"
                        >
                          {loading ? 'Guardando...' : 'Guardar cambios'}
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* Quick Stats */
                    <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-black/10">
                      {[
                        { 
                          value: orders.length.toString(), 
                          label: 'Pedidos totales' 
                        },
                        { 
                          value: orders.filter(order => order.status === 'processing' || order.status === 'shipped').length.toString(), 
                          label: 'En proceso' 
                        },
                        { 
                          value: `$${orders.reduce((total, order) => total + Number(order.total), 0).toFixed(2)}`, 
                          label: 'Gasto total' 
                        },
                        { 
                          value: user?.createdAt ? (() => {
                            try {
                              const createdDate = new Date(user.createdAt);
                              if (isNaN(createdDate.getTime())) return '0';
                              return Math.ceil((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24)).toString();
                            } catch {
                              return '0';
                            }
                          })() : '0', 
                          label: 'Días miembro' 
                        },
                      ].map((stat, i) => (
                        <div key={i} className="p-6 lg:p-8 text-center lg:text-left hover:bg-black/[0.02] transition-colors">
                          <div className="text-2xl lg:text-3xl font-semibold tracking-tight">{stat.value}</div>
                          <div className="text-xs uppercase tracking-[0.2em] text-black/40 mt-1">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent Orders Preview */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold tracking-tight">Pedidos recientes</h3>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-sm text-black/50 hover:text-black flex items-center gap-1 transition-colors"
                    >
                      Ver todos
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {orders.slice(0, 2).map((order) => (
                      <div
                        key={order.id}
                        className="group flex items-center justify-between p-5 border border-black/10 rounded-2xl hover:border-black/30 transition-all duration-300"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-black/5 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                            <Package className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">{order.id}</p>
                            <p className="text-sm text-black/50">{order.items} productos • {order.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {getStatusLabel(order.status)}
                          </span>
                          <p className="font-semibold mt-1">${Number(order.total).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ─── ORDERS TAB ───────────────────────────────────────── */}
            {activeTab === 'orders' && (
              <div className="space-y-8">
                <div>
                  <span className="text-xs uppercase tracking-[0.35em] text-black/40 font-medium block mb-2">
                    Historial
                  </span>
                  <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight">
                    Mis pedidos
                  </h1>
                </div>

                <div className="space-y-4">
                  {ordersLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="flex flex-col items-center gap-4 text-black/50">
                        <div className="h-8 w-8 border-4 border-black/10 border-t-black rounded-full animate-spin" />
                        <span className="text-sm font-medium">Cargando pedidos...</span>
                      </div>
                    </div>
                  ) : (
                    orders.map((order) => (
                      <div
                        key={order.id}
                        className="group border border-black/10 rounded-3xl overflow-hidden hover:border-black/25 transition-all duration-300"
                      >
                      {/* Order Header */}
                      <div className="flex items-center justify-between px-6 py-4 bg-black/[0.02] border-b border-black/10">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xs uppercase tracking-wider text-black/40">Pedido</span>
                            <span className="font-mono font-semibold text-sm bg-black/5 px-2 py-1 rounded-lg">
                              {order.id.slice(-8).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-sm text-black/50 flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {order.date}
                          </span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </div>

                      {/* Order Content */}
                      <div className="p-6">
                        {/* Products List */}
                        <div className="space-y-3 mb-6">
                          {order.orderItems?.map((item) => (
                            <div
                              key={item.id}
                              className="group flex items-center gap-4 p-4 bg-gradient-to-r from-black/[0.02] to-transparent border border-black/5 rounded-2xl hover:border-black/15 hover:from-black/[0.03] transition-all duration-300"
                            >
                              {/* Product Image */}
                              <div className="w-20 h-20 rounded-xl bg-white border border-black/10 overflow-hidden flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                                {item.product.images?.[0] ? (
                                  <Image
                                    src={item.product.images[0]}
                                    alt={item.product.name}
                                    width={80}
                                    height={80}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-black/5 to-black/[0.02] flex items-center justify-center">
                                    <Package className="h-6 w-6 text-black/20" />
                                  </div>
                                )}
                              </div>

                              {/* Product Info */}
                              <div className="flex-1 min-w-0">
                                <Link
                                  href={`/products/${item.product.slug}`}
                                  className="font-semibold text-sm text-black hover:text-black/70 transition-colors truncate block mb-1"
                                >
                                  {item.product.name}
                                </Link>
                                <div className="flex items-center gap-3">
                                  <span className="text-xs px-2 py-1 bg-black/5 rounded-full text-black/60 font-medium">
                                    Cantidad: {item.quantity}
                                  </span>
                                  <span className="text-xs text-black/40">•</span>
                                  <span className="text-xs text-black/60 font-medium">
                                    ${Number(item.price).toFixed(2)} c/u
                                  </span>
                                </div>
                              </div>

                              {/* Item Total */}
                              <div className="text-right flex-shrink-0">
                                <p className="font-bold text-base text-black">
                                  ${(Number(item.price) * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Order Footer */}
                        <div className="flex items-center justify-between pt-5 border-t border-black/10">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-black/5 to-black/[0.02] border border-black/10 flex items-center justify-center">
                              <Package className="h-5 w-5 text-black/40" />
                            </div>
                            <div>
                              <p className="text-xs uppercase tracking-wider text-black/40 mb-0.5">Entrega estimada</p>
                              <p className="text-sm font-semibold text-black">3-5 días hábiles</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs uppercase tracking-wider text-black/40 mb-0.5">Total del pedido</p>
                            <p className="text-2xl font-bold tracking-tight text-black">
                              ${Number(order.total).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    ))
                  )}
                </div>

                {/* Empty State */}
                {orders.length === 0 && (
                  <div className="text-center py-16 border border-black/10 rounded-3xl">
                    <Package className="h-12 w-12 mx-auto text-black/20 mb-4" />
                    <p className="text-black/50">No tienes pedidos aún</p>
                    <Link
                      href="/products"
                      className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-black text-white rounded-full text-sm font-medium hover:scale-[1.02] transition-all"
                    >
                      Explorar productos
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* ─── SETTINGS TAB ───────────────────────────────────── */}
            {activeTab === 'settings' && (
              <div className="space-y-8">
                <div>
                  <span className="text-xs uppercase tracking-[0.35em] text-black/40 font-medium block mb-2">
                    Preferencias
                  </span>
                  <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight">
                    Configuración
                  </h1>
                </div>

                <div className="space-y-6">
                  {/* Account Section */}
                  <div className="border border-black/10 rounded-3xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-black/10 bg-black/[0.02]">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        Seguridad
                      </h3>
                    </div>
                    <div className="p-6 space-y-4">
                      <button 
                        onClick={() => setShowPasswordModal(true)}
                        className="w-full flex items-center justify-between p-4 rounded-xl border border-black/10 hover:border-black/30 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-black/5 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                            <Lock className="h-4 w-4" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium text-sm">Cambiar contraseña</p>
                            <p className="text-xs text-black/50">Actualiza tu contraseña de acceso</p>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-black/30" />
                      </button>

                      <button 
                        onClick={() => setShowPaymentModal(true)}
                        className="w-full flex items-center justify-between p-4 rounded-xl border border-black/10 hover:border-black/30 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-black/5 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                            <CreditCard className="h-4 w-4" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium text-sm">Métodos de pago</p>
                            <p className="text-xs text-black/50">
                              {savedCards.length > 0 ? `${savedCards.length} tarjeta${savedCards.length > 1 ? 's' : ''} guardada${savedCards.length > 1 ? 's' : ''}` : 'Gestiona tus tarjetas guardadas'}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-black/30" />
                      </button>

                      {/* Saved Cards List */}
                      {savedCards.length > 0 && (
                        <div className="mt-4 space-y-3">
                          {savedCards.map((card, index) => (
                            <div 
                              key={card.id || `card-${index}`}
                              className="flex items-center justify-between p-4 rounded-xl bg-black/[0.02] border border-black/5 group hover:border-black/20 transition-all"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-800 to-black flex items-center justify-center text-white text-xs font-bold uppercase">
                                  {card.brand === 'visa' ? 'VISA' : card.brand === 'mastercard' ? 'MC' : card.brand === 'amex' ? 'AMEX' : '••••'}
                                </div>
                                <div>
                                  <p className="font-medium text-sm">
                                    •••• {card.last4}
                                  </p>
                                  <p className="text-xs text-black/50">
                                    Expira {card.expiry}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-black/40 capitalize mr-2">
                                  {card.bank === 'generic' ? 'Tarjeta' : card.bank}
                                </span>
                                {/* Edit/Delete Actions */}
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => handleEditCard(card)}
                                    className="p-2 rounded-lg hover:bg-black/10 text-black/50 hover:text-black transition-all"
                                    title="Editar"
                                  >
                                    <Edit3 className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteCard(card.id)}
                                    className="p-2 rounded-lg hover:bg-red-100 text-black/50 hover:text-red-600 transition-all"
                                    title="Eliminar"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Notifications Section */}
                  <div className="border border-black/10 rounded-3xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-black/10 bg-black/[0.02]">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        Notificaciones
                      </h3>
                    </div>
                    <div className="p-6 space-y-4">
                      {notifications.map((item) => (
                        <div key={item.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{item.label}</p>
                            <p className="text-xs text-black/50">{item.desc}</p>
                          </div>
                          <button
                            onClick={() => toggleNotification(item.id)}
                            className={`w-11 h-6 rounded-full transition-all relative ${
                              item.enabled ? 'bg-black' : 'bg-black/20'
                            }`}
                          >
                            <span
                              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                                item.enabled ? 'left-6' : 'left-1'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Address Section */}
                  <div className="border border-black/10 rounded-3xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-black/10 bg-black/[0.02]">
                      <h3 className="font-semibold flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Direcciones
                      </h3>
                    </div>
                    <div className="p-6">
                      <button 
                        onClick={() => setShowAddressModal(true)}
                        className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border border-dashed border-black/25 hover:border-black hover:bg-black/[0.02] transition-all text-sm font-medium text-black/60 hover:text-black"
                      >
                        <span className="text-lg">+</span>
                        {savedAddresses.length > 0 ? 'Agregar otra dirección' : 'Agregar nueva dirección'}
                      </button>

                      {/* Saved Addresses List */}
                      {savedAddresses.length > 0 && (
                        <div className="mt-4 space-y-3">
                          {savedAddresses.map((address, index) => (
                            <div 
                              key={address.id || `address-${index}`}
                              className="flex items-start justify-between p-4 rounded-xl bg-black/[0.02] border border-black/5 group hover:border-black/20 transition-all"
                            >
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-800 to-black flex items-center justify-center text-white shrink-0">
                                  <MapPin className="h-4 w-4" />
                                </div>
                                <div>
                                  <p className="font-medium text-sm">
                                    {address.label || 'Mi dirección'}
                                  </p>
                                  <p className="text-xs text-black/50 mt-0.5">
                                    {address.street}
                                  </p>
                                  <p className="text-xs text-black/40">
                                    {address.city}, {address.state} {address.zip}
                                  </p>
                                  {address.phone && (
                                    <p className="text-xs text-black/40 mt-0.5">
                                      Tel: {address.phone}
                                    </p>
                                  )}
                                </div>
                              </div>
                              {/* Edit/Delete Actions */}
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleEditAddress(address)}
                                  className="p-2 rounded-lg hover:bg-black/10 text-black/50 hover:text-black transition-all"
                                  title="Editar"
                                >
                                  <Edit3 className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteAddress(address.id)}
                                  className="p-2 rounded-lg hover:bg-red-100 text-black/50 hover:text-red-600 transition-all"
                                  title="Eliminar"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border border-red-200 text-red-600 hover:bg-red-50 transition-all group"
                  >
                    <LogOut className="h-4 w-4 group-hover:translate-x-[-2px] transition-transform" />
                    <span className="font-medium">Cerrar sesión</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* ─── PAYMENT MODAL ────────────────────────────────────────── */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowPaymentModal(false)}
          />
          
          {/* Modal Card */}
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-black/10">
              <div>
                <h3 className="text-lg font-semibold tracking-tight">
                  {editingCardId ? 'Editar tarjeta' : 'Agregar tarjeta'}
                </h3>
                <p className="text-sm text-black/50">
                  {editingCardId ? 'Actualiza los datos de tu tarjeta' : 'Ingresa los datos de tu tarjeta'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setEditingCardId(null);
                  setCardNumber('');
                  setCardHolder('');
                  setExpiryDate('');
                  setCvv('');
                  setCardType(null);
                  setBank(null);
                }}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors"
              >
                <X className="h-5 w-5 text-black/50" />
              </button>
            </div>

            {/* Card Preview */}
            <div className="px-6 pt-6">
              {(() => {
                const style = getCardStyle(bank);
                return (
                  <div className={`relative h-48 rounded-2xl bg-gradient-to-br ${style.gradient} ${style.text} p-6 shadow-xl overflow-hidden`}>
                    {/* Card Background Pattern */}
                    <div className={`absolute inset-0 ${style.bgPattern}`}>
                      <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white blur-3xl opacity-20" />
                      <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white blur-2xl opacity-10" />
                    </div>
                    
                    {/* Card Content */}
                    <div className="relative z-10 h-full flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <div className={`w-12 h-8 bg-gradient-to-r ${style.chip} rounded-md shadow-lg`} />
                        {bank && (
                          <span className="text-xs uppercase tracking-wider font-semibold opacity-90">
                            {style.logo}
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-2xl font-mono tracking-wier">
                          {cardNumber || '•••• •••• •••• ••••'}
                        </div>
                      </div>
                      
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider opacity-60 mb-0.5">Titular</p>
                          <p className="text-sm font-semibold uppercase tracking-wide truncate max-w-[180px]">
                            {cardHolder || 'NOMBRE APELLIDO'}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider opacity-60 mb-0.5">Expira</p>
                          <p className="text-sm font-semibold">
                            {expiryDate || 'MM/AA'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Form */}
            <form onSubmit={handleSaveCard} className="p-6 space-y-5">
              {/* Card Number */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.25em] text-black/40 font-medium">
                  Número de tarjeta
                </label>
                <Input
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                  className="h-12 rounded-xl border-black/15 focus:border-black font-mono text-lg tracking-wider"
                  required
                />
              </div>

              {/* Card Holder */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.25em] text-black/40 font-medium">
                  Nombre del titular
                </label>
                <Input
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                  placeholder="Como aparece en la tarjeta"
                  className="h-12 rounded-xl border-black/15 focus:border-black uppercase"
                  required
                />
              </div>

              {/* Expiry and CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.25em] text-black/40 font-medium">
                    Fecha expiración
                  </label>
                  <Input
                    value={expiryDate}
                    onChange={handleExpiryChange}
                    placeholder="MM/AA"
                    maxLength={5}
                    className="h-12 rounded-xl border-black/15 focus:border-black font-mono text-center"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.25em] text-black/40 font-medium">
                    CVV
                  </label>
                  <Input
                    type="password"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="123"
                    maxLength={4}
                    className="h-12 rounded-xl border-black/15 focus:border-black font-mono text-center"
                    required
                  />
                </div>
              </div>

              {/* Security Note */}
              <div className="flex items-center gap-2 text-xs text-black/40">
                <Lock className="h-3.5 w-3.5" />
                <span>Tus datos están encriptados y seguros</span>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowPaymentModal(false);
                    setEditingCardId(null);
                    setCardNumber('');
                    setCardHolder('');
                    setExpiryDate('');
                    setCvv('');
                    setCardType(null);
                    setBank(null);
                  }}
                  className="flex-1 h-12 rounded-full border border-black/15 text-sm font-medium hover:bg-black/5 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingCard || cardNumber.length < 16}
                  className="flex-1 h-12 rounded-full bg-black text-white text-sm font-medium flex items-center justify-center gap-2 hover:scale-[1.02] hover:shadow-[0_10px_40px_rgba(0,0,0,0.18)] disabled:opacity-50 disabled:scale-100 transition-all"
                >
                  {savingCard ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Guardar tarjeta
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── PASSWORD MODAL ───────────────────────────────────────── */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowPasswordModal(false)}
          />
          
          {/* Modal Card */}
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-black/10">
              <div>
                <h3 className="text-lg font-semibold tracking-tight">Cambiar contraseña</h3>
                <p className="text-sm text-black/50">Actualiza tu contraseña de acceso</p>
              </div>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors"
              >
                <X className="h-5 w-5 text-black/50" />
              </button>
            </div>

            {/* Security Illustration */}
            <div className="px-6 pt-6">
              <div className="relative h-32 rounded-2xl bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 shadow-xl overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white blur-2xl" />
                </div>
                <div className="relative z-10 text-center">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-white/10 flex items-center justify-center mb-2">
                    <Lock className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-white/70 text-xs uppercase tracking-[0.2em]">Seguridad reforzada</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSavePassword} className="p-6 space-y-5">
              {/* Error */}
              {passwordError && (
                <div className="px-4 py-3 rounded-xl border border-red-200 bg-red-50 text-sm text-red-600">
                  {passwordError}
                </div>
              )}

              {/* Current Password */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.25em] text-black/40 font-medium">
                  Contraseña actual
                </label>
                <div className="relative">
                  <Input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-12 rounded-xl border-black/15 focus:border-black pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 hover:text-black transition-colors"
                  >
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.25em] text-black/40 font-medium">
                  Nueva contraseña
                </label>
                <div className="relative">
                  <Input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                    placeholder="Mínimo 8 caracteres"
                    className="h-12 rounded-xl border-black/15 focus:border-black pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 hover:text-black transition-colors"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                
                {/* Strength Indicator */}
                {newPassword && (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-1.5 bg-black/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          passwordStrength === 0 ? 'w-0' :
                          passwordStrength === 1 ? 'w-1/4 bg-red-500' :
                          passwordStrength === 2 ? 'w-2/4 bg-yellow-500' :
                          passwordStrength === 3 ? 'w-3/4 bg-blue-500' :
                          'w-full bg-green-500'
                        }`}
                      />
                    </div>
                    <span className="text-xs text-black/50">
                      {passwordStrength === 0 ? 'Muy débil' :
                       passwordStrength === 1 ? 'Débil' :
                       passwordStrength === 2 ? 'Media' :
                       passwordStrength === 3 ? 'Fuerte' : 'Muy fuerte'}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.25em] text-black/40 font-medium">
                  Confirmar contraseña
                </label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite la nueva contraseña"
                  className={`h-12 rounded-xl border-black/15 focus:border-black ${
                    confirmPassword && confirmPassword !== newPassword ? 'border-red-300' : ''
                  }`}
                  required
                />
                {confirmPassword && confirmPassword !== newPassword && (
                  <p className="text-xs text-red-500">Las contraseñas no coinciden</p>
                )}
              </div>

              {/* Password Requirements */}
              <div className="space-y-2 text-xs">
                <p className="text-black/40 uppercase tracking-[0.2em] font-medium">Requisitos:</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Mínimo 8 caracteres', met: newPassword.length >= 8 },
                    { label: 'Una mayúscula', met: /[A-Z]/.test(newPassword) },
                    { label: 'Un número', met: /[0-9]/.test(newPassword) },
                    { label: 'Un carácter especial', met: /[^A-Za-z0-9]/.test(newPassword) },
                  ].map((req, i) => (
                    <div key={i} className={`flex items-center gap-1.5 ${req.met ? 'text-green-600' : 'text-black/30'}`}>
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${req.met ? 'bg-green-100' : 'bg-black/5'}`}>
                        {req.met ? <Check className="h-2.5 w-2.5" /> : <span className="h-1 w-1 rounded-full bg-black/20" />}
                      </div>
                      <span>{req.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 h-12 rounded-full border border-black/15 text-sm font-medium hover:bg-black/5 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingPassword || passwordStrength < 2 || newPassword !== confirmPassword}
                  className="flex-1 h-12 rounded-full bg-black text-white text-sm font-medium flex items-center justify-center gap-2 hover:scale-[1.02] hover:shadow-[0_10px_40px_rgba(0,0,0,0.18)] disabled:opacity-50 disabled:scale-100 transition-all"
                >
                  {savingPassword ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Actualizando...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Cambiar contraseña
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── ADDRESS MODAL ────────────────────────────────────────── */}
      {showAddressModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowAddressModal(false)}
          />
          
          {/* Modal Card */}
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-black/10">
              <div>
                <h3 className="text-lg font-semibold tracking-tight">Agregar dirección</h3>
                <p className="text-sm text-black/50">Ingresa los datos de envío</p>
              </div>
              <button
                onClick={() => setShowAddressModal(false)}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors"
              >
                <X className="h-5 w-5 text-black/50" />
              </button>
            </div>

            {/* Location Button */}
            <div className="px-6 pt-6">
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={gettingLocation}
                className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-gradient-to-r from-gray-800 to-black text-white hover:scale-[1.02] transition-all disabled:opacity-50"
              >
                {gettingLocation ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Obteniendo ubicación...
                  </>
                ) : (
                  <>
                    <MapPin className="h-5 w-5" />
                    Usar mi ubicación actual
                  </>
                )}
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveAddress} className="p-6 space-y-5">
              {/* Error */}
              {addressError && (
                <div className="px-4 py-3 rounded-xl border border-red-200 bg-red-50 text-sm text-red-600">
                  {addressError}
                </div>
              )}

              {/* Label */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.25em] text-black/40 font-medium">
                  Etiqueta (opcional)
                </label>
                <Input
                  value={addressLabel}
                  onChange={(e) => setAddressLabel(e.target.value)}
                  placeholder="Ej: Casa, Trabajo, Apartamento"
                  className="h-12 rounded-xl border-black/15 focus:border-black"
                />
              </div>

              {/* Street */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.25em] text-black/40 font-medium">
                  Dirección *
                </label>
                <Input
                  value={addressStreet}
                  onChange={(e) => setAddressStreet(e.target.value)}
                  placeholder="Calle, número, piso, apto"
                  className="h-12 rounded-xl border-black/15 focus:border-black"
                  required
                />
              </div>

              {/* City & State */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.25em] text-black/40 font-medium">
                    Ciudad *
                  </label>
                  <Input
                    value={addressCity}
                    onChange={(e) => setAddressCity(e.target.value)}
                    placeholder="Ciudad"
                    className="h-12 rounded-xl border-black/15 focus:border-black"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.25em] text-black/40 font-medium">
                    Estado/Dept *
                  </label>
                  <Input
                    value={addressState}
                    onChange={(e) => setAddressState(e.target.value)}
                    placeholder="Estado"
                    className="h-12 rounded-xl border-black/15 focus:border-black"
                    required
                  />
                </div>
              </div>

              {/* Zip & Phone */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.25em] text-black/40 font-medium">
                    Código postal
                  </label>
                  <Input
                    value={addressZip}
                    onChange={(e) => setAddressZip(e.target.value)}
                    placeholder="ZIP"
                    className="h-12 rounded-xl border-black/15 focus:border-black"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.25em] text-black/40 font-medium">
                    Teléfono
                  </label>
                  <Input
                    value={addressPhone}
                    onChange={(e) => setAddressPhone(e.target.value)}
                    placeholder="Teléfono de contacto"
                    className="h-12 rounded-xl border-black/15 focus:border-black"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="flex-1 h-12 rounded-full border border-black/15 text-sm font-medium hover:bg-black/5 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingAddress || !addressStreet || !addressCity || !addressState}
                  className="flex-1 h-12 rounded-full bg-black text-white text-sm font-medium flex items-center justify-center gap-2 hover:scale-[1.02] hover:shadow-[0_10px_40px_rgba(0,0,0,0.18)] disabled:opacity-50 disabled:scale-100 transition-all"
                >
                  {savingAddress ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Guardar dirección
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
