import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Assignment from './models/Assignment.js';

dotenv.config();

const assignments = [
  {
    title: "Reflex Agent for Vacuum Cleaner World",
    slug: "vacuum-cleaner-agent",
    category: "Intelligent Agents",
    difficulty: "Easy",
    visualizationType: "vacuum",
    manual: {
      aim: "To design, simulate, and analyze the performance of an Agent Architecture (Simple Reflex Agent) within a dynamic, deterministic, fully observable two-location vacuum environment under SPPU 2024 Pattern.",
      objectives: [
        "Deconstruct the PAGE (Percepts, Actions, Goals, Environment) formal specification of autonomous agents.",
        "Implement Condition-Action (If-Then) production rules using state perception tuple <Location, Status>.",
        "Evaluate agent rationality: Compare simple reflex behavior against infinite state cycling and identify the necessity of internal state (Model-based reflex).",
        "Measure performance metrics: Cleanliness ratio vs energy expenditure (number of actions)."
      ],
      theory: `### 1. Intuition & Real-World Analogy
Think of an autonomous cleaning robot (like an iRobot Roomba). How does it decide what to do at any given instant? In its simplest manifestation—a **Simple Reflex Agent**—it has zero memory of the past. It operates entirely on current sensory perception: *"If current tile is dirty, turn on vacuum motor. If clean, advance to the next zone."*

### 2. Formal PEAS Specification (SPPU 2024 Standard)
* **Performance Measure:** +10 points for each clean room per time step; -1 point per movement penalty (energy conservation); -10 penalty for attempting illegal moves.
* **Environment:** Fully observable, deterministic, static 2-room grid [Room A, Room B].
* **Actuators:** Stepper motors [Left, Right], Suction turbine [Suck], Idle state [NoOp].
* **Sensors:** Infrared dirt sensor [Dirty, Clean], Bump/location encoder [Location A, Location B].

### 3. State Space Representation
* **State Vector:** S = (Location, Status_A, Status_B) where Location ∈ {A, B}, Status ∈ {Clean, Dirty}.
* **Total Distinct World States:** 2 locations × 2^2 dirt configurations = 8 distinct global world states.
* **Condition-Action Rules:**
  1. IF State == [*, Dirty] THEN Action = 'Suck'
  2. IF State == [A, Clean] THEN Action = 'Right'
  3. IF State == [B, Clean] THEN Action = 'Left'
  4. IF State == [Clean, Clean] and verified THEN Action = 'NoOp' (Halt)

### 4. Critical Engineering Pitfall: The Infinite Loop Trap
A pure reflex agent with no internal memory in a partially observable environment can oscillate endlessly between Room A and Room B if dirt reappears or if sensor noise occurs. Adding an internal state counter or environment tracking turns this into a rational **Model-Based Agent**.`,
      algorithm: [
        "Step 1: Initialize environment with arbitrary dirt status: Room_A ∈ {Dirty, Clean}, Room_B ∈ {Dirty, Clean} and Agent_Location ∈ {A, B}.",
        "Step 2: Read current sensory input vector: Percept = (Agent_Location, Current_Room_Status).",
        "Step 3: Condition-Action Matching:",
        "        a. If Current_Room_Status == 'Dirty' -> Invoke Actuator 'Suck', set Current_Room_Status = 'Clean', increment performance score by +10.",
        "        b. Else if Agent_Location == 'A' -> Invoke Actuator 'Right', set Agent_Location = 'B', decrement energy score by -1.",
        "        c. Else if Agent_Location == 'B' -> Invoke Actuator 'Left', set Agent_Location = 'A', decrement energy score by -1.",
        "Step 4: Check Global Goal State: If Room_A == 'Clean' AND Room_B == 'Clean', trigger 'NoOp' (No Operation) to conserve actuator power.",
        "Step 5: Output complete telemetry: Action taken, step latency, cumulative energy expenditure, and remaining dirt."
      ],
      complexity: {
        time: "O(1) per lookup decision cycle; O(N) total steps where N is total rooms in environment.",
        space: "O(1) auxiliary memory footprint since pure reflex stores zero historical percept vectors."
      }
    },
    code: {
      python: `class VacuumEnvironment:
    def __init__(self):
        self.rooms = {'A': 'Dirty', 'B': 'Dirty'}
        self.agent_location = 'A'
        self.performance_score = 0

    def get_percept(self):
        return (self.agent_location, self.rooms[self.agent_location])

    def execute_action(self, action):
        if action == 'Suck':
            self.rooms[self.agent_location] = 'Clean'
            self.performance_score += 10
        elif action == 'Right':
            self.agent_location = 'B'
            self.performance_score -= 1
        elif action == 'Left':
            self.agent_location = 'A'
            self.performance_score -= 1
        elif action == 'NoOp':
            pass

    def is_all_clean(self):
        return all(status == 'Clean' for status in self.rooms.values())

def simple_reflex_agent(percept):
    location, status = percept
    if status == 'Dirty':
        return 'Suck'
    elif location == 'A':
        return 'Right'
    elif location == 'B':
        return 'Left'
    return 'NoOp'

# Execution Trace
if __name__ == "__main__":
    env = VacuumEnvironment()
    step = 1
    print("--- Starting Reflex Agent Simulation ---")
    while not env.is_all_clean():
        percept = env.get_percept()
        action = simple_reflex_agent(percept)
        print(f"Step {step} | Percept: {percept} -> Decision: {action}")
        env.execute_action(action)
        step += 1
    
    print(f"Goal Reached! Terminal Status: {env.rooms} | Score: {env.performance_score}")`,
      java: `import java.util.*;

public class ReflexVacuumLab {
    static class Environment {
        Map<String, String> rooms = new HashMap<>();
        String agentLocation = "A";
        int performanceScore = 0;

        Environment() {
            rooms.put("A", "Dirty");
            rooms.put("B", "Dirty");
        }

        boolean isAllClean() {
            return rooms.get("A").equals("Clean") && rooms.get("B").equals("Clean");
        }
    }

    public static String reflexAgent(String location, String status) {
        if (status.equals("Dirty")) return "Suck";
        if (location.equals("A")) return "Right";
        if (location.equals("B")) return "Left";
        return "NoOp";
    }

    public static void main(String[] args) {
        Environment env = new Environment();
        int step = 1;

        while (!env.isAllClean()) {
            String currentStatus = env.rooms.get(env.agentLocation);
            String action = reflexAgent(env.agentLocation, currentStatus);
            System.out.println("Step " + step + " | Loc: " + env.agentLocation + ", Status: " + currentStatus + " -> Action: " + action);

            if (action.equals("Suck")) {
                env.rooms.put(env.agentLocation, "Clean");
                env.performanceScore += 10;
            } else if (action.equals("Right")) {
                env.agentLocation = "B";
                env.performanceScore -= 1;
            } else if (action.equals("Left")) {
                env.agentLocation = "A";
                env.performanceScore -= 1;
            }
            step++;
        }
        System.out.println("All rooms sanitized. Final Score: " + env.performanceScore);
    }
}`
    },
    resources: [
      { title: "SPPU AI Course 2024 Pattern: Agents Specification", url: "http://unipune.ac.in/" },
      { title: "Russell & Norvig AIMA 4th Ed: Chapter 2 (Intelligent Agents)", url: "https://aima.cs.berkeley.edu/" },
      { title: "Stanford CS221: Rational Agents & Environments", url: "https://stanford.edu/~cpiech/cs221/" }
    ],
    quiz: [
      {
        question: "How many total distinct world states exist in a standard 2-room vacuum world?",
        options: ["4 states", "8 states", "16 states", "2 states"],
        correctIndex: 1,
        explanation: "2 possible agent locations (Room A or B) × 2 state options for Room A (Clean/Dirty) × 2 state options for Room B (Clean/Dirty) = 2 × 2 × 2 = 8 distinct global states."
      },
      {
        question: "What happens if a simple reflex agent without memory operates in a partially observable vacuum world where dirt sensor fails intermittently?",
        options: [
          "It autonomously learns from past failures using backpropagation.",
          "It may enter an infinite oscillation loop between rooms.",
          "It immediately converts to an optimal A* graph search.",
          "It shuts down and returns an exception."
        ],
        correctIndex: 1,
        explanation: "Without internal memory or randomisation, a reflex agent with flawed sensory inputs can get trapped in infinite cyclic loops between locations."
      },
      {
        question: "Under the PEAS framework, which of the following is considered an Actuator for the vacuum cleaner?",
        options: ["Infrared Dirt Sensor", "Wheel Motor Drive", "Room Cleanliness Percentage", "Floor Bump Sensor"],
        correctIndex: 1,
        explanation: "Actuators are the mechanisms that alter the environment or change position—such as the wheel drive motor and the vacuum suction pump."
      },
      {
        question: "Why is the action 'NoOp' critical in rational agent design?",
        options: [
          "To allow garbage collector cleanup in memory.",
          "To prevent unnecessary energy consumption once the goal state is achieved.",
          "To reset the clock cycles in microcontroller.",
          "To signal that the agent has failed."
        ],
        correctIndex: 1,
        explanation: "'NoOp' (No Operation) stops unnecessary actuator movement, conserving battery/energy once all cleanliness criteria are satisfied."
      },
      {
        question: "Which type of agent maintains an internal model of the unobserved world to make rational choices?",
        options: ["Simple Reflex Agent", "Model-Based Reflex Agent", "Stateless Random Agent", "Lookup Table Agent"],
        correctIndex: 1,
        explanation: "A Model-Based Reflex agent preserves internal state history to handle partial observability of the current environment."
      }
    ]
  },
  {
    title: "Tower of Hanoi: State Space Search",
    slug: "tower-of-hanoi",
    category: "State Space Representation",
    difficulty: "Medium",
    visualizationType: "hanoi",
    manual: {
      aim: "To mathematically formulate, visualize, and solve the classical Tower of Hanoi puzzle using State-Space Search, Divide & Conquer Recursion, and explore its relation to the Sierpiński triangle state graph.",
      objectives: [
        "Model the puzzle as a State Space Graph G = (V, E) where vertices are disk placements and edges are legal moves.",
        "Derive the exact recurrence relation T(n) = 2T(n-1) + 1 and prove minimal move optimality 2^n - 1.",
        "Demonstrate the Call-Stack execution trace and understand runtime frame allocation.",
        "Implement constraint validation: No disk may be placed on top of a smaller disk (Invariant condition)."
      ],
      theory: `### 1. Intuition & The Big Picture
The Tower of Hanoi is not merely a mathematical puzzle; it is the definitive benchmark for understanding **Divide & Conquer recursion** and **State-Space Tree Traversal**. The challenge lies in moving $n$ stacked disks from a source rod (A) to a destination rod (C) using an auxiliary rod (B), without ever placing a larger disk onto a smaller one.

### 2. State-Space Formulation
* **State Representation:** A tuple of length $n$, where the $i$-th element represents the peg currently holding disk $i$: $S = (p_1, p_2, ..., p_n)$ with $p_k \in \{A, B, C\}$.
* **Start State:** All disks on source peg: $(A, A, ..., A)$.
* **Goal State:** All disks transferred to destination peg: $(C, C, ..., C)$.
* **Total States:** For $n$ disks, exactly $3^n$ distinct legal states exist. The state space graph of Tower of Hanoi forms the self-similar fractal known as the **Sierpiński Triangle**.

### 3. Recurrence & Mathematical Proof of Optimality
To transfer $n$ disks from Source to Destination:
1. Move top $n-1$ disks from Source to Aux $\rightarrow T(n-1)$ moves.
2. Move largest $n$-th disk from Source to Dest $\rightarrow 1$ move.
3. Move $n-1$ disks from Aux to Dest $\rightarrow T(n-1)$ moves.

$$T(n) = 2T(n-1) + 1$$
Solving by expansion:
$$T(n) = 2(2T(n-2) + 1) + 1 = 2^2 T(n-2) + 2 + 1 = ... = 2^n - 1$$
For 3 disks: $2^3 - 1 = 7$ moves. For 4 disks: $2^4 - 1 = 15$ moves.

### 4. Constraints & Invariants
* **Rule 1 (Unitary Motion):** Only one disk may be manipulated per step.
* **Rule 2 (Strict Top Access):** Only the uppermost disk on any rod may be picked.
* **Rule 3 (Size Monotonicity Invariant):** For any rod $R$, if disks $d_i$ and $d_j$ are on $R$ with $d_i$ above $d_j$, then $\text{Size}(d_i) < \text{Size}(d_j)$.`,
      algorithm: [
        "Function SolveHanoi(n, Source, Auxiliary, Destination):",
        "Step 1 [Base Condition]: If n == 1: Print 'Move Disk 1 from ' + Source + ' to ' + Destination. Return.",
        "Step 2 [Sub-problem 1]: Call SolveHanoi(n - 1, Source, Destination, Auxiliary) -> Moves n-1 disks out of the way.",
        "Step 3 [Root Action]: Print 'Move Disk ' + n + ' from ' + Source + ' to ' + Destination.",
        "Step 4 [Sub-problem 2]: Call SolveHanoi(n - 1, Auxiliary, Source, Destination) -> Reassembles n-1 disks onto Destination.",
        "Step 5 [Verification]: Total moves counter must equal exactly (2^n - 1)."
      ],
      complexity: {
        time: "O(2^n) exponential time complexity due to binary recursive branching.",
        space: "O(n) auxiliary memory allocated on the call stack due to max recursion depth of n activation records."
      }
    },
    code: {
      python: `def solve_hanoi(n, source, aux, target, step_tracker):
    if n == 1:
        step_tracker[0] += 1
        print(f"Move #{step_tracker[0]}: Move Disk 1 from Peg {source} -> Peg {target}")
        return

    # 1. Move n-1 disks from Source to Aux using Target as transit
    solve_hanoi(n - 1, source, target, aux, step_tracker)
    
    # 2. Move largest n-th disk to Target
    step_tracker[0] += 1
    print(f"Move #{step_tracker[0]}: Move Disk {n} from Peg {source} -> Peg {target}")
    
    # 3. Move n-1 disks from Aux to Target using Source as transit
    solve_hanoi(n - 1, aux, source, target, step_tracker)

if __name__ == "__main__":
    disks = 3
    counter = [0]
    print(f"Solving Hanoi for {disks} Disks (Theoretical Minimum: {2**disks - 1} moves):")
    solve_hanoi(disks, 'A', 'B', 'C', counter)
    print(f"Completed in {counter[0]} moves.")`,
      java: `public class TowerOfHanoiLab {
    static int moveCount = 0;

    public static void solve(int n, char src, char aux, char dest) {
        if (n == 1) {
            moveCount++;
            System.out.println("Move #" + moveCount + ": Move Disk 1 from " + src + " -> " + dest);
            return;
        }

        solve(n - 1, src, dest, aux);
        moveCount++;
        System.out.println("Move #" + moveCount + ": Move Disk " + n + " from " + src + " -> " + dest);
        solve(n - 1, aux, src, dest);
    }

    public static void main(String[] args) {
        int n = 3;
        System.out.println("Optimal Solution for " + n + " Disks:");
        solve(n, 'A', 'B', 'C');
        System.out.println("Total Execution Steps: " + moveCount);
    }
}`
    },
    resources: [
      { title: "MIT 6.0001: Recurrence Trees & Hanoi Optimization", url: "https://ocw.mit.edu/" },
      { title: "Wolfram MathWorld: Sierpinski Gasket and Hanoi Graph", url: "https://mathworld.wolfram.com/TowerofHanoi.html" }
    ],
    quiz: [
      {
        question: "What is the theoretical minimum number of moves required to solve a 5-disk Tower of Hanoi?",
        options: ["15", "25", "31", "63"],
        correctIndex: 2,
        explanation: "Formula is 2^n - 1. For n = 5: 2^5 - 1 = 32 - 1 = 31 moves."
      },
      {
        question: "How many distinct valid states exist in the complete state-space graph for an n-disk Tower of Hanoi puzzle?",
        options: ["2^n", "3^n", "n!", "n^3"],
        correctIndex: 1,
        explanation: "Each disk can legally reside on any of the 3 pegs independently (provided smaller disks are always on top), resulting in 3 × 3 × ... × 3 = 3^n states."
      },
      {
        question: "What data structure inherently tracks the execution of recursive Hanoi steps during runtime?",
        options: ["FIFO Queue", "LIFO Call Stack", "Priority Min-Heap", "Circular Buffer"],
        correctIndex: 1,
        explanation: "Recursive function calls push activation records onto the LIFO (Last-In-First-Out) Call Stack until the base case n=1 is popped."
      },
      {
        question: "If an algorithm solved Hanoi in 63 moves, how many disks were on the peg?",
        options: ["5 disks", "6 disks", "7 disks", "8 disks"],
        correctIndex: 1,
        explanation: "2^n - 1 = 63 => 2^n = 64 => n = 6 disks."
      },
      {
        question: "What mathematical fractal graph is topologically isomorphic to the Hanoi state transition graph?",
        options: ["Mandelbrot Set", "Sierpiński Triangle", "Koch Snowflake", "Julia Set"],
        correctIndex: 1,
        explanation: "The state space graph of the 3-peg Tower of Hanoi forms the triangular fractal known as the Sierpiński Triangle."
      }
    ]
  },
  {
    title: "Breadth-First Search (BFS) Maze & Graph Pathfinder",
    slug: "bfs-maze-pathfinder",
    category: "Uninformed Search",
    difficulty: "Medium",
    visualizationType: "bfs",
    manual: {
      aim: "To implement, evaluate, and trace Breadth-First Search (BFS) on unweighted grid mazes and graphs using a FIFO queue to guarantee shortest-path optimality under SPPU 2024 Pattern.",
      objectives: [
        "Master Frontier Expansion: First-In-First-Out (FIFO) queue mechanics for level-by-level search.",
        "Implement Cycle Prevention: Distinguish explored sets (Visited Hash) from frontier queues.",
        "Demonstrate Shortest Path Optimality: Prove why BFS guarantees the fewest transitions in unweighted graphs.",
        "Analyze Time and Space Complexities in terms of branching factor b and solution depth d."
      ],
      theory: `### 1. Intuition: The Concentric Ripple Effect
Imagine dropping a pebble into a calm pond. The ripples expand outward uniformly in concentric circles. **Breadth-First Search (BFS)** behaves identically: it explores all immediate neighbor nodes at distance 1 before inspecting any node at distance 2, and so forth. 

### 2. Why BFS Guarantees the Shortest Path
In an unweighted graph (or a grid where every step cost $c = 1$), the first time BFS discovers the goal node $G$, it is **guaranteed** to be via the shortest sequence of edges. Why? Because any path discovered later will have depth $\ge d$.

### 3. Key Data Structures
* **Frontier (FIFO Queue):** Houses nodes discovered but not yet expanded.
* **Explored Set (Visited HashSet):** Remembers visited coordinate keys (e.g., \`"r-c"\`). Without this, the agent cycles infinitely between adjacent nodes.
* **Parent Pointer Map:** Maps each child node to its predecessor to reconstruct the optimal trajectory backwards once the goal is hit.

### 4. Complexity & Memory Bottleneck
* **Branching Factor ($b$):** Maximum outgoing edges from a cell (up to 4 in a grid: Up, Down, Left, Right).
* **Depth ($d$):** Steps required to reach goal.
* **Nodes Generated:** $1 + b + b^2 + b^3 + ... + b^d = O(b^d)$.
* **Memory Reality Check:** Because BFS stores *all* frontier nodes at depth $d$, memory exhaustion ($O(b^d)$ space) almost always occurs before CPU timeout on deep graphs.`,
      algorithm: [
        "Step 1: Validate Start and Goal coordinates. Initialize empty FIFO Queue and Visited Set.",
        "Step 2: Enqueue Start node with empty parent path: Queue.push({coord: Start, path: [Start]}). Mark Start in Visited Set.",
        "Step 3: While Queue is not empty:",
        "        a. Dequeue current node: Current = Queue.pop().",
        "        b. Goal Test: If Current == Goal, terminate search and return Current.path.",
        "        c. For each Direction in [(-1,0), (1,0), (0,-1), (0,1)] (Up, Down, Left, Right):",
        "           i. Neighbor = (Current.r + dr, Current.c + dc).",
        "           ii. If Neighbor is within Grid boundaries AND Neighbor is NOT a Wall AND Neighbor not in Visited Set:",
        "               - Add Neighbor to Visited Set.",
        "               - Queue.push({coord: Neighbor, path: [...Current.path, Neighbor]}).",
        "Step 4: If Queue becomes empty and Goal was never dequeued, return 'No Valid Path Found'."
      ],
      complexity: {
        time: "O(V + E) for graphs; O(R × C) for grid mazes with R rows and C columns.",
        space: "O(b^d) high memory footprint to retain frontier layers in FIFO queue."
      }
    },
    code: {
      python: `from collections import deque

def bfs_shortest_path(grid, start, goal):
    rows, cols = len(grid), len(grid[0])
    # FIFO Queue stores: (row, col, path_list)
    queue = deque([(start[0], start[1], [start])])
    visited = {start}

    directions = [(-1, 0), (1, 0), (0, -1), (0, 1)] # Up, Down, Left, Right

    while queue:
        r, c, path = queue.popleft()

        # Goal Condition
        if (r, c) == goal:
            return path

        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            # Validity Check: Bounds, Wall Obstacle (1), Visited
            if 0 <= nr < rows and 0 <= nc < cols:
                if grid[nr][nc] == 0 and (nr, nc) not in visited:
                    visited.add((nr, nc))
                    queue.append((nr, nc, path + [(nr, nc)]))

    return None # Path blocked

# 0 = Free cell, 1 = Wall
maze = [
    [0, 0, 1, 0],
    [1, 0, 1, 0],
    [0, 0, 0, 0],
    [0, 1, 1, 0]
]
path = bfs_shortest_path(maze, (0, 0), (3, 3))
print("Optimal BFS Path Found:", path)`,
      java: `import java.util.*;

public class BFSShortestPathLab {
    static int[][] DIRS = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};

    public static List<int[]> solveMaze(int[][] grid, int[] start, int[] goal) {
        int R = grid.length, C = grid[0].length;
        Queue<List<int[]>> queue = new LinkedList<>();
        boolean[][] visited = new boolean[R][C];

        List<int[]> initialPath = new ArrayList<>();
        initialPath.add(start);
        queue.offer(initialPath);
        visited[start[0]][start[1]] = true;

        while (!queue.isEmpty()) {
            List<int[]> path = queue.poll();
            int[] curr = path.get(path.size() - 1);

            if (curr[0] == goal[0] && curr[1] == goal[1]) {
                return path; // Shortest path guaranteed
            }

            for (int[] d : DIRS) {
                int nr = curr[0] + d[0], nc = curr[1] + d[1];
                if (nr >= 0 && nr < R && nc >= 0 && nc < C && grid[nr][nc] == 0 && !visited[nr][nc]) {
                    visited[nr][nc] = true;
                    List<int[]> newPath = new ArrayList<>(path);
                    newPath.add(new int[]{nr, nc});
                    queue.offer(newPath);
                }
            }
        }
        return null; // Path blocked
    }
}`
    },
    resources: [
      { title: "Abdul Bari: Breadth First Search Algorithm", url: "https://www.youtube.com/watch?v=pcKY4hjDrxk" },
      { title: "MIT 6.006: Breadth-First Search & Shortest Paths", url: "https://ocw.mit.edu/" }
    ],
    quiz: [
      {
        question: "Why does BFS guarantee finding the optimal shortest path in an unweighted grid?",
        options: [
          "Because it evaluates edge weights using a heuristic function.",
          "Because it expands nodes in strict non-decreasing order of depth.",
          "Because it uses depth-first backtracking.",
          "Because it reverses the goal and start pointers."
        ],
        correctIndex: 1,
        explanation: "By exploring level-by-level, BFS touches every node at distance d before inspecting any node at distance d+1, ensuring the first goal encounter is minimal."
      },
      {
        question: "What is the primary operational bottleneck of Breadth-First Search compared to Depth-First Search?",
        options: [
          "Inability to work with undirected edges",
          "Excessive space (memory) complexity O(b^d)",
          "Sub-optimal path selection",
          "Higher risk of recursion stack overflow"
        ],
        correctIndex: 1,
        explanation: "BFS must retain the entire frontier level in memory, requiring O(b^d) space which quickly exhausts RAM."
      },
      {
        question: "Which data structure is required to maintain the frontier in standard BFS?",
        options: ["Priority Min-Heap", "FIFO (First-In, First-Out) Queue", "LIFO Call Stack", "Red-Black Tree"],
        correctIndex: 1,
        explanation: "A FIFO Queue ensures that the oldest discovered nodes (shallowest level) are dequeued and expanded first."
      },
      {
        question: "If a tree has branching factor b = 3 and goal depth d = 4, approximately how many nodes are explored at level 4 in worst case?",
        options: ["12", "64", "81", "256"],
        correctIndex: 2,
        explanation: "Nodes at depth d = b^d. For b = 3 and d = 4: 3^4 = 81 nodes."
      },
      {
        question: "What happens if you remove the 'Visited' hash set from a BFS graph implementation?",
        options: [
          "The algorithm runs twice as fast.",
          "It gets trapped in infinite cyclic loops between connected nodes.",
          "It automatically switches to Dijkstra's algorithm.",
          "The space complexity drops to O(1)."
        ],
        correctIndex: 1,
        explanation: "Without cycle detection via a visited set, bidirectional edges cause infinite oscillation between parent and child nodes."
      }
    ]
  },
  {
    title: "A* Search Algorithm for 8-Puzzle Problem",
    slug: "a-star-8-puzzle",
    category: "Informed Search / Heuristics",
    difficulty: "Hard",
    visualizationType: "eight-puzzle",
    manual: {
      aim: "To formulate, implement, and analyze the Informed A* Search Algorithm to solve the sliding 8-Puzzle problem, evaluating heuristic dominance between Manhattan Distance and Misplaced Tiles under SPPU 2024 Pattern.",
      objectives: [
        "Formulate heuristic evaluation function f(n) = g(n) + h(n).",
        "Prove Heuristic Admissibility condition: h(n) <= h*(n) where h* is the true minimum remaining cost.",
        "Demonstrate Heuristic Dominance: Prove why Manhattan Distance expands fewer nodes than Misplaced Tiles.",
        "Implement parity checking via inversion count to detect mathematically unsolvable starting configurations."
      ],
      theory: `### 1. Intuition: Why Uninformed Search Fails
If you attempt to solve an 8-puzzle with BFS or DFS, the state space explodes rapidly ($9! / 2 = 181,440$ reachable states). BFS expands nodes blindly in all directions. **A* Search introduces 'intelligence'** by directing the search towards the goal using an educated guess called a **Heuristic ($h(n)$)**.

### 2. The Total Evaluation Function
$$f(n) = g(n) + h(n)$$
* **$g(n)$ [Past Cost]:** Exact number of steps/moves taken from initial board to current state.
* **$h(n)$ [Future Estimate]:** Estimated cost from current board to the goal.
* **$f(n)$ [Total Score]:** Estimated total solution cost passing through node $n$. The Priority Queue always expands the state with the lowest $f(n)$.

### 3. Admissibility & Dominance
* **Admissibility:** A heuristic is admissible if it *never overestimates* the true cost to reach the goal ($h(n) \le h^*(n)$). This guarantees that A* finds the mathematically optimal solution.
* **Heuristic 1: Misplaced Tiles ($h_1$):** Number of tiles not in their goal position. Admissible because each misplaced tile must move at least once.
* **Heuristic 2: Manhattan Distance ($h_2$):** Sum of absolute horizontal and vertical distances of tiles from their target slots:
  $$h_2 = \sum_{i=1}^8 (|r_i - r_{\\text{goal}}| + |c_i - c_{\\text{goal}}|)$$
* **Dominance Theorem:** Since $h_2(n) \ge h_1(n)$ for all states $n$, Manhattan Distance dominates Misplaced Tiles. It provides a tighter lower bound, pruning exponentially more redundant search trees.

### 4. Mathematical Solvability (Inversion Parity)
An 8-puzzle state is solvable if and only if its **inversion count** is even. An inversion occurs when a tile with a higher number precedes a tile with a lower number in linear array order (ignoring the blank tile). If inversions are odd, no sequence of moves can ever reach $[1,2,3,4,5,6,7,8,0]$.`,
      algorithm: [
        "Step 1: Check solvability: Count inversions in Initial State. If odd, abort (Unsolvable configuration).",
        "Step 2: Initialize OPEN list as a Priority Min-Heap ordered by f(n) = g(n) + h(n).",
        "Step 3: Initialize CLOSED set as a Hash Set to track explored board signatures.",
        "Step 4: Push Start State into OPEN with g = 0 and h = Manhattan(Start).",
        "Step 5: While OPEN is not empty:",
        "        a. Pop node Current with lowest f(n).",
        "        b. If Current == Goal, reconstruct path from parent pointers and return SUCCESS.",
        "        c. Add Current.signature to CLOSED set.",
        "        d. Find blank (0) coordinate (r, c) and generate legal moves: Up, Down, Left, Right.",
        "        e. For each neighbor board generated:",
        "           i. If neighbor in CLOSED, discard.",
        "           ii. Compute tentative_g = Current.g + 1.",
        "           iii. If neighbor not in OPEN or tentative_g < existing g in OPEN, push to OPEN with f = tentative_g + Manhattan(neighbor).",
        "Step 6: Return Failure if OPEN is exhausted without reaching Goal."
      ],
      complexity: {
        time: "O(b^d) where effective branching factor is reduced from ~3 to ~1.4 with Manhattan Distance.",
        space: "O(b^d) to preserve open frontier and closed explored sets in memory."
      }
    },
    code: {
      python: `import heapq

GOAL = (1, 2, 3, 4, 5, 6, 7, 8, 0)
GOAL_POS = {val: (idx // 3, idx % 3) for idx, val in enumerate(GOAL)}

def manhattan(state):
    dist = 0
    for idx, val in enumerate(state):
        if val != 0:
            cr, cc = idx // 3, idx % 3
            gr, gc = GOAL_POS[val]
            dist += abs(cr - gr) + abs(cc - gc)
    return dist

def get_neighbors(state):
    neighbors = []
    idx = state.index(0)
    r, c = idx // 3, idx % 3
    for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
        nr, nc = r + dr, c + dc
        if 0 <= nr < 3 and 0 <= nc < 3:
            n_idx = nr * 3 + nc
            board = list(state)
            board[idx], board[n_idx] = board[n_idx], board[idx]
            neighbors.append(tuple(board))
    return neighbors

def solve_a_star(start):
    # Priority Queue tuple: (f_score, g_cost, state, path)
    pq = [(manhattan(start), 0, start, [])]
    visited = set()

    while pq:
        f, g, curr, path = heapq.heappop(pq)
        if curr == GOAL:
            return path + [curr]

        if curr in visited:
            continue
        visited.add(curr)

        for nxt in get_neighbors(curr):
            if nxt not in visited:
                heapq.heappush(pq, (g + 1 + manhattan(nxt), g + 1, nxt, path + [curr]))
    return None`,
      java: `import java.util.*;

public class EightPuzzleAStarLab {
    static final int[] GOAL = {1, 2, 3, 4, 5, 6, 7, 8, 0};

    static class Node implements Comparable<Node> {
        int[] board;
        int g, h;
        Node parent;

        Node(int[] b, int g, Node p) {
            this.board = b.clone();
            this.g = g;
            this.h = calcManhattan(this.board);
            this.parent = p;
        }

        int f() { return g + h; }
        public int compareTo(Node o) { return Integer.compare(this.f(), o.f()); }
    }

    static int calcManhattan(int[] b) {
        int dist = 0;
        for (int i = 0; i < 9; i++) {
            if (b[i] != 0) {
                int target = b[i] - 1;
                dist += Math.abs(i / 3 - target / 3) + Math.abs(i % 3 - target % 3);
            }
        }
        return dist;
    }
}`
    },
    resources: [
      { title: "Stanford CS221: A* Search and Heuristic Admissibility", url: "https://stanford.edu/~cpiech/cs221/" },
      { title: "UC Berkeley CS188: Informed Search Strategies", url: "https://inst.eecs.berkeley.edu/~cs188/" }
    ],
    quiz: [
      {
        question: "What does it mean for a heuristic h(n) to be 'admissible'?",
        options: [
          "It never underestimates the cost to reach the goal.",
          "It never overestimates the actual minimum cost to reach the goal.",
          "It calculates the exact Euclidean distance with zero error.",
          "It requires O(1) memory space."
        ],
        correctIndex: 1,
        explanation: "Admissibility requires h(n) <= h*(n). It ensures that A* never overlooks an optimal path by mistakenly inflating its cost."
      },
      {
        question: "Why does the Manhattan Distance heuristic dominate the Misplaced Tiles heuristic in 8-puzzle?",
        options: [
          "Because Manhattan distance is easier to compute in Java.",
          "Because for every board state n, h_manhattan(n) >= h_misplaced(n), producing tighter bounds.",
          "Because Misplaced Tiles is an inadmissible heuristic.",
          "Because Manhattan distance ignores the blank tile."
        ],
        correctIndex: 1,
        explanation: "A heuristic h2 dominates h1 if h2(n) >= h1(n) for all nodes and both are admissible. Manhattan distance expands fewer nodes."
      },
      {
        question: "If an 8-puzzle board configuration has an ODD number of inversions, what does it signify?",
        options: [
          "The puzzle can be solved in fewer than 10 moves.",
          "The puzzle is mathematically unsolvable to reach [1,2,3,4,5,6,7,8,0].",
          "The heuristic evaluation will return negative infinity.",
          "It requires Depth-First Search instead of A*."
        ],
        correctIndex: 1,
        explanation: "Sliding tiles preserves inversion parity. The goal state [1..8, 0] has 0 (even) inversions. An odd inversion state can never reach it."
      },
      {
        question: "In the evaluation function f(n) = g(n) + h(n), what does g(n) represent?",
        options: [
          "The estimated remaining distance to the goal.",
          "The exact actual cost incurred from start node to current node n.",
          "The total number of open nodes in the Priority Queue.",
          "The maximum tree depth limit."
        ],
        correctIndex: 1,
        explanation: "g(n) is the exact path cost already paid to traverse from the root to node n."
      },
      {
        question: "If the heuristic function h(n) is set to 0 for all nodes, what standard algorithm does A* become?",
        options: ["Depth-First Search", "Uniform Cost Search (Dijkstra's Algorithm)", "Greedy Best-First Search", "Iterative Deepening Search"],
        correctIndex: 1,
        explanation: "When h(n) = 0, f(n) = g(n) + 0 = g(n). A* expands strictly on accumulated path cost, identical to Uniform Cost Search."
      }
    ]
  },
  {
    title: "Part C Mini-Project: Rule-Based Medical Diagnosis Expert System",
    slug: "medical-expert-system",
    category: "Knowledge Representation & Expert Systems",
    difficulty: "Hard",
    visualizationType: "expert-system",
    manual: {
      aim: "To design, simulate, and demonstrate a clinical Decision Support Expert System employing Forward Chaining (Data-Driven) and Backward Chaining (Hypothesis-Driven) inference engines under SPPU 2024 Pattern.",
      objectives: [
        "Design production rules Knowledge Base (KB) using IF-THEN clinical assertions.",
        "Implement Working Memory and Conflict Resolution strategy for multi-rule firing.",
        "Demonstrate Forward Chaining: Deduce illness from patient-reported symptoms.",
        "Demonstrate Backward Chaining: Validate a clinical hypothesis by goal-directed backward tracing."
      ],
      theory: `### 1. Architecture of an AI Expert System
An Expert System emulates human domain specialists. It consists of:
1. **Knowledge Base (KB):** Permanent repository of domain facts and production rules.
2. **Working Memory (WM):** Dynamic cache holding current patient observations.
3. **Inference Engine:** The reasoning core that executes Forward or Backward Chaining.

### 2. Forward vs Backward Chaining (Core Viva Concept)
* **Forward Chaining (Data-Driven):** Starts with known facts in Working Memory. The engine matches facts against rule premises (IF clauses) and fires satisfied rules, adding conclusions to Working Memory until a terminal disease is proven.
* **Backward Chaining (Goal-Driven):** Starts with a suspected diagnosis hypothesis (e.g., *"Does patient have Malaria?"*). The engine works backward to discover which clinical symptoms must hold true to prove it.`,
      algorithm: [
        "Forward Chaining Algorithm:",
        "1. Load selected symptoms into Working Memory.",
        "2. Iterate over Knowledge Base rules.",
        "3. If all premises of a rule are in Working Memory and conclusion is absent, fire the rule and add conclusion to Working Memory.",
        "4. Repeat until no more rules can fire.",
        "Backward Chaining Algorithm:",
        "1. Push Goal Disease to Hypothesis Stack.",
        "2. Locate matching rules in Knowledge Base.",
        "3. Recursively check if rule premises are satisfied in Working Memory."
      ],
      complexity: {
        time: "O(R × P) where R is rules count and P is average premises per rule.",
        space: "O(F) to maintain working memory facts."
      }
    },
    code: {
      python: `# Python Implementation of Clinical Inference Engine
RULES = [
    {"if": {"fever", "chills", "sweating"}, "then": "Malaria"},
    {"if": {"fever", "headache", "rash", "joint_pain"}, "then": "Dengue"},
    {"if": {"fever", "cough", "fatigue", "loss_of_smell"}, "then": "COVID-19"},
    {"if": {"fever", "abdominal_pain", "weakness"}, "then": "Typhoid"},
    {"if": {"sneezing", "runny_nose"}, "then": "Common Cold"}
]

def forward_infer(symptoms):
    memory = set(symptoms)
    diagnoses = []
    for r in RULES:
        if r["if"].issubset(memory):
            diagnoses.append(r["then"])
            memory.add(r["then"])
    return diagnoses

print(forward_infer(["fever", "chills", "sweating"]))`,
      java: `import java.util.*;

public class MedicalInferenceLab {
    public static void main(String[] args) {
        Set<String> patientSymptoms = new HashSet<>(Arrays.asList("fever", "chills", "sweating"));
        Set<String> malariaCriteria = new HashSet<>(Arrays.asList("fever", "chills", "sweating"));

        if (patientSymptoms.containsAll(malariaCriteria)) {
            System.out.println("Forward Chaining Inference: Diagnosed Malaria [Confidence: 95%]");
        }
    }
}`
    },
    resources: [
      { title: "Stanford CS221: Expert Systems & Production Rules", url: "https://stanford.edu/~cpiech/cs221/" }
    ],
    quiz: [
      {
        question: "Which component of an expert system holds the current transient case facts?",
        options: ["Knowledge Base", "Working Memory", "Inference Engine", "Explanation Facility"],
        correctIndex: 1,
        explanation: "Working Memory contains the dynamic, case-specific facts entered during the session."
      },
      {
        question: "When is Backward Chaining preferred over Forward Chaining?",
        options: [
          "When facts are plentiful and you want to see all possible outcomes.",
          "When you want to verify a specific hypothesis quickly.",
          "When there are zero rules in the knowledge base.",
          "When you want to find the shortest path in a graph."
        ],
        correctIndex: 1,
        explanation: "Backward chaining is goal-driven, making it ideal when a specific hypothesis needs rapid confirmation or refutation."
      },
      {
        question: "What is a major challenge in scaling rule-based expert systems?",
        options: [
          "Rule conflicts and maintenance complexity as rules scale into the thousands.",
          "They cannot use Boolean logic.",
          "They run out of recursion memory instantly.",
          "They only work in Python."
        ],
        correctIndex: 0,
        explanation: "As production rule count grows, conflicts and edge-case exceptions make knowledge base maintenance notoriously difficult."
      },
      {
        question: "Which of the following describes Forward Chaining?",
        options: ["Goal-driven reasoning", "Data-driven reasoning", "Heuristic tree search", "Genetic mutation"],
        correctIndex: 1,
        explanation: "Forward chaining begins with known data/symptoms and moves forward to infer conclusions."
      },
      {
        question: "What was MYCIN?",
        options: [
          "An early 1970s Stanford rule-based expert system for diagnosing blood infections.",
          "The first A* search algorithm implementation.",
          "A vacuum cleaning reflex agent prototype.",
          "A deep neural network for computer vision."
        ],
        correctIndex: 0,
        explanation: "MYCIN was Stanford's historic rule-based expert system designed to diagnose infectious bacterial blood diseases."
      }
    ]
  },

  // ─────────────────────────────────────────────────────────
  // EXPERIMENT 3: Alpha-Beta Pruning
  // ─────────────────────────────────────────────────────────
  {
    title: "Adversarial Search with Alpha-Beta Pruning",
    slug: "alpha-beta-pruning",
    category: "Adversarial Search",
    difficulty: "Hard",
    visualizationType: "alpha-beta",
    manual: {
      aim: "To implement Adversarial Search using the Minimax algorithm with Alpha-Beta pruning and determine the optimal move for a player in a two-player zero-sum game.",
      objectives: [
        "Understand adversarial search and game trees in Artificial Intelligence.",
        "Implement the Minimax algorithm for two-player zero-sum games.",
        "Apply Alpha-Beta pruning to eliminate redundant branches in the game tree.",
        "Reduce the number of nodes evaluated while still finding the optimal move.",
        "Determine the optimal move for the maximizing player."
      ],
      theory: `## Adversarial Search

Adversarial search is used in Artificial Intelligence when two or more agents **compete** against each other with opposing objectives. In such environments, each player tries to maximize their own advantage while minimizing the opponent's.

**Classic examples:** Chess, Tic-Tac-Toe, Checkers, Connect Four, Go.

Unlike ordinary search problems where we only consider a single agent trying to reach a goal, adversarial search involves **two alternating players**:
- **MAX player** — tries to maximize the score (e.g., you)
- **MIN player** — tries to minimize the score (e.g., the opponent)

---

## Minimax Algorithm

The **Minimax algorithm** is the backbone of adversarial game search. It performs a depth-first search through the entire game tree:

- At **MAX nodes**: choose the child with the **maximum** utility value
- At **MIN nodes**: choose the child with the **minimum** utility value
- At **leaf nodes** (terminal states): return the heuristic or actual utility value

### Minimax Formula:
\`\`\`
minimax(node, depth, isMaximizing):
  if depth == 0 or terminal(node):
      return evaluate(node)
  
  if isMaximizing:
      bestVal = -∞
      for each child of node:
          val = minimax(child, depth-1, False)
          bestVal = max(bestVal, val)
      return bestVal
  else:
      bestVal = +∞
      for each child of node:
          val = minimax(child, depth-1, True)
          bestVal = min(bestVal, val)
      return bestVal
\`\`\`

### Complexity Without Pruning:
- **Time:** O(b^d) where b = branching factor, d = depth
- **Space:** O(b × d)

---

## Alpha-Beta Pruning

**Alpha-Beta pruning** is an optimization of Minimax that **skips branches** that cannot possibly affect the final decision. It maintains two values:

| Variable | Meaning |
|----------|---------|
| **α (Alpha)** | Best value MAX player can guarantee so far (initialized to -∞) |
| **β (Beta)** | Best value MIN player can guarantee so far (initialized to +∞) |

### Pruning Rule:
> **If α ≥ β at any node, stop exploring further children of that node (prune!).**

- At a **MAX node**: update α = max(α, current_value). If α ≥ β → prune remaining children (**beta-cut**)
- At a **MIN node**: update β = min(β, current_value). If β ≤ α → prune remaining children (**alpha-cut**)

### Alpha-Beta Pseudocode:
\`\`\`
alphabeta(node, depth, α, β, isMaximizing):
  if depth == 0 or terminal(node):
      return evaluate(node)
  
  if isMaximizing:
      for each child of node:
          val = alphabeta(child, depth-1, α, β, False)
          α = max(α, val)
          if α >= β:
              break  # ← Beta cut-off (prune!)
      return α
  else:
      for each child of node:
          val = alphabeta(child, depth-1, α, β, True)
          β = min(β, val)
          if β <= α:
              break  # ← Alpha cut-off (prune!)
      return β
\`\`\`

### Complexity With Pruning:
- **Best case (perfect ordering):** O(b^(d/2)) — effectively doubles the searchable depth
- **Worst case (bad ordering):** O(b^d) — no improvement
- **Average case:** O(b^(3d/4))

> **Key Insight:** With optimal move ordering, Alpha-Beta pruning can search **twice as deep** as plain Minimax in the same time! This is why chess engines use it.

---

## Why Alpha-Beta is Better

| Aspect | Minimax | Alpha-Beta |
|--------|---------|-----------|
| Nodes evaluated | All b^d nodes | ~b^(d/2) with good ordering |
| Optimal result | Yes | Yes (same answer!) |
| Memory | O(b × d) | O(b × d) |
| Real-world use | Rarely used alone | Standard in all game AI |

Alpha-Beta pruning **always returns the same result** as Minimax — it just skips branches that provably won't affect the outcome.`,
      algorithm: [
        "Step 1: Initialize the game tree with root node. Set α = -∞, β = +∞.",
        "Step 2: At MAX node — iterate over all children. For each child: call alphabeta(child, depth-1, α, β, MIN).",
        "Step 3: Update α = max(α, returned_value). If α ≥ β → PRUNE (beta cut-off). Stop iterating.",
        "Step 4: At MIN node — iterate over all children. For each child: call alphabeta(child, depth-1, α, β, MAX).",
        "Step 5: Update β = min(β, returned_value). If β ≤ α → PRUNE (alpha cut-off). Stop iterating.",
        "Step 6: At leaf/terminal node — return static evaluation value (heuristic score).",
        "Step 7: Backpropagate values up the tree. Root MAX node returns optimal move with highest α value.",
        "Step 8: Report pruned nodes count vs total nodes — shows efficiency gain."
      ],
      complexity: {
        time: "Best case O(b^(d/2)) with perfect move ordering; Worst case O(b^d) same as plain Minimax; Average O(b^(3d/4)). For chess: b≈35, d≈10 → savings are enormous.",
        space: "O(b × d) — linear in depth since DFS is used. Stack stores one path from root to current node at a time."
      }
    },
    code: {
      python: `import math

def minimax_alpha_beta(node, depth, alpha, beta, is_maximizing, tree, path=[]):
    """
    Alpha-Beta Pruning on Minimax.
    node     : current tree node index
    depth    : remaining depth to search
    alpha    : best value MAX can guarantee (-inf initially)
    beta     : best value MIN can guarantee (+inf initially)
    is_maximizing : True if current player is MAX
    """
    children = tree.get(node, [])
    
    # Terminal node (leaf) — return its value
    if not children or depth == 0:
        return tree[node]
    
    if is_maximizing:
        best = -math.inf
        for child in children:
            val = minimax_alpha_beta(child, depth - 1, alpha, beta, False, tree)
            best = max(best, val)
            alpha = max(alpha, best)
            if beta <= alpha:
                print(f"  [PRUNE] β={beta} ≤ α={alpha} at node {child} → Beta Cut-off!")
                break  # Beta cut-off
        return best
    else:
        best = math.inf
        for child in children:
            val = minimax_alpha_beta(child, depth - 1, alpha, beta, True, tree)
            best = min(best, val)
            beta = min(beta, best)
            if beta <= alpha:
                print(f"  [PRUNE] β={beta} ≤ α={alpha} at node {child} → Alpha Cut-off!")
                break  # Alpha cut-off
        return best


# Example game tree (SPPU standard example)
# Leaf values: 3, 5, 2, 9, 0, 7, 4, 6
tree = {
    'A': ['B', 'C'],
    'B': ['D', 'E'],
    'C': ['F', 'G'],
    'D': [3, 5],
    'E': [2, 9],
    'F': [0, 7],
    'G': [4, 6]
}

# Flatten tree to use integer indices
flat_tree = {
    0: [1, 2],   # Root (MAX)
    1: [3, 4],   # MIN
    2: [5, 6],   # MIN
    3: 3, 4: 5, 5: 2, 6: 9,   # Leaves under node 1 & 2
}

# Alternate example with numeric keys
game_tree = {
    0: [1, 2],
    1: [3, 4],
    2: [5, 6],
    3: 3,
    4: 5,
    5: 2,
    6: 9
}

print("=" * 50)
print("  Alpha-Beta Pruning — SPPU 2024 Pattern")
print("=" * 50)
result = minimax_alpha_beta(0, 3, -math.inf, math.inf, True, game_tree)
print(f"\\n✅ Optimal value for MAX player: {result}")`,
      java: `import java.util.*;

public class AlphaBetaPruning {

    static Map<Integer, int[]> children = new HashMap<>();
    static Map<Integer, Integer> leafValues = new HashMap<>();
    static int pruneCount = 0;

    public static int alphaBeta(int node, int depth, int alpha, int beta, boolean isMaximizing) {
        // Leaf node — return static value
        if (leafValues.containsKey(node)) {
            return leafValues.get(node);
        }

        int[] kids = children.get(node);
        if (kids == null || depth == 0) {
            return leafValues.getOrDefault(node, 0);
        }

        if (isMaximizing) {
            int best = Integer.MIN_VALUE;
            for (int child : kids) {
                int val = alphaBeta(child, depth - 1, alpha, beta, false);
                best = Math.max(best, val);
                alpha = Math.max(alpha, best);
                if (beta <= alpha) {
                    pruneCount++;
                    System.out.println("  [BETA CUT] β=" + beta + " ≤ α=" + alpha + " → Pruned!");
                    break;  // Beta cut-off
                }
            }
            return best;
        } else {
            int best = Integer.MAX_VALUE;
            for (int child : kids) {
                int val = alphaBeta(child, depth - 1, alpha, beta, true);
                best = Math.min(best, val);
                beta = Math.min(beta, best);
                if (beta <= alpha) {
                    pruneCount++;
                    System.out.println("  [ALPHA CUT] β=" + beta + " ≤ α=" + alpha + " → Pruned!");
                    break;  // Alpha cut-off
                }
            }
            return best;
        }
    }

    public static void main(String[] args) {
        // Build game tree: root=0, children[0]={1,2}, children[1]={3,4}, etc.
        children.put(0, new int[]{1, 2});
        children.put(1, new int[]{3, 4});
        children.put(2, new int[]{5, 6});

        // Leaf values
        leafValues.put(3, 3);
        leafValues.put(4, 5);
        leafValues.put(5, 2);
        leafValues.put(6, 9);

        System.out.println("====================================");
        System.out.println("  Alpha-Beta Pruning — SPPU 2024");
        System.out.println("====================================");

        int result = alphaBeta(0, 3, Integer.MIN_VALUE, Integer.MAX_VALUE, true);

        System.out.println("\\n✅ Optimal value for MAX player: " + result);
        System.out.println("✂️  Total branches pruned: " + pruneCount);
    }
}`
    },
    quiz: [
      {
        question: "In Alpha-Beta pruning, what is the initial value of α (alpha)?",
        options: ["+∞ (positive infinity)", "-∞ (negative infinity)", "0", "1"],
        correctIndex: 1,
        explanation: "α starts at -∞ because it represents the best value MAX player can guarantee — initially the worst possible (nothing guaranteed yet). It only increases as MAX finds better moves."
      },
      {
        question: "Alpha-Beta pruning returns the same result as Minimax. This statement is:",
        options: ["False — it returns a different, approximate result.", "True — it always returns the exact same optimal value.", "True — only when the tree is perfectly balanced.", "False — it returns a better result by skipping nodes."],
        correctIndex: 1,
        explanation: "Alpha-Beta pruning is a pure optimization of Minimax. It skips branches that CANNOT change the final decision, so the result is provably identical to running full Minimax."
      },
      {
        question: "A beta cut-off (pruning) occurs when:",
        options: ["α > β at a MIN node", "α ≥ β at a MAX node", "β ≤ α at a MIN node", "The tree reaches maximum depth"],
        correctIndex: 2,
        explanation: "Beta cut-off happens at MIN nodes when β ≤ α. This means the MIN player has found a move that is at most β, but MAX already has a guaranteed score of α which is better — so MIN will never choose this subtree."
      },
      {
        question: "With perfect move ordering, Alpha-Beta pruning's time complexity is:",
        options: ["O(b^d)", "O(b^(d/2))", "O(b × d)", "O(d²)"],
        correctIndex: 1,
        explanation: "With optimal ordering (best moves explored first), Alpha-Beta reduces time complexity from O(b^d) to O(b^(d/2)) — effectively doubling the searchable depth for the same computation budget."
      },
      {
        question: "Which real-world game AI heavily relies on Alpha-Beta pruning?",
        options: ["Chess engines like Stockfish", "Random number generators", "Recommendation systems", "Image classifiers"],
        correctIndex: 0,
        explanation: "All serious chess engines (Stockfish, Deep Blue, etc.) use Alpha-Beta pruning as their core search strategy. It allows them to search 10-20 moves deep in competitive game play."
      }
    ]
  },

  // ─────────────────────────────────────────────────────────
  // EXPERIMENT 5: BFS Robot Path Planning
  // ─────────────────────────────────────────────────────────
  {
    title: "BFS Robot Path Planning on Grid",
    slug: "bfs-robot-path",
    category: "Uninformed Search",
    difficulty: "Medium",
    visualizationType: "bfs-robot",
    manual: {
      aim: "To implement Breadth-First Search (BFS) for robot path planning on a 5×5 grid with obstacles, finding the shortest path from start (0,0) to goal (4,4).",
      objectives: [
        "Understand Breadth-First Search as an uninformed graph traversal algorithm.",
        "Model a 2D grid world as a state space with obstacle constraints.",
        "Implement BFS using a FIFO queue to guarantee shortest path discovery.",
        "Trace the BFS frontier expansion and reconstruct the optimal path.",
        "Analyze BFS completeness and optimality properties."
      ],
      theory: `## Breadth-First Search (BFS)

**BFS** is a systematic graph/tree traversal algorithm that explores all nodes at the **current depth level** before moving to the next. It uses a **FIFO (First-In, First-Out) queue** as its core data structure.

### Key Properties of BFS:
| Property | BFS |
|----------|-----|
| **Complete?** | Yes (finds solution if one exists) |
| **Optimal?** | Yes (for uniform-cost edges — finds shortest path) |
| **Time Complexity** | O(b^d) where b = branching factor, d = depth |
| **Space Complexity** | O(b^d) — stores entire frontier |

---

## Grid World Formulation

The robot navigates a **5×5 grid** where:
- \`0\` = Free cell (traversable)
- \`1\` = Obstacle (blocked)
- **Start state:** (row=0, col=0) — top-left corner
- **Goal state:** (row=4, col=4) — bottom-right corner

### Actions (4 directions):
\`\`\`
UP    → (row-1, col)
DOWN  → (row+1, col)
LEFT  → (row, col-1)
RIGHT → (row, col+1)
\`\`\`

### State Space:
- **State:** (row, col) position tuple
- **Initial state:** (0, 0)
- **Goal test:** state == (4, 4)
- **Path cost:** Each step costs 1 (uniform)

---

## BFS Algorithm for Grid Navigation

\`\`\`
BFS(grid, start, goal):
  queue = FIFO_Queue()
  queue.enqueue(start)
  visited = {start}
  parent = {start: None}
  
  while queue is not empty:
      current = queue.dequeue()
      
      if current == goal:
          return reconstruct_path(parent, goal)
      
      for each neighbor in get_neighbors(current, grid):
          if neighbor not in visited:
              visited.add(neighbor)
              parent[neighbor] = current
              queue.enqueue(neighbor)
  
  return None  # No path found
\`\`\`

### Path Reconstruction:
After BFS finds the goal, we **backtrack** using the \`parent\` dictionary from goal → start to reconstruct the shortest path.

---

## Why BFS Guarantees Shortest Path

BFS expands nodes **level by level**. The first time it reaches the goal node, it has taken the minimum number of steps — because all shorter paths were explored first (FIFO ordering guarantees this).

> **BFS is like a wave expanding outward.** All cells reachable in 1 step are visited before cells reachable in 2 steps, and so on.

---

## Comparison: BFS vs DFS for Path Planning

| Criterion | BFS | DFS |
|-----------|-----|-----|
| Shortest path? | ✅ Yes | ❌ No |
| Memory usage | High (stores whole frontier) | Low (single path) |
| Complete? | ✅ Yes | ✅ Yes (finite graphs) |
| Use case | Shortest path, maps | Maze solving, puzzles |`,
      algorithm: [
        "Step 1: Represent the 5×5 grid as a 2D array. Mark 0=free, 1=obstacle.",
        "Step 2: Initialize FIFO queue with start=(0,0). Create visited set = {(0,0)}. Create parent dict = {(0,0): None}.",
        "Step 3: DEQUEUE front element (current_row, current_col) from queue.",
        "Step 4: If (current_row, current_col) == (4,4) → goal found! Go to Step 7.",
        "Step 5: Expand neighbors: try UP=(row-1,col), DOWN=(row+1,col), LEFT=(row,col-1), RIGHT=(row,col+1).",
        "Step 6: For each valid neighbor (in bounds, not obstacle, not visited): add to visited, set parent[neighbor]=current, ENQUEUE neighbor. Go to Step 3.",
        "Step 7: Path reconstruction — backtrack using parent dict from (4,4) → (0,0). Reverse path.",
        "Step 8: Report shortest path length and list of grid coordinates in order."
      ],
      complexity: {
        time: "O(V + E) where V = grid cells (25 for 5×5), E = edges between adjacent cells. Effectively O(rows × cols) for grid worlds.",
        space: "O(V) = O(rows × cols) for the queue and visited set. In worst case, entire grid is in the queue simultaneously."
      }
    },
    code: {
      python: `from collections import deque

def bfs_robot_path(grid, start, goal):
    """
    BFS for shortest path planning on a 2D grid.
    grid  : 2D list (0=free, 1=obstacle)
    start : (row, col) tuple
    goal  : (row, col) tuple
    Returns: shortest path as list of (row,col) tuples, or None
    """
    rows, cols = len(grid), len(grid[0])
    queue = deque([start])
    visited = {start}
    parent = {start: None}
    
    # 4-directional movement
    directions = [(-1, 0, 'UP'), (1, 0, 'DOWN'), (0, -1, 'LEFT'), (0, 1, 'RIGHT')]
    
    while queue:
        current = queue.popleft()
        r, c = current
        
        print(f"  Exploring: ({r},{c})")
        
        # Goal check
        if current == goal:
            # Reconstruct path
            path = []
            node = goal
            while node is not None:
                path.append(node)
                node = parent[node]
            path.reverse()
            return path
        
        # Expand neighbors
        for dr, dc, direction in directions:
            nr, nc = r + dr, c + dc
            neighbor = (nr, nc)
            
            if (0 <= nr < rows and 0 <= nc < cols and
                    grid[nr][nc] == 0 and neighbor not in visited):
                visited.add(neighbor)
                parent[neighbor] = current
                queue.append(neighbor)
    
    return None  # No path exists


# SPPU Standard: 5x5 grid
grid = [
    [0, 0, 1, 0, 0],
    [0, 0, 0, 0, 1],
    [1, 0, 1, 0, 0],
    [0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0]
]

start = (0, 0)
goal = (4, 4)

print("=" * 45)
print("  BFS Robot Path Planning — SPPU 2024")
print("=" * 45)
print(f"Start: {start}  |  Goal: {goal}")
print("Grid (0=free, 1=obstacle):\\n")
for i, row in enumerate(grid):
    print("  " + " ".join(['S' if (i,j)==start else 'G' if (i,j)==goal else '#' if v==1 else '.' for j,v in enumerate(row)]))

print("\\nBFS Exploration:")
path = bfs_robot_path(grid, start, goal)

if path:
    print(f"\\n✅ Shortest Path Found! Length = {len(path)-1} steps")
    print("Path:", " → ".join(str(p) for p in path))
else:
    print("\\n❌ No path exists between start and goal.")`,
      java: `import java.util.*;

public class BFSRobotPath {
    
    static int[][] DIRS = {{-1,0},{1,0},{0,-1},{0,1}};
    static String[] DIR_NAMES = {"UP","DOWN","LEFT","RIGHT"};
    
    public static List<int[]> bfsPath(int[][] grid, int[] start, int[] goal) {
        int rows = grid.length, cols = grid[0].length;
        Queue<int[]> queue = new LinkedList<>();
        boolean[][] visited = new boolean[rows][cols];
        int[][][] parent = new int[rows][cols][2];
        
        // Initialize parent to -1 (unset)
        for (int[][] row : parent) for (int[] cell : row) Arrays.fill(cell, -1);
        
        queue.add(start);
        visited[start[0]][start[1]] = true;
        
        while (!queue.isEmpty()) {
            int[] curr = queue.poll();
            int r = curr[0], c = curr[1];
            
            System.out.println("  Exploring: (" + r + "," + c + ")");
            
            // Goal check
            if (r == goal[0] && c == goal[1]) {
                return reconstructPath(parent, start, goal);
            }
            
            for (int i = 0; i < 4; i++) {
                int nr = r + DIRS[i][0];
                int nc = c + DIRS[i][1];
                
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols
                        && grid[nr][nc] == 0 && !visited[nr][nc]) {
                    visited[nr][nc] = true;
                    parent[nr][nc][0] = r;
                    parent[nr][nc][1] = c;
                    queue.add(new int[]{nr, nc});
                }
            }
        }
        return null;  // No path
    }
    
    static List<int[]> reconstructPath(int[][][] parent, int[] start, int[] goal) {
        LinkedList<int[]> path = new LinkedList<>();
        int r = goal[0], c = goal[1];
        
        while (!(r == start[0] && c == start[1])) {
            path.addFirst(new int[]{r, c});
            int pr = parent[r][c][0];
            int pc = parent[r][c][1];
            r = pr; c = pc;
        }
        path.addFirst(start);
        return path;
    }
    
    public static void main(String[] args) {
        int[][] grid = {
            {0, 0, 1, 0, 0},
            {0, 0, 0, 0, 1},
            {1, 0, 1, 0, 0},
            {0, 0, 0, 1, 0},
            {0, 1, 0, 0, 0}
        };
        
        System.out.println("==========================================");
        System.out.println("  BFS Robot Path Planning — SPPU 2024");
        System.out.println("==========================================");
        
        List<int[]> path = bfsPath(grid, new int[]{0,0}, new int[]{4,4});
        
        if (path != null) {
            System.out.println("\\n✅ Shortest path length: " + (path.size()-1) + " steps");
            System.out.print("Path: ");
            for (int[] p : path) System.out.print("(" + p[0] + "," + p[1] + ") ");
        } else {
            System.out.println("\\n❌ No path found.");
        }
    }
}`
    },
    quiz: [
      {
        question: "Which data structure does BFS use for its frontier?",
        options: ["Stack (LIFO)", "Priority Queue (min-heap)", "FIFO Queue", "Binary Tree"],
        correctIndex: 2,
        explanation: "BFS uses a FIFO (First-In First-Out) Queue. This ensures nodes are explored in the order they were discovered — level by level — which guarantees the shortest path is found first."
      },
      {
        question: "Is BFS guaranteed to find the shortest path in an unweighted grid?",
        options: ["No, BFS only finds a path, not necessarily the shortest", "Yes, BFS always finds the shortest path in unweighted graphs", "Only if there are no obstacles", "Only if the grid is smaller than 10×10"],
        correctIndex: 1,
        explanation: "BFS explores nodes level by level (by distance from start). The first time it reaches the goal, it has taken the fewest possible steps — this guarantees optimality in uniform-cost (unweighted) graphs."
      },
      {
        question: "What is the time complexity of BFS on a grid of R rows and C columns?",
        options: ["O(R + C)", "O(R × C)", "O((R × C)²)", "O(log(R × C))"],
        correctIndex: 1,
        explanation: "BFS visits each cell at most once. With R×C cells total, the time complexity is O(R × C). Each cell is enqueued and dequeued at most once, and we check at most 4 neighbors per cell."
      },
      {
        question: "In BFS, how is the shortest path reconstructed after the goal is found?",
        options: ["By re-running DFS from goal to start", "By backtracking through a parent/predecessor dictionary from goal to start", "By counting BFS levels", "By storing all paths in memory"],
        correctIndex: 1,
        explanation: "During BFS, each node records its parent (the node it was discovered from). After reaching the goal, we follow parent pointers backward: goal → ... → start. Reversing this gives the shortest path."
      },
      {
        question: "What happens if BFS's queue becomes empty before the goal is found?",
        options: ["BFS returns the closest node to the goal", "BFS backtracks and tries DFS", "BFS concludes no path exists (graph is disconnected)", "BFS restarts from a different start node"],
        correctIndex: 2,
        explanation: "An empty queue means all reachable nodes have been explored and the goal was not found. This means the goal is unreachable from the start (disconnected graph or blocked by obstacles)."
      }
    ]
  },

  // ─────────────────────────────────────────────────────────
  // EXPERIMENT 6: DFS Water Jug Problem
  // ─────────────────────────────────────────────────────────
  {
    title: "DFS Water Jug Problem (State Space Search)",
    slug: "dfs-water-jug",
    category: "Uninformed Search",
    difficulty: "Medium",
    visualizationType: "dfs-waterjug",
    manual: {
      aim: "To solve the Water Jug Problem using Depth-First Search (DFS) on a state space representation with a 4-litre and 3-litre jug, targeting exactly 2 litres in the 4-litre jug.",
      objectives: [
        "Model the Water Jug Problem as a state space search with defined states, actions, and goal.",
        "Implement Depth-First Search using an explicit stack for state exploration.",
        "Define all 6 valid operators (fill, empty, pour) for the two-jug system.",
        "Detect and avoid cyclic states using a visited set.",
        "Trace and reconstruct the solution path from initial state to goal state."
      ],
      theory: `## Water Jug Problem

The Water Jug Problem is a classic AI state space search puzzle:
- **Jug X:** Capacity = 4 litres
- **Jug Y:** Capacity = 3 litres
- **Goal:** Get exactly **2 litres** in Jug X (the 4L jug)
- **Constraint:** No measuring markings — you can only fill completely, empty completely, or pour one into the other.

---

## State Space Formulation

| Component | Definition |
|-----------|-----------|
| **State** | (x, y) — current litres in Jug X and Jug Y |
| **Initial State** | (0, 0) — both jugs empty |
| **Goal State** | (2, y) for any y — exactly 2L in 4L jug |
| **State Space** | All (x, y) where 0 ≤ x ≤ 4, 0 ≤ y ≤ 3 → **20 distinct states** |

---

## The 6 Operators

| Operator | Action | New State |
|----------|--------|-----------|
| **Fill X** | Fill 4L jug completely | (4, y) |
| **Fill Y** | Fill 3L jug completely | (x, 3) |
| **Empty X** | Drain 4L jug | (0, y) |
| **Empty Y** | Drain 3L jug | (x, 0) |
| **Pour X→Y** | Pour from X into Y until Y full or X empty | (x - d, y + d) |
| **Pour Y→X** | Pour from Y into X until X full or Y empty | (x + d, y - d) |

where d = min(x, 3-y) for Pour X→Y and d = min(y, 4-x) for Pour Y→X.

---

## Depth-First Search (DFS)

**DFS** explores as deep as possible along each branch before backtracking. It uses a **LIFO Stack** (Last-In First-Out).

### DFS vs BFS for Water Jug:
| Property | DFS | BFS |
|----------|-----|-----|
| Data structure | Stack | Queue |
| Path found | Not necessarily shortest | Always shortest |
| Memory use | O(depth) — very low | O(branching^depth) — high |
| Use case | Finding ANY solution quickly | Finding shortest solution |

### DFS Algorithm:
\`\`\`
DFS(start, goal):
  stack = [(start, path=[start])]
  visited = {}
  
  while stack not empty:
      (state, path) = stack.pop()  # LIFO
      
      if state in visited: continue
      visited.add(state)
      
      if is_goal(state):
          return path
      
      for each successor in apply_operators(state):
          if successor not in visited:
              stack.push((successor, path + [successor]))
  
  return None
\`\`\`

---

## Solution Trace

One valid DFS solution path:
\`\`\`
(0,0) → Fill X    → (4,0)
(4,0) → Pour X→Y  → (1,3)
(1,3) → Empty Y   → (1,0)
(1,0) → Pour X→Y  → (0,1)  [wait...]
\`\`\`

Another path (BFS optimal):
\`\`\`
(0,0) → Fill Y    → (0,3)
(0,3) → Pour Y→X  → (3,0)
(3,0) → Fill Y    → (3,3)
(3,3) → Pour Y→X  → (4,2)
(4,2) → Empty X   → (0,2)
(0,2) → Pour Y→X  → (2,0) ✅ GOAL!
\`\`\`

> DFS may find a **longer** but valid solution path first due to stack ordering.`,
      algorithm: [
        "Step 1: Initialize stack with (start_state=(0,0), path=[(0,0)]). Initialize visited = empty set.",
        "Step 2: POP top element from stack → (current_state, current_path). If already visited, go to Step 2.",
        "Step 3: Add current_state to visited set.",
        "Step 4: Check goal → if current_state[0] == 2 (exactly 2L in Jug X): SOLUTION FOUND. Return current_path.",
        "Step 5: Generate all 6 successors by applying operators: Fill X, Fill Y, Empty X, Empty Y, Pour X→Y, Pour Y→X.",
        "Step 6: For each successor not in visited: PUSH (successor, current_path + [successor]) onto stack.",
        "Step 7: Repeat from Step 2 until goal found or stack empty (no solution).",
        "Step 8: Print solution path as a sequence of (x,y) states with the operation that caused each transition."
      ],
      complexity: {
        time: "O(V + E) where V = 20 states (5×4 grid of (x,y) values), E = edges from applying 6 operators. Worst case visits all 20 states.",
        space: "O(depth × 6) for the DFS stack — much lower than BFS. The visited set is O(V) = O(20) for the water jug problem."
      }
    },
    code: {
      python: `def water_jug_dfs(jug_x_cap=4, jug_y_cap=3, goal_x=2):
    """
    Solve Water Jug Problem using DFS.
    jug_x_cap : capacity of Jug X (4 litres)
    jug_y_cap : capacity of Jug Y (3 litres)
    goal_x    : target amount in Jug X (2 litres)
    """
    def get_successors(state):
        x, y = state
        successors = []
        
        # 1. Fill Jug X completely
        if x < jug_x_cap:
            successors.append(((jug_x_cap, y), "Fill Jug X (4L)"))
        
        # 2. Fill Jug Y completely
        if y < jug_y_cap:
            successors.append(((x, jug_y_cap), "Fill Jug Y (3L)"))
        
        # 3. Empty Jug X
        if x > 0:
            successors.append(((0, y), "Empty Jug X"))
        
        # 4. Empty Jug Y
        if y > 0:
            successors.append(((x, 0), "Empty Jug Y"))
        
        # 5. Pour Jug X → Jug Y
        if x > 0 and y < jug_y_cap:
            pour = min(x, jug_y_cap - y)
            successors.append(((x - pour, y + pour), f"Pour X→Y ({pour}L)"))
        
        # 6. Pour Jug Y → Jug X
        if y > 0 and x < jug_x_cap:
            pour = min(y, jug_x_cap - x)
            successors.append(((x + pour, y - pour), f"Pour Y→X ({pour}L)"))
        
        return successors
    
    # DFS using explicit stack
    start = (0, 0)
    stack = [(start, [(start, "Start")])]
    visited = set()
    
    while stack:
        current_state, path = stack.pop()  # LIFO
        
        if current_state in visited:
            continue
        visited.add(current_state)
        
        x, y = current_state
        
        # Goal check: exactly goal_x litres in Jug X
        if x == goal_x:
            return path
        
        # Generate and push successors
        for next_state, operation in get_successors(current_state):
            if next_state not in visited:
                stack.append((next_state, path + [(next_state, operation)]))
    
    return None  # No solution


# Run the solver
print("=" * 50)
print("  Water Jug Problem — DFS — SPPU 2024")
print("=" * 50)
print("Jug X capacity: 4L | Jug Y capacity: 3L | Goal: 2L in Jug X")
print()

solution = water_jug_dfs()

if solution:
    print(f"✅ Solution found in {len(solution)-1} steps:\\n")
    print(f"{'Step':<6} {'Operation':<22} {'State (X,Y)'}")
    print("-" * 45)
    for i, (state, op) in enumerate(solution):
        print(f"  {i:<4} {op:<22} {state}")
else:
    print("❌ No solution found.")`,
      java: `import java.util.*;

public class WaterJugDFS {
    
    static final int JUG_X_CAP = 4;
    static final int JUG_Y_CAP = 3;
    static final int GOAL_X = 2;
    
    static class State {
        int x, y;
        String operation;
        State parent;
        
        State(int x, int y, String op, State parent) {
            this.x = x; this.y = y;
            this.operation = op;
            this.parent = parent;
        }
        
        String key() { return x + "," + y; }
    }
    
    public static List<State> solve() {
        Stack<State> stack = new Stack<>();
        Set<String> visited = new HashSet<>();
        
        stack.push(new State(0, 0, "Start", null));
        
        while (!stack.isEmpty()) {
            State curr = stack.pop();  // LIFO
            
            if (visited.contains(curr.key())) continue;
            visited.add(curr.key());
            
            // Goal check
            if (curr.x == GOAL_X) {
                return reconstructPath(curr);
            }
            
            int x = curr.x, y = curr.y;
            List<State> successors = new ArrayList<>();
            
            // All 6 operators
            if (x < JUG_X_CAP) successors.add(new State(JUG_X_CAP, y, "Fill Jug X", curr));
            if (y < JUG_Y_CAP) successors.add(new State(x, JUG_Y_CAP, "Fill Jug Y", curr));
            if (x > 0) successors.add(new State(0, y, "Empty Jug X", curr));
            if (y > 0) successors.add(new State(x, 0, "Empty Jug Y", curr));
            
            if (x > 0 && y < JUG_Y_CAP) {
                int pour = Math.min(x, JUG_Y_CAP - y);
                successors.add(new State(x - pour, y + pour, "Pour X→Y (" + pour + "L)", curr));
            }
            if (y > 0 && x < JUG_X_CAP) {
                int pour = Math.min(y, JUG_X_CAP - x);
                successors.add(new State(x + pour, y - pour, "Pour Y→X (" + pour + "L)", curr));
            }
            
            for (State s : successors) {
                if (!visited.contains(s.key())) stack.push(s);
            }
        }
        return null;
    }
    
    static List<State> reconstructPath(State goal) {
        LinkedList<State> path = new LinkedList<>();
        State curr = goal;
        while (curr != null) { path.addFirst(curr); curr = curr.parent; }
        return path;
    }
    
    public static void main(String[] args) {
        System.out.println("================================================");
        System.out.println("  Water Jug DFS — SPPU 2024");
        System.out.println("================================================");
        
        List<State> solution = solve();
        
        if (solution != null) {
            System.out.println("✅ Solution in " + (solution.size()-1) + " steps:");
            System.out.printf("%-5s %-22s %-12s%n", "Step", "Operation", "State (X,Y)");
            System.out.println("-".repeat(40));
            for (int i = 0; i < solution.size(); i++) {
                State s = solution.get(i);
                System.out.printf("%-5d %-22s (%d,%d)%n", i, s.operation, s.x, s.y);
            }
        } else {
            System.out.println("❌ No solution found.");
        }
    }
}`
    },
    quiz: [
      {
        question: "In the Water Jug problem (4L & 3L jugs), what is the total number of distinct states?",
        options: ["12", "20", "16", "8"],
        correctIndex: 1,
        explanation: "State is (x, y) where 0≤x≤4 (5 values) and 0≤y≤3 (4 values). Total = 5 × 4 = 20 distinct states in the state space."
      },
      {
        question: "DFS uses which data structure for the frontier?",
        options: ["Queue (FIFO)", "Stack (LIFO)", "Priority Queue (min-heap)", "Linked List"],
        correctIndex: 1,
        explanation: "DFS uses a LIFO Stack. The most recently discovered node is explored first, causing DFS to dive deep into one branch before exploring siblings — unlike BFS which uses a FIFO Queue."
      },
      {
        question: "Which of the following is NOT one of the 6 valid operators in the Water Jug problem?",
        options: ["Fill Jug X completely", "Pour half of Jug X into Jug Y", "Empty Jug Y completely", "Pour Jug Y into Jug X until X is full or Y is empty"],
        correctIndex: 1,
        explanation: "The 6 operators are: Fill X, Fill Y, Empty X, Empty Y, Pour X→Y (until full/empty), Pour Y→X (until full/empty). You CANNOT pour 'half' since there are no measuring marks on the jugs."
      },
      {
        question: "Is DFS guaranteed to find the shortest solution path for the Water Jug problem?",
        options: ["Yes, DFS always finds the optimal solution", "No, DFS may find a longer path; BFS guarantees shortest", "Yes, if we use an admissible heuristic with DFS", "No, DFS cannot solve the Water Jug problem"],
        correctIndex: 1,
        explanation: "DFS does NOT guarantee shortest path. It explores based on stack order and may find a valid but longer solution. BFS (using a queue) guarantees the shortest path because it explores level by level."
      },
      {
        question: "Why do we maintain a 'visited' set in DFS for the Water Jug problem?",
        options: ["To count the number of steps", "To prevent revisiting already-explored states and avoid infinite loops", "To store the solution path", "To calculate time complexity"],
        correctIndex: 1,
        explanation: "The state space of the Water Jug problem contains cycles (e.g., fill → pour → empty → fill again). Without a visited set, DFS would loop infinitely. The visited set ensures each state is explored at most once."
      }
    ]
  },

  // ─────────────────────────────────────────────────────────
  // EXPERIMENT 7: 8-Queens Backtracking CSP
  // ─────────────────────────────────────────────────────────
  {
    title: "8-Queens Problem using Backtracking (CSP)",
    slug: "eight-queens",
    category: "Constraint Satisfaction Problems",
    difficulty: "Hard",
    visualizationType: "eight-queens",
    manual: {
      aim: "To solve the 8-Queens Problem using Backtracking search as a Constraint Satisfaction Problem (CSP), placing 8 non-attacking queens on an 8×8 chessboard.",
      objectives: [
        "Formulate the 8-Queens problem as a Constraint Satisfaction Problem (CSP).",
        "Understand and implement the backtracking search algorithm.",
        "Define and check constraints for queen safety (row, column, diagonal).",
        "Enumerate all 92 distinct solutions using recursive backtracking.",
        "Understand forward checking and pruning in CSP search."
      ],
      theory: `## Constraint Satisfaction Problem (CSP)

A **CSP** is defined by three components:
- **Variables X:** X = {Q1, Q2, Q3, ..., Q8} — one queen per column
- **Domains D:** D(Qi) = {1, 2, 3, ..., 8} — row position for each queen
- **Constraints C:** No two queens attack each other

### Constraints in 8-Queens:
1. **Row Constraint:** No two queens in the same row → Q_i ≠ Q_j for all i ≠ j
2. **Column Constraint:** Already handled — one queen per column by design
3. **Diagonal Constraint:** |Q_i - Q_j| ≠ |i - j| — queens not on same diagonal

---

## Backtracking Algorithm

**Backtracking** is a systematic recursive algorithm that:
1. Places one queen per column, left to right
2. For each column, tries all rows (1 to 8)
3. If a placement is **safe** → recurse to next column
4. If no safe row exists → **backtrack** to previous column and try next row

\`\`\`
Backtrack(column):
  if column > 8:
      solution found! record it.
      return
  
  for row in 1..8:
      if is_safe(row, column, current_placement):
          place queen at (row, column)
          Backtrack(column + 1)
          remove queen from (row, column)  ← BACKTRACK
\`\`\`

### is_safe() Check:
\`\`\`python
def is_safe(board, row, col):
    # Check same row in previous columns
    for c in range(col):
        if board[c] == row:
            return False
    # Check upper-left diagonal
    r, c = row - 1, col - 1
    while r >= 0 and c >= 0:
        if board[c] == r + 1: return False
        r -= 1; c -= 1
    # Check lower-left diagonal
    r, c = row + 1, col - 1
    while r <= 8 and c >= 0:
        if board[c] == r - 1: return False
        r += 1; c -= 1
    return True
\`\`\`

---

## Why Backtracking is Efficient

Brute force would try **8^8 = 16,777,216** combinations. Backtracking **prunes** invalid placements early:
- As soon as a queen placement violates a constraint, we abandon that branch immediately
- This dramatically reduces the search space to just **92 solutions** found

### Solution Count:
- **Total distinct solutions:** 92
- **Fundamental (unique up to symmetry):** 12
- **Nodes explored by backtracking:** ~15,700 (vs 16.7M brute force!)

---

## The 8 Attack Patterns for a Queen

A queen at position (r, c) attacks:
- **Same row:** all (r, x) for x ≠ c
- **Same column:** all (y, c) for y ≠ r  
- **Main diagonal:** (r±k, c±k) for any k
- **Anti-diagonal:** (r±k, c∓k) for any k

---

## Complexity Analysis

| Metric | Value |
|--------|-------|
| State space size | 8^8 = 16.7M (brute force) |
| Backtracking nodes | ~15,720 (with pruning) |
| Total solutions | 92 |
| Fundamental solutions | 12 |
| Time per solution | O(N²) safety check |`,
      algorithm: [
        "Step 1: Initialize board[8] = {0} — board[col] stores the row where queen is placed in that column.",
        "Step 2: Call solve(col=0) recursively.",
        "Step 3: Base case: if col == 8 → all 8 queens placed safely → record solution, increment count.",
        "Step 4: For current column col, try each row (1 to 8):",
        "        a. Check is_safe(board, row, col): verify no queen in same row or diagonal in columns 0..col-1.",
        "        b. If safe: board[col] = row → recurse: solve(col+1).",
        "        c. After recursion returns: board[col] = 0 (BACKTRACK — undo placement).",
        "Step 5: is_safe() checks: same row in previous cols + upper-left diagonal + lower-left diagonal.",
        "Step 6: Repeat until all solutions enumerated. Total = 92 distinct placements."
      ],
      complexity: {
        time: "O(N!) in worst case but pruning dramatically reduces actual nodes visited. For N=8, backtracking explores ~15,720 nodes vs 8^8 = 16,777,216 brute force — a 1000x improvement.",
        space: "O(N) = O(8) for the board array storing queen positions. Recursion stack depth is N (one level per column) = O(N)."
      }
    },
    code: {
      python: `solutions = []
board = [0] * 8  # board[col] = row where queen is placed

def is_safe(board, row, col):
    """Check if placing a queen at (row, col) is safe."""
    for c in range(col):
        # Same row check
        if board[c] == row:
            return False
        # Diagonal check: |row difference| == |col difference|
        if abs(board[c] - row) == abs(c - col):
            return False
    return True

def solve(col=0):
    """Backtracking: place queen in each column left to right."""
    global solutions
    
    if col == 8:
        # All 8 queens placed — found a solution!
        solutions.append(board[:])
        return
    
    for row in range(1, 9):  # Try rows 1 through 8
        if is_safe(board, row, col):
            board[col] = row          # Place queen
            solve(col + 1)            # Recurse to next column
            board[col] = 0            # BACKTRACK: remove queen

def print_board(solution):
    """Visualize a solution on an 8x8 chessboard."""
    for row in range(1, 9):
        line = ""
        for col in range(8):
            if solution[col] == row:
                line += " Q "
            else:
                line += " . "
        print(line)

print("=" * 50)
print("  8-Queens Problem — Backtracking — SPPU 2024")
print("=" * 50)

solve()

print(f"\\n✅ Total solutions found: {len(solutions)}")
print("\\n📋 First solution (board[col] = row for each column):")
print("   Columns: ", list(range(1, 9)))
print("   Rows:    ", solutions[0])
print("\\nChessboard visualization of Solution #1:")
print("  " + " - " * 8)
print_board(solutions[0])
print("  " + " - " * 8)
print("\\n📋 All 92 solutions (row positions per column):")
for i, sol in enumerate(solutions[:5]):  # Print first 5
    print(f"  Sol {i+1:02d}: {sol}")
print("  ... (87 more solutions)")`,
      java: `import java.util.*;

public class EightQueens {
    static int[] board = new int[8];  // board[col] = row of queen
    static int solutionCount = 0;
    static List<int[]> allSolutions = new ArrayList<>();
    
    static boolean isSafe(int row, int col) {
        for (int c = 0; c < col; c++) {
            // Same row or diagonal attack
            if (board[c] == row || Math.abs(board[c] - row) == Math.abs(c - col)) {
                return false;
            }
        }
        return true;
    }
    
    static void solve(int col) {
        if (col == 8) {
            solutionCount++;
            allSolutions.add(board.clone());
            return;
        }
        
        for (int row = 1; row <= 8; row++) {
            if (isSafe(row, col)) {
                board[col] = row;      // Place queen
                solve(col + 1);        // Recurse
                board[col] = 0;        // Backtrack
            }
        }
    }
    
    static void printBoard(int[] solution) {
        System.out.println("  " + "-".repeat(24));
        for (int row = 1; row <= 8; row++) {
            StringBuilder line = new StringBuilder("  |");
            for (int col = 0; col < 8; col++) {
                line.append(solution[col] == row ? " Q " : " . ");
            }
            line.append("|");
            System.out.println(line);
        }
        System.out.println("  " + "-".repeat(24));
    }
    
    public static void main(String[] args) {
        System.out.println("==============================================");
        System.out.println("  8-Queens Backtracking CSP — SPPU 2024");
        System.out.println("==============================================");
        
        solve(0);
        
        System.out.println("\\n✅ Total solutions found: " + solutionCount);
        System.out.println("\\nSolution #1 board:");
        printBoard(allSolutions.get(0));
        
        System.out.println("\\nFirst 5 solutions (row per column):");
        for (int i = 0; i < Math.min(5, allSolutions.size()); i++) {
            System.out.print("  Sol " + (i+1) + ": ");
            System.out.println(Arrays.toString(allSolutions.get(i)));
        }
    }
}`
    },
    quiz: [
      {
        question: "How many distinct solutions exist for the 8-Queens problem?",
        options: ["64", "92", "12", "256"],
        correctIndex: 1,
        explanation: "There are exactly 92 distinct solutions to the 8-Queens problem. Among these, 12 are 'fundamental' solutions (unique under rotation and reflection symmetries)."
      },
      {
        question: "In the CSP formulation of 8-Queens, what is the domain of each variable Qi?",
        options: ["All 64 squares on the board", "Rows 1 to 8 (the row position for queen in column i)", "True/False (queen present or not)", "All valid board configurations"],
        correctIndex: 1,
        explanation: "Each variable Qi represents the row position of the queen in column i. Since there's one queen per column, the domain is {1, 2, 3, 4, 5, 6, 7, 8} — the 8 possible rows."
      },
      {
        question: "Two queens attack diagonally if and only if:",
        options: ["They are in adjacent rows", "|row_i - row_j| == |col_i - col_j|", "|row_i + row_j| == |col_i + col_j|", "They are in the same 3×3 subgrid"],
        correctIndex: 1,
        explanation: "Queens at (r1, c1) and (r2, c2) are on the same diagonal if and only if |r1 - r2| = |c1 - c2|. This covers both the main diagonal and the anti-diagonal directions."
      },
      {
        question: "In backtracking for 8-Queens, what happens when no safe row is found for a column?",
        options: ["The algorithm stops and reports failure", "The algorithm skips that column", "The algorithm backtracks to the previous column and tries the next row", "The algorithm restarts from scratch"],
        correctIndex: 2,
        explanation: "When no safe placement exists in a column, backtracking undoes the last queen placement and returns to the previous column to try the next available row. This is the essence of backtracking."
      },
      {
        question: "How many node evaluations does backtracking save compared to brute force for 8-Queens?",
        options: ["About 2x fewer nodes", "About 1000x fewer nodes (15,720 vs ~16.7 million)", "No difference — backtracking and brute force are equivalent", "About 8x fewer nodes"],
        correctIndex: 1,
        explanation: "Brute force tries all 8^8 = 16,777,216 placements. Backtracking with constraint pruning explores only ~15,720 nodes — about 1,000 times fewer. Constraints eliminate entire subtrees early."
      }
    ]
  },

  // ─────────────────────────────────────────────────────────
  // EXPERIMENT 8: Simple Chatbot (Pattern Matching)
  // ─────────────────────────────────────────────────────────
  {
    title: "Rule-Based Chatbot with Pattern Matching",
    slug: "chatbot-pattern-matching",
    category: "Natural Language Processing",
    difficulty: "Easy",
    visualizationType: "chatbot",
    manual: {
      aim: "To design and implement a rule-based chatbot using pattern matching techniques, where user input is matched against predefined rules to generate contextually appropriate responses.",
      objectives: [
        "Understand rule-based AI systems and pattern matching in Natural Language Processing.",
        "Implement an IF-THEN production rule system for conversational response generation.",
        "Apply string normalization (lowercasing, stripping punctuation) as preprocessing.",
        "Design a knowledge base of pattern-response pairs covering multiple domains.",
        "Evaluate chatbot limitations and understand the transition to modern NLP (NLTK, transformers)."
      ],
      theory: `## What is a Chatbot?

A **chatbot** is a computer program that simulates human conversation. There are two broad types:

| Type | Description | Examples |
|------|-------------|---------|
| **Rule-Based** | Uses predefined IF-THEN rules and pattern matching | ELIZA, ALICE, our chatbot |
| **AI/ML Based** | Uses neural networks, deep learning, LLMs | ChatGPT, Siri, Alexa |

---

## Rule-Based Pattern Matching

A rule-based chatbot works on a simple principle:

> **IF** the user's input matches a certain pattern → **THEN** respond with a specific answer

### How Pattern Matching Works:
1. **Preprocessing:** Normalize input — convert to lowercase, remove punctuation, strip whitespace
2. **Pattern Matching:** Check user input against each rule's keywords/pattern
3. **Response Generation:** Return the corresponding response for the first matching rule
4. **Default Fallback:** If no pattern matches, return a generic fallback response

---

## Production Rule System

A **production rule** has the format:

\`\`\`
Rule {
  pattern : ["keyword1", "keyword2"]   ← IF any keyword found in input
  responses: ["reply 1", "reply 2"]    ← THEN pick random response
}
\`\`\`

### Example Rules:
\`\`\`python
rules = [
    {
        "patterns": ["hello", "hi", "hey"],
        "responses": ["Hello! How can I help you?", "Hi there!"]
    },
    {
        "patterns": ["what is ai", "define ai", "artificial intelligence"],
        "responses": ["AI is the simulation of human intelligence by machines."]
    },
    {
        "patterns": ["bye", "goodbye", "exit"],
        "responses": ["Goodbye! Have a great day!", "See you soon!"]
    }
]
\`\`\`

---

## ELIZA — The First Chatbot (1966)

**ELIZA** was created at MIT by Joseph Weizenbaum in 1966. It simulated a Rogerian psychotherapist using simple pattern matching. People found conversations with ELIZA surprisingly convincing — this effect is now called the **ELIZA Effect**.

Key idea: ELIZA reflected user statements back as questions:
- User: "I am sad"
- ELIZA: "Why do you say you are sad?"

---

## Limitations of Rule-Based Chatbots

| Limitation | Description |
|-----------|-------------|
| **No context memory** | Each response is independent, no conversation history |
| **Pattern brittleness** | Slight rephrasing breaks matching (typos, synonyms) |
| **Limited coverage** | Only answers questions explicitly programmed |
| **No learning** | Rules are static, doesn't improve from interactions |
| **No semantics** | Works on keywords, not actual meaning |

---

## Modern NLP Evolution

\`\`\`
Rule-Based → Statistical NLP → Word Embeddings → Transformers → LLMs
  (1960s)      (1990s-2000s)    (Word2Vec 2013)   (BERT 2018)   (GPT-4 2023)
\`\`\`

While rule-based chatbots are limited, they remain valuable for:
- Structured domains (flight booking, FAQ bots)
- Explainable AI (you can audit every decision)
- Low-resource environments (no GPU required)`,
      algorithm: [
        "Step 1: Build the Knowledge Base — define rules as list of {patterns: [...], responses: [...]} dictionaries.",
        "Step 2: Accept user input as a raw string.",
        "Step 3: Preprocess input: convert to lowercase, remove punctuation, strip extra whitespace.",
        "Step 4: Pattern Matching — for each rule in knowledge base: check if ANY pattern keyword is a substring of the preprocessed input.",
        "Step 5: On first match: randomly select one response from rule.responses list and return it.",
        "Step 6: If no rule matches: return a default fallback response (e.g., 'I don't understand. Could you rephrase?').",
        "Step 7: Continue loop — prompt user for next input. Check for exit keywords to end conversation.",
        "Step 8: Log conversation history as list of (user, bot) tuples for display."
      ],
      complexity: {
        time: "O(R × P × L) where R = number of rules, P = patterns per rule, L = length of input. For small KBs, effectively O(1) per response.",
        space: "O(R × P) for storing the knowledge base rules and pattern lists. Conversation history is O(N) for N turns."
      }
    },
    code: {
      python: `import random
import string
import re

# ─── Knowledge Base (Pattern → Response Rules) ───────────────────────────────
knowledge_base = [
    {
        "patterns": ["hello", "hi", "hey", "greetings", "howdy", "good morning", "good afternoon"],
        "responses": [
            "Hello! 👋 I'm NOVA, your AI assistant. How can I help you today?",
            "Hi there! Welcome to NOVA.lab. What would you like to know?",
            "Hey! Great to see you. Ask me anything about AI!"
        ]
    },
    {
        "patterns": ["what is ai", "define ai", "artificial intelligence", "what is artificial intelligence"],
        "responses": [
            "Artificial Intelligence (AI) is the simulation of human intelligence in machines. It enables computers to learn, reason, problem-solve, and understand language.",
            "AI is a branch of computer science focused on creating smart machines capable of performing tasks that normally require human intelligence."
        ]
    },
    {
        "patterns": ["what is machine learning", "machine learning", "ml"],
        "responses": [
            "Machine Learning (ML) is a subset of AI where systems learn from data and improve from experience without being explicitly programmed.",
            "ML allows computers to find patterns in data and make predictions. It powers recommendation systems, spam filters, and image recognition!"
        ]
    },
    {
        "patterns": ["what is deep learning", "deep learning", "neural network", "neural networks"],
        "responses": [
            "Deep Learning uses multi-layered neural networks (inspired by the human brain) to process complex data like images, speech, and text.",
            "Deep Learning is why AI can recognize faces, translate languages, and generate text. It's the engine behind ChatGPT, DALL-E, and AlphaGo!"
        ]
    },
    {
        "patterns": ["what is bfs", "breadth first", "breadth-first search"],
        "responses": [
            "BFS (Breadth-First Search) is a graph traversal algorithm using a FIFO queue. It explores all nodes at the current depth level before moving deeper. It guarantees the shortest path in unweighted graphs!",
        ]
    },
    {
        "patterns": ["what is dfs", "depth first", "depth-first search"],
        "responses": [
            "DFS (Depth-First Search) uses a LIFO stack and explores as deep as possible before backtracking. It's memory-efficient but doesn't guarantee the shortest path."
        ]
    },
    {
        "patterns": ["alpha beta", "minimax", "alpha-beta pruning"],
        "responses": [
            "Alpha-Beta Pruning optimizes the Minimax algorithm by skipping branches that can't affect the final decision. It maintains α (MAX's best) and β (MIN's best) values, pruning when α ≥ β."
        ]
    },
    {
        "patterns": ["8 queens", "eight queens", "n queens"],
        "responses": [
            "The 8-Queens problem places 8 non-attacking queens on an 8×8 board. Solved using Backtracking CSP — there are exactly 92 solutions!",
        ]
    },
    {
        "patterns": ["who are you", "your name", "what are you"],
        "responses": [
            "I'm NOVA 🤖 — an AI assistant built for NOVA.lab, your SPPU 2024 AI Laboratory portal!",
            "I'm an intelligent pattern-matching chatbot, part of the NOVA.lab educational system."
        ]
    },
    {
        "patterns": ["help", "what can you do", "capabilities"],
        "responses": [
            "I can answer questions about: AI concepts, ML, Deep Learning, search algorithms (BFS/DFS/A*), game theory (Alpha-Beta), 8-Queens, and the experiments in this lab!",
        ]
    },
    {
        "patterns": ["bye", "goodbye", "exit", "quit", "see you"],
        "responses": [
            "Goodbye! 👋 Keep exploring AI! Come back anytime.",
            "See you soon! Happy learning at NOVA.lab! 🚀"
        ]
    }
]

def preprocess(text):
    """Normalize user input for matching."""
    text = text.lower()
    text = re.sub(r'[^\\w\\s]', '', text)  # Remove punctuation
    text = text.strip()
    return text

def get_response(user_input):
    """Match user input against knowledge base rules."""
    processed = preprocess(user_input)
    
    for rule in knowledge_base:
        for pattern in rule["patterns"]:
            if pattern in processed:
                return random.choice(rule["responses"])
    
    # Fallback response
    return "Hmm, I'm not sure about that. Could you rephrase? Try asking about AI, BFS, DFS, Alpha-Beta, or 8-Queens!"

# ─── Main Chat Loop ───────────────────────────────────────────────────────────
print("=" * 55)
print("   NOVA Chatbot — Rule-Based AI — SPPU 2024")
print("=" * 55)
print("NOVA: Hello! I'm NOVA, your AI Lab assistant.")
print("NOVA: Ask me about AI, algorithms, or type 'bye' to exit.")
print("-" * 55)

while True:
    user_input = input("You: ").strip()
    if not user_input:
        continue
    
    response = get_response(user_input)
    print(f"NOVA: {response}")
    
    if preprocess(user_input) in ["bye", "goodbye", "exit", "quit"]:
        break`,
      java: `import java.util.*;

public class RuleBasedChatbot {
    
    static String[][] patterns = {
        {"hello", "hi", "hey", "greetings"},
        {"what is ai", "artificial intelligence", "define ai"},
        {"machine learning", "what is ml"},
        {"deep learning", "neural network"},
        {"bfs", "breadth first"},
        {"dfs", "depth first"},
        {"alpha beta", "minimax", "alpha-beta"},
        {"8 queens", "eight queens", "n queens"},
        {"who are you", "your name", "what are you"},
        {"bye", "goodbye", "exit", "quit"}
    };
    
    static String[][] responses = {
        {"Hello! I'm NOVA, your AI assistant. How can I help?",
         "Hi there! Welcome to NOVA.lab. Ask me anything!"},
        {"AI is the simulation of human intelligence in machines. It enables computers to learn, reason, and solve problems.",
         "Artificial Intelligence empowers computers to perform tasks that normally need human intelligence."},
        {"ML is a subset of AI where systems learn from data without being explicitly programmed.",
         "Machine Learning finds patterns in data to make predictions. It powers Netflix, Spotify, and spam filters!"},
        {"Deep Learning uses multi-layered neural networks to process images, speech, and text. It powers ChatGPT and DALL-E!"},
        {"BFS uses a FIFO queue and explores nodes level by level. It guarantees the shortest path in unweighted graphs!"},
        {"DFS uses a LIFO stack and goes deep before backtracking. Memory-efficient but doesn't guarantee shortest path."},
        {"Alpha-Beta Pruning optimizes Minimax by skipping branches that can't change the result. α ≥ β means prune!"},
        {"The 8-Queens problem places 8 non-attacking queens on a chessboard. Solved via backtracking — 92 total solutions!"},
        {"I'm NOVA — an AI chatbot in the NOVA.lab educational platform for SPPU 2024 AI curriculum!"},
        {"Goodbye! Happy learning at NOVA.lab! 🚀"}
    };
    
    static String getResponse(String input) {
        String processed = input.toLowerCase().replaceAll("[^a-z0-9 ]", "").trim();
        
        for (int i = 0; i < patterns.length; i++) {
            for (String pat : patterns[i]) {
                if (processed.contains(pat)) {
                    String[] opts = responses[i];
                    return opts[new Random().nextInt(opts.length)];
                }
            }
        }
        return "I'm not sure about that. Try asking about AI, BFS, DFS, Alpha-Beta, or 8-Queens!";
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.println("==============================================");
        System.out.println("   NOVA Chatbot — SPPU 2024 Pattern");
        System.out.println("==============================================");
        System.out.println("NOVA: Hello! Ask me about AI or type 'bye'.");
        
        while (true) {
            System.out.print("You: ");
            String input = scanner.nextLine().trim();
            if (input.isEmpty()) continue;
            
            String response = getResponse(input);
            System.out.println("NOVA: " + response);
            
            if (input.toLowerCase().matches("bye|goodbye|exit|quit")) break;
        }
        scanner.close();
    }
}`
    },
    quiz: [
      {
        question: "What is the first step in a rule-based chatbot's response pipeline?",
        options: ["Generate a response from neural network", "Preprocess (normalize) the user input — lowercase, remove punctuation", "Look up a database", "Call an external API"],
        correctIndex: 1,
        explanation: "Preprocessing normalizes user input by converting to lowercase and removing punctuation. This ensures 'Hello!' and 'hello' both match the same patterns, making the system more robust."
      },
      {
        question: "ELIZA, the first chatbot (1966), used which technique?",
        options: ["Deep Learning", "Reinforcement Learning", "Pattern Matching with rule-based responses", "Statistical Language Models"],
        correctIndex: 2,
        explanation: "ELIZA (1966, MIT) used simple pattern matching. It reflected user statements as questions, simulating a Rogerian therapist. This pioneering work demonstrated that pattern matching could create surprisingly convincing conversations."
      },
      {
        question: "What is the major limitation of rule-based chatbots compared to LLMs?",
        options: ["They are too slow to respond", "They cannot handle questions not covered by predefined rules (brittle, no context)", "They require too much memory", "They cannot display text on screen"],
        correctIndex: 1,
        explanation: "Rule-based chatbots can only respond to patterns explicitly programmed into them. Any rephrasing or out-of-scope question gets a fallback. They also have no memory of context — each response is stateless."
      },
      {
        question: "In a production rule system for chatbots, what does the 'THEN' part represent?",
        options: ["The user's input", "The pattern to match against", "The response to return when the pattern matches", "The preprocessing step"],
        correctIndex: 2,
        explanation: "A production rule is IF (pattern matches) THEN (return response). The 'THEN' part is the chatbot's response — it could be a fixed string or selected randomly from a set of possible responses."
      },
      {
        question: "What is the 'ELIZA Effect'?",
        options: ["The speed improvement of pattern matching algorithms", "The tendency of humans to anthropomorphize and attribute understanding to simple rule-based programs", "A type of neural network architecture", "The 1966 programming language used to write ELIZA"],
        correctIndex: 1,
        explanation: "The 'ELIZA Effect' describes how people naturally attribute understanding, empathy, or intelligence to computer programs that simply reflect or rephrase their words — even when no real understanding exists."
      }
    ]
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Purging old collections...");
    await Assignment.deleteMany({});
    console.log("Seeding SPPU 2024 Pattern In-Depth Manuals, Codes, and 5-Question Quizzes...");
    await Assignment.insertMany(assignments);
    console.log("✅ Seeding complete with high-academic depth!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
}

seed();