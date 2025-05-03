import { apiClient } from '../../../config/api';
import { MedicalRecord } from '../entity/record.entity';

export const getMedicalRecordById = async (medicalRecordId: number): Promise<MedicalRecord> => {
    try {
      const response = await apiClient.get<MedicalRecord>(`/api/v1/medicalRecords/${medicalRecordId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching medical record:', error);
      throw error;
    }
  };