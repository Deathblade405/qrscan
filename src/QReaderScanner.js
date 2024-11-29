import React, { useState, useEffect } from "react";
import ReactQRScanner from "react-qr-scanner";

const QReaderScanner = () => {
  const [scanning, setScanning] = useState(true); // To control the scanning status
  const [qrPosition, setQrPosition] = useState(null); // Store position of the QR code
  const [batchNumber, setBatchNumber] = useState(""); // State to store the batch number
  const [flashlight, setFlashlight] = useState(false); // Flashlight toggle state
  const [videoTrack, setVideoTrack] = useState(null); // Current video track

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

  const toggleFlashlight = async () => {
    if (videoTrack) {
      const capabilities = videoTrack.getCapabilities();
      if (capabilities.torch) {
        await videoTrack.applyConstraints({
          advanced: [{ torch: !flashlight }], // Toggle torch
        });
        setFlashlight(!flashlight);
      } else {
        console.log("Torch is not supported on this device.");
      }
    }
  };

  // Access the back camera and manage the flashlight
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: { exact: "environment" } } })
      .then((stream) => {
        const track = stream.getVideoTracks()[0];
        setVideoTrack(track);
      })
      .catch((err) => {
        console.error("Error accessing back camera:", err);
      });

    return () => {
      if (videoTrack) videoTrack.stop(); // Clean up the video track on component unmount
    };
  }, [videoTrack]);

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
      <div className="scanner-box">
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
            constraints={{
              video: { facingMode: { exact: "environment" } }, // Use the back camera
            }}
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

      {/* Flashlight toggle button */}
      <div className="flashlight-container">
        <button className="flashlight-button" onClick={toggleFlashlight}>
          <span className="torch-icon">
            {flashlight ? "🔦" : "💡"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default QReaderScanner;
