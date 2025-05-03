import { Appointment } from '../entity/appointment.entity';
import { AppointmentsInteractor } from '../interactor/appointments.interactor';

export const AppointmentsPresenter = {
  async loadAppointments(): Promise<Appointment[]> {
    const appointments = await AppointmentsInteractor.fetchAppointments();
    return appointments.map((appointment) => ({
      ...appointment,
      eventDate: appointment.eventDate,
    }));
  },

  async bookAppointment(data: Omit<Appointment, 'id'>): Promise<Appointment> {
    const newAppointment = await AppointmentsInteractor.createAppointment(data);
    return newAppointment;
  },

  async editAppointment(id: number, data: Partial<Appointment>): Promise<Appointment> {
    return await AppointmentsInteractor.updateAppointment(id, data);
  },

  async removeAppointment(id: number): Promise<void> {
    await AppointmentsInteractor.deleteAppointment(id);
  }
};
