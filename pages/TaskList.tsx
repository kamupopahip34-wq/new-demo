
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TaskStatus, SubmissionStatus } from '../types';
import { Search, Filter, ChevronRight, Upload, X, AlertTriangle } from 'lucide-react';

export const TaskList: React.FC = () => {
  const { tasks, submissions, currentUser, currency, submitTaskProof } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [proofImage, setProofImage] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const userSubmissions = submissions.filter(s => s.userId === currentUser?.id);
  
  const filteredTasks = tasks.filter(t => 
    t.status === TaskStatus.PUBLISHED && 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !userSubmissions.some(s => s.taskId === t.id)
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size exceeds 5MB limit.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofImage(reader.result as string);
        setImageSize(file.size);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitProof = () => {
    if (selectedTask && proofImage) {
      const errorMsg = submitTaskProof(selectedTask.id, proofImage, imageSize);
      if (errorMsg) {
        setError(errorMsg);
      } else {
        setSelectedTask(null);
        setProofImage(null);
        alert('Task proof submitted for review!');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Available Tasks</h1>
          <p className="text-gray-500 text-sm">Pick a task and complete it to earn rewards.</p>
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Find tasks..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white dark:bg-gray-800 rounded-xl text-sm border dark:border-gray-700 outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-64"
            />
          </div>
          <button className="p-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Filter className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map(task => (
          <div 
            key={task.id} 
            className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-transparent hover:border-indigo-200 dark:hover:border-indigo-900 transition-all hover:shadow-xl hover:-translate-y-1"
          >
            <div className="h-24 bg-gradient-to-br from-indigo-500 to-purple-600 p-6 flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 bg-white/5 opacity-20"></div>
               <span className="text-white text-3xl font-black italic opacity-20">EARN {currency.symbol}{task.reward.toFixed(2)}</span>
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-lg group-hover:text-indigo-600 transition-colors">{task.title}</h3>
                <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs px-2 py-1 rounded-full font-bold">
                  {currency.symbol}{task.reward.toFixed(2)}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
                {task.description}
              </p>
              <div className="flex items-center justify-between pt-4 border-t dark:border-gray-700">
                <span className="text-xs text-gray-400 font-medium">
                  {task.quantity - task.completedCount} slots left
                </span>
                <button 
                  onClick={() => setSelectedTask(task)}
                  className="bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-1"
                >
                  Start Task <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-xl font-bold mb-1">No tasks found</h3>
          <p className="text-gray-500">Check back later for new opportunities!</p>
        </div>
      )}

      {/* Task Completion Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-3xl p-8 relative shadow-2xl overflow-y-auto max-h-[90vh]">
            <button 
              onClick={() => { setSelectedTask(null); setProofImage(null); setError(null); }}
              className="absolute top-6 right-6 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="mb-6">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full mb-4 inline-block">Task Submission</span>
              <h2 className="text-2xl font-black mb-2">{selectedTask.title}</h2>
              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-dashed dark:border-gray-700 mb-6">
                <p className="text-sm font-semibold mb-2">Instructions:</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedTask.instruction}</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-bold">Step 1: Complete the requirements</p>
              <p className="text-xs text-gray-500 mb-4">{selectedTask.description}</p>
              
              <p className="text-sm font-bold">Step 2: Upload screenshot</p>
              <div className="relative group border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-8 transition-all hover:border-indigo-400">
                {proofImage ? (
                  <div className="relative">
                    <img src={proofImage} alt="Proof" className="w-full h-40 object-cover rounded-xl" />
                    <button 
                      onClick={() => setProofImage(null)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="w-10 h-10 text-gray-300 mx-auto mb-2 group-hover:text-indigo-500 transition-colors" />
                    <p className="text-xs text-gray-400 mb-2 font-medium">Please send the screenshot</p>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Click to select or drag and drop</p>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                )}
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl flex items-center gap-2 border border-red-100">
                  <AlertTriangle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <button 
                onClick={handleSubmitProof}
                disabled={!proofImage}
                className="w-full py-4 rounded-2xl gradient-bg text-white font-bold hover:shadow-xl transition-all disabled:opacity-50 disabled:grayscale mt-4"
              >
                Submit for Approval (+{currency.symbol}{selectedTask.reward.toFixed(2)})
              </button>
              
              <p className="text-[10px] text-center text-gray-400 italic">
                Anti-fraud systems active. Duplicate or fake images will lead to account suspension.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
