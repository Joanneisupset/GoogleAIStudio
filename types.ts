
export enum CatType {
  LIHUA = '狸花猫',
  ORANGE = '橘猫'
}

export enum MissionType {
  DICE = 'dice',
  CHOICE = 'choice'
}

export enum GameStage {
  START = 'start',
  CHARACTER_SELECT = 'character_select',
  MISSION = 'mission',
  ENDING = 'ending'
}

export interface Mission {
  id: number;
  title: string;
  skill: string;
  difficulty: number;
  type: MissionType;
  description: string;
  successText: string;
  failureText: string;
  bonusAttribute: 'logic' | 'investigation' | 'charm' | 'empathy' | 'perception';
  options?: string[];
  correctOption?: number;
}

export interface GameState {
  catType: CatType | null;
  currentMissionIndex: number;
  results: boolean[];
  stage: GameStage;
}
