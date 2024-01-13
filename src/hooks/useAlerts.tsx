import { useState, useCallback } from "react";

const useAlert = () => {
  const [alertMessage, setAlertMessage] = useState({ content: "", severity: "success" });

  const handleShowAlertMessage = useCallback((msg: string, severity: "success" | "info" | "warning" | "error") => {
    setAlertMessage({ content: msg, severity });
    setTimeout(() => {
      setAlertMessage({ content: "", severity: "success" });
    }, 5000);
  }, []);

  return { alertMessage, handleShowAlertMessage };
};

export default useAlert;
