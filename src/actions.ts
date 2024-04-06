type actionstate = Record<string, any>;

export class MyAction {
  name: string;
  cost: number;
  effect: actionstate;
  precondition: actionstate;
  constructor(name: string, cost: number, effect: actionstate, precondition: actionstate) {
    this.name = name;
    this.cost = cost;
    this.effect = effect;
    this.precondition = precondition;
  }

  isAcheivable(worldstate: actionstate): boolean {
    const arrayPreconditions = Object.keys(this.precondition);

    for (let i = 0; i < arrayPreconditions.length; i++) {
      const precon = arrayPreconditions[i];
      if (worldstate[precon] !== this.precondition[precon]) {
        return false;
      }
    }
    return true;
  }
}

export const action1 = new MyAction(
  "action1",
  1,
  {
    value1: 1,
    value2: 0,
    value3: 0,
  },
  {
    value1: 0,
    value2: 1,
    value3: 2,
  }
);

export const action2 = new MyAction(
  "action2",
  1,
  {
    value1: 0,
    value2: 0,
    value3: -1,
  },
  {
    value1: 1,
    value2: 1,
    value3: 2,
  }
);

export const action3 = new MyAction(
  "action3",
  1,
  {
    value1: 0,
    value2: 1,
    value3: 0,
  },
  {
    value1: 1,
    value2: 1,
    value3: 1,
  }
);

export const action4 = new MyAction(
  "action4",
  1,
  {
    value1: 0,
    value2: 0,
    value3: 2,
  },
  {
    value1: 0,
    value2: 1,
    value3: 2,
  }
);

export const action5 = new MyAction(
  "action5",
  2,
  {
    value1: 1,
    value2: 1,
    value3: -3,
  },
  {
    value1: 0,
    value2: 1,
    value3: 4,
  }
);
