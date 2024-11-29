import React, { useState } from "react";
import ReactQRScanner from "react-qr-scanner";

const QReaderScanner = () => {
  const [scanning, setScanning] = useState(true); // To control the scanning status
  const [qrPosition, setQrPosition] = useState(null); // Store position of the QR code
  const [batchNumber, setBatchNumber] = useState(""); // State to store the batch number

  const ignoredUrl = "https://scinovas.in/m"; // The URL to ignore

  const handleScan = (data) => {
    if (data) {
      const scannedUrl = data.text;

      // Ignore the scanned URL if it matches the ignored URL
      if (scannedUrl === ignoredUrl) {
        console.log("Scanned URL is ignored:", scannedUrl);
        return; // Do nothing and skip the redirection
      }

      // Store the position of the QR code in the frame
      const { x, y, width, height } = data.position || {};
      if (x && y) {
        setQrPosition({ x, y, width, height });
      }

      // Redirect to the URL scanned by the QR code
      window.location.href = scannedUrl; // Directly navigate to the scanned URL
      setScanning(false); // Stop scanning after detecting a QR code
    }
  };

  const handleError = (error) => {
    console.error(error); // Handle error if any
  };

  const handleBatchNumberChange = (e) => {
    setBatchNumber(e.target.value); // Update the batch number as user types
  };

  // Function to create video constraints to request 1080p resolution
  const getVideoConstraints = () => {
    return {
      video: {
        facingMode: { exact: "environment" }, // Use back camera
        width: { ideal: 1920 }, // 1080p width
        height: { ideal: 1080 }, // 1080p height
      },
    };
  };

  // Function to simulate zoom effect by adjusting scale based on QR position
  const calculateZoomStyle = () => {
    if (qrPosition) {
      const scale = Math.max(1, Math.min(2, 2 - qrPosition.width / 100)); // Scale between 1x and 2x based on QR width
      return {
        transform: `scale(${scale})`,
        transformOrigin: "center center", // Make sure the zoom is centered on the QR code
      };
    }
    return {};
  };

  return (
    <div className="qr-scanner-container">
      <h1>QR Code Scanner</h1>

      {/* Batch number input field */}
      <div className="batch-input-container">
        <input
          type="text"
          placeholder="Enter Batch Number"
          value={batchNumber}
          onChange={handleBatchNumberChange}
        />
      </div>

      {/* QR Scanner Box */}
      <div className="scanner-box" style={calculateZoomStyle()}>
        {/* Horizontal scanning line */}
        <div className="scanning-line"></div>

        {scanning ? (
          <ReactQRScanner
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            constraints={getVideoConstraints()} // Apply 1080p video constraints
          />
        ) : (
          <div className="redirecting-message">
            Redirecting to the scanned URL...
          </div>
        )}

        {/* Optionally, add a box to highlight the detected QR code */}
        {qrPosition && (
          <div
            className="qr-box-highlight"
            style={{
              top: `${qrPosition.y}%`,
              left: `${qrPosition.x}%`,
              width: `${qrPosition.width}%`,
              height: `${qrPosition.height}%`,
            }}
          ></div>
        )}
      </div>
    </div>
  );
};

export default QReaderScanner;
