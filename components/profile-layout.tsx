import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type ProfileLayoutProps = {
  activeTab?: "todo" | "users";
  children?: ReactNode;
};

const tabs = [
  { href: "/todo", label: "Todo", value: "todo" },
  { href: "/users", label: "Users", value: "users" },
] as const;

export default function ProfileLayout({
  activeTab,
  children,
}: ProfileLayoutProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-xl flex-1 flex-col bg-white dark:bg-black sm:m-16 sm:rounded-[32px]">
        <header className="flex w-full flex-col items-center gap-5 px-5 pb-7 pt-10 text-center sm:flex-row sm:items-center sm:gap-8 sm:px-10 sm:pt-12 sm:text-left">
          <Link href="/">
            <Image
              className="size-24 shrink-0 rounded-full object-cover sm:size-[120px]"
              src="/profile.jpeg"
              alt="Profile picture"
              width={120}
              height={120}
              priority
            />
          </Link>

          <div className="flex flex-col gap-2">
            <p>7 solutions assignments</p>
            <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
              Nattapong Dulyasit
            </h1>
            <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              Looking for a new challenge
            </p>
          </div>
        </header>
        <nav
          aria-label="Profile sections"
          className="flex w-full flex-row pb-7 text-base font-medium sm:px-10 sm:gap-3"
        >
          {tabs.map(({ href, label, value }) => {
            const isActive = activeTab === value;

            return (
              <Link
                key={value}
                aria-current={isActive ? "page" : undefined}
                className={`flex h-12 w-full items-center justify-center sm:rounded-full px-5 transition-colors ${
                  isActive
                    ? "bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc]"
                    : "border border-solid border-black/[.08] hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
                }`}
                href={href}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        {children && (
          <section className="w-full px-5 pb-10 sm:px-10">{children}</section>
        )}
      </main>
    </div>
  );
}
