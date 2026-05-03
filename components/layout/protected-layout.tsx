"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Tags,
  Landmark,
  BarChart3,
  Target,
  Wallet,
  User,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  Repeat,
} from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/lib/theme-provider";
import { AutoRecurringChecker } from "@/components/auto-recurring-checker";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Transações", icon: ArrowLeftRight },
  { href: "/categories", label: "Categorias", icon: Tags },
  { href: "/contas", label: "Contas", icon: Landmark },
  { href: "/fixed-expenses", label: "Fixos vs Variáveis", icon: Repeat },
  { href: "/metas", label: "Metas", icon: Target },
  { href: "/orcamentos", label: "Orçamentos", icon: Wallet },
  { href: "/relatorios", label: "Relatórios", icon: BarChart3 },
  { href: "/perfil", label: "Perfil", icon: User },
];

interface ProtectedLayoutProps {
  children: React.ReactNode;
  userEmail?: string;
}

export function ProtectedLayout({ children, userEmail }: ProtectedLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  async function handleLogout() {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
    } finally {
      router.push("/");
    }
  }

  return (
    <div className="flex min-h-screen bg-mint-50 dark:bg-mint-950">
      {/* Sidebar desktop */}
      <aside className="hidden w-64 flex-col border-r border-mint-200 dark:border-mint-700 bg-white dark:bg-mint-900 md:flex">
        <div className="flex h-16 items-center border-b border-mint-200 dark:border-mint-700 px-6">
          <Link href="/dashboard" className="text-lg font-bold text-mint-900 dark:text-mint-50">
            Bulma Finanças
          </Link>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                  active
                    ? "bg-mint-brand-light dark:bg-mint-brand-deep/30 text-mint-brand-deep dark:text-mint-brand"
                    : "text-mint-700 dark:text-mint-300 hover:bg-mint-100 dark:hover:bg-mint-925"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-mint-200 dark:border-mint-700 p-4">
          <p className="truncate text-xs text-mint-500 dark:text-mint-400">{userEmail}</p>
          <button
            onClick={handleLogout}
            className="mt-2 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-mint-700 dark:text-mint-300 hover:bg-mint-100 dark:bg-mint-925"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-mint-200 dark:border-mint-700 bg-white dark:bg-mint-800 px-4 md:hidden">
          <Link href="/dashboard" className="text-lg font-bold text-mint-900 dark:text-mint-50">
            Bulma Finanças
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-md p-2 text-mint-700 dark:text-mint-300 hover:bg-mint-100 dark:bg-mint-925"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </header>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="absolute inset-0 z-40 flex md:hidden">
            <div
              className="flex-1 bg-black/50"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="w-64 bg-white dark:bg-mint-800 shadow-lg">
              <div className="flex h-16 items-center justify-between border-b border-mint-200 dark:border-mint-700 px-4">
                <span className="text-lg font-bold text-mint-900 dark:text-mint-50">Menu</span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="rounded-lg p-2 text-mint-700 dark:text-mint-300 hover:bg-mint-100 dark:bg-mint-925"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="space-y-1 p-3">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                        active
                          ? "bg-mint-brand-light text-mint-brand-deep"
                          : "text-mint-700 dark:text-mint-300 hover:bg-mint-100 dark:bg-mint-925"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="border-t border-mint-200 dark:border-mint-700 p-4">
                <p className="truncate text-xs text-mint-500 dark:text-mint-400">{userEmail}</p>
                <button
                  onClick={() => {
                    setSidebarOpen(false);
                    toggleTheme();
                  }}
                  className="mt-2 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-mint-700 dark:text-mint-300 hover:bg-mint-100 dark:bg-mint-925"
                >
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  {theme === "dark" ? "Modo claro" : "Modo escuro"}
                </button>
                <button
                  onClick={() => {
                    setSidebarOpen(false);
                    handleLogout();
                  }}
                  className="mt-2 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-mint-700 dark:text-mint-300 hover:bg-mint-100 dark:bg-mint-925"
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </button>
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-auto">{children}</main>
        <AutoRecurringChecker />

        {/* Footer */}
        <footer className="border-t border-mint-200 dark:border-mint-700 bg-white dark:bg-mint-800 py-4 text-center text-xs text-mint-400 dark:text-mint-500">
          Bulma Finanças v2 • Desenvolvido por Rael
        </footer>
      </div>
    </div>
  );
}
