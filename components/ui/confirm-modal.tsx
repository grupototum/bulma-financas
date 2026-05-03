"use client";

import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "default";
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "default",
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-mint-800 p-6 shadow-lg">
        <div className="flex items-center gap-3">
          {variant === "danger" && (
            <div className="rounded-full bg-mint-error-light dark:bg-mint-error/30 p-2">
              <AlertTriangle className="h-5 w-5 text-mint-error" />
            </div>
          )}
          <h3 className="text-lg font-semibold text-mint-900 dark:text-mint-50">{title}</h3>
        </div>
        <p className="mt-3 text-sm text-mint-600 dark:text-mint-400">{message}</p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-mint-300 dark:border-mint-600 px-4 py-2 text-sm font-medium text-mint-700 dark:text-mint-300 hover:bg-mint-50 dark:hover:bg-mint-800 dark:bg-mint-950"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium text-white ${
              variant === "danger"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-mint-900 hover:bg-mint-800"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
