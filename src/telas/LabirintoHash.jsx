import { useState } from "react";
import { motion } from "framer-motion";

function LabirintoHash({ voltar, concluir }) {
  const TAMANHO = 7;

  const chavesIniciais = [
    { codigo: 15, nome: "Chave Solar", icone: "🔑", energia: "Energia Solar" },
    { codigo: 22, nome: "Chave Lunar", icone: "🗝️", energia: "Energia Lunar" },
    { codigo: 35, nome: "Chave Cristal", icone: "💎", energia: "Energia Cristalina" },
    { codigo: 7, nome: "Chave Arcana", icone: "✨", energia: "Energia Arcana" },
  ];

  const criarTabela = () => Array(TAMANHO).fill(null);

  const [etapa, setEtapa] = useState(0);
  const [chaves, setChaves] = useState(chavesIniciais);
  const [gavetas, setGavetas] = useState(criarTabela());
  const [dragged, setDragged] = useState(null);
  const [gavetaDestacada, setGavetaDestacada] = useState(null);
  const [indiceBuscaHash, setIndiceBuscaHash] = useState(null);
  const [concluido, setConcluido] = useState(false);
  const [mostrarHistoria, setMostrarHistoria] = useState(true);
  const [portaAberta, setPortaAberta] = useState(false);

  const [novoNome, setNovoNome] = useState("");
  const [gavetaSelecionada, setGavetaSelecionada] = useState(null);
  const [gavetaAtualizada, setGavetaAtualizada] = useState(null);

  const [mensagem, setMensagem] = useState(
    "Clique em COMEÇAR para iniciar o desafio da Hash."
  );

  function calcularGaveta(codigo) {
    return codigo % TAMANHO;
  }

  function iniciarFase() {
    setEtapa(1);
    setMensagem(
      "📥 GUARDAR CHAVES\n\nArraste as chaves para o Cofre Hash.\n\nCada chave tem um Código Mágico.\n\nA gaveta é calculada assim:\n\nCódigo % 7"
    );
  }

  function inserirComProbing(item) {
    const inicio = calcularGaveta(item.codigo);
    let indice = inicio;
    const novaTabela = [...gavetas];
    const caminho = [];

    for (let tentativa = 0; tentativa < TAMANHO; tentativa++) {
      caminho.push(indice);

      if (novaTabela[indice] === null) {
        novaTabela[indice] = item;

        return {
          novaTabela,
          inicio,
          final: indice,
          caminho,
          colisao: inicio !== indice,
        };
      }

      indice = (indice + 1) % TAMANHO;
    }

    return null;
  }

  function guardarChave(index) {
    if (etapa !== 1) return;

    const chave = chaves[index];
    const resultado = inserirComProbing(chave);

    if (!resultado) {
      setMensagem("❌ O cofre está cheio.");
      return;
    }

    setGavetas(resultado.novaTabela);
    setChaves(chaves.filter((_, i) => i !== index));
    setDragged(null);
    setGavetaDestacada(resultado.final);

    const textoColisao = resultado.colisao
      ? `\n\n⚠️ COLISÃO!\n\nA gaveta ${resultado.inicio} já estava ocupada.\n\nEntão usamos probing:\n${resultado.caminho.join(
          " → "
        )}\n\nA chave foi guardada na gaveta ${resultado.final}.`
      : `\n\nSem colisão.\n\nA chave foi guardada direto na gaveta ${resultado.final}.`;

    if (chaves.length - 1 === 0) {
      setEtapa(2);
      setIndiceBuscaHash(1);
      setGavetaDestacada(1);
      setMensagem(
        "🔍 ENCONTRAR A CHAVE\n\nA porta precisa da Chave Solar.\n\nCódigo da Chave Solar: 15\n\nPrimeiro calculamos:\n\n15 % 7 = 1\n\nA busca começa na gaveta 1.\n\nSe não estiver ali, seguimos gaveta por gaveta por causa do probing.\n\nClique na gaveta marcada como VERIFICAR."
      );
    } else {
      setMensagem(
        `✅ Guardando chave:\n\n${chave.icone} ${chave.nome}\nCódigo: ${chave.codigo}\n\nCálculo:\n${chave.codigo} % 7 = ${resultado.inicio}${textoColisao}`
      );
    }
  }

  function clicarGaveta(indice) {
    if (etapa === 2) {
      if (indice !== indiceBuscaHash) {
        setMensagem(
          "❌ Você pulou a ordem.\n\nNa Hash com probing, começamos na gaveta calculada e seguimos uma por uma.\n\nClique na gaveta marcada como VERIFICAR."
        );
        return;
      }

      const item = gavetas[indice];

      if (item && item.codigo === 15) {
        setGavetaDestacada(indice);
        setEtapa(3);
        setMensagem(
          "✅ Chave Solar encontrada!\n\nVocê começou na gaveta calculada: 15 % 7 = 1.\n\nAgora clique na Chave Solar, digite o novo nome e aperte ATUALIZAR."
        );
        return;
      }

      const proximo = (indice + 1) % TAMANHO;

      setIndiceBuscaHash(proximo);
      setGavetaDestacada(proximo);
      setMensagem(
        `🔍 Gaveta ${indice} verificada.\n\nEncontramos ${item?.nome || "nada"}, mas ainda não é a Chave Solar.\n\nComo usamos probing, seguimos para a próxima gaveta.\n\nClique na gaveta ${proximo}.`
      );

      return;
    }

    if (etapa === 5) {
      if (indice === 2) {
        setMensagem(
          "🏆 Perfeito!\n\n16 % 7 = 2.\n\nVocê entendeu a lógica da Hash:\n\nCódigo → cálculo → gaveta → busca por probing quando necessário."
        );
        setConcluido(true);
      } else {
        setMensagem(
          "❌ Ainda não.\n\nCalcule:\n\n16 % 7 = ?\n\nClique na gaveta correta."
        );
      }
    }
  }

  function escolherChaveParaAtualizar(indice) {
    if (etapa !== 3) return;

    const item = gavetas[indice];

    if (!item || item.codigo !== 15) {
      setMensagem("❌ Essa não é a chave certa.\n\nSelecione a Chave Solar.");
      return;
    }

    setGavetaSelecionada(indice);
    setMensagem(
      "✅ Chave selecionada.\n\nDigite o novo nome da chave e clique em ATUALIZAR.\n\nO código continua o mesmo, então ela continua na mesma gaveta."
    );
  }

  function confirmarAtualizacao() {
    if (etapa !== 3) return;

    if (gavetaSelecionada === null) {
      setMensagem("❌ Primeiro selecione a Chave Solar.");
      return;
    }

    if (novoNome.trim() === "") {
      setMensagem("❌ Digite um novo nome antes de atualizar.");
      return;
    }

    const novaTabela = [...gavetas];

    novaTabela[gavetaSelecionada] = {
      ...novaTabela[gavetaSelecionada],
      nome: novoNome.trim(),
      icone: "🔆",
    };

    setGavetas(novaTabela);
    setGavetaAtualizada(gavetaSelecionada);
    setGavetaSelecionada(null);
    setNovoNome("");
    setEtapa(4);

    setMensagem(
      "✏️ Chave atualizada!\n\nNa Hash, atualizar altera o valor guardado na gaveta.\n\nO código continua 15, então a posição calculada continua sendo:\n\n15 % 7 = 1\n\nAgora arraste essa chave atualizada até a porta para liberar a energia."
    );
  }

  function abrirPorta() {
    if (etapa !== 4) return;

    if (!dragged || dragged.tipo !== "gaveta") return;

    const item = gavetas[dragged.indice];

    if (!item || dragged.indice !== gavetaAtualizada || item.codigo !== 15) {
      setMensagem("❌ Essa chave não abre a porta.\n\nArraste a chave atualizada.");
      setDragged(null);
      return;
    }

    const novaTabela = [...gavetas];
    novaTabela[dragged.indice] = null;

    setGavetas(novaTabela);
    setDragged(null);
    setPortaAberta(true);
    setEtapa(5);
    setMensagem(
      "🔓 Porta aberta!\n\nAo usar a chave, removemos ela da gaveta.\n\nDESAFIO FINAL:\n\nUma nova chave apareceu:\n\n🗝️ Chave Estelar\nCódigo: 16\n\nEm qual gaveta ela deve ficar?\n\nCalcule: 16 % 7 = ?"
    );
  }

  function soltarParaAdicionar() {
    if (!dragged || dragged.tipo !== "chave") return;
    guardarChave(dragged.index);
  }

  function resetar() {
    setEtapa(0);
    setChaves(chavesIniciais);
    setGavetas(criarTabela());
    setDragged(null);
    setGavetaDestacada(null);
    setIndiceBuscaHash(null);
    setConcluido(false);
    setMostrarHistoria(true);
    setPortaAberta(false);
    setNovoNome("");
    setGavetaSelecionada(null);
    setGavetaAtualizada(null);
    setMensagem("Clique em COMEÇAR para iniciar o desafio da Hash.");
  }

  function renderGavetas() {
    return (
      <div style={estilos.gavetasGrid}>
        {gavetas.map((item, indice) => {
          const destacada =
            gavetaDestacada === indice || (etapa === 5 && indice === 2);

          const selecionada = gavetaSelecionada === indice;
          const atualizada = gavetaAtualizada === indice;

          return (
            <div key={indice} style={estilos.gavetaBox}>
              <div
                onClick={() => clicarGaveta(indice)}
                style={{
                  ...estilos.gaveta,
                  border:
                    destacada || selecionada || atualizada
                      ? "3px solid #ec4899"
                      : "2px solid #cbd5e1",
                  cursor: etapa === 2 || etapa === 5 ? "pointer" : "default",
                }}
              >
                {destacada && etapa !== 3 && etapa !== 4 && (
                  <span style={estilos.selo}>VERIFICAR</span>
                )}

                {item ? (
                  <motion.div
                    draggable={etapa === 4 && atualizada}
                    whileHover={{ scale: 1.05 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      escolherChaveParaAtualizar(indice);
                    }}
                    onDragStart={() => setDragged({ tipo: "gaveta", indice })}
                    style={{
                      ...estilos.itemNaGaveta,
                      background:
                        item.codigo === 15 ? "#ec4899" : "#818cf8",
                      cursor:
                        etapa === 3 || (etapa === 4 && atualizada)
                          ? "pointer"
                          : "default",
                    }}
                  >
                    {etapa === 3 && item.codigo === 15 && (
                      <span style={estilos.seloItem}>ATUALIZAR</span>
                    )}

                    {selecionada && (
                      <span style={estilos.seloItemVerde}>SELECIONADA</span>
                    )}

                    {atualizada && (
                      <span style={estilos.seloItemVerde}>ATUALIZADA</span>
                    )}

                    <span style={estilos.iconeItem}>{item.icone}</span>
                    <span>{item.nome}</span>
                    <small>Código {item.codigo}</small>
                  </motion.div>
                ) : (
                  <span style={estilos.vazio}>vazia</span>
                )}
              </div>

              <div style={estilos.indice}>Gaveta {indice}</div>
            </div>
          );
        })}
      </div>
    );
  }

  if (concluido) {
    return (
      <div style={estilos.pagina}>
        <div style={estilos.cardConclusao}>
          <button onClick={voltar} style={estilos.botaoVoltar}>
            ← VOLTAR
          </button>

          <div style={estilos.icone}>🏆</div>

          <h1 style={estilos.titulo}>HASH CONCLUÍDA!</h1>

          <div style={estilos.resumoBox}>
            <p>🔑 Chave: identifica o item procurado.</p>
            <p>🧮 Função Hash: calcula a gaveta.</p>
            <p>🗄️ Gaveta: posição onde a chave fica.</p>
            <p>⚠️ Colisão: quando uma gaveta já está ocupada.</p>
            <p>➡️ Probing: procurar a próxima gaveta livre.</p>
          </div>

          <button onClick={concluir} style={estilos.botaoPrincipal}>
            ➜ PRÓXIMA FASE
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={estilos.pagina}>
      <div style={estilos.container}>
        <div style={estilos.barraTopo}>
          <button onClick={voltar} style={estilos.botaoVoltar}>
            ← VOLTAR AO MAPA
          </button>

          <button
            onClick={() => setMostrarHistoria(true)}
            style={estilos.botaoHistoria}
          >
            📜 História
          </button>
        </div>

        <div style={estilos.header}>
          <h1 style={estilos.titulo}>MUNDO DO HASH</h1>
          <p style={estilos.regra}>Código → Código % 7 → Gaveta</p>
        </div>

        <div style={estilos.etapas}>
          {[
            "História",
            "Guardar",
            "Buscar",
            "Atualizar",
            "Abrir porta",
            "Desafio",
          ].map((nome, index) => (
            <div
              key={nome}
              style={{
                ...estilos.etapaBox,
                background: etapa === index ? "#ec4899" : "#e2e8f0",
                color: etapa === index ? "white" : "#475569",
              }}
            >
              {index}. {nome}
            </div>
          ))}
        </div>

        <div style={estilos.mensagemEtapa}>{mensagem}</div>

        {etapa === 0 && (
          <div style={estilos.introBox}>
            <div style={estilos.caixaTema}>🔑 Cofre das Chaves</div>

            <button onClick={iniciarFase} style={estilos.botaoPrincipal}>
              COMEÇAR
            </button>
          </div>
        )}

        {etapa === 1 && (
          <div style={estilos.conteudoDesafio}>
            <div style={estilos.coluna}>
              <h2 style={estilos.tituloCaixa}>Chaves disponíveis</h2>

              <div style={estilos.disponiveisContainer}>
                {chaves.map((item, index) => (
                  <motion.div
                    key={item.codigo}
                    draggable
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => guardarChave(index)}
                    onDragStart={() => setDragged({ tipo: "chave", index })}
                    style={estilos.itemDraggable}
                  >
                    <span style={estilos.avatar}>{item.icone}</span>
                    <span>{item.nome}</span>
                    <small>Código {item.codigo}</small>
                    <small>
                      {item.codigo} % 7 = {calcularGaveta(item.codigo)}
                    </small>
                  </motion.div>
                ))}
              </div>
            </div>

            <div style={estilos.coluna}>
              <h2 style={estilos.tituloCaixa}>Gavetas do cofre</h2>

              <div
                style={estilos.zonaDrop}
                onDragOver={(e) => e.preventDefault()}
                onDrop={soltarParaAdicionar}
              >
                {renderGavetas()}
              </div>
            </div>
          </div>
        )}

        {(etapa === 2 || etapa === 3 || etapa === 5) && (
          <div style={estilos.colunaGrande}>
            <h2 style={estilos.tituloCaixa}>Gavetas do cofre</h2>

            {etapa === 3 && (
              <div style={estilos.formAtualizacao}>
                <h3 style={estilos.tituloAtualizacao}>✏️ Atualizar chave</h3>

                <p style={estilos.textoAtualizacao}>
                  Clique na Chave Solar, digite o novo nome e confirme.
                </p>

                <input
                  type="text"
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  placeholder="Ex: Chave Solar Suprema"
                  style={estilos.inputAtualizacao}
                />

                <button
                  onClick={confirmarAtualizacao}
                  style={estilos.botaoAtualizar}
                >
                  ATUALIZAR
                </button>
              </div>
            )}

            {renderGavetas()}
          </div>
        )}

        {etapa === 4 && (
          <div style={estilos.conteudoDesafio}>
            <div style={estilos.coluna}>
              <h2 style={estilos.tituloCaixa}>Gavetas do cofre</h2>
              {renderGavetas()}
            </div>

            <div style={estilos.coluna}>
              <h2 style={estilos.tituloCaixa}>Porta de energia</h2>

              <div style={estilos.explicacaoRemocao}>
                <strong>Uso da chave</strong>
                <p>
                  A chave foi encontrada pela função hash. Agora ela será usada
                  para abrir a porta, então sairá da gaveta.
                </p>
              </div>

              <div
                style={estilos.porta}
                onDragOver={(e) => e.preventDefault()}
                onDrop={abrirPorta}
              >
                <span style={{ fontSize: "72px" }}>
                  {portaAberta ? "🔓" : "🚪"}
                </span>
                <span>
                  {portaAberta
                    ? "Porta aberta!"
                    : "Arraste a chave atualizada para cá"}
                </span>
              </div>
            </div>
          </div>
        )}

        <div style={estilos.caixaConceito}>
          <h3>📚 Conceito da Hash</h3>
          <p>
            <strong>Chave:</strong> identifica o item que queremos encontrar.
          </p>
          <p>
            <strong>Função Hash:</strong> calcula onde a chave fica.
          </p>
          <p>
            <strong>Gaveta:</strong> é a posição calculada.
          </p>
          <p>
            <strong>Colisão:</strong> quando duas chaves tentam usar a mesma gaveta.
          </p>
          <p>
            <strong>Probing:</strong> quando procuramos a próxima gaveta livre.
          </p>
        </div>

        <button onClick={resetar} style={estilos.botaoResetar}>
          ↻ RESETAR FASE
        </button>

        {mostrarHistoria && (
          <div style={estilos.fundoModal}>
            <div style={estilos.modalHistoria}>
              <h2>📜 HISTÓRIA</h2>

              <p>Você chegou ao Cofre Hash do Reino dos Dados.</p>

              <p>
                A próxima porta está trancada. Para continuar, você precisa
                encontrar a chave correta.
              </p>

              <p>Cada chave tem um Código Mágico:</p>

              <strong>O código calcula em qual gaveta a chave fica.</strong>

              <button
                onClick={() => setMostrarHistoria(false)}
                style={estilos.botaoEntendi}
              >
                ENTENDI
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const estilos = {
  pagina: {
    minHeight: "100vh",
    background: "#f3efff",
    padding: "20px",
    boxSizing: "border-box",
    fontFamily: "'Inter', sans-serif",
  },

  container: {
    width: "100%",
    maxWidth: "1100px",
    margin: "0 auto",
    background: "rgba(255,255,255,0.72)",
    borderRadius: "28px",
    padding: "clamp(20px, 4vw, 42px)",
    boxSizing: "border-box",
    position: "relative",
  },

  barraTopo: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },

  header: { textAlign: "center", marginBottom: "24px" },

  icone: { fontSize: "46px", marginBottom: "6px" },

  titulo: {
    fontSize: "clamp(38px, 6vw, 58px)",
    fontWeight: "900",
    color: "#1e293b",
    margin: 0,
  },

  regra: {
    color: "#9333ea",
    fontWeight: "900",
    fontSize: "20px",
    margin: "10px 0",
  },

  botaoVoltar: {
    background: "#9333ea",
    border: "none",
    borderRadius: "18px",
    color: "white",
    fontWeight: "900",
    padding: "12px 18px",
    cursor: "pointer",
    fontSize: "14px",
    flex: "1",
    minWidth: "150px",
  },

  botaoHistoria: {
    background: "#9333ea",
    color: "white",
    border: "none",
    borderRadius: "18px",
    padding: "12px 18px",
    fontWeight: "900",
    cursor: "pointer",
    fontSize: "14px",
    flex: "1",
    minWidth: "130px",
  },

  etapas: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
    gap: "10px",
    margin: "24px 0",
  },

  etapaBox: {
    padding: "12px",
    borderRadius: "16px",
    textAlign: "center",
    fontWeight: "900",
    fontSize: "13px",
  },

  mensagemEtapa: {
    background: "white",
    border: "2px solid #e2e8f0",
    borderRadius: "18px",
    padding: "16px",
    color: "#475569",
    fontSize: "14px",
    lineHeight: "1.7",
    whiteSpace: "pre-wrap",
    fontWeight: "700",
    marginBottom: "20px",
  },

  introBox: {
    background: "#f8fafc",
    border: "2px solid #e2e8f0",
    borderRadius: "22px",
    padding: "28px",
    textAlign: "center",
    marginBottom: "20px",
  },

  caixaTema: {
    fontSize: "34px",
    fontWeight: "900",
    color: "#9333ea",
    marginBottom: "14px",
  },

  conteudoDesafio: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
    marginBottom: "20px",
  },

  coluna: {
    background: "#f8fafc",
    border: "2px solid #e2e8f0",
    borderRadius: "20px",
    padding: "24px",
    color: "#475569",
    minHeight: "260px",
    boxSizing: "border-box",
    overflow: "hidden",
  },

  colunaGrande: {
    background: "#f8fafc",
    border: "2px solid #e2e8f0",
    borderRadius: "20px",
    padding: "24px",
    color: "#475569",
    minHeight: "260px",
    boxSizing: "border-box",
    marginBottom: "20px",
    overflow: "hidden",
  },

  tituloCaixa: {
    color: "#475569",
    marginTop: 0,
    fontSize: "24px",
    fontWeight: "900",
    textAlign: "center",
  },

  disponiveisContainer: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    padding: "16px",
    background: "white",
    borderRadius: "16px",
    minHeight: "120px",
    border: "2px solid #e2e8f0",
    justifyContent: "center",
    alignItems: "center",
  },

  itemDraggable: {
    padding: "14px",
    background: "#9333ea",
    color: "white",
    borderRadius: "14px",
    cursor: "grab",
    fontWeight: "900",
    fontSize: "12px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
    textAlign: "center",
    maxWidth: "150px",
  },

  avatar: { fontSize: "28px" },

  zonaDrop: {
    border: "2px dashed #9333ea",
    borderRadius: "18px",
    padding: "16px",
    minHeight: "220px",
    background: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflowX: "auto",
  },

  gavetasGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, minmax(80px, 1fr))",
    gap: "8px",
    width: "100%",
    minWidth: "620px",
  },

  gavetaBox: { textAlign: "center" },

  gaveta: {
    height: "105px",
    background: "white",
    borderRadius: "12px",
    padding: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    position: "relative",
  },

  indice: {
    color: "#4f46e5",
    fontWeight: "900",
    marginTop: "6px",
    fontSize: "12px",
  },

  vazio: {
    color: "#cbd5e1",
    fontSize: "12px",
    fontWeight: "bold",
  },

  itemNaGaveta: {
    color: "white",
    padding: "6px",
    borderRadius: "9px",
    fontWeight: "900",
    fontSize: "9px",
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    width: "100%",
    position: "relative",
  },

  iconeItem: { fontSize: "20px" },

  selo: {
    position: "absolute",
    top: "-12px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#9333ea",
    color: "white",
    fontSize: "9px",
    padding: "3px 7px",
    borderRadius: "999px",
    fontWeight: "900",
    zIndex: 2,
  },

  seloItem: {
    position: "absolute",
    top: "-12px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#9333ea",
    color: "white",
    fontSize: "8px",
    padding: "3px 6px",
    borderRadius: "999px",
    fontWeight: "900",
    zIndex: 2,
  },

  seloItemVerde: {
    position: "absolute",
    top: "-12px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#22c55e",
    color: "white",
    fontSize: "8px",
    padding: "3px 6px",
    borderRadius: "999px",
    fontWeight: "900",
    zIndex: 2,
  },

  explicacaoRemocao: {
    background: "white",
    border: "2px solid #e2e8f0",
    borderRadius: "18px",
    padding: "14px",
    color: "#64748b",
    fontSize: "14px",
    lineHeight: "1.6",
    marginBottom: "16px",
  },

  porta: {
    border: "3px dashed #ec4899",
    borderRadius: "22px",
    minHeight: "230px",
    background: "rgba(236,72,153,0.08)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#ec4899",
    fontWeight: "900",
    textAlign: "center",
    gap: "14px",
    padding: "20px",
  },

  formAtualizacao: {
    background: "white",
    border: "2px solid #e2e8f0",
    borderRadius: "18px",
    padding: "16px",
    marginBottom: "20px",
    textAlign: "center",
  },

  tituloAtualizacao: {
    margin: "0 0 6px",
    color: "#475569",
    fontWeight: "900",
  },

  textoAtualizacao: {
    margin: "0 0 10px",
    color: "#64748b",
    fontSize: "13px",
    fontWeight: "700",
  },

  inputAtualizacao: {
    width: "100%",
    maxWidth: "400px",
    padding: "12px",
    borderRadius: "12px",
    border: "2px solid #9333ea",
    fontSize: "15px",
    marginTop: "10px",
    marginBottom: "10px",
    boxSizing: "border-box",
  },

  botaoAtualizar: {
    padding: "12px 20px",
    background: "#9333ea",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  caixaConceito: {
    background: "white",
    border: "2px solid #e2e8f0",
    borderRadius: "18px",
    padding: "16px",
    fontSize: "14px",
    color: "#64748b",
    lineHeight: "1.6",
    marginTop: "20px",
  },

  botaoResetar: {
    width: "100%",
    padding: "13px",
    background: "#f43f5e",
    border: "none",
    borderRadius: "16px",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "18px",
  },

  fundoModal: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    backdropFilter: "blur(5px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 200,
  },

  modalHistoria: {
    width: "min(90%, 620px)",
    background: "white",
    borderRadius: "24px",
    padding: "32px",
    textAlign: "center",
    color: "#475569",
    fontWeight: "700",
    lineHeight: "1.8",
    boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
  },

  botaoEntendi: {
    marginTop: "24px",
    width: "100%",
    padding: "14px",
    background: "#9333ea",
    color: "white",
    border: "none",
    borderRadius: "16px",
    fontWeight: "900",
    cursor: "pointer",
  },

  cardConclusao: {
    width: "100%",
    maxWidth: "700px",
    margin: "0 auto",
    background: "rgba(255,255,255,0.88)",
    borderRadius: "28px",
    padding: "clamp(24px, 4vw, 50px)",
    textAlign: "center",
    boxSizing: "border-box",
  },

  resumoBox: {
    background: "#f8fafc",
    border: "2px solid #e2e8f0",
    padding: "20px",
    borderRadius: "18px",
    margin: "24px 0",
    textAlign: "left",
    color: "#475569",
    lineHeight: "1.7",
  },

  botaoPrincipal: {
    width: "100%",
    padding: "16px",
    background: "#9333ea",
    border: "none",
    borderRadius: "18px",
    color: "white",
    fontWeight: "900",
    fontSize: "15px",
    cursor: "pointer",
    marginTop: "10px",
  },
};

export default LabirintoHash;