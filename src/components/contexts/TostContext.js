import { createContext, useContext, useState } from "react";
import MySnackBar from "../MySnackBar";

const TostContext = createContext({});

export const TostProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const clickSnack = (message) => {
    setOpen(true);
    setMessage(message);
    setTimeout(() => {
      setOpen(false);
    }, 2000);
  };
  return (
    <TostContext.Provider value={{ clickSnack }}>
      <MySnackBar open={open} message={message} />
      {children}
    </TostContext.Provider>
  );
};
export const useTost = () => {
  return useContext(TostContext);
};
