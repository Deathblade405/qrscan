import React, { useState, useRef, useEffect } from "react";
import ReactQRScanner from "react-qr-scanner";

const QReaderScanner = () => {
  const [scanning, setScanning] = useState(true); // To control the scanning status
  const [qrPosition, setQrPosition] = useState(null); // Store position of the QR code
  const [batchNumber, setBatchNumber] = useState(""); // State to store the batch number
  const videoRef = useRef(null); // Ref to control the video element size dynamically

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

  useEffect(() => {
    if (qrPosition && videoRef.current) {
      // Dynamically adjust the video element's zooming by changing its scale based on the position
      const videoElement = videoRef.current;
      videoElement.style.transform = `scale(1.5)`; // Increase zoom level (1.5x zoom in)

      // Optionally, you can also adjust the position of the video element itself
      // to zoom into the detected QR area more precisely.
      videoElement.style.transformOrigin = `${qrPosition.x * 100}% ${qrPosition.y * 100}%`;
    }
  }, [qrPosition]);

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
            facingMode="environment"
            onError={handleError}
            onScan={handleScan}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            videoRef={videoRef} // Attach video ref to the video element
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
