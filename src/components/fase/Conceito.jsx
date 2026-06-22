function Conceito({ texto, conceito }) {
  return (
    <section style={estilos.conceito} className="tour-conceito">
      <span style={estilos.iconeInfo}> i </span>

      <div>
        <p style={estilos.texto}>{texto}</p>
        <strong>{conceito}</strong>
      </div>
    </section>
  );
}

const estilos = {
  conceito: {
    marginTop: "10px",
    background: "#f8fafc",
    borderRadius: "18px",
    padding: "10px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    color: "#475569",
    fontSize: "12px",
    fontWeight: "700",
  },

  iconeInfo: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    background: "#ede9fe",
    color: "#7c3aed",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
    fontSize: "18px",
    flexShrink: 0,
  },

  texto: {
    margin: "0 0 3px",
  },
};

export default Conceito;