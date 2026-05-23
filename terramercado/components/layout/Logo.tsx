import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  size?: number;
  linkHref?: string;
}

export function Logo({ size = 40, linkHref = "/" }: LogoProps) {
  const height = Math.round(size * (433 / 457));

  const img = (
    <Image
      src="/logo.png"
      alt="TerraMercado"
      width={size}
      height={height}
      priority
      className="select-none"
    />
  );

  if (linkHref) {
    return (
      <Link href={linkHref} className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-terra-blue-400 rounded-md">
        {img}
        <span className="font-heading font-bold text-xl text-[#1e4d8c] dark:text-[#93c5fd] sr-only sm:not-sr-only">
          TerraMercado
        </span>
      </Link>
    );
  }

  return img;
}
