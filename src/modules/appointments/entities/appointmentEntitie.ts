export interface AppointmentResponse {
    id: number;
    eventDate: string;
    startTime: string;
    endTime: string;
    title: string;
    description: string;
    doctorId: number;
    patientId: number;
    color: string;
    doctorFullName: string;
    doctorSpecialty: string;
    state : AppointmentState;
    stateColor: string;
}

export enum AppointmentState {
    ONGOING = 'ONGOING',
    SCHEDULED = 'SCHEDULED',
    PAST = 'PAST',
}