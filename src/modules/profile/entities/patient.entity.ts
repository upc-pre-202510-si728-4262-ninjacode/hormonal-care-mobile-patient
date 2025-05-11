import {ProfileEntity} from './profile.entity';

export interface PatientEntity extends ProfileEntity {
    id: number;
    typeOfBlood: string | null;
    personalHistory: string | null;
    familyHistory: string | null;
    patientRecordId: string;
    profileId: number;
    doctorId: number | null;
}