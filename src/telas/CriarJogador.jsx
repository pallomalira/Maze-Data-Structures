import React, { useState } from "react";
import { motion } from "framer-motion";

function CriarJogador({ continuar }) {
  const [nome, setNome] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [inputFocado, setInputFocado] = useState(false);

  function iniciar() {
    if (nome.trim() === "") {
      setMensagem("Digite o nome do jogador para continuar.");
      return;
    }

    continuar(nome);
  }

  return (
    <div style={pagina}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        style={card}
      >
        <span style={versao}>v1.0</span>

        <div style={logoContainer}>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            style={iconeLogo}
          >
            🧙
          </motion.div>

          <h1 style={titulo}>CRIAR</h1>
          <h2 style={subtitulo}>JOGADOR</h2>
        </div>

        <p style={descricao}>
          Escolha o nome do guardião que irá recuperar os fragmentos perdidos.
        </p>

        <div style={containerInputButton}>
          <label style={labelInput}>NOME DO JOGADOR</label>

          <input
            type="text"
            placeholder="Digite seu nome"
            value={nome}
            onFocus={() => setInputFocado(true)}
            onBlur={() => setInputFocado(false)}
            onChange={(e) => {
              setNome(e.target.value);
              setMensagem("");
            }}
            style={{
              ...inputField,
              borderColor: inputFocado ? "#818cf8" : "#e2e8f0",
            }}
          />

          {mensagem && <p style={mensagemErro}>{mensagem}</p>}

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={iniciar}
            style={botaoPrincipal}
          >
            ▶ CONTINUAR
          </motion.button>
        </div>

        <p style={footer}>Maze Data Structures • Criar perfil</p>
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
  maxWidth: "700px",
  minHeight: "600px",
  background: "rgba(255,255,255,0.88)",
  backdropFilter: "blur(15px)",
  borderRadius: "28px",
  padding: "clamp(24px, 4vw, 50px)",
  boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)",
  position: "relative",
  zIndex: 1,
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

const logoContainer = {
  marginTop: "40px",
  marginBottom: "28px",
};

const iconeLogo = {
  fontSize: "clamp(60px, 10vw, 100px)",
  marginBottom: "10px",
};

const titulo = {
  fontSize: "clamp(42px, 8vw, 72px)",
  fontWeight: "900",
  color: "#1e293b",
  margin: 0,
  letterSpacing: "4px",
  lineHeight: "1",
};

const subtitulo = {
  fontSize: "clamp(17px, 2.5vw, 26px)",
  fontWeight: "bold",
  color: "#818cf8",
  margin: 0,
  letterSpacing: "2px",
};

const descricao = {
  maxWidth: "460px",
  fontSize: "clamp(14px, 2vw, 17px)",
  color: "#64748b",
  lineHeight: "1.7",
  marginBottom: "36px",
};

const containerInputButton = {
  width: "100%",
  maxWidth: "420px",
  display: "flex",
  flexDirection: "column",
  gap: "15px",
  marginBottom: "36px",
};

const labelInput = {
  textAlign: "left",
  fontSize: "13px",
  fontWeight: "bold",
  color: "#1e293b",
  marginBottom: "4px",
  width: "100%",
};

const inputField = {
  width: "100%",
  padding: "15px 16px",
  borderRadius: "18px",
  border: "2px solid #e2e8f0",
  background: "#f8fafc",
  color: "#1e293b",
  fontSize: "15px",
  boxSizing: "border-box",
  outline: "none",
  transition: "border-color 0.3s ease",
};

const mensagemErro = {
  color: "#ef4444",
  fontSize: "13px",
  margin: "0",
  fontWeight: "bold",
  textAlign: "left",
};

const botaoPrincipal = {
  width: "100%",
  padding: "17px",
  background: "#9333ea",
  border: "none",
  borderRadius: "18px",
  color: "white",
  fontWeight: "900",
  fontSize: "16px",
  cursor: "pointer",
  boxShadow: "0 10px 20px rgba(147, 51, 234, 0.3)",
  letterSpacing: "1px",
  marginTop: "8px",
};

const footer = {
  marginTop: "auto",
  fontSize: "11px",
  color: "#94a3b8",
  fontWeight: "bold",
  textTransform: "uppercase",
  letterSpacing: "1px",
};

export default CriarJogador;