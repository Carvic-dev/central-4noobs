"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  MATERIAL_SEARCH_SET_EVENT,
  MATERIAL_SEARCH_SYNC_EVENT,
  type MaterialSearchEventDetail,
} from "./material-search-events";

export type MaterialItem = {
  id: number;
  title: string;
  description: string;
  githubUrl: string;
};

type MaterialMeta = {
  area: string;
  format: string;
  level: string;
};

type AuthorInfo = {
  avatarUrl: string;
  name: string;
  profileUrl: string;
};

type EnrichedMaterial = MaterialItem &
  MaterialMeta & {
    author: AuthorInfo | null;
  };

type Roadmap = {
  description: string;
  id: string;
  items: string[];
  title: string;
};

const fallbackMeta: MaterialMeta = {
  area: "Pendente",
  format: "Pendente",
  level: "Pendente",
};

const materialTaxonomy: Record<string, MaterialMeta> = {
  "acessibilidade na web": {
    area: "Design e produto",
    format: "Conceito essencial",
    level: "Próximo passo",
  },
  angular: {
    area: "Web",
    format: "Framework para praticar",
    level: "Próximo passo",
  },
  appium: {
    area: "Qualidade",
    format: "Ferramenta do dia a dia",
    level: "Depois que praticar",
  },
  "arch linux": {
    area: "DevOps e ambiente",
    format: "Sistema e ambiente",
    level: "Depois que praticar",
  },
  assembly: {
    area: "Fundamentos",
    format: "Curso de linguagem",
    level: "Depois que praticar",
  },
  bash: {
    area: "DevOps e ambiente",
    format: "Curso de linguagem",
    level: "Próximo passo",
  },
  c: {
    area: "Fundamentos",
    format: "Curso de linguagem",
    level: "Comece aqui",
  },
  "c#": {
    area: "Fundamentos",
    format: "Curso de linguagem",
    level: "Comece aqui",
  },
  "c++": {
    area: "Fundamentos",
    format: "Curso de linguagem",
    level: "Próximo passo",
  },
  clojure: {
    area: "Fundamentos",
    format: "Curso de linguagem",
    level: "Depois que praticar",
  },
  crystal: {
    area: "Fundamentos",
    format: "Curso de linguagem",
    level: "Depois que praticar",
  },
  css: {
    area: "Web",
    format: "Curso de linguagem",
    level: "Comece aqui",
  },
  cypress: {
    area: "Qualidade",
    format: "Ferramenta do dia a dia",
    level: "Próximo passo",
  },
  dart: {
    area: "Mobile",
    format: "Curso de linguagem",
    level: "Comece aqui",
  },
  devops: {
    area: "DevOps e ambiente",
    format: "Área para conhecer",
    level: "Próximo passo",
  },
  django: {
    area: "Back-end",
    format: "Framework para praticar",
    level: "Próximo passo",
  },
  docker: {
    area: "DevOps e ambiente",
    format: "Ferramenta do dia a dia",
    level: "Próximo passo",
  },
  elixir: {
    area: "Fundamentos",
    format: "Curso de linguagem",
    level: "Depois que praticar",
  },
  flutter: {
    area: "Mobile",
    format: "Framework para praticar",
    level: "Próximo passo",
  },
  git: {
    area: "Ferramentas",
    format: "Ferramenta do dia a dia",
    level: "Comece aqui",
  },
  go: {
    area: "Back-end",
    format: "Curso de linguagem",
    level: "Próximo passo",
  },
  graphql: {
    area: "Back-end",
    format: "Conceito essencial",
    level: "Próximo passo",
  },
  haskell: {
    area: "Fundamentos",
    format: "Curso de linguagem",
    level: "Depois que praticar",
  },
  html: {
    area: "Web",
    format: "Curso de linguagem",
    level: "Comece aqui",
  },
  java: {
    area: "Back-end",
    format: "Curso de linguagem",
    level: "Comece aqui",
  },
  javascript: {
    area: "Web",
    format: "Curso de linguagem",
    level: "Comece aqui",
  },
  kotlin: {
    area: "Mobile",
    format: "Curso de linguagem",
    level: "Comece aqui",
  },
  linux: {
    area: "DevOps e ambiente",
    format: "Sistema e ambiente",
    level: "Comece aqui",
  },
  lpi: {
    area: "Carreira",
    format: "Certificação",
    level: "Depois que praticar",
  },
  maestro: {
    area: "Qualidade",
    format: "Ferramenta do dia a dia",
    level: "Próximo passo",
  },
  "making languages": {
    area: "Fundamentos",
    format: "Conceito essencial",
    level: "Depois que praticar",
  },
  markdown: {
    area: "Ferramentas",
    format: "Ferramenta do dia a dia",
    level: "Comece aqui",
  },
  mongodb: {
    area: "Dados",
    format: "Banco de dados",
    level: "Comece aqui",
  },
  mysql: {
    area: "Dados",
    format: "Banco de dados",
    level: "Comece aqui",
  },
  nestjs: {
    area: "Back-end",
    format: "Framework para praticar",
    level: "Próximo passo",
  },
  nextjs: {
    area: "Web",
    format: "Framework para praticar",
    level: "Próximo passo",
  },
  obsidian: {
    area: "Ferramentas",
    format: "Ferramenta do dia a dia",
    level: "Comece aqui",
  },
  ocaml: {
    area: "Fundamentos",
    format: "Curso de linguagem",
    level: "Depois que praticar",
  },
  php: {
    area: "Back-end",
    format: "Curso de linguagem",
    level: "Comece aqui",
  },
  playwright: {
    area: "Qualidade",
    format: "Ferramenta do dia a dia",
    level: "Próximo passo",
  },
  poo: {
    area: "Fundamentos",
    format: "Conceito essencial",
    level: "Comece aqui",
  },
  postgresql: {
    area: "Dados",
    format: "Banco de dados",
    level: "Comece aqui",
  },
  python: {
    area: "Fundamentos",
    format: "Curso de linguagem",
    level: "Comece aqui",
  },
  qa: {
    area: "Qualidade",
    format: "Área para conhecer",
    level: "Comece aqui",
  },
  r: {
    area: "Dados",
    format: "Curso de linguagem",
    level: "Próximo passo",
  },
  redis: {
    area: "Dados",
    format: "Banco de dados",
    level: "Próximo passo",
  },
  regex: {
    area: "Fundamentos",
    format: "Conceito essencial",
    level: "Próximo passo",
  },
  "rest assured": {
    area: "Qualidade",
    format: "Ferramenta do dia a dia",
    level: "Depois que praticar",
  },
  ruby: {
    area: "Back-end",
    format: "Curso de linguagem",
    level: "Comece aqui",
  },
  rust: {
    area: "Fundamentos",
    format: "Curso de linguagem",
    level: "Depois que praticar",
  },
  selenium: {
    area: "Qualidade",
    format: "Ferramenta do dia a dia",
    level: "Próximo passo",
  },
  spring: {
    area: "Back-end",
    format: "Framework para praticar",
    level: "Próximo passo",
  },
  sql: {
    area: "Dados",
    format: "Curso de linguagem",
    level: "Comece aqui",
  },
  swift: {
    area: "Mobile",
    format: "Curso de linguagem",
    level: "Comece aqui",
  },
  typescript: {
    area: "Web",
    format: "Curso de linguagem",
    level: "Próximo passo",
  },
  ui: {
    area: "Design e produto",
    format: "Área para conhecer",
    level: "Comece aqui",
  },
  ux: {
    area: "Design e produto",
    format: "Área para conhecer",
    level: "Comece aqui",
  },
  vim: {
    area: "Ferramentas",
    format: "Ferramenta do dia a dia",
    level: "Próximo passo",
  },
  vue: {
    area: "Web",
    format: "Framework para praticar",
    level: "Próximo passo",
  },
  wm: {
    area: "DevOps e ambiente",
    format: "Sistema e ambiente",
    level: "Depois que praticar",
  },
  wsl2: {
    area: "DevOps e ambiente",
    format: "Sistema e ambiente",
    level: "Comece aqui",
  },
  xml: {
    area: "Web",
    format: "Curso de linguagem",
    level: "Comece aqui",
  },
};

const roadmaps: Roadmap[] = [
  {
    id: "comece-aqui",
    title: "Primeiros passos",
    description: "Uma base leve para se acostumar com código, web e Git.",
    items: ["html", "css", "javascript", "git", "markdown"],
  },
  {
    id: "web-front",
    title: "Web front-end",
    description: "Do HTML aos frameworks, passando por UI e acessibilidade.",
    items: [
      "html",
      "css",
      "javascript",
      "typescript",
      "ui",
      "ux",
      "acessibilidade na web",
      "vue",
      "angular",
      "nextjs",
    ],
  },
  {
    id: "backend",
    title: "Back-end",
    description: "Linguagens, dados, APIs e ambiente para criar projetos.",
    items: [
      "git",
      "javascript",
      "typescript",
      "sql",
      "postgresql",
      "mongodb",
      "nestjs",
      "graphql",
      "docker",
    ],
  },
  {
    id: "dados",
    title: "Dados",
    description: "Comece por SQL e avance para bancos e análise com calma.",
    items: ["sql", "mysql", "postgresql", "mongodb", "redis", "python", "r"],
  },
  {
    id: "qualidade",
    title: "Testes e QA",
    description: "Da ideia de qualidade à automação web, mobile e APIs.",
    items: [
      "qa",
      "selenium",
      "cypress",
      "playwright",
      "appium",
      "maestro",
      "rest assured",
    ],
  },
  {
    id: "devops",
    title: "Ambiente e DevOps",
    description: "Prepare sua máquina, terminal, containers e Linux.",
    items: ["linux", "wsl2", "bash", "git", "docker", "devops", "vim", "lpi"],
  },
  {
    id: "mobile",
    title: "Mobile",
    description: "Primeiros passos para apps com Flutter, Android, iOS e testes.",
    items: ["dart", "flutter", "kotlin", "swift", "appium", "maestro"],
  },
];

const levelOrder = [
  "Comece aqui",
  "Próximo passo",
  "Depois que praticar",
  "Pendente",
];

const levelPresentation: Record<
  string,
  {
    className: string;
    description: string;
    label: string;
  }
> = {
  "Comece aqui": {
    className: "bg-[#dcfce7] text-[#166534] ring-[#86efac]",
    description: "boa porta de entrada",
    label: "Iniciante",
  },
  "Próximo passo": {
    className: "bg-[#fef3c7] text-[#92400e] ring-[#fcd34d]",
    description: "para continuar praticando",
    label: "Mediano",
  },
  "Depois que praticar": {
    className: "bg-[#fee2e2] text-[#991b1b] ring-[#fca5a5]",
    description: "para aprofundar",
    label: "Avançado",
  },
  Pendente: {
    className: "bg-[#f3f4f6] text-[#4b5563] ring-[#d1d5db]",
    description: "ainda sem classificação",
    label: "A classificar",
  },
};

function getLevelPresentation(level: string) {
  return (
    levelPresentation[level] ?? {
      className: "bg-[#f3f4f6] text-[#4b5563] ring-[#d1d5db]",
      description: "nível personalizado",
      label: level,
    }
  );
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function formatTitle(title: string) {
  return title.replace(/4noobs$/i, "").replaceAll("-", " ");
}

function getMaterialMeta(material: MaterialItem) {
  return materialTaxonomy[normalize(material.title)] ?? fallbackMeta;
}

function getAuthorInfo(githubUrl: string): AuthorInfo | null {
  try {
    const url = new URL(githubUrl);

    if (!url.hostname.includes("github.com")) {
      return null;
    }

    const owner = url.pathname.split("/").filter(Boolean)[0];

    if (!owner) {
      return null;
    }

    return {
      avatarUrl: `https://github.com/${owner}.png`,
      name: `@${owner}`,
      profileUrl: `https://github.com/${owner}`,
    };
  } catch {
    return null;
  }
}

function buildOptions(values: string[], allLabel: string) {
  return [
    allLabel,
    ...Array.from(new Set(values)).sort((first, second) =>
      first.localeCompare(second, "pt-BR"),
    ),
  ];
}

function sortMaterials(
  materials: EnrichedMaterial[],
  activeRoadmap: Roadmap | undefined,
) {
  if (activeRoadmap) {
    const order = new Map(
      activeRoadmap.items.map((title, index) => [title, index]),
    );

    return materials.toSorted(
      (first, second) =>
        (order.get(normalize(first.title)) ?? 999) -
        (order.get(normalize(second.title)) ?? 999),
    );
  }

  return materials.toSorted((first, second) => {
    const levelDiff =
      levelOrder.indexOf(first.level) - levelOrder.indexOf(second.level);

    if (levelDiff !== 0) {
      return levelDiff;
    }

    return first.title.localeCompare(second.title, "pt-BR");
  });
}

export function MaterialsExplorer({ materials }: { materials: MaterialItem[] }) {
  const [query, setQuery] = useState("");
  const [selectedArea, setSelectedArea] = useState("Todas as areas");
  const [selectedFormat, setSelectedFormat] = useState("Todos os formatos");
  const [selectedLevel, setSelectedLevel] = useState("Todos os níveis");
  const [selectedRoadmapId, setSelectedRoadmapId] = useState("comece-aqui");

  const enrichedMaterials = useMemo(
    () =>
      materials.map((material) => ({
        ...material,
        ...getMaterialMeta(material),
        author: getAuthorInfo(material.githubUrl),
      })),
    [materials],
  );

  const activeRoadmap = roadmaps.find(
    (roadmap) => roadmap.id === selectedRoadmapId,
  );

  useEffect(() => {
    function handleNavbarSearch(event: Event) {
      const detail = (event as CustomEvent<MaterialSearchEventDetail>).detail;

      if (typeof detail?.query === "string") {
        setQuery(detail.query);
      }
    }

    window.addEventListener(MATERIAL_SEARCH_SET_EVENT, handleNavbarSearch);

    return () => {
      window.removeEventListener(MATERIAL_SEARCH_SET_EVENT, handleNavbarSearch);
    };
  }, []);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent<MaterialSearchEventDetail>(MATERIAL_SEARCH_SYNC_EVENT, {
        detail: { query },
      }),
    );
  }, [query]);

  const areaOptions = useMemo(
    () =>
      buildOptions(
        enrichedMaterials.map((material) => material.area),
        "Todas as areas",
      ),
    [enrichedMaterials],
  );

  const formatOptions = useMemo(
    () =>
      buildOptions(
        enrichedMaterials.map((material) => material.format),
        "Todos os formatos",
      ),
    [enrichedMaterials],
  );

  const levelOptions = useMemo(
    () => [
      "Todos os níveis",
      ...levelOrder.filter((level) =>
        enrichedMaterials.some((material) => material.level === level),
      ),
    ],
    [enrichedMaterials],
  );

  const filteredMaterials = useMemo(() => {
    const normalizedQuery = normalize(query);
    const roadmapItems = new Set(activeRoadmap?.items ?? []);
    const hasQuery = normalizedQuery.length > 0;
    const filtered = enrichedMaterials.filter((material) => {
      const normalizedTitle = normalize(material.title);
      const matchesRoadmap =
        hasQuery || !activeRoadmap || roadmapItems.has(normalizedTitle);
      const matchesQuery =
        !hasQuery ||
        normalize(
          `${material.title} ${material.description} ${material.area} ${material.format} ${material.level} ${getLevelPresentation(material.level).label} ${material.author?.name ?? ""}`,
        ).includes(normalizedQuery);
      const matchesArea =
        selectedArea === "Todas as areas" || material.area === selectedArea;
      const matchesFormat =
        selectedFormat === "Todos os formatos" ||
        material.format === selectedFormat;
      const matchesLevel =
        selectedLevel === "Todos os níveis" ||
        material.level === selectedLevel;

      return (
        matchesRoadmap &&
        matchesQuery &&
        matchesArea &&
        matchesFormat &&
        matchesLevel
      );
    });

    return sortMaterials(filtered, activeRoadmap);
  }, [
    activeRoadmap,
    enrichedMaterials,
    query,
    selectedArea,
    selectedFormat,
    selectedLevel,
  ]);

  const pendingCount = enrichedMaterials.filter(
    (material) =>
      material.area === "Pendente" ||
      material.format === "Pendente" ||
      material.level === "Pendente",
  ).length;
  const searchIgnoresRoadmap =
    query.trim().length > 0 && selectedRoadmapId !== "all";

  const activeFilters =
    Number(selectedRoadmapId !== "all") +
    Number(selectedArea !== "Todas as areas") +
    Number(selectedFormat !== "Todos os formatos") +
    Number(selectedLevel !== "Todos os níveis") +
    Number(query.trim().length > 0);

  function clearFilters() {
    setQuery("");
    setSelectedArea("Todas as areas");
    setSelectedFormat("Todos os formatos");
    setSelectedLevel("Todos os níveis");
    setSelectedRoadmapId("all");
  }

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--he4rt-purple)]">
              Trilhas sugeridas
            </p>
            <h2 className="mt-1 text-2xl font-bold text-[var(--he4rt-ink)]">
              Escolha uma trilha para começar
            </h2>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <RoadmapCard
            active={selectedRoadmapId === "all"}
            description="Veja todos os materiais sincronizados em uma única lista."
            meta={`${materials.length} materiais`}
            onSelect={() => setSelectedRoadmapId("all")}
            title="Todo o acervo"
          />

          {roadmaps.map((roadmap) => (
            <RoadmapCard
              key={roadmap.id}
              active={selectedRoadmapId === roadmap.id}
              description={roadmap.description}
              meta={`${roadmap.items.length} passos`}
              onSelect={() => setSelectedRoadmapId(roadmap.id)}
              title={roadmap.title}
            />
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-[var(--he4rt-border)] bg-white p-4 shadow-sm backdrop-blur sm:p-5">
        <div className="grid gap-4 xl:grid-cols-[minmax(220px,1fr)_180px_210px_190px_auto] xl:items-end">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--he4rt-purple)]">
              Buscar
            </span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Python, HTML, Git, testes..."
              className="mt-2 h-11 w-full rounded-md border border-[var(--he4rt-border)] bg-[var(--he4rt-bg-soft)] px-3 text-sm text-[var(--he4rt-ink)] outline-none transition placeholder:text-[#9a8eb1] focus:border-[var(--he4rt-purple)] focus:bg-white focus:ring-4 focus:ring-[var(--he4rt-purple-soft)]"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--he4rt-purple)]">
              Area
            </span>
            <select
              value={selectedArea}
              onChange={(event) => setSelectedArea(event.target.value)}
              className="mt-2 h-11 w-full rounded-md border border-[var(--he4rt-border)] bg-[var(--he4rt-bg-soft)] px-3 text-sm font-medium text-[var(--he4rt-ink)] outline-none transition focus:border-[var(--he4rt-purple)] focus:bg-white focus:ring-4 focus:ring-[var(--he4rt-purple-soft)]"
            >
              {areaOptions.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--he4rt-purple)]">
              Formato
            </span>
            <select
              value={selectedFormat}
              onChange={(event) => setSelectedFormat(event.target.value)}
              className="mt-2 h-11 w-full rounded-md border border-[var(--he4rt-border)] bg-[var(--he4rt-bg-soft)] px-3 text-sm font-medium text-[var(--he4rt-ink)] outline-none transition focus:border-[var(--he4rt-purple)] focus:bg-white focus:ring-4 focus:ring-[var(--he4rt-purple-soft)]"
            >
              {formatOptions.map((format) => (
                <option key={format} value={format}>
                  {format}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--he4rt-purple)]">
              Nível
            </span>
            <select
              value={selectedLevel}
              onChange={(event) => setSelectedLevel(event.target.value)}
              className="mt-2 h-11 w-full rounded-md border border-[var(--he4rt-border)] bg-[var(--he4rt-bg-soft)] px-3 text-sm font-medium text-[var(--he4rt-ink)] outline-none transition focus:border-[var(--he4rt-purple)] focus:bg-white focus:ring-4 focus:ring-[var(--he4rt-purple-soft)]"
            >
              {levelOptions.map((level) => (
                <option key={level} value={level}>
                  {getLevelPresentation(level).label}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={clearFilters}
            disabled={activeFilters === 0}
            className="h-11 rounded-md border border-[var(--he4rt-border)] px-4 text-sm font-semibold text-[var(--he4rt-purple-deep)] transition hover:border-[var(--he4rt-purple)] hover:bg-[var(--he4rt-purple-soft)] disabled:cursor-not-allowed disabled:border-[#ece7f3] disabled:text-[#b9aec8] disabled:hover:bg-transparent"
          >
            Limpar
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {levelOrder.slice(0, 3).map((level) => {
            const levelInfo = getLevelPresentation(level);

            return (
              <span
                key={level}
                className={`inline-flex rounded-md px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${levelInfo.className}`}
              >
                {levelInfo.label}: {levelInfo.description}
              </span>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-[var(--he4rt-muted)]">
          <strong className="text-[var(--he4rt-ink)]">{filteredMaterials.length}</strong>
          <span>de {materials.length} materiais visíveis</span>
          {activeRoadmap ? (
            <span className="rounded-md bg-[var(--he4rt-purple-soft)] px-2 py-1 text-xs font-semibold text-[var(--he4rt-purple-deep)]">
              {activeRoadmap.title}
            </span>
          ) : null}
          {searchIgnoresRoadmap ? (
            <span className="rounded-md bg-[var(--he4rt-pink-soft)] px-2 py-1 text-xs font-semibold text-[var(--he4rt-pink)]">
              busca em todo o acervo
            </span>
          ) : null}
          {pendingCount > 0 ? (
            <span className="rounded-md bg-[#fff0cc] px-2 py-1 text-xs font-semibold text-[#765a13]">
              {pendingCount} pendente{pendingCount > 1 ? "s" : ""}
            </span>
          ) : null}
        </div>
      </section>

      {filteredMaterials.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[var(--he4rt-border)] bg-white/85 p-8">
          <h2 className="text-2xl font-semibold text-[var(--he4rt-ink)]">
            Nenhum material encontrado
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--he4rt-muted)]">
            Tente uma busca mais simples ou veja todo o acervo para retomar a
            exploração.
          </p>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {filteredMaterials.map((material) => (
          <MaterialCard
            key={material.id}
            material={material}
            step={
              activeRoadmap
                ? activeRoadmap.items.indexOf(normalize(material.title)) + 1
                : null
            }
          />
        ))}
      </div>
    </div>
  );
}

function RoadmapCard({
  active,
  description,
  meta,
  onSelect,
  title,
}: {
  active: boolean;
  description: string;
  meta: string;
  onSelect: () => void;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={
        active
          ? "min-h-[150px] rounded-lg border border-[var(--he4rt-purple)] bg-[var(--he4rt-purple-deep)] p-4 text-left text-white shadow-lg shadow-[var(--he4rt-purple)]/15"
          : "min-h-[150px] rounded-lg border border-[var(--he4rt-border)] bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--he4rt-purple)] hover:bg-[var(--he4rt-purple-soft)]"
      }
    >
      <span
        className={
          active
            ? "text-xs font-semibold uppercase tracking-[0.14em] text-[var(--he4rt-pink)]"
            : "text-xs font-semibold uppercase tracking-[0.14em] text-[var(--he4rt-purple)]"
        }
      >
        {meta}
      </span>
      <strong className="mt-2 block text-lg leading-tight">{title}</strong>
      <span
        className={
          active
            ? "mt-2 block text-sm leading-5 text-[var(--he4rt-muted-invert)]"
            : "mt-2 block text-sm leading-5 text-[var(--he4rt-muted)]"
        }
      >
        {description}
      </span>
    </button>
  );
}

function MaterialCard({
  material,
  step,
}: {
  material: EnrichedMaterial;
  step: number | null;
}) {
  const levelInfo = getLevelPresentation(material.level);

  return (
    <article className="group flex min-h-[330px] flex-col rounded-lg border border-[var(--he4rt-border)] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--he4rt-purple)] hover:shadow-lg">
      <div className="min-w-0">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-md bg-[var(--he4rt-bg)] px-2.5 py-1 text-xs font-semibold text-white">
            {material.area}
          </span>
          {step ? (
            <span className="rounded-md bg-[var(--he4rt-pink-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--he4rt-pink)]">
              Passo {step}
            </span>
          ) : null}
          <span
            className={`rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${levelInfo.className}`}
          >
            {levelInfo.label}
          </span>
        </div>

        <h2 className="mt-4 text-xl font-bold capitalize leading-tight text-[var(--he4rt-ink)]">
          {formatTitle(material.title)}
        </h2>

        <p className="mt-2 text-sm font-semibold text-[var(--he4rt-purple)]">
          {material.format}
        </p>

        <p className="mt-3 line-clamp-4 text-sm leading-6 text-[var(--he4rt-muted)]">
          {material.description}
        </p>
      </div>

      <div className="mt-auto flex flex-col gap-4 border-t border-[var(--he4rt-border)] pt-4">
        {material.author ? (
          <a
            href={material.author.profileUrl}
            target="_blank"
            rel="noreferrer"
            className="flex min-w-0 items-center gap-3 text-sm text-[var(--he4rt-muted)] transition hover:text-[var(--he4rt-purple-deep)]"
          >
            <Image
              src={material.author.avatarUrl}
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 shrink-0 rounded-full border border-[var(--he4rt-border)] bg-[var(--he4rt-bg-soft)]"
            />
            <span className="min-w-0">
              <span className="block text-xs font-medium text-[var(--he4rt-muted)]">
                Autor no GitHub
              </span>
              <span className="block truncate font-semibold">
                {material.author.name}
              </span>
            </span>
          </a>
        ) : (
          <div className="text-sm text-[var(--he4rt-muted)]">
            Autor não informado
          </div>
        )}

        <a
          href={material.githubUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-10 w-full shrink-0 items-center justify-center rounded-md bg-[var(--he4rt-purple)] px-4 text-sm font-semibold text-white transition hover:bg-[var(--he4rt-purple-deep)] focus:outline-none focus:ring-4 focus:ring-[var(--he4rt-purple-soft)]"
        >
          Abrir material
        </a>
      </div>
    </article>
  );
}
