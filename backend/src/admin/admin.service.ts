import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { ProductsRepository } from '../products/products.repository';
import { OrdersRepository } from '../orders/orders.repository';
import { PaymentsRepository } from '../payments/payments.repository';

@Injectable()
export class AdminService {
  constructor(
    private usersRepository: UsersRepository,
    private productsRepository: ProductsRepository,
    private ordersRepository: OrdersRepository,
    private paymentsRepository: PaymentsRepository,
  ) {}

  async getDashboardData() {
    const [
      userStats,
      productStats,
      orderStats,
      paymentStats,
      recentOrders,
      topProducts,
    ] = await Promise.all([
      this.getUserStats(),
      this.getProductStats(),
      this.ordersRepository.getOrderStats(),
      this.paymentsRepository.getPaymentStats(),
      this.getRecentOrders(),
      this.getTopProducts(),
    ]);

    return {
      users: userStats,
      products: productStats,
      orders: orderStats,
      payments: paymentStats,
      recentOrders,
      topProducts,
    };
  }

  async getStats() {
    return this.getDashboardData();
  }

  private async getUserStats() {
    const users = await this.usersRepository.findAll();
    const totalUsers = users.length;
    const adminUsers = users.filter(user => user.role === 'ADMIN').length;
    const regularUsers = users.filter(user => user.role === 'USER').length;

    return {
      total: totalUsers,
      admins: adminUsers,
      regular: regularUsers,
    };
  }

  private async getProductStats() {
    const products = await this.productsRepository.findAll();
    const totalProducts = products.length;
    const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
    const categories = await this.productsRepository.getCategories();

    const stockByCategory = {};
    for (const category of categories) {
      const categoryProducts = products.filter(p => p.category === category);
      stockByCategory[category] = categoryProducts.reduce((sum, p) => sum + p.stock, 0);
    }

    return {
      total: totalProducts,
      totalStock,
      categories: categories.length,
      stockByCategory,
    };
  }

  private async getRecentOrders() {
    return this.ordersRepository.findAll(5, 0);
  }

  private async getTopProducts() {
    const products = await this.productsRepository.findAll();
    // This is a simplified version - in a real app you'd track sales data
    return products.slice(0, 5).map(product => ({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
    }));
  }
}
