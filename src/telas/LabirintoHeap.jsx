import { useState } from "react";
import { motion } from "framer-motion";

function LabirintoHeap({ voltar, concluir }) {
  const guardioesIniciais = [
    { prioridade: 40, nome: "Guardião Pedra", icone: "🪨" },
    { prioridade: 90, nome: "Guardião Rei", icone: "👑" },
    { prioridade: 60, nome: "Guardião Fogo", icone: "🔥" },
    { prioridade: 30, nome: "Guardião Água", icone: "💧" },
    { prioridade: 75, nome: "Guardião Raio", icone: "⚡" },
  ];

  const [etapa, setEtapa] = useState(0);
  const [heap, setHeap] = useState([]);
  const [disponiveis, setDisponiveis] = useState(guardioesIniciais);
  const [dragged, setDragged] = useState(null);
  const [concluido, setConcluido] = useState(false);
  const [mostrarHistoria, setMostrarHistoria] = useState(true);

  const [mensagem, setMensagem] = useState(
    "Clique em COMEÇAR para iniciar o desafio do Heap."
  );

  function iniciarFase() {
    setEtapa(1);
    setMensagem(
      "📥 FORMAR HEAP\n\nArraste os guardiões para a torre.\n\nA cada inserção, o Heap reorganiza sozinho para deixar o maior valor no topo."
    );
  }

  function inserirHeap(lista, item) {
    const novoHeap = [...lista, item];
    let index = novoHeap.length - 1;

    while (index > 0) {
      const pai = Math.floor((index - 1) / 2);

      if (novoHeap[pai].prioridade >= novoHeap[index].prioridade) break;

      [novoHeap[pai], novoHeap[index]] = [novoHeap[index], novoHeap[pai]];
      index = pai;
    }

    return novoHeap;
  }

  function heapifyDown(lista, index = 0) {
    const novoHeap = [...lista];
    const tamanho = novoHeap.length;

    while (true) {
      let maior = index;
      const esquerda = 2 * index + 1;
      const direita = 2 * index + 2;

      if (
        esquerda < tamanho &&
        novoHeap[esquerda].prioridade > novoHeap[maior].prioridade
      ) {
        maior = esquerda;
      }

      if (
        direita < tamanho &&
        novoHeap[direita].prioridade > novoHeap[maior].prioridade
      ) {
        maior = direita;
      }

      if (maior === index) break;

      [novoHeap[index], novoHeap[maior]] = [novoHeap[maior], novoHeap[index]];
      index = maior;
    }

    return novoHeap;
  }

  function adicionarGuardiao(index) {
    if (etapa !== 1) return;

    const guardiao = disponiveis[index];
    const novoHeap = inserirHeap(heap, guardiao);
    const novosDisponiveis = disponiveis.filter((_, i) => i !== index);

    setHeap(novoHeap);
    setDisponiveis(novosDisponiveis);
    setDragged(null);

    if (novoHeap.length === 5) {
      setEtapa(2);
      setMensagem(
        "🔍 BUSCAR PRIORIDADE\n\nA torre precisa encontrar o guardião de prioridade 75.\n\nNo Heap, o acesso principal é o TOPO, mas para buscar outro valor precisamos verificar os nós.\n\nClique nos guardiões até encontrar a prioridade 75."
      );
    } else {
      setMensagem(
        `✅ ${guardiao.nome} entrou na torre.\n\nPrioridade: ${guardiao.prioridade}\n\nO Heap se reorganizou para manter o maior valor no topo.`
      );
    }
  }

  function buscarGuardiao(index) {
    if (etapa !== 2) return;

    if (heap[index].prioridade === 75) {
      setEtapa(3);
      setMensagem(
        "✅ Guardião Raio encontrado!\n\nEle tem prioridade 75.\n\nAgora atualize sua prioridade para 95, para mostrar que ele ficou mais forte."
      );
    } else {
      setMensagem(
        `🔍 Você verificou ${heap[index].nome}, prioridade ${heap[index].prioridade}.\n\nAinda não é o guardião de prioridade 75.\n\nContinue procurando.`
      );
    }
  }

  function atualizarGuardiao(index) {
    if (etapa !== 3) return;

    if (heap[index].prioridade !== 75) {
      setMensagem(
        "❌ Não é esse guardião.\n\nClique no Guardião Raio, prioridade 75."
      );
      return;
    }

    const heapAtualizado = heap.map((item, i) =>
      i === index
        ? {
            ...item,
            prioridade: 95,
            nome: "Guardião Raio Supremo",
            icone: "🌩️",
          }
        : item
    );

    let heapReorganizado = [];
    heapAtualizado.forEach((item) => {
      heapReorganizado = inserirHeap(heapReorganizado, item);
    });

    setHeap(heapReorganizado);
    setEtapa(4);
    setMensagem(
      "✏️ Prioridade atualizada!\n\nO Guardião Raio virou Guardião Raio Supremo, prioridade 95.\n\nComo ele agora tem a maior prioridade, subiu para o TOPO.\n\nArraste o topo para a zona de remoção."
    );
  }

  function removerTopo(index) {
    if (etapa !== 4) return;

    if (index !== 0) {
      setMensagem(
        "❌ Esse guardião não pode sair agora.\n\nNo Max Heap, removemos primeiro quem está no TOPO, ou seja, a maior prioridade."
      );
      setDragged(null);
      return;
    }

    const removido = heap[0];
    const ultimo = heap[heap.length - 1];
    const novoHeap = [...heap];

    novoHeap[0] = ultimo;
    novoHeap.pop();

    const reorganizado = novoHeap.length > 0 ? heapifyDown(novoHeap, 0) : [];

    setHeap(reorganizado);
    setDragged(null);
    setEtapa(5);
    setMensagem(
      `✅ ${removido.nome} foi removido do topo.\n\nAgora o Heap se reorganizou.\n\nQual guardião ficou com a maior prioridade agora?`
    );
  }

  function responderDesafio(index) {
    if (etapa !== 5) return;

    if (index === 0) {
      setMensagem(
        "🏆 Perfeito!\n\nVocê entendeu o Heap:\n\n📥 Inserir reorganiza a estrutura\n👑 Maior prioridade fica no topo\n🔍 Buscar pode exigir verificar nós\n✏️ Atualizar prioridade reorganiza o Heap\n🗑️ Remover tira o topo"
      );
      setConcluido(true);
    } else {
      setMensagem(
        "❌ Ainda não.\n\nNo Max Heap, o maior valor sempre fica no TOPO."
      );
    }
  }

  function clicarGuardiao(index) {
    if (etapa === 2) buscarGuardiao(index);
    if (etapa === 3) atualizarGuardiao(index);
    if (etapa === 5) responderDesafio(index);
  }

  function soltarParaAdicionar() {
    if (!dragged || dragged.tipo !== "disponivel") return;
    adicionarGuardiao(dragged.index);
  }

  function soltarParaRemover() {
    if (!dragged || dragged.tipo !== "heap") return;
    removerTopo(dragged.index);
  }

  function resetar() {
    setEtapa(0);
    setHeap([]);
    setDisponiveis(guardioesIniciais);
    setDragged(null);
    setConcluido(false);
    setMostrarHistoria(true);
    setMensagem("Clique em COMEÇAR para iniciar o desafio do Heap.");
  }

  function renderHeap(interativo = true) {
    const posicoes = [
      { x: 260, y: 55 },
      { x: 155, y: 165 },
      { x: 365, y: 165 },
      { x: 105, y: 285 },
      { x: 205, y: 285 },
    ];

    return (
      <svg width="100%" height="380" viewBox="0 0 520 380">
        {heap.map((item, index) => {
          const esquerda = 2 * index + 1;
          const direita = 2 * index + 2;
          const atual = posicoes[index];

          return (
            <g key={`linhas-${index}`}>
              {heap[esquerda] && (
                <line
                  x1={atual.x}
                  y1={atual.y + 30}
                  x2={posicoes[esquerda].x}
                  y2={posicoes[esquerda].y - 30}
                  stroke="#818cf8"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              )}

              {heap[direita] && (
                <line
                  x1={atual.x}
                  y1={atual.y + 30}
                  x2={posicoes[direita].x}
                  y2={posicoes[direita].y - 30}
                  stroke="#818cf8"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              )}
            </g>
          );
        })}

        {heap.map((item, index) => {
          const pos = posicoes[index];
          const topo = index === 0;
          const buscar = etapa === 2 && item.prioridade === 75;
          const atualizar = etapa === 3 && item.prioridade === 75;
          const atualizado = item.prioridade === 95;

          return (
            <foreignObject
              key={`${item.nome}-${index}`}
              x={pos.x - 58}
              y={pos.y - 46}
              width="116"
              height="105"
            >
              <div
                draggable={etapa === 4}
                onClick={() => interativo && clicarGuardiao(index)}
                onDragStart={() => setDragged({ tipo: "heap", index })}
                style={{
                  ...estilos.noHeap,
                  border:
                    topo || buscar || atualizar || atualizado
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
                {topo && <span style={estilos.seloTopo}>TOPO</span>}
                {buscar && <span style={estilos.seloBaixo}>BUSCAR</span>}
                {atualizar && <span style={estilos.seloBaixo}>ATUALIZAR</span>}
                {atualizado && <span style={estilos.seloBaixo}>SUPREMO</span>}

                <span style={estilos.avatarNo}>{item.icone}</span>
                <span style={estilos.nomeItem}>{item.nome}</span>
                <span style={estilos.prioridade}>
                  Prioridade {item.prioridade}
                </span>
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
          <h1 style={estilos.titulo}>HEAP CONCLUÍDO!</h1>

          <div style={estilos.resumoBox}>
            <p>🏔️ Heap é uma estrutura de prioridade.</p>
            <p>👑 No Max Heap, o maior valor fica no topo.</p>
            <p>📥 Inserir reorganiza a estrutura.</p>
            <p>✏️ Atualizar prioridade pode mudar a posição.</p>
            <p>🗑️ Remover retira o topo.</p>
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
          <div style={estilos.icone}>🏔️</div>
          <h1 style={estilos.titulo}>TORRE DAS PRIORIDADES</h1>
          <p style={estilos.regra}>
            Max Heap: maior prioridade fica no topo.
          </p>
        </div>

        <div style={estilos.etapas}>
          {[
            "História",
            "Formar Heap",
            "Buscar",
            "Atualizar",
            "Remover",
            "Desafio",
          ].map((nome, index) => (
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
          ))}
        </div>

        <div style={estilos.mensagemEtapa}>{mensagem}</div>

        {etapa === 0 && (
          <div style={estilos.introBox}>
            <div style={estilos.caixaTema}>👑 Torre dos Guardiões</div>

            <p style={estilos.textoIntro}>
              Imagine uma torre onde o guardião mais forte sempre sobe para o
              topo. Isso representa a prioridade no Max Heap.
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
                    key={item.nome}
                    draggable
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => adicionarGuardiao(index)}
                    onDragStart={() =>
                      setDragged({ tipo: "disponivel", index })
                    }
                    style={estilos.itemDraggable}
                  >
                    <span style={estilos.avatar}>{item.icone}</span>
                    <span>{item.nome}</span>
                    <small>Prioridade {item.prioridade}</small>
                  </motion.div>
                ))}
              </div>
            </div>

            <div style={estilos.coluna}>
              <h2 style={estilos.tituloCaixa}>Heap montado</h2>

              <div
                style={estilos.zonaDrop}
                onDragOver={(e) => e.preventDefault()}
                onDrop={soltarParaAdicionar}
              >
                {heap.length === 0 ? (
                  <span style={estilos.vazio}>Solte os guardiões aqui</span>
                ) : (
                  renderHeap(false)
                )}
              </div>
            </div>
          </div>
        )}

        {(etapa === 2 || etapa === 3 || etapa === 5) && (
          <div style={estilos.colunaGrande}>
            <h2 style={estilos.tituloCaixa}>Heap montado</h2>
            <div style={estilos.heapGrande}>{renderHeap(true)}</div>
          </div>
        )}

        {etapa === 4 && (
          <div style={estilos.conteudoDesafio}>
            <div style={estilos.coluna}>
              <h2 style={estilos.tituloCaixa}>Heap montado</h2>
              <div style={estilos.heapGrande}>{renderHeap(true)}</div>
            </div>

            <div style={estilos.coluna}>
              <h2 style={estilos.tituloCaixa}>Zona de remoção</h2>

              <div
                style={estilos.zonaRemocao}
                onDragOver={(e) => e.preventDefault()}
                onDrop={soltarParaRemover}
              >
                🌀 Arraste o TOPO do Heap para cá
              </div>
            </div>
          </div>
        )}

        <div style={estilos.caixaConceito}>
          <h3>📚 Conceito do Heap</h3>
          <p>
            <strong>Heap:</strong> estrutura baseada em prioridade.
          </p>
          <p>
            <strong>Max Heap:</strong> maior prioridade fica no topo.
          </p>
          <p>📥 Inserir: adiciona e reorganiza.</p>
          <p>🔍 Buscar: pode exigir verificar nós.</p>
          <p>✏️ Atualizar: muda a prioridade e reorganiza.</p>
          <p>🗑️ Remover: retira o topo.</p>
        </div>

        <button onClick={resetar} style={estilos.botaoResetar}>
          ↻ RESETAR FASE
        </button>

        {mostrarHistoria && (
          <div style={estilos.fundoModal}>
            <div style={estilos.modalHistoria}>
              <h2>📜 HISTÓRIA</h2>

              <p>Você chegou à Torre das Prioridades do Reino dos Dados.</p>

              <p>
                Os guardiões disputam o topo da torre. Quem tem maior prioridade
                fica acima dos outros.
              </p>

              <p>Aqui vale a regra do Max Heap:</p>

              <strong>O maior valor sempre fica no topo.</strong>

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

  icone: { fontSize: "46px" },

  titulo: {
    fontSize: "clamp(36px, 6vw, 58px)",
    fontWeight: "900",
    color: "#1e293b",
    margin: 0,
  },

  regra: {
    color: "#9333ea",
    fontWeight: "900",
    fontSize: "18px",
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
    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
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
    minHeight: "250px",
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
    padding: "14px",
    background: "#9333ea",
    color: "white",
    borderRadius: "14px",
    cursor: "grab",
    fontWeight: "900",
    fontSize: "12px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
    textAlign: "center",
    maxWidth: "150px",
  },

  avatar: { fontSize: "28px" },

  zonaDrop: {
    border: "2px dashed #9333ea",
    borderRadius: "18px",
    padding: "16px",
    minHeight: "380px",
    background: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflowX: "auto",
  },

  heapGrande: {
    background: "white",
    border: "2px dashed #9333ea",
    borderRadius: "18px",
    padding: "10px",
    overflowX: "auto",
  },

  noHeap: {
    width: "108px",
    height: "92px",
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

  avatarNo: { fontSize: "22px" },

  nomeItem: {
    fontSize: "11px",
    fontWeight: "900",
    color: "#475569",
    textAlign: "center",
    lineHeight: "1.1",
  },

  prioridade: {
    fontSize: "10px",
    color: "#64748b",
    fontWeight: "bold",
  },

  seloTopo: {
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

  seloBaixo: {
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

  zonaRemocao: {
    border: "3px dashed #ec4899",
    borderRadius: "18px",
    padding: "24px",
    minHeight: "230px",
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

export default LabirintoHeap;