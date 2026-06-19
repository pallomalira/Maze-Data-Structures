function ModalFase({ titulo, children, fechar, textoBotao = "Entendi" }) {
  return (
    <div style={estilos.fundoModal}>
      <div style={estilos.modal}>
        <h2 style={estilos.tituloModal}>{titulo}</h2>

        <div style={estilos.modalTexto}>{children}</div>

        <button onClick={fechar} style={estilos.botaoFechar}>
          {textoBotao}
        </button>
      </div>
    </div>
  );
}

const estilos = {
  fundoModal: {
    position: "fixed",
    inset: 0,
    background: "rgba(15,23,42,0.45)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 50,
  },

  modal: {
    width: "86%",
    maxWidth: "340px",
    background: "white",
    borderRadius: "22px",
    padding: "22px",
    textAlign: "center",
    color: "#475569",
    boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
  },

  tituloModal: {
    color: "#7c3aed",
    fontSize: "24px",
    fontWeight: "900",
    marginBottom: "12px",
  },

  modalTexto: {
    fontSize: "14px",
    lineHeight: "1.6",
  },

  botaoFechar: {
    width: "100%",
    height: "42px",
    border: "none",
    borderRadius: "14px",
    background: "#7c3aed",
    color: "white",
    fontWeight: "900",
    marginTop: "14px",
    cursor: "pointer",
  },
};

export default ModalFase;