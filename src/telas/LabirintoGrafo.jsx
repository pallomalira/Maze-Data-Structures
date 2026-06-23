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

function LabirintoGrafo({ voltar, concluir, nomesViajantes }) {
  const nomeLuna = nomesViajantes?.luna || "Luna";
  const nomeTheo = nomesViajantes?.theo || "Theo";
  const nomeMaya = nomesViajantes?.maya || "Maya";
  const nomeGael = nomesViajantes?.gael || "Gael";
  const nomeSofia = nomesViajantes?.sofia || "Sofia";

  const personagensIniciais = [
    { id: "luna", nome: nomeLuna, icone: "🧭", papel: "Guia" },
    { id: "theo", nome: nomeTheo, icone: "🗺️", papel: "Estrategista" },
    { id: "maya", nome: nomeMaya, icone: "🎒", papel: "Exploradora" },
    { id: "gael", nome: nomeGael, icone: "🏕️", papel: "Aventureiro" },
    { id: "sofia", nome: nomeSofia, icone: "🌙", papel: "Curandeira" },
  ];

  const conexoesIniciais = [
    ["luna", "theo"],
    ["theo", "gael"],
    ["maya", "gael"],
    ["gael", "sofia"],
    ["maya", "sofia"],
  ];

  const caminhoBusca = ["luna", "theo", "gael"];

  const posicoes = {
    luna: { x: 210, y: 42 },
    theo: { x: 90, y: 135 },
    maya: { x: 330, y: 135 },
    gael: { x: 210, y: 225 },
    sofia: { x: 210, y: 325 },
  };

  const etapas = [
    "Formar rede",
    "Buscar caminho",
    "Atualizar vértice",
    "Remover vértice",
    "Remover ligação",
    "Vértice isolado",
    "Conclusão",
  ];

  const [etapa, setEtapa] = useState(1);
  const [vertices, setVertices] = useState([]);
  const [disponiveis, setDisponiveis] = useState(personagensIniciais);
  const [arestas, setArestas] = useState([]);
  const [removidos, setRemovidos] = useState([]);

  const [indiceBusca, setIndiceBusca] = useState(0);
  const [novoStatus, setNovoStatus] = useState("");
  const [idSelecionado, setIdSelecionado] = useState(null);
  const [idAtualizado, setIdAtualizado] = useState(null);
  const [idPonte, setIdPonte] = useState(null);

  const [concluido, setConcluido] = useState(false);
  const [mostrarHistoria, setMostrarHistoria] = useState(true);
  const [mostrarDica, setMostrarDica] = useState(false);
  const [mostrarEtapas, setMostrarEtapas] = useState(false);
  const [runTour, setRunTour] = useState(false);

  const [mensagem, setMensagem] = useState(
    "Clique nos viajantes para formar a rede. Cada viajante será um vértice."
  );

  const stepsBase = [
    {
      target: ".tour-topo",
      content: "Aqui você volta ao mapa, abre a história ou vê uma dica.",
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
        target: ".tour-personagens",
        content: "Clique nos viajantes. Cada pessoa adicionada vira um vértice.",
        placement: "bottom",
      },
      {
        target: ".tour-grafo",
        content: "As linhas entre os vértices são as arestas.",
        placement: "top",
      },
    ],
    2: [
      {
        target: ".tour-grafo",
        content: `Siga o caminho ${nomeLuna} → ${nomeTheo} → ${nomeGael} para entender busca em grafo.`,
        placement: "top",
      },
    ],
    3: [
      {
        target: ".tour-atualizar",
        content:
          "Atualizar um vértice altera seus dados, mas mantém suas conexões.",
        placement: "bottom",
      },
    ],
    4: [
      {
        target: ".tour-grafo",
        content: `Remova ${nomeGael} e observe que as arestas ligadas a ele desaparecem.`,
        placement: "top",
      },
    ],
    5: [
      {
        target: ".tour-grafo",
        content: `${nomeTheo} recebeu a missão de levar uma mensagem ao Reino Central. Remova esse vértice e observe quem fica isolado.`,
        placement: "top",
      },
    ],
    6: [
      {
        target: ".tour-grafo",
        content: "Clique no vértice que ficou sem nenhuma conexão.",
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
        "Grafo é formado por vértices e arestas. Vértices são pontos. Arestas são conexões.",
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
    setTimeout(() => setRunTour(true), 100);
  }

  function fecharHistoria() {
    setMostrarHistoria(false);
    setTimeout(() => iniciarTutorial(), 400);
  }

  function criarArestas(verticesAtuais) {
    const ids = verticesAtuais.map((v) => v.id);

    return conexoesIniciais.filter(
      ([origem, destino]) => ids.includes(origem) && ids.includes(destino)
    );
  }

  function estaConectado(id, listaArestas = arestas) {
    return listaArestas.some(
      ([origem, destino]) => origem === id || destino === id
    );
  }

  function obterVerticesIsolados(
    listaVertices = vertices,
    listaArestas = arestas
  ) {
    return listaVertices.filter(
      (vertice) => !estaConectado(vertice.id, listaArestas)
    );
  }

  function adicionarPersonagem(index) {
    if (etapa !== 1) {
      mostrarToast("error", "Agora não é o momento de formar a rede.");
      return;
    }

    const personagem = disponiveis[index];
    const novosVertices = [...vertices, personagem];

    setVertices(novosVertices);
    setDisponiveis(disponiveis.filter((_, i) => i !== index));
    setArestas(criarArestas(novosVertices));

    if (novosVertices.length === personagensIniciais.length) {
      setEtapa(2);
      setIndiceBusca(0);
      setMensagem(
        `A rede foi formada. Agora siga um caminho pela rede: ${nomeLuna} → ${nomeTheo} → ${nomeGael}.`
      );
      mostrarToast("success", "Rede formada! Siga o caminho indicado.");
    } else {
      setMensagem(
        "Viajante adicionado. Conforme novos vértices entram, as conexões aparecem."
      );
      mostrarToast("success", `${personagem.nome} entrou na rede.`);
    }
  }

  function buscarVertice(index) {
    if (etapa !== 2) return;

    const vertice = vertices[index];
    const esperado = caminhoBusca[indiceBusca];

    if (vertice.id !== esperado) {
      const esperadoNome =
        personagensIniciais.find((p) => p.id === esperado)?.nome ||
        "o próximo vértice";

      mostrarToast("error", `Caminho errado. Clique em ${esperadoNome}.`);
      setMensagem(
        `Na busca em grafo, você deve seguir as conexões. Agora clique em ${esperadoNome}.`
      );
      return;
    }

    if (vertice.id === "gael") {
      setEtapa(3);
      setMensagem(
        `${nomeGael} foi encontrado. Agora atualize a função desse vértice.`
      );
      mostrarToast(
        "success",
        `${nomeGael} encontrado! Clique nele para selecionar.`
      );
      return;
    }

    setIndiceBusca(indiceBusca + 1);
    setMensagem(`${vertice.nome} foi verificado. Continue seguindo a conexão.`);
    mostrarToast("success", `${vertice.nome} verificado.`);
  }

  function selecionarParaAtualizar(index) {
    if (etapa !== 3) return;

    const vertice = vertices[index];

    if (vertice.id !== "gael") {
      mostrarToast("error", `Selecione ${nomeGael} para atualizar.`);
      setMensagem(`Clique em ${nomeGael} para atualizar a função desse vértice.`);
      return;
    }

    setIdSelecionado(vertice.id);
    setMensagem(
      `${nomeGael} selecionado. Digite uma nova função para ele e clique em Atualizar.`
    );
    mostrarToast("success", `${nomeGael} selecionado.`);
  }

  function confirmarAtualizacao() {
    if (etapa !== 3) return;

    if (idSelecionado !== "gael") {
      mostrarToast("error", `Primeiro selecione ${nomeGael}.`);
      setMensagem(`Primeiro clique em ${nomeGael} para selecionar o vértice.`);
      return;
    }

    if (novoStatus.trim() === "") {
      mostrarToast("error", "Digite uma nova função.");
      setMensagem("Digite uma função para atualizar o vértice.");
      return;
    }

    const novosVertices = vertices.map((v) =>
      v.id === "gael" ? { ...v, papel: novoStatus.trim() } : v
    );

    setVertices(novosVertices);
    setIdAtualizado("gael");
    setIdSelecionado(null);
    setNovoStatus("");
    setEtapa(4);

    mostrarToast("success", `Função de ${nomeGael} atualizada.`);
    setMensagem(
      `${nomeGael} recebeu uma nova função na expedição. Agora ele seguirá por outro caminho. Remova o vértice ${nomeGael} e observe que as arestas ligadas a ele também desaparecem.`
    );
  }

  function removerVertice(id) {
    const removido = vertices.find((v) => v.id === id);
    if (!removido) return null;

    const novosVertices = vertices.filter((v) => v.id !== id);

    const novasArestas = arestas.filter(
      ([origem, destino]) => origem !== id && destino !== id
    );

    setVertices(novosVertices);
    setArestas(novasArestas);
    setRemovidos((anteriores) => [...anteriores, removido]);

    return { removido, novosVertices, novasArestas };
  }

  function removerGael(index) {
    if (etapa !== 4) return;

    const vertice = vertices[index];

    if (vertice.id !== "gael") {
      mostrarToast("error", `Remova ${nomeGael}.`);
      setMensagem(`Clique em ${nomeGael} para remover esse vértice da rede.`);
      return;
    }

    removerVertice("gael");
    setIdAtualizado(null);
    setIdPonte("theo");
    setEtapa(5);

    mostrarToast("success", `${nomeGael} foi removido da rede.`);
    setMensagem(
    `${nomeGael} saiu da rede e suas arestas desapareceram.\n\n` +
    `${nomeTheo} recebeu a missão de levar uma mensagem urgente ao Reino Central e precisará deixar a expedição temporariamente.\n\n` +
    `Durante esse período, ${nomeLuna} ficará sem sua única conexão na rede.\n\n` +
    `Remova ${nomeTheo} da rede.`
    );
  }

  function removerTheo(index) {
    if (etapa !== 5) return;

    const vertice = vertices[index];

    if (vertice.id !== "theo") {
      mostrarToast("error", `Remova ${nomeTheo}.`);
      setMensagem(
        `Clique em ${nomeTheo}. Depois da saída de ${nomeGael}, ele é a única conexão que ainda resta para ${nomeLuna}.`
      );
      return;
    }

    const resultado = removerVertice("theo");
    setIdPonte(null);
    setEtapa(6);

    const novosVertices = resultado?.novosVertices || [];
    const novasArestas = resultado?.novasArestas || [];
    const isolados = obterVerticesIsolados(novosVertices, novasArestas);

    if (isolados.length > 0) {
      setMensagem(
      `${nomeTheo} deixou a rede para levar a mensagem ao Reino Central.\n\n` +
        `Agora descubra qual viajante perdeu sua última conexão e ficou sem nenhuma aresta ligada.`
    );
    } else {
      setMensagem(`${nomeTheo} foi removido. Nenhum vértice ficou isolado.`);
    }

    mostrarToast("success", `${nomeTheo} foi removido. Observe a rede.`);
  }

  function responderObservacao(index) {
    if (etapa !== 6) return;

    const vertice = vertices[index];
    const isolados = obterVerticesIsolados();
    const idsIsolados = isolados.map((v) => v.id);

    if (idsIsolados.includes(vertice.id)) {
      setEtapa(7);
      setConcluido(true);

     setMensagem(
        `${vertice.nome} ficou isolada.\n\n` +
          `Depois que ${nomeGael} deixou a rede, ${nomeLuna} permaneceu conectada apenas a ${nomeTheo}.\n\n` +
          `Quando ${nomeTheo} saiu para levar a mensagem ao Reino Central, essa última conexão desapareceu.\n\n` +
          `Por isso, ${nomeLuna} ficou sem nenhuma aresta ligada a ela, tornando-se um vértice isolado.`
      );

      mostrarToast("success", "Correto! Esse vértice ficou isolado.");
      return;
    }

    mostrarToast("error", `${vertice.nome} ainda possui conexão.`);
    setMensagem(
      `${vertice.nome} não está isolado. Procure quem não possui nenhuma linha ligada.`
    );
  }

  function clicarVertice(index) {
    if (!vertices[index]) return;

    if (etapa === 2) buscarVertice(index);
    if (etapa === 3) selecionarParaAtualizar(index);
    if (etapa === 4) removerGael(index);
    if (etapa === 5) removerTheo(index);
    if (etapa === 6) responderObservacao(index);
  }

  function resetar() {
    setEtapa(1);
    setVertices([]);
    setDisponiveis(personagensIniciais);
    setArestas([]);
    setRemovidos([]);
    setIndiceBusca(0);
    setNovoStatus("");
    setIdSelecionado(null);
    setIdAtualizado(null);
    setIdPonte(null);
    setConcluido(false);
    setMostrarHistoria(true);
    setMensagem(
      "Clique nos viajantes para formar a rede. Cada viajante será um vértice."
    );
    mostrarToast("info", "🔄 Fase reiniciada.");
  }

  function renderGrafo() {
    const altura = vertices.length <= 3 ? 260 : 390;
    const isolados = obterVerticesIsolados();
    const idsIsolados = isolados.map((v) => v.id);

    return (
      <svg width="100%" height={altura} viewBox="0 0 420 390">
        {arestas.map(([origem, destino], i) => (
          <line
            key={i}
            x1={posicoes[origem].x}
            y1={posicoes[origem].y}
            x2={posicoes[destino].x}
            y2={posicoes[destino].y}
            stroke="#818cf8"
            strokeWidth="3"
            strokeLinecap="round"
          />
        ))}

        {vertices.map((local, index) => {
          const pos = posicoes[local.id];
          if (!pos) return null;

          const esperado = caminhoBusca[indiceBusca];

          const verificar = etapa === 2 && local.id === esperado;
          const visto =
            etapa === 2 && caminhoBusca.slice(0, indiceBusca).includes(local.id);
          const atualizar =
            etapa === 3 && local.id === "gael" && idSelecionado !== local.id;
          const selecionado = etapa === 3 && idSelecionado === local.id;
          const atualizado = idAtualizado === local.id;
          const ligacao = idPonte === local.id;
          const isolado = etapa === 6 && idsIsolados.includes(local.id);
          const conectado = etapa === 6 && !idsIsolados.includes(local.id);

          return (
            <foreignObject
              key={local.id}
              x={pos.x - 38}
              y={pos.y - 31}
              width="76"
              height="78"
            >
              <motion.div
                whileTap={{ scale: 0.95 }}
                onClick={() => clicarVertice(index)}
                style={{
                  ...estilos.vertice,
                  border:
                    verificar ||
                    atualizar ||
                    selecionado ||
                    atualizado ||
                    ligacao ||
                    isolado
                      ? "2px solid #ec4899"
                      : "2px solid #818cf8",
                  cursor: etapa >= 2 && etapa <= 6 ? "pointer" : "default",
                }}
              >
                {verificar && <span style={estilos.busca}>VERIFICAR</span>}
                {visto && <span style={estilos.verificado}>VISTO</span>}
                {atualizar && <span style={estilos.busca}>ATUALIZAR</span>}
                {selecionado && <span style={estilos.selecionado}>SELEC.</span>}
                {atualizado && <span style={estilos.atualizado}>ATUALIZADO</span>}
                {ligacao && <span style={estilos.infectado}>LIGAÇÃO</span>}
                {isolado && <span style={estilos.infectado}>ISOLADO</span>}
                {conectado && <span style={estilos.verificado}>CONECTADO</span>}

                <span style={estilos.avatarVertice}>{local.icone}</span>
                <span style={estilos.nomeVertice}>{local.nome}</span>
                <span style={estilos.papelVertice}>{local.papel}</span>
              </motion.div>
            </foreignObject>
          );
        })}
      </svg>
    );
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
            titulo="Rede da Expedição"
            voltar={voltar}
            abrirHistoria={() => setMostrarHistoria(true)}
            abrirDica={() => setMostrarDica(true)}
          />
        </div>

        <div className="tour-etapa">
          <Etapa
            etapa={etapa}
            totalEtapas={7}
            nomeEtapa={etapas[etapa - 1]}
            mostrarEtapas={mostrarEtapas}
            setMostrarEtapas={setMostrarEtapas}
          />
        </div>

        {mostrarEtapas && <ListaEtapas etapas={etapas} etapaAtual={etapa} />}

        <div className="tour-mensagem">
          <Mensagem texto={mensagem} />
        </div>

        {etapa === 3 && (
          <FormAtualizacao
            valor={novoStatus}
            setValor={setNovoStatus}
            confirmar={confirmarAtualizacao}
            placeholder="Nova função"
          />
        )}

        {disponiveis.length > 0 && (
          <section className="tour-personagens">
            <h2 style={estilos.subtitulo}>Viajantes disponíveis</h2>

            <div style={estilos.personagensGrid}>
              {disponiveis.map((personagem, index) => (
                <motion.button
                  key={personagem.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => adicionarPersonagem(index)}
                  style={estilos.cardPersonagem}
                >
                  <span style={estilos.iconePersonagem}>{personagem.icone}</span>
                  <span>{personagem.nome}</span>
                </motion.button>
              ))}
            </div>
          </section>
        )}

        <section style={estilos.grafoArea} className="tour-grafo">
          <h2 style={estilos.subtitulo}>Grafo da rede</h2>

          <div style={estilos.grafoBox}>
            {vertices.length === 0 ? (
              <span style={estilos.vazio}>A rede aparecerá aqui</span>
            ) : (
              renderGrafo()
            )}
          </div>
        </section>

        {etapa >= 4 && (
          <section style={estilos.areaRemocao} className="tour-remocao">
            <div>
              <h2 style={estilos.subtituloRemovido}>Remoções</h2>
              <p style={estilos.textoRemocao}>
                Remover um vértice apaga suas arestas.
              </p>
            </div>

            <div style={estilos.caixaRemovido}>
              {removidos.length === 0 ? (
                <span style={estilos.vazioRemovido}>Nenhum removido</span>
              ) : (
                removidos.map((p) => (
                  <div key={p.id} style={estilos.cardRemovido}>
                    <span>{p.icone}</span>
                    <strong>{p.nome}</strong>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        <Conceito
          texto="Em um grafo, os pontos são vértices e as linhas são arestas."
          conceito="Vértice isolado: existe, mas não possui conexão."
        />

        <BotoesRodape resetar={resetar} iniciarTutorial={iniciarTutorial} />

        {concluido && (
          <Modal
            titulo="🏆 Grafo concluído!"
            fechar={concluir}
            textoBotao="Próxima fase"
          >
            <p>
              Você entendeu que um vértice pode continuar existindo no grafo,
              mesmo sem nenhuma aresta ligada a ele.
            </p>
          </Modal>
        )}

        {mostrarHistoria && (
          <Modal fechar={fecharHistoria} titulo="📖 História">
            <p>
              Depois de sair do Hospital dos Dados, os viajantes precisam se
              organizar para continuar a jornada.
            </p>
            <p>
              Para entender as conexões do grupo, eles montam uma rede de
              comunicação.
            </p>
            <p>
              Cada viajante é um vértice. Cada ligação entre dois viajantes é
              uma aresta.
            </p>
            <strong>
              Se um vértice perde todas as arestas, ele fica isolado.
            </strong>
          </Modal>
        )}

        {mostrarDica && (
          <Modal fechar={() => setMostrarDica(false)} titulo="💡 Dica">
            <p>
              Um <strong>vértice</strong> é um ponto do grafo.
            </p>
            <p>
              Uma <strong>aresta</strong> é uma conexão entre dois vértices.
            </p>
            <p>
              Um <strong>caminho</strong> é uma sequência de vértices conectados.
            </p>
            <p>
              Um <strong>vértice isolado</strong> não possui nenhuma aresta.
            </p>
          </Modal>
        )}
      </div>
    </div>
  );
}

const etiquetaBase = {
  position: "absolute",
  bottom: "-11px",
  left: "50%",
  transform: "translateX(-50%)",
  color: "white",
  fontSize: "6.5px",
  padding: "2px 5px",
  borderRadius: "999px",
  fontWeight: "900",
};

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
    padding: "0 10px 90px",
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

  personagensGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "5px",
    marginBottom: "8px",
  },

  cardPersonagem: {
    height: "58px",
    border: "none",
    borderRadius: "13px",
    background: "linear-gradient(135deg, #7c3aed, #ec4899)",
    color: "white",
    fontSize: "8px",
    fontWeight: "900",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "1px",
    textAlign: "center",
    cursor: "pointer",
    padding: "3px",
  },

  iconePersonagem: {
    fontSize: "18px",
  },

  grafoArea: {
    marginTop: "4px",
  },

  grafoBox: {
    minHeight: "260px",
    border: "2px dashed #cbd5e1",
    borderRadius: "16px",
    background: "white",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    overflow: "hidden",
  },

  vertice: {
    width: "72px",
    height: "62px",
    background: "rgba(129,140,248,0.12)",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    padding: "4px",
    boxSizing: "border-box",
  },

  avatarVertice: {
    fontSize: "15px",
  },

  nomeVertice: {
    fontSize: "8px",
    fontWeight: "900",
    color: "#475569",
    textAlign: "center",
    lineHeight: "1",
  },

  papelVertice: {
    fontSize: "8px",
    color: "#64748b",
    fontWeight: "800",
    marginTop: "2px",
    marginBottom: "15px",
  },

  busca: {
    ...etiquetaBase,
    background: "#7c3aed",
  },

  selecionado: {
    ...etiquetaBase,
    background: "#22c55e",
  },

  verificado: {
    ...etiquetaBase,
    background: "#22c55e",
  },

  atualizado: {
    ...etiquetaBase,
    background: "#22c55e",
  },

  infectado: {
    ...etiquetaBase,
    background: "#ec4899",
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
    flexWrap: "wrap",
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

  vazio: {
    color: "#94a3b8",
    fontWeight: "bold",
    fontSize: "12px",
    alignSelf: "center",
    margin: "auto",
  },
};

export default LabirintoGrafo;