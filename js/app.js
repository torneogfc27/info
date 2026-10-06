const APP_URL = "app.json";

let APP = {
    torneo: {
        nombre: "TORNEO FC27",
        subtitulo: "PS4 TOURNAMENT",
        temporada: "2026",
        juego: "FC27",
        plataforma: "PlayStation 4",
        cupos: 32,
        whatsapp: "5351261414",
        actualizacion: "12 horas",
        fecha: "Por confirmar",
        lugar: "BAR La Alemana, Jiguaní-Granma",
        inscripcion: "Pot confirmar",
        premios: "Por confirmar"
    },
    participantes: [],
    rifa: {}
};

async function loadApp() {
    try {
        const response = await fetch(APP_URL, { cache: "no-store" });
        if (!response.ok) throw new Error("No se pudo cargar app.json");
        APP = await response.json();
    } catch (error) {
        console.error(error);
        document.body.classList.add("data-error");
    }

    renderPageData();
    renderRoster();
    renderRaffle();
    setupWhatsApp();
    setupHelp();
    setupNavigation();
}

function escapeHTML(value = "") {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function renderPageData() {
    const t = APP.torneo || {};
    const set = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value ?? "";
    };

    set("infoJuego", `${t.juego || "FC27"} · ${t.plataforma || "PlayStation 4"}`);
    set("infoCupos", t.cupos || 0);
    set("infoPremios", t.premios || "Por confirmar");
    set("infoFecha", t.fecha || "Por confirmar");
    set("infoLugar", t.lugar || "BAR La Alemana, Jiguaní-Granma");
    set("infoInscripcion", t.inscripcion || "Por confirmar");
    set("updateHours", t.actualizacion || "12 horas");

    const status = document.getElementById("rosterStatus");
    if (status) status.textContent = `${APP.participantes?.length || 0} CONFIRMADOS · ${t.cupos || 0} CUPOS`;
}

function renderRoster() {
    const container = document.querySelector("#roster");
    if (!container) return;

    const cupos = Math.max(0, Number(APP.torneo?.cupos) || 0);
    const participantes = Array.isArray(APP.participantes) ? APP.participantes : [];
    const cards = [];

    for (let i = 0; i < cupos; i++) {
        const jugador = participantes[i];

        if (jugador) {
            const foto = jugador.foto
                ? `<img src="${escapeHTML(jugador.foto)}" alt="${escapeHTML(jugador.nombre || "Jugador")}">`
                : `<span class="avatar-fallback">👤</span>`;

            cards.push(`
                <article class="player-card confirmed">
                    <div class="player-photo">${foto}</div>
                    <div class="player-number">${String(i + 1).padStart(2, "0")}</div>
                    <div class="player-info">
                        <span1>JUGADOR CONFIRMADO</span1>
                        <h3>${escapeHTML(jugador.nombre || "Sin nombre")}</h3>
                        <p>ID: ${escapeHTML(jugador.id || "—")}</p>
                        <strong>⚽ ${escapeHTML(jugador.equipo || "Equipo por confirmar")}</strong>
                    </div>
                </article>
            `);
        } else {
            cards.push(`
                <article class="player-card empty">
                    <div class="empty-icon">+</div>
                    <span>CUPO ${String(i + 1).padStart(2, "0")}</span>
                    <h3>DISPONIBLE</h3>
                    <a href="inscripcion.html">INSCRIBIRME →</a>
                </article>
            `);
        }
    }

    container.innerHTML = cards.join("");
}

function renderRaffle() {
    const grid = document.querySelector("#raffleGrid");
    if (!grid || !APP.rifa) return;

    grid.innerHTML = Object.entries(APP.rifa).map(([numero, vendido]) => `
        <div class="raffle-number ${vendido ? "sold" : "available"}">
            ${String(numero).padStart(2, "0")}
        </div>
    `).join("");
}

function setupWhatsApp() {
    const button = document.querySelector("#whatsappBtn");
    if (!button) return;

    const numero = String(APP.torneo?.whatsapp || "").replace(/[^\d]/g, "");

    const mensaje = `🎮 INSCRIPCIÓN — ${APP.torneo?.nombre || "TORNEO FC27"}

Hola, deseo inscribirme en el ${APP.torneo?.nombre || "Torneo FC27"}.

👤 Nombre y Apellidos:
➡️ 

🪪 Carnet de Identidad:
➡️ 

🎮 Equipo seleccionado:
➡️ 

📱 Número de teléfono:
➡️ 

📸 Foto de perfil:
➡️ La adjunto a este mensaje.

💳 COMPROBANTE DE PAGO:
➡️ Adjunto la captura de la transferencia.

📩 SMS DE CONFIRMACIÓN:
➡️ Reenvío el SMS de confirmación.

Acepto las condiciones y reglamento del torneo.`;

    button.href = numero
        ? `https://wa.me/5351261414?text=${encodeURIComponent(mensaje)}`
        : "#";

    if (numero) {
        button.target = "_blank";
        button.rel = "noopener noreferrer";
    } else {
        button.addEventListener("click", event => {
            event.preventDefault();
            alert("Configura primero el número de WhatsApp en app.json.");
        });
    }
}

function setupHelp() {
    const open = document.getElementById("helpButton");
    const panel = document.getElementById("helpPanel");
    const close = document.getElementById("closeHelp");

    if (!open || !panel) return;

    open.addEventListener("click", () => {
        panel.hidden = false;
        document.body.classList.add("help-open");
    });

    close?.addEventListener("click", () => {
        panel.hidden = true;
        document.body.classList.remove("help-open");
    });

    panel.addEventListener("click", event => {
        if (event.target === panel) {
            panel.hidden = true;
            document.body.classList.remove("help-open");
        }
    });
}

function setupNavigation() {
    const current = location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll("[data-nav]").forEach(link => {
        if (link.getAttribute("data-nav") === current) link.classList.add("active");
    });

    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".main-nav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", () => {
        const opened = nav.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(opened));
    });

    nav.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => nav.classList.remove("open"));
    });
}

loadApp();
