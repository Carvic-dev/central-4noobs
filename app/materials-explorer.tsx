"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

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
    level: "Proximo passo",
  },
  angular: {
    area: "Web",
    format: "Framework para praticar",
    level: "Proximo passo",
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
    level: "Proximo passo",
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
    level: "Proximo passo",
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
    level: "Proximo passo",
  },
  dart: {
    area: "Mobile",
    format: "Curso de linguagem",
    level: "Comece aqui",
  },
  devops: {
    area: "DevOps e ambiente",
    format: "Area para conhecer",
    level: "Proximo passo",
  },
  django: {
    area: "Back-end",
    format: "Framework para praticar",
    level: "Proximo passo",
  },
  docker: {
    area: "DevOps e ambiente",
    format: "Ferramenta do dia a dia",
    level: "Proximo passo",
  },
  elixir: {
    area: "Fundamentos",
    format: "Curso de linguagem",
    level: "Depois que praticar",
  },
  flutter: {
    area: "Mobile",
    format: "Framework para praticar",
    level: "Proximo passo",
  },
  git: {
    area: "Ferramentas",
    format: "Ferramenta do dia a dia",
    level: "Comece aqui",
  },
  go: {
    area: "Back-end",
    format: "Curso de linguagem",
    level: "Proximo passo",
  },
  graphql: {
    area: "Back-end",
    format: "Conceito essencial",
    level: "Proximo passo",
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
    format: "Certificacao",
    level: "Depois que praticar",
  },
  maestro: {
    area: "Qualidade",
    format: "Ferramenta do dia a dia",
    level: "Proximo passo",
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
    level: "Proximo passo",
  },
  nextjs: {
    area: "Web",
    format: "Framework para praticar",
    level: "Proximo passo",
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
    level: "Proximo passo",
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
    format: "Area para conhecer",
    level: "Comece aqui",
  },
  r: {
    area: "Dados",
    format: "Curso de linguagem",
    level: "Proximo passo",
  },
  redis: {
    area: "Dados",
    format: "Banco de dados",
    level: "Proximo passo",
  },
  regex: {
    area: "Fundamentos",
    format: "Conceito essencial",
    level: "Proximo passo",
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
    level: "Proximo passo",
  },
  spring: {
    area: "Back-end",
    format: "Framework para praticar",
    level: "Proximo passo",
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
    level: "Proximo passo",
  },
  ui: {
    area: "Design e produto",
    format: "Area para conhecer",
    level: "Comece aqui",
  },
  ux: {
    area: "Design e produto",
    format: "Area para conhecer",
    level: "Comece aqui",
  },
  vim: {
    area: "Ferramentas",
    format: "Ferramenta do dia a dia",
    level: "Proximo passo",
  },
  vue: {
    area: "Web",
    format: "Framework para praticar",
    level: "Proximo passo",
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
    title: "Comece aqui",
    description: "Base curta para ganhar familiaridade com codigo, web e Git.",
    items: ["html", "css", "javascript", "git", "markdown"],
  },
  {
    id: "web-front",
    title: "Web front-end",
    description: "Do HTML ate frameworks, com UI e acessibilidade no caminho.",
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
    description: "Linguagem, dados, API e ambiente para publicar projetos.",
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
    description: "Comece por SQL e avance para bancos e analise com calma.",
    items: ["sql", "mysql", "postgresql", "mongodb", "redis", "python", "r"],
  },
  {
    id: "qualidade",
    title: "Testes e QA",
    description: "Da ideia de qualidade ate automacao web, mobile e APIs.",
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
    description: "Prepare sua maquina, terminal, containers e fundamentos Linux.",
    items: ["linux", "wsl2", "bash", "git", "docker", "devops", "vim", "lpi"],
  },
  {
    id: "mobile",
    title: "Mobile",
    description: "Primeiros passos para apps com Flutter, Android, iOS e testes.",
    items: ["dart", "flutter", "kotlin", "swift", "appium", "maestro"],
  },
];

const levelOrder = ["Comece aqui", "Proximo passo", "Depois que praticar", "Pendente"];

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
  const [selectedLevel, setSelectedLevel] = useState("Todos os momentos");
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
    () =>
      buildOptions(
        enrichedMaterials.map((material) => material.level),
        "Todos os momentos",
      ),
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
          `${material.title} ${material.description} ${material.area} ${material.format} ${material.level} ${material.author?.name ?? ""}`,
        ).includes(normalizedQuery);
      const matchesArea =
        selectedArea === "Todas as areas" || material.area === selectedArea;
      const matchesFormat =
        selectedFormat === "Todos os formatos" ||
        material.format === selectedFormat;
      const matchesLevel =
        selectedLevel === "Todos os momentos" ||
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
    Number(selectedLevel !== "Todos os momentos") +
    Number(query.trim().length > 0);

  function clearFilters() {
    setQuery("");
    setSelectedArea("Todas as areas");
    setSelectedFormat("Todos os formatos");
    setSelectedLevel("Todos os momentos");
    setSelectedRoadmapId("all");
  }

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#7d6aa8]">
              Trilhas sugeridas
            </p>
            <h2 className="mt-1 text-2xl font-bold text-[#2f2446]">
              Caminhos para nao ficar perdido
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setSelectedRoadmapId("all")}
            className={
              selectedRoadmapId === "all"
                ? "h-10 rounded-md bg-[#6f5aa8] px-4 text-sm font-semibold text-white shadow-sm"
                : "h-10 rounded-md border border-[#dfd4f4] bg-white/80 px-4 text-sm font-semibold text-[#5f4b8b] transition hover:border-[#b9a7dc] hover:bg-[#faf7ff]"
            }
          >
            Ver todos
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {roadmaps.map((roadmap) => (
            <button
              key={roadmap.id}
              type="button"
              onClick={() => setSelectedRoadmapId(roadmap.id)}
              className={
                selectedRoadmapId === roadmap.id
                  ? "min-h-[132px] rounded-lg border border-[#b9a7dc] bg-[#f1e9ff] p-4 text-left shadow-sm shadow-[#6f5aa8]/10"
                  : "min-h-[132px] rounded-lg border border-[#eee7f8] bg-white/80 p-4 text-left shadow-sm shadow-[#6f5aa8]/5 transition hover:-translate-y-0.5 hover:border-[#d6c8ef] hover:bg-[#fbf8ff]"
              }
            >
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8d7ab4]">
                {roadmap.items.length} passos
              </span>
              <strong className="mt-2 block text-lg text-[#2f2446]">
                {roadmap.title}
              </strong>
              <span className="mt-2 block text-sm leading-5 text-[#6f627f]">
                {roadmap.description}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-[#e4d8f4] bg-white/85 p-4 shadow-sm shadow-[#6f5aa8]/5 backdrop-blur sm:p-5">
        <div className="grid gap-4 xl:grid-cols-[minmax(220px,1fr)_180px_210px_190px_auto] xl:items-end">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7d6aa8]">
              Buscar
            </span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Python, HTML, Git, testes..."
              className="mt-2 h-11 w-full rounded-md border border-[#dfd4f4] bg-[#fbf8ff] px-3 text-sm text-[#2f2446] outline-none transition placeholder:text-[#9a8eb1] focus:border-[#8d7ab4] focus:bg-white focus:ring-4 focus:ring-[#eee7f8]"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7d6aa8]">
              Area
            </span>
            <select
              value={selectedArea}
              onChange={(event) => setSelectedArea(event.target.value)}
              className="mt-2 h-11 w-full rounded-md border border-[#dfd4f4] bg-[#fbf8ff] px-3 text-sm font-medium text-[#2f2446] outline-none transition focus:border-[#8d7ab4] focus:bg-white focus:ring-4 focus:ring-[#eee7f8]"
            >
              {areaOptions.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7d6aa8]">
              Formato
            </span>
            <select
              value={selectedFormat}
              onChange={(event) => setSelectedFormat(event.target.value)}
              className="mt-2 h-11 w-full rounded-md border border-[#dfd4f4] bg-[#fbf8ff] px-3 text-sm font-medium text-[#2f2446] outline-none transition focus:border-[#8d7ab4] focus:bg-white focus:ring-4 focus:ring-[#eee7f8]"
            >
              {formatOptions.map((format) => (
                <option key={format} value={format}>
                  {format}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7d6aa8]">
              Momento
            </span>
            <select
              value={selectedLevel}
              onChange={(event) => setSelectedLevel(event.target.value)}
              className="mt-2 h-11 w-full rounded-md border border-[#dfd4f4] bg-[#fbf8ff] px-3 text-sm font-medium text-[#2f2446] outline-none transition focus:border-[#8d7ab4] focus:bg-white focus:ring-4 focus:ring-[#eee7f8]"
            >
              {levelOptions.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={clearFilters}
            disabled={activeFilters === 0}
            className="h-11 rounded-md border border-[#dfd4f4] px-4 text-sm font-semibold text-[#5f4b8b] transition hover:border-[#b9a7dc] hover:bg-[#faf7ff] disabled:cursor-not-allowed disabled:border-[#ece7f3] disabled:text-[#b9aec8] disabled:hover:bg-transparent"
          >
            Limpar
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-[#6f627f]">
          <strong className="text-[#2f2446]">{filteredMaterials.length}</strong>
          <span>de {materials.length} materiais visiveis</span>
          {activeRoadmap ? (
            <span className="rounded-md bg-[#ede6ff] px-2 py-1 text-xs font-semibold text-[#5f4b8b]">
              {activeRoadmap.title}
            </span>
          ) : null}
          {searchIgnoresRoadmap ? (
            <span className="rounded-md bg-[#ffe7f4] px-2 py-1 text-xs font-semibold text-[#9f2d68]">
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
        <div className="rounded-lg border border-dashed border-[#d6c8ef] bg-white/85 p-8">
          <h2 className="text-2xl font-semibold text-[#2f2446]">
            Nenhum material encontrado
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6f627f]">
            Tente uma busca mais simples ou veja todo o acervo para retomar a
            exploracao.
          </p>
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
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

function MaterialCard({
  material,
  step,
}: {
  material: EnrichedMaterial;
  step: number | null;
}) {
  const isPending =
    material.area === "Pendente" ||
    material.format === "Pendente" ||
    material.level === "Pendente";

  return (
    <article className="group flex min-h-[286px] flex-col rounded-lg border border-[#eee7f8] bg-white p-5 shadow-sm shadow-[#6f5aa8]/5 transition hover:-translate-y-0.5 hover:border-[#d6c8ef] hover:shadow-lg hover:shadow-[#6f5aa8]/10">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {step ? (
            <span className="rounded-md bg-[#ece5ff] px-2.5 py-1 text-xs font-semibold text-[#5f4b8b]">
              Passo {step}
            </span>
          ) : null}
          <span
            className={
              isPending
                ? "rounded-md bg-[#fff0cc] px-2.5 py-1 text-xs font-semibold text-[#765a13]"
                : "rounded-md bg-[#f1e9ff] px-2.5 py-1 text-xs font-semibold text-[#5f4b8b]"
            }
          >
            {material.level}
          </span>
        </div>
        <span className="rounded-md bg-[#e9f6f0] px-2.5 py-1 text-xs font-semibold text-[#2f6f58]">
          {material.area}
        </span>
      </div>

      <h2 className="mt-4 text-2xl font-bold capitalize leading-tight text-[#2f2446]">
        {formatTitle(material.title)}
      </h2>

      <p className="mt-2 text-sm font-semibold text-[#7d6aa8]">
        {material.format}
      </p>

      <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#6f627f]">
        {material.description}
      </p>

      <div className="mt-5 flex flex-col gap-4 border-t border-[#f0e8fa] pt-4 sm:flex-row sm:items-center sm:justify-between">
        {material.author ? (
          <a
            href={material.author.profileUrl}
            target="_blank"
            rel="noreferrer"
            className="flex min-w-0 items-center gap-3 text-sm text-[#6f627f] transition hover:text-[#4f3c7a]"
          >
            <Image
              src={material.author.avatarUrl}
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 shrink-0 rounded-full border border-[#e4d8f4] bg-[#fbf8ff]"
            />
            <span className="min-w-0">
              <span className="block text-xs font-medium text-[#9a8eb1]">
                Autor no GitHub
              </span>
              <span className="block truncate font-semibold">
                {material.author.name}
              </span>
            </span>
          </a>
        ) : (
          <div className="text-sm text-[#9a8eb1]">Autor nao informado</div>
        )}

        <a
          href={material.githubUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-10 shrink-0 items-center justify-center rounded-md bg-[#6f5aa8] px-4 text-sm font-semibold text-white transition hover:bg-[#5f4b8b] focus:outline-none focus:ring-4 focus:ring-[#e7ddfa]"
        >
          Abrir material
        </a>
      </div>
    </article>
  );
}
