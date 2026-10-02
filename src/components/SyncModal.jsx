import React, { useState } from 'react';
import { X, Cloud, Download, Upload, Check, RefreshCw, Key, Share2, Database, AlertCircle } from 'lucide-react';

export default function SyncModal({ 
  customDrills, 
  students, 
  favorites, 
  savedTemplates,
  onImportData, 
  onClose 
}) {
  const [cloudEndpoint, setCloudEndpoint] = useState(() => {
    return localStorage.getItem('boulder_cloud_endpoint') || '';
  });
  const [cloudApiKey, setCloudApiKey] = useState(() => {
    return localStorage.getItem('boulder_cloud_apikey') || '';
  });
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null);

  // 1-Click Export JSON file
  const handleExportJson = () => {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      customDrills,
      students,
      favorites,
      savedTemplates
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `boulder-trainer-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // 1-Click Import JSON file
  const handleImportJson = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.customDrills || parsed.students) {
          onImportData(parsed);
          setSyncStatus({ type: 'success', message: 'Data imported and merged successfully!' });
        } else {
          setSyncStatus({ type: 'error', message: 'Invalid backup file format.' });
        }
      } catch (err) {
        setSyncStatus({ type: 'error', message: 'Failed to read JSON backup file.' });
      }
    };
    reader.readAsText(file);
  };

  // Cloud Sync Handler
  const handleSaveCloudSettings = (e) => {
    e.preventDefault();
    localStorage.setItem('boulder_cloud_endpoint', cloudEndpoint.trim());
    localStorage.setItem('boulder_cloud_apikey', cloudApiKey.trim());
    setSyncStatus({ type: 'success', message: 'Cloud configuration saved locally!' });
  };

  const handleCloudSync = async () => {
    if (!cloudEndpoint) {
      setSyncStatus({ type: 'error', message: 'Please enter your Firebase / Supabase endpoint URL.' });
      return;
    }

    setIsSyncing(true);
    setSyncStatus(null);

    try {
      // Send sync payload
      const response = await fetch(cloudEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(cloudApiKey ? { 'Authorization': `Bearer ${cloudApiKey}` } : {})
        },
        body: JSON.stringify({
          updatedAt: new Date().toISOString(),
          customDrills,
          savedTemplates
        })
      });

      if (response.ok) {
        setSyncStatus({ type: 'success', message: 'Sync complete! Drills updated across trainers.' });
      } else {
        throw new Error('Server returned ' + response.status);
      }
    } catch (err) {
      setSyncStatus({ type: 'error', message: `Sync failed (${err.message}). Offline cache intact.` });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-5 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <Database className="text-emerald-600" size={22} />
          <h3 className="font-bold text-base text-slate-800">Trainer Sync & Backup</h3>
        </div>

        {syncStatus && (
          <div className={`p-3 rounded-lg text-xs mb-4 flex items-center gap-2 ${syncStatus.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            {syncStatus.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
            <span>{syncStatus.message}</span>
          </div>
        )}

        {/* Section 1: Instant File Backup / Share */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 mb-5">
          <div>
            <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-1">
              Trainer File Share & Backup
            </h4>
            <p className="text-[11px] text-slate-500">
              Export all custom drills and students to send to other trainers via AirDrop/WhatsApp or save as backup.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleExportJson}
              className="flex-1 py-2 px-3 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Download size={14} className="text-emerald-600" /> Export Backup
            </button>
            <label className="flex-1 py-2 px-3 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm">
              <Upload size={14} className="text-blue-600" /> Import File
              <input
                type="file"
                accept=".json"
                onChange={handleImportJson}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Section 2: Multi-Trainer Cloud Sync */}
        <form onSubmit={handleSaveCloudSettings} className="space-y-3">
          <div>
            <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Cloud size={15} className="text-blue-500" /> Multi-Trainer Cloud Sync
            </h4>
            <p className="text-[11px] text-slate-500">
              Connect to your gym's Supabase or Firebase project so newly added drills sync automatically to all trainers.
            </p>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Sync Endpoint (REST Webhook / URL)
            </label>
            <input
              type="url"
              placeholder="https://your-project.supabase.co/rest/v1/drills"
              value={cloudEndpoint}
              onChange={(e) => setCloudEndpoint(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              API / Anon Key (optional)
            </label>
            <input
              type="password"
              placeholder="eyJhbGciOi..."
              value={cloudApiKey}
              onChange={(e) => setCloudApiKey(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
            >
              Save Keys
            </button>
            <button
              type="button"
              disabled={isSyncing || !cloudEndpoint}
              onClick={handleCloudSync}
              className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-40 shadow-sm"
            >
              <RefreshCw size={13} className={isSyncing ? "animate-spin" : ""} />
              {isSyncing ? 'Syncing...' : 'Sync Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
