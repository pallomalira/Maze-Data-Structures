import { useState } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import * as ReactJoyride from "react-joyride";

const Joyride = ReactJoyride.default || ReactJoyride.Joyride;

function LabirintoLista({ voltar, concluir }) {
  const portaisIniciais = [
    { nome: "Portal Lua", icone: "🌙" },
    { nome: "Portal Fogo", icone: "🔥" },
    { nome: "Portal Água", icone: "💧" },
    { nome: "Portal Raio", icone: "⚡" },
  ];

  const etapas = [
    "Montar lista",
    "Buscar",
    "Atualizar",
    "Remover",
    "Desafio",
    "Conclusão",
  ];

  const [etapa, setEtapa] = useState(1);
  const [lista, setLista] = useState([]);
  const [disponiveis, setDisponiveis] = useState(portaisIniciais);
  const [removidos, setRemovidos] = useState([]);

  const [indiceBusca, setIndiceBusca] = useState(0);
  const [novoNome, setNovoNome] = useState("");
  const [indiceSelecionado, setIndiceSelecionado] = useState(null);
  const [indiceAtualizado, setIndiceAtualizado] = useState(null);
  const [indiceRespostaDesafio, setIndiceRespostaDesafio] = useState(null);

  const [mostrarHistoria, setMostrarHistoria] = useState(true);
  const [mostrarDica, setMostrarDica] = useState(false);
  const [mostrarEtapas, setMostrarEtapas] = useState(false);
  const [concluido, setConcluido] = useState(false);
  const [runTour, setRunTour] = useState(false);

  const [mensagem, setMensagem] = useState(
    "Clique em um portal para adicioná-lo ao final da lista."
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
        target: ".tour-portais",
        content:
          "Clique nos portais disponíveis para adicioná-los ao final da lista.",
        placement: "bottom",
      },
      {
        target: ".tour-lista",
        content:
          "Cada portal vira um nó. Um nó aponta para o próximo, formando a lista encadeada.",
        placement: "top",
      },
    ],
    2: [
      {
        target: ".tour-lista",
        content:
          "A busca na lista começa no primeiro nó e segue de um em um até encontrar o portal desejado.",
        placement: "top",
      },
    ],
    3: [
      {
        target: ".tour-lista",
        content:
          "Clique no Portal Água para selecionar o nó que será atualizado.",
        placement: "top",
      },
      {
        target: ".tour-atualizar",
        content:
          "Depois de selecionar o portal, digite o novo nome e clique em Atualizar.",
        placement: "bottom",
      },
    ],
    4: [
      {
        target: ".tour-lista",
        content:
          "Agora remova o portal atualizado. Em uma lista, remover um nó exige ajustar a ligação entre os nós vizinhos.",
        placement: "top",
      },
      {
        target: ".tour-remocao",
        content:
          "Quando um nó é removido, ele aparece aqui. A lista precisa continuar ligada.",
        placement: "top",
      },
    ],
    5: [
      {
        target: ".tour-lista",
        content:
          "Observe a lista restante e descubra qual portal precisou atualizar sua ligação.",
        placement: "top",
      },
    ],
    6: [
      {
        target: ".tour-conceito",
        content:
          "Parabéns! Você concluiu a fase e entendeu a lista encadeada.",
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
        "Na lista encadeada, cada nó guarda um valor e aponta para o próximo nó.",
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

  function adicionarPortal(index) {
    if (etapa !== 1) {
      mostrarToast("error", "Agora não é o momento de montar a lista.");
      return;
    }

    const portal = disponiveis[index];
    const novaLista = [...lista, portal];

    setLista(novaLista);
    setDisponiveis(disponiveis.filter((_, i) => i !== index));

    mostrarToast("success", `${portal.nome} entrou no final da lista.`);

    if (novaLista.length === 4) {
      setEtapa(2);
      setIndiceBusca(0);
      setMensagem("Agora busque o Portal Água começando pelo primeiro nó.");

      setTimeout(() => {
        mostrarToast(
          "info",
          "🔍 Busque o Portal Água seguindo nó por nó."
        );
      }, 1900);
    } else {
      setMensagem("Portal adicionado. O próximo entrará no final da lista.");
    }
  }

  function buscarPortal(index) {
    if (etapa !== 2) return;

    if (index !== indiceBusca) {
      mostrarToast("error", "A busca precisa seguir nó por nó.");
      setMensagem("Na lista encadeada, você precisa seguir a ordem dos nós.");
      return;
    }

    const atual = lista[index];

    if (atual.nome === "Portal Água") {
      setEtapa(3);
      setMensagem("Portal Água encontrado. Agora atualize esse portal.");
      mostrarToast("success", "Portal Água encontrado! Clique nele para selecionar.");
      return;
    }

    mostrarToast("success", `${atual.nome} foi verificado.`);
    setIndiceBusca(indiceBusca + 1);
    setMensagem(`${atual.nome} foi verificado. Continue para o próximo nó.`);
  }

  function selecionarPortalParaAtualizar(index) {
    if (etapa !== 3) return;

    if (lista[index].nome !== "Portal Água") {
      mostrarToast("error", "Selecione o Portal Água para atualizar.");
      setMensagem("Selecione o Portal Água para atualizar.");
      return;
    }

    setIndiceSelecionado(index);
    setMensagem("Digite o novo nome e clique em Atualizar.");
    mostrarToast("success", "Portal selecionado. Agora digite o novo nome.");
  }

  function confirmarAtualizacao() {
    if (etapa !== 3) return;

    if (indiceSelecionado === null) {
      mostrarToast("error", "Primeiro clique no Portal Água para selecionar.");
      setMensagem("Primeiro selecione o Portal Água.");
      return;
    }

    if (novoNome.trim() === "") {
      mostrarToast("error", "Digite um novo nome antes de atualizar.");
      setMensagem("Digite um novo nome.");
      return;
    }

    const novaLista = lista.map((portal, index) =>
      index === indiceSelecionado
        ? { ...portal, nome: novoNome.trim(), icone: "💎" }
        : portal
    );

    setLista(novaLista);
    setIndiceAtualizado(indiceSelecionado);
    setNovoNome("");
    setIndiceSelecionado(null);
    setEtapa(4);

    mostrarToast("success", "Portal atualizado com sucesso.");
    setMensagem(
      "O portal atualizado ficou instável. Agora clique nele para removê-lo da rota."
    );
  }

  function removerPortal(index) {
    if (etapa !== 4) return;

    if (index !== indiceAtualizado) {
      mostrarToast("error", "Remova o portal que foi atualizado.");
      setMensagem("Clique no portal atualizado para removê-lo da rota.");
      return;
    }

    const removido = lista[index];
    const novaLista = lista.filter((_, i) => i !== index);
    const resposta = index === 0 ? 0 : index - 1;

    setRemovidos([...removidos, removido]);
    setLista(novaLista);
    setIndiceRespostaDesafio(resposta);
    setEtapa(5);

    mostrarToast("success", `${removido.nome} foi removido.`);
    setMensagem(
      "O portal foi removido. Qual portal precisou atualizar sua ligação para a rota continuar funcionando?"
    );
  }

  function responderDesafio(index) {
    if (etapa !== 5) return;

    if (index === indiceRespostaDesafio) {
      setEtapa(6);
      setConcluido(true);
      setMensagem(
        "Parabéns! Você entendeu que, ao remover um nó, o nó anterior precisa apontar para o próximo."
      );
      mostrarToast("success", "Fase concluída!");
    } else {
      mostrarToast("error", "Esse não é o portal que ajustou a ligação.");
      setMensagem(
        "Pense na lista como uma corrente: quem estava antes do portal removido precisa apontar para quem veio depois."
      );
    }
  }

  function clicarPortal(index) {
    if (!lista[index]) return;

    if (etapa === 2) buscarPortal(index);
    if (etapa === 3) selecionarPortalParaAtualizar(index);
    if (etapa === 4) removerPortal(index);
    if (etapa === 5) responderDesafio(index);
  }

  function resetar() {
    setEtapa(1);
    setLista([]);
    setDisponiveis(portaisIniciais);
    setRemovidos([]);
    setIndiceBusca(0);
    setConcluido(false);
    setNovoNome("");
    setIndiceSelecionado(null);
    setIndiceAtualizado(null);
    setIndiceRespostaDesafio(null);
    setMensagem("Clique em um portal para adicioná-lo ao final da lista.");
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

          <h1 style={estilos.tituloTopo}>Corredor dos Portais</h1>

          <div style={estilos.iconesTopo}>
            <button onClick={() => setMostrarHistoria(true)} style={estilos.botaoLivro}>
              📖
            </button>

            <button onClick={() => setMostrarDica(true)} style={estilos.botaoLuz}>
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
          <section className="tour-portais">
            <h2 style={estilos.subtitulo}>Portais disponíveis</h2>

            <div style={estilos.portaisGrid}>
              {disponiveis.map((portal, index) => (
                <motion.button
                  key={portal.nome}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => adicionarPortal(index)}
                  style={estilos.cardPortal}
                >
                  <span style={estilos.iconePortal}>{portal.icone}</span>
                  <span>{portal.nome}</span>
                </motion.button>
              ))}
            </div>
          </section>
        )}

        <section style={estilos.listaArea} className="tour-lista">
          <h2 style={estilos.subtitulo}>Lista encadeada</h2>

          <div style={estilos.inicioFim}>
            <span>Início</span>
            <span>Final</span>
          </div>

          <div style={estilos.linhaColorida}></div>

          <div style={estilos.listaSlots}>
            {[0, 1, 2, 3].map((posicao) => {
              const portal = lista[posicao];

              return (
                <div key={posicao} style={estilos.itemComSeta}>
                  <motion.button
                    whileTap={{ scale: portal ? 0.95 : 1 }}
                    onClick={() => clicarPortal(posicao)}
                    style={{
                      ...estilos.slotLista,
                      border: definirBordaLista(
                        portal?.nome,
                        posicao,
                        etapa,
                        indiceBusca,
                        indiceSelecionado,
                        indiceAtualizado,
                        lista.length
                      ),
                    }}
                  >
                    {portal ? (
                      <>
                        {posicao === 0 && <span style={estilos.inicio}>INÍCIO</span>}

                        {etapa === 2 && posicao === indiceBusca && (
                          <span style={estilos.busca}>VERIFICAR</span>
                        )}

                        {etapa === 2 && posicao < indiceBusca && (
                          <span style={estilos.verificado}>VISTO</span>
                        )}

                        {etapa === 3 && portal.nome === "Portal Água" && (
                          <span style={estilos.busca}>ATUALIZAR</span>
                        )}

                        {etapa === 3 && posicao === indiceSelecionado && (
                          <span style={estilos.selecionado}>SELECIONADO</span>
                        )}

                        {etapa >= 4 && posicao === indiceAtualizado && (
                          <span style={estilos.atualizado}>ATUALIZADO</span>
                        )}

                        <span style={estilos.iconeLista}>{portal.icone}</span>
                        <strong style={estilos.nomeLista}>{portal.nome}</strong>
                        <span style={estilos.indice}>Nó {posicao + 1}</span>
                      </>
                    ) : (
                      <>
                        <span style={estilos.numeroSlot}>{posicao + 1}</span>
                        <span style={estilos.textoSlot}>Nó {posicao + 1}</span>
                      </>
                    )}
                  </motion.button>

                  {posicao < 3 && <span style={estilos.setaLista}>→</span>}
                </div>
              );
            })}
          </div>
        </section>

        {etapa >= 4 && (
          <section style={estilos.areaRemocao} className="tour-remocao">
            <div>
              <h2 style={estilos.subtituloRemovido}>Remoção</h2>
              <p style={estilos.textoRemocao}>
                Remova o portal atualizado.
              </p>
            </div>

            <div style={estilos.caixaRemovido}>
              {removidos.length === 0 ? (
                <span style={estilos.vazioRemovido}>Aguardando remoção</span>
              ) : (
                removidos.map((portal, index) => (
                  <div key={`${portal.nome}-${index}`} style={estilos.cardRemovido}>
                    <span>{portal.icone}</span>
                    <strong>{portal.nome}</strong>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        <section style={estilos.conceito} className="tour-conceito">
          <span style={estilos.iconeInfo}>i</span>

          <div>
            <p>Na lista, cada nó aponta para o próximo nó.</p>
            <strong>Lista Encadeada</strong>
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
              <h2 style={estilos.tituloConcluido}>🏆 Lista concluída!</h2>
              <p>Você entendeu que remover um nó exige ajustar a ligação da lista.</p>

              <button onClick={concluir} style={estilos.botaoFechar}>
                Próxima fase
              </button>
            </div>
          </div>
        )}

        {mostrarHistoria && (
          <Modal fechar={fecharHistoria} titulo="📖 História">
            <p>Você chegou ao Corredor dos Portais do Reino dos Dados.</p>
            <p>
              Cada portal aponta para o próximo. Para atravessar o corredor, é
              preciso seguir a sequência.
            </p>
            <strong>Um nó leva ao próximo nó.</strong>
          </Modal>
        )}

        {mostrarDica && (
          <Modal fechar={() => setMostrarDica(false)} titulo="💡 Dica">
            <p>
              A lista encadeada é formada por <strong>nós conectados</strong>.
            </p>
            <p>A busca começa no primeiro nó e segue um por um.</p>
            <p>Ao remover o início, o próximo nó vira o novo início.</p>
          </Modal>
        )}
      </div>
    </div>
  );
}

function definirBordaLista(
  nome,
  index,
  etapa,
  indiceBusca,
  indiceSelecionado,
  indiceAtualizado,
  tamanhoLista
) {
  if (etapa === 2 && index === indiceBusca) return "2px solid #ec4899";
  if (etapa === 3 && index === indiceSelecionado) return "2px solid #22c55e";
  if (etapa === 3 && nome === "Portal Água") return "2px solid #ec4899";
  if (etapa >= 4 && index === indiceAtualizado) return "2px solid #22c55e";
  if (etapa === 5 && index === 0 && tamanhoLista > 0) return "2px solid #ec4899";
  if (index === 0 && tamanhoLista > 0) return "2px solid #ec4899";
  return "2px dashed #cbd5e1";
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
    padding: "0 10px 24px",
    boxSizing: "border-box",
    overflowY: "auto",
    overflowX: "hidden",
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
    fontSize: "18px",
    fontWeight: "800",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: 0,
    cursor: "pointer",
  },

  setaVoltar: {
    fontSize: "26px",
    lineHeight: 1,
    fontWeight: "400",
  },

  tituloTopo: {
    margin: 0,
    color: "#1e293b",
    fontSize: "18px",
    fontWeight: "900",
    textAlign: "center",
    whiteSpace: "nowrap",
  },

  iconesTopo: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "14px",
  },

  botaoLivro: {
    border: "none",
    background: "transparent",
    fontSize: "23px",
    cursor: "pointer",
    padding: 0,
  },

  botaoLuz: {
    border: "none",
    background: "transparent",
    fontSize: "23px",
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
    fontSize: "11px",
    fontWeight: "700",
  },

  etapaNome: {
    margin: "1px 0 0",
    color: "#1e293b",
    fontSize: "18px",
    fontWeight: "900",
  },

  setaBaixo: {
    fontSize: "22px",
    color: "#1e293b",
    fontWeight: "900",
  },

  listaEtapas: {
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    padding: "5px",
    marginBottom: "6px",
    background: "white",
  },

  etapaListaItem: {
    padding: "5px 8px",
    fontSize: "11px",
    color: "#64748b",
    fontWeight: "700",
  },

  etapaListaAtiva: {
    padding: "5px 8px",
    fontSize: "11px",
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
    marginBottom: "8px",
    alignItems: "center",
  },

  input: {
    flex: 1,
    height: "36px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    padding: "0 10px",
    fontSize: "12px",
    minWidth: 0,
  },

  botaoAtualizar: {
    width: "110px",
    height: "36px",
    border: "none",
    borderRadius: "999px",
    background: "linear-gradient(135deg, #7c3aed, #ec4899)",
    color: "white",
    fontWeight: "900",
    fontSize: "12px",
    cursor: "pointer",
  },

  subtitulo: {
    margin: "0 0 5px",
    color: "#1e293b",
    fontSize: "15px",
    fontWeight: "900",
  },

  portaisGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "6px",
    marginBottom: "8px",
  },

  cardPortal: {
    height: "60px",
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

  iconePortal: {
    fontSize: "20px",
  },

  listaArea: {
    marginTop: "4px",
  },

  inicioFim: {
    display: "flex",
    justifyContent: "space-between",
    color: "#7c3aed",
    fontSize: "13px",
    fontWeight: "900",
  },

  linhaColorida: {
    height: "3px",
    background: "linear-gradient(90deg, #7c3aed, #ec4899)",
    margin: "4px 0 8px",
    borderRadius: "999px",
  },

  listaSlots: {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "6px",
  padding: "4px 0 8px",
},

  itemComSeta: {
  display: "flex",
  alignItems: "center",
  gap: "4px",
  minWidth: 0,
},

  slotLista: {
  width: "100%",
  height: "88px",
  borderRadius: "14px",
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

  iconeLista: {
    fontSize: "22px",
  },

  nomeLista: {
    fontSize: "8.5px",
    color: "#334155",
    lineHeight: "1",
  },

  indice: {
    fontSize: "8px",
    fontWeight: "bold",
    color: "#64748b",
    marginTop: "2px",
  },

  numeroSlot: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    background: "#e2e8f0",
    color: "#64748b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "15px",
    fontWeight: "900",
    marginBottom: "5px",
  },

  textoSlot: {
    fontSize: "10px",
    fontWeight: "700",
    color: "#64748b",
  },

  inicio: {
    position: "absolute",
    top: "-10px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#ec4899",
    color: "white",
    fontSize: "7px",
    padding: "2px 6px",
    borderRadius: "999px",
    fontWeight: "900",
  },

  busca: {
    position: "absolute",
    bottom: "-10px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#7c3aed",
    color: "white",
    fontSize: "7px",
    padding: "2px 6px",
    borderRadius: "999px",
    fontWeight: "900",
  },

  selecionado: {
    position: "absolute",
    bottom: "-10px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#22c55e",
    color: "white",
    fontSize: "7px",
    padding: "2px 6px",
    borderRadius: "999px",
    fontWeight: "900",
  },

  verificado: {
    position: "absolute",
    bottom: "-10px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#22c55e",
    color: "white",
    fontSize: "7px",
    padding: "2px 6px",
    borderRadius: "999px",
    fontWeight: "900",
  },

  atualizado: {
    position: "absolute",
    bottom: "-10px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#22c55e",
    color: "white",
    fontSize: "7px",
    padding: "2px 6px",
    borderRadius: "999px",
    fontWeight: "900",
  },

  setaLista: {
  fontSize: "13px",
  fontWeight: "900",
  color: "#7c3aed",
  flexShrink: 0,
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
    margin: "0 0 2px",
    color: "#1e293b",
    fontSize: "13px",
    fontWeight: "900",
  },

  textoRemocao: {
    margin: 0,
    color: "#64748b",
    fontSize: "10px",
    fontWeight: "700",
  },

  caixaRemovido: {
    minHeight: "46px",
    border: "2px dashed #ec4899",
    borderRadius: "12px",
    background: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "5px",
    padding: "5px",
  },

  vazioRemovido: {
    color: "#cbd5e1",
    fontSize: "10px",
    fontWeight: "800",
    textAlign: "center",
  },

  cardRemovido: {
    background: "#fdf2f8",
    color: "#be185d",
    borderRadius: "10px",
    padding: "5px",
    fontSize: "9px",
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
  padding: "10px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  gap: "6px",
  color: "#475569",
  fontSize: "10px",
  fontWeight: "700",
},

  iconeInfo: {
  width: "28px",
  height: "28px",
  borderRadius: "50%",
  background: "#ede9fe",
  color: "#7c3aed",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "900",
  fontSize: "15px",
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

export default LabirintoLista;