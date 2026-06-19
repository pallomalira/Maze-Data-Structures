function TopoFase({ titulo, voltar, abrirHistoria, abrirDica }) {
  return (
    <header style={estilos.topo}>
      <button onClick={voltar} style={estilos.botaoMapa}>
        <span style={estilos.setaVoltar}>←</span>
        <span>Mapa</span>
      </button>

      <h1 style={estilos.tituloTopo}>{titulo}</h1>

      <div style={estilos.iconesTopo}>
        <button onClick={abrirHistoria} style={estilos.botaoLivro}>
          📖
        </button>

        <button onClick={abrirDica} style={estilos.botaoLuz}>
          💡
        </button>
      </div>
    </header>
  );
}

const estilos = {
  topo: {
    height: "54px",
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr",
    alignItems: "center",
    borderBottom: "1px solid #e2e8f0",
    margin: "0 -10px 8px",
    padding: "0 14px",
    boxSizing: "border-box",
  },

  botaoMapa: {
    border: "none",
    background: "transparent",
    color: "#1e293b",
    fontSize: "18px",
    fontWeight: "800",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: 0,
    cursor: "pointer",
  },

  setaVoltar: {
    fontSize: "26px",
    lineHeight: 1,
    fontWeight: "400",
  },

  tituloTopo: {
    margin: 0,
    color: "#1e293b",
    fontSize: "18px",
    fontWeight: "900",
    textAlign: "center",
    whiteSpace: "nowrap",
  },

  iconesTopo: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "14px",
  },

  botaoLivro: {
    border: "none",
    background: "transparent",
    fontSize: "23px",
    cursor: "pointer",
    padding: 0,
  },

  botaoLuz: {
    border: "none",
    background: "transparent",
    fontSize: "23px",
    cursor: "pointer",
    padding: 0,
    filter: "drop-shadow(0 0 5px rgba(236,72,153,0.35))",
  },
};

export default TopoFase;