

const stylePadrao = {
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

export default function Card({children, style}) {
    return (
        <div style={{...stylePadrao, ...style}}>
            {children}
        </div>
    )
}
