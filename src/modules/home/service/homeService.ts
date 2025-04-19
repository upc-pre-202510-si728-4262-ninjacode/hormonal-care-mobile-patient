import api from '../../../config/api';

const homeService = {
  getHomeData: async (): Promise<any[]> => {
    try {
      // Aquí podrías obtener datos reales de tu API
      // const { data } = await api.get('/api/v1/home-data');
      // return data;
      
      // Por ahora retornamos datos de ejemplo
      return Promise.resolve([
        { id: 1, title: 'Próxima cita', date: '2025-05-01', doctor: 'Dr. Smith' },
        { id: 2, title: 'Recordatorio medicación', date: '2025-04-20', medication: 'Medicamento X' },
      ]);
    } catch (error) {
      console.error('Error fetching home data:', error);
      throw error;
    }
  }
};

export default homeService;