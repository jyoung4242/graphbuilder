type actionstate = Record<string, any>;

export class Goal {
  constructor(public name: string, public targetState: actionstate, public weighting: () => number) {}
}

export const myGoal = new Goal("myGoal", { value1: 1, value2: 2, value3: 1 }, () => 1);
