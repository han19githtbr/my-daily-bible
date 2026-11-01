"use client";
import { useEffect, useState } from "react";
import data from "../data/readings.json";

const KEY = "mdb:v1", LAST = "mdb:last";
const INIT = { done: {}, notes: {}, ex: {}, rem: { m: false, n: false, p: false } };
const WEEKS = [
  { t: "Fortalecimento e proteção", c: "#3d4fb5", r: [1, 7] },
  { t: "Provisão e vida financeira", c: "#9a7412", r: [8, 14] },
  { t: "Paz e vida emocional", c: "#167a85", r: [15, 21] },
  { t: "Gratidão", c: "#b0476a", r: [22, 28] },
  { t: "Consolidação", c: "#5b3f9e", r: [29, 30] },
];
const weekOf = (n) => WEEKS.findIndex((w) => n >= w.r[0] && n <= w.r[1]);
const EXTRA = {
  lib: { t: "Libertação", c: "#5b3f9e", intro: "Leia uma passagem por vez, depois da leitura do dia ou nos dias mais pesados. Ore com sinceridade, entregando a Deus o que o prende." },
  pro: { t: "Provisão", c: "#9a7412", intro: "A Bíblia une oração e ação: além de pedir, vale planejar, trabalhar com diligência, honrar compromissos e semear com generosidade." },
};
const PRAYERS = {
  m: [
    "Senhor, obrigado por este novo dia. Entrego a Ti meus planos, meu trabalho e minhas decisões. Guarda-me do medo e da pressa, supre o que eu precisar hoje e ajuda-me a andar em paz e gratidão. Que eu veja o Teu cuidado em cada detalhe. Amém.",
    "Pai, ao acordar eu escolho confiar em Ti. Veste-me com a Tua armadura, dá-me coragem para o que vier e sabedoria para trabalhar com diligência. Que a Tua paz guarde meu coração e minha mente hoje. Amém.",
    "Deus bondoso, a Tua misericórdia se renova nesta manhã. Lanço sobre Ti toda ansiedade, porque Tu cuidas de mim. Abençoa o meu caminho, as pessoas que amo e as portas que vou atravessar hoje. Amém.",
  ],
  n: [
    "Senhor, obrigado por mais um dia. Agradeço pela proteção, pela provisão e pelas pequenas bênçãos que talvez eu nem tenha notado. Perdoa as minhas falhas e entrego a Ti o que ficou pendente. Dá-me um sono tranquilo. Amém.",
    "Pai, termino este dia descansando em Ti. Tudo o que me preocupa, deixo nas Tuas mãos; Tu não dormes e velas por mim. Guarda a minha casa, a minha família e o meu coração durante a noite. Amém.",
    "Deus de paz, aquieta a minha mente. Lembro-me de três coisas pelas quais sou grato hoje e as apresento a Ti. Renova as minhas forças, para que eu acorde de novo confiando na Tua fidelidade. Amém.",
  ],
};

const MY_PRAYER = "Meu Deus, sei que cometi erros no passado e aceito as consequências dos meus erros e das minhas escolhas, mas não deixe que esses erros definam a minha vida. Me dê a chance de eu mudar de vida, de recomeçar para acertar onde errei antes e me tire da estagnação financeira. Me liberte de todo tipo de escassez, e liberte a minha família do espírito de pobreza. Me oriente, me dê discernimento para que eu possa fazer as escolhas certas. Eu te agradeço por tudo que fez na minha vida, na vida da minha família e obrigado por todas as conquistas e todas as provas. Eu coloco a minha vida, a vida da minha família, dos meus amigos e os meus sonhos nas suas mãos. Obrigado por mais um dia e te entrego a noite. Amém.";
const MSG = {
  m: ["Bom dia! Hora da oração", "Abra sua leitura de hoje e comece o dia com uma oração."],
  n: ["Hora de entregar o dia a Deus", "Agradeça por três coisas e descanse em Deus."],
  p: ["Hora da sua oração", "Reserve um momento para a oração que você escreveu."],
};

/* ---------- notificações ---------- */
const canNotify = () => typeof window !== "undefined" && "Notification" in window && "serviceWorker" in navigator;
async function pushSettings(rem) {
  if (typeof caches === "undefined") return;
  const c = await caches.open("mdb-settings");
  await c.put("/__settings", new Response(JSON.stringify(rem)));
}
async function notify(k) {
  if (!canNotify() || Notification.permission !== "granted") return;
  const reg = await navigator.serviceWorker.ready;
  await reg.showNotification(MSG[k][0], {
    body: MSG[k][1],
    icon: "/icon-192.png", badge: "/icon-192.png", tag: "prayer-" + k, data: { url: "/?tab=oracoes" },
  });
}
async function enableNotif() {
  if (!canNotify()) return false;
  const p = Notification.permission === "granted" ? "granted" : await Notification.requestPermission();
  if (p !== "granted") return false;
  try {
    const reg = await navigator.serviceWorker.ready;
    await reg.periodicSync?.register("prayer-reminders", { minInterval: 60 * 60 * 1000 });
  } catch {}
  return true;
}
async function tick(rem) {
  const d = new Date(), h = d.getHours(), m = d.getMinutes(), day = d.toDateString();
  const last = JSON.parse(localStorage.getItem(LAST) || "{}");
  for (const [k, hit] of [["m", h === 7 && m < 30], ["p", h === 21 && m < 30], ["n", h === 23 && m < 30]]) {
    if (rem[k] && hit && last[k] !== day) {
      last[k] = day;
      localStorage.setItem(LAST, JSON.stringify(last));
      await notify(k);
    }
  }
}

/* ---------- app ---------- */
export default function Page() {
  const [s, setS] = useState(null);
  const [tab, setTab] = useState("hoje");
  const [open, setOpen] = useState(null);
  const [xk, setXk] = useState("lib");
  const [hour, setHour] = useState(12);
  const [msg, setMsg] = useState("");
  const [pi, setPi] = useState({ m: 0, n: 0 });

  useEffect(() => {
    try { setS({ ...INIT, ...JSON.parse(localStorage.getItem(KEY) || "{}") }); } catch { setS(INIT); }
    const d = new Date();
    setHour(d.getHours());
    setPi({ m: d.getDate() % 3, n: (d.getDate() + 1) % 3 });
    if (new URLSearchParams(location.search).get("tab") === "oracoes") setTab("oracoes");
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").then(() => navigator.serviceWorker.ready).then((reg) => {
      const urls = performance.getEntriesByType("resource").map((r) => r.name)
        .filter((u) => u.startsWith(location.origin) || /fonts\.(googleapis|gstatic)\.com/.test(u));
      reg.active && reg.active.postMessage({ type: "CACHE", urls: [...new Set([location.origin + "/", ...urls])] });
    }).catch(() => {});
  }, []);
  useEffect(() => {
    if (!s) return;
    localStorage.setItem(KEY, JSON.stringify(s));
    pushSettings(s.rem);
  }, [s]);
  useEffect(() => {
    if (!s) return;
    tick(s.rem);
    const id = setInterval(() => tick(s.rem), 20000);
    return () => clearInterval(id);
  }, [s && s.rem]);

  if (!s) return <main className="shell" />;

  const total = data.days.length;
  const count = Object.keys(s.done).length;
  const today = data.days.find((d) => !s.done[d.n]);
  const period = hour < 12 ? "manha" : hour < 18 ? "tarde" : "noite";
  const greet = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

  const toggle = (bucket, key) =>
    setS((p) => {
      const b = { ...p[bucket] };
      if (b[key]) delete b[key]; else b[key] = new Date().toISOString();
      return { ...p, [bucket]: b };
    });
  const toggleRem = async (k) => {
    setMsg("");
    if (!s.rem[k]) {
      if (!(await enableNotif())) {
        setMsg(canNotify()
          ? "As notificações estão bloqueadas. Libere nas configurações do navegador para este site."
          : "Este navegador não permite notificações. No Android, instale o app pelo Chrome.");
        return;
      }
    }
    setS((p) => ({ ...p, rem: { ...p.rem, [k]: !p.rem[k] } }));
  };

  /* ----- leitura ----- */
  if (open) {
    const isDay = open.k === "d";
    const item = isDay ? data.days[open.i] : data.extras[open.k][open.i];
    const color = isDay ? WEEKS[weekOf(item.n)].c : EXTRA[open.k].c;
    const bucket = isDay ? "done" : "ex", key = isDay ? item.n : open.k + open.i;
    const done = !!s[bucket][key];
    return (
      <main className="shell reader" style={{ "--c": color }}>
        <button className="back" onClick={() => setOpen(null)}>‹ Voltar</button>
        <header className="rhead">
          <p className="meta">{isDay ? `Dia ${item.n} de ${total}` : `Extra: ${EXTRA[open.k].t}`}</p>
          <h1>{item.ref}</h1>
          <p className="focus">{item.focus}</p>
        </header>
        <article>
          {item.parts.map((p) => (
            <section key={p.t}>
              {item.parts.length > 1 && <h2>{p.t}</h2>}
              {p.v.map(([n, t]) => <p className="v" key={n}><sup>{n}</sup>{t}</p>)}
            </section>
          ))}
          <p className="ver">{data.versao}</p>
        </article>
        {isDay && (
          <label className="note">
            Frase do dia
            <textarea rows={3} placeholder="A frase que mais chamou sua atenção" value={s.notes[item.n] || ""}
              onChange={(e) => setS((p) => ({ ...p, notes: { ...p.notes, [item.n]: e.target.value } }))} />
          </label>
        )}
        <div className="bar">
          <button className={"cta" + (done ? " on" : "")} onClick={() => toggle(bucket, key)}>
            {done ? "Lido ✓  (toque para desfazer)" : "Marcar como lido"}
          </button>
        </div>
      </main>
    );
  }

  /* ----- abas ----- */
  const Row = ({ n, ref_, focus, done, c, onClick }) => (
    <button className="row" style={{ "--c": c }} onClick={onClick}>
      <span className={"dot" + (done ? " on" : "")}>{done ? "✓" : n}</span>
      <span><b>{ref_}</b><small>{focus}</small></span>
    </button>
  );

  return (
    <main className="shell">
      {tab === "hoje" && (
        <>
          <section className={"hero " + period}>
            <p className="greet">{greet}</p>
            {today ? (
              <>
                <p className="big"><span>{today.n}</span> de {total}</p>
                <h1>{today.ref}</h1>
                <p className="focus">{today.focus}</p>
                <blockquote>{today.parts[0].v.slice(0, 2).map(([, t]) => t).join(" ")}</blockquote>
                <button className="cta light" onClick={() => setOpen({ k: "d", i: today.n - 1 })}>Ler agora</button>
              </>
            ) : (
              <>
                <h1>Você concluiu os 30 dias</h1>
                <p className="focus">Continue com um capítulo de Provérbios por dia e o Evangelho de João em sequência.</p>
              </>
            )}
          </section>
          <section className="card">
            <div className="prog"><b>{count} de {total} dias lidos</b><span>{Math.round((count / total) * 100)}%</span></div>
            <div className="track"><i style={{ width: `${(count / total) * 100}%` }} /></div>
            <div className="strip">
              {data.days.map((d) => (
                <button key={d.n} aria-label={`Dia ${d.n}`} className={s.done[d.n] ? "on" : today && today.n === d.n ? "now" : ""}
                  style={{ "--c": WEEKS[weekOf(d.n)].c }} onClick={() => setOpen({ k: "d", i: d.n - 1 })}>{d.n}</button>
              ))}
            </div>
          </section>
          <section className="card tap" onClick={() => setTab("oracoes")}>
            <b>Lembretes de oração</b>
            <p>{s.rem.m || s.rem.n ? `Ativos: ${[s.rem.m && "7h", s.rem.p && "21h", s.rem.n && "23h"].filter(Boolean).join(" e ")}.` : "Ative os avisos das 7h, 21h e 23h."}</p>
          </section>
        </>
      )}

      {tab === "plano" && WEEKS.map((w, wi) => (
        <section key={w.t} className="week" style={{ "--c": w.c }}>
          <h2><small>Semana {wi + 1}</small>{w.t}</h2>
          {data.days.filter((d) => weekOf(d.n) === wi).map((d) => (
            <Row key={d.n} n={d.n} ref_={d.ref} focus={d.focus} done={!!s.done[d.n]} c={w.c} onClick={() => setOpen({ k: "d", i: d.n - 1 })} />
          ))}
        </section>
      ))}

      {tab === "oracoes" && (
        <>
          <h1 className="title">Orações</h1>
          {[["m", "Manhã", "7h"], ["n", "Antes de dormir", "23h"]].map(([k, t, h]) => (
            <section key={k} className={"card pray " + k}>
              <div className="phead">
                <h2>{t}</h2>
                <button role="switch" aria-checked={s.rem[k]} className={"sw" + (s.rem[k] ? " on" : "")} onClick={() => toggleRem(k)}>
                  <span className="sr">Lembrete às {h}</span>
                </button>
              </div>
              <p className="when">Lembrete às {h}{s.rem[k] ? ": ativado" : ": desativado"}</p>
              <p className="ptext">{PRAYERS[k][pi[k]]}</p>
              <button className="ghost" onClick={() => setPi((p) => ({ ...p, [k]: (p[k] + 1) % 3 }))}>Outra oração</button>
            </section>
          ))}
          <section className="card pray p">
            <div className="phead">
              <h2>Minha oração</h2>
              <button role="switch" aria-checked={!!s.rem.p} className={"sw" + (s.rem.p ? " on" : "")} onClick={() => toggleRem("p")}>
                <span className="sr">Lembrete às 21h</span>
              </button>
            </div>
            <p className="when">Lembrete diário às 21h{s.rem.p ? ": ativado" : ": desativado"}</p>
            <p className="ptext">{MY_PRAYER}</p>
          </section>
          {msg && <p className="alert" role="status">{msg}</p>}
          <section className="card">
            <b>Como os avisos funcionam</b>
            <p className="small">Instale o app (menu do Chrome → Instalar app) e ative os lembretes. Com o app aberto, o aviso chega no horário exato. Com o app fechado, o Android entrega perto das 7h e das 23h, pois o Chrome decide o minuto da verificação.</p>
            <button className="ghost" onClick={async () => { if (await enableNotif()) notify("m"); else setMsg("Permita as notificações para testar."); }}>Enviar aviso de teste</button>
          </section>
        </>
      )}

      {tab === "extras" && (
        <>
          <h1 className="title">Passagens extras</h1>
          <div className="seg">
            {Object.entries(EXTRA).map(([k, e]) => (
              <button key={k} className={xk === k ? "on" : ""} onClick={() => setXk(k)}>{e.t}</button>
            ))}
          </div>
          <p className="small">{EXTRA[xk].intro}</p>
          {data.extras[xk].map((x, i) => (
            <Row key={i} n={i + 1} ref_={x.ref} focus={x.focus} done={!!s.ex[xk + i]} c={EXTRA[xk].c} onClick={() => setOpen({ k: xk, i })} />
          ))}
        </>
      )}

      <nav className="tabs" aria-label="Seções">
        {[["hoje", "Hoje"], ["plano", "Plano"], ["oracoes", "Orações"], ["extras", "Extras"]].map(([k, l]) => (
          <button key={k} className={tab === k ? "on" : ""} aria-current={tab === k} onClick={() => { setTab(k); window.scrollTo(0, 0); }}>{l}</button>
        ))}
      </nav>
    </main>
  );
}
