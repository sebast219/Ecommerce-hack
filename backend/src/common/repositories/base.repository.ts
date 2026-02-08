import { PrismaService } from '../../database/prisma.service';

export abstract class BaseRepository {
  constructor(protected prisma: PrismaService) {}

  protected async executeWithTransaction<T>(
    callback: (tx: PrismaService) => Promise<T>,
  ): Promise<T> {
    return await this.prisma.$transaction(callback);
  }
}
