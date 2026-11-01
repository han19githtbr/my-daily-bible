# Minha Bíblia Diária

Plano de leitura de 30 dias (proteção, provisão, paz e gratidão) com o **texto completo** dos versículos
(Almeida Corrigida Fiel, domínio público), marcação de dias lidos, frase do dia, orações da manhã e da noite
e lembretes às 7h e 23h. Next.js + PWA instalável no Android.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

- Progresso e anotações ficam no aparelho (localStorage).
- `data/readings.json` é gerado por `npm run data -- caminho/acf.json` (fonte: github.com/thiagobodruk/biblia).
- Deploy sugerido: Vercel (HTTPS é obrigatório para PWA e notificações).
