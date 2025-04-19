export interface ProfileData {
  id: number;
  firstName: string;
  lastName: string;
  gender: string;
  phoneNumber: string;
  image: string;
  birthday: string;
  userId: number;
  typeOfBlood: string;
  personalHistory: string;
  familyHistory: string;
  doctorId: number | null;
}

export interface ProfileState {
  loading: boolean;
  error: string | null;
  profile: ProfileData | null;
}