import { MessageContext } from "../context/MessageContext";
import { useContext } from "react";

export function useMessage() {
    return useContext(MessageContext);
}
 