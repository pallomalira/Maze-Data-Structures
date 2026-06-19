import * as ReactJoyride from "react-joyride";

const Joyride = ReactJoyride.default || ReactJoyride.Joyride;

function TutorialJoyride({ steps, runTour, setRunTour }) {
  return (
    <Joyride
      steps={steps}
      run={runTour}
      continuous
      showSkipButton
      showProgress
      disableOverlayClose
      locale={{
        back: "Voltar",
        close: "Fechar",
        last: "Concluir",
        next: "Próximo",
        skip: "Pular",
      }}
      styles={{
        options: {
          zIndex: 3000,
          primaryColor: "#7c3aed",
          textColor: "#334155",
          overlayColor: "rgba(15, 23, 42, 0.65)",
          backgroundColor: "#ffffff",
          arrowColor: "#ffffff",
        },
        tooltip: {
          borderRadius: "22px",
          padding: "18px",
          boxShadow: "0 20px 45px rgba(15, 23, 42, 0.22)",
          border: "1px solid #e2e8f0",
        },
        tooltipContent: {
          padding: "10px 6px",
          fontSize: "14px",
          lineHeight: "1.6",
          fontWeight: "700",
        },
        spotlight: {
          borderRadius: "18px",
          boxShadow: "0 0 0 4px rgba(124, 58, 237, 0.25)",
        },
        buttonNext: {
          background: "linear-gradient(135deg, #7c3aed, #ec4899)",
          borderRadius: "999px",
          padding: "10px 18px",
          fontWeight: "900",
          fontSize: "13px",
        },
        buttonBack: {
          color: "#64748b",
          fontWeight: "900",
          fontSize: "13px",
        },
        buttonSkip: {
          color: "#ec4899",
          fontWeight: "900",
          fontSize: "13px",
        },
        buttonClose: {
          color: "#94a3b8",
        },
      }}
      callback={(data) => {
        if (data.status === "finished" || data.status === "skipped") {
          setRunTour(false);
        }
      }}
    />
  );
}

export default TutorialJoyride;