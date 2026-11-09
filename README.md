# Arte Bola 2.0

Vite + React + TypeScript, com a física Three.js original extraída para um módulo independente. Trabalho local; nenhuma publicação automática.

## Executar

- `npm install`
- `npm run dev` — prévia em localhost:3000
- `npm run typecheck`
- `npm test`
- `npm run build` — atualiza as imagens e gera dist

No PowerShell com scripts bloqueados, use `npm.cmd`.

## Conteúdo e acervo

`src/data/content.ts` centraliza marca, contato, navegação, serviços e paletas. O contato preserva o Instagram presente no site original; não foi inventado telefone/WhatsApp.

`npm run prepare:assets` lê todas as fotos em `public/work`, aplica orientação EXIF e gera WebP de até 480, 960 e 1600 px, sem ampliar nem distorcer. Os originais permanecem intactos. O manifesto `photos.generated.json` é regenerado antes de cada build.

`src/data/projects.ts` cadastra automaticamente o manifesto e acrescenta curadoria editorial: nove fotografias, oito projetos. As duas vistas do laço vermelho estão agrupadas; títulos descrevem a composição, não nomes oficiais de eventos. Novas fotos recebem cadastro genérico até a curadoria. Não há pares antes/depois disponíveis; nenhum foi simulado. A comparação opcional é uma alternância acessível, sem efeito Pixel Swap implementado para acervo inexistente.

## Arquitetura e movimento

- `components/layout`: cabeçalho com menu móvel e rodapé tipográfico interativo próprio.
- `components/sections`: experiência 3D, manifesto horizontal, portfólio, serviços, estúdio, processo e contato.
- `components/interactive`: galeria com dialog nativo, foco restaurado, teclado, fallback de mídia, cursor e cena 3D.
- `components/motion/MotionDirector.tsx`: entradas, pin desktop, progresso e refresh após fontes/filtros. Usa matchMedia e cleanup.
- `styles`: base e componentes, com alternativas mobile e reduced motion.

O motor `balloonEngine.ts` mantém o algoritmo original de colisões por massa, repulsão, formação de coração e dispersão. O motor, a integração React e os dados estão em TypeScript. As fases usam posições reais das quatro seções de introdução. Foram reduzidos contagem, segmentos, sombras, DPR e custo da transparência. A geometria ganhou perfil levemente orgânico. A simulação suspende fora da introdução e com aba oculta. Reduced motion ou falha WebGL usam imagem estática. O bundle 3D é carregado separadamente.

Serviços usam sticky nativo, capítulos no fluxo e fotos permanentemente montadas. A foto ativa só muda após a próxima carregar. Mobile usa fotos em sequência vertical. O manifesto tem três fotos; no mobile e reduced motion, navegação horizontal nativa.

## Referência consultada, apenas leitura

Foram lidos pelo conector GitHub os arquivos Services.tsx, MotionDirector.tsx, HeroBalloonCluster3D.tsx, BalloonCursor.tsx, Footer.tsx e data/projects.ts de https://github.com/MaiaStudio/Cris-Baloes. Foram adaptados princípios de sincronização, cleanup, geometria e cursor; não foram copiados dados comerciais, imagens ou identidade da Cris. O motor principal permanece o da Arte Bola.

## Validação e limites

TypeScript e build verificados. 12 testes automatizados passaram e cobrem inventário, variantes, filtros, galeria, foco, falha de imagem, menu, contatos, paleta, fallback WebGL/reduced motion e liberação do loader por timeout, skip e preferência de movimento reduzido.

A prévia local foi aberta no navegador e inspecionada em layouts desktop e móvel. Foram conferidos menu, filtro de cenografia, galeria com duas perspectivas, fechamento com restauração do foco, carregamento das fotografias e sincronização dos serviços ao avançar, saltar e reverter a rolagem. Não foram encontradas imagens quebradas ou overflow horizontal nas larguras verificadas de 439, 580 e 1440 px. A cena 3D renderiza; o temporizador e o tipo de sombra foram atualizados para as APIs atuais do Three.js.

A medição de desempenho GPU e a verificação em aparelhos físicos continuam pendentes. Nenhum deploy foi realizado.

Refino visual: o canvas 3D agora cobre toda a largura da introdução; a câmera posiciona a composição sem uma borda interna de recorte. O portfólio usa dois quadros regulares por linha no desktop e um no mobile, com fotos inteiras (`contain`) e altura limitada. A foto do estúdio respeita a proporção original e tem altura máxima de 520 px (420 px no mobile). As três fotos de serviços carregam antecipadamente, com tentativa do original caso a variante falhe, e a troca acompanha a entrada de cada capítulo. A terceira foto foi conferida visível no desktop e carregada no mobile.
