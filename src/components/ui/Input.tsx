import type { ComponentProps } from "react";

type InputProps = ComponentProps<"input"> & {
  label?: string;
  hint?: string;
};

export function Input({ label, hint, className = "", ...props }: InputProps) {
  return (
    <label className="block">
      {label ? <span className="mb-1 block text-sm font-medium text-white/90">{label}</span> : null}
      <input
        className={`w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-amber-400/70 focus:ring-2 focus:ring-amber-500/20 ${className}`}
        {...props}
      />
      {hint ? <span className="mt-1 block text-xs text-white/60">{hint}</span> : null}
    </label>
  );
}

type SelectProps = ComponentProps<"select"> & { label?: string; hint?: string };

export function Select({ label, hint, className = "", children, ...props }: SelectProps) {
  return (
    <label className="block">
      {label ? <span className="mb-1 block text-sm font-medium text-white/90">{label}</span> : null}
      <select
        className={`w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-white outline-none focus:border-amber-400/70 focus:ring-2 focus:ring-amber-500/20 ${className}`}
        {...props}
      >
        {children}
      </select>
      {hint ? <span className="mt-1 block text-xs text-white/60">{hint}</span> : null}
    </label>
  );
}

type TextAreaProps = ComponentProps<"textarea"> & { label?: string; hint?: string };

export function TextArea({ label, hint, className = "", ...props }: TextAreaProps) {
  return (
    <label className="block">
      {label ? <span className="mb-1 block text-sm font-medium text-white/90">{label}</span> : null}
      <textarea
        className={`min-h-28 w-full resize-y rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-amber-400/70 focus:ring-2 focus:ring-amber-500/20 ${className}`}
        {...props}
      />
      {hint ? <span className="mt-1 block text-xs text-white/60">{hint}</span> : null}
    </label>
  );
}

