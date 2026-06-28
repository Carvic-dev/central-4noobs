"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  MATERIAL_SEARCH_SET_EVENT,
  MATERIAL_SEARCH_SYNC_EVENT,
  type MaterialSearchEventDetail,
} from "./material-search-events";

function emitSearch(query: string) {
  window.dispatchEvent(
    new CustomEvent<MaterialSearchEventDetail>(MATERIAL_SEARCH_SET_EVENT, {
      detail: { query },
    }),
  );
}

function scrollToMaterials() {
  document
    .getElementById("trilhas")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function NavbarSearch() {
  const [query, setQuery] = useState("");

  useEffect(() => {
    function handleSync(event: Event) {
      const detail = (event as CustomEvent<MaterialSearchEventDetail>).detail;

      if (typeof detail?.query === "string") {
        setQuery(detail.query);
      }
    }

    window.addEventListener(MATERIAL_SEARCH_SYNC_EVENT, handleSync);

    return () => {
      window.removeEventListener(MATERIAL_SEARCH_SYNC_EVENT, handleSync);
    };
  }, []);

  function handleChange(value: string) {
    setQuery(value);
    emitSearch(value);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    emitSearch(query);
    scrollToMaterials();
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className="flex h-9 w-full min-w-0 items-center gap-1 rounded-lg border border-white/10 bg-white/[0.08] p-1 shadow-sm shadow-black/10 transition focus-within:border-[var(--he4rt-pink)] focus-within:bg-white/[0.12] lg:h-10"
    >
      <input
        type="search"
        value={query}
        onChange={(event) => handleChange(event.target.value)}
        placeholder="Buscar material..."
        aria-label="Buscar materiais"
        autoComplete="off"
        className="h-7 min-w-0 flex-1 bg-transparent px-3 text-sm font-medium text-white outline-none placeholder:text-[var(--he4rt-muted-invert)]/70 lg:h-8"
      />
      <button
        type="submit"
        className="h-7 shrink-0 rounded-md bg-white px-3 text-xs font-bold text-[var(--he4rt-purple-deep)] transition hover:bg-[var(--he4rt-pink-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--he4rt-pink)] lg:h-8"
      >
        Buscar
      </button>
    </form>
  );
}
