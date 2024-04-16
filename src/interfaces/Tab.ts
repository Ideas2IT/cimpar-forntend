import { ReactNode } from "react";

export default interface Tab {
    key: string;
    value: string;
    content: ReactNode
}
