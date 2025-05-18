export interface SignInRequest {
  username: string;
  password: string;
}

export interface SignUpRequest {
  username: string;
  password: string;
}

export interface SignInResponse {
  id: number;
  username: string;
  token: string;
  role: string;
}

export interface SignUpResponse {
  id: number;
  username: string;
  roles: string[];
}

export interface PatientProfileRequest {
  firstName: string;
  lastName: string;
  gender: string;
  phoneNumber: string;
  // image: string;
  birthday: string;
  userId: number;
  typeOfBlood: string;
  personalHistory: string;
  familyHistory: string;
  doctorId: number | null;
}

export interface PatientProfileResponse {
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