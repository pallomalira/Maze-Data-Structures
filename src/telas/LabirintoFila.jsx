import { useState } from "react";
import { motion } from "framer-motion";

function LabirintoFila({ voltar, concluir }) {
  const personagensIniciais = [
    { nome: "Mercador João", icone: "🧙" },
    { nome: "Arqueira Maria", icone: "🏹" },
    { nome: "Ferreira Ana", icone: "🔨" },
    { nome: "Mago Pedro", icone: "✨" },
  ];

  const [etapa, setEtapa] = useState(0);
  const [fila, setFila] = useState([]);
  const [disponiveis, setDisponiveis] = useState(personagensIniciais);
  const [dragged, setDragged] = useState(null);
  const [indiceBusca, setIndiceBusca] = useState(0);
  const [concluido, setConcluido] = useState(false);
  const [mostrarHistoria, setMostrarHistoria] = useState(true);

  const [mensagem, setMensagem] = useState(
    "Clique em COMEÇAR para iniciar o desafio da fila."
  );

  function iniciarFase() {
    setEtapa(1);
    setMensagem(
      "📥 FORMAR FILA\n\nArraste os viajantes para a fila do mercado.\n\nNa fila, novos elementos entram sempre no FINAL."
    );
  }

  function adicionarPersonagem(index) {
    if (etapa !== 1) return;

    const personagem = disponiveis[index];
    const novaFila = [...fila, personagem];
    const novosDisponiveis = disponiveis.filter((_, i) => i !== index);

    setFila(novaFila);
    setDisponiveis(novosDisponiveis);
    setDragged(null);

    if (novaFila.length === 4) {
      setEtapa(2);
      setIndiceBusca(0);
      setMensagem(
        "🔍 BUSCAR NO LABIRINTO\n\nA Arqueira Maria perdeu seu passe mágico.\n\nPara encontrá-la, você NÃO pode pular direto até ela.\n\nEm uma fila, a busca começa pelo INÍCIO.\n\nClique no personagem marcado como VERIFICAR."
      );
    } else {
      setMensagem(
        "✅ Viajante entrou na fila.\n\nContinue colocando os próximos no FINAL."
      );
    }
  }

  function buscarPersonagem(index) {
    if (etapa !== 2) return;

    if (index !== indiceBusca) {
      setMensagem(
        "❌ Você pulou a ordem.\n\nNa fila, a busca precisa percorrer desde o INÍCIO.\n\nClique no personagem marcado como VERIFICAR."
      );
      return;
    }

    const atual = fila[index];

    if (atual.nome === "Arqueira Maria") {
      setEtapa(3);
      setMensagem(
        "✅ Arqueira Maria encontrada!\n\nVocê percorreu a fila em ordem até chegar nela.\n\nAgora atualize o registro dela para: Arqueira Maria Clara."
      );
      return;
    }

    setIndiceBusca(indiceBusca + 1);
    setMensagem(
      `🔍 Você verificou ${atual.nome}.\n\nAinda não é Maria.\n\nContinue percorrendo a fila em ordem.`
    );
  }

  function atualizarPersonagem(index) {
    if (etapa !== 3) return;

    if (fila[index].nome !== "Arqueira Maria") {
      setMensagem(
        "❌ Não é esse personagem.\n\nClique na Arqueira Maria para atualizar o registro."
      );
      return;
    }

    const novaFila = fila.map((p) =>
      p.nome === "Arqueira Maria"
        ? { ...p, nome: "Arqueira Maria Clara" }
        : p
    );

    setFila(novaFila);
    setEtapa(4);
    setMensagem(
      "✏️ Registro atualizado!\n\nMaria agora é Arqueira Maria Clara.\n\nAgora o primeiro viajante será atendido.\n\nArraste quem está no INÍCIO para a saída do mercado."
    );
  }

  function removerPersonagem(index) {
    if (etapa !== 4) return;

    if (index !== 0) {
      setMensagem(
        "❌ Esse personagem não pode sair agora.\n\nNa fila, apenas quem está no INÍCIO pode sair.\n\nEssa é a regra FIFO."
      );
      setDragged(null);
      return;
    }

    const removido = fila[0];
    setFila(fila.slice(1));
    setEtapa(5);
    setDragged(null);

    setMensagem(
      `✅ ${removido.nome} saiu da fila corretamente.\n\nAgora observe a fila restante.\n\nQuem será o próximo a ser atendido?`
    );
  }

  function responderDesafio(index) {
    if (etapa !== 5) return;

    if (index === 0) {
      setMensagem(
        "🏆 Perfeito!\n\nVocê entendeu a Fila:\n\n📥 Entra no final\n🔍 Busca percorrendo do início\n✏️ Atualiza após encontrar\n🗑️ Remove do início\n\nFIFO: First In, First Out."
      );
      setConcluido(true);
    } else {
      setMensagem("❌ Ainda não.\n\nObserve quem está no INÍCIO da fila.");
    }
  }

  function clicarPersonagem(index) {
    if (etapa === 2) buscarPersonagem(index);
    if (etapa === 3) atualizarPersonagem(index);
    if (etapa === 5) responderDesafio(index);
  }

  function soltarParaAdicionar() {
    if (!dragged || dragged.tipo !== "disponivel") return;
    adicionarPersonagem(dragged.index);
  }

  function soltarParaRemover() {
    if (!dragged || dragged.tipo !== "fila") return;
    removerPersonagem(dragged.index);
  }

  function resetar() {
    setEtapa(0);
    setFila([]);
    setDisponiveis(personagensIniciais);
    setDragged(null);
    setIndiceBusca(0);
    setConcluido(false);
    setMostrarHistoria(true);
    setMensagem("Clique em COMEÇAR para iniciar o desafio da fila.");
  }

  if (concluido) {
    return (
      <div style={estilos.pagina}>
        <div style={estilos.cardConclusao}>
          <button onClick={voltar} style={estilos.botaoVoltar}>
            ← VOLTAR
          </button>

          <div style={estilos.icone}>🏆</div>
          <h1 style={estilos.titulo}>FILA CONCLUÍDA!</h1>

          <div style={estilos.resumoBox}>
            <p>📥 Inserir: entra no final da fila.</p>
            <p>🔍 Buscar: percorre do início até encontrar.</p>
            <p>✏️ Atualizar: altera o personagem encontrado.</p>
            <p>🗑️ Remover: sai quem está no início.</p>
            <p>🎯 FIFO: primeiro que entra, primeiro que sai.</p>
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
          <div style={estilos.icone}>🛒</div>
          <h1 style={estilos.titulo}>MERCADO DA FILA</h1>
          <p style={estilos.regra}>FIFO: quem chega primeiro, sai primeiro.</p>
        </div>

        <div style={estilos.etapas}>
          {["História", "Formar fila", "Buscar", "Atualizar", "Atender", "Desafio"].map(
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
            <div style={estilos.caixaTema}>🏪 Entrada do Mercado</div>
            <p style={estilos.textoIntro}>
              Imagine uma fila de mercado dentro do labirinto. Quem chega por
              último entra no final. Quem chegou primeiro é atendido primeiro.
            </p>
            <button onClick={iniciarFase} style={estilos.botaoPrincipal}>
              COMEÇAR
            </button>
          </div>
        )}

        {etapa === 1 && (
          <div style={estilos.conteudoDesafio}>
            <div style={estilos.coluna}>
              <h2 style={estilos.tituloCaixa}>Viajantes chegando</h2>

              <div style={estilos.disponiveisContainer}>
                {disponiveis.map((p, index) => (
                  <motion.div
                    key={p.nome}
                    draggable
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => adicionarPersonagem(index)}
                    onDragStart={() =>
                      setDragged({ tipo: "disponivel", index })
                    }
                    style={estilos.itemDraggable}
                  >
                    <span style={estilos.avatar}>{p.icone}</span>
                    <span>{p.nome}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div style={estilos.coluna}>
              <h2 style={estilos.tituloCaixa}>Fila do mercado</h2>

              <div
                style={estilos.zonaDrop}
                onDragOver={(e) => e.preventDefault()}
                onDrop={soltarParaAdicionar}
              >
                {fila.length === 0 && (
                  <span style={estilos.vazio}>Solte os viajantes aqui</span>
                )}

                <FilaVisual fila={fila} />
              </div>
            </div>
          </div>
        )}

        {(etapa === 2 || etapa === 3 || etapa === 5) && (
          <div style={estilos.conteudoDesafio}>
            <div style={estilos.colunaGrande}>
              <h2 style={estilos.tituloCaixa}>Fila do mercado</h2>

              <div style={estilos.filaVisualGrande}>
                {fila.map((p, index) => (
                  <motion.div
                    key={`${p.nome}-${index}`}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => clicarPersonagem(index)}
                    style={{
                      ...estilos.itemFila,
                      border: definirBordaFila(p.nome, index, etapa, indiceBusca),
                      cursor: "pointer",
                    }}
                  >
                    <span style={estilos.avatarFila}>{p.icone}</span>
                    <span style={estilos.nomeItem}>{p.nome}</span>
                    <span style={estilos.indice}>Posição {index + 1}</span>

                    {index === 0 && <span style={estilos.head}>INÍCIO</span>}
                    {etapa === 2 && index < indiceBusca && (
                      <span style={estilos.verificado}>VISTO</span>
                    )}
                    {etapa === 2 && index === indiceBusca && (
                      <span style={estilos.busca}>VERIFICAR</span>
                    )}
                    {etapa === 3 && p.nome === "Arqueira Maria" && (
                      <span style={estilos.busca}>ATUALIZAR</span>
                    )}
                    {p.nome === "Arqueira Maria Clara" && (
                      <span style={estilos.atualizado}>ATUALIZADO</span>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {etapa === 4 && (
          <div style={estilos.conteudoDesafio}>
            <div style={estilos.coluna}>
              <h2 style={estilos.tituloCaixa}>Fila do mercado</h2>

              <div style={estilos.filaVisualGrande}>
                {fila.map((p, index) => (
                  <motion.div
                    key={`${p.nome}-${index}`}
                    draggable
                    whileHover={{ scale: 1.05 }}
                    onDragStart={() => setDragged({ tipo: "fila", index })}
                    style={{
                      ...estilos.itemFila,
                      border:
                        index === 0
                          ? "3px solid #ec4899"
                          : "3px solid #818cf8",
                      cursor: "grab",
                    }}
                  >
                    <span style={estilos.avatarFila}>{p.icone}</span>
                    <span style={estilos.nomeItem}>{p.nome}</span>
                    <span style={estilos.indice}>Posição {index + 1}</span>
                    {index === 0 && <span style={estilos.head}>INÍCIO</span>}
                  </motion.div>
                ))}
              </div>
            </div>

            <div style={estilos.coluna}>
              <h2 style={estilos.tituloCaixa}>Saída do mercado</h2>

              <div
                style={estilos.zonaRemocao}
                onDragOver={(e) => e.preventDefault()}
                onDrop={soltarParaRemover}
              >
                🧾 Viajante atendido sai por aqui
              </div>
            </div>
          </div>
        )}

        <Conceito tipo="fila" />

        <button onClick={resetar} style={estilos.botaoResetar}>
          ↻ RESETAR FASE
        </button>

        {mostrarHistoria && (
          <div style={estilos.fundoModal}>
            <div style={estilos.modalHistoria}>
              <h2>📜 HISTÓRIA</h2>

              <p>Você chegou ao Mercado do Reino dos Dados.</p>

              <p>
                Os viajantes precisam atravessar o Labirinto da Fila para comprar
                seus suprimentos.
              </p>

              <p>Aqui vale a regra FIFO:</p>

              <strong>Quem chega primeiro, sai primeiro.</strong>

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

function definirBordaFila(nome, index, etapa, indiceBusca) {
  if (etapa === 2 && index === indiceBusca) return "3px solid #ec4899";
  if (etapa === 3 && nome === "Arqueira Maria") return "3px solid #ec4899";
  if (etapa === 5 && index === 0) return "3px solid #ec4899";
  if (index === 0) return "3px solid #ec4899";
  return "3px solid #818cf8";
}

function FilaVisual({ fila }) {
  return (
    <div style={estilos.filaVisual}>
      {fila.map((p, index) => (
        <div
          key={`${p.nome}-${index}`}
          style={{
            ...estilos.itemFila,
            border: index === 0 ? "3px solid #ec4899" : "3px solid #818cf8",
          }}
        >
          <span style={estilos.avatarFila}>{p.icone}</span>
          <span style={estilos.nomeItem}>{p.nome}</span>
          <span style={estilos.indice}>Posição {index + 1}</span>
          {index === 0 && <span style={estilos.head}>INÍCIO</span>}
        </div>
      ))}
    </div>
  );
}

function Conceito({ tipo }) {
  return (
    <div style={estilos.caixaConceito}>
      {tipo === "fila" && (
        <>
          <h3>📚 Conceito da Fila</h3>
          <p><strong>FIFO</strong>: First In, First Out.</p>
          <p>📥 Inserir: entra no final.</p>
          <p>🔍 Buscar: percorre do início até encontrar.</p>
          <p>✏️ Atualizar: altera o personagem encontrado.</p>
          <p>🗑️ Remover: sai quem está no início.</p>
        </>
      )}
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
    fontSize: "16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
  },

  avatar: { fontSize: "28px" },

  zonaDrop: {
    border: "2px dashed #9333ea",
    borderRadius: "18px",
    padding: "16px",
    minHeight: "200px",
    background: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

filaVisual: {
  minHeight: "160px",
  display: "flex",
  flexDirection: "row",
  gap: "8px",
  alignItems: "center",
  justifyContent: "flex-start",
  flexWrap: "nowrap",
  overflowX: "auto",
  width: "100%",
  padding: "12px",
  boxSizing: "border-box",
},

filaVisualGrande: {
  minHeight: "160px",
  display: "flex",
  flexDirection: "row",
  gap: "8px",
  alignItems: "center",
  justifyContent: "flex-start",
  background: "white",
  borderRadius: "18px",
  padding: "14px",
  flexWrap: "nowrap",
  overflowX: "auto",
  width: "100%",
  boxSizing: "border-box",
},

itemFila: {
  width: "clamp(90px, 22vw, 125px)",
  minWidth: "90px",
  minHeight: "92px",
  background: "rgba(129,140,248,0.12)",
  borderRadius: "16px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
  padding: "8px",
  boxSizing: "border-box",
},

avatarFila: {
  fontSize: "clamp(20px, 5vw, 28px)",
  marginBottom: "4px",
},

nomeItem: {
  fontSize: "clamp(10px, 2.7vw, 14px)",
  fontWeight: "900",
  color: "#475569",
  marginBottom: "4px",
  textAlign: "center",
  lineHeight: "1.1",
},

indice: {
  fontSize: "clamp(9px, 2.4vw, 11px)",
  fontWeight: "bold",
  color: "#64748b",
},

  head: {
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

export default LabirintoFila;