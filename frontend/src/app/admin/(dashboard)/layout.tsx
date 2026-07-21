import Link from "next/link";
import AdminGuard from "@/components/AdminGuard";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 p-6 sm:p-10">{children}</main>
        </div>
      </div>
    </AdminGuard>
  );
}
