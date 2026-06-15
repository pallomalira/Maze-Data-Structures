import { useState } from "react";
import { motion } from "framer-motion";

function LabirintoLista({ voltar, concluir }) {
  const portaisIniciais = [
    { nome: "Portal Lua", icone: "🌙" },
    { nome: "Portal Fogo", icone: "🔥" },
    { nome: "Portal Água", icone: "💧" },
    { nome: "Portal Raio", icone: "⚡" },
  ];

  const [etapa, setEtapa] = useState(0);
  const [lista, setLista] = useState([]);
  const [disponiveis, setDisponiveis] = useState(portaisIniciais);
  const [dragged, setDragged] = useState(null);
  const [indiceBusca, setIndiceBusca] = useState(0);
  const [concluido, setConcluido] = useState(false);
  const [mostrarHistoria, setMostrarHistoria] = useState(true);

  const [mensagem, setMensagem] = useState(
    "Clique em COMEÇAR para iniciar o desafio da lista encadeada."
  );

  function iniciarFase() {
    setEtapa(1);
    setMensagem(
      "📥 MONTAR LISTA\n\nArraste os portais para formar uma lista encadeada.\n\nCada portal aponta para o próximo."
    );
  }

  function adicionarPortal(index) {
    if (etapa !== 1) return;

    const portal = disponiveis[index];
    const novaLista = [...lista, portal];
    const novosDisponiveis = disponiveis.filter((_, i) => i !== index);

    setLista(novaLista);
    setDisponiveis(novosDisponiveis);
    setDragged(null);

    if (novaLista.length === 4) {
      setEtapa(2);
      setIndiceBusca(0);
      setMensagem(
        "🔍 BUSCAR PORTAL\n\nPrecisamos encontrar o Portal Água.\n\nNa lista encadeada, você não pula direto para qualquer posição.\n\nVocê começa no primeiro nó e segue de um em um.\n\nClique no portal marcado como VERIFICAR."
      );
    } else {
      setMensagem(
        "✅ Portal adicionado!\n\nContinue conectando os próximos portais."
      );
    }
  }

  function buscarPortal(index) {
    if (etapa !== 2) return;

    if (index !== indiceBusca) {
      setMensagem(
        "❌ Caminho errado.\n\nNa lista encadeada, você precisa seguir nó por nó.\n\nClique no portal marcado como VERIFICAR."
      );
      return;
    }

    const atual = lista[index];

    if (atual.nome === "Portal Água") {
      setEtapa(3);
      setMensagem(
        "✅ Portal Água encontrado!\n\nVocê percorreu a lista até chegar nele.\n\nAgora atualize esse portal para Portal Água Cristalina."
      );
      return;
    }

    setIndiceBusca(indiceBusca + 1);
    setMensagem(
      `🔍 Você passou por ${atual.nome}.\n\nAinda não é o Portal Água.\n\nSiga para o próximo nó.`
    );
  }

  function atualizarPortal(index) {
    if (etapa !== 3) return;

    if (lista[index].nome !== "Portal Água") {
      setMensagem(
        "❌ Não é esse portal.\n\nClique no Portal Água para atualizar."
      );
      return;
    }

    const novaLista = lista.map((portal) =>
      portal.nome === "Portal Água"
        ? { ...portal, nome: "Portal Água Cristalina", icone: "💎" }
        : portal
    );

    setLista(novaLista);
    setEtapa(4);
    setMensagem(
      "✏️ Portal atualizado!\n\nO Portal Água virou Portal Água Cristalina.\n\nAgora remova o primeiro portal da lista arrastando ele para a zona de remoção."
    );
  }

  function removerPortal(index) {
    if (etapa !== 4) return;

    if (index !== 0) {
      setMensagem(
        "❌ Esse portal não pode ser removido agora.\n\nNesta missão, remova o primeiro nó da lista."
      );
      setDragged(null);
      return;
    }

    const removido = lista[0];
    setLista(lista.slice(1));
    setDragged(null);
    setEtapa(5);
    setMensagem(
      `✅ ${removido.nome} foi removido.\n\nAgora observe a lista restante.\n\nQual portal virou o primeiro nó da lista?`
    );
  }

  function responderDesafio(index) {
    if (etapa !== 5) return;

    if (index === 0) {
      setMensagem(
        "🏆 Perfeito!\n\nVocê entendeu a Lista Encadeada:\n\n🔗 Cada nó aponta para o próximo\n🔍 Para buscar, percorremos de um em um\n✏️ Podemos atualizar um nó encontrado\n🗑️ Podemos remover um nó e reorganizar os ponteiros"
      );
      setConcluido(true);
    } else {
      setMensagem(
        "❌ Ainda não.\n\nObserve qual portal está no início da lista agora."
      );
    }
  }

  function clicarPortal(index) {
    if (etapa === 2) buscarPortal(index);
    if (etapa === 3) atualizarPortal(index);
    if (etapa === 5) responderDesafio(index);
  }

  function soltarParaAdicionar() {
    if (!dragged || dragged.tipo !== "disponivel") return;
    adicionarPortal(dragged.index);
  }

  function soltarParaRemover() {
    if (!dragged || dragged.tipo !== "lista") return;
    removerPortal(dragged.index);
  }

  function resetar() {
    setEtapa(0);
    setLista([]);
    setDisponiveis(portaisIniciais);
    setDragged(null);
    setIndiceBusca(0);
    setConcluido(false);
    setMostrarHistoria(true);
    setMensagem("Clique em COMEÇAR para iniciar o desafio da lista encadeada.");
  }

  if (concluido) {
    return (
      <div style={estilos.pagina}>
        <div style={estilos.cardConclusao}>
          <button onClick={voltar} style={estilos.botaoVoltar}>
            ← VOLTAR
          </button>

          <div style={estilos.icone}>🏆</div>
          <h1 style={estilos.titulo}>LISTA CONCLUÍDA!</h1>

          <div style={estilos.resumoBox}>
            <p>🔗 Cada nó aponta para o próximo.</p>
            <p>🔍 Buscar: percorre de um em um.</p>
            <p>✏️ Atualizar: altera um nó encontrado.</p>
            <p>🗑️ Remover: tira um nó e reorganiza a ligação.</p>
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
          <div style={estilos.icone}>🔗</div>
          <h1 style={estilos.titulo}>CORREDOR DOS PORTAIS</h1>
          <p style={estilos.regra}>Lista: cada nó aponta para o próximo.</p>
        </div>

        <div style={estilos.etapas}>
          {["História", "Montar lista", "Buscar", "Atualizar", "Remover", "Desafio"].map(
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
            <div style={estilos.caixaTema}>🔗 Corredor dos Portais</div>
            <p style={estilos.textoIntro}>
              Imagine vários portais em sequência. Para chegar a um portal, você
              precisa passar pelo anterior.
            </p>

            <button onClick={iniciarFase} style={estilos.botaoPrincipal}>
              COMEÇAR
            </button>
          </div>
        )}

        {etapa === 1 && (
          <div style={estilos.conteudoDesafio}>
            <div style={estilos.coluna}>
              <h2 style={estilos.tituloCaixa}>Portais disponíveis</h2>

              <div style={estilos.disponiveisContainer}>
                {disponiveis.map((portal, index) => (
                  <motion.div
                    key={portal.nome}
                    draggable
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => adicionarPortal(index)}
                    onDragStart={() =>
                      setDragged({ tipo: "disponivel", index })
                    }
                    style={estilos.itemDraggable}
                  >
                    <span style={estilos.avatar}>{portal.icone}</span>
                    <span>{portal.nome}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div style={estilos.coluna}>
              <h2 style={estilos.tituloCaixa}>Lista encadeada</h2>

              <div
                style={estilos.zonaDrop}
                onDragOver={(e) => e.preventDefault()}
                onDrop={soltarParaAdicionar}
              >
                {lista.length === 0 ? (
                  <span style={estilos.vazio}>Solte os portais aqui</span>
                ) : (
                  <ListaVisual lista={lista} />
                )}
              </div>
            </div>
          </div>
        )}

        {(etapa === 2 || etapa === 3 || etapa === 5) && (
          <div style={estilos.colunaGrande}>
            <h2 style={estilos.tituloCaixa}>Lista encadeada</h2>

            <div style={estilos.listaVisualGrande}>
              {lista.map((portal, index) => (
                <motion.div
                  key={`${portal.nome}-${index}`}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => clicarPortal(index)}
                  style={{
                    ...estilos.itemLista,
                    border: definirBordaLista(
                      portal.nome,
                      index,
                      etapa,
                      indiceBusca
                    ),
                    cursor: "pointer",
                  }}
                >
                  {index === 0 && <span style={estilos.inicio}>INÍCIO</span>}
                  {etapa === 2 && index === indiceBusca && (
                    <span style={estilos.busca}>VERIFICAR</span>
                  )}
                  {etapa === 2 && index < indiceBusca && (
                    <span style={estilos.verificado}>VISTO</span>
                  )}
                  {etapa === 3 && portal.nome === "Portal Água" && (
                    <span style={estilos.busca}>ATUALIZAR</span>
                  )}
                  {portal.nome === "Portal Água Cristalina" && (
                    <span style={estilos.atualizado}>ATUALIZADO</span>
                  )}

                  <span style={estilos.avatarLista}>{portal.icone}</span>
                  <span style={estilos.nomeItem}>{portal.nome}</span>
                  <span style={estilos.indice}>Nó {index + 1}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {etapa === 4 && (
          <div style={estilos.conteudoDesafio}>
            <div style={estilos.coluna}>
              <h2 style={estilos.tituloCaixa}>Lista encadeada</h2>

              <div style={estilos.listaVisualGrande}>
                {lista.map((portal, index) => (
                  <motion.div
                    key={`${portal.nome}-${index}`}
                    draggable
                    whileHover={{ scale: 1.05 }}
                    onDragStart={() => setDragged({ tipo: "lista", index })}
                    style={{
                      ...estilos.itemLista,
                      border:
                        index === 0
                          ? "3px solid #ec4899"
                          : "3px solid #818cf8",
                      cursor: "grab",
                    }}
                  >
                    {index === 0 && <span style={estilos.inicio}>INÍCIO</span>}
                    <span style={estilos.avatarLista}>{portal.icone}</span>
                    <span style={estilos.nomeItem}>{portal.nome}</span>
                    <span style={estilos.indice}>Nó {index + 1}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div style={estilos.coluna}>
              <h2 style={estilos.tituloCaixa}>Zona de remoção</h2>

              <div
                style={estilos.zonaRemocao}
                onDragOver={(e) => e.preventDefault()}
                onDrop={soltarParaRemover}
              >
                🌀 Arraste o primeiro nó para cá
              </div>
            </div>
          </div>
        )}

        <div style={estilos.caixaConceito}>
          <h3>📚 Conceito da Lista Encadeada</h3>
          <p><strong>Nó:</strong> cada elemento da lista.</p>
          <p><strong>Ponteiro:</strong> ligação para o próximo nó.</p>
          <p>🔍 Buscar: percorre de nó em nó.</p>
          <p>✏️ Atualizar: altera um nó encontrado.</p>
          <p>🗑️ Remover: tira um nó e reorganiza a sequência.</p>
        </div>

        <button onClick={resetar} style={estilos.botaoResetar}>
          ↻ RESETAR FASE
        </button>

        {mostrarHistoria && (
          <div style={estilos.fundoModal}>
            <div style={estilos.modalHistoria}>
              <h2>📜 HISTÓRIA</h2>

              <p>Você chegou ao Corredor dos Portais do Reino dos Dados.</p>

              <p>
                Cada portal aponta para o próximo. Para chegar ao último, você
                precisa seguir a sequência.
              </p>

              <p>Aqui vale a regra da Lista Encadeada:</p>

              <strong>Um nó leva ao próximo nó.</strong>

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

function definirBordaLista(nome, index, etapa, indiceBusca) {
  if (etapa === 2 && index === indiceBusca) return "3px solid #ec4899";
  if (etapa === 3 && nome === "Portal Água") return "3px solid #ec4899";
  if (etapa === 5 && index === 0) return "3px solid #ec4899";
  if (index === 0) return "3px solid #ec4899";
  return "3px solid #818cf8";
}

function ListaVisual({ lista }) {
  return (
    <div style={estilos.listaVisualGrande}>
      {lista.map((portal, index) => (
        <div
          key={`${portal.nome}-${index}`}
          style={{
            ...estilos.itemLista,
            border: index === 0 ? "3px solid #ec4899" : "3px solid #818cf8",
          }}
        >
          {index === 0 && <span style={estilos.inicio}>INÍCIO</span>}
          <span style={estilos.avatarLista}>{portal.icone}</span>
          <span style={estilos.nomeItem}>{portal.nome}</span>
          <span style={estilos.indice}>Nó {index + 1}</span>
        </div>
      ))}
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
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
    marginBottom: "20px",
  },

  coluna: {
    background: "#f8fafc",
    border: "2px solid #e2e8f0",
    borderRadius: "20px",
    padding: "24px",
    color: "#475569",
    minHeight: "260px",
    boxSizing: "border-box",
  },

  colunaGrande: {
    background: "#f8fafc",
    border: "2px solid #e2e8f0",
    borderRadius: "20px",
    padding: "24px",
    color: "#475569",
    minHeight: "260px",
    boxSizing: "border-box",
    marginBottom: "20px",
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
    minHeight: "230px",
    background: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflowX: "auto",
  },

  listaVisualGrande: {
    minHeight: "170px",
    display: "flex",
    flexDirection: "row",
    gap: "12px",
    alignItems: "center",
    justifyContent: "flex-start",
    background: "white",
    borderRadius: "18px",
    padding: "18px",
    flexWrap: "nowrap",
    overflowX: "auto",
    width: "100%",
    boxSizing: "border-box",
  },

  itemLista: {
    width: "clamp(110px, 26vw, 145px)",
    minWidth: "105px",
    minHeight: "105px",
    background: "rgba(129,140,248,0.12)",
    borderRadius: "18px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    padding: "10px",
    boxSizing: "border-box",
  },

  avatarLista: { fontSize: "26px", marginBottom: "4px" },

  nomeItem: {
    fontSize: "clamp(11px, 2.8vw, 14px)",
    fontWeight: "900",
    color: "#475569",
    marginBottom: "4px",
    textAlign: "center",
    lineHeight: "1.1",
  },

  indice: {
    fontSize: "11px",
    fontWeight: "bold",
    color: "#64748b",
  },

  inicio: {
    position: "absolute",
    top: "-12px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#ec4899",
    color: "white",
    fontSize: "10px",
    padding: "3px 8px",
    borderRadius: "999px",
    fontWeight: "900",
  },

  busca: {
    position: "absolute",
    bottom: "-12px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#9333ea",
    color: "white",
    fontSize: "10px",
    padding: "3px 8px",
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
    fontSize: "10px",
    padding: "3px 8px",
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
    fontSize: "10px",
    padding: "3px 8px",
    borderRadius: "999px",
    fontWeight: "900",
  },

  zonaRemocao: {
    border: "3px dashed #ec4899",
    borderRadius: "18px",
    padding: "24px",
    minHeight: "190px",
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

export default LabirintoLista;