import bs58 from "bs58";
import { Keypair, Connection, LAMPORTS_PER_SOL, clusterApiUrl, PublicKey } from "@solana/web3.js";

interface BinanceResponse {
  symbol: string;
  price: string;
}

export const generateWallet = async () => {
  const keypair = Keypair.generate();

  const privateKey = Buffer.from(keypair.secretKey).toString('hex');
  const publicKey = keypair.publicKey.toString();

  return [publicKey, privateKey];
}

export const createWalletFromPK = async (pk: string) => {
  const keypair = Keypair.fromSecretKey(bs58.decode(pk));
  
  const privateKey = Buffer.from(keypair.secretKey).toString('hex');
  const publicKey = keypair.publicKey.toString();
  
  return [publicKey, privateKey];
}

export const getBalanceByAddress = async (address: string): Promise<number> => {
  return new Promise(async (resolve, reject) => {
    try {
      const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
      
      const publicKey = new PublicKey(address);
      
      const balanceInLamports = await connection.getBalance(publicKey);
      const balanceInSOL = balanceInLamports / LAMPORTS_PER_SOL;
      
      resolve(balanceInSOL);
    } catch (error) {
      console.error('Ошибка при получении баланса:', error);
      reject(new Error('Не удалось получить баланс кошелька'));
    }
  });
}



export const convertSolToUsd = async (solAmount: number): Promise<number> => {
  return new Promise(async (resolve, reject) => {
    try {
      // Получаем текущую цену SOL/USDT с Binance API
      const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=SOLUSDT');
      
      if (!response.ok) {
        throw new Error('Не удалось получить курс SOL/USDT');
      }
      
      const data = await response.json() as BinanceResponse;
      const solPrice = parseFloat(data.price);
      
      // Вычисляем стоимость в USD
      const usdValue = solAmount * solPrice;
      
      // Округляем до 2 знаков после запятой
      resolve(Number(usdValue.toFixed(2)));
    } catch (error) {
      console.error('Ошибка при конвертации SOL в USD:', error);
      reject(new Error('Не удалось конвертировать SOL в USD'));
    }
  });
}
