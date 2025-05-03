// Este archivo manejaría navegación si quieres ir a otros módulos
export const AppointmentsRouter = {
    goToAppointmentDetail: (navigation: any, appointmentId: number) => {
      navigation.navigate('AppointmentDetail', { appointmentId });
    },
  
    goToNewAppointment: (navigation: any) => {
      navigation.navigate('NewAppointment');
    },
  };
  