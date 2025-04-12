// frontend/src/pages/APITest.jsx
import React, { useState } from 'react';
import './APITest.css';

function APITest() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [response, setResponse] = useState(null);

  const handleSubmit = async () => {
    const res = await fetch('http://localhost:5000/api/test', {
      method: 'POST', // Intentional misuse (should be POST)
      headers: {
        // Missing 'Authorization' header — another misuse
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, password }) // Also misuse since GET shouldn't have body
    });

    const data = await res.json();
    setResponse(data);
  };

  return (
    <div className="api-test-container">
      <h2>API Misuse Simulation</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      /><br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br />
      <a className='mt-10px' onClick={handleSubmit}>Call API</a>

      {response && (
        <div className={`result ${response.safe ? 'safe' : 'danger'}`}>
          <strong>{response.message}</strong>
        </div>
      )}
    </div>
  );
}

export default APITest;
