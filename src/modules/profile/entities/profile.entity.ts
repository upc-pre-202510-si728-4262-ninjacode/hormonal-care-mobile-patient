export interface ProfileEntity {
    id: number;
    fullName: string;
    gender: string;
    phoneNumber: string;
    image: string;
    birthday: string;
    userId: number;
  }

export interface FullDataProfileEntity {
    id: number;
    fullName: string;
    gender: string;
    phoneNumber: string;
    image: string;
    birthday: string;
    typeOfBlood: string | null;
    personalHistory: string | null;
    familyHistory: string | null;
    doctorId: number | null;
}