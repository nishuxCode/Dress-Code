'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';

const ScanPage = () => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{
    status: 'success' | 'violation' | null;
    message: string;
    violations?: string[];
  } | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [uniformDetails, setUniformDetails] = useState({
    topColor: '',
    bottomColor: '',
    idCardVisible: false,
    studentId: ''
  });

  // 🔥 NEW: Handle Camera Stream via Effect
  useEffect(() => {
    let stream: MediaStream | null = null;
    let interval: NodeJS.Timeout;

    if (isCameraOpen) {
      const startStream = async () => {
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 480, facingMode: 'user' },
            audio: false
          });
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            
            interval = setInterval(() => {
              if (videoRef.current && videoRef.current.videoWidth > 0) {
                setVideoReady(true);
                clearInterval(interval);
              }
            }, 100);
          }
        } catch (err) {
          console.error('Camera error:', err);
          alert('Camera access denied! Please allow permissions.');
          setIsCameraOpen(false);
        }
      };
      startStream();
    }

    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
      if (interval) clearInterval(interval);
      setVideoReady(false);
    };
  }, [isCameraOpen]);

  const openCamera = () => {
    setIsCameraOpen(true);
  };

  // 🔥 PERFECT CAPTURE - WORKS 100%
  const capturePicture = useCallback(async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video?.videoWidth || !video?.videoHeight) {
      alert('Camera not ready! Wait 2 more seconds.');
      return;
    }

    canvas!.width = 640;
    canvas!.height = 480;
    const ctx = canvas!.getContext('2d');
    
    ctx?.drawImage(video, 0, 0, 640, 480);
    const imageDataUrl = canvas!.toDataURL('image/jpeg', 0.9);
    
    setCapturedImage(imageDataUrl);
    setVideoReady(false);
    setIsCameraOpen(false);
    
    console.log('✅ PICTURE CAPTURED!');
  }, []);

  // 🔥 UPDATED verifyUniform WITH DEBUG LOGS
  const verifyUniform = async () => {
    // 🔍 DEBUG LOG - यहाँ exact data देखें जो API को जा रहा है
    console.log('🔍 DEBUG - Raw form data:', uniformDetails);
    
    if (!capturedImage || !uniformDetails.studentId || !uniformDetails.topColor || !uniformDetails.bottomColor) {
      console.log('❌ Missing fields:', uniformDetails);
      alert('Fill all fields first!');
      return;
    }

    console.log('🚀 Starting scan with:', {
      studentId: uniformDetails.studentId,
      topColor: uniformDetails.topColor,
      bottomColor: uniformDetails.bottomColor,
      idCardVisible: uniformDetails.idCardVisible
    });

    setScanning(true);
    try {
      // Upload image
      const formData = new FormData();
      formData.append('image', dataURLtoFile(capturedImage, 'uniform.jpg'));
      
      const imageRes = await fetch('/api/upload-image', { method: 'POST', body: formData });
      const { imageUrl } = await imageRes.json();

      console.log('📤 Image uploaded:', imageUrl);

      // Scan
      const scanRes = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: uniformDetails.studentId,
          topColor: uniformDetails.topColor,
          bottomColor: uniformDetails.bottomColor,
          idCardDetected: uniformDetails.idCardVisible,
          imageUrl
        }),
      });

      const result = await scanRes.json();
      console.log('📥 API Response:', result);
      
      // 🔥 Handle API Errors (e.g., Incomplete Student Data)
      if (!scanRes.ok) {
        alert(result.message || 'An error occurred during scanning.');
        return;
      }

      if (result.status === 'Allowed') {
        setScanResult({ 
          status: 'success', 
          message: 'Welcome! Your dress code scan successful ✅ Entry allowed' 
        });
        showPopup('success', 'Welcome! Dress code verified ✅');
      } else {
        setScanResult({ 
          status: 'violation', 
          message: 'Dress code violation detected!', 
          violations: result.violations 
        });
        showPopup('violation', 'Dress code violation! Email sent to student.');
      }
    } catch (error) {
      console.error('💥 Scan Error:', error);
      alert('Scan failed! Check console.');
    } finally {
      setScanning(false);
    }
  };

  const dataURLtoFile = (dataurl: string, filename: string) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1]!;
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  };

  const showPopup = (type: 'success' | 'violation', message: string) => {
    const popup = document.createElement('div');
    popup.className = `fixed top-4 right-4 z-50 p-6 rounded-2xl shadow-2xl text-white font-bold max-w-sm ${
      type === 'success' ? 'bg-green-500 animate-bounce' : 'bg-red-500 animate-pulse'
    }`;
    popup.innerHTML = `
      <div class="flex items-center gap-3">
        <span class="text-3xl">${type === 'success' ? '✅' : '❌'}</span>
        <div>
          <h3 class="font-bold text-lg">${type === 'success' ? 'SUCCESS' : 'VIOLATION'}</h3>
          <p class="text-sm mt-1">${message}</p>
        </div>
      </div>
    `;
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Dress Code Scanner
          </h1>
          <p className="text-xl text-gray-600 mt-2">2nd/3rd/4th Year Uniform Verification</p>
        </div>

        {/* CAMERA */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-8 border">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <button
              onClick={openCamera}
              disabled={isCameraOpen}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-blue-700 shadow-xl disabled:opacity-50"
            >
              📱 Open Camera
            </button>
            <button
              onClick={capturePicture}
              disabled={!videoReady}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:from-green-600 hover:to-green-700 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              📸 Click Picture
            </button>
          </div>

          {/* VIDEO PREVIEW */}
          {isCameraOpen && (
            <div className="relative bg-gradient-to-br from-black/20 to-black/10 p-6 rounded-2xl mb-6">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full rounded-2xl block mx-auto max-h-80 object-cover shadow-2xl border-4 border-blue-300"
              />
              <canvas ref={canvasRef} className="hidden" />
              
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-4/5 h-3/4 border-4 border-dashed border-green-400/70 rounded-2xl bg-white/20 backdrop-blur-sm animate-pulse"></div>
              </div>
              
              <div className="absolute top-4 left-4 bg-green-500 text-white px-4 py-2 rounded-2xl text-sm font-bold shadow-lg">
                📷 {videoReady ? 'LIVE ✅' : 'Loading...'}
              </div>
            </div>
          )}

          {/* CAPTURED IMAGE */}
          {capturedImage && (
            <div className="relative bg-green-50 p-4 rounded-2xl border-4 border-green-200">
              <Image
                src={capturedImage}
                alt="Captured uniform"
                width={500}
                height={500}
                className="w-full rounded-2xl max-h-80 object-cover mx-auto block shadow-xl"
              />
              <button
                onClick={() => setCapturedImage(null)}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-3 rounded-2xl shadow-lg transition-all"
              >
                ❌
              </button>
            </div>
          )}
        </div>

        {/* FORM - YEAR WISE COLORS */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-8 border">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Uniform Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xl font-bold text-gray-700 mb-3">Student ID *</label>
              <input
                type="text"
                placeholder="Enter Student ID (2nd/3rd/4th year)"
                value={uniformDetails.studentId}
                onChange={(e) => setUniformDetails({...uniformDetails, studentId: e.target.value})}
                className="w-full p-4 text-lg border-2 rounded-2xl focus:ring-4 focus:ring-blue-500 shadow-lg"
              />
            </div>

            <div>
              <label className="block text-xl font-bold text-gray-700 mb-3">Top Color *</label>
              <select 
                value={uniformDetails.topColor}
                onChange={(e) => setUniformDetails({...uniformDetails, topColor: e.target.value})}
                className="w-full p-4 text-lg border-2 rounded-2xl focus:ring-4 focus:ring-blue-500 shadow-lg"
              >
                <option value="">Select Top Color</option>
                <option value="cream">Cream (2nd Year) 👕</option>
                <option value="pink">Pink (3rd Year) 👗</option>
                <option value="lightgrey">Light Grey (4th Year) 👔</option>
              </select>
            </div>

            <div>
              <label className="block text-xl font-bold text-gray-700 mb-3">Bottom Color *</label>
              <select 
                value={uniformDetails.bottomColor}
                onChange={(e) => setUniformDetails({...uniformDetails, bottomColor: e.target.value})}
                className="w-full p-4 text-lg border-2 rounded-2xl focus:ring-4 focus:ring-blue-500 shadow-lg"
              >
                <option value="">Select Bottom Color</option>
                <option value="black">Black (All Years) 👖</option>
              </select>
            </div>

            <div className="col-span-2 flex items-center gap-4 p-6 border-2 border-blue-200 rounded-2xl bg-blue-50 shadow-lg">
              <input
                type="checkbox"
                id="idcard"
                checked={uniformDetails.idCardVisible}
                onChange={(e) => setUniformDetails({...uniformDetails, idCardVisible: e.target.checked})}
                className="w-8 h-8 text-blue-600 rounded-xl shadow-lg"
              />
              <label htmlFor="idcard" className="text-xl font-bold text-gray-700 cursor-pointer">
                ID Card Visible ✅
              </label>
            </div>
          </div>

          {/* DRESS CODE REFERENCE */}
          <div className="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border-2 border-yellow-200">
            <h3 className="text-xl font-bold text-orange-800 mb-3">📋 Dress Code Reference:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-3 bg-white rounded-xl shadow">
                <strong>2nd Year:</strong><br/>
                Cream Top • Black Bottom
              </div>
              <div className="p-3 bg-white rounded-xl shadow">
                <strong>3rd Year:</strong><br/>
                Pink Top • Black Bottom
              </div>
              <div className="p-3 bg-white rounded-xl shadow">
                <strong>4th Year:</strong><br/>
                Light Grey Top • Black Bottom
              </div>
            </div>
          </div>
        </div>

        {/* VERIFY BUTTON */}
        <div className="text-center mb-8">
          <button
            onClick={verifyUniform}
            disabled={scanning}
            className="bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 text-white px-16 py-6 rounded-3xl font-black text-xl shadow-2xl hover:shadow-3xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed w-full max-w-lg mx-auto block"
          >
            {scanning ? (
              <>
                <span className="inline-block w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mr-3"></span>
                Scanning...
              </>
            ) : (
              '🔍 Verify Uniform'
            )}
          </button>
        </div>

        {/* RESULT */}
        {scanResult && (
          <div className={`p-8 rounded-3xl shadow-2xl border-4 mx-auto max-w-2xl ${
            scanResult.status === 'success' 
              ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300' 
              : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-300'
          }`}>
            <div className={`flex items-center gap-6 ${scanResult.status === 'success' ? 'text-green-800' : 'text-red-800'}`}>
              <span className={`text-5xl p-4 rounded-2xl shadow-2xl ${
                scanResult.status === 'success' 
                  ? 'bg-green-500 text-white animate-bounce' 
                  : 'bg-red-500 text-white animate-pulse'
              }`}>
                {scanResult.status === 'success' ? '✅' : '❌'}
              </span>
              <div>
                <h2 className="text-3xl font-black mb-4">{scanResult.message}</h2>
                {scanResult.violations?.map((violation, i) => (
                  <div key={i} className="mt-3 p-4 bg-red-100 border-l-4 border-red-400 rounded-xl shadow">
                    <span className="font-bold text-red-600 mr-2">⚠️</span>
                    <span className="text-lg">{violation}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanPage;
