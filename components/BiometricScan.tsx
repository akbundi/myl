
import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onComplete: (data: any) => void;
}

const BiometricScan: React.FC<Props> = ({ onComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [phase, setPhase] = useState<'IDLE' | 'FACE' | 'SENSOR' | 'VOICE' | 'COMPLETING' | 'ERROR'>('IDLE');
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Function to explicitly kill the camera and microphone
  const stopMediaTracks = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log(`Stopped track: ${track.kind}`);
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Cleanup on unmount (if user switches tabs mid-scan)
  useEffect(() => {
    return () => stopMediaTracks();
  }, []);

  const startScan = async () => {
    setPhase('FACE');
    setProgress(0);
    setErrorMessage('');
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }, 
        audio: true 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(e => console.error("Video play failed:", e));
        };
      }
    } catch (err: any) {
      console.error("Biometric Access Error:", err);
      setPhase('ERROR');
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMessage('Access denied. Please enable camera/mic in browser settings.');
      } else {
        setErrorMessage('Sensor initialization failed. Please try again.');
      }
    }
  };

  useEffect(() => {
    let timer: any;
    if (phase === 'FACE') {
      timer = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            setPhase('SENSOR');
            return 0;
          }
          return p + 2;
        });
      }, 80);
    } else if (phase === 'SENSOR') {
      timer = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            setPhase('VOICE');
            return 0;
          }
          return p + 3;
        });
      }, 80);
    } else if (phase === 'VOICE') {
      timer = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            // STOP CAMERA IMMEDIATELY when entering the completion phase
            stopMediaTracks();
            setPhase('COMPLETING');
            return 100;
          }
          return p + 5;
        });
      }, 80);
    } else if (phase === 'COMPLETING') {
      setTimeout(() => {
        onComplete({
          biometrics: { facialGeometry: 'Symmetrical', microExpressions: 'Confident', skinTexture: 'Hydrated' },
          behavior: { activityLevel: 'medium', dayNightBehavior: 'diurnal', timestamp: new Date().toISOString() },
          voice: { mood: 'Enthusiastic', pitch: 'Mid-range' }
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [phase, onComplete]);

  return (
    <div className="relative w-full aspect-square max-w-sm mx-auto overflow-hidden rounded-full border-2 border-luxe-gold/20 shadow-[0_0_50px_rgba(212,175,55,0.2)] bg-luxe-black">
      <AnimatePresence mode="wait">
        {phase === 'IDLE' && (
          <motion.div 
            key="idle"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center h-full p-8 text-center"
          >
            <div className="mb-6 text-luxe-gold">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="font-serif text-2xl mb-4 text-white">Initialize DNA</h3>
            <p className="text-white/40 text-[10px] uppercase tracking-widest mb-8 px-4">Camera & Mic required for sensory profiling</p>
            <button 
              onClick={startScan}
              className="px-10 py-3.5 gold-gradient rounded-full text-luxe-black font-bold uppercase tracking-[0.2em] text-[10px] hover:scale-105 transition-transform"
            >
              Start Sequence
            </button>
          </motion.div>
        )}

        {phase === 'ERROR' && (
          <motion.div 
            key="error"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center h-full p-8 text-center"
          >
            <div className="mb-4 text-red-500">
              <svg className="w-10 h-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-white text-xs mb-8">{errorMessage}</p>
            <button 
              onClick={startScan}
              className="px-8 py-3 bg-white/10 rounded-full text-white text-[10px] uppercase tracking-widest font-bold"
            >
              Retry Access
            </button>
          </motion.div>
        )}

        {phase === 'FACE' && (
          <motion.div key="face" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative h-full">
            <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover grayscale brightness-90 contrast-125" />
            <div className="absolute inset-0 border-4 border-luxe-gold/20 rounded-full animate-pulse" />
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-luxe-gold/60 shadow-[0_0_20px_rgba(212,175,55,1)] animate-scan" />
            <div className="absolute bottom-12 left-0 w-full text-center px-4">
              <span className="text-luxe-gold text-[10px] uppercase tracking-[0.4em] font-bold">Biometric Extraction: {Math.round(progress)}%</span>
            </div>
          </motion.div>
        )}

        {(phase === 'SENSOR' || phase === 'VOICE') && (
          <motion.div key="fusion" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-full p-8 text-center">
             <div className="flex items-center gap-1.5 mb-10">
              {[...Array(8)].map((_, i) => (
                <motion.div 
                  key={i} 
                  animate={{ height: [10, 40, 10] }} 
                  transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                  className="w-1 bg-luxe-gold/60 rounded-full" 
                />
              ))}
            </div>
            <h3 className="font-serif text-2xl mb-2 text-luxe-gold uppercase tracking-widest">{phase}</h3>
            <div className="mt-8 w-40 bg-white/5 h-0.5 rounded-full overflow-hidden">
              <motion.div className="h-full bg-luxe-gold" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
            </div>
          </motion.div>
        )}

        {phase === 'COMPLETING' && (
          <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full p-8 text-center">
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-luxe-gold mb-6"
            >
              <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
            <h3 className="font-serif text-3xl mb-3 text-white">DNA Decrypted</h3>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-120px); opacity: 0.2; }
          50% { transform: translateY(120px); opacity: 1; }
          100% { transform: translateY(-120px); opacity: 0.2; }
        }
        .animate-scan { animation: scan 2.5s infinite ease-in-out; }
      `}</style>
    </div>
  );
};

export default BiometricScan;
