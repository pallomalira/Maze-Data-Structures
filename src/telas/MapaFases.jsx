import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as ReactJoyride from "react-joyride";

const Joyride = ReactJoyride.default || ReactJoyride.Joyride;

function MapaFases({
  nomeJogador = "",
  fasesLiberadas = 1,
  fasesConcluidas = [],
  pecas = [],
  mostrarHistoriaMapa,
  fecharHistoriaMapa,
  abrirFila,
  abrirPilha,
  abrirLista,
  abrirArvore,
  abrirGrafo,
  abrirFinal,
  abrirInventario,
  voltarMenu,
}) {
  const [ajudaAberta, setAjudaAberta] = useState(false);
  const [finalAberto, setFinalAberto] = useState(false);
  const [runTour, setRunTour] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function verificarTela() {
      setIsMobile(window.innerWidth <= 768);
    }

    verificarTela();
    window.addEventListener("resize", verificarTela);

    return () => window.removeEventListener("resize", verificarTela);
  }, []);

  const totalFases = 5;
  const finalLiberada = pecas.length >= totalFases || fasesLiberadas >= 6;

  const fases = [
    { n: 1, nome: "Fila", subtitulo: "Queue", icone: "🏪", x: 82, y: 70, onClick: abrirFila },
    { n: 2, nome: "Pilha", subtitulo: "Stack", icone: "🏰", x: 318, y: 94, onClick: abrirPilha },
    { n: 3, nome: "Lista", subtitulo: "Linked List", icone: "🚪", x: 82, y: 245, onClick: abrirLista },
    { n: 4, nome: "Árvore", subtitulo: "Tree", icone: "🌳", x: 318, y: 270, onClick: abrirArvore },
    { n: 5, nome: "Grafo", subtitulo: "Graph", icone: "🕸️", x: 82, y: 430, onClick: abrirGrafo },
    { n: 6, nome: "Núcleo", subtitulo: "Final", icone: "💎", x: 318, y: 458, onClick: () => setFinalAberto(true) },
  ];

  /*
    Caminho em formato de labirinto, seguindo seu desenho:
    Fila -> Pilha -> Lista -> Árvore -> Grafo -> Núcleo.
    O trecho Lista -> Árvore faz a curva por baixo, sem cruzar por cima.
  */
  const caminhoMapa = `
  M 82 70
  C 150 45, 245 45, 318 94

  C 250 130, 155 175, 82 245

  C 150 225, 245 225, 318 270

  C 250 305, 155 360, 82 430

  C 150 465, 245 485, 318 458
`;

  const progresso = {
    1: 0.04,
    2: 0.22,
    3: 0.42,
    4: 0.62,
    5: 0.82,
    6: 1,
  };

  const progressoCaminho = finalLiberada
    ? 1
    : progresso[Math.min(fasesLiberadas, 6)] || 0.04;

  const viewBox = "0 0 400 540";
  const viewW = 400;
  const viewH = 540;

  const steps = [
    {
      target: ".tour-topo",
      content: "Aqui ficam Menu, nome do jogo, Ajuda, jogador e inventário.",
      placement: "bottom",
      disableBeacon: true,
    },
    {
      target: ".tour-inventario",
      content: "O inventário mostra os fragmentos coletados nas fases.",
      placement: "bottom",
    },
    {
      target: ".tour-mapa",
      content: "Esse é o mapa da jornada. Cada ponto representa uma fase.",
      placement: "top",
    },
    {
      target: ".tour-caminho",
      content: "O caminho colorido mostra o progresso até o Núcleo.",
      placement: "top",
    },
    {
      target: ".tour-fase-1",
      content: "Esta é uma fase liberada. Clique nela para iniciar o desafio.",
      placement: "bottom",
    },
    {
      target: ".tour-fase-6",
      content: "O Núcleo é a fase final. Ele será liberado depois das fases principais.",
      placement: "top",
    },
    {
      target: ".tour-tutorial",
      content: "Use este botão para rever o tutorial quando quiser.",
      placement: "top",
    },
  ];

  function iniciarTutorial() {
    setRunTour(false);
    setTimeout(() => setRunTour(true), 100);
  }

  function bloqueada(numero) {
    if (numero === 6) return !finalLiberada;
    return fasesLiberadas < numero;
  }

  function faseConcluida(numero) {
    return (
      fasesConcluidas.includes(numero) ||
      pecas.some((peca) => peca.id === numero) ||
      fasesLiberadas > numero
    );
  }

  function abrirFase(fase) {
    if (bloqueada(fase.n)) return;

    if (fase.n === 6) {
      setFinalAberto(true);
      return;
    }

    if (fase.onClick) fase.onClick();
  }

  return (
    <div style={pagina}>
      <div style={card}>
        <Joyride
          steps={steps}
          run={runTour}
          continuous
          showSkipButton
          showProgress
          disableOverlayClose
          disableScrolling
          locale={{
            back: "Voltar",
            close: "Fechar",
            last: "Concluir",
            next: "Próximo",
            skip: "Pular",
          }}
          styles={{
            options: {
              zIndex: 3000,
              primaryColor: "#7c3aed",
              textColor: "#334155",
              overlayColor: "rgba(15, 23, 42, 0.65)",
              backgroundColor: "#ffffff",
              arrowColor: "#ffffff",
            },
            tooltip: {
              borderRadius: "20px",
              padding: "14px",
              maxWidth: "290px",
              boxShadow: "0 20px 45px rgba(15, 23, 42, 0.22)",
              border: "1px solid #e2e8f0",
            },
            tooltipContent: {
              padding: "8px 4px",
              fontSize: "13px",
              lineHeight: "1.45",
              fontWeight: "700",
            },
            spotlight: {
              borderRadius: "18px",
              boxShadow: "0 0 0 4px rgba(124, 58, 237, 0.25)",
            },
            buttonNext: {
              background: "linear-gradient(135deg, #7c3aed, #ec4899)",
              borderRadius: "999px",
              padding: "9px 16px",
              fontWeight: "900",
              fontSize: "13px",
            },
            buttonBack: {
              color: "#64748b",
              fontWeight: "900",
              fontSize: "13px",
            },
            buttonSkip: {
              color: "#ec4899",
              fontWeight: "900",
              fontSize: "13px",
            },
          }}
          callback={(data) => {
            if (data.status === "finished" || data.status === "skipped") {
              setRunTour(false);
            }
          }}
        />

        <header style={topo} className="tour-topo">
          <button onClick={voltarMenu} style={botaoMenu}>
            <span style={setaMenu}>←</span>
            <span>Menu</span>
          </button>

          <div style={logoBox}>
            <div style={logoIcone}>🧩</div>
            <h1 style={tituloMapa}>MAZE</h1>
            <span style={subtituloMapa}>Data Structures</span>
          </div>

          <button onClick={() => setAjudaAberta(true)} style={botaoAjuda}>
            Ajuda
          </button>
        </header>

        <section style={painelInfo}>
          <div style={infoJogador}>
            <span style={iconeInfo}>🧙</span>
            <div style={infoTexto}>
              <span style={labelInfo}>Jogador</span>
              <strong style={valorInfo}>{nomeJogador || "Jogador"}</strong>
            </div>
          </div>

          <button
            onClick={abrirInventario}
            style={infoInventario}
            className="tour-inventario"
          >
            <span style={iconeInfo}>🎒</span>
            <div style={infoTexto}>
              <span style={labelInfo}>Inventário</span>
              <strong style={valorInfo}>
                {Math.min(pecas.length, totalFases)}/{totalFases}
              </strong>
            </div>
          </button>
        </section>

        <div style={mapaWrapper} className="tour-mapa">
          <div style={containerMapa}>
            <svg
                style={svgCaminho}
                viewBox={viewBox}
                preserveAspectRatio="xMidYMid meet"
                className="tour-caminho"
            >
              <defs>
                <linearGradient id="caminhoGradiente" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#7c3aed"/>
                  <stop offset="100%" stopColor="#ec4899"/>
                </linearGradient>
              </defs>

              <path
                  d={caminhoMapa}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="36"
                  strokeLinecap="round"
              />

              <path
                  d={caminhoMapa}
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="23"
                  strokeLinecap="round"
                  strokeLinejoin="round"
              />

              <motion.path
                  d={caminhoMapa}
                  fill="none"
                  stroke="url(#caminhoGradiente)"
                  strokeWidth="23"
                  strokeLinecap="round"
                  initial={false}
                  animate={{pathLength: progressoCaminho}}
                  transition={{duration: 0.8, ease: "easeInOut"}}
              />
            </svg>

            {fases.map((fase) => (
                <Fase
                    key={fase.n}
                    {...fase}
                    viewW={viewW}
                viewH={viewH}
                bloqueada={bloqueada(fase.n)}
                concluida={faseConcluida(fase.n)}
                onClick={() => abrirFase(fase)}
              />
            ))}
          </div>
        </div>

        <footer style={rodape}>
          <p style={textoFooter}>Complete as fases para restaurar o Núcleo.</p>

          <button
            onClick={iniciarTutorial}
            style={botaoTutorial}
            className="tour-tutorial"
          >
            Ver tutorial
          </button>
        </footer>

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
                initial={{ scale: 0.88, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.88, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h2 style={tituloModal}>📖 Ajuda</h2>

                <p style={textoAjuda}>
                  Clique nas fases liberadas para entrar nos labirintos.
                  Ao concluir uma fase, você recebe um fragmento no inventário.
                  Quando juntar os fragmentos principais, o Núcleo será liberado.
                </p>

                <button onClick={() => setAjudaAberta(false)} style={botaoFechar}>
                  Entendi
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
                initial={{ scale: 0.7, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.7, y: 30 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={iconeFinal}>💎✨</div>
                <h2 style={tituloFinal}>Núcleo do Conhecimento</h2>

                <p style={textoFinal}>
                  Você chegou ao Núcleo Final. Agora falta restaurar o equilíbrio
                  do Reino MazeData.
                </p>

                <button
                  onClick={() => {
                    setFinalAberto(false);
                    if (abrirFinal) abrirFinal();
                  }}
                  style={{
                    ...botaoFinal,
                    opacity: finalLiberada ? 1 : 0.6,
                    cursor: finalLiberada ? "pointer" : "not-allowed",
                  }}
                  disabled={!finalLiberada}
                >
                  {finalLiberada ? "Entrar na fase final" : "Núcleo bloqueado"}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {mostrarHistoriaMapa && (
            <motion.div
              style={modalFundo}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={fecharHistoriaMapa}
            >
              <motion.div
                style={modal}
                initial={{ scale: 0.88, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.88, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h2 style={tituloModal}>🧩 Jornada Maze</h2>
                <p style={textoAjuda}>
                  O Reino MazeData perdeu seus fragmentos. Complete cada fase
                  para recuperar uma parte do conhecimento e chegar ao Núcleo.
                </p>

                <button onClick={fecharHistoriaMapa} style={botaoFechar}>
                  Começar jornada
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
  subtitulo,
  icone,
  x,
  y,
  viewW,
  viewH,
  bloqueada,
  concluida,
  onClick,
}) {
  const isNucleo = n === 6;

  return (
    <div
      className={`tour-fase-${n}`}
      style={{
        position: "absolute",
        left: `${(x / viewW) * 100}%`,
        top: `${(y / viewH) * 100}%`,
        transform: "translate(-50%, -50%)",
        zIndex: 10,
      }}
    >
      <motion.button
        whileTap={!bloqueada ? { scale: 0.95 } : {}}
        onClick={() => {
          if (!bloqueada && onClick) onClick();
        }}
        style={{
          ...faseBotao,
          background: bloqueada
            ? "#e2e8f0"
            : concluida
            ? "linear-gradient(135deg, #22c55e, #16a34a)"
            : "linear-gradient(135deg, #7c3aed, #ec4899)",
          cursor: bloqueada ? "not-allowed" : "pointer",
          opacity: bloqueada ? 0.9 : 1,
        }}
      >
        <span style={iconeFase}>{bloqueada ? "🔒" : isNucleo ? "💎" : icone}</span>
      </motion.button>

      {concluida && !isNucleo && <span style={checkFase}>✓</span>}

      <div style={nomeFaseBox}>
        <strong style={nomeFase}>{nome}</strong>
        <span style={subtituloFase}>({subtitulo})</span>
      </div>
    </div>
  );
}

const pagina = {
  width: "100vw",
  minHeight: "100svh",
  background: "#f8fafc",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  padding: "8px",
  boxSizing: "border-box",
  fontFamily: "'Inter', sans-serif",
  overflow: "hidden",
};

const card = {
  width: "100%",
  maxWidth: "430px",
  height: "calc(100svh - 16px)",
  background: "white",
  borderRadius: "24px",
  boxShadow: "0 20px 45px rgba(15,23,42,0.14)",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  boxSizing: "border-box",
  position: "relative",
};

const topo = {
  minHeight: "70px",
  display: "grid",
  gridTemplateColumns: "1fr auto 1fr",
  alignItems: "center",
  borderBottom: "1px solid #e2e8f0",
  padding: "6px 14px",
  boxSizing: "border-box",
  flexShrink: 0,
};

const botaoMenu = {
  border: "none",
  background: "transparent",
  color: "#1e293b",
  fontSize: "18px",
  fontWeight: "900",
  display: "flex",
  alignItems: "center",
  gap: "6px",
  padding: 0,
  cursor: "pointer",
};

const setaMenu = {
  fontSize: "25px",
  lineHeight: 1,
  fontWeight: "400",
};

const logoBox = {
  textAlign: "center",
  lineHeight: 1,
};

const logoIcone = {
  fontSize: "24px",
  lineHeight: 1,
};

const tituloMapa = {
  margin: "1px 0 0",
  color: "#1e293b",
  fontSize: "22px",
  letterSpacing: "4px",
  fontWeight: "900",
};

const subtituloMapa = {
  color: "#818cf8",
  fontSize: "10px",
  fontWeight: "900",
  textTransform: "uppercase",
  letterSpacing: "1.5px",
};

const botaoAjuda = {
  justifySelf: "end",
  height: "34px",
  border: "1px solid #e2e8f0",
  borderRadius: "999px",
  background: "#f8fafc",
  color: "#7c3aed",
  fontSize: "12px",
  fontWeight: "900",
  padding: "0 12px",
  cursor: "pointer",
};

const painelInfo = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "8px",
  padding: "10px 12px 4px",
  boxSizing: "border-box",
  flexShrink: 0,
};

const infoJogador = {
  minWidth: 0,
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "16px",
  padding: "8px 10px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const infoInventario = {
  minWidth: 0,
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "16px",
  padding: "8px 10px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  cursor: "pointer",
  textAlign: "left",
};

const infoTexto = {
  minWidth: 0,
};

const iconeInfo = {
  width: "28px",
  height: "28px",
  borderRadius: "50%",
  background: "#ede9fe",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const labelInfo = {
  display: "block",
  color: "#64748b",
  fontSize: "9px",
  fontWeight: "800",
  lineHeight: "1",
};

const valorInfo = {
  display: "block",
  color: "#1e293b",
  fontSize: "12px",
  fontWeight: "900",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const mapaWrapper = {
  padding: "0 8px",
  boxSizing: "border-box",
  flex: 1,
  minHeight: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const containerMapa = {
  position: "relative",
  width: "100%",
  maxWidth: "410px",
  aspectRatio: "400 / 540",
  maxHeight: "100%",
};

const svgCaminho = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  zIndex: 1,
};

const faseBotao = {
  width: "58px",
  height: "58px",
  borderRadius: "50%",
  border: "4px solid white",
  color: "white",
  fontWeight: "900",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  boxShadow: "0 10px 24px rgba(124,58,237,0.24)",
};

const iconeFase = {
  fontSize: "22px",
  fontWeight: "900",
};

const checkFase = {
  position: "absolute",
  top: "-7px",
  right: "-4px",
  width: "20px",
  height: "20px",
  borderRadius: "50%",
  background: "#22c55e",
  color: "white",
  border: "2px solid white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "11px",
  fontWeight: "900",
  zIndex: 20,
};

const nomeFaseBox = {
  position: "absolute",
  top: "calc(100% + 5px)",
  left: "50%",
  transform: "translateX(-50%)",
  textAlign: "center",
  minWidth: "84px",
};

const nomeFase = {
  display: "block",
  color: "#334155",
  fontSize: "10px",
  fontWeight: "900",
  lineHeight: "1.05",
  whiteSpace: "nowrap",
};

const subtituloFase = {
  display: "block",
  color: "#7c3aed",
  fontSize: "8px",
  fontWeight: "900",
  lineHeight: "1.05",
  whiteSpace: "nowrap",
};

const rodape = {
  padding: "8px 12px 12px",
  borderTop: "1px solid #e2e8f0",
  background: "rgba(255,255,255,0.96)",
  flexShrink: 0,
};

const textoFooter = {
  margin: "0 0 8px",
  color: "#64748b",
  fontSize: "11px",
  fontWeight: "700",
  textAlign: "center",
};

const botaoTutorial = {
  width: "100%",
  height: "36px",
  border: "none",
  borderRadius: "999px",
  background: "linear-gradient(135deg, #7c3aed, #ec4899)",
  color: "white",
  fontSize: "13px",
  fontWeight: "900",
  cursor: "pointer",
  boxShadow: "0 8px 18px rgba(124,58,237,0.22)",
};

const modalFundo = {
  position: "absolute",
  inset: 0,
  background: "rgba(15,23,42,0.5)",
  backdropFilter: "blur(5px)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 100,
  borderRadius: "24px",
};

const modal = {
  width: "min(88%, 340px)",
  padding: "22px",
  background: "white",
  borderRadius: "22px",
  textAlign: "center",
  color: "#475569",
  boxShadow: "0 25px 50px rgba(0,0,0,0.22)",
};

const tituloModal = {
  color: "#7c3aed",
  fontSize: "24px",
  fontWeight: "900",
  margin: "0 0 12px",
};

const textoAjuda = {
  fontSize: "14px",
  color: "#64748b",
  lineHeight: "1.7",
  textAlign: "center",
  fontWeight: "700",
};

const botaoFechar = {
  marginTop: "16px",
  height: "42px",
  background: "#7c3aed",
  border: "none",
  borderRadius: "14px",
  color: "white",
  fontWeight: "900",
  cursor: "pointer",
  width: "100%",
};

const modalFinal = {
  width: "min(88%, 340px)",
  background: "white",
  borderRadius: "24px",
  padding: "26px",
  textAlign: "center",
  boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
};

const iconeFinal = {
  fontSize: "48px",
  marginBottom: "8px",
};

const tituloFinal = {
  fontSize: "26px",
  color: "#1e293b",
  margin: "0 0 10px",
  fontWeight: "900",
};

const textoFinal = {
  color: "#64748b",
  fontSize: "14px",
  lineHeight: "1.6",
  fontWeight: "700",
};

const botaoFinal = {
  width: "100%",
  height: "42px",
  background: "#7c3aed",
  border: "none",
  borderRadius: "14px",
  color: "white",
  fontWeight: "900",
  cursor: "pointer",
  marginTop: "16px",
};

export default MapaFases;
