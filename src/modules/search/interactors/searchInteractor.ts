import { getUserData } from "../../../common/storage/tokenStorage";
import { apiClient } from "../../../config/api";
import { AppointmentResponse, AppointmentState } from "../../appointments/entities/appointmentEntitie";
import { DoctorResponse, PatientProfile } from "../../appointments/entities/doctorEntitie";
import { AppointmentsInteractor } from "../../appointments/interactors/appointmentsInteractor";


export class SearchInteractor 
{
    async getAllAppointments(): Promise<AppointmentResponse[]> {
        const appointmentFunction = new AppointmentsInteractor(); 
        try {
            const user = await getUserData();
            const response = await apiClient.get<AppointmentResponse[]>(`/api/v1/medicalAppointment/medicalAppointments/patient/${user?.id}`);

            const appointmentsWithDoctorInfo = await Promise.all(
                response.data.map(async (appointment) => {
                    const state = appointmentFunction.defineAppointmentState(appointment);
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

    async getAllDoctors(): Promise<DoctorResponse[]> {
        try {
            const doctorResponse = await apiClient.get<DoctorResponse[]>(`/api/v1/doctor/doctor`);
            return doctorResponse.data;
        }
        catch (error) {
            console.error('Error fetching all doctors:', error);
            throw error;
        }
    }
}