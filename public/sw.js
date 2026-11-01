const C = "mdb-v1";
const S = "mdb-settings";

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(C).then((c) => c.addAll(["/"])).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== C && k !== S).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Rede primeiro, cache como reserva: funciona offline depois da primeira visita.
self.addEventListener("fetch", (e) => {
  const r = e.request;
  if (r.method !== "GET") return;
  const u = new URL(r.url);
  if (u.origin !== location.origin && !/fonts\.(googleapis|gstatic)\.com$/.test(u.host)) return;
  e.respondWith(
    fetch(r)
      .then((res) => {
        const cp = res.clone();
        if (res.status === 200) caches.open(C).then((c) => c.put(r, cp)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(r).then((m) => m || caches.match("/")))
  );
});

const read = async (c, k) => {
  const r = await c.match(k);
  return r ? r.json().catch(() => ({})) : {};
};

async function show(k) {
  const m = k === "m";
  await self.registration.showNotification(m ? "Bom dia! Hora da oração" : "Hora de entregar o dia a Deus", {
    body: m ? "Abra sua leitura de hoje e comece o dia com uma oração." : "Agradeça por três coisas e descanse em Deus.",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    tag: "prayer-" + k,
    data: { url: "/?tab=oracoes" },
  });
}

// Chrome/Android chama este evento periodicamente com o app instalado (horário aproximado).
async function check() {
  const c = await caches.open(S);
  const rem = await read(c, "/__settings");
  const last = await read(c, "/__last");
  const d = new Date(), h = d.getHours(), day = d.toDateString();
  for (const [k, ok] of [["m", h >= 7 && h < 12], ["n", h === 23]]) {
    if (rem[k] && ok && last[k] !== day) { last[k] = day; await show(k); }
  }
  await c.put("/__last", new Response(JSON.stringify(last)));
}

self.addEventListener("periodicsync", (e) => {
  if (e.tag === "prayer-reminders") e.waitUntil(check());
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || "/";
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((cs) => {
      for (const c of cs) if ("focus" in c) { c.navigate(url).catch(() => {}); return c.focus(); }
      return self.clients.openWindow(url);
    })
  );
});
