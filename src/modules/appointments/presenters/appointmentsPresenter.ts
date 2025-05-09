import { AppointmentResponse } from "../entities/appointmentEntitie";
import { DoctorResponse } from "../entities/doctorEntitie";
import { AppointmentsInteractor } from "../interactors/appointmentsInteractor";


export interface AppointmentsListViewInterface {
    showLoading: () => void;
    hideLoading: () => void;
    showError: (message: string) => void;
    showAppointments: (appointments: AppointmentResponse[]) => void;
}

export interface DoctorViewInterface {
    showLoading: () => void;
    hideLoading: () => void;
    showError: (message: string) => void;
    showCurrentDoctor: (doctor: DoctorResponse) => void;
}

export class AppointmentsListPresenter {
    private appointmentView: AppointmentsListViewInterface | null = null;
    private doctorView: DoctorViewInterface | null = null;
    private interactor: AppointmentsInteractor;

    constructor(interactor: AppointmentsInteractor)
    {
        this.interactor = interactor;
    }

    attachAppointmentView(view: AppointmentsListViewInterface) {
        this.appointmentView = view;
    }

    attachDoctorView(view: DoctorViewInterface) {
        this.doctorView = view;
    }

    async loadAppointments() {
        if (!this.appointmentView) return;

        try {
            this.appointmentView.showLoading();
            const appointments = await this.interactor.getAllAppointments();
            this.appointmentView.showAppointments(appointments);
        } catch (error) {
            console.error('Error loading appointments:', error);
            this.appointmentView.showError('Failed to load appointments');
        } finally {
            setTimeout(() => {
                this.appointmentView?.hideLoading();
            }, 1000);
        }
    }

    async loadCurrentDoctor() {
        if (!this.doctorView) return;

        try {
            this.doctorView.showLoading();
            const doctor = await this.interactor.getCurrentDoctor();
            this.doctorView.showCurrentDoctor(doctor);
        } catch (error) {
            console.error('Error loading current doctor:', error);
            this.doctorView.showError('Failed to load current doctor');
        } finally {
            setTimeout(() => {
                this.doctorView?.hideLoading();
            }, 1000);
        }
    }
}