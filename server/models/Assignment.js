import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
    visualizationType: { 
      type: String, 
      required: true,
      enum: ['vacuum', 'hanoi', 'bfs', 'eight-puzzle', 'expert-system', 'alpha-beta', 'bfs-robot', 'dfs-waterjug', 'eight-queens', 'chatbot'] 
    },
    manual: {
      aim: { type: String, required: true },
      objectives: [{ type: String }],
      theory: { type: String, required: true },
      algorithm: [{ type: String }],
      complexity: {
        time: { type: String },
        space: { type: String }
      }
    },
    code: {
      python: { type: String, required: true },
      java: { type: String, required: true }
    },
    resources: [
      {
        title: { type: String },
        url: { type: String }
      }
    ],
    quiz: [
      {
        question: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctIndex: { type: Number, required: true },
        explanation: { type: String }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model('Assignment', assignmentSchema);