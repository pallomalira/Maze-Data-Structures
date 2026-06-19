import { useState } from "react";
import "./App.css";

import MenuInicial from "./telas/MenuInicial";
import CriarJogador from "./telas/CriarJogador";
import MapaFases from "./telas/MapaFases";

import LabirintoFila from "./telas/LabirintoFila";
import LabirintoPilha from "./telas/LabirintoPilha";
import LabirintoLista from "./telas/LabirintoLista";
import LabirintoArvore from "./telas/LabirintoArvore";
import LabirintoGrafo from "./telas/LabirintoGrafo";

import Inventario from "./telas/Inventario";
import TelaFinal from "./telas/TelaFinal";
import SobreJogo from "./telas/SobreJogo";
import ComoJogar from "./telas/ComoJogar";

const TELAS = {
  MENU: "menu",
  CRIAR: "criar",
  MAPA: "mapa",
  COMO_JOGAR: "comoJogar",
  SOBRE: "sobre",
  INVENTARIO: "inventario",
  FINAL: "final",
  FILA: "labirintoFila",
  PILHA: "labirintoPilha",
  LISTA: "labirintoLista",
  ARVORE: "labirintoArvore",
  GRAFO: "labirintoGrafo",
};

const FRAGMENTOS = {
  1: { id: 1, nome: "Fila", icone: "🏪" },
  2: { id: 2, nome: "Pilha", icone: "🏰" },
  3: { id: 3, nome: "Lista", icone: "🚪" },
  4: { id: 4, nome: "Árvore", icone: "🌳" },
  5: { id: 5, nome: "Grafo", icone: "🕸️" },
};

function App() {
  const [tela, setTela] = useState(TELAS.MENU);
  const [nomeJogador, setNomeJogador] = useState("");
  const [fasesLiberadas, setFasesLiberadas] = useState(1);
  const [pecas, setPecas] = useState([]);
  const [mostrarHistoriaMapa, setMostrarHistoriaMapa] = useState(false);
  const [jogoEmAndamento, setJogoEmAndamento] = useState(false);

  function voltarAoMenu() {
    setJogoEmAndamento(true);
    setTela(TELAS.MENU);
  }

  function novoJogo() {
    setNomeJogador("");
    setFasesLiberadas(1);
    setPecas([]);
    setMostrarHistoriaMapa(false);
    setJogoEmAndamento(false);
    setTela(TELAS.CRIAR);
  }

  function continuarJogo() {
    setTela(TELAS.MAPA);
  }

  function concluirFase(numeroFase) {
    const novaPeca = FRAGMENTOS[numeroFase];

    if (!novaPeca) return;

    setPecas((pecasAtuais) => {
      const jaExiste = pecasAtuais.some((p) => p.id === novaPeca.id);

      if (jaExiste) return pecasAtuais;

      return [...pecasAtuais, novaPeca];
    });

    setFasesLiberadas((faseAtual) => {
      if (faseAtual === numeroFase) {
        return numeroFase + 1;
      }

      return faseAtual;
    });

    setJogoEmAndamento(true);
    setTela(TELAS.MAPA);
  }

  if (tela === TELAS.MENU) {
    return (
      <MenuInicial
        iniciar={novoJogo}
        continuar={continuarJogo}
        mostrarContinuar={jogoEmAndamento}
        abrirComoJogar={() => setTela(TELAS.COMO_JOGAR)}
        abrirSobre={() => setTela(TELAS.SOBRE)}
      />
    );
  }

  if (tela === TELAS.COMO_JOGAR) {
    return <ComoJogar voltar={() => setTela(TELAS.MENU)} />;
  }

  if (tela === TELAS.SOBRE) {
    return <SobreJogo voltar={() => setTela(TELAS.MENU)} />;
  }

  if (tela === TELAS.CRIAR) {
    return (
      <CriarJogador
        continuar={(nome) => {
          setNomeJogador(nome);
          setMostrarHistoriaMapa(true);
          setJogoEmAndamento(true);
          setTela(TELAS.MAPA);
        }}
      />
    );
  }

  if (tela === TELAS.MAPA) {
    return (
      <MapaFases
        nomeJogador={nomeJogador}
        fasesLiberadas={fasesLiberadas}
        pecas={pecas}
        mostrarHistoriaMapa={mostrarHistoriaMapa}
        fecharHistoriaMapa={() => setMostrarHistoriaMapa(false)}
        abrirFila={() => setTela(TELAS.FILA)}
        abrirPilha={() => setTela(TELAS.PILHA)}
        abrirLista={() => setTela(TELAS.LISTA)}
        abrirArvore={() => setTela(TELAS.ARVORE)}
        abrirGrafo={() => setTela(TELAS.GRAFO)}
        abrirFinal={() => setTela(TELAS.FINAL)}
        abrirInventario={() => setTela(TELAS.INVENTARIO)}
        voltarMenu={voltarAoMenu}
      />
    );
  }

  if (tela === TELAS.FILA) {
    return (
      <LabirintoFila
        voltar={() => setTela(TELAS.MAPA)}
        concluir={() => concluirFase(1)}
      />
    );
  }

  if (tela === TELAS.PILHA) {
    return (
      <LabirintoPilha
        voltar={() => setTela(TELAS.MAPA)}
        concluir={() => concluirFase(2)}
      />
    );
  }

  if (tela === TELAS.LISTA) {
    return (
      <LabirintoLista
        voltar={() => setTela(TELAS.MAPA)}
        concluir={() => concluirFase(3)}
        nomeJogador={nomeJogador}
      />
    );
  }

  if (tela === TELAS.ARVORE) {
    return (
      <LabirintoArvore
        voltar={() => setTela(TELAS.MAPA)}
        concluir={() => concluirFase(4)}
        nomeJogador={nomeJogador}
      />
    );
  }

  if (tela === TELAS.GRAFO) {
    return (
      <LabirintoGrafo
        voltar={() => setTela(TELAS.MAPA)}
        concluir={() => concluirFase(5)}
        nomeJogador={nomeJogador}
      />
    );
  }

  if (tela === TELAS.INVENTARIO) {
    return (
      <Inventario
        pecas={pecas}
        fecharInventario={() => setTela(TELAS.MAPA)}
      />
    );
  }

  if (tela === TELAS.FINAL) {
    return <TelaFinal voltar={() => setTela(TELAS.MAPA)} />;
  }

  return null;
}

export default App;