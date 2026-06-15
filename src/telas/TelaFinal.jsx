import { useState } from "react";
import { motion } from "framer-motion";

function embaralhar(lista) {
  return [...lista].sort(() => Math.random() - 0.5);
}

function TelaFinal({ voltar }) {
  const fragmentosBase = [
    { id: "fila", nome: "Fila", icone: "🚶", conceito: "FIFO" },
    { id: "pilha", nome: "Pilha", icone: "📚", conceito: "LIFO" },
    { id: "arvore", nome: "Árvore", icone: "🌳", conceito: "Esquerda / Direita" },
    { id: "lista", nome: "Lista", icone: "🔗", conceito: "Próximo nó" },
    { id: "grafo", nome: "Grafo", icone: "🕸️", conceito: "Conexões" },
    { id: "hash", nome: "Hash", icone: "🔐", conceito: "Código → Gaveta" },
    { id: "heap", nome: "Heap", icone: "🏔️", conceito: "Maior no topo" },
  ];

  const portaisBase = [
    { id: "fila", texto: "Quem chega primeiro também sai primeiro." },
    { id: "pilha", texto: "O último que entra é o primeiro que sai." },
    { id: "arvore", texto: "A busca segue caminhos pela esquerda ou direita." },
    { id: "lista", texto: "Cada elemento aponta para o próximo." },
    { id: "grafo", texto: "Pontos ligados por conexões e caminhos." },
    { id: "hash", texto: "Um código calcula onde o valor será guardado." },
    { id: "heap", texto: "O maior valor ou prioridade fica no topo." },
  ];

  const [fragmentos, setFragmentos] = useState(() => embaralhar(fragmentosBase));
  const [portais, setPortais] = useState(() => embaralhar(portaisBase));
  const [encaixados, setEncaixados] = useState({});
  const [dragged, setDragged] = useState(null);
  const [mensagem, setMensagem] = useState(
    "🌌 Núcleo Final\n\nOs fragmentos e os portais estão embaralhados.\n\nLeia cada portal e arraste o fragmento que combina com a descrição."
  );

  const completo = Object.keys(encaixados).length === portaisBase.length;

  function soltarNoPortal(portalId) {
    if (!dragged) return;

    if (dragged.id !== portalId) {
      setMensagem(
        `❌ Não encaixou.\n\nVocê tentou colocar ${dragged.nome}, mas essa descrição pertence a outra estrutura.\n\nLeia a frase com calma e procure a lógica correta.`
      );
      setDragged(null);
      return;
    }

    setEncaixados({
      ...encaixados,
      [portalId]: dragged,
    });

    setFragmentos(fragmentos.filter((item) => item.id !== dragged.id));
    setDragged(null);

    setMensagem(
      `✅ Fragmento de ${dragged.nome} encaixado!\n\nConceito: ${dragged.conceito}`
    );
  }

  function resetar() {
    setFragmentos(embaralhar(fragmentosBase));
    setPortais(embaralhar(portaisBase));
    setEncaixados({});
    setDragged(null);
    setMensagem(
      "🌌 Núcleo Final\n\nOs fragmentos e os portais foram embaralhados novamente.\n\nLeia cada portal e encontre a estrutura correta."
    );
  }

  return (
    <div style={estilos.pagina}>
      <div style={estilos.container}>
        <button onClick={voltar} style={estilos.botaoVoltar}>
          ← VOLTAR AO MAPA
        </button>

        <div style={estilos.header}>
          <div style={estilos.icone}>💎</div>
          <h1 style={estilos.titulo}>NÚCLEO FINAL</h1>
          <p style={estilos.regra}>
            Encaixe cada fragmento no portal correto.
          </p>
        </div>

        <div style={estilos.mensagem}>{mensagem}</div>

        {!completo && (
          <>
            <div style={estilos.areaFragmentos}>
              <h2 style={estilos.subtitulo}>Fragmentos embaralhados</h2>

              <div style={estilos.fragmentos}>
                {fragmentos.map((fragmento) => (
                  <motion.div
                    key={fragmento.id}
                    draggable
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onDragStart={() => setDragged(fragmento)}
                    style={estilos.fragmento}
                  >
                    <span style={estilos.iconeFragmento}>{fragmento.icone}</span>
                    <strong>{fragmento.nome}</strong>
                  </motion.div>
                ))}
              </div>
            </div>

            <div style={estilos.portais}>
              {portais.map((portal, index) => {
                const item = encaixados[portal.id];

                return (
                  <div
                    key={portal.id}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => soltarNoPortal(portal.id)}
                    style={{
                      ...estilos.portal,
                      border: item
                        ? "3px solid #22c55e"
                        : "3px dashed #9333ea",
                    }}
                  >
                    <span style={estilos.numeroPortal}>Portal {index + 1}</span>

                    {item ? (
                      <>
                        <span style={estilos.iconePortal}>{item.icone}</span>
                        <strong>{item.nome}</strong>
                        <p>{portal.texto}</p>
                        <span style={estilos.check}>✓</span>
                      </>
                    ) : (
                      <>
                        <strong>Leia a pista:</strong>
                        <p>{portal.texto}</p>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            <button onClick={resetar} style={estilos.botaoResetar}>
              ↻ EMBARALHAR NOVAMENTE
            </button>
          </>
        )}

        {completo && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={estilos.finalBox}
          >
            <div style={estilos.caixaAberta}>🎁✨</div>

            <h1 style={estilos.titulo}>PARABÉNS!</h1>

            <p style={estilos.textoFinal}>
              Você juntou todos os fragmentos e restaurou o Núcleo do Conhecimento.
            </p>

            <div style={estilos.resumo}>
              <p>🚶 Fila: primeiro que entra, primeiro que sai.</p>
              <p>📚 Pilha: último que entra, primeiro que sai.</p>
              <p>🌳 Árvore: busca por esquerda e direita.</p>
              <p>🔗 Lista: cada nó aponta para o próximo.</p>
              <p>🕸️ Grafo: pontos conectados por caminhos.</p>
              <p>🔐 Hash: código calcula a gaveta.</p>
              <p>🏔️ Heap: maior prioridade fica no topo.</p>
            </div>

            <button onClick={voltar} style={estilos.botaoPrincipal}>
              VOLTAR AO MAPA
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

const estilos = {
  pagina: {
    minHeight: "100vh",
    background: "#f3efff",
    padding: "20px",
    boxSizing: "border-box",
    fontFamily: "'Inter', sans-serif",
  },

  container: {
    width: "100%",
    maxWidth: "1100px",
    margin: "0 auto",
    background: "rgba(255,255,255,0.76)",
    borderRadius: "28px",
    padding: "clamp(20px, 4vw, 42px)",
    boxSizing: "border-box",
  },

  botaoVoltar: {
    background: "#9333ea",
    border: "none",
    borderRadius: "18px",
    color: "white",
    fontWeight: "900",
    padding: "12px 18px",
    cursor: "pointer",
    fontSize: "14px",
  },

  header: {
    textAlign: "center",
    marginBottom: "24px",
  },

  icone: {
    fontSize: "54px",
  },

  titulo: {
    fontSize: "clamp(38px, 6vw, 62px)",
    fontWeight: "900",
    color: "#1e293b",
    margin: "8px 0",
  },

  regra: {
    color: "#9333ea",
    fontWeight: "900",
    fontSize: "18px",
  },

  mensagem: {
    background: "white",
    border: "2px solid #e2e8f0",
    borderRadius: "18px",
    padding: "16px",
    color: "#475569",
    whiteSpace: "pre-wrap",
    fontWeight: "700",
    lineHeight: "1.7",
    marginBottom: "22px",
    textAlign: "center",
  },

  areaFragmentos: {
    background: "#f8fafc",
    border: "2px solid #e2e8f0",
    borderRadius: "22px",
    padding: "22px",
    marginBottom: "22px",
  },

  subtitulo: {
    textAlign: "center",
    color: "#475569",
    fontWeight: "900",
    marginTop: 0,
  },

  fragmentos: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "14px",
  },

  fragmento: {
    width: "120px",
    minHeight: "100px",
    background: "#9333ea",
    color: "white",
    borderRadius: "18px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    cursor: "grab",
    textAlign: "center",
    padding: "12px",
    boxSizing: "border-box",
  },

  iconeFragmento: {
    fontSize: "32px",
    marginBottom: "6px",
  },

  portais: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
    gap: "16px",
  },

  portal: {
    minHeight: "165px",
    background: "white",
    borderRadius: "20px",
    padding: "18px",
    color: "#475569",
    fontWeight: "800",
    textAlign: "center",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    lineHeight: "1.5",
  },

  numeroPortal: {
    position: "absolute",
    top: "10px",
    left: "12px",
    fontSize: "11px",
    color: "#9333ea",
    fontWeight: "900",
  },

  iconePortal: {
    fontSize: "34px",
    marginBottom: "6px",
  },

  check: {
    position: "absolute",
    top: "-10px",
    right: "-10px",
    background: "#22c55e",
    color: "white",
    borderRadius: "50%",
    width: "28px",
    height: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
  },

  finalBox: {
    background: "white",
    border: "3px solid #ec4899",
    borderRadius: "26px",
    padding: "32px",
    textAlign: "center",
    color: "#475569",
  },

  caixaAberta: {
    fontSize: "74px",
  },

  textoFinal: {
    fontSize: "18px",
    fontWeight: "800",
    lineHeight: "1.7",
  },

  resumo: {
    background: "#f8fafc",
    border: "2px solid #e2e8f0",
    borderRadius: "18px",
    padding: "18px",
    textAlign: "left",
    lineHeight: "1.8",
    marginTop: "20px",
  },

  botaoPrincipal: {
    width: "100%",
    padding: "16px",
    background: "#9333ea",
    border: "none",
    borderRadius: "18px",
    color: "white",
    fontWeight: "900",
    fontSize: "15px",
    cursor: "pointer",
    marginTop: "20px",
  },

  botaoResetar: {
    width: "100%",
    padding: "13px",
    background: "#f43f5e",
    border: "none",
    borderRadius: "16px",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "22px",
  },
};

export default TelaFinal;