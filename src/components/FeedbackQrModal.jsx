import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { X, QrCode, Edit2, Check, ExternalLink, Share2 } from 'lucide-react';

const DEFAULT_FEEDBACK_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSe-sample-bouldering-course-feedback/viewform';

export default function FeedbackQrModal({ onClose }) {
  const [feedbackUrl, setFeedbackUrl] = useState(() => {
    return localStorage.getItem('boulder_trainer_feedback_url') || DEFAULT_FEEDBACK_URL;
  });
  const [isEditing, setIsEditing] = useState(false);
  const [tempUrl, setTempUrl] = useState(feedbackUrl);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, feedbackUrl, {
        width: 240,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      }, (error) => {
        if (error) console.error('QR code error:', error);
      });
    }
  }, [feedbackUrl]);

  const handleSaveUrl = () => {
    if (!tempUrl.trim()) return;
    setFeedbackUrl(tempUrl.trim());
    localStorage.setItem('boulder_trainer_feedback_url', tempUrl.trim());
    setIsEditing(false);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Bouldering Course Feedback',
        text: 'Please take 1 minute to leave feedback for our course!',
        url: feedbackUrl
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(feedbackUrl);
      alert('Feedback link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 text-center relative flex flex-col items-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
        >
          <X size={20} />
        </button>

        <div className="bg-emerald-50 text-emerald-600 p-3 rounded-full mb-3">
          <QrCode size={28} />
        </div>

        <h3 className="font-bold text-lg text-slate-800">Student Feedback QR</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-xs">
          Hold this up for your students at the end of class so they can scan and submit their feedback!
        </p>

        {/* QR Code Canvas */}
        <div className="p-3 bg-white border-2 border-slate-200 rounded-2xl shadow-md my-4">
          <canvas ref={canvasRef} className="rounded-lg" />
        </div>

        {/* Actions / URL editor */}
        {isEditing ? (
          <div className="w-full space-y-2 mt-2">
            <input
              type="url"
              value={tempUrl}
              onChange={(e) => setTempUrl(e.target.value)}
              placeholder="Paste Google Form or Typeform URL"
              className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="text-xs px-3 py-1.5 text-slate-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveUrl}
                className="text-xs font-semibold px-3 py-1.5 bg-emerald-600 text-white rounded-lg flex items-center gap-1"
              >
                <Check size={14} /> Update QR
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full space-y-2 mt-1">
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 py-1 px-2.5 rounded bg-slate-100"
              >
                <Edit2 size={12} /> Edit Form Link
              </button>
              <button
                onClick={handleShare}
                className="text-xs text-emerald-600 hover:text-emerald-700 flex items-center gap-1 py-1 px-2.5 rounded bg-emerald-50 font-medium"
              >
                <Share2 size={12} /> Share Link
              </button>
            </div>
            <a 
              href={feedbackUrl} 
              target="_blank" 
              rel="noreferrer"
              className="text-[11px] text-slate-400 hover:text-slate-600 flex items-center justify-center gap-1 truncate max-w-xs mx-auto pt-1"
            >
              <span className="truncate">{feedbackUrl}</span>
              <ExternalLink size={10} className="shrink-0" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
