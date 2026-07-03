import React, { useState, useEffect } from "react";

/* ------------------------------------------------------------------ */
/*  Daily Focus — your seven most important things, one day at a time  */
/* ------------------------------------------------------------------ */

const QUOTES = [
  { text: "Well done is better than well said.", author: "Benjamin Franklin" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Do the hard jobs first. The easy jobs take care of themselves.", author: "Dale Carnegie" },
  { text: "Amateurs sit and wait for inspiration; the rest of us just get up and go to work.", author: "Stephen King" },
  { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
  { text: "What you do today can improve all your tomorrows.", author: "Ralph Marston" },
  { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "You don't have to see the whole staircase, just take the first step.", author: "Martin Luther King Jr." },
  { text: "Small deeds done are better than great deeds planned.", author: "Peter Marshall" },
  { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
  { text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
  { text: "Motivation gets you going; habit keeps you growing.", author: "John Maxwell" },
  { text: "Either you run the day or the day runs you.", author: "Jim Rohn" },
  { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
  { text: "A year from now you may wish you had started today.", author: "Karen Lamb" },
  { text: "Quality is not an act, it is a habit.", author: "Aristotle" },
  { text: "Great things are done by a series of small things brought together.", author: "Vincent van Gogh" },
  { text: "Done is better than perfect.", author: "Sheryl Sandberg" },
  { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
  { text: "Ordinary things, done consistently, produce extraordinary results.", author: "Anonymous" },
  { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
];

const MOTIFS = ["sun", "mountain", "leaf", "wave", "star", "seedling"];

const MAX = 7;
const START_ROWS = 5;

// Two palettes sharing the same shape. Dark is derived from the light
// navy/teal/gold identity: navy backgrounds, near-white ink, brightened accents.
const LIGHT = {
  bg: "linear-gradient(160deg,#F4F6FC 0%,#FBF8F3 100%)",
  card: "#ffffff",
  ink: "#16233B",
  inkSoft: "#5A6580",
  line: "#E5E8F1",
  accent: "#0E8A74",
  accentDeep: "#0B6B5A",
  gold: "#DFA236",
  goldDeep: "#B9821E",
  track: "#EEF0F7",
  rowHover: "#F7F8FC",
  boxBorder: "#C7CDDD",
  boxBg: "#ffffff",
  placeholder: "#AEB5C7",
  doneText: "#9AA2B4",
  strike: "#C7CDDD",
  del: "#C2C8D6",
  addHover: "#EEF6F4",
  quoteBg: "linear-gradient(135deg,#F1F7F5 0%,#FBF6EC 100%)",
  quoteBorder: "#EAEFEC",
  confirmBg: "#FBEBEA",
  confirmText: "#C0463F",
  confirmBgHover: "#F6DCDA",
  toggleTrack: "#E5E8F1",
  knob: "#ffffff",
  shadow: "0 18px 50px -28px rgba(22,35,59,.28)",
};

const DARK = {
  bg: "linear-gradient(160deg,#0E141F 0%,#12151C 100%)",
  card: "#182031",
  ink: "#ECEFF7",
  inkSoft: "#9BA6BE",
  line: "#2A3450",
  accent: "#17B89A",
  accentDeep: "#33CFB3",
  gold: "#E4AE4A",
  goldDeep: "#F1C36A",
  track: "#222C43",
  rowHover: "#1E2740",
  boxBorder: "#3A4661",
  boxBg: "#1E273B",
  placeholder: "#69738F",
  doneText: "#79839B",
  strike: "#3A4661",
  del: "#5C6785",
  addHover: "rgba(23,184,154,.14)",
  quoteBg: "linear-gradient(135deg,#142624 0%,#231F13 100%)",
  quoteBorder: "#2B3937",
  confirmBg: "rgba(224,102,102,.16)",
  confirmText: "#F09B94",
  confirmBgHover: "rgba(224,102,102,.26)",
  toggleTrack: "#2A3450",
  knob: "#ECEFF7",
  shadow: "0 18px 50px -22px rgba(0,0,0,.6)",
};

function dayOfYear(d) {
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d - start;
  return Math.floor(diff / 86400000);
}

function todayKey() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

function newId() {
  return (crypto?.randomUUID?.() || Math.random().toString(36).slice(2));
}

function emptyRows(n) {
  return Array.from({ length: n }, () => ({ id: newId(), text: "", done: false }));
}

/* ---- tiny hand-drawn motifs for the quote card ---- */
function Motif({ kind, c }) {
  const s = { width: 44, height: 44, stroke: c.accentDeep, strokeWidth: 2, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };
  switch (kind) {
    case "mountain":
      return (
        <svg viewBox="0 0 40 40" style={s}>
          <path d="M4 32 L15 12 L22 24 L28 16 L36 32 Z" />
          <path d="M12 17 L15 12 L18 17" stroke={c.gold} />
        </svg>
      );
    case "leaf":
      return (
        <svg viewBox="0 0 40 40" style={s}>
          <path d="M8 32 C8 16 24 8 32 8 C32 24 20 32 8 32 Z" />
          <path d="M8 32 C16 26 24 18 30 12" />
        </svg>
      );
    case "wave":
      return (
        <svg viewBox="0 0 40 40" style={s}>
          <path d="M4 16 C10 10 14 22 20 16 C26 10 30 22 36 16" />
          <path d="M4 26 C10 20 14 32 20 26 C26 20 30 32 36 26" stroke={c.gold} />
        </svg>
      );
    case "star":
      return (
        <svg viewBox="0 0 40 40" style={s}>
          <path d="M20 6 L23.5 15 L33 15.5 L25.5 21.5 L28 31 L20 25.5 L12 31 L14.5 21.5 L7 15.5 L16.5 15 Z" stroke={c.gold} />
        </svg>
      );
    case "seedling":
      return (
        <svg viewBox="0 0 40 40" style={s}>
          <path d="M20 34 L20 20" />
          <path d="M20 22 C12 22 8 16 8 10 C16 10 20 15 20 22 Z" />
          <path d="M20 20 C28 20 32 14 32 8 C24 8 20 13 20 20 Z" stroke={c.gold} />
        </svg>
      );
    default: // sun
      return (
        <svg viewBox="0 0 40 40" style={s}>
          <circle cx="20" cy="20" r="7" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
            const r = (a * Math.PI) / 180;
            return <line key={a} x1={20 + Math.cos(r) * 12} y1={20 + Math.sin(r) * 12} x2={20 + Math.cos(r) * 16} y2={20 + Math.sin(r) * 16} stroke={c.gold} />;
          })}
        </svg>
      );
  }
}

// A small sun/moon switch for the header.
function ThemeToggle({ dark, onToggle, c }) {
  return (
    <button
      className="df-toggle df-focusring"
      role="switch"
      aria-checked={dark}
      aria-label="Toggle dark mode"
      onClick={onToggle}
    >
      <span className="df-knob" data-dark={dark ? "true" : "false"} style={{ background: c.knob }}>
        {dark ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#2A3450"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c.goldDeep} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
          </svg>
        )}
      </span>
    </button>
  );
}

export default function DailyFocus() {
  const [tasks, setTasks] = useState(() => emptyRows(START_ROWS));
  const [loaded, setLoaded] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [view, setView] = useState("today");
  const [history, setHistory] = useState([]);
  const [histLoading, setHistLoading] = useState(false);
  const [dark, setDark] = useState(() =>
    typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : false
  );
  const [themeLoaded, setThemeLoaded] = useState(false);
  const th = dark ? DARK : LIGHT;
  const key = `focus:${todayKey()}`;

  // Load the saved theme preference (falls back to the OS setting picked above).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const store = (typeof window !== "undefined" && window.storage) || null;
      if (!store) { if (!cancelled) setThemeLoaded(true); return; }
      try {
        const res = await store.get("focus:theme");
        if (res?.value && !cancelled) setDark(res.value === "dark");
      } catch (e) { /* no saved preference */ }
      if (!cancelled) setThemeLoaded(true);
    })();
    return () => { cancelled = true; };
  }, []);

  // Persist the theme preference once the stored value has been read.
  useEffect(() => {
    if (!themeLoaded) return;
    (async () => {
      try {
        if (typeof window !== "undefined" && window.storage?.set) {
          await window.storage.set("focus:theme", dark ? "dark" : "light");
        }
      } catch (e) { /* saving is best-effort */ }
    })();
  }, [dark, themeLoaded]);

  // Load today's list. First open of a new day carries unfinished items forward
  // from the most recent prior day (completed + blank rows are dropped).
  useEffect(() => {
    let cancelled = false;

    const carryFrom = (prev) => {
      const carried = (Array.isArray(prev) ? prev : [])
        .filter((t) => t && !t.done && (t.text || "").trim().length > 0)
        .slice(0, MAX)
        .map((t) => ({ id: newId(), text: t.text, done: false }));
      const rows = carried.slice();
      while (rows.length < START_ROWS && rows.length < MAX) rows.push({ id: newId(), text: "", done: false });
      return rows.length ? rows : emptyRows(START_ROWS);
    };

    (async () => {
      const store = (typeof window !== "undefined" && window.storage) || null;
      if (!store) { if (!cancelled) setLoaded(true); return; }

      // 1) A list already exists for today — use it as-is.
      try {
        const res = await store.get(key);
        if (res?.value) {
          const parsed = JSON.parse(res.value);
          if (Array.isArray(parsed) && parsed.length) {
            if (!cancelled) { setTasks(parsed); setLoaded(true); }
            return;
          }
        }
      } catch (e) { /* no bucket for today yet */ }

      // 2) First open today — pull unfinished items from the most recent prior day.
      try {
        const res = await store.list("focus:");
        const keys = (res?.keys || [])
          .filter((k) => /^focus:\d{4}-\d{2}-\d{2}$/.test(k) && k !== key)
          .sort();
        const prevKey = keys.length ? keys[keys.length - 1] : null;
        if (prevKey) {
          const prev = await store.get(prevKey);
          if (prev?.value && !cancelled) setTasks(carryFrom(JSON.parse(prev.value)));
        }
      } catch (e) { /* nothing to carry forward */ }

      if (!cancelled) setLoaded(true);
    })();

    return () => { cancelled = true; };
  }, [key]);

  // Save whenever the list changes
  useEffect(() => {
    if (!loaded) return;
    (async () => {
      try {
        if (typeof window !== "undefined" && window.storage?.set) {
          await window.storage.set(key, JSON.stringify(tasks));
        }
      } catch (e) { /* saving is best-effort */ }
    })();
  }, [tasks, loaded, key]);

  const setText = (id, text) => setTasks((t) => t.map((x) => (x.id === id ? { ...x, text } : x)));
  const toggle = (id) => setTasks((t) => t.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));
  const remove = (id) => setTasks((t) => (t.length > 1 ? t.filter((x) => x.id !== id) : t));
  const add = () => setTasks((t) => (t.length < MAX ? [...t, { id: newId(), text: "", done: false }] : t));
  const doReset = () => { setTasks(emptyRows(START_ROWS)); setConfirmReset(false); };

  const fmtKey = (k) => {
    const [y, m, d] = k.replace("focus:", "").split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    return {
      weekday: dt.toLocaleDateString(undefined, { weekday: "long" }),
      dateLine: dt.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" }),
    };
  };

  const openHistory = async () => {
    setView("history");
    setHistLoading(true);
    const out = [];
    try {
      const store = (typeof window !== "undefined" && window.storage) || null;
      if (store) {
        const res = await store.list("focus:");
        const keys = (res?.keys || [])
          .filter((k) => /^focus:\d{4}-\d{2}-\d{2}$/.test(k) && k !== key)
          .sort()
          .reverse();
        for (const k of keys) {
          try {
            const r = await store.get(k);
            if (r?.value) {
              const items = JSON.parse(r.value).filter((t) => t && (t.text || "").trim().length > 0);
              if (items.length) out.push({ key: k, items });
            }
          } catch (e) { /* skip an unreadable day */ }
        }
      }
    } catch (e) { /* no history available */ }
    setHistory(out);
    setHistLoading(false);
  };

  const now = new Date();
  const weekday = now.toLocaleDateString(undefined, { weekday: "long" });
  const dateLine = now.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });

  const listed = tasks.filter((t) => t.text.trim().length > 0);
  const total = listed.length;
  const done = listed.filter((t) => t.done).length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const allDone = total > 0 && done === total;

  const q = QUOTES[dayOfYear(now) % QUOTES.length];
  const motif = MOTIFS[dayOfYear(now) % MOTIFS.length];

  const serif = "'Iowan Old Style','Palatino Linotype',Palatino,Georgia,'Times New Roman',serif";
  const sans = "system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

  return (
    <div style={{ minHeight: "100%", background: th.bg, padding: "28px 16px", fontFamily: sans, color: th.ink, boxSizing: "border-box", transition: "color .3s ease" }}>
      <style>{`
        .df-card{max-width:580px;margin:0 auto;background:${th.card};border:1px solid ${th.line};border-radius:22px;box-shadow:${th.shadow};overflow:hidden;transition:background .3s ease,border-color .3s ease}
        .df-pad{padding:30px 32px}
        .df-head-right{display:flex;flex-direction:column;align-items:flex-end;gap:12px}
        .df-eyebrow{font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:${th.inkSoft};font-weight:600;margin:0}
        .df-weekday{font-family:${serif};font-size:40px;line-height:1;letter-spacing:-.01em;margin:8px 0 4px;color:${th.ink}}
        .df-date{font-size:14px;color:${th.inkSoft};margin:0}
        .df-count{display:inline-flex;align-items:baseline;gap:5px;border:1px solid ${th.line};border-radius:999px;padding:7px 14px;font-size:13px;font-variant-numeric:tabular-nums;color:${th.ink};white-space:nowrap}
        .df-count b{font-size:16px;color:${allDone ? th.goldDeep : th.accentDeep}}
        .df-toggle{position:relative;width:52px;height:28px;flex:none;border-radius:999px;border:1px solid ${th.line};background:${th.toggleTrack};cursor:pointer;padding:0;transition:background .3s ease,border-color .3s ease}
        .df-knob{position:absolute;top:2px;left:2px;width:22px;height:22px;border-radius:50%;box-shadow:0 1px 3px rgba(0,0,0,.28);display:grid;place-items:center;transition:transform .3s cubic-bezier(.22,.61,.36,1),background .3s ease}
        .df-knob[data-dark="true"]{transform:translateX(24px)}
        .df-track{height:9px;border-radius:999px;background:${th.track};overflow:hidden;margin-top:20px}
        .df-fill{height:100%;border-radius:999px;transition:width .5s cubic-bezier(.22,.61,.36,1),background .4s;width:${pct}%;background:${allDone ? `linear-gradient(90deg,${th.gold},${th.goldDeep})` : `linear-gradient(90deg,${th.accent},${th.accentDeep})`}}
        .df-status{margin:10px 2px 0;font-size:12.5px;color:${th.inkSoft};min-height:16px}
        .df-list{margin:24px 0 4px;display:flex;flex-direction:column;gap:2px}
        .df-row{display:flex;align-items:center;gap:12px;padding:9px 6px;border-radius:12px;transition:background .15s}
        .df-row:hover{background:${th.rowHover}}
        .df-box{flex:none;width:23px;height:23px;border-radius:7px;border:2px solid ${th.boxBorder};background:${th.boxBg};display:grid;place-items:center;cursor:pointer;transition:all .18s;padding:0}
        .df-box:hover:not(:disabled){border-color:${th.accent}}
        .df-box:disabled{cursor:default;opacity:.5}
        .df-box[data-done="true"]{background:${th.accent};border-color:${th.accent}}
        .df-box svg{opacity:0;transform:scale(.6);transition:all .18s}
        .df-box[data-done="true"] svg{opacity:1;transform:scale(1)}
        .df-input{flex:1;border:none;background:transparent;font-family:${sans};font-size:16px;color:${th.ink};padding:4px 0;outline:none;min-width:0}
        .df-input::placeholder{color:${th.placeholder}}
        .df-input[data-done="true"]{color:${th.doneText};text-decoration:line-through;text-decoration-color:${th.strike}}
        .df-del{flex:none;border:none;background:transparent;color:${th.del};cursor:pointer;font-size:18px;line-height:1;padding:4px 6px;border-radius:6px;opacity:0;transition:opacity .15s,color .15s}
        .df-row:hover .df-del{opacity:1}
        .df-del:hover{color:#E06666}
        .df-foot{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:8px;flex-wrap:wrap}
        .df-add{border:none;background:transparent;color:${th.accentDeep};font-family:${sans};font-size:14px;font-weight:600;cursor:pointer;padding:8px 6px;border-radius:8px}
        .df-add:hover{background:${th.addHover}}
        .df-add:disabled{color:${th.placeholder};cursor:default;background:transparent}
        .df-reset{border:none;background:transparent;color:${th.placeholder};font-family:${sans};font-size:13px;cursor:pointer;padding:8px 6px;border-radius:8px;transition:color .15s}
        .df-reset:hover{color:#D9645E}
        .df-confirm{display:inline-flex;align-items:center;gap:8px;font-size:13px;color:${th.inkSoft}}
        .df-cy{border:none;background:${th.confirmBg};color:${th.confirmText};font-family:${sans};font-size:13px;font-weight:600;cursor:pointer;padding:6px 12px;border-radius:8px}
        .df-cy:hover{background:${th.confirmBgHover}}
        .df-cn{border:none;background:transparent;color:${th.inkSoft};font-family:${sans};font-size:13px;cursor:pointer;padding:6px 8px;border-radius:8px}
        .df-cn:hover{color:${th.ink}}
        .df-foot-right{display:flex;align-items:center;gap:4px}
        .df-hist{border:none;background:transparent;color:${th.accentDeep};font-family:${sans};font-size:13px;font-weight:600;cursor:pointer;padding:8px 8px;border-radius:8px;transition:background .15s}
        .df-hist:hover{background:${th.addHover}}
        .df-hist-head{display:flex;align-items:center;gap:14px;margin-bottom:2px}
        .df-back{border:none;background:transparent;color:${th.accentDeep};font-family:${sans};font-size:14px;font-weight:600;cursor:pointer;padding:6px 10px 6px 0;border-radius:8px}
        .df-back:hover{color:${th.ink}}
        .df-hist-list{display:flex;flex-direction:column;gap:16px;margin-top:18px;max-height:60vh;overflow-y:auto}
        .df-day{border:1px solid ${th.line};border-radius:14px;padding:16px 18px}
        .df-day-head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:11px}
        .df-day-wd{font-family:${serif};font-size:19px;line-height:1.1;color:${th.ink}}
        .df-day-dt{font-size:12.5px;color:${th.inkSoft};margin-top:2px}
        .df-day-count{font-size:12px;color:${th.inkSoft};border:1px solid ${th.line};border-radius:999px;padding:4px 10px;white-space:nowrap;font-variant-numeric:tabular-nums}
        .df-day-items{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:7px}
        .df-item{display:flex;align-items:center;gap:10px;font-size:14.5px;color:${th.ink}}
        .df-item[data-done="true"]{color:${th.doneText};text-decoration:line-through;text-decoration-color:${th.strike}}
        .df-dot{flex:none;width:14px;height:14px;border-radius:5px;border:2px solid ${th.boxBorder};box-sizing:border-box}
        .df-dot[data-done="true"]{background:${th.accent};border-color:${th.accent}}
        .df-quote{margin:26px 32px 30px;background:${th.quoteBg};border:1px solid ${th.quoteBorder};border-radius:16px;padding:20px 22px;display:flex;gap:16px;align-items:center;transition:background .3s ease,border-color .3s ease}
        .df-qtext{font-family:${serif};font-style:italic;font-size:16.5px;line-height:1.45;color:${th.ink};margin:0}
        .df-qauthor{font-size:12.5px;letter-spacing:.02em;color:${th.inkSoft};margin:7px 0 0}
        .df-focusring:focus-visible{outline:2px solid ${th.accent};outline-offset:2px}
        @media (max-width:520px){.df-pad{padding:24px 20px}.df-weekday{font-size:33px}.df-quote{margin:22px 20px 24px}}
        @media (prefers-reduced-motion:reduce){.df-fill,.df-box,.df-box svg,.df-del,.df-knob,.df-card,.df-quote,.df-toggle{transition:none}}
      `}</style>

      <div className="df-card">
        {view === "today" ? (
        <>
        <div className="df-pad">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
            <div>
              <p className="df-eyebrow">Today&rsquo;s focus</p>
              <h1 className="df-weekday">{weekday}</h1>
              <p className="df-date">{dateLine}</p>
            </div>
            <div className="df-head-right">
              <ThemeToggle dark={dark} onToggle={() => setDark((d) => !d)} c={th} />
              <span className="df-count"><b>{done}</b>/ {total} done</span>
            </div>
          </div>

          <div className="df-track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Daily progress">
            <div className="df-fill" />
          </div>
          <p className="df-status">
            {total === 0
              ? "Add your priorities below to begin."
              : allDone
              ? `All ${total} done — nicely handled.`
              : `${pct}% complete · ${total - done} to go`}
          </p>

          <div className="df-list">
            {tasks.map((t, i) => {
              const has = t.text.trim().length > 0;
              return (
                <div className="df-row" key={t.id}>
                  <button
                    className="df-box df-focusring"
                    data-done={t.done ? "true" : "false"}
                    disabled={!has}
                    onClick={() => toggle(t.id)}
                    aria-pressed={t.done}
                    aria-label={has ? `Mark "${t.text.trim()}" ${t.done ? "not done" : "done"}` : "Complete (add text first)"}
                  >
                    <svg width="13" height="13" viewBox="0 0 14 14"><path d="M2 7.5 L5.5 11 L12 3.5" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </button>
                  <input
                    className="df-input"
                    data-done={t.done ? "true" : "false"}
                    value={t.text}
                    onChange={(e) => setText(t.id, e.target.value)}
                    placeholder={`Priority ${i + 1}`}
                    aria-label={`Priority ${i + 1}`}
                  />
                  <button className="df-del df-focusring" onClick={() => remove(t.id)} aria-label="Remove this priority">&times;</button>
                </div>
              );
            })}
          </div>

          <div className="df-foot">
            <button className="df-add df-focusring" onClick={add} disabled={tasks.length >= MAX}>
              {tasks.length >= MAX ? "Seven is the limit for today" : "+ Add a priority"}
            </button>
            <div className="df-foot-right">
              <button className="df-hist df-focusring" onClick={openHistory}>History</button>
              {confirmReset ? (
                <span className="df-confirm">
                  Clear today&rsquo;s list?
                  <button className="df-cy df-focusring" onClick={doReset}>Reset</button>
                  <button className="df-cn df-focusring" onClick={() => setConfirmReset(false)}>Cancel</button>
                </span>
              ) : (
                <button className="df-reset df-focusring" onClick={() => setConfirmReset(true)}>Reset today</button>
              )}
            </div>
          </div>
        </div>

        <div className="df-quote">
          <div style={{ flex: "none" }}><Motif kind={motif} c={th} /></div>
          <div>
            <p className="df-qtext">&ldquo;{q.text}&rdquo;</p>
            <p className="df-qauthor">— {q.author}</p>
          </div>
        </div>
        </>
        ) : (
          <div className="df-pad">
            <div className="df-hist-head">
              <button className="df-back df-focusring" onClick={() => setView("today")}>&larr; Today</button>
              <p className="df-eyebrow">History</p>
            </div>
            {histLoading ? (
              <p className="df-status" style={{ marginTop: 18 }}>Loading&hellip;</p>
            ) : history.length === 0 ? (
              <p className="df-status" style={{ marginTop: 18 }}>No past days saved yet. Your history builds up as you use the dashboard from one day to the next.</p>
            ) : (
              <div className="df-hist-list">
                {history.map((day) => {
                  const f = fmtKey(day.key);
                  const dn = day.items.filter((t) => t.done).length;
                  return (
                    <div className="df-day" key={day.key}>
                      <div className="df-day-head">
                        <div>
                          <div className="df-day-wd">{f.weekday}</div>
                          <div className="df-day-dt">{f.dateLine}</div>
                        </div>
                        <span className="df-day-count">{dn}/{day.items.length} done</span>
                      </div>
                      <ul className="df-day-items">
                        {day.items.map((t, i) => (
                          <li className="df-item" data-done={t.done ? "true" : "false"} key={i}>
                            <span className="df-dot" data-done={t.done ? "true" : "false"} />
                            <span>{t.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
