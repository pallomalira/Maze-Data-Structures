function Etapa({
  etapa,
  totalEtapas,
  nomeEtapa,
  mostrarEtapas,
  setMostrarEtapas,
}) {
  return (
    <section
      style={estilos.etapaCard}
      className="tour-etapa"
      onClick={() => setMostrarEtapas(!mostrarEtapas)}
    >
      <div>
        <span style={estilos.etapaNumero}>
          Etapa {etapa} de {totalEtapas}
        </span>

        <h2 style={estilos.etapaNome}>{nomeEtapa}</h2>
      </div>

      <span style={estilos.setaBaixo}>⌄</span>
    </section>
  );
}

const estilos = {
  etapaCard: {
    height: "48px",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "6px 12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "6px",
    boxShadow: "0 4px 10px rgba(15,23,42,0.04)",
    cursor: "pointer",
  },

  etapaNumero: {
    color: "#64748b",
    fontSize: "11px",
    fontWeight: "700",
  },

  etapaNome: {
    margin: "1px 0 0",
    color: "#1e293b",
    fontSize: "18px",
    fontWeight: "900",
  },

  setaBaixo: {
    fontSize: "22px",
    color: "#1e293b",
    fontWeight: "900",
  },
};

export default Etapa;