import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function MapaFases({
  nomeJogador = "",
  fasesLiberadas = 1,
  fasesConcluidas = [],
  pecas = [],
  abrirFila,
  abrirPilha,
  abrirArvore,
  abrirLista,
  abrirGrafo,
  abrirHash,
  abrirHeap,
  abrirFinal,
  abrirInventario,
  voltarMenu,
}) {
  const [ajudaAberta, setAjudaAberta] = useState(false);
  const [finalAberto, setFinalAberto] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function verificarTela() {
      setIsMobile(window.innerWidth <= 768);
    }

    verificarTela();
    window.addEventListener("resize", verificarTela);

    return () => {
      window.removeEventListener("resize", verificarTela);
    };
  }, []);

  const finalLiberada = pecas.length === 7;

  const fasesDesktop = [
    { n: 1, nome: "Fila", x: 90, y: 220, onClick: abrirFila },
    { n: 2, nome: "Pilha", x: 190, y: 120, onClick: abrirPilha },
    { n: 3, nome: "Árvore", x: 330, y: 250, onClick: abrirArvore },
    { n: 4, nome: "Lista", x: 450, y: 130, onClick: abrirLista },
    { n: 5, nome: "Grafo", x: 580, y: 300, onClick: abrirGrafo },
    { n: 6, nome: "Hash", x: 700, y: 180, onClick: abrirHash },
    { n: 7, nome: "Heap", x: 790, y: 330, onClick: abrirHeap },
    { n: 8, nome: "Núcleo", x: 420, y: 430, onClick: () => setFinalAberto(true) },
  ];

  const fasesMobile = [
    { n: 1, nome: "Fila", x: 120, y: 90, onClick: abrirFila },
    { n: 2, nome: "Pilha", x: 300, y: 190, onClick: abrirPilha },
    { n: 3, nome: "Árvore", x: 120, y: 290, onClick: abrirArvore },
    { n: 4, nome: "Lista", x: 300, y: 390, onClick: abrirLista },
    { n: 5, nome: "Grafo", x: 120, y: 500, onClick: abrirGrafo },
    { n: 6, nome: "Hash", x: 300, y: 610, onClick: abrirHash },
    { n: 7, nome: "Heap", x: 120, y: 720, onClick: abrirHeap },
    { n: 8, nome: "Núcleo", x: 300, y: 830, onClick: () => setFinalAberto(true) },
  ];

  const fases = isMobile ? fasesMobile : fasesDesktop;

  const caminhoDesktop = `
    M 115 245
    C 180 120, 260 90, 220 150
    C 190 230, 330 310, 360 275
    C 430 195, 470 90, 500 155
    C 540 245, 560 330, 610 320
    C 700 300, 650 160, 725 205
    C 820 260, 820 350, 800 360
    C 690 440, 520 450, 445 445
  `;

  const caminhoMobile = `
    M 120 90
    C 220 120, 330 120, 300 190
    C 270 260, 130 230, 120 290
    C 110 360, 280 330, 300 390
    C 330 470, 120 430, 120 500
    C 120 580, 300 530, 300 610
    C 300 690, 120 650, 120 720
    C 120 800, 290 760, 300 830
  `;

  const progressoDesktop = {
    1: 0.03,
    2: 0.11,
    3: 0.3,
    4: 0.39,
    5: 0.55,
    6: 0.65,
    7: 0.75,
    8: 1,
  };

  const progressoMobile = {
    1: 0.02,
    2: 0.15,
    3: 0.28,
    4: 0.42,
    5: 0.56,
    6: 0.7,
    7: 0.84,
    8: 1,
  };

  const progressoCaminho = finalLiberada
    ? 1
    : isMobile
    ? progressoMobile[fasesLiberadas] || 0.02
    : progressoDesktop[fasesLiberadas] || 0.03;

  const caminhoMapa = isMobile ? caminhoMobile : caminhoDesktop;
  const viewBox = isMobile ? "0 0 420 900" : "0 0 900 520";
  const viewW = isMobile ? 420 : 900;
  const viewH = isMobile ? 900 : 520;

  function bloqueada(numero) {
    if (numero === 8) return !finalLiberada;
    return fasesLiberadas < numero;
  }

  return (
    <div style={pagina}>
      <div style={card}>
        <div style={barraSuperior}>
          <button onClick={voltarMenu} style={botaoVoltar}>
            🏠
          </button>

          <div style={statusItem}>
            <span>🎒</span>
            <span>{pecas.length}/7</span>
            <button onClick={abrirInventario} style={botaoPlus}>
              +
            </button>
          </div>

          <div style={statusItem}>
            <span>🧙</span>
            <span style={nomeJogadorStyle}>{nomeJogador || "Jogador"}</span>
          </div>

          <button onClick={() => setAjudaAberta(true)} style={botaoAjuda}>
            📜 <span>Ajuda</span>
          </button>
        </div>

        <div
          style={{
            ...containerMapa,
            aspectRatio: isMobile ? "420 / 900" : "900 / 560",
            maxWidth: isMobile ? "430px" : "980px",
          }}
        >
          <svg style={svgCaminho} viewBox={viewBox} preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="rosaCaminho" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f9a8d4" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>

            <path
              d={caminhoMapa}
              fill="none"
              stroke="white"
              strokeWidth={isMobile ? 42 : 58}
              strokeLinecap="round"
            />

            <path
              d={caminhoMapa}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth={isMobile ? 30 : 42}
              strokeLinecap="round"
            />

            <motion.path
              d={caminhoMapa}
              fill="none"
              stroke="url(#rosaCaminho)"
              strokeWidth={isMobile ? 30 : 42}
              strokeLinecap="round"
              initial={false}
              animate={{ pathLength: progressoCaminho }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          </svg>

          {fases.map((fase) => (
            <Fase
              key={fase.n}
              {...fase}
              viewW={viewW}
              viewH={viewH}
              isMobile={isMobile}
              bloqueada={bloqueada(fase.n)}
              concluida={fasesConcluidas.includes(fase.n)}
              onClick={() => {
                if (!bloqueada(fase.n) && fase.onClick) fase.onClick();
              }}
            />
          ))}

          <motion.div
            style={{
              ...presente,
              left: isMobile ? `${(300 / 420) * 100}%` : `${(445 / 900) * 100}%`,
              top: isMobile ? `${(830 / 900) * 100}%` : `${(420 / 520) * 100}%`,
            }}
            animate={
              finalAberto
                ? { scale: [1, 1.4, 0.9, 1.2], rotate: [0, -15, 15, 0] }
                : { scale: 1 }
            }
            transition={{ duration: 0.7 }}
          >
            {finalAberto ? "🎉" : "🎁"}
          </motion.div>
        </div>

        <div style={footer}>
          <p style={textoFooter}>Complete os labirintos para restaurar o núcleo!</p>
        </div>

        <AnimatePresence>
          {ajudaAberta && (
            <motion.div
              style={modalFundo}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAjudaAberta(false)}
            >
              <motion.div
                style={modal}
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h2 style={{ color: "#4f46e5" }}>📜 Ajuda</h2>

                <p style={textoAjuda}>
                  • Clique em uma fase liberada.
                  <br />
                  • Ao concluir uma fase, você recebe um fragmento.
                  <br />
                  • Colete os 7 fragmentos.
                  <br />
                  • Complete o inventário para desbloquear o Núcleo Final.
                  <br />
                  • O caminho rosa mostra seu progresso.
                </p>

                <button onClick={() => setAjudaAberta(false)} style={botaoFechar}>
                  ENTENDI
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {finalAberto && (
            <motion.div
              style={modalFundo}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFinalAberto(false)}
            >
              <motion.div
                style={modalFinal}
                initial={{ scale: 0.6, y: 40 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.6, y: 40 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={iconeFinal}>🎁✨</div>
                <h2 style={tituloFinal}>Parabéns!</h2>

                <p style={textoFinal}>
                  Você juntou todos os fragmentos e chegou à fase final.
                  Agora falta restaurar o Núcleo do Conhecimento!
                </p>

                <button
                  onClick={() => {
                    setFinalAberto(false);
                    if (abrirFinal) abrirFinal();
                  }}
                  style={botaoFinal}
                >
                  ENTRAR NA FASE FINAL
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Fase({
  n,
  nome,
  x,
  y,
  viewW,
  viewH,
  bloqueada,
  concluida,
  onClick,
  isMobile,
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: `${(x / viewW) * 100}%`,
        top: `${(y / viewH) * 100}%`,
        transform: "translate(-50%, -50%)",
        zIndex: 10,
        cursor: bloqueada ? "not-allowed" : "pointer",
      }}
    >
      <motion.div
        whileTap={!bloqueada ? { scale: 0.95 } : {}}
        onClick={() => {
          if (!bloqueada && onClick) {
            onClick();
          }
        }}
      >
        {concluida && (
          <div style={estrelas}>
            <span>⭐</span>
            <span>⭐</span>
            <span>⭐</span>
          </div>
        )}

        <div
          style={{
            ...circuloFase,
            width: isMobile ? "70px" : "80px",
            height: isMobile ? "70px" : "80px",
            background: bloqueada
              ? "#cbd5e1"
              : concluida
              ? "#9333ea"
              : "#9333ea",
          }}
        >
          {bloqueada ? "🔒" : n}
        </div>

        <span
          style={{
            ...nomeFase,
            fontSize: isMobile ? "12px" : "14px",
          }}
        >
          {nome}
        </span>
      </motion.div>
    </div>
  );
}
const pagina = {
  minHeight: "100svh",
  background: "linear-gradient(to bottom, #c084fc 0%, #818cf8 50%, #fbcfe8 100%)",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  padding: "18px 10px 12px",
  boxSizing: "border-box",
  fontFamily: "'Inter', sans-serif",
};

const card = {
  width: "100%",
  maxWidth: "1100px",
  background: "rgba(255, 255, 255, 0.88)",
  backdropFilter: "blur(10px)",
  borderRadius: "28px",
  padding: "clamp(12px, 3vw, 24px)",
  boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  boxSizing: "border-box",
  position: "relative",
};

const barraSuperior = {
  display: "grid",
  gridTemplateColumns:
    "44px minmax(88px, auto) minmax(92px, auto) minmax(82px, auto)",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "7px",
  marginBottom: "10px",
  width: "100%",
};

const statusItem = {
  background: "rgba(79, 70, 229, 0.16)",
  border: "2px solid rgba(147, 51, 234, 0.25)",
  padding: "7px 9px",
  borderRadius: "999px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "5px",
  color: "#4c1d95",
  fontSize: "clamp(11px, 3vw, 14px)",
  fontWeight: "900",
  boxShadow: "0 8px 18px rgba(147,51,234,0.12)",
  minWidth: 0,
  whiteSpace: "nowrap",
};

const nomeJogadorStyle = {
  maxWidth: "70px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  display: "inline-block",
};

const botaoVoltar = {
  width: "44px",
  height: "44px",
  borderRadius: "50%",
  border: "none",
  background: "linear-gradient(135deg, #9333ea, #7e22ce)",
  color: "white",
  cursor: "pointer",
  fontSize: "20px",
  fontWeight: "bold",
  boxShadow: "0 10px 22px rgba(147,51,234,0.35)",
};

const botaoPlus = {
  background: "linear-gradient(135deg, #4ade80, #22c55e)",
  border: "3px solid white",
  borderRadius: "50%",
  width: "27px",
  height: "27px",
  color: "white",
  cursor: "pointer",
  fontWeight: "900",
  boxShadow: "0 6px 12px rgba(34,197,94,0.3)",
  flexShrink: 0,
};

const botaoAjuda = {
  height: "44px",
  padding: "0 10px",
  borderRadius: "999px",
  background: "rgba(147, 51, 234, 0.16)",
  border: "2px solid rgba(147, 51, 234, 0.25)",
  color: "#6b21a8",
  fontSize: "clamp(11px, 3vw, 15px)",
  fontWeight: "900",
  cursor: "pointer",
  boxShadow: "0 8px 18px rgba(147,51,234,0.12)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "5px",
  minWidth: "82px",
  whiteSpace: "nowrap",
};

const containerMapa = {
  position: "relative",
  width: "100%",
  margin: "4px auto 0",
  flexShrink: 0,
};

const svgCaminho = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  zIndex: 1,
};

const estrelas = {
  position: "absolute",
  top: "-24px",
  left: "50%",
  transform: "translateX(-50%)",
  display: "flex",
  gap: "2px",
  fontSize: "12px",
  zIndex: 20,
  pointerEvents: "none",
};

const circuloFase = {
  borderRadius: "50%",
  border: "4px solid white",
  boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  fontWeight: "bold",
};

const nomeFase = {
  position: "absolute",
  top: "calc(100% + 4px)",
  left: "50%",
  transform: "translateX(-50%)",
  color: "#64748b",
  fontWeight: "bold",
  textTransform: "uppercase",
  whiteSpace: "nowrap",
};

const presente = {
  position: "absolute",
  transform: "translate(-50%, -50%)",
  fontSize: "clamp(28px, 8vw, 46px)",
  zIndex: 25,
  pointerEvents: "none",
};

const footer = {
  textAlign: "center",
  padding: "8px 0 0",
  marginTop: "6px",
  borderTop: "1px solid rgba(0,0,0,0.05)",
};

const textoFooter = {
  fontSize: "clamp(11px, 2.7vw, 13px)",
  color: "#64748b",
  fontWeight: "700",
  margin: 0,
};

const modalFundo = {
  position: "absolute",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  backdropFilter: "blur(5px)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 100,
  borderRadius: "28px",
};

const modal = {
  width: "min(90%, 420px)",
  padding: "26px",
  background: "white",
  borderRadius: "24px",
  textAlign: "center",
};

const textoAjuda = {
  fontSize: "14px",
  color: "#64748b",
  lineHeight: "1.8",
  textAlign: "left",
};

const botaoFechar = {
  marginTop: "20px",
  padding: "12px",
  background: "#818cf8",
  border: "none",
  borderRadius: "15px",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
  width: "100%",
};

const modalFinal = {
  width: "min(90%, 430px)",
  background: "white",
  borderRadius: "28px",
  padding: "32px",
  textAlign: "center",
  boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
};

const iconeFinal = { fontSize: "56px", marginBottom: "10px" };

const tituloFinal = {
  fontSize: "34px",
  color: "#1e293b",
  margin: "0 0 12px",
  fontWeight: "900",
};

const textoFinal = {
  color: "#64748b",
  fontSize: "15px",
  lineHeight: "1.7",
};

const botaoFinal = {
  width: "100%",
  padding: "15px",
  background: "#9333ea",
  border: "none",
  borderRadius: "16px",
  color: "white",
  fontWeight: "900",
  cursor: "pointer",
  marginTop: "20px",
};

export default MapaFases;