import Image from "next/image";
import CreateTokenAccount from "./components/CreateTokenAccount";
import { MintToForm } from "./components/MintToken";

export default function Home() {
  return (
    <div>
      <CreateTokenAccount />
      <MintToForm />
    </div>
  );
}
