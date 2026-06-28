# Passo a passo do projeto 4noobs Hub

Este documento registra o que foi feito no projeto, as decisoes tomadas e como o sistema esta organizado hoje. A ideia e deixar um guia facil de consultar para continuar evoluindo o hub sem se perder no codigo.

## 1. Objetivo do projeto

O projeto funciona como um hub visual para os materiais do projeto original [`he4rt/4noobs`](https://github.com/he4rt/4noobs).

O foco do hub e ajudar pessoas iniciantes a encontrar materiais com mais facilidade, sem exigir que elas ja saibam navegar bem pelo GitHub.

O hub nao substitui o projeto original e nao assume autoria dos conteudos. Ele apenas organiza e facilita o acesso aos repositorios, reforcando que os usuarios devem apoiar os criadores originais.

## 2. Stack utilizada

- Next.js 16 com App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Drizzle ORM
- PostgreSQL
- Supabase, quando `DATABASE_URL` aponta para Supabase

Comandos principais:

```bash
npm run dev
npm run lint
npx tsc --noEmit
npm run db:push
```

## 3. Como rodar o projeto

1. Instale as dependencias:

```bash
npm install
```

2. Configure o banco no `.env.local`:

```bash
DATABASE_URL="sua-url-do-postgres"
```

3. Aplique o schema no banco:

```bash
npm run db:push
```

4. Rode o projeto:

```bash
npm run dev
```

5. Abra:

```text
http://localhost:3000
```

## 4. Como a sincronizacao com GitHub funciona

O endpoint de sincronizacao esta em:

```text
app/api/sync/route.ts
```

Fluxo atual:

1. O usuario clica em `Sincronizar GitHub`.
2. O app chama `/api/sync`.
3. O endpoint baixa o README original:

```text
https://raw.githubusercontent.com/he4rt/4noobs/master/README.MD
```

4. O parser procura linhas de tabela Markdown.
5. Para cada linha valida, ele extrai:

- nome do material;
- descricao;
- link do repositorio.

6. Os links sao normalizados para URL absoluta.
7. Materiais repetidos sao ignorados usando `githubUrl` como chave unica.
8. Os materiais sao salvos na tabela `materials`.

Tratamentos adicionados/validados:

- timeout para evitar sincronizacao infinita;
- mensagem amigavel quando o GitHub demora;
- mensagem amigavel quando a conexao falha;
- `User-Agent` e `Accept` no fetch para reduzir recusas;
- uso de `onConflictDoNothing` para evitar duplicatas.

## 5. Estrutura principal dos arquivos

```text
app/page.tsx
```

Pagina principal. Busca os materiais no banco, monta o layout geral, exibe hero, navbar, avisos, apoio a comunidade e chama o explorador de materiais.

```text
app/materials-explorer.tsx
```

Componente client que concentra a experiencia de navegacao dos materiais:

- trilhas;
- filtros;
- busca;
- classificacao;
- cards dos materiais;
- autores do GitHub;
- sincronizacao com busca da navbar.

```text
app/navbar-search.tsx
```

Campo de pesquisa da navbar. Filtra os materiais enquanto o usuario digita e, ao enviar, leva para a area de trilhas.

```text
app/material-search-events.ts
```

Eventos compartilhados entre a busca da navbar e o explorador de materiais.

```text
app/sync-button.tsx
```

Botao client que chama `/api/sync`, mostra estado de carregamento, sucesso ou erro e atualiza a pagina.

```text
app/globals.css
```

Variaveis de cor e base visual da identidade.

```text
db/schema.ts
```

Schema Drizzle das tabelas `materials`, `categories` e `levels`.

## 6. Evolucao da UX/UI

### 6.1 Primeira reorganizacao visual

O layout inicial foi reorganizado para ficar mais claro para iniciantes.

Principais mudancas:

- hero mais direto;
- contador de arquivos sincronizados;
- chamada para a comunidade He4rt;
- area de avisos;
- grade de materiais;
- visual mais moderno e menos pesado.

### 6.2 Identidade visual He4rt

A paleta foi ajustada para ficar mais proxima do universo visual da He4rt:

- fundo roxo escuro;
- rosa como cor de destaque;
- tons suaves de lilas;
- cards brancos;
- bordas leves.

Variaveis principais:

```css
--he4rt-bg
--he4rt-bg-elevated
--he4rt-bg-soft
--he4rt-card
--he4rt-ink
--he4rt-muted
--he4rt-muted-invert
--he4rt-purple
--he4rt-purple-deep
--he4rt-purple-soft
--he4rt-pink
--he4rt-pink-soft
--he4rt-border
```

### 6.3 Avisos com destaque

Foi criado um bloco de aviso mais visivel, com fundo rosado/lilas e faixa lateral.

Mensagens principais:

- o hub e feito de aluno iniciante para aluno iniciante;
- os conteudos nao sao de autoria do hub;
- o hub apenas facilita o acesso aos materiais;
- muitos repositorios organizam o conteudo em pastas;
- e importante apoiar os criadores originais.

### 6.4 Apoio a comunidade

A area de comunidade virou um bloco de apoio com destaque.

Links destacados:

- site oficial da He4rt;
- Discord da He4rt;
- projeto original `he4rt/4noobs`.

Tambem foi adicionado um CTA dentro do aviso:

```text
Ver projeto original
```

## 7. Trilhas e organizacao dos materiais

As trilhas foram transformadas em cards, sem scroll lateral.

Trilhas atuais:

- Todo o acervo
- Primeiros passos
- Web front-end
- Back-end
- Dados
- Testes e QA
- Ambiente e DevOps
- Mobile

Cada trilha define uma sequencia sugerida de materiais. Quando uma trilha esta selecionada, os materiais aparecem na ordem definida pela trilha.

Quando o usuario pesquisa, a busca ignora a trilha selecionada e procura no acervo inteiro. Isso evita o problema de a pessoa pesquisar algo e nao encontrar porque esta presa em uma trilha especifica.

## 8. Sistema de niveis

O sistema antigo usava textos como:

- `Comece aqui`
- `Proximo passo`
- `Depois que praticar`

Para deixar mais simples, a interface passou a mostrar:

- `Iniciante`, em verde;
- `Mediano`, em amarelo;
- `Avancado`, em vermelho;
- `A classificar`, em cinza.

Internamente, a classificacao ainda usa os valores originais para evitar quebrar a taxonomia existente, mas a interface apresenta os nomes mais claros para o usuario.

Legenda atual:

```text
Iniciante: boa porta de entrada
Mediano: para continuar praticando
Avancado: para aprofundar
```

## 9. Filtros

O explorador de materiais possui filtros por:

- busca textual;
- area;
- formato;
- nivel.

A busca considera:

- titulo;
- descricao;
- area;
- formato;
- nivel interno;
- nivel apresentado na interface;
- autor do GitHub.

O botao `Limpar` remove filtros e volta para o acervo completo.

## 10. Busca na navbar

Foi criado um campo de pesquisa fixo na navbar.

Comportamento:

1. O usuario digita na navbar.
2. A lista de materiais e filtrada em tempo real.
3. O campo de busca dos filtros recebe o mesmo valor.
4. Se o usuario apertar Enter ou clicar em `Buscar`, a pagina rola ate a area de trilhas.
5. A busca continua procurando em todo o acervo, mesmo que uma trilha esteja selecionada.

Arquivos envolvidos:

```text
app/navbar-search.tsx
app/material-search-events.ts
app/materials-explorer.tsx
```

Eventos usados:

```text
materials-search:set
materials-search:sync
```

## 11. Navbar

A navbar foi reorganizada para ficar mais horizontal e intuitiva.

Itens atuais:

- marca `4noobs hub`;
- busca;
- links `Inicio`, `Apoiar`, `Avisos` e `Trilhas`;
- botao `Sincronizar GitHub`.

No desktop, os itens ficam em linha.

No mobile:

- marca e sincronizacao ficam na primeira linha;
- busca fica em uma linha propria;
- links ficam em grade;
- nao ha scroll lateral.

## 12. Cards dos materiais

Os cards foram ajustados para visualizacao em grade com ate quatro colunas.

Cada card mostra:

- area;
- passo da trilha, quando aplicavel;
- nivel;
- titulo;
- formato;
- descricao;
- autor do GitHub, quando possivel;
- botao para abrir o material.

Os autores sao derivados da URL do GitHub:

```text
https://github.com/{autor}/{repositorio}
```

Com isso, o app monta:

- nome `@autor`;
- avatar `https://github.com/{autor}.png`;
- link para o perfil.

## 13. Textos revisados

Foram feitos ajustes de linguagem para deixar a interface menos travada:

- `Procure no src` virou orientacao para navegar pelas pastas;
- `Momento` virou `Nivel`;
- os niveis ficaram mais objetivos;
- avisos ficaram mais humanos;
- textos foram revisados com acentos e frases mais naturais.

## 14. Validacoes realizadas

Durante as alteracoes, foram usados:

```bash
npx tsc --noEmit
npm run lint
```

Tambem foram feitas verificacoes no navegador em:

```text
http://localhost:3000
```

Pontos checados:

- pagina carregando com status 200;
- busca da navbar funcionando;
- busca da navbar sincronizada com busca dos filtros;
- cards sendo filtrados;
- navbar sem overflow horizontal;
- layout desktop sem overflow;
- layout mobile sem overflow;
- textos antigos removidos da interface visivel.

## 15. Arquivos alterados/criados nesta etapa

Alterados:

```text
app/page.tsx
app/materials-explorer.tsx
app/sync-button.tsx
app/globals.css
```

Criados:

```text
app/navbar-search.tsx
app/material-search-events.ts
docs/passo-a-passo-do-projeto.md
```

## 16. Proximos passos sugeridos

Ideias para continuar:

1. Persistir area, formato e nivel no banco em vez de manter tudo somente na taxonomia do front.
2. Criar uma pagina de detalhe para cada material.
3. Adicionar favoritos locais para o usuario montar sua propria trilha.
4. Mostrar quantos materiais existem por nivel.
5. Adicionar ordenacao por nome, nivel ou area.
6. Criar testes automatizados para o parser do README.
7. Melhorar a acessibilidade com estados ativos na navbar e nos filtros.
8. Criar uma tela de administracao simples para revisar materiais pendentes.

## 17. Resumo curto

O projeto saiu de uma listagem mais simples de materiais para um hub com identidade visual, busca global, filtros, trilhas, niveis por dificuldade, avisos importantes e direcionamento claro para apoiar a comunidade He4rt e os criadores originais.
