export interface Appointment {
    id: number;
    eventDate: string; // yyyy-mm-dd
    startTime: string;
    endTime: string;
    title: string;
    description: string;
    doctorId: number;
    patientId: number;
    color: string;
  }