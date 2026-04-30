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
} from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/lib/theme-provider";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Transações", icon: ArrowLeftRight },
  { href: "/categories", label: "Categorias", icon: Tags },
  { href: "/contas", label: "Contas", icon: Landmark },
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
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar desktop */}
      <aside className="hidden w-64 flex-col border-r border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-700 md:flex">
        <div className="flex h-16 items-center border-b border-gray-200 dark:border-gray-700 px-6">
          <Link href="/dashboard" className="text-lg font-bold text-gray-900 dark:text-gray-100">
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
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                  active
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-gray-200 p-4">
          <p className="truncate text-xs text-gray-500 dark:text-gray-400">{userEmail}</p>
          <button
            onClick={handleLogout}
            className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 md:hidden">
          <Link href="/dashboard" className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Bulma Finanças
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-lg p-2 text-gray-700 hover:bg-gray-100"
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
            <div className="w-64 bg-white shadow-lg">
              <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
                <span className="text-lg font-bold text-gray-900 dark:text-gray-100">Menu</span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="rounded-lg p-2 text-gray-700 hover:bg-gray-100"
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
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                        active
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="border-t border-gray-200 p-4">
                <p className="truncate text-xs text-gray-500 dark:text-gray-400">{userEmail}</p>
                <button
                  onClick={() => {
                    setSidebarOpen(false);
                    toggleTheme();
                  }}
                  className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  {theme === "dark" ? "Modo claro" : "Modo escuro"}
                </button>
                <button
                  onClick={() => {
                    setSidebarOpen(false);
                    handleLogout();
                  }}
                  className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </button>
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-auto">{children}</main>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white py-4 text-center text-xs text-gray-400">
          Bulma Finanças v2 • Desenvolvido por Rael
        </footer>
      </div>
    </div>
  );
}
