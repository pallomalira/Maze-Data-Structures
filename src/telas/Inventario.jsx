import React from "react";
import { motion } from "framer-motion";

function Inventario({ pecas = [], fecharInventario }) {
const todosFragmentos = [
  { id: 1, nome: "Fila", icone: "🚶" },
  { id: 2, nome: "Pilha", icone: "📚" },
  { id: 3, nome: "Árvore", icone: "🌳" },
  { id: 4, nome: "Lista", icone: "🔗" },
  { id: 5, nome: "Grafo", icone: "🕸️" },
  { id: 6, nome: "Hash", icone: "🔐" },
  { id: 7, nome: "Heap", icone: "🏔️" },
];

  const temPeca = (id) => pecas.some((p) => p.id === id);

  return (
    <div style={pagina}>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={card}
      >
        <div style={barraSuperior}>
          <button onClick={fecharInventario} style={botaoVoltar}>
            ←
          </button>

          <div style={statusItem}>
            <span style={emojiStatus}>🎒</span>
            <span style={textoStatus}>INVENTÁRIO</span>
          </div>

          <div style={{ width: "40px" }} />
        </div>

        <div style={progressoBox}>
          <div style={progressoTexto}>
            <span>Coleção de Fragmentos</span>
            <span>{pecas.length}/7</span>
          </div>

          <div style={barraProgressoContainer}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(pecas.length / 7) * 100}%` }}
              style={barraProgresso}
            />
          </div>
        </div>

        <div style={gradeItens}>
          {todosFragmentos.map((item) => {
            const coletado = temPeca(item.id);

            return (
              <motion.div
                key={item.id}
                whileHover={coletado ? { scale: 1.05 } : {}}
                style={{
                  ...itemSlot,
                  opacity: coletado ? 1 : 0.45,
                  border: coletado
                    ? "3px solid #818cf8"
                    : "3px dashed #cbd5e1",
                  background: coletado ? "white" : "rgba(255,255,255,0.35)",
                }}
              >
                <div style={iconeItem}>{coletado ? item.icone : "❓"}</div>

                <span style={nomeItem}>{item.nome}</span>

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
        </div>

        <button onClick={fecharInventario} style={botaoAcao}>
          VOLTAR AO MAPA
        </button>
      </motion.div>
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
  minHeight: "650px",
  background: "rgba(255,255,255,0.88)",
  backdropFilter: "blur(15px)",
  borderRadius: "28px",
  padding: "clamp(24px, 4vw, 45px)",
  boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)",
  position: "relative",
  display: "flex",
  flexDirection: "column",
  boxSizing: "border-box",
};

const barraSuperior = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "30px",
};

const botaoVoltar = {
  width: "42px",
  height: "42px",
  borderRadius: "50%",
  background: "#9333ea",
  border: "none",
  fontSize: "20px",
  cursor: "pointer",
  color: "white",
  fontWeight: "bold",
  boxShadow: "0 8px 16px rgba(147,51,234,0.25)",
};

const statusItem = {
  background: "rgba(0,0,0,0.55)",
  padding: "8px 20px",
  borderRadius: "25px",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  color: "white",
  fontSize: "14px",
  fontWeight: "bold",
  letterSpacing: "1px",
};

const emojiStatus = {
  fontSize: "18px",
};

const textoStatus = {
  minWidth: "30px",
};

const progressoBox = {
  background: "#f8fafc",
  border: "2px solid #e2e8f0",
  padding: "20px",
  borderRadius: "24px",
  marginBottom: "30px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
};

const progressoTexto = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: "13px",
  fontWeight: "bold",
  color: "#64748b",
  marginBottom: "12px",
  textTransform: "uppercase",
};

const barraProgressoContainer = {
  width: "100%",
  height: "12px",
  background: "#e2e8f0",
  borderRadius: "20px",
  overflow: "hidden",
};

const barraProgresso = {
  height: "100%",
  background: "linear-gradient(to right, #f9a8d4, #ec4899)",
  borderRadius: "20px",
};

const gradeItens = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
  gap: "15px",
  flex: 1,
  overflowY: "auto",
  paddingBottom: "20px",
};

const itemSlot = {
  minHeight: "120px",
  borderRadius: "24px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  transition: "all 0.3s ease",
  boxSizing: "border-box",
};

const iconeItem = {
  fontSize: "34px",
  marginBottom: "8px",
};

const nomeItem = {
  fontSize: "12px",
  fontWeight: "bold",
  color: "#475569",
  textTransform: "uppercase",
};

const seloCheck = {
  position: "absolute",
  top: "-5px",
  right: "-5px",
  width: "24px",
  height: "24px",
  background: "#ec4899",
  borderRadius: "50%",
  color: "white",
  fontSize: "13px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "2px solid white",
  fontWeight: "bold",
};

const botaoAcao = {
  width: "100%",
  padding: "16px",
  background: "#9333ea",
  border: "none",
  borderRadius: "20px",
  color: "white",
  fontWeight: "900",
  fontSize: "16px",
  cursor: "pointer",
  boxShadow: "0 10px 20px rgba(147,51,234,0.3)",
  marginTop: "10px",
};

export default Inventario;