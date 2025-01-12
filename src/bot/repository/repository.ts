// @ts-ignore
import { PrismaClient, TelegramUser, Wallet } from '@prisma/client';
import { UserModel } from './models/user.model';

export class UserRepository {
  constructor(private prisma: PrismaClient) {}

  // Создание нового пользователя
  async createUser(id: number, username?: string, locale: string = 'en'): Promise<UserModel> {
    // Сначала проверяем, существует ли пользователь
    const existingUser = await this.prisma.telegramUser.findUnique({
      where: { id: BigInt(id) },
      include: { wallets: true }
    });

    if (existingUser) {
      // Если пользователь существует, возвращаем его
      return new UserModel(existingUser);
    }

    // Если пользователь не существует, создаем нового
    const user = await this.prisma.telegramUser.create({
      data: {
        id: BigInt(id),
        username,
        locale,
      },
      include: {
        wallets: true,
      },
    });
    return new UserModel(user);
  }

  // Получение пользователя по ID
  async getUserById(id: number): Promise<UserModel | null> {
    const user = await this.prisma.telegramUser.findUnique({
      where: { id: BigInt(id) },
      include: {
        wallets: true,
      },
    });
    return user ? new UserModel(user) : null;
  }

  // Проверка существования пользователя
  async userExists(id: number): Promise<boolean> {
    const count = await this.prisma.telegramUser.count({
      where: { id: BigInt(id) },
    });
    return count > 0;
  }

  // Обновление данных пользователя
  async updateUser(id: number, data: Partial<TelegramUser>): Promise<UserModel> {
    const user = await this.prisma.telegramUser.update({
      where: { id: BigInt(id) },
      data,
      include: {
        wallets: true,
      },
    });
    return new UserModel(user);
  }

  // Удаление пользователя
  async deleteUser(id: number): Promise<void> {
    await this.prisma.telegramUser.delete({
      where: { id: BigInt(id) },
    });
  }

  // Получение следующего доступного номера кошелька
  private async getNextWalletNumber(userId: number): Promise<number> {
    const wallets = await this.prisma.wallet.findMany({
      where: { userId: BigInt(userId) },
      orderBy: { id: 'desc' },
      take: 1
    });
    
    return wallets.length > 0 ? wallets[0].id + 1 : 1;
  }

  // Обновленный метод addWallet
  async addWallet(
    userId: number, 
    walletAddress: string, 
    privateKey?: string
  ): Promise<Wallet> {
    const nextNumber = await this.getNextWalletNumber(userId);

    return await this.prisma.wallet.create({
      data: {
        address: walletAddress,
        privateKey: privateKey,
        userId: BigInt(userId),
        name: `wallet_${nextNumber}`
      },
    });
  }

  // Получение всех кошельков пользователя
  async getUserWallets(userId: number): Promise<Wallet[]> {
    return await this.prisma.wallet.findMany({
      where: { userId: BigInt(userId) },
    });
  }

  // Удаление кошелька
  async removeWallet(userId: number, walletAddress: string): Promise<void> {
    await this.prisma.wallet.deleteMany({
      where: {
        userId: BigInt(userId),
        address: walletAddress,
      },
    });
  }

  // Получение всех пользователей
  async getAllUsers(): Promise<UserModel[]> {
    const users = await this.prisma.telegramUser.findMany({
      include: {
        wallets: true,
      },
    });
    return users.map(user => new UserModel(user));
  }

  // Обновление названия кошелька
  async updateWalletName(
    userId: number,
    walletAddress: string,
    name: string
  ): Promise<Wallet> {
    return await this.prisma.wallet.update({
      where: {
        address: walletAddress,
        userId: BigInt(userId),
      },
      data: {
        name,
      },
    });
  }

  // Получение кошелька по адресу
  async getWalletByAddress(
    userId: number,
    walletAddress: string
  ): Promise<Wallet | null> {
    return await this.prisma.wallet.findFirst({
      where: {
        userId: BigInt(userId),
        address: walletAddress,
      },
    });
  }

  // Обновление локализации пользователя
  async updateUserLocale(userId: number, locale: string): Promise<UserModel> {
    const user = await this.prisma.telegramUser.update({
      where: { id: BigInt(userId) },
      data: { locale },
      include: {
        wallets: true,
      },
    });
    return new UserModel(user);
  }

  // Получение локализации пользователя
  async getUserLocale(userId: number): Promise<string> {
    const user = await this.prisma.telegramUser.findUnique({
      where: { id: BigInt(userId) },
      select: { locale: true },
    });
    return user?.locale || 'en'; // Возвращаем 'en' если пользователь не найден
  }
}
