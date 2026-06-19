function BotoesRodape({ resetar, iniciarTutorial }) {
  return (
    <div style={estilos.rodape} className="tour-resetar">
      <button onClick={resetar} style={estilos.botaoResetar}>
        ↻ Resetar
      </button>

      <button onClick={iniciarTutorial} style={estilos.botaoTutorial}>
        Ver tutorial
      </button>
    </div>
  );
}

const estilos = {
  rodape: {
    marginTop: "10px",
    paddingTop: "8px",
    borderTop: "1px solid #e2e8f0",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px",
  },

  botaoResetar: {
    width: "100%",
    height: "40px",
    border: "1px solid #e2e8f0",
    borderRadius: "999px",
    background: "white",
    color: "#7c3aed",
    fontSize: "14px",
    fontWeight: "900",
    cursor: "pointer",
  },

  botaoTutorial: {
    width: "100%",
    height: "40px",
    border: "none",
    borderRadius: "999px",
    background: "linear-gradient(135deg, #7c3aed, #ec4899)",
    color: "white",
    fontSize: "14px",
    fontWeight: "900",
    cursor: "pointer",
  },
};

export default BotoesRodape;