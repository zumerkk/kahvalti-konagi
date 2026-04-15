import { Navbar } from "@/components/Navbar";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const metadata = {
  title: "Admin Giriş | Kahvaltı Konağı",
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-5 py-14">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6">
          <h1 className="text-xl font-semibold tracking-tight">Admin Giriş</h1>
          <p className="mt-2 text-sm text-white/70">
            Rezervasyonları ve kapalı günleri yönetmek için giriş yapın.
          </p>
          <div className="mt-6">
            <AdminLoginForm />
          </div>
        </div>
      </main>
    </div>
  );
}

