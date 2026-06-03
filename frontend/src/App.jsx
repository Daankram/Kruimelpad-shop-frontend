import React, { useState, useEffect } from "react";

// Vervang deze URL na het deployen van de backend op Railway
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Placeholder-afbeelding als een productfoto ontbreekt
const PLACEHOLDER = "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&h=300&fit=crop&auto=format";

// Afbeeldingen per beloningsnaam
// Afbeeldingen op basis van beloning-ID — onafhankelijk van backend bestandsnamen
const AFBEELDINGEN_PER_ID = {
   1: "/gratis-dessert.jpg",
   2: "/krat-heineken.jpg",
   3: "/stelz.jpg",
   4: "/speciaalbier.jpg",
   5: "/borrelpakket.jpg",
   6: "/kabouterbos.jpg",
   7: "/hans-grietje-diner.jpg",
   8: "/dikke-dirk.jpg",
   9: "/dolle-diva.jpg",
  10: "/tante-cor.jpg",
  11: "/moet.jpg",
  12: "/hg-mok.jpg",
  13: "/hg-handdoek.jpg",
  14: "/hg-tshirt.jpg",
  15: "/hg-hoodie.jpg",
  16: "/hg-koksbuis.jpg",
  17: "/werkschoenen.jpg",
  18: "/hg-zomerjas.jpg",
  19: "/hg-winterjas.jpg",
  20: "/bioscoop.jpg",
  21: "/waardebon-25.png",
  22: "/waardebon-50.jpg",
  23: "/waardebon-75.jpg",
  24: "/betovering.jpg",
  25: "/ajax.jpg",
  26: "/texels.jpg",
  27: "/walibi.jpg",
  28: "/heineken-experience.jpg",
  29: "/festival.jpg",
  30: "/dolle-diva.jpg",
  31: "/helikopter.jpg",
  32: "/weekend-weg.jpg",
  33: "/vrije-dag.jpg",
  34: "/airpods.jpg",
};

const CATEGORIE_META = {
  "Alle beloningen":           { emoji: "✨", kleur: "#7c2d12" },
  "Eten & Drinken":            { emoji: "🍴", kleur: "#d97706" },
  "Hans & Grietje Merchandise":{ emoji: "👕", kleur: "#16a34a" },
  "Uitjes & Waardebonnen":     { emoji: "🎟️", kleur: "#7c3aed" },
  "Overige Beloningen":        { emoji: "⭐", kleur: "#dc2626" },
};

function getAfbeelding(id) {
  return AFBEELDINGEN_PER_ID[id] || PLACEHOLDER;
}


// ============================================================
// HOOFD APP
// ============================================================

export default function App() {
  const [beloningen, setBeloningen] = useState([]);
  const [laden, setLaden] = useState(true);
  const [fout, setFout] = useState(null);
  const [actieveCategorie, setActieveCategorie] = useState("Alle beloningen");
  const [categorieen, setCategorieen] = useState([]);
  const [zoekterm, setZoekterm] = useState("");
  const [geselecteerd, setGeselecteerd] = useState(null);

  useEffect(() => {
    const laadData = async () => {
      try {
        const [beloningenRes, categorieenRes] = await Promise.all([
          fetch(`${API_BASE}/api/beloningen`),
          fetch(`${API_BASE}/api/categorieen`),
        ]);
        setBeloningen(await beloningenRes.json());
        setCategorieen(await categorieenRes.json());
      } catch (e) {
        setFout("Kon beloningen niet laden. Controleer de verbinding.");
      } finally {
        setLaden(false);
      }
    };
    laadData();
  }, []);

  const gefilterd = beloningen.filter((b) => {
    const catMatch = actieveCategorie === "Alle beloningen" || b.categorie === actieveCategorie;
    const zoekMatch = b.naam.toLowerCase().includes(zoekterm.toLowerCase());
    return catMatch && zoekMatch;
  });

  return (
    <div style={s.pagina}>
      {/* ACHTERGROND */}
      <div style={s.achtergrond} />
      <img src="/hans.png"    alt="" style={s.hansHoek}    aria-hidden="true" />
      <img src="/grietje.png" alt="" style={s.grietjeHoek} aria-hidden="true" />

      <div style={s.wrapper}>
        {/* HEADER */}
        <header style={s.header}>
          <div style={s.headerLinks}>
            <img src="/logo_HG.svg" alt="Hans & Grietje" style={s.logo} />
            <div>
              <h1 style={s.titel}>Beloningsshop</h1>
              <p style={s.ondertitel}>🍞 1 Kruimel = € 0,20 &nbsp;·&nbsp; Inwisselen bij Sam, Gerben of Emmy</p>
            </div>
          </div>
          <div style={s.kruimelBadge}>
            <span style={s.kruimelBadgeTekst}>Het Kruimelpad</span>
          </div>
        </header>

        {/* ZOEKBALK */}
        <div style={s.zoekWrapper}>
          <span style={s.zoekIcoon}>🔍</span>
          <input
            type="text"
            placeholder="Zoek een beloning..."
            value={zoekterm}
            onChange={(e) => setZoekterm(e.target.value)}
            style={s.zoekInput}
          />
          {zoekterm && (
            <button onClick={() => setZoekterm("")} style={s.zoekWis}>×</button>
          )}
        </div>

        {/* CATEGORIE TABS */}
        <div style={s.tabsWrapper}>
          {["Alle beloningen", ...categorieen].map((cat) => {
            const meta = CATEGORIE_META[cat] || { emoji: "🎁", kleur: "#7c2d12" };
            const actief = actieveCategorie === cat;
            return (
              <button
                key={cat}
                onClick={() => setActieveCategorie(cat)}
                style={{
                  ...s.tab,
                  ...(actief ? {
                    background: meta.kleur,
                    color: "white",
                    borderColor: meta.kleur,
                    boxShadow: `0 4px 14px ${meta.kleur}40`,
                  } : {}),
                }}
              >
                <span>{meta.emoji}</span>
                <span style={s.tabLabel}>{cat}</span>
              </button>
            );
          })}
        </div>

        {/* RESULTAATREGEL */}
        {!laden && !fout && (
          <p style={s.resultaatTekst}>
            {gefilterd.length} beloning{gefilterd.length !== 1 ? "en" : ""} gevonden
            {zoekterm && <> voor <em>"{zoekterm}"</em></>}
          </p>
        )}

        {/* INHOUD */}
        {laden && <Laadscherm />}
        {fout   && <FoutScherm bericht={fout} />}

        {!laden && !fout && (
          <div style={s.grid}>
            {gefilterd.map((b, i) => (
              <BeloningKaart
                key={b.id}
                beloning={b}
                vertraging={i * 40}
                onClick={() => setGeselecteerd(b)}
              />
            ))}
            {gefilterd.length === 0 && (
              <div style={s.leeg}>
                <p style={s.leegEmoji}>🌲</p>
                <p style={s.leegTekst}>Geen beloningen gevonden</p>
              </div>
            )}
          </div>
        )}

        <footer style={s.footer}>
          <p>🍪 Hans &amp; Grietje Pannenkoekenhuis · Sternweg 2A · Het Kruimelpad</p>
        </footer>
      </div>

      {/* DETAIL MODAL */}
      {geselecteerd && (
        <DetailModal beloning={geselecteerd} onSluit={() => setGeselecteerd(null)} />
      )}
    </div>
  );
}

// ============================================================
// BELONING KAART
// ============================================================

function BeloningKaart({ beloning, vertraging, onClick }) {
  const [hover, setHover] = useState(false);
  const [imgFout, setImgFout] = useState(false);
  const meta = CATEGORIE_META[beloning.categorie] || { kleur: "#7c2d12", emoji: "🎁" };
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...s.kaart,
        ...(hover ? s.kaartHover : {}),
        animationDelay: `${vertraging}ms`,
      }}
    >
      <div style={s.kaartFotoWrapper}>
        <img
          src={imgFout ? PLACEHOLDER : getAfbeelding(beloning.id)}
          alt={beloning.naam}
          style={s.kaartFoto}
          onError={() => setImgFout(true)}
        />
        <div style={{ ...s.categoriePil, background: meta.kleur }}>
          {meta.emoji} {beloning.categorie}
        </div>
      </div>

      {/* BODY */}
      <div style={s.kaartBody}>
        <h3 style={s.kaartNaam}>{beloning.naam}</h3>

        <div style={s.kaartPrijzen}>
          <div style={{ ...s.kruimelsBadge, color: meta.kleur, borderColor: meta.kleur + "40", background: meta.kleur + "10" }}>
            🍞 {beloning.kruimels.toLocaleString("nl-NL")} Kruimels
          </div>

        </div>

        <p style={s.kaartMeer}>Klik voor meer info →</p>
      </div>
    </div>
  );
}

// ============================================================
// DETAIL MODAL
// ============================================================

function DetailModal({ beloning, onSluit }) {
  const [imgFout, setImgFout] = useState(false);
  const meta = CATEGORIE_META[beloning.categorie] || { kleur: "#7c2d12", emoji: "🎁" };

  // Sluit bij Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onSluit(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onSluit]);

  return (
    <div style={s.modalOverlay} onClick={onSluit}>
      <div style={s.modal} onClick={(e) => e.stopPropagation()}>
        <button onClick={onSluit} style={s.modalSluit}>×</button>

        <img
          src={imgFout ? PLACEHOLDER : getAfbeelding(beloning.id)}
          alt={beloning.naam}
          style={s.modalFoto}
          onError={() => setImgFout(true)}
        />

        <div style={s.modalBody}>
          <div style={{ ...s.categoriePil, background: meta.kleur, display: "inline-flex", marginBottom: "12px" }}>
            {meta.emoji} {beloning.categorie}
          </div>
          <h2 style={s.modalTitel}>{beloning.naam}</h2>
          {beloning.beschrijving && (
            <p style={s.modalBeschrijving}>{beloning.beschrijving}</p>
          )}

          <div style={s.modalPrijzen}>
            <div style={{ ...s.modalKruimels, color: meta.kleur }}>
              🍞 {beloning.kruimels.toLocaleString("nl-NL")} Kruimels
            </div>

          </div>

          <div style={s.modalInfo}>
            <p style={s.modalInfoTekst}>
              💬 Inwisselen? Spreek Sam, Gerben of Emmy aan tijdens je dienst.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// LAAD & FOUT
// ============================================================

function Laadscherm() {
  return (
    <div style={s.laadWrapper}>
      {[...Array(6)].map((_, i) => (
        <div key={i} style={{ ...s.laadKaart, animationDelay: `${i * 100}ms` }} />
      ))}
    </div>
  );
}

function FoutScherm({ bericht }) {
  return (
    <div style={s.foutWrapper}>
      <p style={s.foutEmoji}>🌲</p>
      <p style={s.foutTekst}>{bericht}</p>
    </div>
  );
}

// ============================================================
// STYLES
// ============================================================

const s = {
  pagina: {
    minHeight: "100vh",
    position: "relative",
    overflow: "hidden",
    background: "var(--creme)",
    fontFamily: "var(--font-body)",
  },
  achtergrond: {
    position: "fixed",
    inset: 0,
    backgroundImage: "url('/achtergrond.png')",
    backgroundSize: "cover",
    backgroundPosition: "center bottom",
    backgroundRepeat: "no-repeat",
    opacity: 0.35,
    zIndex: 0,
    pointerEvents: "none",
  },
  hansHoek: {
    position: "fixed",
    bottom: "16px",
    left: "16px",
    height: "160px",
    zIndex: 1,
    pointerEvents: "none",
    opacity: 0.9,
    filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.12))",
  },
  grietjeHoek: {
    position: "fixed",
    bottom: "16px",
    right: "16px",
    height: "160px",
    zIndex: 1,
    pointerEvents: "none",
    opacity: 0.9,
    filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.12))",
  },
  wrapper: {
    position: "relative",
    zIndex: 2,
    maxWidth: "1300px",
    margin: "0 auto",
    padding: "24px 24px 200px",
  },

  // HEADER
  header: {
    background: "rgba(255,255,255,0.93)",
    borderRadius: "20px",
    border: "3px solid var(--bruin-licht)",
    boxShadow: "0 8px 24px rgba(75,36,8,0.12)",
    padding: "20px 28px",
    marginBottom: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "16px",
  },
  headerLinks: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
  },
  logo: { height: "80px", width: "auto" },
  titel: {
    fontFamily: "var(--font-display)",
    fontSize: "28px",
    fontWeight: "700",
    color: "var(--bruin-donker)",
    margin: 0,
  },
  ondertitel: {
    fontSize: "13px",
    color: "var(--bruin-midden)",
    fontStyle: "italic",
    marginTop: "4px",
  },
  kruimelBadge: {
    background: "linear-gradient(135deg, #7c2d12, #92400e)",
    borderRadius: "50px",
    padding: "10px 20px",
  },
  kruimelBadgeTekst: {
    color: "white",
    fontWeight: "700",
    fontSize: "14px",
    letterSpacing: "0.5px",
  },

  // ZOEK
  zoekWrapper: {
    position: "relative",
    marginBottom: "16px",
    display: "flex",
    alignItems: "center",
  },
  zoekIcoon: {
    position: "absolute",
    left: "16px",
    fontSize: "16px",
    pointerEvents: "none",
  },
  zoekInput: {
    width: "100%",
    padding: "13px 48px",
    background: "rgba(255,255,255,0.93)",
    border: "2px solid var(--bruin-licht)",
    borderRadius: "14px",
    fontSize: "15px",
    fontFamily: "var(--font-body)",
    color: "var(--tekst-donker)",
    outline: "none",
    boxShadow: "0 2px 10px rgba(75,36,8,0.07)",
    transition: "border-color 0.2s",
  },
  zoekWis: {
    position: "absolute",
    right: "14px",
    background: "var(--creme-donker)",
    border: "none",
    borderRadius: "50%",
    width: "26px",
    height: "26px",
    cursor: "pointer",
    fontSize: "16px",
    color: "var(--bruin-midden)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  // TABS
  tabsWrapper: {
    display: "flex",
    gap: "8px",
    marginBottom: "16px",
    flexWrap: "wrap",
  },
  tab: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "9px 16px",
    background: "rgba(255,255,255,0.90)",
    border: "2px solid var(--bruin-licht)",
    borderRadius: "50px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    color: "var(--bruin-midden)",
    fontFamily: "var(--font-body)",
    transition: "all 0.2s",
    whiteSpace: "nowrap",
  },
  tabLabel: { fontSize: "13px" },

  // RESULTAAT
  resultaatTekst: {
    fontSize: "13px",
    color: "var(--tekst-midden)",
    marginBottom: "16px",
    fontStyle: "italic",
  },

  // GRID
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "20px",
  },

  // KAART
  kaart: {
    background: "rgba(255,255,255,0.95)",
    borderRadius: "var(--radius-kaart)",
    border: "2px solid var(--creme-donker)",
    boxShadow: "var(--schaduw-kaart)",
    overflow: "hidden",
    cursor: "pointer",
    transition: "all 0.25s ease",
    animation: "fadeInUp 0.4s ease both",
  },
  kaartHover: {
    transform: "translateY(-5px)",
    boxShadow: "var(--schaduw-hover)",
    borderColor: "var(--bruin-licht)",
  },
  kaartFotoWrapper: {
    position: "relative",
    height: "170px",
    overflow: "hidden",
    background: "var(--creme-donker)",
  },
  kaartFoto: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    transition: "transform 0.3s ease",
  },
  categoriePil: {
    position: "absolute",
    bottom: "10px",
    left: "10px",
    color: "white",
    fontSize: "11px",
    fontWeight: "700",
    padding: "4px 10px",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    letterSpacing: "0.3px",
  },
  kaartBody: {
    padding: "14px 16px 16px",
  },
  kaartNaam: {
    fontFamily: "var(--font-display)",
    fontSize: "15px",
    fontWeight: "600",
    color: "var(--bruin-donker)",
    marginBottom: "10px",
    lineHeight: "1.3",
  },
  kaartPrijzen: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
  },
  kruimelsBadge: {
    fontSize: "12px",
    fontWeight: "700",
    padding: "4px 10px",
    borderRadius: "8px",
    border: "1.5px solid",
    flex: 1,
  },
  euroBadge: {
    fontSize: "13px",
    fontWeight: "700",
    color: "var(--tekst-midden)",
    background: "var(--creme-donker)",
    padding: "4px 10px",
    borderRadius: "8px",
  },
  kaartMeer: {
    fontSize: "11px",
    color: "var(--tekst-midden)",
    marginTop: "8px",
    fontStyle: "italic",
  },

  // MODAL
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(40, 15, 5, 0.6)",
    zIndex: 200,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    backdropFilter: "blur(4px)",
  },
  modal: {
    background: "white",
    borderRadius: "24px",
    maxWidth: "500px",
    width: "100%",
    overflow: "hidden",
    boxShadow: "0 24px 60px rgba(40,15,5,0.3)",
    position: "relative",
    maxHeight: "90vh",
    overflowY: "auto",
  },
  modalSluit: {
    position: "absolute",
    top: "14px",
    right: "14px",
    background: "rgba(255,255,255,0.9)",
    border: "none",
    borderRadius: "50%",
    width: "36px",
    height: "36px",
    fontSize: "22px",
    cursor: "pointer",
    color: "var(--bruin-donker)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  },
  modalFoto: {
    width: "100%",
    height: "240px",
    objectFit: "cover",
    display: "block",
  },
  modalBody: {
    padding: "24px",
  },
  modalTitel: {
    fontFamily: "var(--font-display)",
    fontSize: "22px",
    fontWeight: "700",
    color: "var(--bruin-donker)",
    marginBottom: "10px",
  },
  modalBeschrijving: {
    fontSize: "14px",
    color: "var(--tekst-midden)",
    lineHeight: "1.6",
    marginBottom: "18px",
  },
  modalPrijzen: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "18px",
    flexWrap: "wrap",
  },
  modalKruimels: {
    fontSize: "18px",
    fontWeight: "800",
  },
  modalEuro: {
    fontSize: "14px",
    color: "var(--tekst-midden)",
    background: "var(--creme-donker)",
    padding: "6px 14px",
    borderRadius: "8px",
    fontWeight: "600",
  },
  modalInfo: {
    background: "var(--creme-hover)",
    border: "1px solid var(--bruin-licht)",
    borderRadius: "12px",
    padding: "14px 16px",
  },
  modalInfoTekst: {
    fontSize: "13px",
    color: "var(--bruin-midden)",
    lineHeight: "1.5",
    margin: 0,
  },

  // LAAD
  laadWrapper: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "20px",
  },
  laadKaart: {
    height: "300px",
    borderRadius: "var(--radius-kaart)",
    background: "linear-gradient(90deg, #f5e6d3 25%, #fef3e7 50%, #f5e6d3 75%)",
    backgroundSize: "800px 100%",
    animation: "shimmer 1.4s infinite ease-in-out",
  },

  // LEEG / FOUT
  leeg: {
    gridColumn: "1 / -1",
    textAlign: "center",
    padding: "60px 20px",
    background: "rgba(255,255,255,0.8)",
    borderRadius: "var(--radius-kaart)",
    border: "2px dashed var(--bruin-licht)",
  },
  leegEmoji: { fontSize: "48px", marginBottom: "12px" },
  leegTekst: { color: "var(--bruin-midden)", fontSize: "18px", fontStyle: "italic" },
  foutWrapper: {
    textAlign: "center",
    padding: "60px 20px",
    background: "rgba(255,255,255,0.8)",
    borderRadius: "var(--radius-kaart)",
    border: "2px dashed #fca5a5",
  },
  foutEmoji: { fontSize: "48px", marginBottom: "12px" },
  foutTekst: { color: "#dc2626", fontSize: "16px" },

  // MERCHANDISE LOGO KAART
  merchandiseWrapper: {
    width: "100%",
    height: "100%",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    overflow: "hidden",
  },
  merchandiseBg: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(135deg, #fdf6e8 0%, #f5e6d3 50%, #fef3e7 100%)",
  },
  merchandiseLogo: {
    position: "relative",
    height: "80px",
    width: "auto",
    filter: "drop-shadow(0 2px 8px rgba(75,36,8,0.15))",
    zIndex: 1,
  },
  merchandiseLabel: {
    position: "relative",
    zIndex: 1,
    fontSize: "13px",
    fontWeight: "700",
    color: "#7c2d12",
    background: "rgba(255,255,255,0.8)",
    padding: "4px 12px",
    borderRadius: "20px",
    border: "1px solid #d4a574",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  },

  // FOOTER
  footer: {
    textAlign: "center",
    marginTop: "40px",
    color: "var(--tekst-midden)",
    fontSize: "13px",
    fontStyle: "italic",
  },
};
