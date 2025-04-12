import { useEffect, useState } from 'react';

function DeveloperView() {
  const [report, setReport] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/report')
      .then((res) => res.json())
      .then((data) => setReport(data));
  }, []);

  return (
    <div className="developer-view-container">
      <h2>Developer Report Dashboard</h2>
      {report.length === 0 ? (
        <p>No misuse detected yet.</p>
      ) : (
        <div>
        <p>API Misuse Detected:</p>
        <ul>
          {report.map((item, i) => (
            <li key={i}>
              <strong>Line {item.line}:</strong> <code>{item.code}</code><br />
              ⚠ {item.issue}<br />
              💡 {item.recommendation}
              <hr />
            </li>
          ))}
        </ul>
        </div>
      )}
    </div>
  );
}

export default DeveloperView;
