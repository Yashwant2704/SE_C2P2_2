import { useEffect, useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function DeveloperView() {
  const printRef = useRef();
  const pdfRef = useRef();

  const [report, setReport] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/report")
      .then((res) => res.json())
      .then((data) => setReport(data));
  }, []);

  const handleDownloadPDF = () => {
    const input = pdfRef.current;

    html2canvas(input, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#1c1c2e",
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("api-report.pdf");
      })
      .catch((err) => {
        console.error("PDF generation failed:", err);
      });
  };

  return (
    <div className="developer-view-container">
      <h2>Developer Report Dashboard</h2>

      {report.length === 0 ? (
        <h3>No misuse detected yet.</h3>
      ) : (
        <>
          <div>
            <h3>API Misuse Detected:</h3>
            <ul>
              {report.map((item, i) => (
                <li key={i}>
                  <div className="line-no">
                    <strong>Line {item.line}:</strong> <code>{item.code}</code>
                  </div>
                  <div className="issue">⚠️ {item.issue}</div>
                  <div className="recommendation">💡 {item.recommendation}</div>
                </li>
              ))}
            </ul>
            <a className="mt-20px" onClick={handleDownloadPDF}>
              Download Report as PDF
            </a>
          </div>

          {/* Hidden PDF View */}
          <div
            ref={pdfRef}
            style={{
              position: "absolute",
              top: "-9999px",
              left: "-9999px",
              width: "210mm",
              minHeight: "297mm",
              padding: "40px",
              backgroundColor: "#1c1c2e",
              color: "#ffffff",
              fontFamily: "'Segoe UI', sans-serif",
              fontSize: "14px",
              lineHeight: "1.6",
              boxSizing: "border-box",
              display: "flex", // Use flexbox
              flexDirection: "column", // Stack elements vertically
              justifyContent: "flex-start", // Align the content at the top
              alignItems: "stretch", // Ensure the content stretches across the page
            }}
          >
            {/* Header */}
            <h1
              style={{
                fontSize: "24px",
                color: "#ffffff",
                marginBottom: "30px",
                textAlign: "center", // Center the header
              }}
            >
              API Misuse Detection Report
            </h1>

            {/* Main content */}
            <div style={{ flex: 1, textAlign: "left" }}>
              {report.map((item, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: "30px",
                    borderLeft: "4px solid #00d1ff",
                    paddingLeft: "16px",
                    backgroundColor: "#24243a",
                    borderRadius: "6px",
                    paddingTop: "10px",
                    paddingBottom: "10px",
                    textAlign: "left", // Ensure the content is left-aligned
                  }}
                >
                  <p>
                    <strong style={{ color: "#00d1ff" }}>
                      Issue #{index + 1}
                    </strong>
                  </p>
                  <p>
                    <strong>Line:</strong> {item.line}
                  </p>
                  <p>
                    <strong>Code:</strong>{" "}
                    <span
                      style={{
                        fontFamily: "monospace",
                        background: "#2a2a3b",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        display: "inline-block",
                        maxWidth: "100%",
                        textAlign: "left",
                        overflowWrap: "break-word",
                      }}
                    >
                      {item.code}
                    </span>
                  </p>
                  <p>
                    <strong>Issue:</strong> {item.issue}
                  </p>
                  <p>
                    <strong>Recommendation:</strong> {item.recommendation}
                  </p>
                </div>
              ))}
            </div>

            {/* Footer */}
            <hr style={{ border: "1px solid #555", margin: "40px 0 20px" }} />

            <div
              style={{ fontSize: "12px", color: "#aaa", textAlign: "center" }}
            >
              Report generated on {new Date().toLocaleDateString()} by API
              Misuse Detection System.
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default DeveloperView;
