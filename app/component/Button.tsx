import Link from "next/link";
import React from "react";

type ButtonProps = {
  title: string;
  href: string;
};

const Button = ({ title, href }: ButtonProps) => {
  return (
    <Link
      href={href}
      className="mt-2 flex items-center justify-center gap-2 w-full text-black font-black text-xs py-2.5 rounded-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-yellow-400/20 uppercase tracking-wider"
      style={{
        background: "linear-gradient(135deg, #facc15 0%, #f97316 100%)",
      }}
    >
      ✦ {title}
    </Link>
  );
};

export default Button;