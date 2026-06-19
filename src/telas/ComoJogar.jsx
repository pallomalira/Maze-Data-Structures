function ComoJogar({ voltar }) {
  return (
    <div style={pagina}>
      <div style={card}>

        <header style={topo}>
          <button onClick={voltar} style={botaoVoltar}>
            <span style={setaVoltar}>←</span>
            <span>Menu</span>
          </button>

          <h1 style={tituloTopo}>Como jogar</h1>

          <div style={espacoTopo} />
        </header>

        <section style={conteudo}>
          <div style={icone}>📘</div>

          <h2 style={titulo}>Guia da jornada</h2>

          <p style={subtitulo}>
            Recupere os fragmentos do Núcleo resolvendo desafios de Estruturas
            de Dados.
          </p>

          <div style={caixa}>
            <div style={linha}>
              <span style={emoji}>🗺️</span>
              <p>Escolha uma fase liberada no mapa.</p>
            </div>

            <div style={linha}>
              <span style={emoji}>📖</span>
              <p>Leia a história e a dica da fase.</p>
            </div>

            <div style={linha}>
              <span style={emoji}>💡</span>
              <p>Use o tutorial para entender cada parte da tela.</p>
            </div>

            <div style={linha}>
              <span style={emoji}>🧩</span>
              <p>Resolva o desafio interativo da estrutura.</p>
            </div>

            <div style={linha}>
              <span style={emoji}>🎒</span>
              <p>Colete os fragmentos no inventário.</p>
            </div>

            <div style={linha}>
              <span style={emoji}>💎</span>
              <p>Junte tudo para liberar o Núcleo Final.</p>
            </div>
          </div>

          <div style={caixaEstruturas}>
            <strong style={tituloEstruturas}>Estruturas da jornada</strong>

            <div style={tags}>
              <span style={tag}>Fila</span>
              <span style={tag}>Pilha</span>
              <span style={tag}>Lista</span>
              <span style={tag}>Árvore</span>
              <span style={tag}>Grafo</span>
            </div>
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
  padding: "20px 18px 18px",
  boxSizing: "border-box",
  overflowY: "auto",
  textAlign: "center",
};

const icone = {
  width: "58px",
  height: "58px",
  borderRadius: "50%",
  margin: "0 auto 12px",
  background: "linear-gradient(135deg, #7c3aed, #ec4899)",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "28px",
  boxShadow: "0 8px 18px rgba(124,58,237,0.22)",
};

const titulo = {
  fontSize: "26px",
  fontWeight: "900",
  color: "#1e293b",
  margin: "0 0 8px",
};

const subtitulo = {
  fontSize: "13px",
  color: "#64748b",
  lineHeight: "1.6",
  fontWeight: "700",
  margin: "0 auto 18px",
  maxWidth: "330px",
};

const caixa = {
  width: "100%",
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "20px",
  padding: "12px",
  textAlign: "left",
  boxSizing: "border-box",
};

const linha = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  background: "white",
  borderRadius: "14px",
  padding: "9px 10px",
  marginBottom: "8px",
  color: "#475569",
  fontSize: "12px",
  fontWeight: "800",
};

const emoji = {
  width: "28px",
  height: "28px",
  borderRadius: "50%",
  background: "#ede9fe",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const caixaEstruturas = {
  marginTop: "12px",
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "18px",
  padding: "12px",
};

const tituloEstruturas = {
  display: "block",
  color: "#1e293b",
  fontSize: "13px",
  fontWeight: "900",
  marginBottom: "10px",
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
  fontSize: "11px",
  fontWeight: "900",
};

export default ComoJogar;