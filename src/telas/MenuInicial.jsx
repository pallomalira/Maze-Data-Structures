import React from "react";
import { motion } from "framer-motion";

function MenuInicial({
  iniciar,
  continuar,
  mostrarContinuar,
  abrirComoJogar,
  abrirSobre,
}) {
  return (
    <div style={pagina}>
      <motion.div
        initial={{ scale: 0.96, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        style={card}
      >
        <span style={versao}>v1.0</span>

        <section style={logoContainer}>
          <motion.div
            animate={{ rotate: [0, 8, -8, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            style={iconeLogo}
          >
            🧩
          </motion.div>

          <h1 style={titulo}>MAZE</h1>
          <h2 style={subtitulo}>DATA STRUCTURES</h2>
        </section>

        <p style={descricao}>
          Aprenda Estruturas de Dados explorando fases, desafios e fragmentos do
          conhecimento.
        </p>

        <div style={containerBotoes}>
          {mostrarContinuar && (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={continuar}
              style={botaoPrincipal}
            >
              ▶ Continuar jogo
            </motion.button>
          )}

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={iniciar}
            style={botaoPrincipal}
          >
            🆕 Novo jogo
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={abrirComoJogar}
            style={botaoSecundario}
          >
            📘 Como jogar
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={abrirSobre}
            style={botaoSecundario}
          >
            ℹ️ Sobre o jogo
          </motion.button>
        </div>

        <footer style={footer}>
          <span>Jogo educativo</span>
          <strong>Estruturas de Dados</strong>
        </footer>
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
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  padding: "26px 20px 18px",
  boxSizing: "border-box",
  overflow: "hidden",
};

const versao = {
  position: "absolute",
  top: "18px",
  right: "20px",
  fontSize: "11px",
  fontWeight: "900",
  color: "#94a3b8",
};

const logoContainer = {
  marginTop: "44px",
  marginBottom: "18px",
};

const iconeLogo = {
  fontSize: "64px",
  lineHeight: 1,
  marginBottom: "8px",
  filter: "drop-shadow(0 10px 18px rgba(124,58,237,0.18))",
};

const titulo = {
  fontSize: "46px",
  fontWeight: "900",
  color: "#1e293b",
  margin: 0,
  letterSpacing: "6px",
  lineHeight: "0.95",
};

const subtitulo = {
  fontSize: "14px",
  fontWeight: "900",
  color: "#818cf8",
  margin: "6px 0 0",
  letterSpacing: "2px",
};

const descricao = {
  maxWidth: "330px",
  fontSize: "13px",
  color: "#64748b",
  lineHeight: "1.6",
  fontWeight: "700",
  margin: "0 0 24px",
};

const containerBotoes = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  marginTop: "4px",
};

const botaoPrincipal = {
  width: "100%",
  height: "46px",
  background: "linear-gradient(135deg, #7c3aed, #ec4899)",
  border: "none",
  borderRadius: "999px",
  color: "white",
  fontWeight: "900",
  fontSize: "14px",
  cursor: "pointer",
  boxShadow: "0 8px 18px rgba(124,58,237,0.22)",
};

const botaoSecundario = {
  width: "100%",
  height: "44px",
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "999px",
  color: "#475569",
  fontWeight: "900",
  fontSize: "13px",
  cursor: "pointer",
};

const footer = {
  marginTop: "auto",
  width: "100%",
  background: "#f8fafc",
  borderRadius: "16px",
  padding: "10px",
  color: "#64748b",
  fontSize: "11px",
  fontWeight: "700",
  display: "flex",
  flexDirection: "column",
  gap: "2px",
};

export default MenuInicial;