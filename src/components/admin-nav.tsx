"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export function AdminNav() {
  const router = useRouter();
  return (
    <header className="mb-8 flex items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
      <div className="flex items-center gap-4 text-sm">
        <Link
          href="/admin"
          className="font-semibold text-zinc-900 dark:text-zinc-100"
        >
          Admin
        </Link>
        <Link
          href="/"
          className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
        >
          View site
        </Link>
        <Link
          href="/admin/new"
          className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
        >
          New bookmark
        </Link>
      </div>
      <button
        type="button"
        onClick={async () => {
          await signOut({ redirect: false });
          router.push("/admin/login");
          router.refresh();
        }}
        className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
      >
        Sign out
      </button>
    </header>
  );
}
