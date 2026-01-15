
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Task, TaskStatus } from '../types';
import { 
  Plus, Search, Edit2, Trash2, Play, Pause, 
  CheckSquare, Square, Sparkles, 
  X, AlertTriangle, ChevronDown, Filter,
  Layers, Rocket, Zap
} from 'lucide-react';
import { generateTaskDescription } from '../services/geminiService';

export const AdminTaskManagement: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask, currency } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reward: 0.1,
    quantity: 100,
    instruction: '',
    status: TaskStatus.PUBLISHED
  });

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const isNotDeleted = t.status !== TaskStatus.DELETED;
    return matchesSearch && matchesStatus && isNotDeleted;
  });

  const handleOpenModal = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description,
        reward: task.reward,
        quantity: task.quantity,
        instruction: task.instruction,
        status: task.status
      });
    } else {
      setEditingTask(null);
      setFormData({
        title: '',
        description: '',
        reward: 0.1,
        quantity: 100,
        instruction: '',
        status: TaskStatus.PUBLISHED
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTask) {
      updateTask(editingTask.id, formData);
    } else {
      addTask(formData);
    }
    setIsModalOpen(false);
  };

  const toggleSelectAll = () => {
    if (selectedTasks.length === filteredTasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(filteredTasks.map(t => t.id));
    }
  };

  const toggleSelectTask = (id: string) => {
    setSelectedTasks(prev => 
      prev.includes(id) ? prev.filter(tId => tId !== id) : [...prev, id]
    );
  };

  const handleStatusToggle = (task: Task) => {
    const newStatus = task.status === TaskStatus.PUBLISHED ? TaskStatus.HOLD : TaskStatus.PUBLISHED;
    updateTask(task.id, { status: newStatus });
  };

  const handleBulkStatus = (status: TaskStatus) => {
    selectedTasks.forEach(id => updateTask(id, { status }));
    setSelectedTasks([]);
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Delete ${selectedTasks.length} tasks?`)) {
      selectedTasks.forEach(id => deleteTask(id));
      setSelectedTasks([]);
    }
  };

  const handleAIGenerate = async () => {
    const topic = prompt("What kind of task do you want to create? (e.g., 'Instagram Follow', 'App Review')");
    if (!topic) return;

    setIsGenerating(true);
    const result = await generateTaskDescription(topic);
    if (result) {
      setFormData(prev => ({
        ...prev,
        title: result.title || prev.title,
        description: result.description || prev.description,
        instruction: result.instruction || prev.instruction
      }));
    }
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#eef2ff] to-[#f5f3ff] p-4 md:p-8 space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 px-2">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-indigo-600 rounded-3xl shadow-[0_10px_0_rgb(49,46,129)] rotate-3">
              <Zap className="text-white w-8 h-8 fill-white" />
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white drop-shadow-md">
              TASK <span className="text-indigo-600">COMMAND</span>
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-lg font-bold ml-1 opacity-70 italic">Manage your earning ecosystem with precision.</p>
        </div>
        
        <button 
          onClick={() => handleOpenModal()}
          className="group relative self-start lg:self-center flex items-center gap-3 bg-indigo-600 text-white px-10 py-5 rounded-[2rem] font-black text-lg transition-all shadow-[0_10px_0_rgb(49,46,129)] hover:shadow-[0_5px_0_rgb(49,46,129)] hover:translate-y-[5px] active:shadow-none active:translate-y-[10px]"
        >
          <Plus className="w-7 h-7 group-hover:rotate-180 transition-transform duration-500" />
          GENERATE MISSION
        </button>
      </div>

      {/* Toolbar - Mega 3D Card */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-[3.5rem] border-b-[14px] border-slate-200 dark:border-slate-900 shadow-2xl flex flex-col md:flex-row gap-8 items-center transform perspective-1000">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-indigo-500 group-focus-within:scale-110 transition-transform" />
          <input 
            type="text" 
            placeholder="Search active missions..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-8 py-5 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border-4 border-transparent outline-none focus:border-indigo-500/40 focus:ring-8 focus:ring-indigo-500/5 text-lg font-bold transition-all shadow-inner"
          />
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-72">
            <Filter className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-indigo-500" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-16 pr-12 py-5 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border-4 border-transparent outline-none focus:border-indigo-500/40 text-lg font-black appearance-none cursor-pointer shadow-inner"
            >
              <option value="ALL">ALL STATUS</option>
              <option value={TaskStatus.PUBLISHED}>🟢 PUBLISHED</option>
              <option value={TaskStatus.HOLD}>🟡 ON HOLD</option>
            </select>
            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedTasks.length > 0 && (
        <div className="bg-indigo-600 text-white p-6 rounded-[2.5rem] flex items-center justify-between animate-in slide-in-from-top-10 shadow-[0_15px_35px_-10px_rgba(79,70,229,0.6)] border-b-8 border-indigo-900">
          <div className="flex items-center gap-4">
            <div className="bg-white text-indigo-600 w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg rotate-6">{selectedTasks.length}</div>
            <span className="font-black text-xl tracking-tight">UNITS TARGETED</span>
          </div>
          <div className="flex gap-4">
            <button onClick={() => handleBulkStatus(TaskStatus.PUBLISHED)} className="flex items-center gap-3 bg-white/20 hover:bg-white text-white hover:text-indigo-600 px-6 py-3 rounded-2xl transition-all font-black text-sm uppercase shadow-lg"><Play className="w-5 h-5 fill-current" /> Publish</button>
            <button onClick={() => handleBulkStatus(TaskStatus.HOLD)} className="flex items-center gap-3 bg-white/20 hover:bg-white text-white hover:text-indigo-600 px-6 py-3 rounded-2xl transition-all font-black text-sm uppercase shadow-lg"><Pause className="w-5 h-5 fill-current" /> Hold</button>
            <button onClick={handleBulkDelete} className="flex items-center gap-3 bg-red-500 hover:bg-red-400 px-6 py-3 rounded-2xl transition-all font-black text-sm uppercase shadow-lg border-b-4 border-red-900 active:border-0 active:translate-y-1"><Trash2 className="w-5 h-5" /> Erase</button>
            <button onClick={() => setSelectedTasks([])} className="p-3 hover:bg-white/20 rounded-2xl transition-colors"><X className="w-6 h-6" /></button>
          </div>
        </div>
      )}

      {/* Tasks Table - Elevated 3D Container */}
      <div className="bg-white dark:bg-slate-800 rounded-[4rem] border-b-[20px] border-slate-200 dark:border-slate-900 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-900/50 text-slate-400 text-xs uppercase font-black tracking-[0.2em] border-b-4 border-slate-100 dark:border-slate-700">
                <th className="px-10 py-8 w-20">
                  <button onClick={toggleSelectAll} className="text-indigo-300 hover:text-indigo-600 transition-all transform active:scale-90">
                    {selectedTasks.length === filteredTasks.length && filteredTasks.length > 0 ? <CheckSquare className="w-8 h-8" /> : <Square className="w-8 h-8" />}
                  </button>
                </th>
                <th className="px-6 py-8 w-48 text-center">Operation Status</th>
                <th className="px-8 py-8">Mission Identity</th>
                <th className="px-8 py-8 text-center">Bounty</th>
                <th className="px-8 py-8 text-center">Engagement Progress</th>
                <th className="px-10 py-8 text-right">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y-4 divide-slate-50 dark:divide-slate-700/50">
              {filteredTasks.map(task => (
                <tr 
                  key={task.id} 
                  className={`group transition-all duration-300 ${
                    task.status === TaskStatus.HOLD 
                    ? 'bg-amber-50/40 dark:bg-amber-900/10 grayscale-[0.3]' 
                    : 'hover:bg-indigo-50/40 dark:hover:bg-indigo-900/10'
                  }`}
                >
                  <td className="px-10 py-8">
                    <button onClick={() => toggleSelectTask(task.id)} className={`${selectedTasks.includes(task.id) ? 'text-indigo-600' : 'text-slate-200 dark:text-slate-600'} transform active:scale-90 transition-transform`}>
                      {selectedTasks.includes(task.id) ? <CheckSquare className="w-8 h-8" /> : <Square className="w-8 h-8" />}
                    </button>
                  </td>
                  <td className="px-6 py-8">
                    <div className="flex justify-center">
                      <button 
                        onClick={() => handleStatusToggle(task)}
                        className={`group relative flex items-center justify-center gap-3 w-40 py-4 rounded-3xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:translate-y-2 active:shadow-none ${
                          task.status === TaskStatus.PUBLISHED 
                          ? 'bg-emerald-500 text-white shadow-[0_8px_0_rgb(5,150,105)] hover:shadow-[0_4px_0_rgb(5,150,105)] hover:translate-y-1' 
                          : 'bg-amber-500 text-white shadow-[0_8px_0_rgb(217,119,6)] hover:shadow-[0_4px_0_rgb(217,119,6)] hover:translate-y-1'
                        }`}
                      >
                        {task.status === TaskStatus.PUBLISHED ? (
                          <><Pause className="w-4 h-4 fill-white" /> SET HOLD</>
                        ) : (
                          <><Play className="w-4 h-4 fill-white" /> PUBLISH</>
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-3">
                        <span className={`font-black text-xl tracking-tight transition-colors ${
                          task.status === TaskStatus.HOLD ? 'text-slate-400' : 'text-slate-900 dark:text-white group-hover:text-indigo-600'
                        }`}>
                          {task.title}
                        </span>
                        {task.status === TaskStatus.HOLD && (
                          <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-2 py-1 rounded-lg uppercase">Paused</span>
                        )}
                      </div>
                      <span className="text-sm text-slate-400 font-bold line-clamp-1 mt-1 opacity-70 italic">{task.description}</span>
                    </div>
                  </td>
                  <td className="px-8 py-8 text-center">
                    <span className="font-black text-2xl text-emerald-600 tabular-nums drop-shadow-sm">{currency.symbol}{task.reward.toFixed(2)}</span>
                  </td>
                  <td className="px-8 py-8">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-40 h-4 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden shadow-inner border-2 border-white dark:border-slate-800">
                        <div 
                          className={`h-full transition-all duration-1000 shadow-lg ${
                            task.status === TaskStatus.HOLD 
                            ? 'bg-slate-300' 
                            : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-[length:200%_auto] animate-gradient-x'
                          }`} 
                          style={{ width: `${(task.completedCount / task.quantity) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 tracking-tighter uppercase whitespace-nowrap">
                        {task.completedCount} / {task.quantity} COMPLETED
                      </span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-4 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                      <button 
                        onClick={() => handleOpenModal(task)}
                        className="p-4 bg-white dark:bg-slate-700 text-indigo-500 hover:text-white hover:bg-indigo-600 rounded-[1.5rem] shadow-xl transition-all border-b-4 border-indigo-100 dark:border-slate-900 hover:border-indigo-800 active:border-0 active:translate-y-1"
                      >
                        <Edit2 className="w-6 h-6" />
                      </button>
                      <button 
                        onClick={() => { if(confirm('Erase this task unit?')) deleteTask(task.id); }}
                        className="p-4 bg-white dark:bg-slate-700 text-rose-500 hover:text-white hover:bg-rose-500 rounded-[1.5rem] shadow-xl transition-all border-b-4 border-rose-100 dark:border-slate-900 hover:border-rose-800 active:border-0 active:translate-y-1"
                      >
                        <Trash2 className="w-6 h-6" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredTasks.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-10 py-32 text-center">
                    <div className="max-w-md mx-auto space-y-6">
                      <div className="w-32 h-32 bg-indigo-50 dark:bg-indigo-900/20 rounded-[3rem] flex items-center justify-center mx-auto shadow-inner rotate-12">
                        <Rocket className="w-16 h-16 text-indigo-400 animate-bounce" />
                      </div>
                      <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">No Active Missions</h3>
                      <p className="text-slate-500 font-bold text-lg opacity-60">The field is clear. Deploy new tasks to begin operations.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating AI Button - Ultra 3D */}
      {!isModalOpen && (
        <button 
          onClick={handleAIGenerate}
          disabled={isGenerating}
          className="fixed bottom-12 right-12 bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(79,70,229,0.5)] border-b-8 border-indigo-100 dark:border-slate-900 flex items-center gap-4 font-black text-xl text-indigo-600 transition-all hover:-translate-y-3 hover:shadow-[0_40px_60px_-12px_rgba(79,70,229,0.6)] z-[50] group active:translate-y-1 active:border-b-0"
        >
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform">
            <Sparkles className={`w-8 h-8 ${isGenerating ? 'animate-spin' : ''}`} />
          </div>
          {isGenerating ? 'THINKING...' : 'AI STRATEGIST'}
        </button>
      )}

      {/* Create/Edit Modal - Space Station Look */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/90 z-[100] flex items-center justify-center p-6 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-500">
          <div className="bg-white dark:bg-slate-800 w-full max-w-3xl rounded-[4rem] p-12 relative shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] border-b-[24px] border-slate-200 dark:border-slate-900 overflow-y-auto max-h-[92vh] transform border-t-8 border-indigo-500">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-10 right-10 p-4 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-3xl transition-all shadow-sm active:scale-90"
            >
              <X className="w-8 h-8 font-black" />
            </button>

            <div className="flex items-center gap-8 mb-12">
              <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl rotate-6 shadow-indigo-500/50">
                <Plus className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{editingTask ? 'Optimize Unit' : 'Configure Mission'}</h2>
                <p className="text-slate-500 text-lg font-bold opacity-70">Define the parameters for micro-task execution.</p>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="md:col-span-2">
                  <label className="text-xs font-black text-indigo-500 uppercase tracking-[0.3em] mb-4 block ml-1">Mission Callsign</label>
                  <input 
                    type="text" 
                    required
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    placeholder="ENTER MISSION NAME"
                    className="w-full px-8 py-6 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border-4 border-transparent outline-none focus:border-indigo-500 focus:ring-[15px] focus:ring-indigo-500/5 font-black text-2xl shadow-inner uppercase"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-black text-indigo-500 uppercase tracking-[0.3em] mb-4 block ml-1">Strategic Objectives</label>
                  <textarea 
                    required
                    rows={4}
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="BRIEF THE AGENTS..."
                    className="w-full px-8 py-6 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border-4 border-transparent outline-none focus:border-indigo-500 focus:ring-[15px] focus:ring-indigo-500/5 font-bold text-lg shadow-inner resize-none"
                  />
                </div>

                <div className="relative group">
                  <label className="text-xs font-black text-indigo-500 uppercase tracking-[0.3em] mb-4 block ml-1">Mission Bounty ({currency.code})</label>
                  <div className="relative">
                    <span className="absolute left-8 top-1/2 -translate-y-1/2 font-black text-3xl text-emerald-500">{currency.symbol}</span>
                    <input 
                      type="number" 
                      required
                      step="0.01"
                      value={formData.reward}
                      onChange={e => setFormData({...formData, reward: parseFloat(e.target.value)})}
                      className="w-full pl-16 pr-8 py-6 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border-4 border-transparent outline-none focus:border-indigo-500 font-black text-3xl text-emerald-600 shadow-inner"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black text-indigo-500 uppercase tracking-[0.3em] mb-4 block ml-1">Target Capacity</label>
                  <input 
                    type="number" 
                    required
                    value={formData.quantity}
                    onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})}
                    className="w-full px-8 py-6 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border-4 border-transparent outline-none focus:border-indigo-500 font-black text-3xl shadow-inner"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-black text-indigo-500 uppercase tracking-[0.3em] mb-4 block ml-1">Verification Protocols</label>
                  <input 
                    type="text" 
                    required
                    value={formData.instruction}
                    onChange={e => setFormData({...formData, instruction: e.target.value})}
                    placeholder="PROOF OF EXECUTION REQUIREMENTS"
                    className="w-full px-8 py-6 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border-4 border-transparent outline-none focus:border-indigo-500 font-black text-lg shadow-inner uppercase"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-black text-indigo-500 uppercase tracking-[0.3em] mb-4 block ml-1">Initial Deployment State</label>
                  <div className="grid grid-cols-2 gap-8">
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, status: TaskStatus.PUBLISHED})}
                      className={`relative py-8 rounded-[2.5rem] text-sm font-black uppercase tracking-[0.2em] transition-all shadow-xl active:translate-y-2 active:shadow-none ${
                        formData.status === TaskStatus.PUBLISHED 
                        ? 'bg-emerald-500 text-white shadow-[0_12px_0_rgb(5,150,105)]' 
                        : 'bg-slate-50 dark:bg-slate-900 text-slate-400 border-b-8 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      INSTANT LAUNCH
                    </button>
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, status: TaskStatus.HOLD})}
                      className={`relative py-8 rounded-[2.5rem] text-sm font-black uppercase tracking-[0.2em] transition-all shadow-xl active:translate-y-2 active:shadow-none ${
                        formData.status === TaskStatus.HOLD 
                        ? 'bg-amber-500 text-white shadow-[0_12px_0_rgb(217,119,6)]' 
                        : 'bg-slate-50 dark:bg-slate-900 text-slate-400 border-b-8 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      SECURE HANGAR
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-8 pt-8">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-6 bg-slate-100 dark:bg-slate-700 rounded-[2.5rem] font-black text-xl text-slate-500 transition-all hover:bg-slate-200 active:translate-y-2 shadow-lg"
                >
                  CANCEL
                </button>
                <button 
                  type="submit"
                  className="flex-[2] py-6 bg-indigo-600 text-white rounded-[2.5rem] font-black text-2xl shadow-[0_15px_40px_-10px_rgba(79,70,229,0.5)] hover:shadow-[0_20px_50px_-10px_rgba(79,70,229,0.7)] hover:-translate-y-2 transition-all active:translate-y-4 active:shadow-none border-b-[10px] border-indigo-900"
                >
                  {editingTask ? 'RECALIBRATE CORE' : 'INITIATE DEPLOYMENT'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}} />
    </div>
  );
};
