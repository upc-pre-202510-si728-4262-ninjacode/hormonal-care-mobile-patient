export interface CreateUserRequest {
  name: string;
  age: number;
  gender: string;
}

export interface CreateUserResponse {
  user_id: string;
  message: string;
}

export interface ChatAnalysisRequest {
  user_id: string;
  glucose?: number;
  cholesterol?: number;
  ldl_cholesterol?: number;
  hdl_cholesterol?: number;
  triglycerides?: number;
  hemoglobin?: number;
  hematocrit?: number;
  white_blood_cells?: number;
  red_blood_cells?: number;
  platelets?: number;
  creatinine?: number;
  urea?: number;
  test_date: string;
}

export interface ChatAnalysisResponse {
  success: boolean;
  message: string;
  data: {
    ai_explanation: string;
    analysis: {
      overall_risk: string;
      glucose_status: string;
      cholesterol_status: string;
      kidney_function_status: string;
      blood_count_status: string;
      recommendations: Array<{
        type: string;
        title: string;
        description: string;
        priority: number;
      }>;
      needs_doctor_consultation: boolean;
      risk_factors: string[];
    };
    blood_test_id: string;
    conversation_id: string;
  };
}

export interface ChatMessageResponse {
  success: boolean;
  message: string | null;
  data: {
    user_message: string;
    assistant_response: string;
    timestamp: string;
  };
}

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface UserAIData {
  user_id: string;
  created_at: string;
}
