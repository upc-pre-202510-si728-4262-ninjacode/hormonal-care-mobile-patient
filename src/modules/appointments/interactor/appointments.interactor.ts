import axios from 'axios';
import { Appointment } from '../entity/appointment.entity';

const API_URL = 'https://tu-api.com/api/v1/medicalAppointment';

export const AppointmentsInteractor = {
  async fetchAppointments(): Promise<Appointment[]> {
    const response = await axios.get<Appointment[]>(`${API_URL}`);
    return response.data;
  },

  async fetchAppointment(id: number): Promise<Appointment> {
    const response = await axios.get<Appointment>(`${API_URL}/${id}`);
    return response.data;
  },

  async createAppointment(data: Omit<Appointment, 'id'>): Promise<Appointment> {
    const response = await axios.post<Appointment>(`${API_URL}`, data);
    return response.data;
  },

  async updateAppointment(id: number, data: Partial<Appointment>): Promise<Appointment> {
    const response = await axios.put<Appointment>(`${API_URL}/${id}`, data);
    return response.data;
  },

  async deleteAppointment(id: number): Promise<void> {
    await axios.delete(`${API_URL}/${id}`);
  },
};
