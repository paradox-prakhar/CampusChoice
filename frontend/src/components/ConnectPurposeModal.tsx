import { X, Vote, PenTool } from 'lucide-react';


interface ConnectPurposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (purpose: 'VOTE' | 'PROPOSE') => void;
}

export function ConnectPurposeModal({ isOpen, onClose, onSelect }: ConnectPurposeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl shadow-indigo-500/10 transform transition-all animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Connect Wallet</h2>
          <p className="text-slate-400">Choose how would you like to participate today?</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <button 
            onClick={() => onSelect('VOTE')}
            className="group flex items-center p-4 bg-slate-800/50 hover:bg-indigo-500/10 border border-slate-800 hover:border-indigo-500/50 rounded-xl transition-all"
          >
            <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-400 group-hover:text-indigo-300 group-hover:scale-110 transition-all">
              <Vote className="w-6 h-6" />
            </div>
            <div className="ml-4 text-left">
              <h3 className="text-lg font-semibold text-white group-hover:text-indigo-100">Vote on Events</h3>
              <p className="text-sm text-slate-400">Support proposals you want to see happen</p>
            </div>
          </button>

          <button 
            onClick={() => onSelect('PROPOSE')}
            className="group flex items-center p-4 bg-slate-800/50 hover:bg-purple-500/10 border border-slate-800 hover:border-purple-500/50 rounded-xl transition-all"
          >
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400 group-hover:text-purple-300 group-hover:scale-110 transition-all">
              <PenTool className="w-6 h-6" />
            </div>
            <div className="ml-4 text-left">
              <h3 className="text-lg font-semibold text-white group-hover:text-purple-100">Make a Proposal</h3>
              <p className="text-sm text-slate-400">Submit your own event for funding</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
