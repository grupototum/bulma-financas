import { LoginForm } from "@/components/auth/login-form";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <Image
            src="/bulma-login.png"
            alt="Cashflow"
            width={120}
            height={120}
            className="rounded-2xl shadow-lg"
          />
          <h1 className="text-3xl font-bold text-mint-900 dark:text-mint-50">Cashflow</h1>
          <p className="text-mint-600 dark:text-mint-400">Sistema financeiro pessoal do Rael</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
