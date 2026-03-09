// components/Button.tsx
import Link from "next/link";
import React from "react";
import { FaMagic } from "react-icons/fa";

type ButtonProps = {
  title: string;
  href: string; // full dynamic URL pass hoga
};

const Button = ({ title, href }: ButtonProps) => {
  return (
    <Link
      href={href}
      className="mt-5 flex items-center justify-center gap-2 w-full bg-blue-500 text-white font-semibold py-2.5 rounded-xl transition-all duration-300 hover:bg-blue-600 hover:scale-[1.03] shadow-md hover:shadow-lg"
    >
      <FaMagic className="text-sm" />
      {title}
    </Link>
  );
};

export default Button;