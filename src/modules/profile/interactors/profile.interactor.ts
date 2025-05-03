import { API_URL } from '@env'; // Importa la URL base desde el .env
import { ProfileEntity } from '../entities/profile.entity';

export class ProfileInteractor {
  private baseUrl = `${API_URL}/profile`; // Construye la URL base para el perfil

  async fetchProfile(userId: number): Promise<ProfileEntity> {
    try {
      const response = await fetch(`${this.baseUrl}/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      const data = await response.json();
      return data as ProfileEntity; // Asegúrate de que los datos coincidan con la entidad
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }
}