import { useState } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import * as ReactJoyride from "react-joyride";

const Joyride = ReactJoyride.default || ReactJoyride.Joyride;

function LabirintoFila({ voltar, concluir }) {
  const personagensIniciais = [
    { nome: "Mercador João", icone: "🎩" },
    { nome: "Arqueira Maria", icone: "🏹" },
    { nome: "Ferreira Ana", icone: "🔨" },
    { nome: "Mago Pedro", icone: "✨" },
  ];

  const etapas = [
    "Formar fila",
    "Buscar",
    "Atualizar",
    "Atender",
    "Desafio",
    "Conclusão",
  ];

  const [etapa, setEtapa] = useState(1);
  const [fila, setFila] = useState([]);
  const [disponiveis, setDisponiveis] = useState(personagensIniciais);
  const [atendidos, setAtendidos] = useState([]);

  const [indiceBusca, setIndiceBusca] = useState(0);
  const [novoNome, setNovoNome] = useState("");
  const [indiceSelecionado, setIndiceSelecionado] = useState(null);
  const [indiceAtualizado, setIndiceAtualizado] = useState(null);

  const [mostrarHistoria, setMostrarHistoria] = useState(true);
  const [mostrarDica, setMostrarDica] = useState(false);
  const [mostrarEtapas, setMostrarEtapas] = useState(false);
  const [concluido, setConcluido] = useState(false);
  const [runTour, setRunTour] = useState(false);

  const [mensagem, setMensagem] = useState(
    "Clique em um personagem para adicioná-lo ao final da fila."
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
        "Aqui aparece a etapa atual. Toque para visualizar todas as etapas da fase.",
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
        target: ".tour-personagens",
        content:
          "Clique nos personagens disponíveis para adicioná-los ao final da fila.",
        placement: "bottom",
      },
      {
        target: ".tour-fila",
        content:
          "Os personagens entram sempre no final da fila. O início será o primeiro a sair.",
        placement: "top",
      },
    ],
    2: [
      {
        target: ".tour-fila",
        content:
          "Agora você precisa buscar a Arqueira Maria. A busca deve começar pelo início da fila, sem pular posições.",
        placement: "top",
      },
    ],
    3: [
      {
        target: ".tour-fila",
        content:
          "Clique na Arqueira Maria para selecionar quem será atualizado.",
        placement: "top",
      },
      {
        target: ".tour-atualizar",
        content:
          "Depois de selecionar a personagem, digite o novo nome e clique em Atualizar.",
        placement: "bottom",
      },
    ],
    4: [
      {
        target: ".tour-fila",
        content:
          "Na etapa de atendimento, apenas o primeiro personagem da fila pode sair.",
        placement: "top",
      },
      {
        target: ".tour-atendimento",
        content:
          "Quando o primeiro personagem for atendido, ele aparecerá aqui para mostrar a remoção da fila.",
        placement: "top",
      },
    ],
    5: [
      {
        target: ".tour-fila",
        content:
          "Agora observe quem ficou no início da fila. Esse será o próximo a ser atendido.",
        placement: "top",
      },
    ],
    6: [
      {
        target: ".tour-conceito",
        content:
          "Parabéns! Você concluiu a fase e entendeu a regra FIFO: o primeiro que entra é o primeiro que sai.",
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
        "FIFO significa First In, First Out: o primeiro que entra é o primeiro que sai.",
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

  function adicionarPersonagem(index) {
    if (etapa !== 1) {
      mostrarToast("error", "Agora não é o momento de formar a fila.");
      return;
    }

    const personagem = disponiveis[index];
    const novaFila = [...fila, personagem];

    setFila(novaFila);
    setDisponiveis(disponiveis.filter((_, i) => i !== index));

    mostrarToast("success", `${personagem.nome} entrou no final da fila.`);

    if (novaFila.length === 4) {
      setEtapa(2);
      setIndiceBusca(0);
      setMensagem("Agora clique na fila em ordem até encontrar a Arqueira Maria.");

      setTimeout(() => {
        mostrarToast(
          "info",
          "🔍 Busque a Arqueira Maria começando pelo início da fila."
        );
      }, 1900);
    } else {
      setMensagem("Personagem adicionado ao final da fila.");
    }
  }

  function buscarPersonagem(index) {
    if (etapa !== 2) return;

    if (index !== indiceBusca) {
      mostrarToast("error", "A busca precisa começar pelo início da fila.");
      setMensagem("A busca começa pelo início da fila.");
      return;
    }

    if (fila[index].nome === "Arqueira Maria") {
      setEtapa(3);
      setMensagem("Arqueira Maria encontrada. Agora atualize o nome dela.");

      mostrarToast(
        "success",
        "Arqueira Maria encontrada! Clique nela para selecionar quem será atualizado."
      );
      return;
    }

    mostrarToast("success", `${fila[index].nome} foi verificado.`);
    setIndiceBusca(indiceBusca + 1);
    setMensagem(`${fila[index].nome} foi verificado. Continue em ordem.`);
  }

  function selecionarParaAtualizar(index) {
    if (etapa !== 3) return;

    if (fila[index].nome !== "Arqueira Maria") {
      mostrarToast("error", "Selecione a Arqueira Maria para atualizar.");
      setMensagem("Selecione a Arqueira Maria para atualizar.");
      return;
    }

    setIndiceSelecionado(index);
    setMensagem("Digite o novo nome e clique em Atualizar.");
    mostrarToast("success", "Personagem selecionada. Agora digite o novo nome.");
  }

  function confirmarAtualizacao() {
    if (indiceSelecionado === null) {
      mostrarToast("error", "Primeiro clique na Arqueira Maria para selecionar.");
      setMensagem("Primeiro selecione a Arqueira Maria.");
      return;
    }

    if (novoNome.trim() === "") {
      mostrarToast("error", "Digite um novo nome antes de atualizar.");
      setMensagem("Digite um novo nome.");
      return;
    }

    const nomeAntigo = fila[indiceSelecionado].nome;

    const novaFila = fila.map((p, index) =>
      index === indiceSelecionado ? { ...p, nome: novoNome.trim() } : p
    );

    setFila(novaFila);
    setIndiceAtualizado(indiceSelecionado);
    setNovoNome("");
    setIndiceSelecionado(null);
    setEtapa(4);

    mostrarToast("success", `${nomeAntigo} foi atualizado com sucesso.`);
    setMensagem("Agora clique no primeiro da fila para atendê-lo.");
  }

  function atenderPersonagem(index) {
    if (etapa !== 4) return;

    if (index !== 0) {
      mostrarToast(
        "error",
        "Na fila, apenas quem está no início pode ser atendido."
      );
      setMensagem("Na fila, apenas quem está no início pode ser atendido.");
      return;
    }

    const atendido = fila[0];

    setAtendidos([...atendidos, atendido]);
    setFila(fila.slice(1));
    setEtapa(5);

    mostrarToast("success", `${atendido.nome} foi atendido.`);
    setMensagem(`${atendido.nome} foi atendido. Agora responda: quem é o próximo?`);
  }

  function responderDesafio(index) {
    if (etapa !== 5) return;

    if (index === 0) {
      setEtapa(6);
      setConcluido(true);
      setMensagem("Parabéns! Você concluiu a fase da fila.");
      mostrarToast("success", "Fase concluída!");
    } else {
      mostrarToast("error", "O próximo é quem está no início da fila.");
      setMensagem("Observe o início da fila. O próximo é o primeiro.");
    }
  }

  function clicarNaFila(index) {
    if (!fila[index]) return;

    if (etapa === 2) buscarPersonagem(index);
    if (etapa === 3) selecionarParaAtualizar(index);
    if (etapa === 4) atenderPersonagem(index);
    if (etapa === 5) responderDesafio(index);
  }

  function resetar() {
    setEtapa(1);
    setFila([]);
    setDisponiveis(personagensIniciais);
    setAtendidos([]);
    setIndiceBusca(0);
    setNovoNome("");
    setIndiceSelecionado(null);
    setIndiceAtualizado(null);
    setConcluido(false);
    setMensagem("Clique em um personagem para adicioná-lo ao final da fila.");
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

          <h1 style={estilos.tituloTopo}>Fila do Mercado</h1>

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
          <section className="tour-personagens">
            <h2 style={estilos.subtitulo}>Personagens disponíveis</h2>

            <div style={estilos.personagensGrid}>
              {disponiveis.map((p, index) => (
                <motion.button
                  key={p.nome}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => adicionarPersonagem(index)}
                  style={estilos.cardPersonagem}
                >
                  <span style={estilos.iconePersonagem}>{p.icone}</span>
                  <span>{p.nome}</span>
                </motion.button>
              ))}
            </div>
          </section>
        )}

        <section style={estilos.filaArea} className="tour-fila">
          <h2 style={estilos.subtitulo}>Fila do mercado</h2>

          <div style={estilos.inicioFinal}>
            <span>Início</span>
            <span>Final</span>
          </div>

          <div style={estilos.linhaColorida}></div>

          <div style={estilos.filaSlots}>
            {[0, 1, 2, 3].map((posicao) => {
              const personagem = fila[posicao];

              return (
                <motion.button
                  key={posicao}
                  whileTap={{ scale: personagem ? 0.95 : 1 }}
                  onClick={() => clicarNaFila(posicao)}
                  style={{
                    ...estilos.slotFila,
                    border:
                      personagem && posicao === 0
                        ? "2px solid #ec4899"
                        : "2px dashed #cbd5e1",
                  }}
                >
                  {personagem ? (
                    <>
                      <span style={estilos.iconeFila}>{personagem.icone}</span>
                      <strong style={estilos.nomeFila}>{personagem.nome}</strong>

                      {etapa === 2 && posicao === indiceBusca && (
                        <em style={estilos.tagRoxa}>Verificar</em>
                      )}

                      {etapa === 3 && posicao === indiceSelecionado && (
                        <em style={estilos.tagVerde}>Selecionado</em>
                      )}

                      {etapa >= 4 && posicao === indiceAtualizado && (
                        <em style={estilos.tagVerde}>Atualizado</em>
                      )}
                    </>
                  ) : (
                    <>
                      <span style={estilos.numeroSlot}>{posicao + 1}</span>
                      <span style={estilos.textoSlot}>Posição {posicao + 1}</span>
                    </>
                  )}
                </motion.button>
              );
            })}
          </div>
        </section>

        {etapa >= 4 && (
          <section style={estilos.areaAtendimento} className="tour-atendimento">
            <div>
              <h2 style={estilos.subtituloAtendido}>Atendimento</h2>
              <p style={estilos.textoAtendimento}>
                Clique no primeiro da fila para atender.
              </p>
            </div>

            <div style={estilos.caixaAtendido}>
              {atendidos.length === 0 ? (
                <span style={estilos.vazioAtendido}>Aguardando atendimento</span>
              ) : (
                atendidos.map((p, index) => (
                  <div key={`${p.nome}-${index}`} style={estilos.cardAtendido}>
                    <span>{p.icone}</span>
                    <strong>{p.nome}</strong>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        <section style={estilos.conceito} className="tour-conceito">
          <span style={estilos.iconeInfo}>i</span>

          <div>
            <p>Na fila, quem entra primeiro é o primeiro a sair.</p>
            <strong>FIFO: First In, First Out</strong>
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
              <h2 style={estilos.tituloConcluido}>🏆 Fila concluída!</h2>
              <p>Você entendeu a regra FIFO.</p>

              <button onClick={concluir} style={estilos.botaoFechar}>
                Próxima fase
              </button>
            </div>
          </div>
        )}

        {mostrarHistoria && (
          <Modal fechar={fecharHistoria} titulo="📖 História">
            <p>Você chegou ao Mercado do Reino dos Dados.</p>
            <p>Os viajantes precisam formar uma fila para serem atendidos.</p>
            <strong>Quem chega primeiro, sai primeiro.</strong>
          </Modal>
        )}

        {mostrarDica && (
          <Modal fechar={() => setMostrarDica(false)} titulo="💡 Dica">
            <p>
              A fila usa a regra <strong>FIFO</strong>.
            </p>
            <p>O primeiro personagem que entra será o primeiro atendido.</p>
            <p>Novos personagens sempre entram no final da fila.</p>
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
    height: "100vh",
    background: "white",
    padding: "0 14px 10px",
    boxSizing: "border-box",
    overflow: "hidden",
  },

  topo: {
    height: "64px",
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr",
    alignItems: "center",
    borderBottom: "1px solid #e2e8f0",
    margin: "0 -14px 14px",
    padding: "0 18px",
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
    minHeight: "64px",
    border: "1px solid #e2e8f0",
    borderRadius: "20px",
    padding: "12px 18px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
    boxSizing: "border-box",
    boxShadow: "0 6px 14px rgba(15,23,42,0.04)",
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
    margin: "0 0 10px",
    padding: "12px",
    borderRadius: "18px",
    background: "#f1f5f9",
    color: "#475569",
    textAlign: "center",
    fontSize: "13px",
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

  personagensGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "8px",
    marginBottom: "12px",
  },

  cardPersonagem: {
    height: "76px",
    border: "none",
    borderRadius: "16px",
    background: "linear-gradient(135deg, #7c3aed, #ec4899)",
    color: "white",
    fontSize: "11px",
    fontWeight: "900",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "4px",
    textAlign: "center",
    cursor: "pointer",
    padding: "4px",
  },

  iconePersonagem: {
    fontSize: "25px",
  },

  filaArea: {
    marginTop: "6px",
  },

  inicioFinal: {
    display: "flex",
    justifyContent: "space-between",
    color: "#7c3aed",
    fontSize: "14px",
    fontWeight: "900",
  },

  linhaColorida: {
    height: "3px",
    background: "linear-gradient(90deg, #7c3aed, #ec4899)",
    margin: "4px 0 10px",
    borderRadius: "999px",
  },

  filaSlots: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "8px",
  },

  slotFila: {
    height: "96px",
    borderRadius: "16px",
    background: "white",
    display: "flex",
    flexDirection: "column",
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
    marginBottom: "6px",
  },

  textoSlot: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#64748b",
  },

  iconeFila: {
    fontSize: "24px",
  },

  nomeFila: {
    fontSize: "10px",
    color: "#334155",
    lineHeight: "1.1",
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

  areaAtendimento: {
    marginTop: "10px",
    background: "#f8fafc",
    borderRadius: "18px",
    padding: "10px",
    display: "grid",
    gridTemplateColumns: "1fr 1.2fr",
    gap: "8px",
    alignItems: "center",
  },

  subtituloAtendido: {
    margin: "0 0 3px",
    color: "#1e293b",
    fontSize: "15px",
    fontWeight: "900",
  },

  textoAtendimento: {
    margin: 0,
    color: "#64748b",
    fontSize: "11px",
    fontWeight: "700",
  },

  caixaAtendido: {
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

  vazioAtendido: {
    color: "#cbd5e1",
    fontSize: "11px",
    fontWeight: "800",
    textAlign: "center",
  },

  cardAtendido: {
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
    marginTop: "10px",
    background: "#f8fafc",
    borderRadius: "18px",
    padding: "10px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    color: "#475569",
    fontSize: "12px",
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
    marginTop: "10px",
    paddingTop: "8px",
    borderTop: "1px solid #e2e8f0",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px",
  },

  botaoResetar: {
    width: "100%",
    height: "40px",
    border: "1px solid #e2e8f0",
    borderRadius: "999px",
    background: "white",
    color: "#7c3aed",
    fontSize: "14px",
    fontWeight: "900",
    cursor: "pointer",
  },

  botaoTutorial: {
    width: "100%",
    height: "40px",
    border: "none",
    borderRadius: "999px",
    background: "linear-gradient(135deg, #7c3aed, #ec4899)",
    color: "white",
    fontSize: "14px",
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

export default LabirintoFila;