import React from "react";
import { motion } from "framer-motion";

function Inventario({ pecas = [], fecharInventario }) {
  const todosFragmentos = [
    { id: 1, nome: "Fila", ingles: "Queue", icone: "🏪" },
    { id: 2, nome: "Pilha", ingles: "Stack", icone: "🏰" },
    { id: 3, nome: "Lista", ingles: "Linked List", icone: "🚪" },
    { id: 4, nome: "Árvore", ingles: "Tree", icone: "🌳" },
    { id: 5, nome: "Grafo", ingles: "Graph", icone: "🕸️" },
  ];

  const total = todosFragmentos.length;
  const coletadas = pecas.filter((p) =>
    todosFragmentos.some((item) => item.id === p.id)
  ).length;

  const temPeca = (id) => pecas.some((p) => p.id === id);

  return (
    <div style={pagina}>
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={card}
      >
        <header style={topo}>
          <button onClick={fecharInventario} style={botaoVoltar}>
            <span style={setaVoltar}>←</span>
            <span>Mapa</span>
          </button>

          <div style={tituloBox}>
            <span style={iconeTitulo}>🎒</span>
            <h1 style={titulo}>Inventário</h1>
          </div>

          <div style={espacoTopo} />
        </header>

        <section style={progressoBox}>
          <div style={progressoTexto}>
            <span>Fragmentos coletados</span>
            <strong>
              {coletadas}/{total}
            </strong>
          </div>

          <div style={barraProgressoContainer}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(coletadas / total) * 100}%` }}
              transition={{ duration: 0.7 }}
              style={barraProgresso}
            />
          </div>
        </section>

        <section style={gradeItens}>
          {todosFragmentos.map((item) => {
            const coletado = temPeca(item.id);

            return (
              <motion.div
                key={item.id}
                whileTap={coletado ? { scale: 0.96 } : {}}
                style={{
                  ...itemSlot,
                  opacity: coletado ? 1 : 0.55,
                  border: coletado
                    ? "2px solid #7c3aed"
                    : "2px dashed #cbd5e1",
                  background: coletado ? "white" : "#f8fafc",
                }}
              >
                <div
                  style={{
                    ...circuloItem,
                    background: coletado
                      ? "linear-gradient(135deg, #7c3aed, #ec4899)"
                      : "#e2e8f0",
                  }}
                >
                  {coletado ? item.icone : "🔒"}
                </div>

                <strong style={nomeItem}>{item.nome}</strong>
                <span style={inglesItem}>({item.ingles})</span>

                {coletado && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={seloCheck}
                  >
                    ✓
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </section>

        <section style={mensagemBox}>
          {coletadas === total ? (
            <p style={mensagemTexto}>
              Todos os fragmentos foram encontrados. O Núcleo está pronto para
              ser restaurado.
            </p>
          ) : (
            <p style={mensagemTexto}>
              Complete as fases para juntar todos os fragmentos do Reino
              MazeData.
            </p>
          )}
        </section>


      </motion.div>
    </div>
  );
}

const pagina = {
  width: "100vw",
  minHeight: "100svh",
  background: "#f8fafc",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
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

const tituloBox = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
};

const iconeTitulo = {
  fontSize: "21px",
};

const titulo = {
  margin: 0,
  color: "#1e293b",
  fontSize: "19px",
  fontWeight: "900",
};

const espacoTopo = {
  width: "50px",
};

const progressoBox = {
  margin: "12px",
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  padding: "12px",
  borderRadius: "18px",
  flexShrink: 0,
};

const progressoTexto = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: "12px",
  fontWeight: "900",
  color: "#64748b",
  marginBottom: "10px",
};

const barraProgressoContainer = {
  width: "100%",
  height: "10px",
  background: "#e2e8f0",
  borderRadius: "999px",
  overflow: "hidden",
};

const barraProgresso = {
  height: "100%",
  background: "linear-gradient(135deg, #7c3aed, #ec4899)",
  borderRadius: "999px",
};

const gradeItens = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "10px",
  padding: "0 12px",
  boxSizing: "border-box",
  flex: 1,
  overflowY: "auto",
};

const itemSlot = {
  minHeight: "112px",
  borderRadius: "20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  transition: "all 0.3s ease",
  boxSizing: "border-box",
  textAlign: "center",
  padding: "10px",
};

const circuloItem = {
  width: "44px",
  height: "44px",
  borderRadius: "50%",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "21px",
  marginBottom: "8px",
  boxShadow: "0 8px 18px rgba(124,58,237,0.18)",
};

const nomeItem = {
  fontSize: "13px",
  fontWeight: "900",
  color: "#334155",
  lineHeight: "1.1",
};

const inglesItem = {
  fontSize: "10px",
  fontWeight: "900",
  color: "#7c3aed",
  marginTop: "2px",
};

const seloCheck = {
  position: "absolute",
  top: "-6px",
  right: "-6px",
  width: "24px",
  height: "24px",
  background: "#22c55e",
  borderRadius: "50%",
  color: "white",
  fontSize: "13px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "2px solid white",
  fontWeight: "900",
};

const mensagemBox = {
  margin: "10px 12px 12px",
  background: "#f8fafc",
  borderRadius: "16px",
  padding: "10px",
  textAlign: "center",
  flexShrink: 0,
};

const mensagemTexto = {
  margin: 0,
  color: "#64748b",
  fontSize: "11px",
  fontWeight: "700",
  lineHeight: "1.5",
};

const botaoAcao = {
  margin: "10px 12px 12px",
  height: "38px",
  background: "linear-gradient(135deg, #7c3aed, #ec4899)",
  border: "none",
  borderRadius: "999px",
  color: "white",
  fontWeight: "900",
  fontSize: "13px",
  cursor: "pointer",
  boxShadow: "0 8px 18px rgba(124,58,237,0.22)",
  flexShrink: 0,
};

export default Inventario;