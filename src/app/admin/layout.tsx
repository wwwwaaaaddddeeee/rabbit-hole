import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { AdminNav } from "@/components/admin-nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <div className="min-h-full">
        {session ? (
          <div className="max-w-3xl mx-auto px-5 py-8 sm:py-10 pb-16">
            <AdminNav />
            {children}
          </div>
        ) : (
          children
        )}
      </div>
    </SessionProvider>
  );
}
