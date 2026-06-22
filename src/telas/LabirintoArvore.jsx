import TopoFase from "../components/fase/TopoFase";
import Mensagem from "../components/fase/Mensagem";
import Etapa from "../components/fase/Etapa";
import ListaEtapas from "../components/fase/ListaEtapas";
import Modal from "../components/fase/Modal";
import Conceito from "../components/fase/Conceito";
import BotoesRodape from "../components/fase/BotoesRodape";
import ToastConfig from "../components/fase/ToastConfig";
import TutorialJoyride from "../components/fase/TutorialJoyride";

import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

function LabirintoArvore({ voltar, concluir }) {
  const nosIniciais = [
    { id: 1, valor: 50, nome: "Ficha 50", icone: "📁" },
    { id: 2, valor: 30, nome: "Ficha 30", icone: "📄" },
    { id: 3, valor: 70, nome: "Ficha 70", icone: "📄" },
    { id: 4, valor: 20, nome: "Ficha 20", icone: "📄" },
    { id: 5, valor: 40, nome: "Ficha 40", icone: "📄" },
    { id: 6, valor: 60, nome: "Ficha 60", icone: "🩺" },
    { id: 7, valor: 80, nome: "Ficha 80", icone: "📄" },
  ];

  const etapas = [
    "Organizar fichas",
    "Buscar paciente",
    "Atualizar ficha",
    "Arquivar ficha",
    "Desafio",
    "Conclusão",
  ];

  const VALOR_BUSCADO = 60;
  const ID_NO_PARA_ATUALIZAR = 6;
  const ORDEM_INSERCAO = [50, 30, 70, 20, 40, 60, 80];

  const [etapa, setEtapa] = useState(1);
  const [arvore, setArvore] = useState(null);
  const [disponiveis, setDisponiveis] = useState(nosIniciais);
  const [removidos, setRemovidos] = useState([]);
  const [folhaRemovida, setFolhaRemovida] = useState(false);

  const [valorBusca, setValorBusca] = useState(null);
  const [novoNome, setNovoNome] = useState("");
  const [novoValor, setNovoValor] = useState("");
  const [noSelecionadoId, setNoSelecionadoId] = useState(null);
  const [noAtualizadoId, setNoAtualizadoId] = useState(null);

  const [mostrarHistoria, setMostrarHistoria] = useState(true);
  const [mostrarDica, setMostrarDica] = useState(false);
  const [mostrarEtapas, setMostrarEtapas] = useState(false);
  const [concluido, setConcluido] = useState(false);
  const [runTour, setRunTour] = useState(false);

  const [mensagem, setMensagem] = useState(
    "Organize as fichas dos pacientes. Comece pela ficha de número 50."
  );

  const stepsBase = [
    {
      target: ".tour-topo",
      content: "Aqui você pode voltar ao mapa, abrir a história ou ver a dica.",
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
        target: ".tour-guardioes",
        content: "Clique nas fichas para organizá-las na árvore do hospital.",
        placement: "bottom",
      },
    ],
    2: [
      {
        target: ".tour-arvore",
        content:
          "Busque a ficha do paciente nº 60. A árvore ajuda a descartar vários registros.",
        placement: "top",
      },
    ],
    3: [
      {
        target: ".tour-atualizar",
        content:
          "Selecione a ficha 60, digite o novo nome, um novo número válido e clique em Atualizar.",
        placement: "bottom",
      },
    ],
    4: [
      {
        target: ".tour-remocao",
        content:
          "Arquive uma ficha folha. Depois leia a explicação e avance.",
        placement: "top",
      },
    ],
    5: [
      {
        target: ".tour-desafio",
        content:
          "Compare os dois hospitais e escolha qual encontra fichas mais rapidamente.",
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
        "A árvore de busca evita percorrer todos os registros do hospital.",
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

  function criarNo(item) {
    return { ...item, esquerda: null, direita: null };
  }

  function inserirNo(noAtual, item) {
    if (!noAtual) return criarNo(item);

    if (item.valor < noAtual.valor) {
      return { ...noAtual, esquerda: inserirNo(noAtual.esquerda, item) };
    }

    if (item.valor > noAtual.valor) {
      return { ...noAtual, direita: inserirNo(noAtual.direita, item) };
    }

    return noAtual;
  }

  function contarNos(no) {
    if (!no) return 0;
    return 1 + contarNos(no.esquerda) + contarNos(no.direita);
  }

  function alturaArvore(no) {
    if (!no) return 0;
    return 1 + Math.max(alturaArvore(no.esquerda), alturaArvore(no.direita));
  }

  function adicionarNo(index) {
    if (etapa !== 1) {
      mostrarToast("error", "Agora não é o momento de organizar fichas.");
      return;
    }

    const item = disponiveis[index];
    const quantidadeAtual = contarNos(arvore);
    const valorEsperado = ORDEM_INSERCAO[quantidadeAtual];

    if (item.valor !== valorEsperado) {
      mostrarToast("error", `Organize primeiro a ficha ${valorEsperado}.`);
      setMensagem(
        `Para manter a árvore equilibrada, adicione agora a ficha ${valorEsperado}.`
      );
      return;
    }

    const novaArvore = inserirNo(arvore, item);

    setArvore(novaArvore);
    setDisponiveis(disponiveis.filter((_, i) => i !== index));

    if (contarNos(novaArvore) === 7) {
      setEtapa(2);
      setValorBusca(novaArvore.valor);

      setMensagem(
        "Um cidadão precisa de atendimento urgente. Busque a ficha do paciente nº 60 começando pela raiz."
      );

      mostrarToast("success", "Árvore organizada! Agora encontre a ficha 60.");
    } else {
      const proximoValor = ORDEM_INSERCAO[contarNos(novaArvore)];
      setMensagem(`Ficha adicionada. Agora organize a ficha ${proximoValor}.`);
      mostrarToast("success", `${item.nome} foi organizada na árvore.`);
    }
  }

  function buscarNo(no) {
    if (etapa !== 2) return;

    if (no.valor !== valorBusca) {
      mostrarToast("error", "Clique na ficha marcada como verificar.");
      setMensagem("Siga apenas o caminho indicado pela busca.");
      return;
    }

    if (no.id === ID_NO_PARA_ATUALIZAR) {
      setEtapa(3);
      setMensagem(
        "Ficha 60 encontrada! A equipe percebeu que o número de prioridade está desatualizado. Atualize a ficha sem quebrar a organização da árvore."
      );
      mostrarToast("success", "Ficha do paciente encontrada!");
      return;
    }

    if (VALOR_BUSCADO > no.valor && no.direita) {
      setValorBusca(no.direita.valor);
      setMensagem(
        `Ficha ${no.valor} verificada. Como 60 é maior que ${no.valor}, seguimos para a direita e descartamos todos os registros da esquerda.`
      );
      mostrarToast("success", "Caminho da direita escolhido.");
      return;
    }

    if (VALOR_BUSCADO < no.valor && no.esquerda) {
      setValorBusca(no.esquerda.valor);
      setMensagem(
        `Ficha ${no.valor} verificada. Como 60 é menor que ${no.valor}, seguimos para a esquerda e descartamos todos os registros da direita.`
      );
      mostrarToast("success", "Caminho da esquerda escolhido.");
    }
  }

  function selecionarNoParaAtualizar(no) {
    if (etapa !== 3) return;

    if (no.id !== ID_NO_PARA_ATUALIZAR) {
      mostrarToast("error", "Selecione a ficha do paciente nº 60.");
      setMensagem("Selecione a ficha de número 60 para atualizar.");
      return;
    }

    setNoSelecionadoId(no.id);
    setMensagem("Digite o novo nome, o novo número e clique em Atualizar.");
    mostrarToast("success", "Ficha 60 selecionada.");
  }

  function atualizarNoArvore(no, id, nomeDigitado, valorDigitado) {
    if (!no) return null;

    if (no.id === id) {
      return {
        ...no,
        nome: nomeDigitado,
        valor: valorDigitado,
        icone: "🩺",
      };
    }

    return {
      ...no,
      esquerda: atualizarNoArvore(no.esquerda, id, nomeDigitado, valorDigitado),
      direita: atualizarNoArvore(no.direita, id, nomeDigitado, valorDigitado),
    };
  }

  function validarArvoreBST(no, min = -Infinity, max = Infinity) {
    if (!no) return true;

    if (no.valor <= min || no.valor >= max) return false;

    return (
      validarArvoreBST(no.esquerda, min, no.valor) &&
      validarArvoreBST(no.direita, no.valor, max)
    );
  }

  function confirmarAtualizacao() {
    if (etapa !== 3) return;

    if (noSelecionadoId === null) {
      mostrarToast("error", "Primeiro selecione a ficha 60.");
      setMensagem("Primeiro clique na ficha 60.");
      return;
    }

    if (novoNome.trim() === "") {
      mostrarToast("error", "Digite o novo nome da ficha.");
      setMensagem("Digite o novo nome.");
      return;
    }

    const valorConvertido = Number(novoValor);

    if (!novoValor || Number.isNaN(valorConvertido)) {
      mostrarToast("error", "Digite um número válido.");
      setMensagem("Digite um valor numérico válido.");
      return;
    }

    const arvoreTeste = atualizarNoArvore(
      arvore,
      noSelecionadoId,
      novoNome.trim(),
      valorConvertido
    );

    if (!validarArvoreBST(arvoreTeste)) {
      mostrarToast("error", "Esse número quebra a ordem da árvore.");
      setMensagem(
        "Esse número não pode ser usado, porque deixaria a árvore fora da ordem: menores à esquerda e maiores à direita."
      );
      return;
    }

    setArvore(arvoreTeste);
    setNoAtualizadoId(noSelecionadoId);
    setNoSelecionadoId(null);
    setNovoNome("");
    setNovoValor("");
    setEtapa(4);

    mostrarToast("success", "Ficha atualizada com sucesso.");

    setMensagem(
      "O hospital precisa arquivar uma ficha antiga. Escolha uma ficha que possa sair sem obrigar o sistema a reorganizar outros registros."
    );
  }

  function encontrarNoPorId(no, id) {
    if (!no) return null;
    if (no.id === id) return no;

    return encontrarNoPorId(no.esquerda, id) || encontrarNoPorId(no.direita, id);
  }

  function removerFolhaPorId(no, id) {
    if (!no) return null;

    if (no.id === id) {
      if (!no.esquerda && !no.direita) return null;
      return no;
    }

    return {
      ...no,
      esquerda: removerFolhaPorId(no.esquerda, id),
      direita: removerFolhaPorId(no.direita, id),
    };
  }

  function removerNo(id) {
    if (etapa !== 4) return;

    if (folhaRemovida) {
      mostrarToast("info", "Você já arquivou uma ficha. Continue para o desafio.");
      return;
    }

    const noEscolhido = encontrarNoPorId(arvore, id);

    if (!noEscolhido) {
      mostrarToast("error", "Essa ficha não existe mais.");
      return;
    }

    if (noEscolhido.esquerda || noEscolhido.direita) {
      mostrarToast("error", "Essa ficha não pode ser arquivada agora.");

      setMensagem(
        `${noEscolhido.nome} possui registros ligados abaixo dela. ` +
          "Se essa ficha fosse removida, o sistema precisaria reorganizar a árvore, escolher outro nó para ocupar seu lugar e reajustar as ligações com os filhos. " +
          "Esse tipo de remoção é mais complexo e será visto em uma próxima etapa."
      );

      return;
    }

    setRemovidos([noEscolhido]);
    setArvore(removerFolhaPorId(arvore, id));
    setFolhaRemovida(true);

    mostrarToast("success", `${noEscolhido.nome} foi arquivada.`);

    setMensagem(
      `${noEscolhido.nome} foi arquivada porque era uma folha: não possuía registros abaixo dela. ` +
        "Por isso, sua remoção não afetou os outros nós da árvore. " +
        "Remover uma ficha do meio exigiria reorganizar a árvore, escolher outro nó para ocupar seu lugar e reajustar as ligações com seus filhos. " +
        "Esse caso será visto futuramente."
    );
  }

  function responderDesafioArvore(tipo) {
    if (etapa !== 5) return;

    if (tipo === "balanceada") {
      setEtapa(6);
      setConcluido(true);
      setMensagem(
        "Correto! O Hospital B encontra a ficha 110 com menos verificações, porque a árvore está melhor organizada."
      );
      mostrarToast("success", "Fase concluída!");
    } else {
      mostrarToast("error", "Esse hospital precisa verificar muitas fichas.");
      setMensagem(
        "O Hospital A ficou parecido com uma lista. Para chegar até 110, ele passa por vários registros."
      );
    }
  }

  function clicarNo(no) {
    if (etapa === 2) buscarNo(no);
    if (etapa === 3) selecionarNoParaAtualizar(no);

    if (etapa === 4 && !folhaRemovida) {
      removerNo(no.id);
    }
  }

  function resetar() {
    setEtapa(1);
    setArvore(null);
    setDisponiveis(nosIniciais);
    setRemovidos([]);
    setFolhaRemovida(false);
    setValorBusca(null);
    setConcluido(false);
    setNovoNome("");
    setNovoValor("");
    setNoSelecionadoId(null);
    setNoAtualizadoId(null);
    setMensagem("Organize as fichas dos pacientes. Comece pela ficha de número 50.");
    mostrarToast("info", "🔄 Fase reiniciada.");
  }

  function desenharArvore(no, x, y, offset) {
    if (!no) return null;

    const elementos = [];
    const yFilho = y + 90;

    const isRaiz = arvore && no.id === arvore.id;
    const verificar = etapa === 2 && no.valor === valorBusca;

    const atualizar =
      etapa === 3 &&
      no.id === ID_NO_PARA_ATUALIZAR &&
      noSelecionadoId === null;

    const selecionado = etapa === 3 && noSelecionadoId === no.id;

    const folhaParaRemover =
        etapa === 4 &&
        !folhaRemovida &&
        !no.esquerda &&
        !no.direita;


    const atualizado =
      etapa >= 4 &&
      noAtualizadoId === no.id &&
      !folhaParaRemover;

    if (no.esquerda) {
      const xEsq = x - offset;

      elementos.push(
        <line
          key={`l-e-${no.id}`}
          x1={x}
          y1={y}
          x2={xEsq}
          y2={yFilho}
          stroke="#818cf8"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      );

      elementos.push(desenharArvore(no.esquerda, xEsq, yFilho, offset * 0.6));
    }

    if (no.direita) {
      const xDir = x + offset;

      elementos.push(
        <line
          key={`l-d-${no.id}`}
          x1={x}
          y1={y}
          x2={xDir}
          y2={yFilho}
          stroke="#818cf8"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      );

      elementos.push(desenharArvore(no.direita, xDir, yFilho, offset * 0.6));
    }

    elementos.push(
      <foreignObject
        key={`no-${no.id}`}
        x={x - 45}
        y={y - 65}
        width="90"
        height="130"
      >
        <div
          onClick={() => clicarNo(no)}
          style={{
            ...estilos.noArvore,
            marginTop: "30px",
            borderColor:
              verificar ||
              atualizar ||
              selecionado ||
              atualizado ||
              folhaParaRemover ||
              isRaiz
                ? "#ec4899"
                : "#818cf8",
            boxShadow: verificar
              ? "0 0 15px rgba(236,72,153,0.4)"
              : "none",
            cursor:
              etapa === 2 ||
              etapa === 3 ||
              (etapa === 4 && !folhaRemovida)
                ? "pointer"
                : "default",
            opacity: etapa === 4 && folhaRemovida ? 0.85 : 1,
          }}
        >
          {isRaiz && <span style={estilos.raiz}>RAIZ</span>}
          {verificar && <span style={estilos.busca}>VERIFICAR</span>}
          {atualizar && <span style={estilos.busca}>ATUALIZAR</span>}
          {selecionado && <span style={estilos.selecionado}>SELECIONADO</span>}
          {atualizado && <span style={estilos.atualizado}>ATUALIZADO</span>}
          {folhaParaRemover && <span style={estilos.folha}>FOLHA</span>}

          <span style={{ fontSize: "22px" }}>{no.icone}</span>
          <span style={estilos.nomeNo}>{no.nome}</span>
          <span style={estilos.valorNo}>{no.valor}</span>
        </div>
      </foreignObject>
    );

    return elementos;
  }

  const profundidade = alturaArvore(arvore);
  const alturaSvg = arvore ? Math.max(280, profundidade * 100) : 100;
  const viewBoxAltura = arvore ? Math.max(300, profundidade * 110) : 100;

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
            titulo="Hospital dos Dados"
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

        {mostrarEtapas && <ListaEtapas etapas={etapas} etapaAtual={etapa} />}

        <div className="tour-mensagem">
          <Mensagem texto={mensagem} />
        </div>

        {etapa === 3 && (
          <div style={estilos.formAtualizacao} className="tour-atualizar">
            <div style={estilos.linhaInputs}>
              <input
                value={novoNome}
                onChange={(e) => setNovoNome(e.target.value)}
                placeholder="Novo nome"
                style={estilos.input}
              />

              <input
                type="number"
                value={novoValor}
                onChange={(e) => setNovoValor(e.target.value)}
                placeholder="Novo número"
                style={estilos.input}
              />
            </div>

            <button onClick={confirmarAtualizacao} style={estilos.botaoAtualizar}>
              Atualizar
            </button>
          </div>
        )}

        {disponiveis.length > 0 && (
          <section className="tour-guardioes">
            <h2 style={estilos.subtitulo}>Fichas disponíveis</h2>

            <div style={estilos.guardioesGrid}>
              {disponiveis.map((item, index) => (
                <motion.button
                  key={item.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => adicionarNo(index)}
                  style={estilos.cardGuardiao}
                >
                  <span style={estilos.iconeGuardiao}>{item.icone}</span>
                  <span>{item.nome}</span>
                  <small>Nº {item.valor}</small>
                </motion.button>
              ))}
            </div>
          </section>
        )}

        {etapa !== 5 && (
          <section style={estilos.arvoreArea} className="tour-arvore">
            <h2 style={estilos.subtitulo}>Árvore de fichas</h2>

            <div style={{ ...estilos.arvoreBox, height: `${alturaSvg}px` }}>
              {arvore ? (
                <svg
                  width="100%"
                  height={alturaSvg}
                  viewBox={`0 0 420 ${viewBoxAltura}`}
                >
                  {desenharArvore(arvore, 210, 80, 100)}
                </svg>
              ) : (
                <span style={estilos.vazio}>A árvore aparecerá aqui</span>
              )}
            </div>
          </section>
        )}

        {etapa === 4 && (
          <section style={estilos.areaRemocao} className="tour-remocao">
            <div>
              <h2 style={estilos.subtituloRemovido}>Arquivo</h2>
              <p style={estilos.textoRemocao}>
                {folhaRemovida
                  ? "Ficha arquivada."
                  : "Arquive uma ficha folha."}
              </p>
            </div>

            <div style={estilos.caixaRemovido}>
              {removidos.length === 0 ? (
                <span style={estilos.vazioRemovido}>Aguardando arquivo</span>
              ) : (
                removidos.map((no, index) => (
                  <div key={`${no.id}-${index}`} style={estilos.cardRemovido}>
                    <span>{no.icone}</span>
                    <strong>{no.nome}</strong>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {etapa === 4 && folhaRemovida && (
          <button
            onClick={() => {
              setEtapa(5);
              setMensagem(
                "Dois hospitais organizaram suas fichas de formas diferentes. Qual deles encontra a ficha 110 com menos verificações?"
              );
            }}
            style={estilos.botaoAvancarDesafio}
          >
            Entendi, continuar
          </button>
        )}

        {etapa === 5 && (
          <section style={estilos.desafioArvores} className="tour-desafio">
            <h2 style={estilos.tituloDesafio}>
              Qual hospital encontra a ficha 110 mais rápido?
            </h2>

            <div style={estilos.opcoesArvore}>
              <button
                onClick={() => responderDesafioArvore("desbalanceada")}
                style={estilos.opcaoArvore}
              >
                <strong>Hospital A</strong>

                <svg width="100" height="230" style={{ margin: "10px 0" }}>
                  <path
                    d="M 50 20 L 50 200"
                    stroke="#cbd5e1"
                    strokeWidth="2"
                    fill="none"
                  />

                  {[50, 60, 70, 80, 90, 100, 110].map((valor, i) => (
                    <g key={valor}>
                      <circle
                        cx="50"
                        cy={20 + i * 30}
                        r="13"
                        fill={i === 0 ? "#ec4899" : "#818cf8"}
                      />
                      <text
                        x="50"
                        y={24 + i * 30}
                        textAnchor="middle"
                        fill="white"
                        fontSize="9"
                        fontWeight="bold"
                      >
                        {valor}
                      </text>
                    </g>
                  ))}
                </svg>

                <small style={{ color: "#ef4444", fontWeight: "bold" }}>
                  7 verificações
                </small>
              </button>

              <button
                onClick={() => responderDesafioArvore("balanceada")}
                style={estilos.opcaoArvore}
              >
                <strong>Hospital B</strong>

                <svg width="150" height="170" style={{ margin: "10px 0" }}>
                  <path
                    d="M 75 25 L 45 65 M 75 25 L 105 65"
                    stroke="#cbd5e1"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M 45 65 L 30 105 M 45 65 L 60 105"
                    stroke="#cbd5e1"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M 105 65 L 90 105 M 105 65 L 120 105"
                    stroke="#cbd5e1"
                    strokeWidth="2"
                    fill="none"
                  />

                  {[
                    { v: 80, x: 75, y: 25, c: "#ec4899" },
                    { v: 50, x: 45, y: 65, c: "#818cf8" },
                    { v: 100, x: 105, y: 65, c: "#818cf8" },
                    { v: 30, x: 30, y: 105, c: "#94a3b8" },
                    { v: 60, x: 60, y: 105, c: "#94a3b8" },
                    { v: 90, x: 90, y: 105, c: "#94a3b8" },
                    { v: 110, x: 120, y: 105, c: "#94a3b8" },
                  ].map((n) => (
                    <g key={n.v}>
                      <circle cx={n.x} cy={n.y} r="13" fill={n.c} />
                      <text
                        x={n.x}
                        y={n.y + 4}
                        textAnchor="middle"
                        fill="white"
                        fontSize="9"
                        fontWeight="bold"
                      >
                        {n.v}
                      </text>
                    </g>
                  ))}
                </svg>

                <small style={{ color: "#22c55e", fontWeight: "bold" }}>
                  3 verificações
                </small>
              </button>
            </div>
          </section>
        )}

        <Conceito
          texto="A árvore organizada reduz o caminho da busca."
          conceito="BST: menores à esquerda, maiores à direita."
        />

        <BotoesRodape resetar={resetar} iniciarTutorial={iniciarTutorial} />

        {concluido && (
          <Modal
            titulo="🏆 Hospital concluído!"
            fechar={concluir}
            textoBotao="Próxima fase"
          >
            <p>
              Você entendeu que uma árvore de busca encontra registros mais
              rapidamente porque elimina caminhos desnecessários.
            </p>
          </Modal>
        )}

        {mostrarHistoria && (
          <Modal fechar={fecharHistoria} titulo="📖 História">
            <p>
              Depois de atravessar o Corredor dos Portais, um dos viajantes começou a
              passar mal durante a jornada.
            </p>
            <p>
              O grupo chegou ao Hospital dos Dados para buscar atendimento urgente.
            </p>
            <p>
              O hospital guarda muitas fichas médicas, e procurar uma por uma demoraria
              demais.
            </p>
            <p>
              Por isso, as fichas são organizadas em uma árvore de busca.
            </p>
            <strong>
              Fichas menores ficam à esquerda e fichas maiores ficam à direita.
            </strong>
          </Modal>
        )}

        {mostrarDica && (
          <Modal fechar={() => setMostrarDica(false)} titulo="💡 Dica">
            <p>
              A árvore segue a lógica da <strong>Árvore Binária de Busca</strong>.
            </p>
            <p>Valores menores ficam à esquerda.</p>
            <p>Valores maiores ficam à direita.</p>
            <p>
              A busca elimina partes da árvore, evitando verificar todas as fichas.
            </p>
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
    padding: "0 10px 24px",
    boxSizing: "border-box",
    overflowY: "auto",
    overflowX: "hidden",
  },

  formAtualizacao: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "10px",
  },

  linhaInputs: {
    display: "grid",
    gridTemplateColumns: "1.5fr 1fr",
    gap: "12px",
    padding: "0 10px",
  },

  input: {
    height: "42px",
    borderRadius: "12px",
    border: "1.5px solid #e2e8f0",
    padding: "0 12px",
    fontSize: "13px",
    width: "100%",
    boxSizing: "border-box",
  },

  botaoAtualizar: {
    width: "180px",
    height: "38px",
    margin: "0 auto",
    border: "none",
    borderRadius: "999px",
    background: "linear-gradient(135deg, #7c3aed, #ec4899)",
    color: "white",
    fontWeight: "900",
    fontSize: "13px",
    cursor: "pointer",
    boxShadow: "0 6px 16px rgba(124,58,237,0.25)",
  },

  botaoAvancarDesafio: {
    width: "100%",
    height: "42px",
    marginTop: "10px",
    border: "none",
    borderRadius: "999px",
    background: "linear-gradient(135deg, #7c3aed, #ec4899)",
    color: "white",
    fontWeight: "900",
    fontSize: "13px",
    cursor: "pointer",
  },

  subtitulo: {
    margin: "0 0 5px",
    color: "#1e293b",
    fontSize: "15px",
    fontWeight: "900",
    textAlign: "center",
  },

  guardioesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "5px",
    marginBottom: "6px",
  },

  cardGuardiao: {
    height: "50px",
    border: "none",
    borderRadius: "12px",
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

  iconeGuardiao: {
    fontSize: "18px",
  },

  arvoreArea: {
    marginTop: "4px",
  },

  arvoreBox: {
    minHeight: "150px",
    maxHeight: "240px",
    border: "2px dashed #cbd5e1",
    borderRadius: "20px",
    background: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    overflowY: "auto",
    padding: "20px 0",
  },

  noArvore: {
    width: "75px",
    height: "75px",
    background: "white",
    borderRadius: "50%",
    border: "2px solid #818cf8",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
    position: "relative",
    zIndex: 10,
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
  },

  raiz: {
    position: "absolute",
    top: "-25px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#ec4899",
    color: "white",
    fontSize: "9px",
    padding: "3px 10px",
    borderRadius: "999px",
    fontWeight: "bold",
    whiteSpace: "nowrap",
    zIndex: 30,
  },

  nomeNo: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#475569",
    textAlign: "center",
    lineHeight: "1",
    marginTop: "2px",
  },

  valorNo: {
    fontSize: "14px",
    color: "#64748b",
    fontWeight: "900",
  },

  busca: {
    position: "absolute",
    bottom: "-15px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#7c3aed",
    color: "white",
    fontSize: "9px",
    padding: "3px 10px",
    borderRadius: "999px",
    fontWeight: "bold",
    whiteSpace: "nowrap",
    zIndex: 30,
  },

  selecionado: {
    position: "absolute",
    bottom: "-15px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#22c55e",
    color: "white",
    fontSize: "7px",
    padding: "2px 6px",
    borderRadius: "999px",
    fontWeight: "900",
    whiteSpace: "nowrap",
  },

  atualizado: {
    position: "absolute",
    bottom: "-15px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#22c55e",
    color: "white",
    fontSize: "7px",
    padding: "2px 6px",
    borderRadius: "999px",
    fontWeight: "900",
    whiteSpace: "nowrap",
  },

  folha: {
    position: "absolute",
    bottom: "-15px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#22c55e",
    color: "white",
    fontSize: "7px",
    padding: "2px 6px",
    borderRadius: "999px",
    fontWeight: "900",
    whiteSpace: "nowrap",
  },

  areaRemocao: {
    marginTop: "10px",
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

  tituloDesafio: {
    margin: "0 0 10px",
    color: "#1e293b",
    fontSize: "17px",
    fontWeight: "900",
    textAlign: "center",
  },

  desafioArvores: {
    marginTop: "8px",
    background: "#f8fafc",
    borderRadius: "18px",
    padding: "12px",
  },

  opcoesArvore: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
  },

  opcaoArvore: {
    minHeight: "250px",
    border: "2px solid #f1f5f9",
    borderRadius: "20px",
    background: "white",
    color: "#475569",
    fontSize: "11px",
    fontWeight: "800",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "6px",
    textAlign: "center",
    cursor: "pointer",
    padding: "12px 8px",
  },

  vazio: {
    color: "#94a3b8",
    fontWeight: "bold",
    fontSize: "12px",
  },
};

export default LabirintoArvore;