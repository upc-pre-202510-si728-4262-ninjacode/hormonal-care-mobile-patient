import {ProfileEntity} from './profile.entity';

export interface PatientEntity extends ProfileEntity {
typeOfBlood: string| null;
personalHistory: string| null;
familyHistory: string| null;
doctorId: number | null;
}