export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

export interface User {
  id?: number;
  name: string;
  gender: Gender;
}