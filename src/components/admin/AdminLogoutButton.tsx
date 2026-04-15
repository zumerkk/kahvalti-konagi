"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function AdminLogoutButton() {
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      window.location.href = "/admin/login";
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button onClick={logout} variant="secondary" disabled={loading}>
      {loading ? "Çıkış…" : "Çıkış Yap"}
    </Button>
  );
}

