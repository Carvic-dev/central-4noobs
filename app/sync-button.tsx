"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SyncState = "idle" | "loading" | "success" | "error";

export function SyncButton() {
  const router = useRouter();
  const [state, setState] = useState<SyncState>("idle");
  const [message, setMessage] = useState("");
  const buttonLabel = {
    idle: "Sincronizar GitHub",
    loading: "Sincronizando...",
    success: "Sincronizar novamente",
    error: "Tentar novamente",
  }[state];

  async function handleSync() {
    setState("loading");
    setMessage("");

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 35_000);

    try {
      const response = await fetch("/api/sync", {
        method: "POST",
        signal: controller.signal,
      });
      const data = (await response.json().catch(() => ({}))) as {
        message?: string;
        totalEncontrado?: number;
        error?: string;
        detalhes?: string;
      };

      if (!response.ok) {
        throw new Error(
          data.detalhes || data.error || "Nao foi possivel sincronizar.",
        );
      }

      setState("success");
      setMessage(`${data.message} ${data.totalEncontrado ?? 0} materiais.`);
      router.refresh();
    } catch (error) {
      const isTimeout =
        error instanceof DOMException && error.name === "AbortError";

      setState("error");
      setMessage(
        isTimeout
          ? "A sincronizacao demorou demais. Verifique sua conexao e tente novamente."
          : error instanceof Error
            ? error.message
            : "Erro desconhecido.",
      );
    } finally {
      window.clearTimeout(timeout);
    }
  }

  return (
    <div className="flex flex-col items-start gap-3">
      <button
        type="button"
        onClick={handleSync}
        disabled={state === "loading"}
        className="inline-flex h-11 items-center justify-center rounded-md bg-[#6f5aa8] px-5 text-sm font-semibold text-white shadow-sm shadow-[#6f5aa8]/20 transition hover:bg-[#5f4b8b] disabled:cursor-not-allowed disabled:bg-[#d6c8ef] disabled:text-[#7d6aa8]"
      >
        {buttonLabel}
      </button>
      {message ? (
        <p
          aria-live="polite"
          className={
            state === "error"
              ? "text-sm text-red-700"
              : "text-sm text-[#5f4b8b]"
          }
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
