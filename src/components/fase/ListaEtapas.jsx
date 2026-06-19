function ListaEtapas({ etapas, etapaAtual }) {
  return (
    <div style={estilos.listaEtapas}>
      {etapas.map((nome, index) => {
        const ativa = etapaAtual === index + 1;

        return (
          <div
            key={nome}
            style={ativa ? estilos.etapaListaAtiva : estilos.etapaListaItem}
          >
            {index + 1}. {nome}
          </div>
        );
      })}
    </div>
  );
}

const estilos = {
  listaEtapas: {
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    padding: "5px",
    marginBottom: "6px",
    background: "white",
  },

  etapaListaItem: {
    padding: "5px 8px",
    fontSize: "11px",
    color: "#64748b",
    fontWeight: "700",
  },

  etapaListaAtiva: {
    padding: "5px 8px",
    fontSize: "11px",
    color: "#7c3aed",
    fontWeight: "900",
    background: "#ede9fe",
    borderRadius: "10px",
  },
};

export default ListaEtapas;