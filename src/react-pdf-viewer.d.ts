declare module "@react-pdf-viewer/core" {
  import { FC } from "react";

  export const Worker: FC<{ workerUrl: string }>;
  export const Viewer: FC<{ fileUrl: string }>;
}

declare module "@react-pdf-viewer/default-layout" {}
