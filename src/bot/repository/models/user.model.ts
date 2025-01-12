// @ts-ignore
import { TelegramUser, Wallet } from '@prisma/client';

export interface IUserModel {
  id: bigint;
  username?: string | null;
  locale: string;
  wallets?: Wallet[];
  createdAt: Date;
  updatedAt: Date;
}

export class UserModel implements IUserModel {
  id: bigint;
  username?: string | null;
  locale: string;
  wallets?: Wallet[];
  createdAt: Date;
  updatedAt: Date;

  constructor(user: TelegramUser) {
    this.id = user.id;
    this.username = user.username;
    this.locale = user.locale;
    this.wallets = user.wallets;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
