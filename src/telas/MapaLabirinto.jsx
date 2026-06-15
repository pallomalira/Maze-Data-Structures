import { useEffect, useState } from "react";

function MapaLabirinto({ abrirFila, abrirPilha, abrirArvore, voltar }) {
  const mapa = [
    [1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 2, 0, 1],
    [1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 1],
    [1, 3, 1, 1, 1, 4, 1],
    [1, 1, 1, 1, 1, 1, 1]
  ];

  const [player, setPlayer] = useState({ x: 1, y: 1 });
  const [mensagem, setMensagem] = useState("Use as setas para andar.");
  const [portaAtual, setPortaAtual] = useState(null);

  function tentarMover(dx, dy) {
    const novoX = player.x + dx;
    const novoY = player.y + dy;

    const destino = mapa[novoY][novoX];

    if (destino === 1) {
      setMensagem("🚧 Parede! Escolha outro caminho.");
      return;
    }

    setPlayer({ x: novoX, y: novoY });

    if (destino === 2) {
      setPortaAtual("fila");
      setMensagem("🚪 Porta da Fila encontrada. Pressione ENTER para entrar.");
      return;
    }

    if (destino === 3) {
      setPortaAtual("pilha");
      setMensagem("🚪 Porta da Pilha encontrada. Pressione ENTER para entrar.");
      return;
    }

    if (destino === 4) {
      setPortaAtual("arvore");
      setMensagem("🚪 Porta da Árvore encontrada. Pressione ENTER para entrar.");
      return;
    }

    setPortaAtual(null);
    setMensagem("Use as setas para andar.");
  }

  function entrarNaPorta() {
    if (portaAtual === "fila") abrirFila();
    if (portaAtual === "pilha") abrirPilha();
    if (portaAtual === "arvore") abrirArvore();
  }

  useEffect(() => {
    function controlar(e) {
      if (e.key === "ArrowUp") tentarMover(0, -1);
      if (e.key === "ArrowDown") tentarMover(0, 1);
      if (e.key === "ArrowLeft") tentarMover(-1, 0);
      if (e.key === "ArrowRight") tentarMover(1, 0);
      if (e.key === "Enter") entrarNaPorta();
    }

    window.addEventListener("keydown", controlar);

    return () => {
      window.removeEventListener("keydown", controlar);
    };
  });

  function desenharCelula(valor, x, y) {
    const temJogador = player.x === x && player.y === y;

    if (temJogador) return "🧙";
    if (valor === 1) return "";
    if (valor === 2) return "🚪";
    if (valor === 3) return "🚪";
    if (valor === 4) return "🚪";

    return "";
  }

  function estiloCelula(valor, x, y) {
    const temJogador = player.x === x && player.y === y;

    if (temJogador) {
      return {
        ...celulaBase,
        background: "#facc15",
        color: "#0f172a",
        boxShadow: "0 0 14px #facc15"
      };
    }

    if (valor === 1) {
      return {
        ...celulaBase,
        background: "linear-gradient(145deg, #475569, #1e293b)",
        border: "1px solid #64748b"
      };
    }

    if (valor === 2 || valor === 3 || valor === 4) {
      return {
        ...celulaBase,
        background: "rgba(250,204,21,0.18)",
        border: "2px solid #facc15",
        boxShadow: "0 0 10px rgba(250,204,21,0.8)"
      };
    }

    return {
      ...celulaBase,
      background: "rgba(226,232,240,0.18)",
      border: "1px solid rgba(226,232,240,0.25)"
    };
  }

  return (
    <div style={pagina}>
      <div style={card}>
        <div style={fundoPontilhado}></div>

        <div style={{ position: "relative", zIndex: 2 }}>
          <p style={versao}>v1.0</p>

          <button onClick={voltar} style={botaoTopo}>
            ← HOME
          </button>

          <div style={{ fontSize: "52px", marginTop: "35px" }}>🧩</div>

          <h1 style={titulo}>LABIRINTO</h1>
          <h2 style={subtitulo}>DAS ESTRUTURAS</h2>

          <div style={mensagemBox}>{mensagem}</div>

          <div style={mapaBox}>
            {mapa.map((linha, y) => (
              <div key={y} style={{ display: "flex" }}>
                {linha.map((celula, x) => (
                  <div key={x} style={estiloCelula(celula, x, y)}>
                    {desenharCelula(celula, x, y)}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div style={legenda}>
            <span>🧙 Jogador</span>
            <span>🚪 Porta</span>
            <span>⬛ Parede</span>
          </div>

          {portaAtual && (
            <button onClick={entrarNaPorta} style={botaoEntrar}>
              ENTRAR NA FASE
            </button>
          )}

          <p style={instrucao}>Use ↑ ↓ ← → para andar. ENTER para entrar.</p>
        </div>
      </div>
    </div>
  );
}

const pagina = {
  minHeight: "100vh",
  background: "#071826",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "white",
  fontFamily: "Arial, sans-serif"
};

const card = {
  width: "430px",
  minHeight: "690px",
  background: "linear-gradient(180deg, #0f3a4a, #071826)",
  borderRadius: "28px",
  padding: "25px",
  textAlign: "center",
  border: "3px solid #38bdf8",
  boxShadow: "0 0 25px rgba(56,189,248,0.6)",
  position: "relative",
  overflow: "hidden"
};

const fundoPontilhado = {
  position: "absolute",
  inset: 0,
  backgroundImage:
    "radial-gradient(circle, rgba(255,255,255,0.08) 18%, transparent 19%)",
  backgroundSize: "48px 48px",
  opacity: 0.45
};

const versao = {
  textAlign: "right",
  color: "#facc15",
  fontSize: "12px",
  margin: 0
};

const botaoTopo = {
  position: "absolute",
  top: "15px",
  left: "0",
  padding: "8px 12px",
  borderRadius: "8px",
  border: "2px solid #38bdf8",
  background: "rgba(15,23,42,0.85)",
  color: "#38bdf8",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "12px"
};

const titulo = {
  fontSize: "32px",
  margin: "0",
  color: "#facc15",
  textShadow: "3px 3px 0 #0f172a"
};

const subtitulo = {
  fontSize: "22px",
  margin: 0,
  color: "#38bdf8",
  letterSpacing: "1px"
};

const mensagemBox = {
  background: "rgba(15,23,42,0.9)",
  border: "2px solid #38bdf8",
  borderRadius: "10px",
  padding: "10px",
  margin: "18px 0 15px",
  fontSize: "13px",
  color: "#dbeafe"
};

const mapaBox = {
  display: "inline-block",
  background: "rgba(15,23,42,0.85)",
  border: "2px solid #facc15",
  borderRadius: "14px",
  padding: "12px",
  boxShadow: "0 0 15px rgba(250,204,21,0.5)"
};

const celulaBase = {
  width: "45px",
  height: "45px",
  margin: "3px",
  borderRadius: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "24px",
  boxSizing: "border-box"
};

const legenda = {
  marginTop: "15px",
  display: "flex",
  justifyContent: "space-around",
  fontSize: "12px",
  color: "#dbeafe"
};

const botaoEntrar = {
  width: "100%",
  padding: "12px",
  marginTop: "18px",
  borderRadius: "8px",
  border: "2px solid #facc15",
  background: "rgba(15,23,42,0.85)",
  color: "#facc15",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "14px"
};

const instrucao = {
  marginTop: "15px",
  fontSize: "12px",
  color: "#94a3b8"
};

export default MapaLabirinto;