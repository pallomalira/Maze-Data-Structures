import { useState } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import * as ReactJoyride from "react-joyride";

const Joyride = ReactJoyride.default || ReactJoyride.Joyride;

function LabirintoGrafo({ voltar, concluir }) {
  const personagensIniciais = [
    { id: "arthur", nome: "Arthur", icone: "🛡️", papel: "Líder" },
    { id: "maria", nome: "Maria", icone: "🏹", papel: "Ponte do grupo" },
    { id: "lucas", nome: "Lucas", icone: "🧙", papel: "Mago" },
    { id: "sofia", nome: "Sofia", icone: "🌙", papel: "Curandeira" },
    { id: "beth", nome: "Beth", icone: "🕵️", papel: "Viajante" },
  ];

  const conexoesIniciais = [
    ["arthur", "maria"],
    ["maria", "beth"],
    ["lucas", "beth"],
    ["beth", "sofia"],
    ["lucas", "sofia"],
  ];

  const caminhoBusca = ["arthur", "maria", "beth"];

  const posicoes = {
    arthur: { x: 210, y: 42 },
    maria: { x: 90, y: 135 },
    lucas: { x: 330, y: 135 },
    beth: { x: 210, y: 225 },
    sofia: { x: 210, y: 325 },
  };

  const etapas = [
    "Formar rede",
    "Buscar",
    "Marcar infiltrado",
    "Remover infiltrado",
    "Remover conexão infectada",
    "Quem ficou isolado?",
    "Conclusão",
  ];

  const [etapa, setEtapa] = useState(1);
  const [vertices, setVertices] = useState([]);
  const [disponiveis, setDisponiveis] = useState(personagensIniciais);
  const [arestas, setArestas] = useState([]);
  const [removidos, setRemovidos] = useState([]);
  const [indiceBusca, setIndiceBusca] = useState(0);
  const [novoNome, setNovoNome] = useState("");
  const [idSelecionado, setIdSelecionado] = useState(null);
  const [idAtualizado, setIdAtualizado] = useState(null);
  const [idInfectado, setIdInfectado] = useState(null);
  const [concluido, setConcluido] = useState(false);
  const [mostrarHistoria, setMostrarHistoria] = useState(true);
  const [mostrarDica, setMostrarDica] = useState(false);
  const [mostrarEtapas, setMostrarEtapas] = useState(false);
  const [runTour, setRunTour] = useState(false);

  const [mensagem, setMensagem] = useState(
    "Clique nos aventureiros para formar a rede de comunicação dos aliados."
  );

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
    return listaVertices.filter((vertice) => {
      return !estaConectado(vertice.id, listaArestas);
    });
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

    mostrarToast("success", `${personagem.nome} entrou na rede.`);

    if (novosVertices.length === personagensIniciais.length) {
      setEtapa(2);
      setIndiceBusca(0);
      setMensagem(
        "Há um infiltrado na rede. Siga as conexões para encontrá-lo: comece por Arthur."
      );

      setTimeout(() => {
        mostrarToast("info", "🔍 Siga o caminho Arthur → Maria → Beth.");
      }, 1800);
    } else {
      setMensagem(
        "Aliado adicionado. Conforme a rede cresce, novas conexões aparecem."
      );
    }
  }

  function buscarInfiltrado(index) {
    if (etapa !== 2) return;

    const vertice = vertices[index];
    const esperado = caminhoBusca[indiceBusca];

    if (vertice.id !== esperado) {
      const esperadoNome =
        personagensIniciais.find((p) => p.id === esperado)?.nome ||
        "o próximo vértice";

      mostrarToast("error", `Caminho errado. Clique em ${esperadoNome}.`);
      setMensagem(
        `Na busca em grafo, você precisa seguir as conexões. Agora clique em ${esperadoNome}.`
      );
      return;
    }

    if (vertice.id === "beth") {
      setEtapa(3);
      setMensagem(
        "Beth foi encontrada. O grupo descobriu que ela é a infiltrada. Agora atualize o nome dela para Infiltrado."
      );
      mostrarToast("success", "Beth encontrada! Clique nela para marcar.");
      return;
    }

    setIndiceBusca(indiceBusca + 1);
    setMensagem(`${vertice.nome} foi verificado. Continue seguindo a conexão.`);
    mostrarToast("success", `${vertice.nome} verificado.`);
  }

  function selecionarParaAtualizar(index) {
    if (etapa !== 3) return;

    const vertice = vertices[index];

    if (vertice.id !== "beth") {
      mostrarToast("error", "Selecione Beth para marcar como infiltrada.");
      setMensagem("Clique em Beth para atualizar as informações dela.");
      return;
    }

    setIdSelecionado(vertice.id);
    setNovoNome("Infiltrado");
    setMensagem('Digite ou mantenha o nome "Infiltrado" e clique em Atualizar.');
    mostrarToast("success", "Beth selecionada.");
  }

  function confirmarAtualizacao() {
    if (etapa !== 3) return;

    if (idSelecionado !== "beth") {
      mostrarToast("error", "Primeiro selecione Beth.");
      setMensagem("Primeiro clique em Beth para selecionar o vértice.");
      return;
    }

    if (novoNome.trim() === "") {
      mostrarToast("error", "Digite o novo nome.");
      setMensagem("Digite o novo nome para atualizar o vértice.");
      return;
    }

    const novosVertices = vertices.map((v) =>
      v.id === "beth"
        ? { ...v, nome: novoNome.trim(), icone: "🕵️", papel: "Infiltrado" }
        : v
    );

    setVertices(novosVertices);
    setIdAtualizado("beth");
    setIdSelecionado(null);
    setNovoNome("");
    setEtapa(4);

    mostrarToast("success", "Beth foi marcada como infiltrada.");
    setMensagem(
      "Agora remova o Infiltrado da rede. Ao remover um vértice, todas as conexões ligadas a ele desaparecem."
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

    return {
      removido,
      novosVertices,
      novasArestas,
    };
  }

  function removerInfiltrado(index) {
    if (etapa !== 4) return;

    const vertice = vertices[index];

    if (vertice.id !== "beth") {
      mostrarToast("error", "Remova o vértice marcado como Infiltrado.");
      setMensagem("Clique no Infiltrado para removê-lo da rede.");
      return;
    }

    removerVertice("beth");
    setIdAtualizado(null);
    setIdInfectado("maria");
    setEtapa(5);

    mostrarToast("success", "Infiltrado removido. As conexões dele desapareceram.");
    setMensagem(
      "O infiltrado foi removido, mas afetou Maria, que era uma ponte importante da rede. Clique em Maria para removê-la e observe o que acontece."
    );
  }

  function removerMaria(index) {
    if (etapa !== 5) return;

    const vertice = vertices[index];

    if (vertice.id !== "maria") {
      mostrarToast("error", "Maria foi afetada. Clique nela para removê-la.");
      setMensagem(
        "Maria precisa sair da rede. Ao remover Maria, todas as conexões ligadas a ela desaparecem."
      );
      return;
    }

    const resultado = removerVertice("maria");
    setIdInfectado(null);
    setEtapa(6);

    const novosVertices = resultado?.novosVertices || [];
    const novasArestas = resultado?.novasArestas || [];

    const isolados = obterVerticesIsolados(novosVertices, novasArestas);

    if (isolados.length > 0) {
      const nomes = isolados.map((v) => v.nome).join(", ");

      setMensagem(
        `Maria saiu da rede. Agora descubra quem ficou isolado, ou seja, sem nenhuma conexão.`
      );
    } else {
      setMensagem(
        "Maria saiu da rede. Ninguém ficou isolado, porque todos os vértices restantes ainda possuem pelo menos uma conexão."
      );
    }

    mostrarToast("success", "Maria foi removida. Veja quem ficou isolado.");
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
        `${vertice.nome} ficou isolado porque não possui nenhuma aresta ligada a ele.`
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

    if (etapa === 2) buscarInfiltrado(index);
    if (etapa === 3) selecionarParaAtualizar(index);
    if (etapa === 4) removerInfiltrado(index);
    if (etapa === 5) removerMaria(index);
    if (etapa === 6) responderObservacao(index);
  }

  function resetar() {
    setEtapa(1);
    setVertices([]);
    setDisponiveis(personagensIniciais);
    setArestas([]);
    setRemovidos([]);
    setIndiceBusca(0);
    setNovoNome("");
    setIdSelecionado(null);
    setIdAtualizado(null);
    setIdInfectado(null);
    setConcluido(false);
    setMostrarHistoria(true);
    setMensagem(
      "Clique nos aventureiros para formar a rede de comunicação dos aliados."
    );
    mostrarToast("info", "🔄 Fase reiniciada.");
  }

  const stepsBase = [
    {
      target: ".tour-topo",
      content:
        "Aqui você volta ao mapa, abre a história ou vê uma dica sobre grafos.",
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
      content:
        "Essa mensagem mostra a missão atual e explica o que você precisa fazer.",
      placement: "bottom",
    },
  ];

  const stepsPorEtapa = {
    1: [
      {
        target: ".tour-personagens",
        content:
          "Clique nos aventureiros para adicioná-los à rede. Cada pessoa será um vértice.",
        placement: "bottom",
      },
      {
        target: ".tour-grafo",
        content:
          "As linhas representam conexões. Essas linhas são as arestas do grafo.",
        placement: "top",
      },
    ],
    2: [
      {
        target: ".tour-grafo",
        content:
          "Para encontrar o infiltrado, siga o caminho de conexões indicado pela rede.",
        placement: "top",
      },
    ],
    3: [
      {
        target: ".tour-atualizar",
        content:
          "Atualizar um vértice muda sua informação, mas mantém suas conexões.",
        placement: "bottom",
      },
    ],
    4: [
      {
        target: ".tour-grafo",
        content:
          "Remover um vértice também remove todas as arestas ligadas a ele.",
        placement: "top",
      },
    ],
    5: [
      {
        target: ".tour-grafo",
        content:
          "Maria era uma ponte importante da rede. Clique nela para removê-la e observe quem perde conexão.",
        placement: "top",
      },
    ],
    6: [
      {
        target: ".tour-grafo",
        content:
          "Agora clique no vértice isolado. Um vértice isolado não possui nenhuma aresta ligada a ele.",
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
        "Grafo é uma estrutura formada por vértices e arestas. Vértices são pontos da rede. Arestas são conexões entre eles.",
      placement: "top",
    },
    {
      target: ".tour-resetar",
      content: "Aqui você pode resetar a fase ou ver o tutorial novamente.",
      placement: "top",
    },
  ];

  function renderGrafo() {
    const altura = vertices.length <= 3 ? 260 : 390;
    const isolados = obterVerticesIsolados();
    const idsIsolados = isolados.map((v) => v.id);

    return (
      <svg width="100%" height={altura} viewBox="0 0 420 390">
        {arestas.map(([origem, destino], index) => {
          const p1 = posicoes[origem];
          const p2 = posicoes[destino];

          if (!p1 || !p2) return null;

          return (
            <line
              key={`${origem}-${destino}-${index}`}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke="#818cf8"
              strokeWidth="4"
              strokeLinecap="round"
            />
          );
        })}

        {vertices.map((local, index) => {
          const pos = posicoes[local.id];
          if (!pos) return null;

          const esperado = caminhoBusca[indiceBusca];

          const verificar = etapa === 2 && local.id === esperado;
          const visto =
            etapa === 2 && caminhoBusca.slice(0, indiceBusca).includes(local.id);
          const atualizar = etapa === 3 && local.id === "beth";
          const selecionado = etapa === 3 && idSelecionado === local.id;
          const atualizado = idAtualizado === local.id;
          const infectado = idInfectado === local.id;
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
                    infectado ||
                    isolado
                      ? "2px solid #ec4899"
                      : "2px solid #818cf8",
                  cursor:
                    etapa === 2 ||
                    etapa === 3 ||
                    etapa === 4 ||
                    etapa === 5 ||
                    etapa === 6
                      ? "pointer"
                      : "default",
                }}
              >
                {verificar && <span style={estilos.busca}>VERIFICAR</span>}
                {visto && <span style={estilos.verificado}>VISTO</span>}
                {atualizar && <span style={estilos.busca}>MARCAR</span>}
                {selecionado && <span style={estilos.selecionado}>SELEC.</span>}
                {atualizado && <span style={estilos.atualizado}>INFILTRADO</span>}
                {infectado && <span style={estilos.infectado}>AFETADA</span>}
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

          <h1 style={estilos.tituloTopo}>Rede dos Aliados</h1>

          <div style={estilos.iconesTopo}>
            <button
              onClick={() => setMostrarHistoria(true)}
              style={estilos.botaoLivro}
            >
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
            <span style={estilos.etapaNumero}>Etapa {etapa} de 7</span>
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
            <h2 style={estilos.subtitulo}>Aliados disponíveis</h2>

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
          <h2 style={estilos.subtitulo}>Rede de comunicação</h2>

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
                Remover um vértice apaga suas conexões.
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

        <section style={estilos.conceito} className="tour-conceito">
          <span style={estilos.iconeInfo}>i</span>

          <div>
            <p>Em um grafo, pessoas são vértices e conexões são arestas.</p>
            <strong>Vértice isolado: existe, mas não possui conexão.</strong>
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
              <h2 style={estilos.tituloConcluido}>🏆 Grafo concluído!</h2>
              <p>
                Você entendeu que um vértice pode continuar existindo no grafo,
                mesmo sem nenhuma conexão.
              </p>

              <button onClick={concluir} style={estilos.botaoFechar}>
                Próxima fase
              </button>
            </div>
          </div>
        )}

        {mostrarHistoria && (
          <Modal fechar={fecharHistoria} titulo="📖 História">
            <p>O Reino MazeData usa uma rede para manter os aliados conectados.</p>
            <p>
              Cada aliado é um vértice, e cada ligação de comunicação é uma
              aresta.
            </p>
            <p>
              Existe um infiltrado na rede. Para proteger o grupo, será preciso
              removê-lo e observar como a rede muda.
            </p>
            <strong>
              Se um aliado perde todas as conexões, ele vira um vértice isolado.
            </strong>
          </Modal>
        )}

        {mostrarDica && (
          <Modal fechar={() => setMostrarDica(false)} titulo="💡 Dica">
            <p>
              Um <strong>vértice</strong> é uma pessoa, ponto ou elemento da
              rede.
            </p>
            <p>
              Uma <strong>aresta</strong> é uma conexão entre dois vértices.
            </p>
            <p>
              Ao remover um vértice, todas as arestas ligadas a ele desaparecem.
            </p>
            <p>
              Um <strong>vértice isolado</strong> continua existindo, mas não
              possui nenhuma conexão.
            </p>
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
    minHeight: "48px",
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
    fontSize: "6.5px",
    color: "#64748b",
    fontWeight: "800",
    marginTop: "1px",
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
    position: "fixed",
    left: "50%",
    bottom: "10px",
    transform: "translateX(-50%)",
    width: "calc(100% - 20px)",
    maxWidth: "410px",
    padding: "8px",
    background: "rgba(255,255,255,0.95)",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px",
    zIndex: 40,
    boxShadow: "0 10px 30px rgba(15,23,42,0.12)",
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

  vazio: {
    color: "#94a3b8",
    fontWeight: "bold",
    fontSize: "12px",
    alignSelf: "center",
    margin: "auto",
  },
};

export default LabirintoGrafo;