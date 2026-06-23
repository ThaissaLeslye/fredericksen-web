<!-- markdownlint-disable-file -->
<div align="center">
  <h1>Fredericksen App - MVP 1</h1>

  <p>
    <img src="https://img.shields.io/badge/Status-MVP%201%20Concluído-C35050?style=flat-square" alt="Status">
    <img src="https://img.shields.io/badge/Deploy-Cloudflare%20Pages-C35050?style=flat-square" alt="Deploy">
  </p>

  <div>
    <img src="https://img.shields.io/badge/Vue%203-42B883?style=flat-square&logo=vue.js&logoColor=white" alt="Vue 3">
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript">
    <img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite">
    <img src="https://img.shields.io/badge/Tailwind%20CSS-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind">
  </div>
</div>

<br />

## Missão do Projeto

Interface do ecossistema familiar **Fredericksen**, construída com foco em experiência mobile-first. Permite login via Google, visualização do perfil e edição de dados médicos sensíveis (medicamentos, alergias e tipo sanguíneo) de forma segura e fluida.

---

## Engenharia e Stack

- **Framework:** Vue 3 com Composition API e `<script setup>`
- **Bundler:** Vite com code splitting manual por vendor
- **Estilização:** Tailwind CSS v4
- **Estado global:** Pinia (auth store)
- **Roteamento:** Vue Router com navigation guards assíncronos
- **HTTP:** Axios com interceptors para tratamento de 401 e erros de rede
- **Testes:** Vitest + Vue Test Utils com cobertura mínima de 70% em linhas
- **PWA:** `vite-plugin-pwa` com Workbox — rotas de API excluídas do cache (NetworkOnly)
- **Deploy:** Cloudflare Pages com preview automático por branch

> [!IMPORTANT]
> **Engineering Rules:**
>
> - **Strict Type Safety:** `strict: true` em todos os `tsconfig`. Sem `any` na aplicação.
> - **Composables isolados:** toda lógica de negócio em composables testáveis independentemente da view.
> - **Controle de requisições:** uso de `AbortController` para cancelar chamadas em voo ao desmontar componentes, evitando memory leaks e race conditions.
> - **Separação de camadas:** views orquestram; composables contêm lógica; `apiClient` centraliza HTTP.

---

## Variáveis de Ambiente

| Variável       | Descrição                                                 |
| -------------- | --------------------------------------------------------- |
| `VITE_API_URL` | URL base da API backend (ex: `https://rick-api.tllo.app`) |

A variável é injetada em build time pelo pipeline do GitHub Actions: `master` recebe a URL de produção, demais branches recebem a URL de staging.

> [!NOTE]
> Se `VITE_API_URL` estiver vazia, o cliente HTTP cai em fallback para rotas relativas (`/auth/google`, `/user/me`, etc.), o que funciona em ambientes com proxy reverso configurado.

---

## Estrutura de Rotas

| Rota       | Nome        | Autenticação                         |
| ---------- | ----------- | ------------------------------------ |
| `/`        | `home`      | Obrigatória                          |
| `/login`   | `login`     | Pública (redireciona se autenticado) |
| `/profile` | `profile`   | Obrigatória                          |
| `/*`       | `not-found` | Pública                              |

A guarda de navegação chama `authStore.checkSession()` a cada transição. A sessão é verificada via cookie `HttpOnly` — o frontend nunca toca no token JWT diretamente.

---

## Comandos

```bash
# Instalar dependências
npm install

# Desenvolvimento
npm run dev

# Build de produção (type-check + build)
npm run build

# Testes unitários com cobertura
npm run test:unit

# Lint com auto-fix
npm run lint
```

---

## O que foi aprendido e desenvolvido neste MVP

Este projeto foi construído como estudo prático de engenharia frontend, com foco em qualidade, testabilidade e segurança desde a concepção.

**Conceitos aplicados:**

- Composition API com `<script setup>`: organização por responsabilidade dentro de composables em vez de por opção (data, methods, computed).
- Gerenciamento de estado com Pinia: store de autenticação com `checkSession` que evita chamadas redundantes usando flag `initialized`.
- Controle de requisições assíncronas: `AbortController` para cancelar chamadas em voo ao desmontar componentes, prevenindo atualizações de estado em componentes desmontados.
- Interceptors Axios: tratamento centralizado de 401 (dispara evento `auth:expired`) e erros de rede (dispara `network:midflight-error`), desacoplando o tratamento de erros das views.
- Comunicação por eventos customizados: `window.dispatchEvent` e `window.addEventListener` para propagar estados globais (sessão expirada, erro de rede) sem acoplamento direto entre camadas.
- Testes de componente com Vue Test Utils: mocks de composables, stubs de RouterLink, validação de atributos e comportamento de elementos DOM.
- PWA com Workbox: cache seletivo — assets estáticos em cache, rotas de API sempre em NetworkOnly para garantir dados frescos.
- Pipeline CI/CD com GitHub Actions: type-check, testes unitários e deploy automático para Cloudflare Pages com injeção de variável de ambiente por branch.
- Contrato de API cross-repo: o cookie `access_token` é a única interface de autenticação entre frontend e backend — validado em teste de contrato E2E no repositório da API.

<br />

<div align="right">
  <sub>Construído com 🩷 por <b>Thaissa Leslye</b></sub><br />
  <sub>IA utilizada: Gemini no modo Flash Estendido</sub><br/>
</div>
