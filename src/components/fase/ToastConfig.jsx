import { Toaster } from "react-hot-toast";

function ToastConfig() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      containerStyle={{ top: 70 }}
      toastOptions={{
        duration:3000,
        style: {
          borderRadius: "14px",
          background: "#1e293b",
          color: "#fff",
          fontWeight: "700",
          fontSize: "13px",
          maxWidth: "320px",
          textAlign: "center",
        },
      }}
    />
  );
}

export default ToastConfig;