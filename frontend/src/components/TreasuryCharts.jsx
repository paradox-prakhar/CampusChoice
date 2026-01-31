import React, { useState, useEffect } from 'react';
import {
    PieChart, Pie, Cell,
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import { ethers } from 'ethers';

const TreasuryCharts = ({ daoContract }) => {
    // Mock Data State
    const [data, setData] = useState({
        balance: "50,000",
        allocation: [
            { name: 'Allocated', value: 12000 },
            { name: 'Available', value: 38000 }
        ],
        successRate: [
            { name: 'Passed', value: 15 },
            { name: 'Rejected', value: 5 }
        ]
    });

    const COLORS = ['#82ca9d', '#8884d8'];

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '2rem' }}>
            {/* Metric 1: Total Treasury Balance */}
            <div className="card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h3 style={{ color: 'var(--color-text-dim)', fontSize: '0.9em' }}>Total Treasury Balance</h3>
                <div style={{ fontSize: '2.5em', fontWeight: 'bold', color: '#82ca9d' }}>
                    {data.balance} <span style={{ fontSize: '0.4em' }}>MATIC</span>
                </div>
                <div style={{ fontSize: '0.8em', color: 'var(--color-text-dim)' }}>
                    ▲ 5% this semester
                </div>
            </div>

            {/* Metric 2: Allocation Pie Chart */}
            <div className="card">
                <h3 style={{ fontSize: '0.9em', textAlign: 'center', marginBottom: '10px' }}>Funds: Allocated vs Available</h3>
                <div style={{ height: '150px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data.allocation}
                                innerRadius={40}
                                outerRadius={60}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.allocation.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div style={{ textAlign: 'center', fontSize: '0.8em' }}>
                    <span style={{ color: COLORS[0] }}>● Allocated</span> &nbsp;
                    <span style={{ color: COLORS[1] }}>● Available</span>
                </div>
            </div>

            {/* Metric 3: Success Rate Bar Chart */}
            <div className="card">
                <h3 style={{ fontSize: '0.9em', textAlign: 'center', marginBottom: '10px' }}>Proposal Success Rate</h3>
                <div style={{ height: '150px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.successRate}>
                            <XAxis dataKey="name" stroke="var(--color-text-dim)" fontSize={12} />
                            <YAxis stroke="var(--color-text-dim)" fontSize={12} />
                            <Tooltip cursor={{ fill: 'rgba(255,255,255,0.1)' }} contentStyle={{ background: '#333', border: 'none' }} />
                            <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]}>
                                {data.successRate.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index === 0 ? '#82ca9d' : '#ef4444'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default TreasuryCharts;
