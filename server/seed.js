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