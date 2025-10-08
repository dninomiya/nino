import img from "./logo.jpg";
import Image from "next/image";
import { APP_NAME } from "@workspace/lib/constants";

export const Logo = () => {
  return (
    <div>
      <Image src={img} alt={APP_NAME} width={100} height={100} />
    </div>
  );
};
