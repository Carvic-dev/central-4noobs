import { NextResponse } from "next/server";
import { getDb } from "../../../db";
import { materials } from "../../../db/schema";

type MaterialFromReadme = {
  title: string;
  description: string;
  githubUrl: string;
};

const README_URL =
  "https://raw.githubusercontent.com/he4rt/4noobs/master/README.MD";

function extractMarkdownLink(value: string) {
  const match = value.match(/\[([^\]]+)\]\(([^)]+)\)/);

  if (!match) {
    return { text: cleanMarkdown(value), url: "" };
  }

  return {
    text: cleanMarkdown(match[1]),
    url: match[2].trim(),
  };
}

function cleanMarkdown(value: string) {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`]/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

function normalizeUrl(value: string) {
  try {
    return new URL(value, "https://github.com/he4rt/4noobs/").toString();
  } catch {
    return "";
  }
}

function parseMaterialsFromReadme(markdown: string): MaterialFromReadme[] {
  const seenUrls = new Set<string>();
  const parsedMaterials: MaterialFromReadme[] = [];

  for (const line of markdown.split(/\r?\n/)) {
    const trimmedLine = line.trim();

    if (!trimmedLine.startsWith("|") || !trimmedLine.endsWith("|")) {
      continue;
    }

    const columns = trimmedLine
      .slice(1, -1)
      .split("|")
      .map((column) => column.trim());

    if (columns.length < 4) {
      continue;
    }

    const [titleColumn, descriptionColumn, , linkColumn] = columns;
    const title = cleanMarkdown(titleColumn);
    const description = cleanMarkdown(descriptionColumn);
    const { url } = extractMarkdownLink(linkColumn);
    const githubUrl = normalizeUrl(url);

    if (
      !title ||
      !description ||
      !githubUrl ||
      title.toLowerCase() === "nome" ||
      /^-+$/.test(title) ||
      seenUrls.has(githubUrl)
    ) {
      continue;
    }

    seenUrls.add(githubUrl);
    parsedMaterials.push({ title, description, githubUrl });
  }

  return parsedMaterials;
}

export async function POST() {
  try {
    const db = getDb();
    const timeoutSignal = AbortSignal.timeout(30_000);

    const response = await fetch(README_URL, {
      headers: {
        "User-Agent": "App-Central-4noobs-Carlos",
        Accept: "text/plain;charset=utf-8",
      },
      signal: timeoutSignal,
    });

    if (!response.ok) {
      throw new Error(`O GitHub recusou o acesso. Status: ${response.status}`);
    }

    const markdown = await response.text();
    const formattedData = parseMaterialsFromReadme(markdown);

    if (formattedData.length === 0) {
      throw new Error("Nao encontrei materiais no README do 4noobs.");
    }

    if (formattedData.length > 0) {
      await db
        .insert(materials)
        .values(formattedData)
        .onConflictDoNothing({ target: materials.githubUrl });
    }

    return NextResponse.json({
      message: "Sincronizacao concluida com sucesso!",
      totalEncontrado: formattedData.length,
    });
  } catch (error) {
    const isTimeout =
      error instanceof Error &&
      (error.name === "AbortError" || error.name === "TimeoutError");
    const isNetworkError =
      error instanceof TypeError && error.message === "fetch failed";
    const message = isTimeout
      ? "A conexao com o GitHub demorou demais. Tente novamente em alguns instantes."
      : isNetworkError
        ? "Nao consegui conectar ao GitHub agora. Verifique sua conexao e tente novamente."
      : error instanceof Error
        ? error.message
        : "Erro desconhecido";

    console.error("Erro ao sincronizar materiais:", error);

    return NextResponse.json(
      {
        error: "Erro ao sincronizar com o GitHub",
        detalhes: message,
      },
      { status: 500 },
    );
  }
}

export const GET = POST;
