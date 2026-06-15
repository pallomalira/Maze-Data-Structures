import { useState } from "react";
import { motion } from "framer-motion";

function LabirintoPilha({ voltar, concluir }) {
  const livrosIniciais = [
    { nome: "Livro da Lua", icone: "🌙" },
    { nome: "Livro do Fogo", icone: "🔥" },
    { nome: "Livro da Água", icone: "💧" },
    { nome: "Livro do Raio", icone: "⚡" },
  ];

  const [etapa, setEtapa] = useState(0);
  const [pilha, setPilha] = useState([]);
  const [disponiveis, setDisponiveis] = useState(livrosIniciais);
  const [dragged, setDragged] = useState(null);
  const [indiceBusca, setIndiceBusca] = useState(null);
  const [concluido, setConcluido] = useState(false);
  const [mostrarHistoria, setMostrarHistoria] = useState(true);

  const [mensagem, setMensagem] = useState(
    "Clique em COMEÇAR para iniciar o desafio da pilha."
  );

  function iniciarFase() {
    setEtapa(1);
    setMensagem(
      "📥 FORMAR PILHA\n\nArraste os livros para empilhar na biblioteca.\n\nNa pilha, novos elementos entram sempre no TOPO."
    );
  }

  function adicionarLivro(index) {
    if (etapa !== 1) return;

    const livro = disponiveis[index];
    const novaPilha = [...pilha, livro];
    const novosDisponiveis = disponiveis.filter((_, i) => i !== index);

    setPilha(novaPilha);
    setDisponiveis(novosDisponiveis);
    setDragged(null);

    if (novaPilha.length === 4) {
      setEtapa(2);
      setIndiceBusca(novaPilha.length - 1);
      setMensagem(
        "🔍 BUSCAR LIVRO\n\nO bibliotecário precisa encontrar o Livro do Fogo.\n\nNa pilha, você começa olhando pelo TOPO.\n\nClique no livro marcado como VERIFICAR."
      );
    } else {
      setMensagem(
        "✅ Livro empilhado!\n\nContinue colocando os próximos livros no TOPO da pilha."
      );
    }
  }

  function buscarLivro(index) {
    if (etapa !== 2) return;

    if (index !== indiceBusca) {
      setMensagem(
        "❌ Ordem errada.\n\nNa pilha, a verificação começa pelo TOPO.\n\nClique no livro marcado como VERIFICAR."
      );
      return;
    }

    const atual = pilha[index];

    if (atual.nome === "Livro do Fogo") {
      setEtapa(3);
      setMensagem(
        "✅ Livro do Fogo encontrado!\n\nVocê verificou a pilha a partir do topo.\n\nAgora atualize o livro para: Livro do Fogo Supremo."
      );
      return;
    }

    setIndiceBusca(indiceBusca - 1);
    setMensagem(
      `🔍 Você verificou ${atual.nome}.\n\nAinda não é o Livro do Fogo.\n\nContinue descendo pela pilha.`
    );
  }

  function atualizarLivro(index) {
    if (etapa !== 3) return;

    if (pilha[index].nome !== "Livro do Fogo") {
      setMensagem(
        "❌ Não é esse livro.\n\nClique no Livro do Fogo para atualizar."
      );
      return;
    }

    const novaPilha = pilha.map((livro) =>
      livro.nome === "Livro do Fogo"
        ? { ...livro, nome: "Livro do Fogo Supremo", icone: "🔥" }
        : livro
    );

    setPilha(novaPilha);
    setEtapa(4);
    setMensagem(
      "✏️ Livro atualizado!\n\nO Livro do Fogo virou Livro do Fogo Supremo.\n\nAgora remova o livro que está no TOPO da pilha.\n\nArraste o TOPO para a zona de remoção."
    );
  }

  function removerLivro(index) {
    if (etapa !== 4) return;

    const topo = pilha.length - 1;

    if (index !== topo) {
      setMensagem(
        "❌ Esse livro não pode sair agora.\n\nNa pilha, só o livro do TOPO pode ser removido.\n\nEssa é a regra LIFO."
      );
      setDragged(null);
      return;
    }

    const removido = pilha[topo];
    setPilha(pilha.slice(0, -1));
    setEtapa(5);
    setDragged(null);

    setMensagem(
      `✅ ${removido.nome} foi removido corretamente.\n\nAgora observe a pilha restante.\n\nQual livro está no TOPO agora?`
    );
  }

  function responderDesafio(index) {
    if (etapa !== 5) return;

    if (index === pilha.length - 1) {
      setMensagem(
        "🏆 Perfeito!\n\nVocê entendeu a Pilha:\n\n📥 Entra no topo\n🔍 Busca começando pelo topo\n✏️ Atualiza após encontrar\n🗑️ Remove do topo\n\nLIFO: Last In, First Out."
      );
      setConcluido(true);
    } else {
      setMensagem(
        "❌ Ainda não.\n\nObserve qual livro está no TOPO da pilha."
      );
    }
  }

  function clicarLivro(index) {
    if (etapa === 2) buscarLivro(index);
    if (etapa === 3) atualizarLivro(index);
    if (etapa === 5) responderDesafio(index);
  }

  function soltarParaAdicionar() {
    if (!dragged || dragged.tipo !== "disponivel") return;
    adicionarLivro(dragged.index);
  }

  function soltarParaRemover() {
    if (!dragged || dragged.tipo !== "pilha") return;
    removerLivro(dragged.index);
  }

  function resetar() {
    setEtapa(0);
    setPilha([]);
    setDisponiveis(livrosIniciais);
    setDragged(null);
    setIndiceBusca(null);
    setConcluido(false);
    setMostrarHistoria(true);
    setMensagem("Clique em COMEÇAR para iniciar o desafio da pilha.");
  }

  if (concluido) {
    return (
      <div style={estilos.pagina}>
        <div style={estilos.cardConclusao}>
          <button onClick={voltar} style={estilos.botaoVoltar}>
            ← VOLTAR
          </button>

          <div style={estilos.icone}>🏆</div>
          <h1 style={estilos.titulo}>PILHA CONCLUÍDA!</h1>

          <div style={estilos.resumoBox}>
            <p>📥 Inserir: entra no topo da pilha.</p>
            <p>🔍 Buscar: começa pelo topo.</p>
            <p>✏️ Atualizar: altera o livro encontrado.</p>
            <p>🗑️ Remover: sai quem está no topo.</p>
            <p>🎯 LIFO: último que entra, primeiro que sai.</p>
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
          <div style={estilos.icone}>📚</div>
          <h1 style={estilos.titulo}>BIBLIOTECA DA PILHA</h1>
          <p style={estilos.regra}>LIFO: quem entra por último, sai primeiro.</p>
        </div>

        <div style={estilos.etapas}>
          {["História", "Empilhar", "Buscar", "Atualizar", "Remover", "Desafio"].map(
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
            <div style={estilos.caixaTema}>📚 Biblioteca Perdida</div>
            <p style={estilos.textoIntro}>
              Imagine uma pilha de livros. O último livro colocado fica no topo,
              e é o primeiro que pode ser retirado.
            </p>

            <button onClick={iniciarFase} style={estilos.botaoPrincipal}>
              COMEÇAR
            </button>
          </div>
        )}

        {etapa === 1 && (
          <div style={estilos.conteudoDesafio}>
            <div style={estilos.coluna}>
              <h2 style={estilos.tituloCaixa}>Livros disponíveis</h2>

              <div style={estilos.disponiveisContainer}>
                {disponiveis.map((livro, index) => (
                  <motion.div
                    key={livro.nome}
                    draggable
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => adicionarLivro(index)}
                    onDragStart={() =>
                      setDragged({ tipo: "disponivel", index })
                    }
                    style={estilos.itemDraggable}
                  >
                    <span style={estilos.avatar}>{livro.icone}</span>
                    <span>{livro.nome}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div style={estilos.coluna}>
              <h2 style={estilos.tituloCaixa}>Pilha de livros</h2>

              <div
                style={estilos.zonaDrop}
                onDragOver={(e) => e.preventDefault()}
                onDrop={soltarParaAdicionar}
              >
                {pilha.length === 0 && (
                  <span style={estilos.vazio}>Solte os livros aqui</span>
                )}

                <PilhaVisual pilha={pilha} />
              </div>
            </div>
          </div>
        )}

        {(etapa === 2 || etapa === 3 || etapa === 5) && (
          <div style={estilos.conteudoDesafio}>
            <div style={estilos.colunaGrande}>
              <h2 style={estilos.tituloCaixa}>Pilha de livros</h2>

              <div style={estilos.pilhaVisualGrande}>
                {pilha.map((livro, index) => {
                  const topo = index === pilha.length - 1;

                  return (
                    <motion.div
                      key={`${livro.nome}-${index}`}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => clicarLivro(index)}
                      style={{
                        ...estilos.itemPilha,
                        border: definirBordaPilha(
                          livro.nome,
                          index,
                          etapa,
                          indiceBusca,
                          pilha.length
                        ),
                        cursor: "pointer",
                      }}
                    >
                      <span style={estilos.avatarPilha}>{livro.icone}</span>
                      <span style={estilos.nomeItem}>{livro.nome}</span>
                      <span style={estilos.indice}>Nível {index + 1}</span>

                      {topo && <span style={estilos.topo}>TOPO</span>}

                      {etapa === 2 && index === indiceBusca && (
                        <span style={estilos.busca}>VERIFICAR</span>
                      )}

                      {etapa === 3 && livro.nome === "Livro do Fogo" && (
                        <span style={estilos.busca}>ATUALIZAR</span>
                      )}

                      {livro.nome === "Livro do Fogo Supremo" && (
                        <span style={estilos.atualizado}>ATUALIZADO</span>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {etapa === 4 && (
          <div style={estilos.conteudoDesafio}>
            <div style={estilos.coluna}>
              <h2 style={estilos.tituloCaixa}>Pilha de livros</h2>

              <div style={estilos.pilhaVisualGrande}>
                {pilha.map((livro, index) => {
                  const topo = index === pilha.length - 1;

                  return (
                    <motion.div
                      key={`${livro.nome}-${index}`}
                      draggable
                      whileHover={{ scale: 1.05 }}
                      onDragStart={() =>
                        setDragged({ tipo: "pilha", index })
                      }
                      style={{
                        ...estilos.itemPilha,
                        border: topo
                          ? "3px solid #ec4899"
                          : "3px solid #818cf8",
                        cursor: "grab",
                      }}
                    >
                      <span style={estilos.avatarPilha}>{livro.icone}</span>
                      <span style={estilos.nomeItem}>{livro.nome}</span>
                      <span style={estilos.indice}>Nível {index + 1}</span>

                      {topo && <span style={estilos.topo}>TOPO</span>}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div style={estilos.coluna}>
              <h2 style={estilos.tituloCaixa}>Mesa de retirada</h2>

              <div
                style={estilos.zonaRemocao}
                onDragOver={(e) => e.preventDefault()}
                onDrop={soltarParaRemover}
              >
                📤 Livro removido sai por aqui
              </div>
            </div>
          </div>
        )}

        <Conceito />

        <button onClick={resetar} style={estilos.botaoResetar}>
          ↻ RESETAR FASE
        </button>

        {mostrarHistoria && (
          <div style={estilos.fundoModal}>
            <div style={estilos.modalHistoria}>
              <h2>📜 HISTÓRIA</h2>

              <p>Você chegou à Biblioteca Perdida do Reino dos Dados.</p>

              <p>
                Os livros mágicos precisam ser empilhados para liberar a próxima
                passagem do labirinto.
              </p>

              <p>Aqui vale a regra LIFO:</p>

              <strong>Quem entra por último, sai primeiro.</strong>

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

function definirBordaPilha(nome, index, etapa, indiceBusca, tamanho) {
  const topo = index === tamanho - 1;

  if (etapa === 2 && index === indiceBusca) return "3px solid #ec4899";
  if (etapa === 3 && nome === "Livro do Fogo") return "3px solid #ec4899";
  if (etapa === 5 && topo) return "3px solid #ec4899";
  if (topo) return "3px solid #ec4899";

  return "3px solid #818cf8";
}

function PilhaVisual({ pilha }) {
  return (
    <div style={estilos.pilhaVisual}>
      {pilha.map((livro, index) => {
        const topo = index === pilha.length - 1;

        return (
          <div
            key={`${livro.nome}-${index}`}
            style={{
              ...estilos.itemPilha,
              border: topo ? "3px solid #ec4899" : "3px solid #818cf8",
            }}
          >
            <span style={estilos.avatarPilha}>{livro.icone}</span>
            <span style={estilos.nomeItem}>{livro.nome}</span>
            <span style={estilos.indice}>Nível {index + 1}</span>

            {topo && <span style={estilos.topo}>TOPO</span>}
          </div>
        );
      })}
    </div>
  );
}

function Conceito() {
  return (
    <div style={estilos.caixaConceito}>
      <h3>📚 Conceito da Pilha</h3>
      <p><strong>LIFO</strong>: Last In, First Out.</p>
      <p>📥 Inserir: entra no topo.</p>
      <p>🔍 Buscar: começa pelo topo.</p>
      <p>✏️ Atualizar: altera o livro encontrado.</p>
      <p>🗑️ Remover: sai quem está no topo.</p>
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

  header: {
    textAlign: "center",
    marginBottom: "24px",
  },

  icone: {
    fontSize: "46px",
    marginBottom: "6px",
  },

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
    textAlign: "center",
  },

  avatar: {
    fontSize: "28px",
  },

  zonaDrop: {
    border: "2px dashed #9333ea",
    borderRadius: "18px",
    padding: "16px",
    minHeight: "260px",
    background: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  pilhaVisual: {
    minHeight: "220px",
    display: "flex",
    flexDirection: "column-reverse",
    gap: "10px",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },

  pilhaVisualGrande: {
    minHeight: "260px",
    display: "flex",
    flexDirection: "column-reverse",
    gap: "10px",
    alignItems: "center",
    justifyContent: "center",
    background: "white",
    borderRadius: "18px",
    padding: "20px",
    overflowY: "auto",
  },

  itemPilha: {
    width: "clamp(150px, 45vw, 230px)",
    minHeight: "82px",
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

  avatarPilha: {
    fontSize: "26px",
    marginBottom: "4px",
  },

  nomeItem: {
    fontSize: "clamp(12px, 3vw, 15px)",
    fontWeight: "900",
    color: "#475569",
    marginBottom: "4px",
    textAlign: "center",
  },

  indice: {
    fontSize: "11px",
    fontWeight: "bold",
    color: "#64748b",
  },

  topo: {
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

export default LabirintoPilha;