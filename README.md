# Site · Stefani Rafaeli Zopellaro, Nutricionista

Landing page estática (HTML + CSS + JS puros). Sem build, sem dependências.
Conceito: **"Nutrição que compreende"**. Paleta tirada do logo (verde `#175339` + pêssego `#FACDB3`) com sálvia, creme, terracota e pontos de amarelo.

## Estrutura

```
/
├── index.html
├── logo.png                  ← logo completo (serpente + margarida, fundo transparente)
├── _originais/               ← artes originais do logo (com fundo de papel)
├── css/styles.css            ← paleta (variáveis no topo) e layout mobile-first
├── js/main.js                ← preloader 3s, menu, âncoras, folhas do hero, linha da consulta, formulário → WhatsApp
├── qa/                       ← scripts Playwright de conferência (node qa/check.cjs / node qa/shots.cjs)
└── assets/
    ├── monograma.png         ← só o "S" de serpente com margarida (header, abertura, selo)
    ├── monograma-claro.png   ← silhueta clara do monograma (para fundos verdes)
    ├── logo-claro.png        ← silhueta clara do logo completo
    ├── favicon-48.png / favicon-512.png / apple-touch-icon.png
    ├── og-image.jpg          ← prévia de compartilhamento 1200x630
    ├── hero.jpg              ← FALTA · FOTO 1 · Hero (retrato 3:4, mín. 1200x1600)
    └── sobre.jpg             ← FALTA · FOTO 2 · Sobre mim (4:5, mín. 1000x1250)
```

Enquanto as fotos não existirem, aparecem placeholders sinalizados no lugar.

## Pendências antes de publicar

1. **CRN**: procure `CRN-X 00000` no `index.html` (hero, sobre e rodapé).
2. **WhatsApp**: `WHATSAPP_NUMBER` em `js/main.js` (ex.: `5511999999999`). Todos os botões com `data-wa` (11 pela página + o flutuante) usam esse número, cada um com sua mensagem pronta.
3. **Fotos**: `assets/hero.jpg` e `assets/sobre.jpg`.
4. **Domínio**: troque `https://www.SEUDOMINIO.com.br/` (canonical, Open Graph e JSON-LD) e o Instagram no rodapé.
5. **Sobre**: instituição de formação (endereço já definido: Centro, Cascavel - PR).
6. **Valor social**: confirmar critério (como a pessoa solicita) e se há lista de espera; o texto está na seção `#valor-social` e no FAQ.
7. **Relatos**: os textos são modelos. Use só relatos reais, autorizados por escrito, sobre acolhimento e atendimento. Para ocultar: `hidden` na `<section class="voices">`.

## Conformidade (CFN)

Sem "antes e depois", sem promessas de resultado e sem preço como chamariz. O valor social aparece **sem números** e explicitamente "não é promoção": os valores são informados individualmente pelo WhatsApp.

## Publicar

Qualquer hospedagem estática (Netlify, Vercel, Cloudflare Pages, GitHub Pages): envie a pasta inteira.
Teste local: `python -m http.server 8000` na pasta e abra `http://localhost:8000`.
