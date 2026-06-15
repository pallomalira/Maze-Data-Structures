function ComoJogar({ voltar }) {
  return (
    <div style={pagina}>
      <div style={card}>
        <span style={versao}>v1.0</span>

        <div style={icone}>📘</div>

        <h1 style={titulo}>COMO JOGAR</h1>

        <p style={subtitulo}>
          Recupere os fragmentos do Núcleo do Conhecimento resolvendo desafios
          de Estruturas de Dados.
        </p>

        <div style={caixa}>
          <p>🎯 Escolha uma fase no mapa.</p>
          <p>💡 Leia a regra de cada estrutura.</p>
          <p>🧩 Resolva o desafio interativo.</p>
          <p>🎒 Colete os fragmentos.</p>
          <p>🌌 Complete tudo para liberar o Núcleo Final.</p>
        </div>

        <div style={caixaPequena}>
          <strong>Estruturas:</strong>
          <p>Fila • Pilha • Árvore • Lista • Grafos • Hash • Heap</p>
        </div>

        <button onClick={voltar} style={botao}>
          ← VOLTAR AO MENU
        </button>
      </div>
    </div>
  );
}

const pagina = {
  minHeight: "100vh",
  background:
    "linear-gradient(to bottom, #c084fc 0%, #818cf8 50%, #fbcfe8 100%)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
  boxSizing: "border-box",
  fontFamily: "'Inter', sans-serif",
};

const card = {
  width: "100%",
  maxWidth: "700px",
  minHeight: "600px",
  background: "rgba(255,255,255,0.88)",
  backdropFilter: "blur(15px)",
  borderRadius: "28px",
  padding: "clamp(24px, 4vw, 50px)",
  boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)",
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
};

const versao = {
  position: "absolute",
  top: "24px",
  right: "32px",
  fontSize: "12px",
  fontWeight: "bold",
  color: "#94a3b8",
  letterSpacing: "1px",
};

const icone = {
  fontSize: "clamp(60px, 10vw, 100px)",
  marginTop: "40px",
  marginBottom: "10px",
};

const titulo = {
  fontSize: "clamp(36px, 7vw, 64px)",
  fontWeight: "900",
  color: "#1e293b",
  margin: 0,
  letterSpacing: "3px",
  lineHeight: "1",
};

const subtitulo = {
  maxWidth: "500px",
  fontSize: "clamp(14px, 2vw, 17px)",
  color: "#64748b",
  lineHeight: "1.7",
  margin: "28px 0",
};

const caixa = {
  width: "100%",
  maxWidth: "500px",
  background: "#f8fafc",
  border: "2px solid #e2e8f0",
  borderRadius: "18px",
  padding: "18px 22px",
  textAlign: "left",
  fontSize: "clamp(14px, 2vw, 16px)",
  color: "#475569",
  lineHeight: "1.6",
  boxSizing: "border-box",
};

const caixaPequena = {
  width: "100%",
  maxWidth: "500px",
  background: "rgba(129, 140, 248, 0.12)",
  border: "2px solid rgba(129, 140, 248, 0.35)",
  borderRadius: "18px",
  padding: "14px 18px",
  marginTop: "16px",
  fontSize: "clamp(13px, 2vw, 15px)",
  color: "#475569",
  boxSizing: "border-box",
};

const botao = {
  width: "100%",
  maxWidth: "420px",
  padding: "17px",
  background: "#9333ea",
  border: "none",
  borderRadius: "18px",
  color: "white",
  fontWeight: "900",
  fontSize: "15px",
  cursor: "pointer",
  boxShadow: "0 10px 20px rgba(147, 51, 234, 0.3)",
  letterSpacing: "1px",
  marginTop: "28px",
};

export default ComoJogar;