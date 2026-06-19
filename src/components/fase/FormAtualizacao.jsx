function FormAtualizacao({
  valor,
  setValor,
  confirmar,
  placeholder = "Novo nome",
}) {
  return (
    <div style={estilos.formAtualizacao} className="tour-atualizar">
      <input
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        placeholder={placeholder}
        style={estilos.input}
      />

      <button onClick={confirmar} style={estilos.botaoAtualizar}>
        Atualizar
      </button>
    </div>
  );
}

const estilos = {
  formAtualizacao: {
    display: "flex",
    gap: "8px",
    marginBottom: "10px",
  },

  input: {
    flex: 1,
    height: "38px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    padding: "0 10px",
    fontSize: "13px",
    minWidth: 0,
  },

  botaoAtualizar: {
    border: "none",
    borderRadius: "12px",
    background: "#7c3aed",
    color: "white",
    fontWeight: "900",
    padding: "0 12px",
    cursor: "pointer",
  },
};

export default FormAtualizacao;