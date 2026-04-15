import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";

export function AdminTopbar({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description ? <p className="mt-2 text-sm text-white/70">{description}</p> : null}
      </div>
      <AdminLogoutButton />
    </div>
  );
}

