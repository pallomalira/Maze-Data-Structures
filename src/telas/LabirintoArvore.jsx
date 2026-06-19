import { useState } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import * as ReactJoyride from "react-joyride";

const Joyride = ReactJoyride.default || ReactJoyride.Joyride;

function LabirintoArvore({ voltar, concluir }) {
  const nosIniciais = [
    { id: 1, valor: 50, nome: "Mestre Raiz", icone: "👑" },
    { id: 2, valor: 30, nome: "Guard. Lua", icone: "🌙" },
    { id: 3, valor: 70, nome: "Guard. Sol", icone: "☀️" },
    { id: 4, valor: 20, nome: "Aprendiz", icone: "🧭" },
    { id: 5, valor: 40, nome: "Sentinela", icone: "🛡️" },
  ];

  const etapas = [
    "Formar árvore",
    "Buscar",
    "Atualizar",
    "Remover folha",
    "Desafio",
    "Conclusão",
  ];

  const ID_NO_PARA_ATUALIZAR = 3;

  const [etapa, setEtapa] = useState(1);
  const [arvore, setArvore] = useState(null);
  const [disponiveis, setDisponiveis] = useState(nosIniciais);
  const [removidos, setRemovidos] = useState([]);

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
    "Clique em um guardião para inserir na árvore."
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
        target: ".tour-guardioes",
        content:
          "Clique nos guardiões disponíveis para inserir os nós na árvore.",
        placement: "bottom",
      },
      {
        target: ".tour-arvore",
        content:
          "O primeiro nó vira a raiz. Valores menores ficam à esquerda e maiores à direita.",
        placement: "top",
      },
    ],
    2: [
      {
        target: ".tour-arvore",
        content:
          "A busca começa pela raiz. Compare o valor procurado e siga para a esquerda ou direita.",
        placement: "top",
      },
    ],
    3: [
      {
        target: ".tour-arvore",
        content:
          "Clique no Guardião Sol para selecionar o nó que será atualizado.",
        placement: "top",
      },
      {
        target: ".tour-atualizar",
        content:
          "Digite o novo nome, o novo valor e clique no botão Atualizar.",
        placement: "bottom",
      },
    ],
    4: [
      {
        target: ".tour-arvore",
        content:
          "Agora escolha um nó folha. Nó folha é aquele que não tem filhos.",
        placement: "top",
      },
      {
        target: ".tour-remocao",
        content: "Quando o nó folha for removido, ele aparecerá aqui.",
        placement: "top",
      },
    ],
    5: [
      {
        target: ".tour-arvore",
        content: "Observe a árvore restante e clique na raiz.",
        placement: "top",
      },
    ],
    6: [
      {
        target: ".tour-conceito",
        content:
          "Parabéns! Você concluiu a fase e entendeu a árvore binária de busca.",
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
        "Na árvore binária de busca, menores vão para a esquerda e maiores para a direita.",
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
      mostrarToast("error", "Agora não é o momento de formar a árvore.");
      return;
    }

    const item = disponiveis[index];
    const novaArvore = inserirNo(arvore, item);

    setArvore(novaArvore);
    setDisponiveis(disponiveis.filter((_, i) => i !== index));

    mostrarToast("success", `${item.nome} foi inserido na árvore.`);

    if (contarNos(novaArvore) === 5) {
      setEtapa(2);
      setValorBusca(novaArvore.valor);
      setMensagem("Agora busque o valor 70 começando pela raiz.");

      setTimeout(() => {
        mostrarToast("info", "🔍 Busque o Guardião Sol começando pela raiz.");
      }, 1900);
    } else {
      setMensagem(
        "Nó inserido. Menores vão para a esquerda e maiores para a direita."
      );
    }
  }

  function buscarNo(no) {
    if (etapa !== 2) return;

    if (no.valor !== valorBusca) {
      mostrarToast("error", "Clique no nó marcado como verificar.");
      setMensagem("O caminho da busca começa pelo nó marcado.");
      return;
    }

    if (no.id === ID_NO_PARA_ATUALIZAR) {
      setEtapa(3);
      setMensagem("Guardião Sol encontrado. Agora atualize esse nó com um va.");

      mostrarToast(
        "success",
        "Guardião Sol encontrado! Clique nele para selecionar."
      );
      return;
    }

    if (70 > no.valor && no.direita) {
      setValorBusca(no.direita.valor);
      setMensagem(
        `${no.nome} verificado. Como 70 é maior que ${no.valor}, siga para a direita.`
      );
      mostrarToast("success", `${no.nome} verificado. Vá para a direita.`);
    } else if (70 < no.valor && no.esquerda) {
      setValorBusca(no.esquerda.valor);
      setMensagem(
        `${no.nome} verificado. Como 70 é menor que ${no.valor}, siga para a esquerda.`
      );
      mostrarToast("success", `${no.nome} verificado. Vá para a esquerda.`);
    }
  }

  function selecionarNoParaAtualizar(no) {
    if (etapa !== 3) return;

    if (no.id !== ID_NO_PARA_ATUALIZAR) {
      mostrarToast("error", "Selecione o Guardião Sol para atualizar.");
      setMensagem("Selecione o Guardião Sol para atualizar.");
      return;
    }

    setNoSelecionadoId(no.id);
    setMensagem("Digite o novo nome, o novo valor e clique em Atualizar.");
    mostrarToast("success", "Nó selecionado. Agora digite os novos dados.");
  }

  function atualizarNoArvore(no, id, nomeDigitado, valorDigitado) {
    if (!no) return null;

    if (no.id === id) {
      return {
        ...no,
        nome: nomeDigitado,
        valor: valorDigitado,
        icone: "🌞",
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

    if (no.valor <= min || no.valor >= max) {
      return false;
    }

    return (
      validarArvoreBST(no.esquerda, min, no.valor) &&
      validarArvoreBST(no.direita, no.valor, max)
    );
  }

  function confirmarAtualizacao() {
    if (etapa !== 3) return;

    if (noSelecionadoId === null) {
      mostrarToast("error", "Primeiro clique no Guardião Sol para selecionar.");
      setMensagem("Primeiro selecione o Guardião Sol.");
      return;
    }

    if (novoNome.trim() === "") {
      mostrarToast("error", "Digite o novo nome.");
      setMensagem("Digite o novo nome.");
      return;
    }

    const valorConvertido = Number(novoValor);

    if (!novoValor || Number.isNaN(valorConvertido)) {
      mostrarToast("error", "Digite um valor numérico válido.");
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
      mostrarToast("error", "Esse valor quebra a ordem da árvore.");
      setMensagem(
        "Esse valor não pode ser usado, porque deixaria a árvore fora da ordem: menores devem ficar à esquerda e maiores à direita."
      );
      return;
    }

    setArvore(arvoreTeste);

    setNoAtualizadoId(noSelecionadoId);
    setNoSelecionadoId(null);
    setNovoNome("");
    setNovoValor("");
    setEtapa(4);

    mostrarToast("success", "Nó atualizado com sucesso.");
    setMensagem(
      "Clique em um nó folha para remover. Nó folha não tem filhos ligados abaixo dele, por isso pode sair sem desorganizar a árvore."
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

    const noEscolhido = encontrarNoPorId(arvore, id);

    if (!noEscolhido) {
      mostrarToast("error", "Esse nó não existe mais na árvore.");
      return;
    }

    if (noEscolhido.esquerda || noEscolhido.direita) {
      mostrarToast("error", "Esse nó não é folha.");
      setMensagem("Escolha um nó sem filhos para remover.");
      return;
    }

    setRemovidos([...removidos, noEscolhido]);
    setArvore(removerFolhaPorId(arvore, id));
    setEtapa(5);

    mostrarToast("success", `${noEscolhido.nome} foi removido.`);
    setMensagem(
      "Nó folha removido. Agora responda: qual nó é a raiz da árvore? Clique no nó principal."
    );
  }

  function responderDesafio(no) {
    if (etapa !== 5) return;

    if (arvore && no.id === arvore.id) {
      setEtapa(6);
      setConcluido(true);
      setMensagem("Parabéns! Você concluiu a fase da árvore.");
      mostrarToast("success", "Fase concluída!");
    } else {
      mostrarToast("error", "A raiz é o nó principal da árvore.");
      setMensagem("Observe qual nó está no topo da árvore. Essa é a raiz.");
    }
  }

  function clicarNo(no) {
    if (etapa === 2) buscarNo(no);
    if (etapa === 3) selecionarNoParaAtualizar(no);
    if (etapa === 4) removerNo(no.id);
    if (etapa === 5) responderDesafio(no);
  }

  function resetar() {
    setEtapa(1);
    setArvore(null);
    setDisponiveis(nosIniciais);
    setRemovidos([]);
    setValorBusca(null);
    setConcluido(false);
    setNovoNome("");
    setNovoValor("");
    setNoSelecionadoId(null);
    setNoAtualizadoId(null);
    setMensagem("Clique em um guardião para inserir na árvore.");
    mostrarToast("info", "🔄 Fase reiniciada.");
  }

  function desenharArvore(no, x, y, offset) {
    if (!no) return null;

    const elementos = [];
    const isRaiz = arvore && no.id === arvore.id;
    const verificar = etapa === 2 && no.valor === valorBusca;
    const atualizar = etapa === 3 && no.id === ID_NO_PARA_ATUALIZAR;
    const selecionado = etapa === 3 && noSelecionadoId === no.id;
    const atualizado = noAtualizadoId === no.id;
    const folhaParaRemover = etapa === 4 && !no.esquerda && !no.direita;

    if (no.esquerda) {
      const xEsq = x - offset;
      const yEsq = y + 54;

      elementos.push(
        <line
          key={`linha-esq-${no.id}`}
          x1={x}
          y1={y + 16}
          x2={xEsq}
          y2={yEsq - 16}
          stroke="#818cf8"
          strokeWidth="3"
          strokeLinecap="round"
        />
      );

      elementos.push(desenharArvore(no.esquerda, xEsq, yEsq, offset / 1.8));
    }

    if (no.direita) {
      const xDir = x + offset;
      const yDir = y + 54;

      elementos.push(
        <line
          key={`linha-dir-${no.id}`}
          x1={x}
          y1={y + 16}
          x2={xDir}
          y2={yDir - 16}
          stroke="#818cf8"
          strokeWidth="3"
          strokeLinecap="round"
        />
      );

      elementos.push(desenharArvore(no.direita, xDir, yDir, offset / 1.8));
    }

    elementos.push(
      <foreignObject
        key={`no-${no.id}`}
        x={x - 38}
        y={y - 30}
        width="76"
        height="78"
      >
        <div
          onClick={() => clicarNo(no)}
          style={{
            ...estilos.noArvore,
            border:
              verificar ||
              atualizar ||
              selecionado ||
              atualizado ||
              folhaParaRemover ||
              isRaiz
                ? "2px solid #ec4899"
                : "2px solid #818cf8",
            cursor:
              etapa === 2 || etapa === 3 || etapa === 4 || etapa === 5
                ? "pointer"
                : "default",
          }}
        >
          {isRaiz && <span style={estilos.raiz}>RAIZ</span>}
          {verificar && <span style={estilos.busca}>VERIFICAR</span>}
          {atualizar && <span style={estilos.busca}>ATUALIZAR</span>}
          {selecionado && <span style={estilos.selecionado}>SELECIONADO</span>}
          {atualizado && <span style={estilos.atualizado}>ATUALIZADO</span>}
          {folhaParaRemover && <span style={estilos.folha}>FOLHA</span>}

          <span style={estilos.avatarNo}>{no.icone}</span>
          <span style={estilos.nomeNo}>{no.nome}</span>
          <span style={estilos.valorNo}>Valor {no.valor}</span>
        </div>
      </foreignObject>
    );

    return elementos;
  }

  const profundidade = alturaArvore(arvore);
  const alturaSvg = Math.max(205, profundidade * 68);
  const viewBoxAltura = Math.max(215, profundidade * 72);

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

          <h1 style={estilos.tituloTopo}>Árvore Ancestral</h1>

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
        placeholder="Novo valor"
        style={estilos.input}
      />
    </div>

    <button
      onClick={confirmarAtualizacao}
      style={estilos.botaoAtualizar}
    >
      Atualizar
    </button>
  </div>
)}



        {disponiveis.length > 0 && (
          <section className="tour-guardioes">
            <h2 style={estilos.subtitulo}>Guardiões disponíveis</h2>

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
                  <small>Valor {item.valor}</small>
                </motion.button>
              ))}
            </div>
          </section>
        )}

        <section style={estilos.arvoreArea} className="tour-arvore">
          <h2 style={estilos.subtitulo}>Árvore montada</h2>

          <div
            style={{
              ...estilos.arvoreBox,
              height: `${alturaSvg}px`,
            }}
          >
            {arvore ? (
              <svg
                width="100%"
                height={alturaSvg}
                viewBox={`0 0 420 ${viewBoxAltura}`}
              >
                {desenharArvore(arvore, 210, 30, 70)}
              </svg>
            ) : (
              <span style={estilos.vazio}>A árvore aparecerá aqui</span>
            )}
          </div>
        </section>

        {etapa >= 4 && (
          <section style={estilos.areaRemocao} className="tour-remocao">
            <div>
              <h2 style={estilos.subtituloRemovido}>Remoção</h2>
              <p style={estilos.textoRemocao}>Clique em um nó folha.</p>
            </div>

            <div style={estilos.caixaRemovido}>
              {removidos.length === 0 ? (
                <span style={estilos.vazioRemovido}>Aguardando remoção</span>
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

        <section style={estilos.conceito} className="tour-conceito">
          <span style={estilos.iconeInfo}>i</span>

          <div>
            <p>Na árvore, menores ficam à esquerda e maiores à direita.</p>
            <strong>BST: Árvore Binária de Busca</strong>
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
              <h2 style={estilos.tituloConcluido}>🏆 Árvore concluída!</h2>
              <p>Você entendeu a lógica da árvore.</p>

              <button onClick={concluir} style={estilos.botaoFechar}>
                Próxima fase
              </button>
            </div>
          </div>
        )}

        {mostrarHistoria && (
          <Modal fechar={fecharHistoria} titulo="📖 História">
            <p>Você chegou à Árvore Ancestral do Reino dos Dados.</p>
            <p>Cada guardião ocupa um lugar na árvore. O primeiro vira a raiz.</p>
            <strong>Menores vão para a esquerda, maiores para a direita.</strong>
          </Modal>
        )}

        {mostrarDica && (
          <Modal fechar={() => setMostrarDica(false)} titulo="💡 Dica">
            <p>
              A árvore segue a lógica da <strong>Árvore Binária de Busca</strong>.
            </p>
            <p>Valores menores ficam à esquerda.</p>
            <p>Valores maiores ficam à direita.</p>
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
    fontSize: "19px",
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
    color: "#7c3aed",
    fontSize: "23px",
    cursor: "pointer",
    padding: 0,
  },

  botaoLuz: {
    border: "none",
    background: "transparent",
    color: "#ec4899",
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
  flexDirection: "column",
  gap: "8px",
  marginBottom: "10px",
},

  linhaInputs: {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "8px",
},

  input: {
    height: "34px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    padding: "0 8px",
    fontSize: "11px",
    minWidth: 0,
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

  subtitulo: {
    margin: "0 0 5px",
    color: "#1e293b",
    fontSize: "15px",
    fontWeight: "900",
  },

  guardioesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "5px",
    marginBottom: "6px",
  },

  cardGuardiao: {
    height: "58px",
    border: "none",
    borderRadius: "13px",
    background: "linear-gradient(135deg, #7c3aed, #ec4899)",
    color: "white",
    fontSize: "8.5px",
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
    minHeight: "205px",
    maxHeight: "280px",
    border: "2px dashed #cbd5e1",
    borderRadius: "16px",
    background: "white",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    overflow: "hidden",
  },

  noArvore: {
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

  avatarNo: {
    fontSize: "14px",
  },

  nomeNo: {
    fontSize: "7.5px",
    fontWeight: "900",
    color: "#475569",
    textAlign: "center",
    lineHeight: "1",
  },

  valorNo: {
    fontSize: "7px",
    color: "#64748b",
    fontWeight: "bold",
  },

  raiz: {
    position: "absolute",
    top: "-15px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#ec4899",
    color: "white",
    fontSize: "7px",
    padding: "2px 6px",
    borderRadius: "999px",
    fontWeight: "900",
    whiteSpace: "nowrap",
  },

  busca: {
    position: "absolute",
    bottom: "-15px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#7c3aed",
    color: "white",
    fontSize: "7px",
    padding: "2px 6px",
    borderRadius: "999px",
    fontWeight: "900",
    whiteSpace: "nowrap",
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
    padding: "7px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
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

  vazio: {
    color: "#94a3b8",
    fontWeight: "bold",
    fontSize: "12px",
  },
};

export default LabirintoArvore;