import { useState } from "react";
import { motion } from "framer-motion";

function LabirintoGrafo({ voltar, concluir }) {
  const locaisIniciais = [
    { nome: "Praça Central", icone: "🏰" },
    { nome: "Torre dos Magos", icone: "🧙" },
    { nome: "Floresta Antiga", icone: "🌲" },
    { nome: "Ponte Sombria", icone: "🌉" },
    { nome: "Templo Final", icone: "🏛️" },
  ];

  const conexoesIniciais = [
    ["Praça Central", "Torre dos Magos"],
    ["Praça Central", "Floresta Antiga"],
    ["Torre dos Magos", "Ponte Sombria"],
    ["Floresta Antiga", "Templo Final"],
    ["Ponte Sombria", "Templo Final"],
  ];

  const caminhoBusca = ["Praça Central", "Torre dos Magos", "Ponte Sombria"];

  const [etapa, setEtapa] = useState(0);
  const [vertices, setVertices] = useState([]);
  const [disponiveis, setDisponiveis] = useState(locaisIniciais);
  const [arestas, setArestas] = useState([]);
  const [dragged, setDragged] = useState(null);
  const [indiceBusca, setIndiceBusca] = useState(0);
  const [concluido, setConcluido] = useState(false);
  const [mostrarHistoria, setMostrarHistoria] = useState(true);

  const [mensagem, setMensagem] = useState(
    "Clique em COMEÇAR para iniciar o desafio do grafo."
  );

  function iniciarFase() {
    setEtapa(1);
    setMensagem(
      "📥 FORMAR GRAFO\n\nArraste os locais para montar a cidade.\n\nDepois que todos os locais forem colocados, os caminhos entre eles serão revelados."
    );
  }

  function criarConexoes(verticesAtuais) {
    const nomes = verticesAtuais.map((v) => v.nome);

    return conexoesIniciais.filter(
      ([origem, destino]) => nomes.includes(origem) && nomes.includes(destino)
    );
  }

  function adicionarVertice(index) {
    if (etapa !== 1) return;

    const local = disponiveis[index];
    const novosVertices = [...vertices, local];
    const novosDisponiveis = disponiveis.filter((_, i) => i !== index);

    setVertices(novosVertices);
    setDisponiveis(novosDisponiveis);
    setArestas(criarConexoes(novosVertices));
    setDragged(null);

    if (novosVertices.length === 5) {
      setEtapa(2);
      setIndiceBusca(0);
      setMensagem(
        "🔍 BUSCAR CAMINHO\n\nO Guardião precisa chegar até a Ponte Sombria.\n\nEm um grafo, você percorre os vértices usando as conexões.\n\nSiga o caminho correto:\n\nPraça Central → Torre dos Magos → Ponte Sombria\n\nClique no local marcado como VERIFICAR."
      );
    } else {
      setMensagem(
        "✅ Local adicionado ao grafo.\n\nContinue adicionando os outros pontos da cidade."
      );
    }
  }

  function buscarVertice(index) {
    if (etapa !== 2) return;

    const local = vertices[index];
    const esperado = caminhoBusca[indiceBusca];

    if (local.nome !== esperado) {
      setMensagem(
        `❌ Caminho errado.\n\nNo grafo, você precisa seguir as conexões corretas.\n\nAgora clique em: ${esperado}.`
      );
      return;
    }

    if (local.nome === "Ponte Sombria") {
      setEtapa(3);
      setMensagem(
        "✅ Ponte Sombria encontrada!\n\nVocê percorreu o grafo seguindo as conexões.\n\nAgora atualize esse local para Ponte Iluminada."
      );
      return;
    }

    setIndiceBusca(indiceBusca + 1);
    setMensagem(
      `🔍 Você passou por ${local.nome}.\n\nContinue seguindo a conexão até o próximo local marcado.`
    );
  }

  function atualizarVertice(index) {
    if (etapa !== 3) return;

    if (vertices[index].nome !== "Ponte Sombria") {
      setMensagem("❌ Não é esse local.\n\nClique na Ponte Sombria para atualizar.");
      return;
    }

    const novosVertices = vertices.map((v) =>
      v.nome === "Ponte Sombria"
        ? { ...v, nome: "Ponte Iluminada", icone: "🌁" }
        : v
    );

    const novasArestas = arestas.map(([origem, destino]) => [
      origem === "Ponte Sombria" ? "Ponte Iluminada" : origem,
      destino === "Ponte Sombria" ? "Ponte Iluminada" : destino,
    ]);

    setVertices(novosVertices);
    setArestas(novasArestas);
    setEtapa(4);
    setMensagem(
      "✏️ Local atualizado!\n\nA Ponte Sombria virou Ponte Iluminada.\n\nAgora remova esse local do grafo.\n\nArraste a Ponte Iluminada para a zona de remoção."
    );
  }

  function removerVertice(index) {
    if (etapa !== 4) return;

    const local = vertices[index];

    if (local.nome !== "Ponte Iluminada") {
      setMensagem(
        "❌ Esse local não deve ser removido agora.\n\nRemova a Ponte Iluminada."
      );
      setDragged(null);
      return;
    }

    const novosVertices = vertices.filter((_, i) => i !== index);
    const novasArestas = arestas.filter(
      ([origem, destino]) =>
        origem !== "Ponte Iluminada" && destino !== "Ponte Iluminada"
    );

    setVertices(novosVertices);
    setArestas(novasArestas);
    setEtapa(5);
    setDragged(null);

    setMensagem(
      "✅ Ponte Iluminada removida!\n\nQuando um vértice é removido, suas conexões também somem.\n\nAgora observe o grafo restante.\n\nQual local ainda está conectado ao Templo Final?"
    );
  }

  function responderDesafio(index) {
    if (etapa !== 5) return;

    if (vertices[index].nome === "Floresta Antiga") {
      setMensagem(
        "🏆 Perfeito!\n\nVocê entendeu o Grafo:\n\n🔵 Vértices são pontos.\n➖ Arestas são conexões.\n🔍 Buscar é percorrer caminhos.\n✏️ Atualizar altera um vértice.\n🗑️ Remover um vértice também remove suas conexões."
      );
      setConcluido(true);
    } else {
      setMensagem("❌ Ainda não.\n\nObserve qual local continua ligado ao Templo Final.");
    }
  }

  function clicarVertice(index) {
    if (etapa === 2) buscarVertice(index);
    if (etapa === 3) atualizarVertice(index);
    if (etapa === 5) responderDesafio(index);
  }

  function soltarParaAdicionar() {
    if (!dragged || dragged.tipo !== "disponivel") return;
    adicionarVertice(dragged.index);
  }

  function soltarParaRemover() {
    if (!dragged || dragged.tipo !== "grafo") return;
    removerVertice(dragged.index);
  }

  function resetar() {
    setEtapa(0);
    setVertices([]);
    setDisponiveis(locaisIniciais);
    setArestas([]);
    setDragged(null);
    setIndiceBusca(0);
    setConcluido(false);
    setMostrarHistoria(true);
    setMensagem("Clique em COMEÇAR para iniciar o desafio do grafo.");
  }

  const posicoes = {
    "Praça Central": { x: 120, y: 90 },
    "Torre dos Magos": { x: 300, y: 70 },
    "Floresta Antiga": { x: 160, y: 240 },
    "Ponte Sombria": { x: 420, y: 200 },
    "Ponte Iluminada": { x: 420, y: 200 },
    "Templo Final": { x: 300, y: 340 },
  };

  function renderGrafo(interativo = true) {
    return (
      <svg width="100%" height="430" viewBox="0 0 540 430">
        {arestas.map(([origem, destino], index) => {
          const p1 = posicoes[origem];
          const p2 = posicoes[destino];

          if (!p1 || !p2) return null;

          return (
            <line
              key={`${origem}-${destino}-${index}`}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke="#818cf8"
              strokeWidth="5"
              strokeLinecap="round"
            />
          );
        })}

        {vertices.map((local, index) => {
          const pos = posicoes[local.nome];
          if (!pos) return null;

          const esperado = caminhoBusca[indiceBusca];
          const verificar = etapa === 2 && local.nome === esperado;
          const visto =
            etapa === 2 &&
            caminhoBusca.slice(0, indiceBusca).includes(local.nome);
          const atualizar = etapa === 3 && local.nome === "Ponte Sombria";
          const atualizado = local.nome === "Ponte Iluminada";

          return (
            <foreignObject
              key={`${local.nome}-${index}`}
              x={pos.x - 62}
              y={pos.y - 48}
              width="124"
              height="105"
            >
              <div
                draggable={etapa === 4}
                onClick={() => interativo && clicarVertice(index)}
                onDragStart={() => setDragged({ tipo: "grafo", index })}
                style={{
                  ...estilos.vertice,
                  border:
                    verificar || atualizar || atualizado
                      ? "3px solid #ec4899"
                      : "3px solid #818cf8",
                  cursor:
                    etapa === 4
                      ? "grab"
                      : etapa === 2 || etapa === 3 || etapa === 5
                      ? "pointer"
                      : "default",
                }}
              >
                {verificar && <span style={estilos.busca}>VERIFICAR</span>}
                {visto && <span style={estilos.verificado}>VISTO</span>}
                {atualizar && <span style={estilos.busca}>ATUALIZAR</span>}
                {atualizado && <span style={estilos.atualizado}>ATUALIZADO</span>}

                <span style={estilos.avatarVertice}>{local.icone}</span>
                <span style={estilos.nomeItem}>{local.nome}</span>
              </div>
            </foreignObject>
          );
        })}
      </svg>
    );
  }

  if (concluido) {
    return (
      <div style={estilos.pagina}>
        <div style={estilos.cardConclusao}>
          <button onClick={voltar} style={estilos.botaoVoltar}>
            ← VOLTAR
          </button>

          <div style={estilos.icone}>🏆</div>
          <h1 style={estilos.titulo}>GRAFO CONCLUÍDO!</h1>

          <div style={estilos.resumoBox}>
            <p>🔵 Vértices: pontos do grafo.</p>
            <p>➖ Arestas: conexões entre vértices.</p>
            <p>🔍 Buscar: percorre caminhos conectados.</p>
            <p>✏️ Atualizar: altera um vértice encontrado.</p>
            <p>🗑️ Remover: remove vértice e suas conexões.</p>
          </div>

          <button onClick={concluir} style={estilos.botaoPrincipal}>
            ➜ PRÓXIMA FASE
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={estilos.pagina}>
      <div style={estilos.container}>
        <button onClick={voltar} style={estilos.botaoVoltar}>
          ← VOLTAR AO MAPA
        </button>

        <button
          onClick={() => setMostrarHistoria(true)}
          style={estilos.botaoHistoria}
        >
          📜 História
        </button>

        <div style={estilos.header}>
          <div style={estilos.icone}>🕸️</div>
          <h1 style={estilos.titulo}>CIDADE DAS CONEXÕES</h1>
          <p style={estilos.regra}>Grafo: vértices conectados por arestas.</p>
        </div>

        <div style={estilos.etapas}>
          {["História", "Formar grafo", "Buscar", "Atualizar", "Remover", "Desafio"].map(
            (nome, index) => (
              <div
                key={nome}
                style={{
                  ...estilos.etapaBox,
                  background: etapa === index ? "#ec4899" : "#e2e8f0",
                  color: etapa === index ? "white" : "#475569",
                }}
              >
                {index}. {nome}
              </div>
            )
          )}
        </div>

        <div style={estilos.mensagemEtapa}>{mensagem}</div>

        {etapa === 0 && (
          <div style={estilos.introBox}>
            <div style={estilos.caixaTema}>🌐 Cidade das Conexões</div>

            <p style={estilos.textoIntro}>
              Imagine um mapa de cidade. Cada lugar é um ponto. Cada caminho
              entre lugares é uma conexão.
            </p>

            <button onClick={iniciarFase} style={estilos.botaoPrincipal}>
              COMEÇAR
            </button>
          </div>
        )}

        {etapa === 1 && (
          <div style={estilos.conteudoDesafio}>
            <div style={estilos.coluna}>
              <h2 style={estilos.tituloCaixa}>Locais disponíveis</h2>

              <div style={estilos.disponiveisContainer}>
                {disponiveis.map((local, index) => (
                  <motion.div
                    key={local.nome}
                    draggable
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => adicionarVertice(index)}
                    onDragStart={() =>
                      setDragged({ tipo: "disponivel", index })
                    }
                    style={estilos.itemDraggable}
                  >
                    <span style={estilos.avatar}>{local.icone}</span>
                    <span>{local.nome}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div style={estilos.coluna}>
              <h2 style={estilos.tituloCaixa}>Mapa do grafo</h2>

              <div
                style={estilos.zonaDrop}
                onDragOver={(e) => e.preventDefault()}
                onDrop={soltarParaAdicionar}
              >
                {vertices.length === 0 ? (
                  <span style={estilos.vazio}>Solte os locais aqui</span>
                ) : (
                  renderGrafo(false)
                )}
              </div>
            </div>
          </div>
        )}

        {(etapa === 2 || etapa === 3 || etapa === 5) && (
          <div style={estilos.conteudoDesafio}>
            <div style={estilos.colunaGrande}>
              <h2 style={estilos.tituloCaixa}>Mapa do grafo</h2>
              <div style={estilos.grafoGrande}>{renderGrafo(true)}</div>
            </div>
          </div>
        )}

        {etapa === 4 && (
          <div style={estilos.conteudoDesafio}>
            <div style={estilos.coluna}>
              <h2 style={estilos.tituloCaixa}>Mapa do grafo</h2>
              <div style={estilos.grafoGrande}>{renderGrafo(true)}</div>
            </div>

            <div style={estilos.coluna}>
              <h2 style={estilos.tituloCaixa}>Zona de remoção</h2>

              <div
                style={estilos.zonaRemocao}
                onDragOver={(e) => e.preventDefault()}
                onDrop={soltarParaRemover}
              >
                🌀 Remova a Ponte Iluminada aqui
              </div>
            </div>
          </div>
        )}

        <div style={estilos.caixaConceito}>
          <h3>📚 Conceito do Grafo</h3>
          <p><strong>Vértices:</strong> pontos do grafo.</p>
          <p><strong>Arestas:</strong> conexões entre os pontos.</p>
          <p>🔍 Buscar: percorrer caminhos conectados.</p>
          <p>✏️ Atualizar: alterar um vértice encontrado.</p>
          <p>🗑️ Remover: remove o vértice e suas conexões.</p>
        </div>

        <button onClick={resetar} style={estilos.botaoResetar}>
          ↻ RESETAR FASE
        </button>

        {mostrarHistoria && (
          <div style={estilos.fundoModal}>
            <div style={estilos.modalHistoria}>
              <h2>📜 HISTÓRIA</h2>

              <p>Você chegou à Cidade das Conexões do Reino dos Dados.</p>

              <p>
                Aqui, os lugares são ligados por caminhos. Um lugar pode estar
                conectado a vários outros.
              </p>

              <p>Aqui vale a lógica do Grafo:</p>

              <strong>Vértices são pontos, arestas são conexões.</strong>

              <button
                onClick={() => setMostrarHistoria(false)}
                style={estilos.botaoEntendi}
              >
                ENTENDI
              </button>
            </div>
          </div>
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
    background: "rgba(255,255,255,0.72)",
    borderRadius: "28px",
    padding: "clamp(20px, 4vw, 42px)",
    boxSizing: "border-box",
    position: "relative",
  },

  header: { textAlign: "center", marginBottom: "24px" },
  icone: { fontSize: "46px", marginBottom: "6px" },

  titulo: {
    fontSize: "clamp(38px, 6vw, 58px)",
    fontWeight: "900",
    color: "#1e293b",
    margin: 0,
  },

  regra: {
    color: "#9333ea",
    fontWeight: "900",
    fontSize: "20px",
    margin: "10px 0",
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

  botaoHistoria: {
    position: "absolute",
    top: "24px",
    right: "24px",
    background: "#9333ea",
    color: "white",
    border: "none",
    borderRadius: "999px",
    padding: "12px 18px",
    fontWeight: "900",
    cursor: "pointer",
    zIndex: 50,
  },

  etapas: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
    gap: "10px",
    margin: "24px 0",
  },

  etapaBox: {
    padding: "12px",
    borderRadius: "16px",
    textAlign: "center",
    fontWeight: "900",
    fontSize: "13px",
  },

  mensagemEtapa: {
    background: "white",
    border: "2px solid #e2e8f0",
    borderRadius: "18px",
    padding: "16px",
    color: "#475569",
    fontSize: "14px",
    lineHeight: "1.7",
    whiteSpace: "pre-wrap",
    fontWeight: "700",
    marginBottom: "20px",
  },

  introBox: {
    background: "#f8fafc",
    border: "2px solid #e2e8f0",
    borderRadius: "22px",
    padding: "28px",
    textAlign: "center",
    marginBottom: "20px",
  },

  caixaTema: {
    fontSize: "34px",
    fontWeight: "900",
    color: "#9333ea",
    marginBottom: "14px",
  },

  textoIntro: {
    color: "#64748b",
    fontSize: "16px",
    lineHeight: "1.7",
    fontWeight: "700",
  },

  conteudoDesafio: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
    marginBottom: "20px",
  },

  coluna: {
    background: "#f8fafc",
    border: "2px solid #e2e8f0",
    borderRadius: "20px",
    padding: "24px",
    color: "#475569",
    minHeight: "300px",
    boxSizing: "border-box",
  },

  colunaGrande: {
    background: "#f8fafc",
    border: "2px solid #e2e8f0",
    borderRadius: "20px",
    padding: "24px",
    color: "#475569",
    minHeight: "300px",
    gridColumn: "1 / -1",
    boxSizing: "border-box",
  },

  tituloCaixa: {
    color: "#475569",
    marginTop: 0,
    fontSize: "24px",
    fontWeight: "900",
    textAlign: "center",
  },

  disponiveisContainer: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    padding: "16px",
    background: "white",
    borderRadius: "16px",
    minHeight: "120px",
    border: "2px solid #e2e8f0",
    justifyContent: "center",
    alignItems: "center",
  },

  itemDraggable: {
    padding: "14px 20px",
    background: "#9333ea",
    color: "white",
    borderRadius: "14px",
    cursor: "grab",
    fontWeight: "900",
    fontSize: "14px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
    textAlign: "center",
  },

  avatar: { fontSize: "28px" },

  zonaDrop: {
    border: "2px dashed #9333ea",
    borderRadius: "18px",
    padding: "16px",
    minHeight: "430px",
    background: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflowX: "auto",
  },

  grafoGrande: {
    background: "white",
    border: "2px dashed #9333ea",
    borderRadius: "18px",
    padding: "10px",
    overflowX: "auto",
  },

  vertice: {
    width: "116px",
    height: "94px",
    background: "rgba(129,140,248,0.12)",
    borderRadius: "18px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    padding: "8px",
    boxSizing: "border-box",
  },

  avatarVertice: {
    fontSize: "25px",
    marginBottom: "4px",
  },

  nomeItem: {
    fontSize: "12px",
    fontWeight: "900",
    color: "#475569",
    textAlign: "center",
    lineHeight: "1.15",
  },

  busca: {
    position: "absolute",
    bottom: "-12px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#9333ea",
    color: "white",
    fontSize: "9px",
    padding: "3px 7px",
    borderRadius: "999px",
    fontWeight: "900",
  },

  verificado: {
    position: "absolute",
    bottom: "-12px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#22c55e",
    color: "white",
    fontSize: "9px",
    padding: "3px 7px",
    borderRadius: "999px",
    fontWeight: "900",
  },

  atualizado: {
    position: "absolute",
    bottom: "-12px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#22c55e",
    color: "white",
    fontSize: "9px",
    padding: "3px 7px",
    borderRadius: "999px",
    fontWeight: "900",
  },

  zonaRemocao: {
    border: "3px dashed #ec4899",
    borderRadius: "18px",
    padding: "24px",
    minHeight: "260px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ec4899",
    fontWeight: "900",
    fontSize: "20px",
    background: "rgba(236,72,153,0.08)",
    textAlign: "center",
  },

  caixaConceito: {
    background: "white",
    border: "2px solid #e2e8f0",
    borderRadius: "18px",
    padding: "16px",
    fontSize: "14px",
    color: "#64748b",
    lineHeight: "1.6",
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
    marginTop: "18px",
  },

  fundoModal: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    backdropFilter: "blur(5px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 200,
  },

  modalHistoria: {
    width: "min(90%, 620px)",
    background: "white",
    borderRadius: "24px",
    padding: "32px",
    textAlign: "center",
    color: "#475569",
    fontWeight: "700",
    lineHeight: "1.8",
    boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
  },

  botaoEntendi: {
    marginTop: "24px",
    width: "100%",
    padding: "14px",
    background: "#9333ea",
    color: "white",
    border: "none",
    borderRadius: "16px",
    fontWeight: "900",
    cursor: "pointer",
  },

  cardConclusao: {
    width: "100%",
    maxWidth: "700px",
    margin: "0 auto",
    background: "rgba(255,255,255,0.88)",
    borderRadius: "28px",
    padding: "clamp(24px, 4vw, 50px)",
    textAlign: "center",
    boxSizing: "border-box",
  },

  resumoBox: {
    background: "#f8fafc",
    border: "2px solid #e2e8f0",
    padding: "20px",
    borderRadius: "18px",
    margin: "24px 0",
    textAlign: "left",
    color: "#475569",
    lineHeight: "1.7",
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
    marginTop: "10px",
  },

  vazio: {
    color: "#94a3b8",
    fontWeight: "bold",
  },
};

export default LabirintoGrafo;