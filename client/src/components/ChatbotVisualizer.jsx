import React, { useState, useRef } from 'react';

const KNOWLEDGE_BASE = [
  {
    patterns: ['hello', 'hi', 'hey', 'greetings', 'howdy', 'good morning', 'good afternoon', 'good evening'],
    responses: [
      "Hello! 👋 I'm NOVA, your AI Lab assistant. Ask me anything about AI algorithms!",
      "Hi there! Welcome to NOVA.lab — your SPPU 2024 AI Laboratory. What would you like to know?",
      "Hey! Great to see you. Try asking about BFS, DFS, Alpha-Beta, 8-Queens, or AI concepts!",
    ]
  },
  {
    patterns: ['what is ai', 'define ai', 'artificial intelligence', 'what is artificial intelligence', 'explain ai'],
    responses: [
      "🤖 Artificial Intelligence (AI) is the simulation of human intelligence in machines. It enables computers to learn, reason, problem-solve, plan, and understand language — just like humans do!",
      "AI is a branch of computer science focused on building smart systems. It includes ML, deep learning, search algorithms, expert systems, and more!",
    ]
  },
  {
    patterns: ['machine learning', 'what is ml', 'ml'],
    responses: [
      "📊 Machine Learning (ML) is a subset of AI where systems learn patterns from data and improve from experience — without being explicitly programmed. It powers Netflix recommendations, spam filters, and fraud detection!",
    ]
  },
  {
    patterns: ['deep learning', 'neural network', 'cnn', 'lstm'],
    responses: [
      "🧠 Deep Learning uses multi-layered artificial neural networks (ANNs) inspired by the human brain. It powers ChatGPT, DALL-E, image recognition, speech synthesis, and AlphaGo!",
    ]
  },
  {
    patterns: ['what is bfs', 'breadth first search', 'bfs', 'breadth-first'],
    responses: [
      "🔍 BFS (Breadth-First Search) explores nodes level by level using a FIFO queue. It's complete and optimal for unweighted graphs — guaranteeing the shortest path! Used in GPS routing, network broadcasting, web crawling.",
    ]
  },
  {
    patterns: ['what is dfs', 'depth first search', 'dfs', 'depth-first'],
    responses: [
      "⬇️ DFS (Depth-First Search) dives deep along each branch using a LIFO stack before backtracking. Memory-efficient (O(depth)) but doesn't guarantee shortest path. Used in maze solving, topological sort, cycle detection.",
    ]
  },
  {
    patterns: ['alpha beta', 'alpha-beta', 'minimax', 'adversarial', 'game tree'],
    responses: [
      "♟️ Alpha-Beta Pruning optimizes the Minimax algorithm by skipping branches that can't affect the final decision. It maintains α (MAX's best guarantee) and β (MIN's best guarantee) — pruning when α ≥ β. Used in chess engines like Stockfish!",
    ]
  },
  {
    patterns: ['8 queens', 'eight queens', 'n queens', 'queens problem'],
    responses: [
      "👑 The 8-Queens problem places 8 non-attacking queens on an 8×8 chessboard. Solved using Backtracking CSP — there are exactly 92 distinct solutions! Brute force tries 16.7M combos; backtracking reduces this to ~15,720 nodes.",
    ]
  },
  {
    patterns: ['water jug', 'jug problem', 'water jug problem'],
    responses: [
      "🪣 The Water Jug problem uses a 4L and 3L jug to measure exactly 2L using DFS. With 20 possible states and 6 operators (fill, empty, pour), DFS traverses the state space using a stack to find the solution path!",
    ]
  },
  {
    patterns: ['a star', 'a*', 'heuristic', 'informed search'],
    responses: [
      "⭐ A* Search uses f(n) = g(n) + h(n) where g is the path cost so far and h is the heuristic estimate to the goal. It's both complete and optimal when h is admissible (never overestimates). Used in GPS and game pathfinding!",
    ]
  },
  {
    patterns: ['vacuum cleaner', 'reflex agent', 'simple agent', 'intelligent agent'],
    responses: [
      "🤖 A Simple Reflex Agent operates on Condition-Action rules: IF dirty → Suck, IF in Room A → Move Right, etc. It's the simplest agent type — no memory, purely reactive to current percepts!",
    ]
  },
  {
    patterns: ['tower of hanoi', 'hanoi'],
    responses: [
      "🗼 Tower of Hanoi uses recursive state-space search to move N disks from peg A to C using peg B. Minimum moves = 2^N - 1. For 3 disks: 7 moves; for 10 disks: 1023 moves!",
    ]
  },
  {
    patterns: ['chatbot', 'how do you work', 'how are you made', 'pattern matching'],
    responses: [
      "I'm a rule-based chatbot using pattern matching! I preprocess your input (lowercase + remove punctuation), then check each rule's keywords. If a pattern is found in your text → I return a matching response. No ML, just IF-THEN rules!",
    ]
  },
  {
    patterns: ['sppu', 'syllabus', 'practical', 'experiment', 'lab'],
    responses: [
      "📚 NOVA.lab covers all 8 SPPU 2024 AI Lab practicals: Vacuum Agent, BFS, A*, Hanoi (State Space), Alpha-Beta Pruning, BFS Robot Path, DFS Water Jug, 8-Queens CSP, and Chatbot Pattern Matching!",
    ]
  },
  {
    patterns: ['who are you', 'your name', 'what are you', 'introduce yourself'],
    responses: [
      "I'm NOVA 🤖 — the AI assistant for NOVA.lab, your interactive SPPU 2024 AI Laboratory! I know about search algorithms, game theory, CSPs, expert systems, and NLP.",
      "I'm an intelligent pattern-matching chatbot built to help you understand AI concepts for your SPPU practicals. Ask me anything!",
    ]
  },
  {
    patterns: ['help', 'what can you do', 'topics', 'what do you know'],
    responses: [
      "I can answer questions about:\n• 🔍 BFS, DFS, A* Search\n• ♟️ Alpha-Beta Pruning & Minimax\n• 👑 8-Queens Backtracking CSP\n• 🪣 Water Jug DFS\n• 🤖 Vacuum Cleaner Reflex Agent\n• 🧠 AI, ML, Deep Learning concepts\n• 💬 Chatbots & Pattern Matching\n\nJust ask!",
    ]
  },
  {
    patterns: ['bye', 'goodbye', 'exit', 'quit', 'see you', 'thanks', 'thank you'],
    responses: [
      "Goodbye! 👋 Keep exploring AI — you're going to ace those practicals! Come back anytime. 🚀",
      "See you! Happy learning at NOVA.lab. Good luck with your SPPU exam! 🎓",
    ]
  },
];

const FALLBACK = [
  "Hmm, I'm not sure about that. Try asking about BFS, DFS, Alpha-Beta, 8-Queens, A*, or AI concepts!",
  "I didn't quite catch that. Could you rephrase? I know about search algorithms, CSPs, game theory, and AI fundamentals!",
  "That's outside my current knowledge. Try: 'what is BFS', 'explain minimax', 'how does 8-queens work', or 'who are you'.",
];

function preprocess(text) {
  return text.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
}

function getResponse(input) {
  const processed = preprocess(input);
  for (const rule of KNOWLEDGE_BASE) {
    for (const pattern of rule.patterns) {
      if (processed.includes(pattern)) {
        const opts = rule.responses;
        return opts[Math.floor(Math.random() * opts.length)];
      }
    }
  }
  return FALLBACK[Math.floor(Math.random() * FALLBACK.length)];
}

const QUICK_ASKS = [
  'What is BFS?', 'Explain Alpha-Beta', '8-Queens problem?', 'What is AI?', 'How do you work?',
  'What is DFS?', 'Water Jug problem?', 'What is A*?', 'Help',
];

export default function ChatbotVisualizer() {
  const [messages, setMessages] = useState([
    { from: 'bot', text: "Hello! 👋 I'm NOVA, your AI Lab assistant. Ask me about any experiment or AI concept!", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef(null);

  const send = (text) => {
    const q = text || input.trim();
    if (!q) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { from: 'user', text: q, time: now }]);
    setInput('');
    setThinking(true);
    setTimeout(() => {
      const reply = getResponse(q);
      setMessages(prev => [...prev, { from: 'bot', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      setThinking(false);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    }, 500 + Math.random() * 400);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div style={{ fontFamily: 'var(--font-main)', color: '#0f172a' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', padding: '0.85rem 1.25rem', backgroundColor: '#0f172a', borderRadius: '14px', color: '#fff' }}>
        <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
          🤖
        </div>
        <div>
          <div style={{ fontWeight: '800', fontSize: '1rem' }}>NOVA AI Assistant</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#10b981' }} />
            Rule-Based Pattern Matching · SPPU 2024 AI Lab
          </div>
        </div>
        <div style={{ marginLeft: 'auto', fontSize: '0.72rem', color: '#64748b', backgroundColor: '#1e293b', padding: '0.25rem 0.6rem', borderRadius: '9999px' }}>
          {KNOWLEDGE_BASE.length} rules
        </div>
      </div>

      {/* Quick ask chips */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
        {QUICK_ASKS.map(q => (
          <button
            key={q}
            onClick={() => send(q)}
            style={{ padding: '0.35rem 0.8rem', borderRadius: '9999px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', color: '#334155', fontSize: '0.78rem', fontWeight: '600', cursor: 'pointer' }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div style={{ height: '340px', overflowY: 'auto', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: msg.from === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: '0.5rem' }}>
            {msg.from === 'bot' && (
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', flexShrink: 0 }}>
                🤖
              </div>
            )}
            <div style={{ maxWidth: '75%' }}>
              <div style={{
                padding: '0.65rem 0.95rem',
                borderRadius: msg.from === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                backgroundColor: msg.from === 'user' ? '#0f172a' : '#ffffff',
                color: msg.from === 'user' ? '#fff' : '#0f172a',
                fontSize: '0.88rem',
                lineHeight: '1.55',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                border: msg.from === 'bot' ? '1px solid #e2e8f0' : 'none',
                whiteSpace: 'pre-wrap',
              }}>
                {msg.text}
              </div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '0.2rem', textAlign: msg.from === 'user' ? 'right' : 'left' }}>
                {msg.time}
              </div>
            </div>
          </div>
        ))}
        {thinking && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>🤖</div>
            <div style={{ padding: '0.6rem 0.9rem', borderRadius: '14px 14px 14px 4px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', fontSize: '0.88rem', color: '#64748b' }}>
              <span style={{ animation: 'pulse 1s infinite' }}>● ● ●</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask about BFS, DFS, Alpha-Beta, 8-Queens, AI..."
          style={{
            flex: 1,
            padding: '0.75rem 1.1rem',
            borderRadius: '9999px',
            border: '1.5px solid #e2e8f0',
            fontSize: '0.9rem',
            outline: 'none',
            fontFamily: 'var(--font-main)',
            color: '#0f172a',
            backgroundColor: '#ffffff',
          }}
        />
        <button
          onClick={() => send()}
          disabled={!input.trim() || thinking}
          style={{
            padding: '0.75rem 1.4rem',
            borderRadius: '9999px',
            border: 'none',
            backgroundColor: input.trim() ? '#0f172a' : '#e2e8f0',
            color: input.trim() ? '#fff' : '#94a3b8',
            fontWeight: '700',
            cursor: input.trim() ? 'pointer' : 'not-allowed',
            fontSize: '0.9rem',
          }}
        >
          Send ➤
        </button>
      </div>

      <div style={{ marginTop: '0.5rem', fontSize: '0.72rem', color: '#94a3b8', textAlign: 'center' }}>
        Rule-based pattern matching · {KNOWLEDGE_BASE.length} IF-THEN rules · No ML required
      </div>
    </div>
  );
}
