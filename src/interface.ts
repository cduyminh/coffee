export interface ICurrentResponses {
  thought: string;
  move1: string;
  move2: string;
  move3: string;
  move4: string;
  move5: string;
  response: string;
  currentOrder: IOrder[];
  done: boolean;
}

export interface IOrder {
  drink: string;
  modifiers: IMod[];
}

export interface IMod {
  mod: string;
}
