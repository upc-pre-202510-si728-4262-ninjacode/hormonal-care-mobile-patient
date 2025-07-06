import { AppointmentResponse } from "../../appointments/entities/appointmentEntitie";
import { DoctorResponse } from "../../appointments/entities/doctorEntitie";
import { SearchInteractor } from "../interactors/searchInteractor";


export interface SearchAppointmentsListViewInterface {
    showLoading: () => void;
    hideLoading: () => void;
    showError: (message: string) => void;
    showAppointments: (appointments: AppointmentResponse[]) => void;
}

export interface SearchDoctorsViewInterface {
    showLoading: () => void;
    hideLoading: () => void;
    showError: (message: string) => void;
    showCurrentDoctor: (doctors: DoctorResponse[]) => void;
}

export class SearchListPresenter {
    private appointmentView: SearchAppointmentsListViewInterface | null = null;
    private doctorView: SearchDoctorsViewInterface | null = null;
    private interactor: SearchInteractor;

    constructor(interactor: SearchInteractor)
    {
        this.interactor = interactor;
    }

    attachAppointmentView(view: SearchAppointmentsListViewInterface) {
        this.appointmentView = view;
    }

    attachDoctorView(view: SearchDoctorsViewInterface) {
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

    async loadAllDoctors() {
        if (!this.doctorView) return;

        try {
            this.doctorView.showLoading();
            const doctors = await this.interactor.getAllDoctors();
            this.doctorView.showCurrentDoctor(doctors);
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