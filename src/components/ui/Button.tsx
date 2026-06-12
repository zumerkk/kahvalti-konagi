import Link from "next/link";
import type { ComponentProps } from "react";

type ButtonProps = ComponentProps<"button"> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ className = "", variant = "primary", ...props }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 active:scale-95 cursor-pointer";
  const styles =
    variant === "primary"
      ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-500/15"
      : variant === "secondary"
        ? "bg-orange-50/80 border border-orange-200/60 text-orange-950 hover:bg-orange-100 hover:text-orange-900 shadow-sm"
        : "bg-transparent text-orange-950 hover:bg-orange-50/50 hover:text-orange-900";
  return <button className={`${base} ${styles} ${className}`} {...props} />;
}

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  children: React.ReactNode;
};

export function ButtonLink({
  className = "",
  variant = "primary",
  children,
  ...props
}: ButtonLinkProps) {
  const base =
    "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 active:scale-95 cursor-pointer";
  const styles =
    variant === "primary"
      ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-500/15"
      : variant === "secondary"
        ? "bg-orange-50/80 border border-orange-200/60 text-orange-950 hover:bg-orange-100 hover:text-orange-900 shadow-sm"
        : "bg-transparent text-orange-950 hover:bg-orange-50/50 hover:text-orange-900";
  return (
    <Link className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </Link>
  );
}

