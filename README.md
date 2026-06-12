# Central 4Noobs

Hub de conteúdos da **4Noobs**, criado para centralizar materiais, trilhas, links, projetos, guias e recursos úteis para quem está aprendendo tecnologia.

> Projeto em desenvolvimento.

## 📌 Sobre o projeto

A **Central 4Noobs** tem como objetivo reunir conteúdos educacionais de forma simples, organizada e acessível. A ideia é facilitar o acesso a materiais para iniciantes, estudantes e pessoas que querem evoluir na área de tecnologia.

## 🚀 Tecnologias utilizadas

Este projeto foi desenvolvido com:

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [ESLint](https://eslint.org/)
- [PostCSS](https://postcss.org/)

## 📁 Estrutura do projeto

```bash
central-4noobs/
├── app/
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── public/
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── tsconfig.json
└── README.md
```

## ✅ Pré-requisitos

Antes de começar, você precisa ter instalado na sua máquina:

- [Node.js](https://nodejs.org/) `20.9+`
- [npm](https://www.npmjs.com/)
- [Git](https://git-scm.com/)

## 🧪 Como usar o projeto

Clone o repositório:

```bash
git clone https://github.com/Carvic-dev/central-4noobs.git
```

Acesse a pasta do projeto:

```bash
cd central-4noobs
```

Instale as dependências:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Abra o navegador em:

```bash
http://localhost:3000
```

## 📜 Scripts disponíveis

No projeto, você pode executar:

```bash
npm run dev
```

Inicia o servidor de desenvolvimento.

```bash
npm run build
```

Gera a versão de produção da aplicação.

```bash
npm run start
```

Executa a aplicação em modo de produção após o build.

```bash
npm run lint
```

Executa o ESLint para verificar problemas no código.

## 🤝 Como contribuir

Contribuições são bem-vindas! Para contribuir com o projeto:

1. Faça um fork do repositório.
2. Crie uma branch para sua alteração:

```bash
git checkout -b minha-contribuicao
```

3. Faça as alterações necessárias.
4. Execute o lint para verificar o código:

```bash
npm run lint
```

5. Faça o commit das alterações:

```bash
git commit -m "feat: adiciona nova funcionalidade"
```

6. Envie sua branch para o GitHub:

```bash
git push origin minha-contribuicao
```

7. Abra um Pull Request explicando o que foi alterado.

## 💡 Sugestões de contribuição

Você pode contribuir com:

- Novas páginas de conteúdo
- Melhorias na interface
- Correções de bugs
- Organização de materiais
- Melhorias de acessibilidade
- Refatoração de código
- Documentação
- Novas trilhas de estudo
- Links úteis para iniciantes

## 🧭 Padrão recomendado de commits

Este projeto pode seguir uma estrutura simples baseada em Conventional Commits:

```bash
feat: adiciona nova funcionalidade
fix: corrige um problema
docs: altera documentação
style: altera estilos ou formatação
refactor: refatora código sem alterar comportamento
chore: tarefas de manutenção
```

Exemplos:

```bash
git commit -m "feat: adiciona seção de trilhas"
git commit -m "docs: atualiza instruções de instalação"
git commit -m "fix: corrige layout da página inicial"
```

## 🛠️ Boas práticas para contribuir

Antes de abrir um Pull Request:

- Verifique se o projeto roda localmente.
- Execute `npm run lint`.
- Mantenha o código organizado e legível.
- Use nomes claros para componentes, funções e arquivos.
- Explique bem o objetivo da sua alteração no Pull Request.
- Evite enviar alterações que não tenham relação com a proposta do PR.

## 📦 Build para produção

Para gerar uma versão de produção:

```bash
npm run build
```

Depois, para iniciar a aplicação em produção:

```bash
npm run start
```

Projeto mantido por **Carvic-dev** e pela comunidade do He4rtDevs e do projeto 4Noobs.
