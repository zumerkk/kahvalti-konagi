import type { ComponentProps } from "react";

type InputProps = ComponentProps<"input"> & {
  label?: string;
  hint?: string;
};

export function Input({ label, hint, className = "", ...props }: InputProps) {
  return (
    <label className="block">
      {label ? <span className="mb-1 block text-sm font-semibold text-[#4a3e31]">{label}</span> : null}
      <input
        className={`w-full rounded-xl border border-[#e6dfd5] bg-white px-4 py-3 text-[#3d3023] placeholder:text-[#a89d90] outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200/50 transition-all ${className}`}
        {...props}
      />
      {hint ? <span className="mt-1 block text-xs text-[#7c6f62]">{hint}</span> : null}
    </label>
  );
}

type SelectProps = ComponentProps<"select"> & { label?: string; hint?: string };

export function Select({ label, hint, className = "", children, ...props }: SelectProps) {
  return (
    <label className="block">
      {label ? <span className="mb-1 block text-sm font-semibold text-[#4a3e31]">{label}</span> : null}
      <select
        className={`w-full rounded-xl border border-[#e6dfd5] bg-white px-4 py-3 text-[#3d3023] outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200/50 transition-all ${className}`}
        {...props}
      >
        {children}
      </select>
      {hint ? <span className="mt-1 block text-xs text-[#7c6f62]">{hint}</span> : null}
    </label>
  );
}

type TextAreaProps = ComponentProps<"textarea"> & { label?: string; hint?: string };

export function TextArea({ label, hint, className = "", ...props }: TextAreaProps) {
  return (
    <label className="block">
      {label ? <span className="mb-1 block text-sm font-semibold text-[#4a3e31]">{label}</span> : null}
      <textarea
        className={`min-h-28 w-full resize-y rounded-xl border border-[#e6dfd5] bg-white px-4 py-3 text-[#3d3023] placeholder:text-[#a89d90] outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200/50 transition-all ${className}`}
        {...props}
      />
      {hint ? <span className="mt-1 block text-xs text-[#7c6f62]">{hint}</span> : null}
    </label>
  );
}

