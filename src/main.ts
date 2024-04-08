import { GraphNode, Edge, ExcaliburGraph } from "@excaliburjs/plugin-pathfinding";
import { MyAction, action1, action2, action3, action4, action5, action6 } from "./actions";
import { Goal, myGoal, p2Goal } from "./goal";

import "./style.css";
import { Agent, iAgent } from "./agent";

type actionstate = Record<string, any>;

const worldstate = {
  value1: 0,
  value2: 1,
  value3: 2,
  value4: true,
};

const playerConfig: iAgent = {
  world: worldstate,
  state: { value4: 0 },
  actions: [action1, action2, action3, action4, action5, action6],
  goals: [myGoal],
};
const player = new Agent(playerConfig);

const p2config: iAgent = {
  world: worldstate,
  state: { value4: 1 },
  actions: [action1, action2, action3, action4, action5, action6],
  goals: [p2Goal],
};
const p2 = new Agent(p2config);
const newplan = player.planner.plan();
const p2plan = p2.planner.plan();

console.log("newplan", newplan);
console.log("p2plan", p2plan);
