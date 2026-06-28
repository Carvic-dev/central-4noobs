import { desc } from "drizzle-orm";
import { connection } from "next/server";
import { getDb } from "../db";
import { materials } from "../db/schema";
import { MaterialsExplorer, type MaterialItem } from "./materials-explorer";
import { NavbarSearch } from "./navbar-search";
import { SyncButton } from "./sync-button";

type Material = {
  id: number;
  title: string;
  description: string | null;
  githubUrl: string;
  createdAt: Date;
};

async function getMaterials() {
  await connection();

  try {
    const db = getDb();

    return {
      materials: await db
        .select()
        .from(materials)
        .orderBy(desc(materials.createdAt)),
      error: "",
    };
  } catch (error) {
    return {
      materials: [] as Material[],
      error:
        error instanceof Error
          ? error.message
          : "Não foi possível carregar os materiais.",
    };
  }
}

export default async function Home() {
  const { materials: materialList, error } = await getMaterials();
  const total = materialList.length;
  const explorerMaterials: MaterialItem[] = materialList.map((material) => ({
    id: material.id,
    title: material.title,
    description: material.description || "Material 4noobs da comunidade.",
    githubUrl: material.githubUrl,
  }));
  const communityLinks = [
    {
      label: "Site oficial",
      title: "He4rt Developers",
      href: "https://heartdevs.com/",
      description: "Conheça a comunidade e acompanhe os projetos oficiais.",
    },
    {
      label: "Discord",
      title: "Entrar na He4rt",
      href: "https://discord.com/invite/he4rt",
      description:
        "Participe das conversas, tire dúvidas e encontre pessoas estudando.",
    },
    {
      label: "Projeto original",
      title: "he4rt/4noobs",
      href: "https://github.com/he4rt/4noobs",
      description: "Visite o repositório, dê uma estrela e apoie os criadores.",
    },
  ];

  return (
    <main className="min-h-screen bg-[var(--he4rt-bg-soft)] text-[var(--he4rt-ink)]">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[rgba(16,5,31,0.95)] text-white shadow-lg shadow-black/10 backdrop-blur">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-5 py-2 sm:px-8 lg:grid-cols-[190px_minmax(240px,380px)_minmax(0,1fr)_auto] lg:gap-3 lg:py-3">
          <a
            href="#inicio"
            className="col-start-1 row-start-1 w-fit rounded-md outline-none transition focus:ring-4 focus:ring-white/15 lg:col-start-1 lg:row-start-1"
          >
            <strong className="block text-base font-black leading-none tracking-[0.08em]">
              4noobs hub
            </strong>
            <span className="mt-1 block text-xs font-medium text-[var(--he4rt-muted-invert)]">
              He4rt Developers
            </span>
          </a>

          <div className="col-span-2 row-start-2 min-w-0 lg:col-span-1 lg:col-start-2 lg:row-start-1">
            <NavbarSearch />
          </div>

          <nav
            aria-label="Navegação principal"
            className="col-span-2 row-start-3 grid grid-cols-4 gap-1 rounded-lg border border-white/10 bg-white/[0.06] p-1 text-xs font-semibold text-[var(--he4rt-muted-invert)] sm:text-sm lg:col-span-1 lg:col-start-3 lg:row-start-1 lg:flex lg:items-center lg:justify-center"
          >
            <a
              href="#inicio"
              className="rounded-md px-2 py-1.5 text-center transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-[var(--he4rt-pink)] sm:px-3 lg:py-2"
            >
              Início
            </a>
            <a
              href="#comunidade"
              className="rounded-md px-2 py-1.5 text-center transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-[var(--he4rt-pink)] sm:px-3 lg:py-2"
            >
              Apoiar
            </a>
            <a
              href="#avisos"
              className="rounded-md px-2 py-1.5 text-center transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-[var(--he4rt-pink)] sm:px-3 lg:py-2"
            >
              Avisos
            </a>
            <a
              href="#trilhas"
              className="rounded-md bg-[var(--he4rt-pink)] px-2 py-1.5 text-center text-white shadow-sm shadow-black/20 transition hover:bg-[#c92d72] focus:outline-none focus:ring-2 focus:ring-white sm:px-3 lg:py-2"
            >
              Trilhas
            </a>
          </nav>

          <div className="col-start-2 row-start-1 justify-self-end lg:col-start-4 lg:row-start-1">
            <SyncButton />
          </div>
        </div>
      </header>

      <section
        id="inicio"
        className="scroll-mt-24 border-b border-[var(--he4rt-purple-deep)] bg-[var(--he4rt-bg)] text-white"
      >
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--he4rt-pink)]">
              He4rt Developers
            </p>
            <p className="mt-1 text-sm font-medium text-[var(--he4rt-muted-invert)]">
              Da comunidade para a comunidade
            </p>
            <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl">
              Materiais 4noobs com caminhos simples para estudar.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--he4rt-muted-invert)]">
              Encontre guias da comunidade He4rt por trilha, área e momento de
              aprendizado, sem precisar entender GitHub antes de começar.
            </p>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-black/10">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--he4rt-pink)]">
              Acervo sincronizado
            </p>
            <strong className="mt-2 block text-5xl">{total}</strong>
            <p className="mt-2 text-sm leading-6 text-[var(--he4rt-muted-invert)]">
              arquivos reunidos para você escolher um caminho de estudo e
              continuar sem se perder no GitHub.
            </p>
          </div>
        </div>
      </section>

      <section
        id="comunidade"
        className="scroll-mt-24 border-b border-[var(--he4rt-purple-deep)] bg-[var(--he4rt-bg)] text-white"
      >
        <div className="mx-auto grid w-full max-w-7xl gap-5 px-5 py-6 sm:px-8 lg:grid-cols-[280px_1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--he4rt-pink)]">
              Apoie a comunidade
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              Valorize quem criou os materiais.
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--he4rt-muted-invert)]">
              Use os canais oficiais para conhecer a He4rt, entrar no Discord e
              visitar o projeto original.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {communityLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-white/10 bg-white/[0.07] p-4 shadow-sm shadow-black/10 transition hover:-translate-y-0.5 hover:border-[var(--he4rt-pink)] hover:bg-white/[0.12]"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--he4rt-pink)]">
                  {link.label}
                </span>
                <strong className="mt-2 block text-lg leading-tight">
                  {link.title}
                </strong>
                <span className="mt-2 block text-sm leading-6 text-[var(--he4rt-muted-invert)]">
                  {link.description}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section
        id="avisos"
        className="mx-auto w-full max-w-7xl scroll-mt-24 px-5 py-5 sm:px-8"
      >
        <div className="relative overflow-hidden rounded-lg border border-[var(--he4rt-pink)] bg-[linear-gradient(135deg,#fff0f7_0%,#f7edff_58%,#ffffff_100%)] p-5 shadow-lg shadow-[var(--he4rt-pink)]/10 lg:p-6">
          <div className="absolute inset-y-0 left-0 w-1.5 bg-[var(--he4rt-pink)]" />
          <div className="grid gap-4 pl-2 sm:pl-3 lg:grid-cols-[240px_1fr] lg:items-start">
            <div>
              <p className="inline-flex rounded-md bg-[var(--he4rt-pink)] px-3 py-1.5 text-sm font-semibold uppercase tracking-[0.14em] text-white">
                Aviso importante
              </p>
              <p className="mt-3 text-sm font-medium text-[var(--he4rt-purple-deep)]">
                Leia antes de abrir os materiais.
              </p>
            </div>
            <div className="grid gap-4 text-sm leading-6 text-[var(--he4rt-ink)] lg:grid-cols-2">
              <p>
                Este hub foi feito de aluno iniciante para aluno iniciante.
                Nenhum dos conteúdos listados aqui é de minha autoria. A ideia é
                apenas facilitar o acesso aos materiais para quem ainda não tem
                familiaridade com GitHub.
              </p>
              <p>
                Em muitos repositórios, o conteúdo fica organizado em pastas.
                Navegue por elas, leia as instruções de cada projeto e apoie os
                criadores originais.
              </p>
              <div className="border-t border-[var(--he4rt-pink)]/30 pt-4 lg:col-span-2">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--he4rt-pink)]">
                  Apoio aos criadores
                </p>
                <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="max-w-3xl text-sm leading-6">
                    Se algum material te ajudou, visite o repositório original,
                    dê uma estrela e compartilhe o trabalho de quem produziu o
                    conteúdo.
                  </p>
                  <a
                    href="https://github.com/he4rt/4noobs"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-10 shrink-0 items-center justify-center rounded-md bg-[var(--he4rt-purple-deep)] px-4 text-sm font-semibold text-white transition hover:bg-[var(--he4rt-purple)]"
                  >
                    Ver projeto original
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="trilhas"
        className="mx-auto w-full max-w-7xl scroll-mt-24 px-5 pb-14 sm:px-8"
      >
        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-800">
            <p className="font-semibold">Não consegui carregar o banco.</p>
            <p className="mt-2 text-sm">{error}</p>
          </div>
        ) : null}

        {!error && materialList.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[#d6c8ef] bg-white p-8">
            <h2 className="text-2xl font-semibold text-[#2f2446]">
              Nenhum material ainda
            </h2>
            <p className="mt-3 max-w-2xl text-[#6f627f]">
              Rode a sincronização para buscar os materiais listados no README
              do 4noobs e salvar tudo no banco.
            </p>
          </div>
        ) : null}

        {!error && materialList.length > 0 ? (
          <MaterialsExplorer materials={explorerMaterials} />
        ) : null}
      </section>
    </main>
  );
}
