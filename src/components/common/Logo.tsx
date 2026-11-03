import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <Link 
      href="/" 
      className="inline-flex items-center transition-transform duration-300 hover:scale-105"
    >
      <Image
        src="/images/logo/cekreks2.png"
        alt="Logo Cekreks"
        width={140}
        height={40}
        className="h-10 w-auto object-contain"
        priority
      />
    </Link>
  );
}