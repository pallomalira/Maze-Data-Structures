function Mensagem({ texto }) {
  return (
    <div style={estilos.caixa}>
      <p style={estilos.texto}>{texto}</p>
    </div>
  );
}

const estilos = {
  caixa: {
    background: "#f1f5f9",
    borderRadius: "16px",
    padding: "12px",
    marginBottom: "12px",
    textAlign: "center",
  },

  texto: {
    margin: 0,
    color: "#64748b",
    fontSize: "13px",
    fontWeight: "700",
    lineHeight: "1.5",
  },
};

export default Mensagem;