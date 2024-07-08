import { useEffect, useState } from "react";
import { Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { GlobalWorkerOptions } from "pdfjs-dist";
GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
const PdfViewer = ({ fileUrl }: { fileUrl: string }) => {
  const [reportUrl, setReportUrl] = useState<string>("");
  useEffect(() => {
    if (fileUrl) {
      setReportUrl(fileUrl);
    }
  }, [fileUrl]);

  return (
    <div>
      <Viewer fileUrl={reportUrl} />
    </div>
  );
};

export default PdfViewer;
