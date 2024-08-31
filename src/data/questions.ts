export type ColorQuestion = {
  r: number;
  g: number;
  b: number;
  ans: string;
};

export const questions: ColorQuestion[] = [
  {r: 255, g: 0, b: 0, ans: '赤'},
  {r: 0, g: 255, b: 0, ans: '緑'},
  {r: 0, g: 0, b: 255, ans: '青'},
  // 他の問題を追加
];
