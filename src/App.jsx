import { useState } from "react";
import "./App.css";

import MapaLabirinto from "./telas/MapaLabirinto";
import MenuInicial from "./telas/MenuInicial";
import CriarJogador from "./telas/CriarJogador";

import MapaFases from "./telas/MapaFases";
import LabirintoFila from "./telas/LabirintoFila";
import LabirintoPilha from "./telas/LabirintoPilha";
import LabirintoArvore from "./telas/LabirintoArvore";
import LabirintoLista from "./telas/LabirintoLista";
import LabirintoGrafo from "./telas/LabirintoGrafo";
import LabirintoHash from "./telas/LabirintoHash";
import LabirintoHeap from "./telas/LabirintoHeap";

import Inventario from "./telas/Inventario";
import TelaFinal from "./telas/TelaFinal";
import SobreJogo from "./telas/SobreJogo";
import ComoJogar from "./telas/ComoJogar";

function App() {
  const [tela, setTela] = useState("menu");
  const [nomeJogador, setNomeJogador] = useState("");
  const [fasesLiberadas, setFasesLiberadas] = useState(1);
  const [pecas, setPecas] = useState([]);
  const [mostrarHistoriaMapa, setMostrarHistoriaMapa] = useState(false);
  const [jogoEmAndamento, setJogoEmAndamento] = useState(false);

  function voltarAoMenu() {
    setJogoEmAndamento(true);
    setTela("menu");
  }

  function novoJogo() {
    setNomeJogador("");
    setFasesLiberadas(1);
    setPecas([]);
    setMostrarHistoriaMapa(false);
    setJogoEmAndamento(false);
    setTela("criar");
  }

  function continuarJogo() {
    setTela("mapa");
  }

  function concluirFase(numeroFase) {
    const fragmentos = {
      1: { id: 1, nome: "Fila", icone: "🚶" },
      2: { id: 2, nome: "Pilha", icone: "📚" },
      3: { id: 3, nome: "Árvore", icone: "🌳" },
      4: { id: 4, nome: "Lista", icone: "🔗" },
      5: { id: 5, nome: "Grafo", icone: "🕸️" },
      6: { id: 6, nome: "Hash", icone: "🔐" },
      7: { id: 7, nome: "Heap", icone: "🏔️" },
    };

    const novaPeca = fragmentos[numeroFase];

    if (!novaPeca) return;

    if (!pecas.some((p) => p.id === novaPeca.id)) {
      setPecas([...pecas, novaPeca]);
    }

    if (fasesLiberadas === numeroFase) {
      setFasesLiberadas(numeroFase + 1);
    }

    setJogoEmAndamento(true);
    setTela("mapa");
  }

  if (tela === "menu") {
    return (
      <MenuInicial
        iniciar={novoJogo}
        continuar={continuarJogo}
        mostrarContinuar={jogoEmAndamento}
        abrirComoJogar={() => setTela("comoJogar")}
        abrirSobre={() => setTela("sobre")}
      />
    );
  }

  if (tela === "comoJogar") {
    return <ComoJogar voltar={() => setTela("menu")} />;
  }

  if (tela === "sobre") {
    return <SobreJogo voltar={() => setTela("menu")} />;
  }

  if (tela === "criar") {
    return (
      <CriarJogador
        continuar={(nome) => {
          setNomeJogador(nome);
          setMostrarHistoriaMapa(true);
          setJogoEmAndamento(true);
          setTela("mapa");
        }}
      />
    );
  }

  if (tela === "mapaLabirinto") {
    return (
      <MapaLabirinto
        voltar={() => setTela("mapa")}
        abrirFila={() => setTela("labirintoFila")}
        abrirPilha={() => setTela("labirintoPilha")}
        abrirArvore={() => setTela("labirintoArvore")}
      />
    );
  }

  if (tela === "mapa") {
    return (
      <MapaFases
        nomeJogador={nomeJogador}
        fasesLiberadas={fasesLiberadas}
        pecas={pecas}
        mostrarHistoriaMapa={mostrarHistoriaMapa}
        fecharHistoriaMapa={() => setMostrarHistoriaMapa(false)}
        abrirMapaLabirinto={() => setTela("mapaLabirinto")}
        abrirFila={() => setTela("labirintoFila")}
        abrirPilha={() => setTela("labirintoPilha")}
        abrirArvore={() => setTela("labirintoArvore")}
        abrirLista={() => setTela("labirintoLista")}
        abrirGrafo={() => setTela("labirintoGrafo")}
        abrirHash={() => setTela("labirintoHash")}
        abrirHeap={() => setTela("labirintoHeap")}
        abrirFinal={() => setTela("final")}
        abrirInventario={() => setTela("inventario")}
        voltarMenu={voltarAoMenu}
      />
    );
  }

  if (tela === "labirintoFila") {
    return (
      <LabirintoFila
        voltar={() => setTela("mapa")}
        concluir={() => concluirFase(1)}
      />
    );
  }

  if (tela === "labirintoPilha") {
    return (
      <LabirintoPilha
        voltar={() => setTela("mapa")}
        concluir={() => concluirFase(2)}
      />
    );
  }

  if (tela === "labirintoArvore") {
    return (
      <LabirintoArvore
        voltar={() => setTela("mapa")}
        concluir={() => concluirFase(3)}
        nomeJogador={nomeJogador}
      />
    );
  }

  if (tela === "labirintoLista") {
    return (
      <LabirintoLista
        voltar={() => setTela("mapa")}
        concluir={() => concluirFase(4)}
        nomeJogador={nomeJogador}
      />
    );
  }

  if (tela === "labirintoGrafo") {
    return (
      <LabirintoGrafo
        voltar={() => setTela("mapa")}
        concluir={() => concluirFase(5)}
        nomeJogador={nomeJogador}
      />
    );
  }

  if (tela === "labirintoHash") {
    return (
      <LabirintoHash
        voltar={() => setTela("mapa")}
        concluir={() => concluirFase(6)}
        nomeJogador={nomeJogador}
      />
    );
  }

  if (tela === "labirintoHeap") {
    return (
      <LabirintoHeap
        voltar={() => setTela("mapa")}
        concluir={() => concluirFase(7)}
        nomeJogador={nomeJogador}
      />
    );
  }

  if (tela === "inventario") {
    return (
      <Inventario
        pecas={pecas}
        fecharInventario={() => setTela("mapa")}
      />
    );
  }

  if (tela === "final") {
    return <TelaFinal voltar={() => setTela("mapa")} />;
  }

  return null;
}

export default App;