import { useState } from "react";
import { motion } from "framer-motion";

function LabirintoArvore({ voltar, concluir }) {
  const nosIniciais = [
    { valor: 50, nome: "Mestre Raiz", icone: "👑" },
    { valor: 30, nome: "Guard. Lua", icone: "🌙" },
    { valor: 70, nome: "Guard. Sol", icone: "☀️" },
    { valor: 20, nome: "Aprendiz", icone: "🧭" },
    { valor: 40, nome: "Sentinela", icone: "🛡️" },
  ];

  const [etapa, setEtapa] = useState(0);
  const [arvore, setArvore] = useState(null);
  const [disponiveis, setDisponiveis] = useState(nosIniciais);
  const [dragged, setDragged] = useState(null);
  const [valorBusca, setValorBusca] = useState(null);
  const [concluido, setConcluido] = useState(false);
  const [mostrarHistoria, setMostrarHistoria] = useState(true);

  const [mensagem, setMensagem] = useState(
    "Clique em COMEÇAR para iniciar o desafio da árvore."
  );

  function iniciarFase() {
    setEtapa(1);
    setMensagem(
      "📥 FORMAR ÁRVORE\n\nArraste os guardiões para plantar os nós da árvore.\n\nO primeiro nó escolhido vira a RAIZ.\nDepois, menores vão para a esquerda e maiores para a direita."
    );
  }

  function criarNo(item) {
    return {
      ...item,
      esquerda: null,
      direita: null,
    };
  }

  function inserirNo(noAtual, item) {
    if (!noAtual) return criarNo(item);

    if (item.valor < noAtual.valor) {
      return {
        ...noAtual,
        esquerda: inserirNo(noAtual.esquerda, item),
      };
    }

    if (item.valor > noAtual.valor) {
      return {
        ...noAtual,
        direita: inserirNo(noAtual.direita, item),
      };
    }

    return noAtual;
  }

  function contarNos(no) {
    if (!no) return 0;
    return 1 + contarNos(no.esquerda) + contarNos(no.direita);
  }

  function adicionarNo(index) {
    if (etapa !== 1) return;

    const item = disponiveis[index];
    const novaArvore = inserirNo(arvore, item);
    const novosDisponiveis = disponiveis.filter((_, i) => i !== index);

    setArvore(novaArvore);
    setDisponiveis(novosDisponiveis);
    setDragged(null);

    if (contarNos(novaArvore) === 5) {
      setEtapa(2);
      setValorBusca(novaArvore.valor);
      setMensagem(
        `🔍 BUSCAR GUARDIÃO\n\nPrecisamos encontrar o valor 70.\n\nA busca começa pela RAIZ atual da sua árvore: ${novaArvore.valor}.\n\nClique no nó marcado como VERIFICAR.`
      );
    } else {
      setMensagem(
        `✅ Nó ${item.valor} inserido.\n\nContinue montando a árvore.\n\nMenor vai para a esquerda. Maior vai para a direita.`
      );
    }
  }

  function buscarNo(no) {
    if (etapa !== 2) return;

    if (no.valor !== valorBusca) {
      setMensagem(
        "❌ Caminho errado.\n\nNa árvore binária de busca, você precisa seguir as comparações.\n\nClique no nó marcado como VERIFICAR."
      );
      return;
    }

    if (no.valor === 70) {
      setEtapa(3);
      setMensagem(
        "✅ Guardião Sol encontrado!\n\nVocê seguiu as comparações da árvore até chegar no valor 70.\n\nAgora clique nele para atualizar para Guardião Sol Supremo."
      );
      return;
    }

    if (70 > no.valor) {
      if (!no.direita) {
        setMensagem("❌ O valor 70 não está à direita desse nó.");
        return;
      }

      setValorBusca(no.direita.valor);
      setMensagem(
        `🔍 Você verificou ${no.nome} (${no.valor}).\n\nComo 70 é MAIOR que ${no.valor}, siga para a DIREITA.`
      );
    } else {
      if (!no.esquerda) {
        setMensagem("❌ O valor 70 não está à esquerda desse nó.");
        return;
      }

      setValorBusca(no.esquerda.valor);
      setMensagem(
        `🔍 Você verificou ${no.nome} (${no.valor}).\n\nComo 70 é MENOR que ${no.valor}, siga para a ESQUERDA.`
      );
    }
  }

  function atualizarNoArvore(no) {
    if (!no) return null;

    if (no.valor === 70) {
      return {
        ...no,
        valor: 75,
        nome: "Guard. Supremo",
        icone: "🌞",
      };
    }

    return {
      ...no,
      esquerda: atualizarNoArvore(no.esquerda),
      direita: atualizarNoArvore(no.direita),
    };
  }

  function atualizarNo(no) {
    if (etapa !== 3) return;

    if (no.valor !== 70) {
      setMensagem("❌ Não é esse nó.\n\nClique no Guardião Sol, valor 70.");
      return;
    }

    setArvore(atualizarNoArvore(arvore));
    setEtapa(4);
    setMensagem(
      "✏️ Guardião atualizado!\n\nO Guardião Sol virou Guardião Sol Supremo, valor 75.\n\nAgora arraste esse nó atualizado para o Portal de Remoção."
    );
  }

  function removerNoArvore(no, valor) {
    if (!no) return null;

    if (valor < no.valor) {
      return {
        ...no,
        esquerda: removerNoArvore(no.esquerda, valor),
      };
    }

    if (valor > no.valor) {
      return {
        ...no,
        direita: removerNoArvore(no.direita, valor),
      };
    }

    if (!no.esquerda && !no.direita) return null;
    if (!no.esquerda) return no.direita;
    if (!no.direita) return no.esquerda;

    return no;
  }

  function removerNo(valor) {
    if (etapa !== 4) return;

    if (valor !== 75) {
      setMensagem(
        "❌ Esse nó não deve ser removido agora.\n\nRemova o Guardião Sol Supremo, valor 75."
      );
      setDragged(null);
      return;
    }

    setArvore(removerNoArvore(arvore, valor));
    setEtapa(5);
    setDragged(null);
    setMensagem(
      "✅ Guardião Sol Supremo removido!\n\nAgora observe a árvore restante.\n\nQual nó está na RAIZ da árvore?"
    );
  }

  function responderDesafio(no) {
    if (etapa !== 5) return;

    if (arvore && no.valor === arvore.valor) {
      setMensagem(
        `🏆 Perfeito!\n\nA raiz atual é ${no.nome}, valor ${no.valor}.\n\nVocê entendeu a Árvore:\n\n🌱 A raiz é o primeiro nó inserido.\n⬅️ Menores vão para a esquerda.\n➡️ Maiores vão para a direita.\n🔍 A busca segue comparações.`
      );
      setConcluido(true);
    } else {
      setMensagem(
        "❌ Ainda não.\n\nA raiz é o nó principal da árvore, o primeiro que foi inserido."
      );
    }
  }

  function clicarNo(no) {
    if (etapa === 2) buscarNo(no);
    if (etapa === 3) atualizarNo(no);
    if (etapa === 5) responderDesafio(no);
  }

  function soltarParaAdicionar() {
    if (!dragged || dragged.tipo !== "disponivel") return;
    adicionarNo(dragged.index);
  }

  function soltarParaRemover() {
    if (!dragged || dragged.tipo !== "arvore") return;
    removerNo(dragged.valor);
  }

  function resetar() {
    setEtapa(0);
    setArvore(null);
    setDisponiveis(nosIniciais);
    setDragged(null);
    setValorBusca(null);
    setConcluido(false);
    setMostrarHistoria(true);
    setMensagem("Clique em COMEÇAR para iniciar o desafio da árvore.");
  }

  function desenharArvore(no, x, y, offset) {
    if (!no) return null;

    const elementos = [];
    const isRaiz = arvore && no.valor === arvore.valor;
    const verificar = etapa === 2 && no.valor === valorBusca;
    const atualizar = etapa === 3 && no.valor === 70;
    const atualizado = no.valor === 75;

    if (no.esquerda) {
      const xEsq = x - offset;
      const yEsq = y + 88;

      elementos.push(
        <line
          key={`linha-esq-${no.valor}`}
          x1={x}
          y1={y + 24}
          x2={xEsq}
          y2={yEsq - 24}
          stroke="#818cf8"
          strokeWidth="4"
          strokeLinecap="round"
        />
      );

      elementos.push(desenharArvore(no.esquerda, xEsq, yEsq, offset / 1.8));
    }

    if (no.direita) {
      const xDir = x + offset;
      const yDir = y + 88;

      elementos.push(
        <line
          key={`linha-dir-${no.valor}`}
          x1={x}
          y1={y + 24}
          x2={xDir}
          y2={yDir - 24}
          stroke="#818cf8"
          strokeWidth="4"
          strokeLinecap="round"
        />
      );

      elementos.push(desenharArvore(no.direita, xDir, yDir, offset / 1.8));
    }

    elementos.push(
      <foreignObject
        key={`no-${no.valor}`}
        x={x - 46}
        y={y - 39}
        width="92"
        height="88"
      >
        <div
          draggable={etapa === 4}
          onClick={() => clicarNo(no)}
          onDragStart={() =>
            setDragged({
              tipo: "arvore",
              valor: no.valor,
            })
          }
          style={{
            ...estilos.noArvore,
            border:
              verificar || atualizar || atualizado || isRaiz
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
          {isRaiz && <span style={estilos.raiz}>RAIZ</span>}
          {verificar && <span style={estilos.busca}>VERIFICAR</span>}
          {atualizar && <span style={estilos.busca}>ATUALIZAR</span>}
          {atualizado && <span style={estilos.atualizado}>ATUALIZADO</span>}

          <span style={estilos.avatarNo}>{no.icone}</span>
          <span style={estilos.nomeNo}>{no.nome}</span>
          <span style={estilos.valorNo}>Valor {no.valor}</span>
        </div>
      </foreignObject>
    );

    return elementos;
  }

  if (concluido) {
    return (
      <div style={estilos.pagina}>
        <div style={estilos.cardConclusao}>
          <button onClick={voltar} style={estilos.botaoVoltar}>
            ← VOLTAR
          </button>

          <div style={estilos.icone}>🏆</div>
          <h1 style={estilos.titulo}>ÁRVORE CONCLUÍDA!</h1>

          <div style={estilos.resumoBox}>
            <p>🌱 Raiz: primeiro nó da árvore.</p>
            <p>⬅️ Esquerda: valores menores.</p>
            <p>➡️ Direita: valores maiores.</p>
            <p>🔍 Buscar: começa na raiz e segue comparações.</p>
            <p>✏️ Atualizar: altera um nó encontrado.</p>
            <p>🗑️ Remover: retira um nó da árvore.</p>
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
          <div style={estilos.icone}>🌳</div>
          <h1 style={estilos.titulo}>ÁRVORE ANCESTRAL</h1>
          <p style={estilos.regra}>Menores à esquerda, maiores à direita.</p>
        </div>

        <div style={estilos.etapas}>
          {["História", "Formar árvore", "Buscar", "Atualizar", "Remover", "Desafio"].map(
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
            <div style={estilos.caixaTema}>🌳 Árvore do Conhecimento</div>

            <p style={estilos.textoIntro}>
              Imagine uma árvore genealógica: existe um nó principal, chamado
              raiz, e dele surgem filhos à esquerda e à direita.
            </p>

            <button onClick={iniciarFase} style={estilos.botaoPrincipal}>
              COMEÇAR
            </button>
          </div>
        )}

        {etapa === 1 && (
          <div style={estilos.conteudoDesafio}>
            <div style={estilos.coluna}>
              <h2 style={estilos.tituloCaixa}>Guardiões disponíveis</h2>

              <div style={estilos.disponiveisContainer}>
                {disponiveis.map((item, index) => (
                  <motion.div
                    key={item.valor}
                    draggable
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => adicionarNo(index)}
                    onDragStart={() =>
                      setDragged({ tipo: "disponivel", index })
                    }
                    style={estilos.itemDraggable}
                  >
                    <span style={estilos.avatar}>{item.icone}</span>
                    <span>{item.nome}</span>
                    <small>Valor {item.valor}</small>
                  </motion.div>
                ))}
              </div>
            </div>

            <div style={estilos.coluna}>
              <h2 style={estilos.tituloCaixa}>Área da árvore</h2>

              <div
                style={estilos.zonaDrop}
                onDragOver={(e) => e.preventDefault()}
                onDrop={soltarParaAdicionar}
              >
                {arvore ? (
                  <svg width="100%" height="360" viewBox="0 0 520 360">
                    {desenharArvore(arvore, 260, 55, 95)}
                  </svg>
                ) : (
                  <span style={estilos.vazio}>Solte os guardiões aqui</span>
                )}
              </div>
            </div>
          </div>
        )}

        {(etapa === 2 || etapa === 3 || etapa === 5) && (
          <div style={estilos.conteudoDesafio}>
            <div style={estilos.colunaGrande}>
              <h2 style={estilos.tituloCaixa}>Árvore montada</h2>

              <div style={estilos.arvoreGrande}>
                <svg width="100%" height="360" viewBox="0 0 520 360">
                  {desenharArvore(arvore, 260, 55, 95)}
                </svg>
              </div>
            </div>
          </div>
        )}

        {etapa === 4 && (
          <div style={estilos.conteudoDesafio}>
            <div style={estilos.coluna}>
              <h2 style={estilos.tituloCaixa}>Árvore montada</h2>

              <div style={estilos.arvoreGrande}>
                <svg width="100%" height="360" viewBox="0 0 520 360">
                  {desenharArvore(arvore, 260, 55, 95)}
                </svg>
              </div>
            </div>

            <div style={estilos.coluna}>
              <h2 style={estilos.tituloCaixa}>Portal de remoção</h2>

              <div
                style={estilos.zonaRemocao}
                onDragOver={(e) => e.preventDefault()}
                onDrop={soltarParaRemover}
              >
                🌀 Arraste o nó atualizado para cá
              </div>
            </div>
          </div>
        )}

        <div style={estilos.caixaConceito}>
          <h3>📚 Conceito da Árvore</h3>
          <p>
            <strong>Raiz:</strong> primeiro nó da árvore.
          </p>
          <p>⬅️ Valores menores ficam à esquerda.</p>
          <p>➡️ Valores maiores ficam à direita.</p>
          <p>🔍 A busca começa pela raiz e segue comparações.</p>
        </div>

        <button onClick={resetar} style={estilos.botaoResetar}>
          ↻ RESETAR FASE
        </button>

        {mostrarHistoria && (
          <div style={estilos.fundoModal}>
            <div style={estilos.modalHistoria}>
              <h2>📜 HISTÓRIA</h2>

              <p>Você chegou à Árvore Ancestral do Reino dos Dados.</p>

              <p>
                Cada guardião ocupa um lugar na árvore. O primeiro guardião vira
                a raiz.
              </p>

              <p>Aqui vale a regra da Árvore Binária de Busca:</p>

              <strong>Menores vão para a esquerda, maiores vão para a direita.</strong>

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

  avatar: {
    fontSize: "28px",
  },

  zonaDrop: {
    border: "2px dashed #9333ea",
    borderRadius: "18px",
    padding: "16px",
    minHeight: "360px",
    background: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflowX: "auto",
  },

  arvoreGrande: {
    background: "white",
    border: "2px dashed #9333ea",
    borderRadius: "18px",
    padding: "10px",
    overflowX: "auto",
  },

  noArvore: {
    width: "92px",
    height: "78px",
    background: "rgba(129,140,248,0.12)",
    borderRadius: "14px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    padding: "6px",
    boxSizing: "border-box",
  },

  avatarNo: {
    fontSize: "18px",
  },

  nomeNo: {
    fontSize: "10px",
    fontWeight: "900",
    color: "#475569",
    textAlign: "center",
    lineHeight: "1.1",
  },

  valorNo: {
    fontSize: "9px",
    color: "#64748b",
    fontWeight: "bold",
  },

  raiz: {
    position: "absolute",
    top: "-12px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#ec4899",
    color: "white",
    fontSize: "9px",
    padding: "3px 7px",
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

export default LabirintoArvore;