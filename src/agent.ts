type actionstate = Record<string, any>;
import { Goal } from "./goal";
import { MyAction } from "./actions";
import { Planner } from "./planner";

export interface iAgent {
  world: actionstate;
  state: actionstate;
  actions: MyAction[];
  goals: Goal[];
}

export class Agent {
  state: actionstate;
  world: actionstate;
  goals: Goal[];
  actions: MyAction[];
  planner: Planner;
  plan: MyAction[] = [];
  currentGoal: Goal | null = null;

  constructor(input: iAgent) {
    this.goals = input.goals;
    this.state = input.state;
    this.actions = input.actions;
    this.world = input.world;
    this.planner = new Planner({ world: this.world, agentState: this.state, goals: this.goals, actions: this.actions });
  }
}
