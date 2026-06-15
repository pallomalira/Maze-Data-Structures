function SobreJogo({ voltar }) {
  return (
    <div style={pagina}>
      <div style={card}>
        <span style={versao}>v1.0</span>

        <div style={icone}>🧩</div>

        <h1 style={titulo}>SOBRE O JOGO</h1>

        <p style={subtitulo}>
          Aprenda Estruturas de Dados enquanto explora o Reino do Conhecimento.
        </p>

        <div style={caixaTexto}>
          <p>
            <strong>Maze Data Structures</strong> é um jogo educativo de
            aventura criado para auxiliar no aprendizado de Estruturas de Dados.
          </p>

          <p>
            Durante a jornada, o jogador deverá recuperar os fragmentos do
            Núcleo do Conhecimento enfrentando desafios inspirados em conceitos
            fundamentais da computação.
          </p>

          <h3 style={tituloSecao}>Estruturas exploradas</h3>

          <p>🛡️ Fila (FIFO)</p>
          <p>📚 Pilha (LIFO)</p>
          <p>🌳 Árvore Binária</p>
          <p>🔗 Lista Encadeada</p>
          <p>🕸️ Grafos</p>
          <p>🧮 Tabela Hash</p>
          <p>🏔️ Heap</p>

          <p style={objetivo}>
            🎯 Objetivo: recuperar todos os fragmentos e restaurar o Núcleo do
            Conhecimento.
          </p>
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
  maxWidth: "760px",
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
  marginTop: "30px",
  marginBottom: "10px",
};

const titulo = {
  fontSize: "clamp(34px, 7vw, 62px)",
  fontWeight: "900",
  color: "#1e293b",
  margin: 0,
  letterSpacing: "3px",
  lineHeight: "1",
};

const subtitulo = {
  maxWidth: "560px",
  fontSize: "clamp(14px, 2vw, 17px)",
  color: "#64748b",
  lineHeight: "1.7",
  margin: "24px 0",
};

const caixaTexto = {
  width: "100%",
  maxWidth: "580px",
  background: "#f8fafc",
  border: "2px solid #e2e8f0",
  borderRadius: "18px",
  padding: "20px 24px",
  textAlign: "left",
  fontSize: "clamp(14px, 2vw, 16px)",
  color: "#475569",
  lineHeight: "1.7",
  boxSizing: "border-box",
};

const tituloSecao = {
  color: "#1e293b",
  marginTop: "20px",
};

const objetivo = {
  marginTop: "20px",
  color: "#9333ea",
  fontWeight: "bold",
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

export default SobreJogo;