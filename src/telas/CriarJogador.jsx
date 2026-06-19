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

    continuar(nome.trim());
  }

  return (
    <div style={pagina}>
      <motion.div
          initial={{scale: 0.96, opacity: 0, y: 20}}
          animate={{scale: 1, opacity: 1, y: 0}}
          style={card}
      >


        <section style={logoContainer}>
          <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                y: [0, -6, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 3,
              }}
              style={iconeLogo}
          >
            🧙‍♂️
          </motion.div>

          <h1 style={tituloCriar}>CRIAR</h1>
          <h2 style={subtituloCriar}>JOGADOR</h2>
        </section>

        <section style={perfilBox}>
          <p style={descricao}>
            Escolha o nome do guardião que irá recuperar os fragmentos perdidos.
          </p>

          <label style={labelInput}>Nome do jogador</label>

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
              onKeyDown={(e) => {
                if (e.key === "Enter") iniciar();
              }}
              style={{
                ...inputField,
                borderColor: inputFocado ? "#7c3aed" : "#e2e8f0",
              }}
          />

          {mensagem && <p style={mensagemErro}>{mensagem}</p>}

          <motion.button whileTap={{scale: 0.97}} onClick={iniciar} style={botaoPrincipal}>
            ▶ Continuar
          </motion.button>
        </section>

        <footer style={footer}>
          <span>Maze Data Structures</span>
          <strong>Criar perfil</strong>
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
  marginTop: "38px",
  marginBottom: "18px",
};

const iconeLogo = {
  fontSize: "70px",
  lineHeight: 1,
  marginBottom: "8px",
  filter: "drop-shadow(0 10px 18px rgba(124,58,237,0.18))",
};

const titulo = {
  fontSize: "42px",
  fontWeight: "900",
  color: "#1e293b",
  margin: 0,
  letterSpacing: "6px",
  lineHeight: "0.95",
};

const subtitulo = {
  fontSize: "13px",
  fontWeight: "900",
  color: "#818cf8",
  margin: "6px 0 0",
  letterSpacing: "2px",
};
const tituloCriar = {
  fontSize: "42px",
  fontWeight: "900",
  color: "#1e293b",
  margin: 0,
  letterSpacing: "4px",
  lineHeight: "0.95",
};

const subtituloCriar = {
  fontSize: "14px",
  fontWeight: "900",
  color: "#818cf8",
  margin: "6px 0 0",
  letterSpacing: "2px",
};

const perfilBox = {
  width: "100%",
  marginTop: "14px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};


const descricao = {
  maxWidth: "310px",
  fontSize: "12px",
  color: "#64748b",
  lineHeight: "1.5",
  fontWeight: "700",
  margin: "8px 0 18px",
};

const labelInput = {
  width: "100%",
  textAlign: "left",
  fontSize: "11px",
  fontWeight: "900",
  color: "#475569",
  marginBottom: "6px",
};

const inputField = {
  width: "100%",
  height: "44px",
  borderRadius: "14px",
  border: "1px solid #e2e8f0",
  background: "white",
  color: "#1e293b",
  fontSize: "14px",
  boxSizing: "border-box",
  outline: "none",
  transition: "all 0.25s ease",
  padding: "0 14px",
};

const mensagemErro = {
  width: "100%",
  color: "#ef4444",
  fontSize: "12px",
  margin: "8px 0 0",
  fontWeight: "800",
  textAlign: "left",
};

const botaoPrincipal = {
  width: "100%",
  height: "44px",
  background: "linear-gradient(135deg, #7c3aed, #ec4899)",
  border: "none",
  borderRadius: "999px",
  color: "white",
  fontWeight: "900",
  fontSize: "14px",
  cursor: "pointer",
  boxShadow: "0 8px 18px rgba(124,58,237,0.22)",
  marginTop: "14px",
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

export default CriarJogador;