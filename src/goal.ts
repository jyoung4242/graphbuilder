type actionstate = Record<string, any>;

export class Goal {
  constructor(public name: string, public targetState: actionstate, public weighting: () => number) {}
}

export const myGoal = new Goal("myGoal", { value1: 1, value2: 2, value3: 1, value4: true }, () => 1);

export const p2Goal = new Goal("p2Goal", { value1: -1, value2: 0, value3: -2, value4: true }, () => 1);
