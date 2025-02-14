export type Message = {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: number;
};

export type TreatmentDetails = {
  treatmentType: string;
  details: {
    duration: string;
    severity: number;
    area: string;
  };
};

export type Clinic = {
  id: string;
  name: string;
  rating: number;
  services: string[];
  location: {
    lat: number;
    lng: number;
  };
  score?: number;
};

export type AppointmentDetails = {
  date: string;
  time: string;
  duration: number;
  notes?: string;
};

export type UserInfo = {
  name: string;
  phone: string;
  email: string;
  age?: number;
  gender?: string;
};

export type SortPreference = 'rating' | 'distance' | 'availability';

export type ChatState = {
  messages: Message[];
  pendingMessages: Message[];
  isTyping: boolean;
  undoStack: Message[][];
  redoStack: Message[][];
};

export type ClinicState = {
  selectedTreatment: TreatmentDetails | null;
  filteredClinics: Clinic[];
  sortPreference: SortPreference;
  searchRadius: number;
};

export type BookingState = {
  selectedClinic: Clinic | null;
  appointmentDetails: AppointmentDetails | null;
  userInfo: UserInfo | null;
};

export type UIState = {
  isLoading: {
    chat: boolean;
    clinics: boolean;
    booking: boolean;
  };
  errors: {
    chat?: string;
    clinics?: string;
    booking?: string;
  };
  modals: {
    booking: boolean;
    userInfo: boolean;
    confirmation: boolean;
  };
};

export type RootState = {
  chat: ChatState;
  clinic: ClinicState;
  booking: BookingState;
  ui: UIState;
  version: number;
};