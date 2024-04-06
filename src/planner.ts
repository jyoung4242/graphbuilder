type actionstate = Record<string, any>;
import { Goal } from "./goal";
import { MyAction, effectCallback } from "./actions";
import { ExcaliburGraph, GraphNode, Edge } from "@excaliburjs/plugin-pathfinding";

export interface iPlanner {
  world: actionstate;
  agentState: actionstate;
  goals: Goal[];
  actions: MyAction[];
}

export class Planner {
  graph = new ExcaliburGraph();
  world: actionstate;
  agentState: actionstate;
  goals: Goal[];
  actions: MyAction[];
  numEndNodes = 0;
  constructor(input: iPlanner) {
    this.world = input.world;
    this.agentState = input.agentState;
    this.goals = input.goals;
    this.actions = input.actions;
  }

  buildGraph(
    startnode: GraphNode,
    useableActions: MyAction[],
    worldstate: actionstate,
    graph: ExcaliburGraph,
    goal: Goal,
    levelcount: number,
    branch: number
  ) {
    let level = levelcount + 1;
    let branchcnt = branch;
    //let incomingstate = structuredClone(worldstate);

    let incomingstate = Object.assign({}, worldstate);
    console.log("level", level, "branch", branch, "useableActions", useableActions.length);

    for (let i = 0; i < useableActions.length; i++) {
      branchcnt = i;

      console.log("branchcnt", branchcnt);

      let nodestring = `node level:${level} branch:${branchcnt}`;
      const action = useableActions[i];

      console.log("action", action);

      const newState = this.modifyState(incomingstate, action.effect);
      console.log("newState", newState);

      const newuseableActions = this.actions.filter(action => action.isAcheivable(newState));
      console.log("newuseableActions initial", newuseableActions);
      let nextnode;
      if (this.checkIfGoalReached(goal, newState)) {
        console.log("end of branch, reached goal", goal);

        graph.addNode({ id: `endnode_${this.numEndNodes}`, value: { world: newState, state: this.agentState, action: action } });
        nextnode = graph.getNodes().get(`endnode_${this.numEndNodes}`);
        const edgeString = `edge from:${startnode.id} to:endnode_${this.numEndNodes}`;
        graph.addEdge({ name: edgeString, from: startnode, to: nextnode!, value: action.cost });
        this.numEndNodes++;
        return;
      } else {
        graph.addNode({ id: nodestring, value: { world: incomingstate, state: this.agentState, action: action } });
        nextnode = graph.getNodes().get(nodestring);
        const edgeString = `edge from:${startnode.id} to:${nextnode?.id}`;
        graph.addEdge({ name: edgeString, from: startnode, to: nextnode!, value: action.cost });
      }

      console.log("newuseableActions after", newuseableActions);
      if (newuseableActions.length === 0) {
        return;
      }

      //make a copy of newstate
      //const newStateCopy = structuredClone(newState);
      const newStateCopy = Object.assign({}, newState);
      this.buildGraph(nextnode!, newuseableActions, newStateCopy, graph, goal, level, branchcnt);
    }
  }

  checkIfGoalReached(goal: Goal, state: actionstate): boolean {
    console.log("checkIfGoalReached", goal, state);

    return JSON.stringify(state) === JSON.stringify(goal.targetState);
  }

  modifyState(world: actionstate, effect: effectCallback): actionstate {
    effect(world);
    return world;
  }

  cheapestPath(graph: ExcaliburGraph): MyAction[] {
    const startnode = graph.getNodes().get("startnode");
    const endnodes: GraphNode[] = [];

    graph.nodes.forEach(node => {
      let testString: string[] = [];
      if (typeof node.id == "string") testString = node.id.split("_");

      if (testString[0] === "endnode") {
        endnodes.push(node);
      }
    });
    if (endnodes.length === 0) return [];
    console.log("endnodes", endnodes);

    //test each shortest path between startnode and each endnode and return the lowest cost path
    let lowestCost = Infinity;
    let cheapestEndNode: GraphNode | undefined;

    endnodes.forEach(node => {
      const path = graph.shortestPath(startnode!, node);
      console.log("path", path);

      //add up costs of path
      let cost = 0;
      path.reduce((node, nextnode) => {
        const edge = graph.getEdges().get(`edge from:${node.id} to:${nextnode.id}`);
        if (edge) {
          cost += edge.value!;
        }
        return nextnode;
      });
      if (cost < lowestCost) {
        lowestCost = cost;
        cheapestEndNode = node;
      }
    });

    console.log("lowestCost", lowestCost);
    console.log("cheapest endnode", cheapestEndNode);
    let cheapestPlan = graph.shortestPath(startnode!, cheapestEndNode!);
    let actionPlan = cheapestPlan.map(node => {
      return node.value.action;
    });
    actionPlan.splice(0, 1);
    return actionPlan;
  }

  plan(): MyAction[] {
    const newplan = [];

    //pick best goal
    // best goal will be determined by highest weighting
    const bestGoal = this.goals.reduce((prev, curr) => (prev.weighting() > curr.weighting() ? prev : curr));

    //get list of usable actions
    const useableActions = this.actions.filter(action => action.isAcheivable(this.world));
    console.log("initial filtered actions", useableActions);

    this.graph.addNode({
      id: "startnode",
      value: { world: this.world, state: this.agentState, action: null },
    });

    this.buildGraph(this.graph.getNodes().get("startnode")!, useableActions, this.world, this.graph, bestGoal, 0, 0);

    console.log("End graph", this.graph);

    // iterate over tree graph and find cheapest path that satisfies all goals
    const actionplan = this.cheapestPath(this.graph);

    return actionplan;
  }
}
