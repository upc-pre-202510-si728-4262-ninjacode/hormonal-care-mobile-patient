
export interface DoctorResponse {
    id: number;
    fullName: string;
    image: string;
    gender: string;
    phoneNumber: string;
    birthday: string;
    professionalIdentificationNumber: number;
    subSpecialty: string;
    profileId: number;
    doctorRecordId: string;
}

export interface PatientProfile {
    id : number;
    typeOfBlood : string;
    personalHistory : string;
    familyHistory : string;
    patientRecordId : string;
    profileId : number;
    doctorId : number;
}
