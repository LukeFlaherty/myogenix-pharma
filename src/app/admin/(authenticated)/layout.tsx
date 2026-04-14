import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { AdminShell } from "@/components/admin/AdminShell";
import { getPendingReviewOrders } from "@/lib/admin-stub-data";

export default async function AdminAuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const pendingReviewCount = getPendingReviewOrders().length;

  return (
    <AdminShell session={session} pendingReviewCount={pendingReviewCount}>
      {children}
    </AdminShell>
  );
}
