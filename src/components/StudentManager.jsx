import React, { useState } from 'react';
import { Users, UserPlus, CheckCircle2, Clock, Plus, Trash2, Edit, ChevronDown, ChevronRight, Award, MessageSquare } from 'lucide-react';
import { INITIAL_SKILLS } from '../data/initialData';

export default function StudentManager({ students, onUpdateStudents }) {
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || null);
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentClass, setNewStudentClass] = useState('Technique Course 1');
  const [newStudentGoal, setNewStudentGoal] = useState('');
  const [quickNoteText, setQuickNoteText] = useState('');

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  const handleAddStudent = (e) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;

    const newStudent = {
      id: 'stud_' + Date.now(),
      name: newStudentName.trim(),
      className: newStudentClass,
      goal: newStudentGoal.trim() || 'Improve clean technique and footwork',
      skills: {}, // { skillId: 'not_started' | 'practicing' | 'mastered' }
      notes: [
        {
          id: 'note_' + Date.now(),
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          text: 'Joined ' + newStudentClass + '. Goal: ' + (newStudentGoal || 'General improvement')
        }
      ]
    };

    const updated = [...students, newStudent];
    onUpdateStudents(updated);
    setSelectedStudentId(newStudent.id);
    setNewStudentName('');
    setNewStudentGoal('');
    setIsAddingStudent(false);
  };

  const handleDeleteStudent = (studentId) => {
    if (!window.confirm('Delete this student profile and notes?')) return;
    const updated = students.filter(s => s.id !== studentId);
    onUpdateStudents(updated);
    if (selectedStudentId === studentId) {
      setSelectedStudentId(updated[0]?.id || null);
    }
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!quickNoteText.trim() || !selectedStudent) return;

    const newNote = {
      id: 'note_' + Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      text: quickNoteText.trim()
    };

    const updated = students.map(s => {
      if (s.id === selectedStudent.id) {
        return {
          ...s,
          notes: [newNote, ...(s.notes || [])]
        };
      }
      return s;
    });

    onUpdateStudents(updated);
    setQuickNoteText('');
  };

  const handleDeleteNote = (noteId) => {
    if (!selectedStudent) return;
    const updated = students.map(s => {
      if (s.id === selectedStudent.id) {
        return {
          ...s,
          notes: s.notes.filter(n => n.id !== noteId)
        };
      }
      return s;
    });
    onUpdateStudents(updated);
  };

  const handleToggleSkill = (skillId) => {
    if (!selectedStudent) return;
    const currentStatus = selectedStudent.skills?.[skillId] || 'not_started';
    const nextStatus = currentStatus === 'not_started' ? 'practicing' : currentStatus === 'practicing' ? 'mastered' : 'not_started';

    const updated = students.map(s => {
      if (s.id === selectedStudent.id) {
        return {
          ...s,
          skills: {
            ...(s.skills || {}),
            [skillId]: nextStatus
          }
        };
      }
      return s;
    });

    onUpdateStudents(updated);
  };

  // Calculate mastery progress
  const masteredCount = selectedStudent 
    ? INITIAL_SKILLS.filter(sk => selectedStudent.skills?.[sk.id] === 'mastered').length 
    : 0;
  const progressPct = INITIAL_SKILLS.length > 0 ? Math.round((masteredCount / INITIAL_SKILLS.length) * 100) : 0;

  return (
    <div className="p-4 pb-28 max-w-md mx-auto space-y-5">
      {/* Title & Add Student Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="text-emerald-600" size={24} />
          <h2 className="text-xl font-bold text-slate-800">Student Rosters & Notes</h2>
        </div>
        <button
          onClick={() => setIsAddingStudent(!isAddingStudent)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm"
        >
          <UserPlus size={15} /> Add Student
        </button>
      </div>

      {/* Add Student Form */}
      {isAddingStudent && (
        <form onSubmit={handleAddStudent} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-800">New Student Profile</h3>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Student Name</label>
            <input
              type="text"
              required
              placeholder="e.g., Sarah Jenkins"
              value={newStudentName}
              onChange={(e) => setNewStudentName(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Course / Group</label>
              <select
                value={newStudentClass}
                onChange={(e) => setNewStudentClass(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option>Technique Course 1</option>
                <option>Technique Course 2</option>
                <option>Technique Course 3</option>
                <option>Private Coaching</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Focus Goal</label>
              <input
                type="text"
                placeholder="e.g. Dynos / Footwork"
                value={newStudentGoal}
                onChange={(e) => setNewStudentGoal(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAddingStudent(false)}
              className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
            >
              Create Student
            </button>
          </div>
        </form>
      )}

      {/* Student Selector Pills */}
      {students.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {students.map(s => (
            <button
              key={s.id}
              onClick={() => setSelectedStudentId(s.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all shrink-0 ${selectedStudentId === s.id ? 'bg-slate-900 text-white shadow' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              {s.name}
            </button>
          ))}
        </div>
      )}

      {/* Selected Student Details */}
      {selectedStudent ? (
        <div className="space-y-4">
          {/* Profile Card */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-lg text-slate-800">{selectedStudent.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-medium">
                    {selectedStudent.className}
                  </span>
                  <span className="text-xs text-slate-400">• Goal: {selectedStudent.goal}</span>
                </div>
              </div>
              <button
                onClick={() => handleDeleteStudent(selectedStudent.id)}
                className="text-slate-300 hover:text-red-500 p-1"
                title="Delete Student"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {/* Mastery Progress Bar */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-semibold text-slate-700 flex items-center gap-1">
                  <Award size={14} className="text-amber-500" /> Skill Mastery Tree
                </span>
                <span className="font-bold text-emerald-600">{masteredCount}/{INITIAL_SKILLS.length} ({progressPct}%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Floor Notes Section */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <h4 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
              <MessageSquare size={16} className="text-blue-500" /> Quick Floor Notes
            </h4>
            
            <form onSubmit={handleAddNote} className="flex gap-2">
              <input
                type="text"
                placeholder={`Note for ${selectedStudent.name.split(' ')[0]} (e.g. Great footwork, watch crimping)...`}
                value={quickNoteText}
                onChange={(e) => setQuickNoteText(e.target.value)}
                className="flex-1 text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1 shrink-0"
              >
                <Plus size={14} /> Add
              </button>
            </form>

            {/* Notes List */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {selectedStudent.notes && selectedStudent.notes.length > 0 ? (
                selectedStudent.notes.map(note => (
                  <div key={note.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs flex justify-between items-start gap-2">
                    <div>
                      <p className="text-slate-800 leading-relaxed">{note.text}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">{note.date}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="text-slate-300 hover:text-red-500 shrink-0 p-0.5"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-2">No notes recorded yet.</p>
              )}
            </div>
          </div>

          {/* Skills Progress Checklist / Tree */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-sm text-slate-800">Skills Checklist</h4>
              <span className="text-[11px] text-slate-500">Tap to cycle: ⚪ → 🟡 → 🟢</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {INITIAL_SKILLS.map(skill => {
                const status = selectedStudent.skills?.[skill.id] || 'not_started';
                return (
                  <button
                    key={skill.id}
                    onClick={() => handleToggleSkill(skill.id)}
                    className={`p-2.5 rounded-lg border text-left flex items-center justify-between text-xs transition-all ${
                      status === 'mastered' 
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold' 
                        : status === 'practicing'
                        ? 'bg-amber-50 border-amber-300 text-amber-900'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <span className="block truncate">{skill.name}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{skill.category}</span>
                    </div>
                    <span className="text-sm shrink-0 ml-2">
                      {status === 'mastered' ? '🟢' : status === 'practicing' ? '🟡' : '⚪'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-slate-500 bg-white rounded-xl border border-slate-200 p-6">
          <Users size={36} className="mx-auto text-slate-300 mb-2" />
          <h3 className="font-bold text-slate-700">No Students in Roster</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            Add your 4-6 course participants to track floor notes and skill checklists.
          </p>
          <button
            onClick={() => setIsAddingStudent(true)}
            className="bg-emerald-600 text-white text-xs font-semibold px-4 py-2 rounded-lg"
          >
            Add First Student
          </button>
        </div>
      )}
    </div>
  );
}
