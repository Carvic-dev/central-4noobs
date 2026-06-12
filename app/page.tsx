import { desc } from "drizzle-orm";
import { connection } from "next/server";
import { getDb } from "../db";
import { materials } from "../db/schema";
import { MaterialsExplorer, type MaterialItem } from "./materials-explorer";
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
          : "Nao foi possivel carregar os materiais.",
    };
  }
}

function He4rtMark() {
  return (
    <div
      aria-hidden="true"
      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-[#5b21b6] text-xl font-black tracking-tight text-white shadow-lg shadow-[#5b21b6]/20"
    >
      h4
    </div>
  );
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
      label: "Site He4rt Developers",
      href: "https://heartdevs.com/",
    },
    {
      label: "Canal he4rtsdevs",
      href: "https://www.youtube.com/@he4rtsdevs",
    },
    {
      label: "Projeto original 4noobs",
      href: "https://github.com/he4rt/4noobs",
    },
  ];

  return (
    <main className="min-h-screen bg-[#fff9ff] text-[#241632]">
      <section className="border-b border-[#eadcff] bg-[#f6efff]">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-10 sm:px-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4">
              <He4rtMark />
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6d28d9]">
                  He4rt Developers
                </p>
                <p className="mt-1 text-sm font-medium text-[#8a719f]">
                  da comunidade para a comunidade
                </p>
              </div>
            </div>
            <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">
              Materiais 4noobs com caminhos simples para estudar.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-[#6f627f]">
              Encontre guias da comunidade He4rt por trilha, area e momento de
              aprendizado, sem precisar entender GitHub antes de comecar.
            </p>
          </div>

          <SyncButton />
        </div>
      </section>

      <section className="border-b border-[#eee7f8] bg-white">
        <div className="mx-auto grid w-full max-w-6xl gap-4 px-5 py-6 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
          <a
            href="https://heartdevs.com/"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-[#eadcff] bg-[#fbf7ff] p-5 shadow-sm shadow-[#5b21b6]/5 transition hover:border-[#c7b0f6] hover:bg-white"
          >
            <p className="text-sm text-[#6d28d9]">Comunidade principal</p>
            <strong className="mt-2 block text-xl">He4rt Developers</strong>
          </a>
          <a
            href="https://www.youtube.com/@he4rtsdevs"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-[#eadcff] bg-[#fbf7ff] p-5 shadow-sm shadow-[#5b21b6]/5 transition hover:border-[#c7b0f6] hover:bg-white"
          >
            <p className="text-sm text-[#6d28d9]">Canal principal</p>
            <strong className="mt-2 block text-xl">he4rtsdevs</strong>
          </a>
          <a
            href="https://github.com/he4rt/4noobs"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-[#eadcff] bg-[#fbf7ff] p-5 shadow-sm shadow-[#5b21b6]/5 transition hover:border-[#c7b0f6] hover:bg-white"
          >
            <p className="text-sm text-[#6d28d9]">Projeto original</p>
            <strong className="mt-2 block text-xl">he4rt/4noobs</strong>
          </a>
          <div className="rounded-lg border border-[#eadcff] bg-[#fbf7ff] p-5 shadow-sm shadow-[#5b21b6]/5">
            <p className="text-sm text-[#6d28d9]">Arquivos sincronizados</p>
            <strong className="mt-2 block text-xl">{total}</strong>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-6 sm:px-8">
        <div className="rounded-lg border border-[#eadcff] bg-[#fffdf8] p-5 shadow-sm shadow-[#5b21b6]/5">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#6d28d9]">
            Aviso importante
          </p>
          <div className="mt-3 grid gap-4 text-sm leading-6 text-[#6f627f] lg:grid-cols-[1.1fr_0.9fr]">
            <p>
              Este hub foi feito de aluno/iniciante para aluno/iniciante.
              Nenhum dos conteudos listados aqui e de minha autoria; a ideia e
              apenas facilitar o acesso aos materiais para quem ainda nao tem
              familiaridade com GitHub.
            </p>
            <p>
              Em muitos cursos, o conteudo principal fica dentro da pasta{" "}
              <code className="rounded bg-[#f5efff] px-1.5 py-0.5 text-[#5f4b8b]">
                src
              </code>{" "}
              do repositorio. Visite os links originais, leia as instrucoes de
              cada projeto e apoie os criadores que produziram os materiais.
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {communityLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-md border border-[#eadcff] bg-white px-3 py-2 text-sm font-semibold text-[#5b21b6] transition hover:border-[#c7b0f6] hover:bg-[#fbf7ff]"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 pb-14 sm:px-8">
        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-800">
            <p className="font-semibold">Nao consegui carregar o banco.</p>
            <p className="mt-2 text-sm">{error}</p>
          </div>
        ) : null}

        {!error && materialList.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[#d6c8ef] bg-white p-8">
            <h2 className="text-2xl font-semibold text-[#2f2446]">
              Nenhum material ainda
            </h2>
            <p className="mt-3 max-w-2xl text-[#6f627f]">
              Rode a sincronizacao para buscar os materiais listados no README
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
