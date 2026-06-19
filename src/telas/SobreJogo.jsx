function SobreJogo({ voltar }) {
  return (
    <div style={pagina}>
      <div style={card}>

        <header style={topo}>
          <button onClick={voltar} style={botaoVoltar}>
            <span style={setaVoltar}>←</span>
            <span>Menu</span>
          </button>

          <h1 style={tituloTopo}>Sobre o jogo</h1>

          <div style={espacoTopo} />
        </header>

        <section style={conteudo}>
          <div style={icone}>🧩</div>

          <h2 style={titulo}>Maze Data Structures</h2>

          <p style={subtitulo}>
            Um jogo educativo que transforma Estruturas de Dados em desafios
            interativos dentro de uma jornada.
          </p>

          <div style={caixaTexto}>
            <p>
              Durante a aventura, o jogador recupera fragmentos do Núcleo do
              Conhecimento passando por fases inspiradas em conceitos
              fundamentais da computação.
            </p>

            <p>
              Cada fase apresenta uma estrutura diferente com história, dica,
              tutorial e desafios práticos.
            </p>
          </div>

          <div style={caixaEstruturas}>
            <strong style={tituloEstruturas}>Estruturas exploradas</strong>

            <div style={tags}>
              <span style={tag}>Fila</span>
              <span style={tag}>Pilha</span>
              <span style={tag}>Lista</span>
              <span style={tag}>Árvore</span>
              <span style={tag}>Grafo</span>
            </div>
          </div>

          <div style={objetivo}>
            🎯 Recupere os fragmentos e restaure o Núcleo do Conhecimento.
          </div>
        </section>
      </div>
    </div>
  );
}

const pagina = {
  width: "100vw",
  minHeight: "100svh",
  background: "#f8fafc",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "8px",
  boxSizing: "border-box",
  fontFamily: "'Inter', sans-serif",
  overflow: "hidden",
};

const card = {
  width: "100%",
  maxWidth: "430px",
  height: "calc(100svh - 16px)",
  background: "white",
  borderRadius: "24px",
  boxShadow: "0 20px 45px rgba(15,23,42,0.14)",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  boxSizing: "border-box",
  position: "relative",
};

const versao = {
  position: "absolute",
  top: "18px",
  right: "20px",
  fontSize: "11px",
  fontWeight: "900",
  color: "#94a3b8",
};

const topo = {
  height: "54px",
  display: "grid",
  gridTemplateColumns: "1fr auto 1fr",
  alignItems: "center",
  borderBottom: "1px solid #e2e8f0",
  padding: "0 14px",
  boxSizing: "border-box",
  flexShrink: 0,
};

const botaoVoltar = {
  border: "none",
  background: "transparent",
  color: "#1e293b",
  fontSize: "18px",
  fontWeight: "900",
  display: "flex",
  alignItems: "center",
  gap: "6px",
  padding: 0,
  cursor: "pointer",
};

const setaVoltar = {
  fontSize: "25px",
  lineHeight: 1,
  fontWeight: "400",
};

const tituloTopo = {
  margin: 0,
  color: "#1e293b",
  fontSize: "19px",
  fontWeight: "900",
  whiteSpace: "nowrap",
};

const espacoTopo = {
  width: "50px",
};

const conteudo = {
  flex: 1,
  padding: "14px 14px 16px",
  boxSizing: "border-box",
  overflow: "hidden",
  textAlign: "center",
};

const icone = {
  width: "54px",
  height: "54px",
  borderRadius: "50%",
  margin: "0 auto 10px",
  background: "linear-gradient(135deg, #7c3aed, #ec4899)",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "27px",
  boxShadow: "0 8px 18px rgba(124,58,237,0.22)",
};

const titulo = {
  fontSize: "23px",
  fontWeight: "900",
  color: "#1e293b",
  margin: "0 0 8px",
};

const subtitulo = {
  fontSize: "12px",
  color: "#64748b",
  lineHeight: "1.45",
  fontWeight: "700",
  margin: "0 auto 12px",
  maxWidth: "340px",
};

const caixaTexto = {
  width: "100%",
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "18px",
  padding: "12px",
  textAlign: "center",
  fontSize: "11px",
  color: "#475569",
  lineHeight: "1.45",
  fontWeight: "700",
  boxSizing: "border-box",
};

const caixaEstruturas = {
  marginTop: "10px",
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "18px",
  padding: "11px",
};

const tituloEstruturas = {
  display: "block",
  color: "#1e293b",
  fontSize: "12px",
  fontWeight: "900",
  marginBottom: "8px",
};

const tags = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: "6px",
};

const tag = {
  padding: "6px 10px",
  borderRadius: "999px",
  background: "#ede9fe",
  color: "#7c3aed",
  fontSize: "10px",
  fontWeight: "900",
};

const objetivo = {
  marginTop: "10px",
  background: "#f8fafc",
  borderRadius: "16px",
  padding: "10px",
  color: "#7c3aed",
  fontSize: "11px",
  fontWeight: "900",
  lineHeight: "1.4",
};

export default SobreJogo;