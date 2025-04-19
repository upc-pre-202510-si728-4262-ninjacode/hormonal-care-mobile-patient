export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  id: number;
  username: string;
  token: string;
  role: string;
}

export interface RegisterResponse {
  id: number;
  username: string;
  roles: string[];
}

export interface PatientProfileRequest {
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

export interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: number | null;
    username: string | null;
    role: string | null;
  };
  loading: boolean;
  error: string | null;
  needsProfile: boolean;
}