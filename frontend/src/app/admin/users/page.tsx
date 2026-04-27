'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Users,
  Mail,
  Calendar,
  Shield,
  Search,
  Filter,
  RefreshCw,
  UserCheck,
  UserX,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  phone?: string;
  avatar?: string;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const { user, isAuthenticated, token } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  // Verificar si es administrador
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      router.push('/');
      return;
    }
  }, [isAuthenticated, user, router]);

  // Cargar usuarios
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/all`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al cargar usuarios');
      }

      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === 'ADMIN') {
      fetchUsers();
    }
  }, [isAuthenticated, user]);

  // Refrescar usuarios
  const handleRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  // Filtrar usuarios
  const filteredUsers = users.filter(user => {
    const matchesSearch = `${user.firstName} ${user.lastName} ${user.email}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  // Formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Obtener iniciales para avatar
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Admin Panel
                </Button>
              </Link>
              <h1 className="text-xl font-semibold">Gestión de Usuarios</h1>
            </div>
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-black text-white p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black/60 text-sm">Total Usuarios</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              <Users className="w-8 h-8 text-black/40" />
            </div>
          </div>
          <div className="border border-black/10 p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black/60 text-sm">Administradores</p>
                <p className="text-2xl font-bold">{users.filter(u => u.role === 'ADMIN').length}</p>
              </div>
              <Shield className="w-8 h-8 text-black/20" />
            </div>
          </div>
          <div className="border border-black/10 p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black/60 text-sm">Clientes</p>
                <p className="text-2xl font-bold">{users.filter(u => u.role === 'USER').length}</p>
              </div>
              <UserCheck className="w-8 h-8 text-black/20" />
            </div>
          </div>
          <div className="border border-black/10 p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black/60 text-sm">Verificados</p>
                <p className="text-2xl font-bold">{users.filter(u => u.isVerified).length}</p>
              </div>
              <UserX className="w-8 h-8 text-black/20" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black/40" />
            <Input
              placeholder="Buscar por nombre, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10"
          >
            <option value="all">Todos los roles</option>
            <option value="ADMIN">Administradores</option>
            <option value="USER">Clientes</option>
          </select>
        </div>

        {/* Users Table */}
        <div className="bg-white border border-black/10 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <RefreshCw className="w-8 h-8 mx-auto animate-spin text-black/40" />
              <p className="mt-4 text-black/60">Cargando usuarios...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="w-12 h-12 mx-auto text-black/20" />
              <p className="mt-4 text-black/60">No se encontraron usuarios</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-black/5 border-b border-black/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-black/60 uppercase tracking-wider">
                      Usuario
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-black/60 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-black/60 uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-black/60 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-black/60 uppercase tracking-wider">
                      Registro
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-black/60 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-black/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold">
                            {user.avatar ? (
                              <img
                                src={user.avatar}
                                alt={`${user.firstName} ${user.lastName}`}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              getInitials(user.firstName, user.lastName)
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-black">
                              {user.firstName} {user.lastName}
                            </div>
                            {user.phone && (
                              <div className="text-xs text-black/40">{user.phone}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-black">
                          <Mail className="w-4 h-4 mr-2 text-black/40" />
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === 'ADMIN' 
                            ? 'bg-black text-white' 
                            : 'bg-black/10 text-black'
                        }`}>
                          {user.role === 'ADMIN' ? 'Admin' : 'Cliente'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.isVerified 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {user.isVerified ? 'Verificado' : 'Pendiente'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black/60">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-black/40" />
                          {formatDate(user.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="p-1">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="p-1">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="p-1 text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
