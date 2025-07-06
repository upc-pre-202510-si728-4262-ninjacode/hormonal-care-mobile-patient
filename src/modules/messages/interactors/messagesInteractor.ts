import { getUserData } from "../../../common/storage/tokenStorage";
import { apiClient } from "../../../config/api";
import { ProfileInteractor } from "../../profile/interactors/profile.interactor";
import { MessageResponse } from "../entities/messageEntitie";



export class MessagesInteractor {
    async getPreviewMessages() : Promise<MessageResponse[]>{
        try {
            const user = await getUserData();
        if (!user) return [];

        const profileInteractor = new ProfileInteractor();
        const profile = await profileInteractor.fetchProfile(user.id);
        const response = await apiClient.get<MessageResponse[]>(`/api/v1/message/message/preview/${profile.id}`);
        
        return response.data as MessageResponse[];
        
        } catch (error) {
            console.error('Error fetching preview messages:', error);
            throw error;
        }
    }
}