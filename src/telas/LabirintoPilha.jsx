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

function LabirintoPilha({ voltar, concluir }) {
  const itensIniciais = [
    { nome: "Mapa da Lua", icone: "🌙" },
    { nome: "Mapa do Fogo", icone: "🔥" },
    { nome: "Mapa da Água", icone: "💧" },
    { nome: "Mapa do Raio", icone: "⚡" },
  ];

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
  const [disponiveis, setDisponiveis] = useState(itensIniciais);
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
    "Guarde os mapas na mochila da expedição. Cada novo mapa entra no topo."
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
      content: "Aqui aparece a etapa atual da fase.",
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
          "Clique nos mapas disponíveis para guardá-los na mochila. Cada novo mapa fica no topo.",
        placement: "bottom",
      },
      {
        target: ".tour-pilha",
        content:
          "Essa é a pilha da mochila. O último mapa guardado fica por cima.",
        placement: "top",
      },
    ],
    2: [
      {
        target: ".tour-pilha",
        content:
          "Agora procure o Mapa do Fogo. Na pilha, a busca começa pelo topo.",
        placement: "top",
      },
    ],
    3: [
      {
        target: ".tour-pilha",
        content:
          "Clique no Mapa do Fogo para selecionar o item que será atualizado.",
        placement: "top",
      },
      {
        target: ".tour-atualizar",
        content:
          "Depois de selecionar o mapa, digite o novo nome e clique em Atualizar.",
        placement: "bottom",
      },
    ],
    4: [
      {
        target: ".tour-pilha",
        content:
          "Na pilha, apenas o mapa que está no topo pode ser removido.",
        placement: "top",
      },
      {
        target: ".tour-remocao",
        content:
          "Quando o mapa do topo for removido, ele aparecerá aqui.",
        placement: "top",
      },
    ],
    5: [
      {
        target: ".tour-pilha",
        content:
          "Remova os mapas do topo até chegar ao primeiro mapa guardado na mochila.",
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
      mostrarToast("error", "Agora não é o momento de guardar mapas.");
      return;
    }

    const item = disponiveis[index];
    const novaPilha = [...pilha, item];

    setPilha(novaPilha);
    setDisponiveis(disponiveis.filter((_, i) => i !== index));

    mostrarToast("success", `${item.nome} entrou no topo da mochila.`);

    if (novaPilha.length === 4) {
      setEtapa(2);
      setIndiceBusca(novaPilha.length - 1);
      setMensagem(
        "Os viajantes precisam consultar o Mapa do Fogo. Procure-o começando pelo topo da mochila."
      );

      setTimeout(() => {
        mostrarToast(
          "info",
          "🔍 Clique nos mapas em ordem, começando pelo topo."
        );
      }, 1800);
    } else {
      setMensagem("Mapa guardado. O próximo também entrará no topo.");
    }
  }

  function buscarLivro(index) {
    if (etapa !== 2) return;

    if (index !== indiceBusca) {
      mostrarToast("error", "A busca precisa começar pelo topo da pilha.");
      setMensagem("A busca começa pelo topo da mochila.");
      return;
    }

    if (pilha[index].nome === "Mapa do Fogo") {
      setEtapa(3);
      setMensagem(
        "Mapa do Fogo encontrado. Os viajantes perceberam uma informação incorreta nele. Atualize o nome do mapa."
      );

      mostrarToast(
        "success",
        "Mapa do Fogo encontrado! Clique nele para selecionar."
      );
      return;
    }

    mostrarToast("success", `${pilha[index].nome} foi verificado.`);
    setIndiceBusca(indiceBusca - 1);
    setMensagem(`${pilha[index].nome} foi verificado. Continue descendo.`);
  }

  function selecionarLivroParaAtualizar(index) {
    if (etapa !== 3) return;

    if (pilha[index].nome !== "Mapa do Fogo") {
      mostrarToast("error", "Selecione o Mapa do Fogo para atualizar.");
      setMensagem("Selecione o Mapa do Fogo para atualizar.");
      return;
    }

    setIndiceSelecionado(index);
    setMensagem("Digite o novo nome do mapa e clique em Atualizar.");
    mostrarToast("success", "Mapa selecionado. Agora digite o novo nome.");
  }

  function confirmarAtualizacao() {
    if (etapa !== 3) return;

    if (indiceSelecionado === null) {
      mostrarToast("error", "Primeiro clique no Mapa do Fogo para selecionar.");
      setMensagem("Primeiro selecione o Mapa do Fogo.");
      return;
    }

    if (novoNome.trim() === "") {
      mostrarToast("error", "Digite um novo nome antes de atualizar.");
      setMensagem("Digite um novo nome.");
      return;
    }

    const nomeAntigo = pilha[indiceSelecionado].nome;

    const novaPilha = pilha.map((item, index) =>
      index === indiceSelecionado ? { ...item, nome: novoNome.trim() } : item
    );

    setPilha(novaPilha);
    setIndiceAtualizado(indiceSelecionado);
    setNovoNome("");
    setIndiceSelecionado(null);
    setEtapa(4);

    mostrarToast("success", `${nomeAntigo} foi atualizado com sucesso.`);

    setMensagem(
      "Os mapas foram guardados um sobre o outro dentro da mochila.\n" +
        "\n" +
        "Como os mapas de baixo estão cobertos pelos de cima, só é possível retirar primeiro o mapa que está no topo.\n" +
        "\n" +
        "Observe a pilha e identifique qual mapa pode ser removido."
    );
  }

  function removerLivro(index) {
    if (etapa !== 4) return;

    const topo = pilha.length - 1;

    if (index !== topo) {
      mostrarToast("error", "Na pilha, apenas o mapa do topo pode sair.");
      setMensagem("Na pilha, apenas quem está no topo pode ser removido.");
      return;
    }

    const removido = pilha[topo];
    const novaPilha = pilha.slice(0, -1);

    setRemovidos([...removidos, removido]);
    setPilha(novaPilha);
    setEtapa(5);

    mostrarToast("success", `${removido.nome} foi removido.`);

    setMensagem(
      "Desafio: encontre o primeiro mapa guardado na mochila.\n\n" +
        "Para chegar até ele, remova os mapas do topo um por um, seguindo a regra LIFO."
    );
  }

  function responderDesafio(index) {
    if (etapa !== 5) return;

    const topo = pilha.length - 1;

    if (pilha.length === 1) {
      if (index === 0) {
        setEtapa(6);
        setConcluido(true);

        setMensagem(
          "Parabéns! Você encontrou o primeiro mapa guardado na mochila."
        );

        mostrarToast("success", "Você chegou ao mapa mais antigo da pilha!");
        return;
      }
    }

    if (index !== topo) {
      mostrarToast("error", "Você só pode remover o mapa que está no topo.");

      setMensagem("Na pilha, apenas o mapa que está no topo pode ser removido.");
      return;
    }

    const removido = pilha[topo];
    const novaPilha = pilha.slice(0, -1);

    setRemovidos([...removidos, removido]);
    setPilha(novaPilha);

    if (novaPilha.length === 1) {
      setMensagem(
        "Você chegou ao primeiro mapa guardado na mochila. Agora clique nele para recuperá-lo."
      );

      mostrarToast(
        "success",
        `${removido.nome} foi removido. Agora clique no mapa que sobrou.`
      );

      return;
    }

    setMensagem(
      "Continue removendo os mapas do topo até chegar ao primeiro mapa guardado."
    );

    mostrarToast("success", `${removido.nome} foi removido.`);
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
    setDisponiveis(itensIniciais);
    setRemovidos([]);
    setIndiceBusca(null);
    setNovoNome("");
    setIndiceSelecionado(null);
    setIndiceAtualizado(null);
    setConcluido(false);
    setMensagem(
      "Guarde os mapas na mochila. Cada novo mapa entra no topo."
    );
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
            titulo="Mochila da Expedição"
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
          <section className="tour-livros">
            <h2 style={estilos.subtitulo}>Mapas disponíveis</h2>

            <div style={estilos.livrosGrid}>
              {disponiveis.map((item, index) => (
                <motion.button
                  key={item.nome}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => adicionarLivro(index)}
                  style={estilos.cardLivro}
                >
                  <span style={estilos.iconeLivro}>{item.icone}</span>
                  <span>{item.nome}</span>
                </motion.button>
              ))}
            </div>
          </section>
        )}

        <section style={estilos.pilhaArea} className="tour-pilha">
          <h2 style={estilos.subtitulo}>Mochila de mapas</h2>

          <div style={estilos.topoBase}>
            <span>Topo</span>
            <span>Base</span>
          </div>

          <div style={estilos.linhaColorida}></div>

          <div style={estilos.pilhaSlots}>
            {[3, 2, 1, 0].map((posicaoVisual) => {
              const item = pilha[posicaoVisual];
              const topo = item && posicaoVisual === pilha.length - 1;
              const base = item && posicaoVisual === 0;

              return (
                <motion.button
                  key={posicaoVisual}
                  whileTap={{ scale: item ? 0.95 : 1 }}
                  onClick={() => clicarNaPilha(posicaoVisual)}
                  style={{
                    ...estilos.slotPilha,
                    border:
                      item &&
                      (topo ||
                        (etapa === 2 && posicaoVisual === indiceBusca))
                        ? "2px solid #ec4899"
                        : "2px dashed #cbd5e1",
                    background:
                      etapa === 2 && posicaoVisual === indiceBusca
                        ? "#fff7fb"
                        : "white",
                  }}
                >
                  {item ? (
                    <>
                      <span style={estilos.iconePilha}>{item.icone}</span>
                      <strong style={estilos.nomePilha}>{item.nome}</strong>

                      <div style={estilos.containerTags}>
                        {base && (
                          <em style={estilos.tagCinza}>Primeiro (Base)</em>
                        )}
                      </div>

                      {topo && <em style={estilos.tagRosa}>Último (Topo)</em>}

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
                      <span style={estilos.textoSlot}>
                        Nível {posicaoVisual + 1}
                      </span>
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
                Clique no mapa do topo para remover.
              </p>
            </div>

            <div style={estilos.caixaRemovido}>
              {removidos.length === 0 ? (
                <span style={estilos.vazioRemovido}>
                  Aguardando remoção
                </span>
              ) : (
                removidos.map((item, index) => (
                  <div key={`${item.nome}-${index}`} style={estilos.cardRemovido}>
                    <span>{item.icone}</span>
                    <strong>{item.nome}</strong>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        <Conceito
          texto="Na pilha, quem entra por último é o primeiro a sair."
          conceito="LIFO: Last In, First Out"
        />

        <BotoesRodape resetar={resetar} iniciarTutorial={iniciarTutorial} />

        {concluido && (
          <Modal
            titulo="🏆 Pilha concluída!"
            fechar={concluir}
            textoBotao="Próxima fase"
          >
            <p>
              Você descobriu que, para alcançar o primeiro mapa guardado, é
              necessário remover todos os mapas acima dele, seguindo a regra LIFO.
            </p>
          </Modal>
        )}

        {mostrarHistoria && (
          <Modal fechar={fecharHistoria} titulo="📖 História">
            <p>
              Depois de comprar os mantimentos no mercado, os viajantes chegaram
              ao acampamento da expedição.
            </p>
            <p>
              Para continuar a jornada, eles precisam organizar os mapas dentro
              de uma mochila especial.
            </p>
            <p>
              Essa mochila funciona como uma pilha: o último mapa guardado fica
              por cima e será o primeiro a sair.
            </p>
            <strong>Quem entra por último, sai primeiro.</strong>
          </Modal>
        )}

        {mostrarDica && (
          <Modal fechar={() => setMostrarDica(false)} titulo="💡 Dica">
            <p>
              A pilha usa a regra <strong>LIFO</strong>.
            </p>
            <p>O último item colocado será o primeiro removido.</p>
            <p>Novos mapas sempre entram no topo da mochila.</p>
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
    height: "100dvh",
    background: "white",
    padding: "0 10px 8px",
    boxSizing: "border-box",
    overflowY: "auto",
    overflowX: "hidden",
    paddingBottom: "120px",
  },

  containerTags: {
    position: "absolute",
    right: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "2px",
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

  tagCinza: {
    background: "#64748b",
    color: "white",
    fontSize: "8px",
    padding: "2px 6px",
    borderRadius: "4px",
    fontStyle: "normal",
    fontWeight: "bold",
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
};

export default LabirintoPilha;