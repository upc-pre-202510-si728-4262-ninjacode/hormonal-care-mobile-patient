export interface MessageResponse {
    id: string;
    participants: Participant[];
    lastMessageContent: string;
    lastMessageDate: string;
    createdAt: string;
}

interface Participant {
    id: number;
    fullName: string;
    imageUrl: string;
}