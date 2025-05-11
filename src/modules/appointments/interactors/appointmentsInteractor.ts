import { getUserData } from "../../../common/storage/tokenStorage";
import { apiClient } from "../../../config/api";
import { AppointmentResponse, AppointmentState } from "../entities/appointmentEntitie";
import { DoctorResponse, PatientProfile } from "../entities/doctorEntitie";


export class AppointmentsInteractor 
{
    defineAppointmentState(appointment: AppointmentResponse): AppointmentResponse {
        const currentDate = new Date();
        const appointmentStartTime = new Date(`${appointment.eventDate}T${appointment.startTime}`);
        const appointmentEndTime = new Date(`${appointment.eventDate}T${appointment.endTime}`);
        if (appointmentEndTime < currentDate) {
            appointment.state = AppointmentState.PAST;
        }
        else if (appointmentStartTime <= currentDate && appointmentEndTime >= currentDate) {
            appointment.state = AppointmentState.ONGOING;
        }
        else {
            appointment.state = AppointmentState.SCHEDULED;
        }
        return appointment;
    }

    async getAllAppointments(): Promise<AppointmentResponse[]> {
        try {
            const user = await getUserData();
            const response = await apiClient.get<AppointmentResponse[]>(`/api/v1/medicalAppointment/medicalAppointments/patient/${user?.id}`);

            const appointmentsWithDoctorInfo = await Promise.all(
                response.data.map(async (appointment) => {
                    const state = this.defineAppointmentState(appointment);
                    const doctorResponse = await apiClient.get<DoctorResponse>(`/api/v1/doctor/doctor/${appointment.doctorId}`);
                    return {
                        ...appointment,
                        doctorFullName: doctorResponse.data.fullName,
                        doctorSpecialty: doctorResponse.data.subSpecialty,
                        state: state.state,
                        stateColor: state.state === AppointmentState.PAST ? '#FFB3B3' : state.state === AppointmentState.ONGOING ? '#B3FFB3' : '#B3C6FF'
                    };
                })
            );

            return appointmentsWithDoctorInfo;
        }
        catch (error) {
            console.error('Error fetching appointments:', error);
            throw error;
        }   
    }

    async getCurrentDoctor(): Promise<DoctorResponse> {
        try {
            const user = await getUserData();
            const patientResponse = await apiClient.get<PatientProfile>(`/api/v1/medical-record/patient/profile/${user?.id}`);
            const doctorResponse = await apiClient.get<DoctorResponse>(`/api/v1/doctor/doctor/${patientResponse.data.doctorId}`);
            return doctorResponse.data;
        }
        catch (error) {
            console.error('Error fetching current doctor:', error);
            throw error;
        }
    }
}