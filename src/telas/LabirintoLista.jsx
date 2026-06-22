import TopoFase from "../components/fase/TopoFase";
import Mensagem from "../components/fase/Mensagem";
import Etapa from "../components/fase/Etapa";
import ListaEtapas from "../components/fase/ListaEtapas";
import Modal from "../components/fase/Modal";
import Conceito from "../components/fase/Conceito";
import BotoesRodape from "../components/fase/BotoesRodape";
import FormAtualizacao from "../components/fase/FormAtualizacao";
import ToastConfig from "../components/fase/ToastConfig";
import TutorialJoyride from "../components/fase/TutorialJoyride";

import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

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
    "Monte a rota dos viajantes adicionando os portais ao final da lista."
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
          "Clique nos portais disponíveis para adicioná-los ao final da rota.",
        placement: "bottom",
      },
      {
        target: ".tour-lista",
        content:
          "Cada portal vira um nó. Um nó aponta para o próximo, formando uma lista encadeada.",
        placement: "top",
      },
    ],
    2: [
      {
        target: ".tour-lista",
        content:
          "A busca começa no primeiro portal e segue de um em um até encontrar o Portal Água.",
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
      mostrarToast("error", "Agora não é o momento de montar a rota.");
      return;
    }

    const portal = disponiveis[index];
    const novaLista = [...lista, portal];

    setLista(novaLista);
    setDisponiveis(disponiveis.filter((_, i) => i !== index));

    mostrarToast("success", `${portal.nome} entrou no final da rota.`);

    if (novaLista.length === 4) {
      setEtapa(2);
      setIndiceBusca(0);
      setMensagem(
        "Os viajantes precisam encontrar o Portal Água para seguir viagem. Busque começando pelo primeiro nó."
      );

      setTimeout(() => {
        mostrarToast("info", "🔍 Busque o Portal Água seguindo nó por nó.");
      }, 1900);
    } else {
      setMensagem("Portal adicionado. O próximo entrará no final da rota.");
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
      setMensagem(
        "Portal Água encontrado. Ele está instável e precisa ser atualizado antes da travessia."
      );
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
    setMensagem("Digite o novo nome do portal e clique em Atualizar.");
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
      "Mesmo atualizado, esse portal ficou instável e precisa ser removido da rota. Depois disso, a ligação entre os portais vizinhos deve continuar funcionando."
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
    setMensagem("Monte a rota dos viajantes adicionando os portais ao final da lista.");
    mostrarToast("info", "🔄 Fase reiniciada.");
  }

  return (
    <div style={estilos.pagina}>
      <div style={estilos.container}>
        <TutorialJoyride
          steps={steps}
          runTour={runTour}
          setRunTour={setRunTour}
        />

        <ToastConfig />

        <div className="tour-topo">
          <TopoFase
            titulo="Corredor dos Portais"
            voltar={voltar}
            abrirHistoria={() => setMostrarHistoria(true)}
            abrirDica={() => setMostrarDica(true)}
          />
        </div>

        <div className="tour-etapa">
          <Etapa
            etapa={etapa}
            totalEtapas={etapas.length}
            nomeEtapa={etapas[etapa - 1]}
            mostrarEtapas={mostrarEtapas}
            setMostrarEtapas={setMostrarEtapas}
          />
        </div>

        {mostrarEtapas && (
          <ListaEtapas etapas={etapas} etapaAtual={etapa} />
        )}

        <div className="tour-mensagem">
          <Mensagem texto={mensagem} />
        </div>

        {etapa === 3 && (
          <FormAtualizacao
            valor={novoNome}
            setValor={setNovoNome}
            confirmar={confirmarAtualizacao}
            placeholder="Novo nome"
          />
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

        <Conceito
          texto="Na lista, cada nó aponta para o próximo nó."
          conceito="Lista Encadeada"
        />

        <BotoesRodape
          resetar={resetar}
          iniciarTutorial={iniciarTutorial}
        />

        {concluido && (
          <Modal
            titulo="🏆 Lista concluída!"
            fechar={concluir}
            textoBotao="Próxima fase"
          >
            <p>Você entendeu que remover um nó exige ajustar a ligação da lista.</p>
          </Modal>
        )}

        {mostrarHistoria && (
          <Modal fechar={fecharHistoria} titulo="📖 História">
            <p>
              Depois de organizar os mapas na mochila, os viajantes chegaram ao
              Corredor dos Portais.
            </p>
            <p>
              Para seguir viagem, eles precisam atravessar os portais na ordem
              correta.
            </p>
            <p>
              Cada portal leva ao próximo, formando uma lista encadeada.
            </p>
            <strong>
              Se um portal for removido, o portal anterior precisa apontar para
              o próximo caminho.
            </strong>
          </Modal>
        )}

        {mostrarDica && (
          <Modal fechar={() => setMostrarDica(false)} titulo="💡 Dica">
            <p>
              A lista encadeada é formada por <strong>nós conectados</strong>.
            </p>
            <p>A busca começa no primeiro nó e segue um por um.</p>
            <p>
              Ao remover um nó do meio, o nó anterior precisa apontar para o próximo.
            </p>
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
};

export default LabirintoLista;