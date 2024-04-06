type actionstate = Record<string, any>;

export type effectCallback = (worldstate: actionstate, agentState?: actionstate) => void;
export type preconditionCallback = (worldstate: actionstate, agentState?: actionstate) => boolean;

export class MyAction {
  name: string;
  cost: number;
  effect: effectCallback;
  precondition: preconditionCallback;
  constructor(name: string, cost: number, effect: effectCallback, precondition: preconditionCallback) {
    this.name = name;
    this.cost = cost;
    this.effect = effect;
    this.precondition = precondition;
  }

  isAcheivable(worldstate: actionstate): boolean {
    return this.precondition(worldstate);
  }
}

export const action1 = new MyAction(
  "action1",
  1,
  (s: actionstate) => {
    s.value1 = s.value1 + 1;
  },

  (s: actionstate) => {
    console.log(s);

    return s.value1 == 0 && s.value2 == 1 && s.value3 == 2 && s.value4;
  }
);

export const action2 = new MyAction(
  "action2",
  1,

  (s: actionstate) => {
    s.value3 = s.value3 - 1;
  },
  (s: actionstate) => {
    return s.value1 == 1 && s.value2 == 1 && s.value3 == 2 && s.value4;
  }
);

export const action3 = new MyAction(
  "action3",
  1,

  (s: actionstate) => {
    s.value2 = s.value2 + 1;
  },
  (s: actionstate) => {
    return s.value1 == 1 && s.value2 == 1 && s.value3 == 1 && s.value4;
  }
);

export const action4 = new MyAction(
  "action4",
  1,
  (s: actionstate) => {
    s.value3 = s.value3 + 2;
  },
  (s: actionstate) => {
    return s.value1 == 0 && s.value2 == 1 && s.value3 == 2 && s.value4;
  }
);

export const action5 = new MyAction(
  "action5",
  4,
  (s: actionstate) => {
    s.value2 = s.value2 + 1;
    s.value3 = s.value3 - 3;
  },
  (s: actionstate) => {
    return s.value1 == 1 && s.value2 == 1 && s.value3 == 4 && s.value4;
  }
);

export const action6 = new MyAction(
  "action6",
  1,
  (s: actionstate) => {
    console.log("s", structuredClone(s));

    s.value1 = s.value1 - 1;
    s.value2 = s.value2 - 1;
    s.value3 = s.value3 - 4;
    console.log("s", structuredClone(s));
  },
  (s: actionstate) => {
    return s.value1 == 0 && s.value2 == 1 && s.value3 == 2 && s.value4;
  }
);
