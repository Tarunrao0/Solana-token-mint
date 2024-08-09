"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { FC, useEffect, useState } from "react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

const SolanaBalance: FC = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (!connection || !publicKey) {
      return;
    }

    connection.getAccountInfo(publicKey).then((info: any) => {
      setBalance(info.lamports);
    });
  }, [connection, publicKey]);

  return (
    <div className="ml-96 pt-10 text-white">
      <p className="ml-64">
        {publicKey ? `SOL Balance: ${balance / LAMPORTS_PER_SOL}` : ""}
      </p>
    </div>
  );
};

export default SolanaBalance;
