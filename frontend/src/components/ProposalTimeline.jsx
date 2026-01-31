import React from 'react';
import { Check, Circle, Clock } from 'lucide-react';

const ProposalTimeline = ({ currentStage, timestamps }) => {
    const stages = [
        { id: 'SUBMITTED', label: 'Submitted', date: timestamps.submittedAt },
        { id: 'VOTING', label: 'Voting', date: timestamps.votingStartedAt },
        { id: 'APPROVED', label: 'Approved', date: timestamps.approvedAt },
        { id: 'EXECUTED', label: 'Executed', date: timestamps.executedAt },
    ];

    // Helper to determine step status
    const getStepStatus = (stepId) => {
        const order = ['SUBMITTED', 'VOTING', 'APPROVED', 'EXECUTED'];
        const currentIndex = order.indexOf(currentStage);
        const stepIndex = order.indexOf(stepId);

        if (stepIndex < currentIndex) return 'completed';
        if (stepIndex === currentIndex) return 'current';
        return 'upcoming';
    };

    return (
        <div className="w-full py-6">
            <div className="relative flex justify-between items-center w-full">
                {/* Progress Line Background */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-700 -z-0"></div>

                {stages.map((stage, index) => {
                    const status = getStepStatus(stage.id);
                    return (
                        <div key={stage.id} className="relative z-10 flex flex-col items-center group">
                            <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300
                        ${status === 'completed' ? 'bg-green-500 border-green-500 text-white' : ''}
                        ${status === 'current' ? 'bg-indigo-600 border-indigo-900 text-white scale-110 shadow-lg shadow-indigo-500/50' : ''}
                        ${status === 'upcoming' ? 'bg-slate-800 border-slate-600 text-slate-500' : ''}
                    `}>
                                {status === 'completed' && <Check size={18} />}
                                {status === 'current' && <Clock size={18} className="animate-pulse" />}
                                {status === 'upcoming' && <Circle size={14} />}
                            </div>

                            <div className="absolute top-12 flex flex-col items-center w-32">
                                <span className={`text-sm font-semibold ${status === 'current' ? 'text-indigo-400' : 'text-slate-400'}`}>
                                    {stage.label}
                                </span>
                                {stage.date && (
                                    <span className="text-xs text-slate-500 mt-1">
                                        {new Date(stage.date).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ProposalTimeline;
