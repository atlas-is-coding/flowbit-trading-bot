import bs58 from "bs58";
import { Keypair } from "@solana/web3.js";

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