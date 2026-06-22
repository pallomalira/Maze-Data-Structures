import { useState } from "react";
import { motion } from "framer-motion";

function embaralhar(lista) {
  return [...lista].sort(() => Math.random() - 0.5);
}

function TelaFinal({ voltar }) {
  const fragmentosBase = [
    { id: "fila", nome: "Fila", icone: "🏪", conceito: "FIFO" },
    { id: "pilha", nome: "Pilha", icone: "🎒", conceito: "LIFO" },
    { id: "lista", nome: "Lista", icone: "🚪", conceito: "Próximo nó" },
    { id: "arvore", nome: "Árvore", icone: "🏥", conceito: "Busca eficiente" },
    { id: "grafo", nome: "Grafo", icone: "🕸️", conceito: "Conexões" },
  ];

  const portaisBase = [
    { id: "fila", texto: "Atendimento em ordem de chegada." },
    { id: "pilha", texto: "O último item guardado é o primeiro a sair." },
    { id: "lista", texto: "Cada elemento aponta para o próximo." },
    { id: "arvore", texto: "Organiza informações para buscar mais rápido." },
    { id: "grafo", texto: "Representa conexões e caminhos entre elementos." },
  ];

  const [fragmentos, setFragmentos] = useState(() => embaralhar(fragmentosBase));
  const [portais, setPortais] = useState(() => embaralhar(portaisBase));
  const [encaixados, setEncaixados] = useState({});
  const [selecionado, setSelecionado] = useState(null);
  const [mensagem, setMensagem] = useState(
    "Você chegou ao Portal do Conhecimento. Reúna os fragmentos aprendidos durante a jornada."
  );

  const completo = Object.keys(encaixados).length === portaisBase.length;

  function selecionarFragmento(fragmento) {
    setSelecionado(fragmento);
    setMensagem(
      `Fragmento ${fragmento.nome} selecionado. Agora escolha o portal correto.`
    );
  }

  function encaixarNoPortal(portalId) {
    if (!selecionado) {
      setMensagem("Primeiro selecione um fragmento.");
      return;
    }

    if (selecionado.id !== portalId) {
      setMensagem(
        `Não encaixou. ${selecionado.nome} pertence a outro conceito. Leia a pista com calma.`
      );
      return;
    }

    setEncaixados({
      ...encaixados,
      [portalId]: selecionado,
    });

    setFragmentos(fragmentos.filter((item) => item.id !== selecionado.id));
    setMensagem(
      `Fragmento de ${selecionado.nome} encaixado! Conceito: ${selecionado.conceito}`
    );
    setSelecionado(null);
  }

  function resetar() {
    setFragmentos(embaralhar(fragmentosBase));
    setPortais(embaralhar(portaisBase));
    setEncaixados({});
    setSelecionado(null);
    setMensagem(
      "Os fragmentos foram embaralhados novamente. Selecione um fragmento e encontre o portal correto."
    );
  }

  return (
    <div style={estilos.pagina}>
      <div style={estilos.card}>
        <header style={estilos.topo}>
          <button onClick={voltar} style={estilos.botaoVoltar}>
            <span style={estilos.setaVoltar}>←</span>
            <span>Mapa</span>
          </button>

          <h1 style={estilos.tituloTopo}>Portal do Conhecimento</h1>

          <div style={estilos.espacoTopo} />
        </header>

        {!completo ? (
          <>
            <section style={estilos.hero}>
              <div style={estilos.iconeHero}>💎</div>
              <p style={estilos.mensagem}>{mensagem}</p>
            </section>

            <section style={estilos.areaFragmentos}>
              <h2 style={estilos.subtitulo}>Fragmentos da jornada</h2>

              <div style={estilos.fragmentos}>
                {fragmentos.map((fragmento) => (
                  <motion.button
                    key={fragmento.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => selecionarFragmento(fragmento)}
                    style={{
                      ...estilos.fragmento,
                      border:
                        selecionado?.id === fragmento.id
                          ? "2px solid #ec4899"
                          : "2px solid #e2e8f0",
                    }}
                  >
                    <span style={estilos.iconeFragmento}>
                      {fragmento.icone}
                    </span>
                    <strong>{fragmento.nome}</strong>
                  </motion.button>
                ))}
              </div>
            </section>

            <section style={estilos.portais}>
              {portais.map((portal, index) => {
                const item = encaixados[portal.id];

                return (
                  <motion.button
                    key={portal.id}
                    whileTap={{ scale: item ? 1 : 0.97 }}
                    onClick={() => encaixarNoPortal(portal.id)}
                    style={{
                      ...estilos.portal,
                      border: item
                        ? "2px solid #22c55e"
                        : "2px dashed #cbd5e1",
                    }}
                  >
                    <span style={estilos.numeroPortal}>
                      Portal {index + 1}
                    </span>

                    {item ? (
                      <>
                        <span style={estilos.iconePortal}>{item.icone}</span>
                        <strong style={estilos.nomePortal}>{item.nome}</strong>
                        <span style={estilos.check}>✓</span>
                      </>
                    ) : (
                      <p style={estilos.textoPortal}>{portal.texto}</p>
                    )}
                  </motion.button>
                );
              })}
            </section>

            <button onClick={resetar} style={estilos.botaoResetar}>
              ↻ Embaralhar novamente
            </button>
          </>
        ) : (
          <motion.section
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={estilos.finalBox}
          >
            <div style={estilos.emojiFinal}>🎁✨</div>

            <h1 style={estilos.tituloFinal}>Parabéns!</h1>

            <p style={estilos.textoFinal}>
              Os viajantes concluíram a jornada e restauraram o Portal do
              Conhecimento. Durante o caminho, aprenderam como funcionam as
              principais estruturas de dados.
            </p>

            <div style={estilos.resumo}>
              <p>🏪 Fila → atendimento em ordem de chegada (FIFO).</p>
              <p>🎒 Pilha → último que entra, primeiro que sai (LIFO).</p>
              <p>🚪 Lista → cada nó aponta para o próximo.</p>
              <p>🏥 Árvore → organiza informações para buscas rápidas.</p>
              <p>🕸️ Grafo → representa conexões e caminhos entre elementos.</p>
            </div>

            <p style={estilos.tituloConquista}>
              🏆 Mestre das Estruturas de Dados
            </p>

            <button onClick={voltar} style={estilos.botaoPrincipal}>
              Voltar ao mapa
            </button>
          </motion.section>
        )}
      </div>
    </div>
  );
}

const estilos = {
  pagina: {
    width: "100vw",
    minHeight: "100svh",
    background: "#f8fafc",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "8px",
    boxSizing: "border-box",
    fontFamily: "'Inter', sans-serif",
    overflow: "hidden",
  },

  card: {
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
  },

  topo: {
    height: "54px",
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr",
    alignItems: "center",
    borderBottom: "1px solid #e2e8f0",
    padding: "0 14px",
    boxSizing: "border-box",
    flexShrink: 0,
  },

  botaoVoltar: {
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
  },

  setaVoltar: {
    fontSize: "25px",
    lineHeight: 1,
    fontWeight: "400",
  },

  tituloTopo: {
    margin: 0,
    color: "#1e293b",
    fontSize: "17px",
    fontWeight: "900",
    whiteSpace: "nowrap",
  },

  espacoTopo: {
    width: "50px",
  },

  hero: {
    padding: "12px",
    textAlign: "center",
    flexShrink: 0,
  },

  iconeHero: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    margin: "0 auto 8px",
    background: "linear-gradient(135deg, #7c3aed, #ec4899)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    boxShadow: "0 8px 18px rgba(124,58,237,0.22)",
  },

  mensagem: {
    margin: 0,
    background: "#f8fafc",
    borderRadius: "14px",
    padding: "9px",
    color: "#64748b",
    fontSize: "11px",
    fontWeight: "800",
    lineHeight: "1.4",
  },

  areaFragmentos: {
    padding: "0 12px",
    flexShrink: 0,
  },

  subtitulo: {
    margin: "0 0 6px",
    color: "#1e293b",
    fontSize: "14px",
    fontWeight: "900",
    textAlign: "center",
  },

  fragmentos: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "6px",
  },

  fragmento: {
    height: "58px",
    borderRadius: "14px",
    background: "#f8fafc",
    color: "#475569",
    fontSize: "9px",
    fontWeight: "900",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    padding: "4px",
  },

  iconeFragmento: {
    fontSize: "19px",
  },

  portais: {
    flex: 1,
    minHeight: 0,
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "8px",
    padding: "12px",
    boxSizing: "border-box",
    overflow: "hidden",
  },

  portal: {
    minHeight: "82px",
    background: "white",
    borderRadius: "16px",
    padding: "10px",
    color: "#475569",
    fontWeight: "800",
    textAlign: "center",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    lineHeight: "1.35",
    cursor: "pointer",
  },

  numeroPortal: {
    position: "absolute",
    top: "7px",
    left: "9px",
    fontSize: "9px",
    color: "#7c3aed",
    fontWeight: "900",
  },

  textoPortal: {
    fontSize: "10px",
    margin: "8px 0 0",
  },

  iconePortal: {
    fontSize: "24px",
  },

  nomePortal: {
    fontSize: "12px",
    color: "#334155",
  },

  check: {
    position: "absolute",
    top: "-7px",
    right: "-7px",
    background: "#22c55e",
    color: "white",
    borderRadius: "50%",
    width: "22px",
    height: "22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
    border: "2px solid white",
  },

  botaoResetar: {
    margin: "0 12px 12px",
    height: "36px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "999px",
    color: "#7c3aed",
    fontWeight: "900",
    cursor: "pointer",
    flexShrink: 0,
  },

  finalBox: {
    margin: "12px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "22px",
    padding: "18px",
    textAlign: "center",
    color: "#475569",
  },

  emojiFinal: {
    fontSize: "54px",
    marginBottom: "14px",
    lineHeight: 1,
  },

  tituloFinal: {
    margin: "0 0 12px",
    fontSize: "30px",
    fontWeight: "900",
    color: "#1e293b",
  },

  textoFinal: {
    fontSize: "13px",
    fontWeight: "800",
    lineHeight: "1.5",
  },

  resumo: {
    background: "white",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "12px",
    textAlign: "left",
    fontSize: "11px",
    fontWeight: "700",
    lineHeight: "1.5",
    marginTop: "12px",
  },

  tituloConquista: {
    marginTop: "12px",
    color: "#7c3aed",
    fontWeight: "900",
    fontSize: "14px",
  },

  botaoPrincipal: {
    width: "100%",
    height: "38px",
    background: "linear-gradient(135deg, #7c3aed, #ec4899)",
    border: "none",
    borderRadius: "999px",
    color: "white",
    fontWeight: "900",
    fontSize: "13px",
    cursor: "pointer",
    marginTop: "14px",
  },
};

export default TelaFinal;