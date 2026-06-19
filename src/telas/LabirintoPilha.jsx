import { useState } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import * as ReactJoyride from "react-joyride";

const Joyride = ReactJoyride.default || ReactJoyride.Joyride;

function LabirintoPilha({ voltar, concluir }) {
  const livrosIniciais = [
    { nome: "Livro da Lua", icone: "🌙" },
    { nome: "Livro do Fogo", icone: "🔥" },
    { nome: "Livro da Água", icone: "💧" },
    { nome: "Livro do Raio", icone: "⚡" },
  ];

  const livroDesafio = {
    nome: "Livro das Sombras",
    icone: "🌑",
  };

  const etapas = [
    "Empilhar",
    "Buscar",
    "Atualizar",
    "Remover",
    "Desafio",
    "Conclusão",
  ];

  const [etapa, setEtapa] = useState(1);
  const [pilha, setPilha] = useState([]);
  const [disponiveis, setDisponiveis] = useState(livrosIniciais);
  const [removidos, setRemovidos] = useState([]);

  const [indiceBusca, setIndiceBusca] = useState(null);
  const [novoNome, setNovoNome] = useState("");
  const [indiceSelecionado, setIndiceSelecionado] = useState(null);
  const [indiceAtualizado, setIndiceAtualizado] = useState(null);

  const [mostrarHistoria, setMostrarHistoria] = useState(true);
  const [mostrarDica, setMostrarDica] = useState(false);
  const [mostrarEtapas, setMostrarEtapas] = useState(false);
  const [concluido, setConcluido] = useState(false);
  const [runTour, setRunTour] = useState(false);

  const [mensagem, setMensagem] = useState(
    "Clique em um livro para adicioná-lo ao topo da pilha."
  );

  const stepsBase = [
    {
      target: ".tour-topo",
      content:
        "Aqui você pode voltar ao mapa, abrir a história ou ver a dica da fase.",
      placement: "bottom",
      disableBeacon: true,
    },
    {
      target: ".tour-etapa",
      content:
        "Aqui aparece a etapa atual. Toque para visualizar todas as etapas.",
      placement: "bottom",
    },
    {
      target: ".tour-mensagem",
      content: "Essa mensagem mostra o que você precisa fazer agora.",
      placement: "bottom",
    },
  ];

  const stepsPorEtapa = {
    1: [
      {
        target: ".tour-livros",
        content:
          "Clique nos livros disponíveis para empilhá-los. Cada novo livro entra no topo.",
        placement: "bottom",
      },
      {
        target: ".tour-pilha",
        content:
          "Essa é a pilha. O último livro colocado fica no topo e será o primeiro a sair.",
        placement: "top",
      },
    ],
    2: [
      {
        target: ".tour-pilha",
        content:
          "Agora busque o Livro do Fogo. Na pilha, a busca começa pelo topo.",
        placement: "top",
      },
    ],
    3: [
      {
        target: ".tour-pilha",
        content:
          "Clique no Livro do Fogo para selecionar quem será atualizado.",
        placement: "top",
      },
      {
        target: ".tour-atualizar",
        content:
          "Depois de selecionar o livro, digite o novo nome e clique em Atualizar.",
        placement: "bottom",
      },
    ],
    4: [
      {
        target: ".tour-pilha",
        content:
          "Na etapa de remoção, apenas o livro que está no topo pode sair.",
        placement: "top",
      },
      {
        target: ".tour-remocao",
        content:
          "Quando o livro do topo for removido, ele aparecerá aqui para mostrar a saída da pilha.",
        placement: "top",
      },
    ],
    5: [
      {
        target: ".tour-pilha",
        content:
          "Um novo livro foi colocado no topo. Descubra qual livro sairá agora seguindo a regra LIFO.",
        placement: "top",
      },
    ],
    6: [
      {
        target: ".tour-conceito",
        content:
          "Parabéns! Você concluiu a fase e entendeu a regra LIFO.",
        placement: "top",
      },
    ],
  };

  const steps = [
    ...stepsBase,
    ...(stepsPorEtapa[etapa] || []),
    {
      target: ".tour-conceito",
      content:
        "LIFO significa Last In, First Out: o último que entra é o primeiro que sai.",
      placement: "top",
    },
    {
      target: ".tour-resetar",
      content: "Aqui você pode resetar a fase ou ver o tutorial novamente.",
      placement: "top",
    },
  ];

  function mostrarToast(tipo, texto) {
    toast.dismiss();

    setTimeout(() => {
      if (tipo === "success") toast.success(texto);
      else if (tipo === "error") toast.error(texto);
      else toast(texto);
    }, 150);
  }

  function iniciarTutorial() {
    setMostrarEtapas(false);
    setRunTour(false);

    setTimeout(() => {
      setRunTour(true);
    }, 100);
  }

  function fecharHistoria() {
    setMostrarHistoria(false);

    setTimeout(() => {
      iniciarTutorial();
    }, 400);
  }

  function adicionarLivro(index) {
    if (etapa !== 1) {
      mostrarToast("error", "Agora não é o momento de empilhar livros.");
      return;
    }

    const livro = disponiveis[index];
    const novaPilha = [...pilha, livro];

    setPilha(novaPilha);
    setDisponiveis(disponiveis.filter((_, i) => i !== index));

    mostrarToast("success", `${livro.nome} entrou no topo da pilha.`);

    if (novaPilha.length === 4) {
      setEtapa(2);
      setIndiceBusca(novaPilha.length - 1);
      setMensagem("Agora clique nos livros em ordem, começando pelo topo.");

      setTimeout(() => {
        mostrarToast(
          "info",
          "🔍 Busque o Livro do Fogo começando pelo topo da pilha."
        );
      }, 1900);
    } else {
      setMensagem("Livro empilhado. O próximo também entrará no topo.");
    }
  }

  function buscarLivro(index) {
    if (etapa !== 2) return;

    if (index !== indiceBusca) {
      mostrarToast("error", "A busca precisa começar pelo topo da pilha.");
      setMensagem("A busca começa pelo topo da pilha.");
      return;
    }

    if (pilha[index].nome === "Livro do Fogo") {
      setEtapa(3);
      setMensagem("Livro do Fogo encontrado. Agora atualize o nome dele.");

      mostrarToast(
        "success",
        "Livro do Fogo encontrado! Clique nele para selecionar."
      );
      return;
    }

    mostrarToast("success", `${pilha[index].nome} foi verificado.`);
    setIndiceBusca(indiceBusca - 1);
    setMensagem(`${pilha[index].nome} foi verificado. Continue descendo.`);
  }

  function selecionarLivroParaAtualizar(index) {
    if (etapa !== 3) return;

    if (pilha[index].nome !== "Livro do Fogo") {
      mostrarToast("error", "Selecione o Livro do Fogo para atualizar.");
      setMensagem("Selecione o Livro do Fogo para atualizar.");
      return;
    }

    setIndiceSelecionado(index);
    setMensagem("Digite o novo nome e clique em Atualizar.");
    mostrarToast("success", "Livro selecionado. Agora digite o novo nome.");
  }

  function confirmarAtualizacao() {
    if (etapa !== 3) return;

    if (indiceSelecionado === null) {
      mostrarToast("error", "Primeiro clique no Livro do Fogo para selecionar.");
      setMensagem("Primeiro selecione o Livro do Fogo.");
      return;
    }

    if (novoNome.trim() === "") {
      mostrarToast("error", "Digite um novo nome antes de atualizar.");
      setMensagem("Digite um novo nome.");
      return;
    }

    const nomeAntigo = pilha[indiceSelecionado].nome;

    const novaPilha = pilha.map((livro, index) =>
      index === indiceSelecionado ? { ...livro, nome: novoNome.trim() } : livro
    );

    setPilha(novaPilha);
    setIndiceAtualizado(indiceSelecionado);
    setNovoNome("");
    setIndiceSelecionado(null);
    setEtapa(4);

    mostrarToast("success", `${nomeAntigo} foi atualizado com sucesso.`);
    setMensagem("Agora clique no livro que está no topo para removê-lo.");
  }

  function removerLivro(index) {
    if (etapa !== 4) return;

    const topo = pilha.length - 1;

    if (index !== topo) {
      mostrarToast("error", "Na pilha, apenas o livro do topo pode sair.");
      setMensagem("Na pilha, apenas quem está no topo pode ser removido.");
      return;
    }

    const removido = pilha[topo];
    const novaPilha = [...pilha.slice(0, -1), livroDesafio];

    setRemovidos([...removidos, removido]);
    setPilha(novaPilha);
    setEtapa(5);

    mostrarToast("success", `${removido.nome} foi removido. Livro das Sombras entrou no topo.`);
    setMensagem(
      "O Livro das Sombras acabou de entrar no topo da pilha. Qual livro sairá agora?"
    );
  }

  function responderDesafio(index) {
    if (etapa !== 5) return;

    if (index === pilha.length - 1) {
      setEtapa(6);
      setConcluido(true);
      setMensagem(
        "Parabéns! Você percebeu que o último livro colocado no topo é o primeiro a sair."
      );
      mostrarToast("success", "Fase concluída!");
    } else {
      mostrarToast("error", "Esse livro não está no topo.");
      setMensagem(
        "Na pilha, o último que entrou fica no topo e sai primeiro."
      );
    }
  }

  function clicarNaPilha(index) {
    if (!pilha[index]) return;

    if (etapa === 2) buscarLivro(index);
    if (etapa === 3) selecionarLivroParaAtualizar(index);
    if (etapa === 4) removerLivro(index);
    if (etapa === 5) responderDesafio(index);
  }

  function resetar() {
    setEtapa(1);
    setPilha([]);
    setDisponiveis(livrosIniciais);
    setRemovidos([]);
    setIndiceBusca(null);
    setNovoNome("");
    setIndiceSelecionado(null);
    setIndiceAtualizado(null);
    setConcluido(false);
    setMensagem("Clique em um livro para adicioná-lo ao topo da pilha.");
    mostrarToast("info", "🔄 Fase reiniciada.");
  }

  return (
    <div style={estilos.pagina}>
      <div style={estilos.container}>
        <Joyride
          steps={steps}
          run={runTour}
          continuous
          showSkipButton
          showProgress
          disableOverlayClose
          disableScrolling
          locale={{
            back: "Voltar",
            close: "Fechar",
            last: "Concluir",
            next: "Próximo",
            skip: "Pular",
          }}
          styles={{
            options: {
              zIndex: 3000,
              primaryColor: "#7c3aed",
              textColor: "#334155",
              overlayColor: "rgba(15, 23, 42, 0.65)",
              backgroundColor: "#ffffff",
              arrowColor: "#ffffff",
            },
            tooltip: {
              borderRadius: "22px",
              padding: "18px",
              boxShadow: "0 20px 45px rgba(15, 23, 42, 0.22)",
              border: "1px solid #e2e8f0",
            },
            tooltipContent: {
              padding: "10px 6px",
              fontSize: "14px",
              lineHeight: "1.6",
              fontWeight: "700",
            },
            spotlight: {
              borderRadius: "18px",
              boxShadow: "0 0 0 4px rgba(124, 58, 237, 0.25)",
            },
            buttonNext: {
              background: "linear-gradient(135deg, #7c3aed, #ec4899)",
              borderRadius: "999px",
              padding: "10px 18px",
              fontWeight: "900",
              fontSize: "13px",
            },
            buttonBack: {
              color: "#64748b",
              fontWeight: "900",
              fontSize: "13px",
            },
            buttonSkip: {
              color: "#ec4899",
              fontWeight: "900",
              fontSize: "13px",
            },
            buttonClose: {
              color: "#94a3b8",
            },
          }}
          callback={(data) => {
            if (data.status === "finished" || data.status === "skipped") {
              setRunTour(false);
            }
          }}
        />

        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={8}
          containerStyle={{ top: 70 }}
          toastOptions={{
            duration: 1800,
            style: {
              borderRadius: "14px",
              background: "#1e293b",
              color: "#fff",
              fontWeight: "700",
              fontSize: "13px",
              maxWidth: "320px",
              textAlign: "center",
            },
          }}
        />

        <header style={estilos.topo} className="tour-topo">
          <button onClick={voltar} style={estilos.botaoMapa}>
            <span style={estilos.setaVoltar}>←</span>
            <span>Mapa</span>
          </button>

          <h1 style={estilos.tituloTopo}>Biblioteca Perdida</h1>

          <div style={estilos.iconesTopo}>
            <button
              onClick={() => setMostrarHistoria(true)}
              style={estilos.botaoLivro}
            >
              📖
            </button>

            <button
              onClick={() => setMostrarDica(true)}
              style={estilos.botaoLuz}
            >
              💡
            </button>
          </div>
        </header>

        <section
          style={estilos.etapaCard}
          className="tour-etapa"
          onClick={() => setMostrarEtapas(!mostrarEtapas)}
        >
          <div>
            <span style={estilos.etapaNumero}>Etapa {etapa} de 6</span>
            <h2 style={estilos.etapaNome}>{etapas[etapa - 1]}</h2>
          </div>

          <span style={estilos.setaBaixo}>⌄</span>
        </section>

        {mostrarEtapas && (
          <div style={estilos.listaEtapas}>
            {etapas.map((nome, index) => (
              <div
                key={nome}
                style={
                  etapa === index + 1
                    ? estilos.etapaListaAtiva
                    : estilos.etapaListaItem
                }
              >
                {index + 1}. {nome}
              </div>
            ))}
          </div>
        )}

        <p style={estilos.mensagem} className="tour-mensagem">
          {mensagem}
        </p>

        {etapa === 3 && (
          <div style={estilos.formAtualizacao} className="tour-atualizar">
            <input
              value={novoNome}
              onChange={(e) => setNovoNome(e.target.value)}
              placeholder="Novo nome"
              style={estilos.input}
            />

            <button onClick={confirmarAtualizacao} style={estilos.botaoAtualizar}>
              Atualizar
            </button>
          </div>
        )}

        {disponiveis.length > 0 && (
          <section className="tour-livros">
            <h2 style={estilos.subtitulo}>Livros disponíveis</h2>

            <div style={estilos.livrosGrid}>
              {disponiveis.map((livro, index) => (
                <motion.button
                  key={livro.nome}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => adicionarLivro(index)}
                  style={estilos.cardLivro}
                >
                  <span style={estilos.iconeLivro}>{livro.icone}</span>
                  <span>{livro.nome}</span>
                </motion.button>
              ))}
            </div>
          </section>
        )}

        <section style={estilos.pilhaArea} className="tour-pilha">
          <h2 style={estilos.subtitulo}>Pilha de livros</h2>

          <div style={estilos.topoBase}>
            <span>Topo</span>
            <span>Base</span>
          </div>

          <div style={estilos.linhaColorida}></div>

          <div style={estilos.pilhaSlots}>
            {[3, 2, 1, 0].map((posicaoVisual) => {
              const livro = pilha[posicaoVisual];
              const topo = posicaoVisual === pilha.length - 1;

              return (
                <motion.button
                  key={posicaoVisual}
                  whileTap={{ scale: livro ? 0.95 : 1 }}
                  onClick={() => clicarNaPilha(posicaoVisual)}
                  style={{
                    ...estilos.slotPilha,
                    border:
                      livro && topo
                        ? "2px solid #ec4899"
                        : "2px dashed #cbd5e1",
                  }}
                >
                  {livro ? (
                    <>
                      <span style={estilos.iconePilha}>{livro.icone}</span>
                      <strong style={estilos.nomePilha}>{livro.nome}</strong>

                      {topo && <em style={estilos.tagRosa}>Topo</em>}

                      {etapa === 2 && posicaoVisual === indiceBusca && (
                        <em style={estilos.tagRoxa}>Verificar</em>
                      )}

                      {etapa === 3 && posicaoVisual === indiceSelecionado && (
                        <em style={estilos.tagVerde}>Selecionado</em>
                      )}

                      {etapa >= 4 && posicaoVisual === indiceAtualizado && (
                        <em style={estilos.tagVerde}>Atualizado</em>
                      )}
                    </>
                  ) : (
                    <>
                      <span style={estilos.numeroSlot}>{posicaoVisual + 1}</span>
                      <span style={estilos.textoSlot}>Nível {posicaoVisual + 1}</span>
                    </>
                  )}
                </motion.button>
              );
            })}
          </div>
        </section>

        {etapa >= 4 && (
          <section style={estilos.areaRemocao} className="tour-remocao">
            <div>
              <h2 style={estilos.subtituloRemovido}>Remoção</h2>
              <p style={estilos.textoRemocao}>
                Clique no livro do topo para remover.
              </p>
            </div>

            <div style={estilos.caixaRemovido}>
              {removidos.length === 0 ? (
                <span style={estilos.vazioRemovido}>Aguardando remoção</span>
              ) : (
                removidos.map((livro, index) => (
                  <div key={`${livro.nome}-${index}`} style={estilos.cardRemovido}>
                    <span>{livro.icone}</span>
                    <strong>{livro.nome}</strong>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        <section style={estilos.conceito} className="tour-conceito">
          <span style={estilos.iconeInfo}>i</span>

          <div>
            <p>Na pilha, quem entra por último é o primeiro a sair.</p>
            <strong>LIFO: Last In, First Out</strong>
          </div>
        </section>

        <div style={estilos.rodape} className="tour-resetar">
          <button onClick={resetar} style={estilos.botaoResetar}>
            ↻ Resetar
          </button>

          <button onClick={iniciarTutorial} style={estilos.botaoTutorial}>
            Ver tutorial
          </button>
        </div>

        {concluido && (
          <div style={estilos.fundoModal}>
            <div style={estilos.modal}>
              <h2 style={estilos.tituloConcluido}>🏆 Pilha concluída!</h2>
              <p>Você entendeu que o último livro empilhado sai primeiro.</p>

              <button onClick={concluir} style={estilos.botaoFechar}>
                Próxima fase
              </button>
            </div>
          </div>
        )}

        {mostrarHistoria && (
          <Modal fechar={fecharHistoria} titulo="📖 História">
            <p>Você chegou à Biblioteca Perdida do Reino dos Dados.</p>
            <p>
              Os livros mágicos precisam ser empilhados para liberar a próxima
              passagem do labirinto.
            </p>
            <strong>Quem entra por último, sai primeiro.</strong>
          </Modal>
        )}

        {mostrarDica && (
          <Modal fechar={() => setMostrarDica(false)} titulo="💡 Dica">
            <p>
              A pilha usa a regra <strong>LIFO</strong>.
            </p>
            <p>O último livro colocado será o primeiro removido.</p>
            <p>Novos livros sempre entram no topo da pilha.</p>
          </Modal>
        )}
      </div>
    </div>
  );
}

function Modal({ titulo, children, fechar }) {
  return (
    <div style={estilos.fundoModal}>
      <div style={estilos.modal}>
        <h2 style={estilos.tituloModal}>{titulo}</h2>
        <div style={estilos.modalTexto}>{children}</div>

        <button onClick={fechar} style={estilos.botaoFechar}>
          Entendi
        </button>
      </div>
    </div>
  );
}

const estilos = {
  pagina: {
    width: "100vw",
    minHeight: "100vh",
    background: "#f8fafc",
    display: "flex",
    justifyContent: "center",
    fontFamily: "'Inter', sans-serif",
    overflow: "hidden",
  },

container: {
  width: "100%",
  maxWidth: "430px",
  height: "100dvh",
  background: "white",
  padding: "0 10px 8px",
  boxSizing: "border-box",
  overflow: "hidden",
},
topo: {
  height: "54px",
  display: "grid",
  gridTemplateColumns: "1fr auto 1fr",
  alignItems: "center",
  borderBottom: "1px solid #e2e8f0",
  margin: "0 -10px 8px",
  padding: "0 14px",
  boxSizing: "border-box",
},

  botaoMapa: {
    border: "none",
    background: "transparent",
    color: "#1e293b",
    fontSize: "20px",
    fontWeight: "800",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: 0,
    cursor: "pointer",
  },

  setaVoltar: {
    fontSize: "28px",
    lineHeight: 1,
    fontWeight: "400",
  },

  tituloTopo: {
    margin: 0,
    color: "#1e293b",
    fontSize: "22px",
    fontWeight: "900",
    textAlign: "center",
    whiteSpace: "nowrap",
  },

  iconesTopo: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "18px",
  },

  botaoLivro: {
    border: "none",
    background: "transparent",
    color: "#7c3aed",
    fontSize: "25px",
    cursor: "pointer",
    padding: 0,
  },

  botaoLuz: {
    border: "none",
    background: "transparent",
    color: "#ec4899",
    fontSize: "25px",
    cursor: "pointer",
    padding: 0,
    filter: "drop-shadow(0 0 5px rgba(236,72,153,0.35))",
  },

etapaCard: {
  height: "48px",
  border: "1px solid #e2e8f0",
  borderRadius: "16px",
  padding: "6px 12px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "6px",
  boxShadow: "0 4px 10px rgba(15,23,42,0.04)",
  cursor: "pointer",
},

  etapaNumero: {
    color: "#64748b",
    fontSize: "13px",
    fontWeight: "700",
  },

  etapaNome: {
    margin: "2px 0 0",
    color: "#1e293b",
    fontSize: "22px",
    fontWeight: "900",
  },

  setaBaixo: {
    fontSize: "24px",
    color: "#1e293b",
    fontWeight: "900",
  },

  listaEtapas: {
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "6px",
    marginBottom: "8px",
    background: "white",
  },

  etapaListaItem: {
    padding: "6px 10px",
    fontSize: "12px",
    color: "#64748b",
    fontWeight: "700",
  },

  etapaListaAtiva: {
    padding: "6px 10px",
    fontSize: "12px",
    color: "#7c3aed",
    fontWeight: "900",
    background: "#ede9fe",
    borderRadius: "10px",
  },

mensagem: {
  margin: "0 0 6px",
  padding: "8px",
  borderRadius: "14px",
  background: "#f1f5f9",
  color: "#475569",
  textAlign: "center",
  fontSize: "11px",
  fontWeight: "700",
},

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

  subtitulo: {
    margin: "0 0 8px",
    color: "#1e293b",
    fontSize: "18px",
    fontWeight: "900",
  },

  livrosGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "8px",
    marginBottom: "12px",
  },

  cardLivro: {
    height: "58px",
    border: "none",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #7c3aed, #ec4899)",
    color: "white",
    fontSize: "9px",
    fontWeight: "900",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "2px",
    textAlign: "center",
    cursor: "pointer",
    padding: "3px",
  },

  iconeLivro: {
    fontSize: "20px",
  },

  pilhaArea: {
    marginTop: "6px",
  },

  topoBase: {
    display: "flex",
    justifyContent: "space-between",
    color: "#7c3aed",
    fontSize: "14px",
    fontWeight: "900",
  },

  linhaColorida: {
    height: "3px",
    background: "linear-gradient(90deg, #ec4899, #7c3aed)",
    margin: "4px 0 10px",
    borderRadius: "999px",
  },

  pilhaSlots: {
  display: "grid",
  gridTemplateRows: "repeat(4, 48px)",
  gap: "6px",
},

  slotPilha: {
    borderRadius: "16px",
    background: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    position: "relative",
    color: "#475569",
    padding: "4px",
    boxSizing: "border-box",
    cursor: "pointer",
  },

  numeroSlot: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "#e2e8f0",
    color: "#64748b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "17px",
    fontWeight: "900",
    marginRight: "8px",
  },

  textoSlot: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#64748b",
  },

  iconePilha: {
    fontSize: "24px",
    marginRight: "8px",
  },

  nomePilha: {
    fontSize: "12px",
    color: "#334155",
    lineHeight: "1.1",
  },

  tagRosa: {
    position: "absolute",
    right: "8px",
    top: "-8px",
    background: "#ec4899",
    color: "white",
    borderRadius: "999px",
    padding: "2px 6px",
    fontSize: "8px",
    fontStyle: "normal",
    fontWeight: "900",
  },

  tagRoxa: {
    position: "absolute",
    bottom: "-8px",
    background: "#7c3aed",
    color: "white",
    borderRadius: "999px",
    padding: "2px 6px",
    fontSize: "8px",
    fontStyle: "normal",
    fontWeight: "900",
  },

  tagVerde: {
    position: "absolute",
    bottom: "-8px",
    background: "#22c55e",
    color: "white",
    borderRadius: "999px",
    padding: "2px 6px",
    fontSize: "8px",
    fontStyle: "normal",
    fontWeight: "900",
  },

  areaRemocao: {
    marginTop: "6px",
    background: "#f8fafc",
    borderRadius: "14px",
    padding: "7px",
    display: "grid",
    gridTemplateColumns: "1fr 1.2fr",
    gap: "6px",
    alignItems: "center",
  },

  subtituloRemovido: {
    margin: "0 0 3px",
    color: "#1e293b",
    fontSize: "15px",
    fontWeight: "900",
  },

  textoRemocao: {
    margin: 0,
    color: "#64748b",
    fontSize: "11px",
    fontWeight: "700",
  },

  caixaRemovido: {
    minHeight: "54px",
    border: "2px dashed #ec4899",
    borderRadius: "14px",
    background: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    padding: "6px",
    boxSizing: "border-box",
  },

  vazioRemovido: {
    color: "#cbd5e1",
    fontSize: "11px",
    fontWeight: "800",
    textAlign: "center",
  },

  cardRemovido: {
    background: "#fdf2f8",
    color: "#be185d",
    borderRadius: "12px",
    padding: "6px",
    fontSize: "10px",
    fontWeight: "900",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },

  conceito: {
  marginTop: "6px",
  background: "#f8fafc",
  borderRadius: "14px",
  padding: "7px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  color: "#475569",
  fontSize: "10px",
  fontWeight: "700",
},

  iconeInfo: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    background: "#ede9fe",
    color: "#7c3aed",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
    fontSize: "18px",
    flexShrink: 0,
  },

  rodape: {
  marginTop: "6px",
  paddingTop: "6px",
  borderTop: "1px solid #e2e8f0",
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "6px",
},

  botaoResetar: {
  width: "100%",
  height: "34px",
  border: "1px solid #e2e8f0",
  borderRadius: "999px",
  background: "white",
  color: "#7c3aed",
  fontSize: "12px",
  fontWeight: "900",
  cursor: "pointer",
},

  botaoTutorial: {
  width: "100%",
  height: "34px",
  border: "none",
  borderRadius: "999px",
  background: "linear-gradient(135deg, #7c3aed, #ec4899)",
  color: "white",
  fontSize: "12px",
  fontWeight: "900",
  cursor: "pointer",
},

  fundoModal: {
    position: "fixed",
    inset: 0,
    background: "rgba(15,23,42,0.45)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 50,
  },

  modal: {
    width: "86%",
    maxWidth: "340px",
    background: "white",
    borderRadius: "22px",
    padding: "22px",
    textAlign: "center",
    color: "#475569",
    boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
  },

  tituloModal: {
    color: "#7c3aed",
    fontSize: "24px",
    fontWeight: "900",
    marginBottom: "12px",
  },

  tituloConcluido: {
    color: "#7c3aed",
    fontSize: "26px",
    fontWeight: "900",
    marginBottom: "12px",
  },

  modalTexto: {
    fontSize: "14px",
    lineHeight: "1.6",
  },

  botaoFechar: {
    width: "100%",
    height: "42px",
    border: "none",
    borderRadius: "14px",
    background: "#7c3aed",
    color: "white",
    fontWeight: "900",
    marginTop: "14px",
    cursor: "pointer",
  },
};

export default LabirintoPilha;