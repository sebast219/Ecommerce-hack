'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Mail,
  Calendar,
  Shield,
  Search,
  RefreshCw,
  UserCheck,
  UserX,
  Trash2,
} from 'lucide-react';
import Image from 'next/image';
import { useAuthStore } from '@/store/auth-store';
import { adminUserService, AdminUser } from '@/lib/admin-user-service';
import { User, UserRole, isAdmin } from '@/types/auth';
import Pagination from '@/components/admin/Pagination';
import SkeletonLoader from '@/components/admin/SkeletonLoader';
import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminUsersPage() {
  const { token } = useAuthStore();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token, currentPage]);

  // Cargar usuarios
  const fetchUsers = async () => {
    try {
      const response = await adminUserService.getAll();
      // Manejar respuesta directa o anidada
      const usersData = Array.isArray(response) ? response : (response?.data || []);
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Refrescar usuarios
  const handleRefresh = () => {
    setRefreshing(true);
    setCurrentPage(1);
    fetchUsers();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Eliminar usuario
  const handleDeleteUser = async (userId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) return;
    
    try {
      await adminUserService.delete(userId);
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Toggle usuario activo
  const handleToggleActive = async (userId: string, isActive: boolean) => {
    try {
      await adminUserService.toggleActive(userId);
      setUsers(users.map(user => 
        user.id === userId ? { ...user, isActive: !isActive } : user
      ));
    } catch (error) {
      console.error('Error toggling user active status:', error);
    }
  };

  // Toggle verificación de email
  const handleToggleEmailVerified = async (userId: string, isVerified: boolean | undefined) => {
    try {
      await adminUserService.toggleEmailVerified(userId);
      setUsers(users.map(user => 
        user.id === userId ? { ...user, isVerified: !isVerified, emailVerified: !isVerified } : user
      ));
    } catch (error) {
      console.error('Error toggling email verification:', error);
    }
  };

  // Filtrar usuarios
  const filteredUsers = users.filter(user => {
    const matchesSearch = `${user.firstName} ${user.lastName} ${user.email}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

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

  return (
    <>
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <AdminHeader
            title="Gestión de Usuarios"
            count={users.length}
            badge="Panel de Administración"
            actions={
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Actualizar
              </button>
            }
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-zinc-900 text-white p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm">Total Usuarios</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              <Users className="w-8 h-8 text-zinc-600" />
            </div>
          </div>
          <div className="bg-white border border-gray-200 p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Administradores</p>
                <p className="text-2xl font-bold text-zinc-900">{users.filter(u => isAdmin(u)).length}</p>
              </div>
              <Shield className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white border border-gray-200 p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Clientes</p>
                <p className="text-2xl font-bold text-zinc-900">{users.filter(u => u.role === UserRole.USER).length}</p>
              </div>
              <UserCheck className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white border border-gray-200 p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Verificados</p>
                <p className="text-2xl font-bold text-zinc-900">{users.filter(u => u.isVerified).length}</p>
              </div>
              <UserX className="w-8 h-8 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
          >
            <option value="all">Todos los roles</option>
            <option value="ADMIN">Administradores</option>
            <option value="USER">Clientes</option>
          </select>
        </div>

        {/* Users Table */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-6">
              <SkeletonLoader type="table" count={3} />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="w-12 h-12 mx-auto text-gray-400" />
              <p className="mt-4 text-gray-600">No se encontraron usuarios</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Usuario
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Rol
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Registro
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-zinc-100 text-zinc-600 flex items-center justify-center text-sm font-semibold border border-gray-200">
                              {user.avatar ? (
                                <Image
                                  src={user.avatar}
                                  alt={`${user.firstName} ${user.lastName}`}
                                  width={40}
                                  height={40}
                                  className="w-full h-full rounded-full object-cover"
                                />
                              ) : (
                                getInitials(user.firstName, user.lastName)
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-zinc-900">
                                {user.firstName} {user.lastName}
                              </div>
                              {user.phone && (
                                <div className="text-xs text-gray-500">{user.phone}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-zinc-900">
                            <Mail className="w-4 h-4 mr-2 text-gray-400" />
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            isAdmin(user) 
                              ? 'bg-zinc-900 text-white' 
                              : 'bg-gray-100 text-zinc-900'
                          }`}>
                            {isAdmin(user) ? 'Admin' : 'Cliente'}
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                            {formatDate(user.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center gap-2">
                            <button 
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              onClick={() => handleToggleActive(user.id, user.isActive)}
                              title={user.isActive ? 'Desactivar' : 'Activar'}
                            >
                              <UserCheck className={`w-4 h-4 ${user.isActive ? 'text-green-600' : 'text-gray-400'}`} />
                            </button>
                            <button 
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              onClick={() => handleToggleEmailVerified(user.id, user.isVerified)}
                              title={user.isVerified ? 'Desmarcar verificado' : 'Marcar verificado'}
                            >
                              <Shield className={`w-4 h-4 ${user.isVerified ? 'text-blue-600' : 'text-gray-400'}`} />
                            </button>
                            <button 
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              onClick={() => handleDeleteUser(user.id)}
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredUsers.length / pageSize)}
              onPageChange={handlePageChange}
              pageSize={pageSize}
              totalItems={filteredUsers.length}
            />
            </>
          )}
        </div>
      </div>
    </>
  );
}
