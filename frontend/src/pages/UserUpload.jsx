import React, { useState } from "react";

const UserUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(""); // ✅ new

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setUploadStatus(""); // reset status when selecting new file
  };

  const uploadCode = async () => {
    if (!selectedFile) {
      setUploadStatus("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      console.log("✅ Upload success:", data);
      setUploadStatus("File uploaded successfully ✅");
    } catch (error) {
      console.error("❌ Upload failed", error);
      setUploadStatus("File upload failed ❌");
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload Your File</h2>
      <input type="file" onChange={handleFileChange} />
      <a onClick={uploadCode}>Upload</a>

      {/* ✅ Show status */}
      {uploadStatus && (
        <p
          className={`upload-status ${
            uploadStatus.includes("successfully") ? "success" : "error"
          }`}
        >
          {uploadStatus}
        </p>
      )}
    </div>
  );
};

export default UserUpload;
