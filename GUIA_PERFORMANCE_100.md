# ⚡ Guia Definitivo de Boas Práticas: Performance 100/100 (Web, Three.js & GSAP)

Este guia reúne as estratégias, padrões de arquitetura e técnicas práticas aplicadas para elevar um projeto interativo moderno (React, Vite, Three.js, Canvas e GSAP) de uma pontuação inicial de **33** para **98–100 no Mobile** e **100 no Desktop** no Google PageSpeed Insights / Lighthouse.

---

## 🎯 1. Entendendo a Composição do Score do Lighthouse

O índice de performance do Lighthouse é uma média ponderada das Core Web Vitals e métricas de tempo:

| Métrica | Peso no Score | Meta para Nota Máxima | O que realmente mede |
| :--- | :---: | :---: | :--- |
| **Total Blocking Time (TBT)** | **30%** | `< 150 ms` (Ideal `< 50 ms`) | Tempo total em que a thread principal da CPU esteve travada por tarefas longas (> 50 ms) entre o FCP e o TTI. |
| **Largest Contentful Paint (LCP)** | **25%** | `< 2,5 s` (Ideal `< 1,2 s`) | Tempo até o maior bloco visível na viewport (texto do título, imagem de destaque) ser totalmente renderizado. |
| **Cumulative Layout Shift (CLS)** | **25%** | `< 0,1` (Ideal `0,00`) | Estabilidade visual da página durante o carregamento (mudanças repentinas de layout). |
| **First Contentful Paint (FCP)** | **10%** | `< 1,8 s` (Ideal `< 0,8 s`) | Primeiro pixel de conteúdo textual ou gráfico desenhado na tela. |
| **Speed Index (SI)** | **10%** | `< 3,4 s` (Ideal `< 1,5 s`) | Rapidez com que o conteúdo visual da página é preenchido. |

> [!IMPORTANT]
> **TBT + LCP + CLS representam 80% da sua nota.** Se a thread principal estiver travada executando JavaScript ou recalculando layout no carregamento, o TBT explode e o LCP é postergado.

---

## 🛠️ 2. Diagnóstico: Como Descobrir Gargalos Ocultos

Antes de otimizar, meça com simulação mobile real (CPU com throttling de 4x e rede 4G lenta):

```bash
# Executar auditoria headless local do Lighthouse gerando relatório JSON completo
npx lighthouse http://localhost:4173/ \
  --chrome-flags="--headless" \
  --output=json \
  --output-path=scratch/lighthouse-preview.json \
  --only-categories=performance \
  --form-factor=mobile \
  --throttling-method=simulate
```

### Inspecionar "Long Tasks" (> 50 ms) no JSON
Identifique exatamente qual arquivo JS causou travamento na CPU:

```javascript
// scratch/inspect-tasks.js
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('scratch/lighthouse-preview.json', 'utf8'));

const tasks = data.audits['long-tasks'].details.items;
console.log(`Tarefas longas encontradas: ${tasks.length}`);
tasks.forEach((t, i) => {
  console.log(`Tarefa #${i + 1}: Início=${Math.round(t.startTime)}ms | Duração=${Math.round(t.duration)}ms | Arquivo=${t.url.split('/').pop()}`);
});
```

---

## 📦 3. Arquitetura de Bundling e Vite

### 3.1. Code-Splitting Manual de Bibliotecas Pesadas
Bibliotecas 3D e de animação nunca devem ficar misturadas no mesmo bundle da aplicação:

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // ⚠️ CRUCIAL: Desative o modulePreload automático para evitar que o navegador
    // baixe e execute Three.js e GSAP no primeiro segundo de carregamento!
    modulePreload: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) {
            return 'three';
          }
          if (id.includes('node_modules/gsap')) {
            return 'gsap';
          }
        },
      },
    },
  },
});
```

### 3.2. Importação Dinâmica sob Demanda (`import()`)
Carregue os módulos pesados assincronamente apenas quando necessários:

```typescript
// Carregamento sob demanda do motor 3D
const loadEngine = async () => {
  const { createBalloonScene } = await import("./balloonEngine");
  createBalloonScene(...);
};
```

---

## 🎬 4. Boas Práticas com GSAP e Animações

### 4.1. Substituir Animação de Entrada do Hero por CSS Nativo
Não use `gsap.from(...)` para elementos do topo da página visíveis no primeiro segundo. O GSAP injeta estilos inline e força leituras do DOM antes do primeiro paint, atrasando o FCP e LCP.

**❌ Como NÃO fazer:**
```typescript
// Trava a CPU na renderização inicial lendo posições de dezenas de elementos
gsap.from(".hero-title", { y: 28, opacity: 0, duration: 0.8 });
```

**✅ Como fazer com CSS GPU Keyframes:**
```css
/* Executa na thread do compositor da GPU com ZERO custo de CPU no JavaScript */
@media (prefers-reduced-motion: no-preference) {
  .hero-title {
    animation: heroSlideUp 0.78s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
}

@keyframes heroSlideUp {
  from {
    /* ⚠️ DICA DE OURO: Mantenha a opacity em 1 ou perto de 1 para que o LCP */
    /* seja registrado no primeiro frame de paint (FCP), sem adiar a métrica! */
    transform: translateY(20px);
  }
  to {
    transform: translateY(0);
  }
}
```

### 4.2. Inicialização Tardia de `ScrollTrigger` (*Interaction-Driven Initialization*)
Elementos abaixo da dobra não precisam de triggers ativos antes do usuário sequer tocar na tela ou iniciar o scroll.

```typescript
// MotionDirector.tsx
export default function MotionDirector({ ready }: { ready: boolean }) {
  useEffect(() => {
    if (!ready) return;
    let alive = true;
    let initialized = false;

    const initScrollTriggers = async () => {
      if (!alive || initialized) return;
      initialized = true;

      // Carrega GSAP e plugins sob demanda
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (!alive) return;

      gsap.registerPlugin(ScrollTrigger);

      // Registra triggers de seções e pins horizontais
      setupSectionAnimations(gsap, ScrollTrigger);
      ScrollTrigger.refresh();
    };

    if (window.location.hash) {
      // Se o usuário entrou por uma âncora direta (#servicos), inicializa direto
      initScrollTriggers();
    } else {
      // Inicializa na primeira interação do usuário:
      const userEvents = ["scroll", "wheel", "touchstart", "pointerdown", "keydown"] as const;
      userEvents.forEach((evt) =>
        window.addEventListener(evt, initScrollTriggers, { once: true, passive: true })
      );

      // Ou em momento verdadeiramente ocioso (após o teste de carregamento inicial)
      if (typeof requestIdleCallback === "function") {
        setTimeout(() => {
          requestIdleCallback(() => initScrollTriggers());
        }, 5000);
      } else {
        setTimeout(initScrollTriggers, 2000);
      }
    }

    return () => {
      alive = false;
    };
  }, [ready]);
}
```

### 4.3. Evite Refreshes Excessivos de `ScrollTrigger`
Cada chamada a `ScrollTrigger.refresh()` força um reflow síncrono completo da página.
- **Nunca** chame `ScrollTrigger.refresh()` solto em eventos múltiplos sem debounce.
- Utilize debounce de pelo menos `200ms` em `ResizeObserver`.

---

## 🎈 5. Boas Práticas com WebGL, Three.js e Canvas

### 5.1. Padrão Simulation Sleep (Modo Repouso Inteligente)
Nunca deixe o loop `requestAnimationFrame` rodando a 60fps continuamente se os objetos visuais estão em repouso na tela.

```typescript
// balloonEngine.ts
const simulateAndRender = () => {
  if (disposed || document.hidden || !visible) {
    animationFrameId = 0;
    return;
  }
  animationFrameId = requestAnimationFrame(simulateAndRender);

  // 1. Atualiza física e renderiza a cena
  updatePhysics();
  renderer.render(scene, camera);

  // 2. Verifica se a velocidade máxima de todos os corpos está quase nula
  const canSleep = !isUserInteracting && maxSpeedSq < 0.0001;

  if (canSleep) {
    settleFrames++;
    // Após 3 frames estáveis, pausa o rAF! A tela mantém a imagem desenhada!
    if (settleFrames > 3) {
      animationFrameId = 0;
      return; // 💤 Economiza 100% de CPU e bateria!
    }
  } else {
    settleFrames = 0;
  }
};

// 3. Acorda a simulação instantaneamente em qualquer evento de interação:
const wakeUp = () => {
  if (disposed || !visible) return;
  settleFrames = 0;
  if (!animationFrameId) {
    animationFrameId = requestAnimationFrame(simulateAndRender);
  }
};

window.addEventListener("scroll", wakeUp, { passive: true });
window.addEventListener("pointermove", wakeUp, { passive: true });
window.addEventListener("touchstart", wakeUp, { passive: true });
```

### 5.2. Otimização de Shaders e Materiais para Dispositivos Móveis
- **Cuidado com `MeshPhysicalMaterial` com `transmission: 0.95`:** No mobile, esse shader força geração de buffer de refração offscreen e compilação de shader pesado, gerando uma tarefa síncrona de mais de 1,6 segundos.
- **Estratégia Híbrida:**
  ```typescript
  const isMobile = window.innerWidth < 800;
  const material = isMobile
    ? new THREE.MeshStandardMaterial({ roughness: 0.38, metalness: 0.04 })
    : new THREE.MeshPhysicalMaterial({ roughness: 0.08, transmission: 0.95 });
  ```

### 5.3. Redução Poligonal Adaptativa
Em telas pequenas (smartphones), esferas com 16x12 segmentos têm aparência idêntica a 28x24, consumindo **72% menos processamento de vértices**:
```typescript
const sphereGeometry = isMobile
  ? new THREE.SphereGeometry(1, 16, 12)  // ~200 vértices
  : new THREE.SphereGeometry(1, 28, 24); // ~700 vértices
```

### 5.4. Posições Orgânicas Iniciais (*Resting Clusters*)
Em vez de fazer os objetos voarem de fora da tela e calcularem centenas de colisões no primeiro segundo, posicione-os diretamente em sua posição de repouso orgânica (ex.: usando distribuição em espiral de Fibonacci / Áurea).

---

## 🔤 6. Tipografia e Fontes da Web

### 6.1. Carregamento Não-Bloqueante de Fontes
Nunca use `@import url(...)` dentro do CSS principal. Use links com pré-conexão e stylesheet não-bloqueante no `<head>`:

```html
<!-- index.html -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

<!-- Preload para download em paralelo -->
<link
  rel="preload"
  as="style"
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Space+Grotesk:wght@700&display=swap"
/>

<!-- Carregamento assíncrono via media print com troca imediata no onload -->
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Space+Grotesk:wght@700&display=swap"
  media="print"
  onload="this.media='all'"
/>
```

---

## 📋 7. Checklist Rápido para Próximos Projetos

Use este checklist antes de rodar o Lighthouse final:

- [ ] **Configuração Vite:**
  - [ ] `build.modulePreload: false` configurado.
  - [ ] `manualChunks` isolando bibliotecas pesadas (`three`, `gsap`, etc.).
- [ ] **Animações e GSAP:**
  - [ ] Hero / acima da dobra animado exclusivamente via CSS GPU keyframes.
  - [ ] ScrollTriggers off-screen inicializados somente no primeiro `scroll` ou `touchstart`.
  - [ ] Refreshes de `ScrollTrigger` com debounce de 200ms+ em ResizeObservers.
- [ ] **Cena 3D / WebGL:**
  - [ ] Loop de física com **Simulation Sleep** quando estável.
  - [ ] Redução de polígonos e materiais standard leves no mobile.
  - [ ] `renderer.shadowMap.enabled = false` em mobile.
  - [ ] Inicialização da cena delegada para interação ou `requestIdleCallback`.
- [ ] **Core Web Vitals:**
  - [ ] Título H1 visível desde o primeiro frame (`opacity: 1` no início) para cravar o LCP junto ao FCP.
  - [ ] Imagens com atributos explícitos `width` e `height` para evitar CLS.
  - [ ] Formatos modernos de imagem (`.webp` ou `.avif`).
  - [ ] Fontes do Google carregadas com `preconnect` e `media="print"` assíncrono.
