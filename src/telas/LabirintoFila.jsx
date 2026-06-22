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

function LabirintoFila({ voltar, concluir }) {
  const personagensIniciais = [
    { id: 1, nome: "Luna", icone: "🧭" },
    { id: 2, nome: "Theo", icone: "🗺️" },
    { id: 3, nome: "Maya", icone: "🎒" },
    { id: 4, nome: "Gael", icone: "🏕️" },
  ];

  const viajanteDesafio = {
    id: 5,
    nome: "Sofia",
    icone: "🌙",
  };

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
  const [idAtualizado, setIdAtualizado] = useState(null);

  const [mostrarHistoria, setMostrarHistoria] = useState(true);
  const [mostrarDica, setMostrarDica] = useState(false);
  const [mostrarEtapas, setMostrarEtapas] = useState(false);
  const [concluido, setConcluido] = useState(false);
  const [runTour, setRunTour] = useState(false);

  const [mensagem, setMensagem] = useState(
    "Adicione os viajantes ao final da fila do mercado."
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
          "Clique nos viajantes disponíveis para adicioná-los ao final da fila.",
        placement: "bottom",
      },
      {
        target: ".tour-fila",
        content:
          "Na fila, quem entra primeiro fica no início e será atendido primeiro.",
        placement: "top",
      },
    ],
    2: [
      {
        target: ".tour-fila",
        content:
          "Theo esqueceu um item importante. Procure Theo começando pelo início da fila.",
        placement: "top",
      },
    ],
    3: [
      {
        target: ".tour-fila",
        content:
          "Clique em Theo para selecionar o viajante que terá a informação atualizada.",
        placement: "top",
      },
      {
        target: ".tour-atualizar",
        content:
          "Digite o novo nome ou correção e clique em Atualizar.",
        placement: "bottom",
      },
    ],
    4: [
      {
        target: ".tour-fila",
        content:
          "O mercado começou o atendimento. Apenas o primeiro da fila pode sair.",
        placement: "top",
      },
      {
        target: ".tour-atendimento",
        content:
          "O viajante atendido aparecerá aqui.",
        placement: "top",
      },
    ],
    5: [
      {
        target: ".tour-fila",
        content:
          "Sofia chegou atrasada e entrou no final. Observe quem será atendido primeiro.",
        placement: "top",
      },
    ],
    6: [
      {
        target: ".tour-conceito",
        content:
          "Parabéns! Você entendeu a regra FIFO: o primeiro que entra é o primeiro que sai.",
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
      setMensagem(
        "Os viajantes estão aguardando atendimento para comprar mantimentos.\n" +
          "\n" +
          " Theo comunicou que está com um problema. Procure onde ele está na fila."
      );

      setTimeout(() => {
        mostrarToast(
          "info",
          "🔍 Busque Theo começando pelo início da fila."
        );
      }, 2500);
    } else {
      setMensagem("Viajante adicionado ao final da fila.");
    }
  }

  function buscarPersonagem(index) {
    if (etapa !== 2) return;

    if (index !== indiceBusca) {
      mostrarToast("error", "A busca precisa começar pelo início da fila.");
      setMensagem("A busca começa pelo início da fila, sem pular posições.");
      return;
    }

    if (fila[index].nome === "Theo") {
      setEtapa(3);
      setMensagem(
        "Theo foi encontrado. Ele percebeu que seu nome foi registrado incorretamente e pediu a correção para evitar problemas durante a jornada.\n" +
          "Atualize o nome dele para registrar a correção."
      );

      mostrarToast(
        "success",
        "Theo encontrado! Clique nele para selecionar."
      );
      return;
    }

    mostrarToast("success", `${fila[index].nome} foi verificado.`);
    setIndiceBusca(indiceBusca + 1);
    setMensagem(`${fila[index].nome} foi verificado. Continue em ordem.`);
  }

  function selecionarParaAtualizar(index) {
    if (etapa !== 3) return;

    if (fila[index].nome !== "Theo") {
      mostrarToast("error", "Selecione Theo para atualizar.");
      setMensagem("Selecione Theo para atualizar a informação.");
      return;
    }

    setIndiceSelecionado(index);
    setMensagem("Digite a correção e clique em Atualizar.");
    mostrarToast("success", "Theo selecionado.");
  }

  function confirmarAtualizacao() {
    if (indiceSelecionado === null) {
      mostrarToast("error", "Primeiro clique em Theo para selecionar.");
      setMensagem("Primeiro selecione Theo.");
      return;
    }

    if (novoNome.trim() === "") {
      mostrarToast("error", "Digite uma informação antes de atualizar.");
      setMensagem("Digite uma informação para atualizar.");
      return;
    }

    const pessoaSelecionada = fila[indiceSelecionado];
    const nomeNovo = novoNome.trim();

    const novaFila = fila.map((pessoa, index) =>
      index === indiceSelecionado
        ? { ...pessoa, nome: nomeNovo }
        : pessoa
    );

    setFila(novaFila);
    setIdAtualizado(pessoaSelecionada.id);
    setNovoNome("");
    setIndiceSelecionado(null);
    setEtapa(4);

    mostrarToast("success", `${nomeNovo} foi atualizado com sucesso.`);
    setMensagem("O mercado começou o atendimento. Clique no primeiro da fila.");
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
    const novaFila = [...fila.slice(1), viajanteDesafio];

    setAtendidos([...atendidos, atendido]);
    setFila(novaFila);
    setEtapa(5);

    mostrarToast(
      "success",
      `${atendido.nome} foi atendido. Sofia entrou no final da fila.`
    );

    setMensagem(
      "Sofia chegou atrasada ao mercado e entrou no final da fila. Quem será atendido primeiro?"
    );
  }

  function responderDesafio(index) {
    if (etapa !== 5) return;

    if (index === 0) {
      setEtapa(6);
      setConcluido(true);
      setMensagem(
        "Parabéns! Você percebeu que quem já estava na fila será atendido antes de quem acabou de chegar."
      );
      mostrarToast("success", "Fase concluída!");
    } else {
      mostrarToast("error", "Esse viajante ainda precisa esperar a vez.");
      setMensagem(
        "Na fila, quem chega agora entra no final. Observe quem está no início."
      );
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
    setIdAtualizado(null);
    setConcluido(false);
    setMensagem("Adicione os viajantes ao final da fila do mercado.");
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
            titulo="Fila do Mercado"
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
          <section className="tour-personagens">
            <h2 style={estilos.subtitulo}>Viajantes disponíveis</h2>

            <div style={estilos.personagensGrid}>
              {disponiveis.map((p, index) => (
                <motion.button
                  key={p.id}
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

                      {etapa >= 4 && idAtualizado === personagem.id && (
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
                  <div key={`${p.id}-${index}`} style={estilos.cardAtendido}>
                    <span>{p.icone}</span>
                    <strong>{p.nome}</strong>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        <Conceito
          texto="Na fila, quem entra primeiro é o primeiro a sair."
          conceito="FIFO: First In, First Out"
        />

        <BotoesRodape
          resetar={resetar}
          iniciarTutorial={iniciarTutorial}
        />

        {concluido && (
          <Modal
            titulo="🏆 Fila concluída!"
            fechar={concluir}
            textoBotao="Próxima fase"
          >
            <p>
              Você entendeu que os viajantes são atendidos pela ordem de chegada.
            </p>
          </Modal>
        )}

        {mostrarHistoria && (
          <Modal fechar={fecharHistoria} titulo="📖 História">
            <p>
              Os viajantes estão se preparando para atravessar o Reino dos Dados.
            </p>
            <p>
              Antes de iniciar a jornada, eles precisam comprar mantimentos no
              Mercado Central.
            </p>
            <p>
              Como há várias pessoas esperando atendimento, o mercado organiza
              todos em uma fila.
            </p>
            <strong>
              Quem chega primeiro é atendido primeiro.
            </strong>
          </Modal>
        )}

        {mostrarDica && (
          <Modal fechar={() => setMostrarDica(false)} titulo="💡 Dica">
            <p>
              A fila usa a regra <strong>FIFO</strong>.
            </p>
            <p>O primeiro viajante que entra será o primeiro atendido.</p>
            <p>Novos viajantes sempre entram no final da fila.</p>
          </Modal>
        )}
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
};

export default LabirintoFila;