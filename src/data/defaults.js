/**
 * Default PPL x2 Bulking Schedule
 * 
 * Beginner-to-intermediate bulk split following standard research-backed
 * recommendations for muscle growth with adequate recovery.
 * 
 * Each exercise has a youtubeSearchQuery that generates a YouTube search link
 * for proper form videos (using search URLs, not hardcoded video IDs).
 */

function makeExercise(name, sets, reps, notes = '') {
  return {
    id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name,
    sets,
    reps,
    youtubeSearchQuery: `https://www.youtube.com/results?search_query=${encodeURIComponent(name + ' proper form')}`,
    done: false,
    notes
  }
}

export const defaultSchedule = [
  {
    dayNumber: 1,
    dayName: 'Monday',
    label: 'Push A',
    focus: 'Chest / Shoulders / Triceps',
    isRest: false,
    exercises: [
      makeExercise('Barbell Bench Press', 4, '6-8'),
      makeExercise('Incline Dumbbell Press', 3, '8-10'),
      makeExercise('Seated Dumbbell Shoulder Press', 3, '8-10'),
      makeExercise('Lateral Raises', 3, '12-15'),
      makeExercise('Tricep Pushdown', 3, '10-12'),
      makeExercise('Overhead Tricep Extension', 2, '12'),
    ]
  },
  {
    dayNumber: 2,
    dayName: 'Tuesday',
    label: 'Pull A',
    focus: 'Back / Biceps',
    isRest: false,
    exercises: [
      makeExercise('Lat Pulldown or Pull-ups', 4, '6-10'),
      makeExercise('Bent-Over Barbell Row', 3, '8-10'),
      makeExercise('Seated Cable Row', 3, '10-12'),
      makeExercise('Face Pulls', 3, '12-15'),
      makeExercise('Barbell or EZ-Bar Curl', 3, '10-12'),
      makeExercise('Hammer Curl', 2, '12'),
    ]
  },
  {
    dayNumber: 3,
    dayName: 'Wednesday',
    label: 'Legs A',
    focus: 'Quad-dominant',
    isRest: false,
    exercises: [
      makeExercise('Barbell Back Squat', 4, '6-8'),
      makeExercise('Leg Press', 3, '10-12'),
      makeExercise('Walking Lunges', 3, '10/leg'),
      makeExercise('Leg Extension', 3, '12-15'),
      makeExercise('Standing Calf Raise', 4, '15'),
      makeExercise('Plank', 3, '45-60 sec'),
    ]
  },
  {
    dayNumber: 4,
    dayName: 'Thursday',
    label: 'Push B',
    focus: 'Different angles / rep range',
    isRest: false,
    exercises: [
      makeExercise('Overhead Barbell Press', 4, '6-8'),
      makeExercise('Flat Dumbbell Press', 3, '10-12'),
      makeExercise('Cable Chest Fly', 3, '12-15'),
      makeExercise('Arnold Press', 3, '10-12'),
      makeExercise('Diamond Push-ups', 2, 'to failure'),
      makeExercise('Tricep Dips', 3, '10-12'),
    ]
  },
  {
    dayNumber: 5,
    dayName: 'Friday',
    label: 'Pull B + Legs B',
    focus: 'Hybrid / Lighter',
    isRest: false,
    exercises: [
      makeExercise('Deadlift (Romanian or Conventional)', 4, '6-8', 'Light to moderate weight'),
      makeExercise('Single-Arm Dumbbell Row', 3, '10/side'),
      makeExercise('Leg Curl (Hamstring)', 3, '12'),
      makeExercise('Goblet Squat', 3, '12'),
      makeExercise('Cable Curl + Pushdown Superset', 2, '12 each'),
      makeExercise('Hanging Leg Raise', 3, '12-15'),
    ]
  },
  {
    dayNumber: 6,
    dayName: 'Saturday',
    label: 'Recovery',
    focus: 'Rest or light cardio',
    isRest: true,
    exercises: [],
    restMessage: 'Muscles grow when you rest. Light walk, stretching, or foam rolling today.'
  },
  {
    dayNumber: 7,
    dayName: 'Sunday',
    label: 'Recovery',
    focus: 'Rest or active recovery',
    isRest: true,
    exercises: [],
    restMessage: 'Prep for the week. Meal prep, hydrate, sleep well — the gains are loading.'
  }
]

/**
 * Default workout playlist for Music Buttons
 * Mix of hype/workout genres. Rotates randomly on each visit.
 */
export const workoutPlaylist = [
  { title: 'Lose Yourself', artist: 'Eminem' },
  { title: 'Till I Collapse', artist: 'Eminem' },
  { title: 'HUMBLE.', artist: 'Kendrick Lamar' },
  { title: 'Power', artist: 'Kanye West' },
  { title: 'Stronger', artist: 'Kanye West' },
  { title: 'Remember The Name', artist: 'Fort Minor' },
  { title: 'Eye of the Tiger', artist: 'Survivor' },
  { title: "Can't Hold Us", artist: 'Macklemore & Ryan Lewis' },
  { title: 'Thunderstruck', artist: 'AC/DC' },
  { title: 'DNA.', artist: 'Kendrick Lamar' },
  { title: 'Blinding Lights', artist: 'The Weeknd' },
  { title: 'Industry Baby', artist: 'Lil Nas X' },
  { title: 'Run This Town', artist: 'JAY-Z ft. Rihanna & Kanye West' },
  { title: 'Warriors', artist: 'Imagine Dragons' },
  { title: 'Enter Sandman', artist: 'Metallica' },
]

/**
 * Default study roadmap — AI/ML for 2nd Year B.Tech CSE AI&ML
 */
export const defaultStudyRoadmap = [
  {
    id: 'phase-1',
    phase: 1,
    title: 'Math + Python Foundations for ML',
    duration: 'Weeks 1-3, ~3hrs/day',
    items: [
      {
        id: 'p1-linalg',
        title: 'Linear algebra & calculus refresher for ML',
        description: 'Vectors, matrices, derivatives, gradients',
        done: false,
        sources: [
          { name: '3Blue1Brown "Essence of Linear Algebra"', url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab' },
          { name: 'Khan Academy Linear Algebra + Multivariable Calculus', url: 'https://www.khanacademy.org/math/linear-algebra' }
        ]
      },
      {
        id: 'p1-numpy',
        title: 'NumPy + Pandas hands-on',
        description: 'Data manipulation fundamentals',
        done: false,
        sources: [
          { name: 'Kaggle "Pandas" micro-course', url: 'https://www.kaggle.com/learn/pandas' },
          { name: 'Kaggle "Python" micro-course', url: 'https://www.kaggle.com/learn/python' }
        ]
      },
      {
        id: 'p1-stats',
        title: 'Statistics & probability basics',
        description: 'Distributions, hypothesis testing, Bayes theorem',
        done: false,
        sources: [
          { name: 'StatQuest with Josh Starmer', url: 'https://www.youtube.com/c/joshstarmer' }
        ]
      }
    ]
  },
  {
    id: 'phase-2',
    phase: 2,
    title: 'Classical Machine Learning',
    duration: 'Weeks 4-7, ~3hrs/day',
    items: [
      {
        id: 'p2-ml-fundamentals',
        title: 'Regression, classification, clustering, model evaluation',
        description: 'Bias-variance tradeoff, cross-validation, feature engineering',
        done: false,
        sources: [
          { name: "Andrew Ng's ML Specialization (Coursera, audit free)", url: 'https://www.coursera.org/specializations/machine-learning-introduction' },
          { name: 'Kaggle "Intro to Machine Learning"', url: 'https://www.kaggle.com/learn/intro-to-machine-learning' },
          { name: 'Kaggle "Intermediate Machine Learning"', url: 'https://www.kaggle.com/learn/intermediate-machine-learning' }
        ]
      },
      {
        id: 'p2-projects',
        title: 'Build 1-2 small projects on Kaggle',
        description: 'Titanic survival prediction, house price regression',
        done: false,
        sources: [
          { name: 'Kaggle Titanic Competition', url: 'https://www.kaggle.com/c/titanic' },
          { name: 'Kaggle House Prices Competition', url: 'https://www.kaggle.com/c/house-prices-advanced-regression-techniques' }
        ]
      }
    ]
  },
  {
    id: 'phase-3',
    phase: 3,
    title: 'Deep Learning',
    duration: 'Weeks 8-12, ~3.5hrs/day',
    items: [
      {
        id: 'p3-nn-fundamentals',
        title: 'Neural networks, backpropagation, CNNs, RNNs, PyTorch',
        description: 'Core deep learning building blocks',
        done: false,
        sources: [
          { name: 'fast.ai "Practical Deep Learning for Coders"', url: 'https://course.fast.ai/' },
          { name: 'DeepLearning.AI Deep Learning Specialization (Coursera)', url: 'https://www.coursera.org/specializations/deep-learning' }
        ]
      },
      {
        id: 'p3-project',
        title: 'Train a small CNN on a relevant dataset',
        description: 'Could tie into IRONVISION work — same YOLOv8 domain',
        done: false,
        sources: [
          { name: 'PyTorch Tutorials', url: 'https://pytorch.org/tutorials/' }
        ]
      }
    ]
  },
  {
    id: 'phase-4',
    phase: 4,
    title: 'LLMs, Transformers & RAG',
    duration: 'Weeks 13-16, ~4hrs/day',
    items: [
      {
        id: 'p4-transformers',
        title: 'How LLMs/transformers actually work',
        description: 'Attention mechanism, tokenization, context windows',
        done: false,
        sources: [
          { name: 'Luis Serrano — Attention in LLMs (YouTube)', url: 'https://www.youtube.com/results?search_query=luis+serrano+attention+mechanism+transformers' },
          { name: 'Hugging Face NLP Course', url: 'https://huggingface.co/learn/nlp-course' }
        ]
      },
      {
        id: 'p4-prompting',
        title: 'Prompt engineering fundamentals',
        description: 'Directly applicable since you already use Claude/Groq',
        done: false,
        sources: [
          { name: "Anthropic's Prompt Engineering Docs", url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering' }
        ]
      },
      {
        id: 'p4-rag',
        title: 'RAG systems — concepts, vector DBs, retrieval pipelines',
        description: 'Retrievers, chunking, reranking, evaluation',
        done: false,
        sources: [
          { name: 'DeepLearning.AI RAG Short Course (Coursera)', url: 'https://www.deeplearning.ai/short-courses/' },
          { name: 'Boot.dev "Learn RAG"', url: 'https://www.boot.dev/' },
          { name: 'LangChain Documentation', url: 'https://python.langchain.com/' }
        ]
      },
      {
        id: 'p4-project',
        title: 'Build a small RAG chatbot over your own notes',
        description: 'Great portfolio piece, reusable for NEXUS-R or DeepDive',
        done: false,
        sources: []
      }
    ]
  },
  {
    id: 'phase-5',
    phase: 5,
    title: 'Agents & Applied AI Engineering',
    duration: 'Weeks 17+, ongoing',
    items: [
      {
        id: 'p5-agents',
        title: 'AI agents, tool-calling, multi-agent systems',
        description: 'Agentic RAG, planning, orchestration',
        done: false,
        sources: [
          { name: 'DeepLearning.AI Agentic RAG Short Courses', url: 'https://www.deeplearning.ai/short-courses/' },
          { name: 'Hugging Face Agents Course', url: 'https://huggingface.co/learn/agents-course' }
        ]
      },
      {
        id: 'p5-context',
        title: 'Context engineering',
        description: "2026's emerging focus — deciding what fills the context window: memory, retrieved docs, tool definitions",
        done: false,
        sources: []
      },
      {
        id: 'p5-projects',
        title: 'Keep building real projects',
        description: 'IRONVISION, NEXUS-R, and DeepDive AI tooling all count as portfolio-grade applied work',
        done: false,
        sources: []
      }
    ]
  }
]

/**
 * Default productivity time-block categories
 */
export const defaultCategories = [
  { id: 'classes', name: 'Classes', color: '#3B82F6' },
  { id: 'study', name: 'Study', color: '#4ADE80' },
  { id: 'gym', name: 'Gym', color: '#4F7FFF' },
  { id: 'gaming', name: 'Gaming', color: '#F472B6' },
  { id: 'youtube', name: 'YouTube (DeepDive)', color: '#FF8A4C' },
  { id: 'reading', name: 'Reading', color: '#06B6D4' },
  { id: 'sleep', name: 'Sleep', color: '#7C8CFF' },
  { id: 'other', name: 'Other', color: '#9498A3' },
]

/**
 * Skincare product categories
 */
export const skincareCategories = [
  'Cleanser', 'Moisturizer', 'Sunscreen', 'Serum', 'Toner', 'Exfoliant', 'Mask', 'Other'
]

export const seasonOptions = ['Summer', 'Winter', 'Monsoon', 'All-Season']
