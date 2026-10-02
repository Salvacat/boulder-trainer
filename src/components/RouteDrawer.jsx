import React, { useState, useRef, useEffect } from 'react';
import { Camera, Image as ImageIcon, RotateCcw, Trash2, Download, Circle, ArrowUpRight, Hash, Edit3, X, Check } from 'lucide-react';

const COLORS = [
  { name: 'Emerald', hex: '#10b981' },
  { name: 'Sky Blue', hex: '#0ea5e9' },
  { name: 'Coral Red', hex: '#ef4444' },
  { name: 'Amber Yellow', hex: '#f59e0b' },
  { name: 'Chalk White', hex: '#ffffff' },
  { name: 'Purple', hex: '#a855f7' }
];

export default function RouteDrawer({ onClose }) {
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const [tool, setTool] = useState('freehand'); // 'freehand', 'arrow', 'circle', 'number'
  const [currentColor, setCurrentColor] = useState('#10b981');
  const [lineWidth, setLineWidth] = useState(4);
  const [currentNumber, setCurrentNumber] = useState(1);
  const [history, setHistory] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState(null);
  
  const isDrawing = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const snapshot = useRef(null);

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Set internal resolution based on client dimensions
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * (window.devicePixelRatio || 1);
    canvas.height = rect.height * (window.devicePixelRatio || 1);
    
    const ctx = canvas.getContext('2d');
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    
    // Default dark chalkboard background
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, rect.width, rect.height);
    
    // Draw subtle grid texture
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    for (let x = 20; x < rect.width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, rect.height);
      ctx.stroke();
    }
    for (let y = 20; y < rect.height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(rect.width, y);
      ctx.stroke();
    }
    
    saveState();
  }, []);

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setHistory(prev => [...prev.slice(-15), canvas.toDataURL()]);
  };

  const undo = () => {
    if (history.length <= 1) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const newHistory = [...history];
    newHistory.pop(); // Remove current
    const previousState = newHistory[newHistory.length - 1];
    
    const img = new Image();
    img.src = previousState;
    img.onload = () => {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      ctx.restore();
      setHistory(newHistory);
    };
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    
    if (backgroundImage) {
      drawImageToFit(backgroundImage);
    }
    saveState();
    setCurrentNumber(1);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setBackgroundImage(img);
        drawImageToFit(img);
        saveState();
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const drawImageToFit = (img) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate aspect ratio fit
    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    const ratio = Math.min(hRatio, vRatio);
    const centerShiftX = (canvas.width - img.width * ratio) / 2;
    const centerShiftY = (canvas.height - img.height * ratio) / 2;
    
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, img.width, img.height,
                  centerShiftX, centerShiftY, img.width * ratio, img.height * ratio);
    ctx.restore();
  };

  const getCanvasCoords = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDraw = (e) => {
    e.preventDefault();
    const coords = getCanvasCoords(e);
    isDrawing.current = true;
    startPos.current = coords;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (tool === 'number') {
      // Stamp hold number marker
      ctx.fillStyle = currentColor;
      ctx.beginPath();
      ctx.arc(coords.x, coords.y, 16, 0, 2 * Math.PI);
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(currentNumber.toString(), coords.x, coords.y);

      setCurrentNumber(prev => prev + 1);
      isDrawing.current = false;
      saveState();
      return;
    }

    // Save snapshot for shapes preview
    snapshot.current = ctx.getImageData(0, 0, canvas.width, canvas.height);

    if (tool === 'freehand') {
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  };

  const draw = (e) => {
    if (!isDrawing.current) return;
    e.preventDefault();
    const coords = getCanvasCoords(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (tool === 'freehand') {
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    } else if (snapshot.current) {
      // Restore previous state to preview shape
      ctx.putImageData(snapshot.current, 0, 0);
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = lineWidth;

      if (tool === 'circle') {
        const radius = Math.hypot(coords.x - startPos.current.x, coords.y - startPos.current.y);
        ctx.beginPath();
        ctx.arc(startPos.current.x, startPos.current.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
      } else if (tool === 'arrow') {
        drawArrow(ctx, startPos.current.x, startPos.current.y, coords.x, coords.y);
      }
    }
  };

  const endDraw = (e) => {
    if (!isDrawing.current) return;
    e.preventDefault();
    isDrawing.current = false;
    saveState();
  };

  const drawArrow = (ctx, fromX, fromY, toX, toY) => {
    const headLen = 14;
    const angle = Math.atan2(toY - fromY, toX - fromX);
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
    // Arrowhead
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headLen * Math.cos(angle - Math.PI / 6), toY - headLen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(toX - headLen * Math.cos(angle + Math.PI / 6), toY - headLen * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fillStyle = currentColor;
    ctx.fill();
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `boulder-route-chalkboard-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col select-none touch-none text-white">
      {/* Top Bar */}
      <header className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Edit3 className="text-emerald-400" size={20} />
          <h2 className="font-bold text-sm sm:text-base">Route Drawer (Chalkboard)</h2>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={downloadImage}
            title="Download Route Plan"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
          >
            <Download size={18} />
          </button>
          {onClose && (
            <button 
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </header>

      {/* Main Drawing Area */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center p-2 bg-slate-950">
        <canvas
          ref={canvasRef}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
          className="w-full h-full max-w-lg max-h-[75vh] rounded-xl shadow-2xl border border-slate-800 cursor-crosshair touch-none"
        />

        {/* Camera Overlay button if no image yet */}
        {!backgroundImage && (
          <div className="absolute top-6 left-6 pointer-events-auto">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 bg-emerald-600/90 hover:bg-emerald-600 text-white text-xs px-3 py-2 rounded-lg shadow-lg backdrop-blur transition-all"
            >
              <Camera size={16} /> Snap Wall Photo
            </button>
          </div>
        )}
        <input 
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      {/* Tool Controls Bar */}
      <div className="p-3 bg-slate-900 border-t border-slate-800 space-y-2.5 pb-safe">
        {/* Row 1: Tools & Actions */}
        <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1">
          <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setTool('freehand')}
              className={`p-2 rounded flex items-center gap-1 text-xs ${tool === 'freehand' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Freehand Line"
            >
              <Edit3 size={16} />
              <span className="hidden sm:inline">Draw</span>
            </button>
            <button
              onClick={() => setTool('circle')}
              className={`p-2 rounded flex items-center gap-1 text-xs ${tool === 'circle' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Hold Circle"
            >
              <Circle size={16} />
              <span className="hidden sm:inline">Circle</span>
            </button>
            <button
              onClick={() => setTool('arrow')}
              className={`p-2 rounded flex items-center gap-1 text-xs ${tool === 'arrow' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Movement Arrow"
            >
              <ArrowUpRight size={16} />
              <span className="hidden sm:inline">Arrow</span>
            </button>
            <button
              onClick={() => setTool('number')}
              className={`p-2 rounded flex items-center gap-1 text-xs ${tool === 'number' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Numbered Hold Marker"
            >
              <Hash size={16} />
              <span>#{currentNumber}</span>
            </button>
          </div>

          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg">
            <button 
              onClick={() => fileInputRef.current?.click()}
              title="Change Wall Photo"
              className="p-2 text-slate-400 hover:text-white rounded"
            >
              <Camera size={16} />
            </button>
            <button 
              onClick={undo}
              title="Undo Stroke"
              className="p-2 text-slate-400 hover:text-white rounded"
            >
              <RotateCcw size={16} />
            </button>
            <button 
              onClick={clearCanvas}
              title="Clear Canvas"
              className="p-2 text-slate-400 hover:text-red-400 rounded"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Row 2: Color Palette */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {COLORS.map(c => (
              <button
                key={c.hex}
                onClick={() => setCurrentColor(c.hex)}
                className={`w-7 h-7 rounded-full border-2 transition-transform ${currentColor === c.hex ? 'scale-110 border-white' : 'border-transparent opacity-80 hover:opacity-100'}`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">Size:</span>
            <input 
              type="range"
              min="2"
              max="12"
              value={lineWidth}
              onChange={(e) => setLineWidth(Number(e.target.value))}
              className="w-20 accent-emerald-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
