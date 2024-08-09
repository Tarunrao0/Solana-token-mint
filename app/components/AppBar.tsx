"use client";
import { FC } from "react";
// import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Image from "next/image";
import dynamic from "next/dynamic";
import styles from "./AppBar.module.css";

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export const AppBar: FC = () => {
  return (
    <div className="h-[120px] flex bg-black flex-row items-center justify-between text-[50px] text-white px-[20px] flex-wrap">
      <Image src="/solanaLogo.png" alt="solana" height={30} width={200} />

      <span className={styles.gradient}>Solana Token Mint</span>
      <WalletMultiButtonDynamic />
    </div>
  );
};
