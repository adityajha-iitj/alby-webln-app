import { useState, useEffect, useRef } from 'react';
import { useWebLN } from '../hooks/useWebLN';

function QRScanner() {
  const { sendPayment } = useWebLN();
  const [scanning, setScanning] = useState(false);
  const [hasCamera, setHasCamera] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [scannedInvoice, setScannedInvoice] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Check if browser supports getUserMedia
  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Camera access is not supported by your browser');
      return;
    }
    
    // Check if camera is accessible
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        setHasCamera(true);
        stream.getTracks().forEach(track => track.stop()); // Stop immediately, just testing
      })
      .catch(err => {
        setCameraError(`Camera access error: ${err.message}`);
      });
  }, []);

  const startScanning = async () => {
    if (!hasCamera) return;
    
    try {
      setScanning(true);
      setError('');
      setScannedInvoice('');
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      // Import QR code library dynamically to reduce initial bundle size
      const jsQR = await import('jsqr');
      
      // Set up canvas and context for frame processing
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      // Process video frames
      const checkVideoFrame = () => {
        if (!videoRef.current || !scanning) return;
        
        const video = videoRef.current; // Get the video element from the ref
        
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          // Set canvas dimensions to match video
          canvas.height = video.videoHeight;
          canvas.width = video.videoWidth;
          
          // Draw video frame on canvas
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // Get image data for QR code scanning
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          
          // Scan for QR code
          const code = jsQR.default(
            imageData.data,
            imageData.width,
            imageData.height
          );
          
          // If QR code found
          if (code) {
            // Check if it looks like a Lightning invoice (starts with lnbc)
            if (code.data.toLowerCase().startsWith('lnbc')) {
              setScannedInvoice(code.data);
              stopScanning();
              return;
            }
          }
        }
        
        // Continue scanning if no valid QR found
        if (scanning) {
          requestAnimationFrame(checkVideoFrame);
        }
      };
      
      // Start the scanning process
      videoRef.current.onloadedmetadata = () => {
        videoRef.current.play();
        requestAnimationFrame(checkVideoFrame);
      };
      
    } catch (err) {
      setCameraError(`Failed to start camera: ${err.message}`);
      setScanning(false);
    }
  };

  const stopScanning = () => {
    setScanning(false);
    
    // Stop camera stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    // Clear video source
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handlePayInvoice = async () => {
    if (!scannedInvoice) return;
    
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      await sendPayment(scannedInvoice);
      setSuccess(true);
      setScannedInvoice('');
    } catch (err) {
      setError(err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div>
      {cameraError && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded dark:bg-red-900 dark:text-red-300">
          {cameraError}
        </div>
      )}
      
      {!scanning && !scannedInvoice && (
        <button
          onClick={startScanning}
          disabled={!hasCamera || loading}
          className={`w-full px-4 py-2 font-bold rounded ${
            !hasCamera || loading
              ? 'bg-gray-400 text-gray-700'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          Scan QR Code
        </button>
      )}
      
      {scanning && (
        <div className="space-y-4">
          <div className="relative w-full">
            <video 
              ref={videoRef}
              className="w-full rounded"
              playsInline
            />
            <div className="absolute inset-0 border-2 border-blue-500 border-dashed rounded z-10 pointer-events-none"></div>
          </div>
          
          <button
            onClick={stopScanning}
            className="w-full px-4 py-2 bg-red-500 text-white font-bold rounded hover:bg-red-600"
          >
            Cancel
          </button>
        </div>
      )}
      
      {scannedInvoice && (
        <div className="space-y-4">
          <div className="bg-gray-100 p-4 rounded dark:bg-gray-700">
            <div className="text-sm font-medium mb-2">Scanned Invoice</div>
            <div className="break-all text-xs">{scannedInvoice}</div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handlePayInvoice}
              disabled={loading}
              className={`flex-1 px-4 py-2 text-white font-bold rounded ${
                loading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {loading ? 'Processing...' : 'Pay Invoice'}
            </button>
            
            <button
              onClick={() => {
                setScannedInvoice('');
                startScanning();
              }}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 font-bold rounded hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Scan Again
            </button>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-2 bg-red-100 text-red-700 rounded dark:bg-red-900 dark:text-red-300">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mt-4 p-2 bg-green-100 text-green-700 rounded dark:bg-green-900 dark:text-green-300">
          Payment sent successfully!
        </div>
      )}
    </div>
  );
}

export default QRScanner;