import Link from "next/link";
import type { ComponentProps } from "react";

type ButtonProps = ComponentProps<"button"> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ className = "", variant = "primary", ...props }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-amber-500/50";
  const styles =
    variant === "primary"
      ? "bg-amber-500 text-black hover:bg-amber-400"
      : variant === "secondary"
        ? "bg-white/10 text-white hover:bg-white/15"
        : "bg-transparent text-white hover:bg-white/10";
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
    "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-amber-500/50";
  const styles =
    variant === "primary"
      ? "bg-amber-500 text-black hover:bg-amber-400"
      : variant === "secondary"
        ? "bg-white/10 text-white hover:bg-white/15"
        : "bg-transparent text-white hover:bg-white/10";
  return (
    <Link className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </Link>
  );
}

