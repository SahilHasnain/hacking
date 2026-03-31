'use client';

import { useState } from 'react';
import Link from 'next/link';

type XSSLevel = 'reflected-low' | 'reflected-medium' | 'reflected-high' | 'stored-low' | 'dom-based' | 'secure';

const LEVEL_INFO = {
    'reflected-low': {
        emoji: '🟢',
        title: 'REFLECTED XSS - LOW',
        description: 'No sanitization at all',
        color: 'green'
    },
    'reflected-medium': {
        emoji: '🟡',
        title: 'REFLECTED XSS - MEDIUM',
        description: 'Basic filtering',
        color: 'yellow'
    },
    'reflected-high': {
        emoji: '🟠',
        title: 'REFLECTED XSS - HIGH',
        description: 'Advanced filtering',
        color: 'orange'
    },
    'stored-low': {
        emoji: '🔴',
        title: 'STORED XSS - LOW',
        description: 'Persistent XSS attack',
        color: 'red'
    },
    'dom-based': {
        emoji: '🟣',
        title: 'DOM-BASED XSS',
        description: 'Client-side vulnerability',
        color: 'purple'
    },
    'secure': {
        emoji: '🔐',
        title: 'SECURE',
        description: 'Properly sanitized',
        color: 'blue'
    }
};

const HINTS = {
    'reflected-low': [
        "💡 Try basic <script>alert('XSS')</script>",
        "💡 No filtering at all - anything works!",
        "💡 Try <img src=x onerror=alert('XSS')>",
        "💡 HTML tags are rendered directly"
    ],
    'reflected-medium': [
        "💡 <script> tags are blocked",
        "💡 Try event handlers: <img src=x onerror=alert(1)>",
        "💡 Use <svg> tags with onload",
        "💡 Try <iframe> or other HTML tags"
    ],
    'reflected-high': [
        "💡 Most HTML tags are blocked",
        "💡 Try encoding techniques",
        "💡 Use less common tags",
        "💡 Try <details> or <marquee> with event handlers"
    ],
    'stored-low': [
        "💡 Your input is saved and shown to all users",
        "💡 This is more dangerous than reflected XSS",
        "💡 Try <script>alert('Stored XSS')</script>",
        "💡 Payload executes every time page loads"
    ],
    'dom-based': [
        "💡 Vulnerability is in client-side JavaScript",
        "💡 Check how URL parameters are used",
        "💡 Try manipulating the URL hash",
        "💡 Use browser DevTools to inspect DOM manipulation"
    ],
    'secure': [
        "💡 Proper HTML escaping is used",
        "💡 Content Security Policy (CSP) is enabled",
        "💡 All user input is sanitized",
        "💡 Try your previous attacks - they won't work!"
    ]
};

export default function XSSLab() {
    const [level, setLevel] = useState<XSSLevel>('reflected-low');
    const [userInput, setUserInput] = useState('');
    const [output, setOutput] = useState('');
    const [showHints, setShowHints] = useState(false);
    const [comments, setComments] = useState<string[]>([]);
    const [xssTriggered, setXssTriggered] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setXssTriggered(false);

        let result = '';

        switch (level) {
            case 'reflected-low':
                // Vulnerable: Direct HTML rendering
                result = userInput;
                break;

            case 'reflected-medium':
                // Medium: Block <script> tags only
                result = userInput.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '[BLOCKED]');
                break;

            case 'reflected-high':
                // High: Block most HTML tags
                const blockedTags = ['script', 'iframe', 'object', 'embed', 'img', 'svg', 'video', 'audio'];
                result = userInput;
                blockedTags.forEach(tag => {
                    const regex = new RegExp(`<${tag}\\b[^>]*>`, 'gi');
                    result = result.replace(regex, '[BLOCKED]');
                });
                break;

            case 'stored-low':
                // Stored XSS: Save to comments array
                setComments([...comments, userInput]);
                result = 'Comment posted! Check below to see all comments.';
                break;

            case 'dom-based':
                // DOM-based: Will be handled by useEffect
                result = `Processing: ${userInput}`;
                // Simulate DOM manipulation
                setTimeout(() => {
                    const container = document.getElementById('dom-output');
                    if (container) {
                        container.innerHTML = userInput; // Vulnerable!
                    }
                }, 100);
                break;

            case 'secure':
                // Secure: Proper escaping
                result = userInput
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#x27;');
                break;
        }

        setOutput(result);
    };

    const quickFill = (payload: string) => {
        setUserInput(payload);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const PayloadButton = ({ payload, className, label }: { payload: string; className: string; label?: string }) => (
        <div className="relative group">
            <button onClick={() => quickFill(payload)} className={`w-full text-left p-2 pr-20 rounded text-xs transition-colors font-mono ${className}`}>
                {label || payload.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
            </button>
            <button
                onClick={(e) => { e.stopPropagation(); copyToClipboard(payload); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs whitespace-nowrap"
            >
                📋 Copy
            </button>
        </div>
    );

    const clearComments = () => {
        setComments([]);
    };

    // Simulate XSS detection
    const detectXSS = (content: string) => {
        if (content.includes('<script>') || content.includes('onerror=') || content.includes('onload=')) {
            setXssTriggered(true);
        }
    };

    const currentLevel = LEVEL_INFO[level];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">🎭 XSS (Cross-Site Scripting) Lab</h1>
                    <p className="text-gray-400">Learn XSS attacks and defenses</p>
                    <Link
                        href="/"
                        className="inline-block mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                    >
                        ← Back to SQL Injection Lab
                    </Link>
                </div>

                {/* Level Selector */}
                <div className="mb-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <h2 className="text-xl font-bold mb-4">Select XSS Level</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        {(Object.keys(LEVEL_INFO) as XSSLevel[]).map((lvl) => {
                            const info = LEVEL_INFO[lvl];
                            return (
                                <button
                                    key={lvl}
                                    onClick={() => {
                                        setLevel(lvl);
                                        setOutput('');
                                        setUserInput('');
                                        setShowHints(false);
                                        setXssTriggered(false);
                                    }}
                                    className={`p-3 rounded-lg border-2 transition-all ${level === lvl
                                        ? 'border-blue-500 bg-blue-900/30 scale-105'
                                        : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                                        }`}
                                >
                                    <div className="text-2xl mb-1">{info.emoji}</div>
                                    <div className="font-semibold text-xs">{info.title}</div>
                                    <div className="text-xs text-gray-400 mt-1 leading-tight">{info.description}</div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Input Form */}
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                {currentLevel.emoji} {currentLevel.title}
                            </h2>
                            <p className="text-sm text-gray-400">{currentLevel.description}</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm mb-2 font-semibold">
                                    {level === 'stored-low' ? 'Post a Comment:' : 'Enter Your Input:'}
                                </label>
                                <textarea
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    className="w-full p-3 bg-gray-900 rounded border border-gray-600 focus:border-blue-500 outline-none font-mono text-sm h-32"
                                    placeholder="Try XSS payloads here..."
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-red-600 hover:bg-red-700 rounded font-semibold transition-colors"
                            >
                                🚀 Submit
                            </button>
                        </form>

                        {/* Hints */}
                        <div className="mt-6 pt-6 border-t border-gray-700">
                            <button
                                onClick={() => setShowHints(!showHints)}
                                className="w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded font-semibold flex items-center justify-between transition-colors"
                            >
                                <span>💡 Need Hints?</span>
                                <span>{showHints ? '▼' : '▶'}</span>
                            </button>

                            {showHints && (
                                <div className="mt-3 space-y-2">
                                    {HINTS[level].map((hint, idx) => (
                                        <div key={idx} className="p-3 bg-gray-900 rounded text-sm text-gray-300">
                                            {hint}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Quick Payloads */}
                        <div className="mt-4 pt-4 border-t border-gray-700">
                            <p className="text-sm text-gray-400 mb-3">⚡ Quick XSS Payloads for {currentLevel.title}:</p>
                            <div className="space-y-2">
                                {/* LOW level payloads */}
                                {level === 'reflected-low' && (
                                    <>
                                        <PayloadButton payload="<script>alert('XSS')</script>" className="bg-green-900/30 hover:bg-green-900/50 border border-green-700" label="&lt;script&gt;alert('XSS')&lt;/script&gt;" />
                                        <PayloadButton payload="<img src=x onerror=alert('XSS')>" className="bg-green-900/30 hover:bg-green-900/50 border border-green-700" label="&lt;img src=x onerror=alert('XSS')&gt;" />
                                        <PayloadButton payload="<svg onload=alert('XSS')>" className="bg-green-900/30 hover:bg-green-900/50 border border-green-700" label="&lt;svg onload=alert('XSS')&gt;" />
                                    </>
                                )}

                                {/* MEDIUM level payloads */}
                                {level === 'reflected-medium' && (
                                    <>
                                        <PayloadButton payload="<img src=x onerror=alert('XSS')>" className="bg-yellow-900/30 hover:bg-yellow-900/50 border border-yellow-700" label="&lt;img src=x onerror=alert('XSS')&gt;" />
                                        <PayloadButton payload="<svg onload=alert('XSS')>" className="bg-yellow-900/30 hover:bg-yellow-900/50 border border-yellow-700" label="&lt;svg onload=alert('XSS')&gt;" />
                                        <PayloadButton payload="<iframe src='javascript:alert(1)'>" className="bg-yellow-900/30 hover:bg-yellow-900/50 border border-yellow-700" label="&lt;iframe src='javascript:alert(1)'&gt;" />
                                    </>
                                )}

                                {/* HIGH level payloads - BYPASS TECHNIQUES */}
                                {level === 'reflected-high' && (
                                    <>
                                        <PayloadButton payload="<details open ontoggle=alert('XSS')>" className="bg-orange-900/30 hover:bg-orange-900/50 border border-orange-700" label="💡 &lt;details open ontoggle=alert('XSS')&gt;" />
                                        <PayloadButton payload="<input onfocus=alert('XSS') autofocus>" className="bg-orange-900/30 hover:bg-orange-900/50 border border-orange-700" label="💡 &lt;input onfocus=alert('XSS') autofocus&gt;" />
                                        <PayloadButton payload="<marquee onstart=alert('XSS')>XSS</marquee>" className="bg-orange-900/30 hover:bg-orange-900/50 border border-orange-700" label="💡 &lt;marquee onstart=alert('XSS')&gt;" />
                                        <PayloadButton payload="<select onfocus=alert('XSS') autofocus>" className="bg-orange-900/30 hover:bg-orange-900/50 border border-orange-700" label="💡 &lt;select onfocus=alert('XSS') autofocus&gt;" />
                                        <PayloadButton payload="<textarea onfocus=alert('XSS') autofocus>" className="bg-orange-900/30 hover:bg-orange-900/50 border border-orange-700" label="💡 &lt;textarea onfocus=alert('XSS') autofocus&gt;" />
                                        <PayloadButton payload="<div onmouseover=alert('XSS')>Hover me!</div>" className="bg-orange-900/30 hover:bg-orange-900/50 border border-orange-700" label="💡 &lt;div onmouseover=alert('XSS')&gt;Hover!&lt;/div&gt;" />
                                        <PayloadButton payload={'<a href="javascript:alert(\'XSS\')">Click</a>'} className="bg-orange-900/30 hover:bg-orange-900/50 border border-orange-700" label="💡 &lt;a href=&quot;javascript:alert('XSS')&quot;&gt;Click&lt;/a&gt;" />
                                    </>
                                )}

                                {/* STORED level payloads */}
                                {level === 'stored-low' && (
                                    <>
                                        <PayloadButton payload="<script>alert('Stored XSS')</script>" className="bg-red-900/30 hover:bg-red-900/50 border border-red-700" label="&lt;script&gt;alert('Stored XSS')&lt;/script&gt;" />
                                        <PayloadButton payload="<img src=x onerror=alert('Persistent')>" className="bg-red-900/30 hover:bg-red-900/50 border border-red-700" label="&lt;img src=x onerror=alert('Persistent')&gt;" />
                                    </>
                                )}

                                {/* DOM-BASED level payloads */}
                                {level === 'dom-based' && (
                                    <>
                                        <PayloadButton payload="<img src=x onerror=alert('DOM XSS')>" className="bg-purple-900/30 hover:bg-purple-900/50 border border-purple-700" label="&lt;img src=x onerror=alert('DOM XSS')&gt;" />
                                        <PayloadButton payload="<script>alert('DOM')</script>" className="bg-purple-900/30 hover:bg-purple-900/50 border border-purple-700" label="&lt;script&gt;alert('DOM')&lt;/script&gt;" />
                                    </>
                                )}

                                {/* SECURE level - show that nothing works */}
                                {level === 'secure' && (
                                    <>
                                        <PayloadButton payload="<script>alert('XSS')</script>" className="bg-gray-700 hover:bg-gray-600 opacity-60" label="❌ &lt;script&gt; (Won't work)" />
                                        <PayloadButton payload="<details open ontoggle=alert('XSS')>" className="bg-gray-700 hover:bg-gray-600 opacity-60" label="❌ &lt;details&gt; (Won't work)" />
                                        <div className="p-3 bg-blue-900/30 rounded text-sm border border-blue-700">
                                            <p className="font-semibold text-blue-400 mb-1">🔐 Properly Secured!</p>
                                            <p className="text-xs text-gray-300">All HTML is escaped. XSS is impossible.</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Output Display */}
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <h2 className="text-xl font-bold mb-4">📊 Output</h2>

                        {xssTriggered && (
                            <div className="mb-4 p-4 bg-red-900/30 border-2 border-red-600 rounded-lg">
                                <p className="font-bold text-red-400">🚨 XSS DETECTED!</p>
                                <p className="text-sm text-gray-300 mt-1">Your payload would execute in a real scenario!</p>
                            </div>
                        )}

                        {output && (
                            <div className="bg-gray-900 p-4 rounded border border-gray-700 mb-4">
                                <p className="text-xs text-gray-400 mb-2 font-semibold">Rendered Output:</p>
                                <div
                                    className="p-3 bg-white text-black rounded min-h-[100px]"
                                    dangerouslySetInnerHTML={{ __html: output }}
                                />
                            </div>
                        )}

                        {level === 'dom-based' && (
                            <div className="bg-gray-900 p-4 rounded border border-purple-700 mb-4">
                                <p className="text-xs text-gray-400 mb-2 font-semibold">DOM Output:</p>
                                <div
                                    id="dom-output"
                                    className="p-3 bg-white text-black rounded min-h-[100px]"
                                />
                            </div>
                        )}

                        {level === 'stored-low' && comments.length > 0 && (
                            <div className="bg-gray-900 p-4 rounded border border-red-700">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-xs text-gray-400 font-semibold">💬 All Comments (Stored XSS):</p>
                                    <button
                                        onClick={clearComments}
                                        className="text-xs px-2 py-1 bg-red-600 hover:bg-red-700 rounded"
                                    >
                                        Clear
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {comments.map((comment, idx) => (
                                        <div
                                            key={idx}
                                            className="p-3 bg-white text-black rounded"
                                            dangerouslySetInnerHTML={{ __html: comment }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {!output && level !== 'stored-low' && (
                            <div className="text-center py-12 text-gray-500">
                                <div className="text-4xl mb-4">🎭</div>
                                <p>Submit an input to see the output...</p>
                                <p className="text-sm mt-2">Try the quick payloads!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Info Section */}
                <div className="mt-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <h2 className="text-xl font-bold mb-4">📚 What is XSS?</h2>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div className="bg-gray-900 p-4 rounded">
                            <p className="font-semibold text-red-400 mb-2">🎯 Reflected XSS</p>
                            <p className="text-gray-300">Payload is reflected back immediately in the response. Not stored.</p>
                        </div>
                        <div className="bg-gray-900 p-4 rounded">
                            <p className="font-semibold text-orange-400 mb-2">💾 Stored XSS</p>
                            <p className="text-gray-300">Payload is saved and executed every time the page loads. Most dangerous!</p>
                        </div>
                        <div className="bg-gray-900 p-4 rounded">
                            <p className="font-semibold text-purple-400 mb-2">🌐 DOM-Based XSS</p>
                            <p className="text-gray-300">Vulnerability in client-side JavaScript. Never reaches the server.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
