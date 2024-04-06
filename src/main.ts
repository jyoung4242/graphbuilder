import { GraphNode, Edge, ExcaliburGraph } from "@excaliburjs/plugin-pathfinding";
import { MyAction, action1, action2, action3, action4, action5 } from "./actions";
import { Goal, myGoal } from "./goal";

import "./style.css";
import { Agent, iAgent } from "./agent";

type actionstate = Record<string, any>;

const worldstate = {
  value1: 0,
  value2: 1,
  value3: 2,
};

const playerConfig: iAgent = {
  world: worldstate,
  state: { value4: 0 },
  actions: [action1, action2, action3, action4, action5],
  goals: [myGoal],
};
const player = new Agent(playerConfig);

console.log(player);

const newplan = player.planner.plan();

console.log("newplan", newplan);
