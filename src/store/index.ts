import create from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { produce } from 'immer';
import { v4 as uuidv4 } from 'uuid';
import { 
  RootState, 
  Message, 
  TreatmentDetails, 
  Clinic, 
  AppointmentDetails,
  UserInfo
} from '../types';
import { analyticsLogger, sessionManager, migrationManager } from '../middleware';

const initialState: RootState = {
  chat: {
    messages: [],
    pendingMessages: [],
    isTyping: false,
    undoStack: [],
    redoStack: [],
  },
  clinic: {
    selectedTreatment: null,
    filteredClinics: [],
    sortPreference: 'rating',
    searchRadius: 10,
  },
  booking: {
    selectedClinic: null,
    appointmentDetails: null,
    userInfo: null,
  },
  ui: {
    isLoading: {
      chat: false,
      clinics: false,
      booking: false,
    },
    errors: {},
    modals: {
      booking: false,
      userInfo: false,
      confirmation: false,
    },
  },
  version: 1,
};

const useStore = create()(
  devtools(
    persist(
      sessionManager(
        migrationManager(
          analyticsLogger((set, get) => ({
            ...initialState,

            // Chat actions
            addMessage: (message: Omit<Message, 'id' | 'timestamp'>) =>
              set(
                produce((state: RootState) => {
                  const newMessage = {
                    ...message,
                    id: uuidv4(),
                    timestamp: Date.now(),
                  };
                  state.chat.undoStack.push([...state.chat.messages]);
                  state.chat.messages.push(newMessage);
                  state.chat.redoStack = [];
                })
              ),

            undoMessage: () =>
              set(
                produce((state: RootState) => {
                  const previousMessages = state.chat.undoStack.pop();
                  if (previousMessages) {
                    state.chat.redoStack.push([...state.chat.messages]);
                    state.chat.messages = previousMessages;
                  }
                })
              ),

            redoMessage: () =>
              set(
                produce((state: RootState) => {
                  const nextMessages = state.chat.redoStack.pop();
                  if (nextMessages) {
                    state.chat.undoStack.push([...state.chat.messages]);
                    state.chat.messages = nextMessages;
                  }
                })
              ),

            setTyping: (isTyping: boolean) =>
              set(produce((state: RootState) => {
                state.chat.isTyping = isTyping;
              })),

            // Clinic actions
            setSelectedTreatment: (treatment: TreatmentDetails) =>
              set(produce((state: RootState) => {
                state.clinic.selectedTreatment = treatment;
              })),

            setFilteredClinics: (clinics: Clinic[]) =>
              set(produce((state: RootState) => {
                state.clinic.filteredClinics = clinics;
              })),

            setSortPreference: (preference: 'rating' | 'distance' | 'availability') =>
              set(produce((state: RootState) => {
                state.clinic.sortPreference = preference;
              })),

            // Booking actions
            setSelectedClinic: (clinic: Clinic | null) =>
              set(produce((state: RootState) => {
                state.booking.selectedClinic = clinic;
              })),

            setAppointmentDetails: (details: AppointmentDetails | null) =>
              set(produce((state: RootState) => {
                state.booking.appointmentDetails = details;
              })),

            setUserInfo: (info: UserInfo | null) =>
              set(produce((state: RootState) => {
                state.booking.userInfo = info;
              })),

            // UI actions
            setLoading: (key: keyof RootState['ui']['isLoading'], value: boolean) =>
              set(produce((state: RootState) => {
                state.ui.isLoading[key] = value;
              })),

            setError: (key: keyof RootState['ui']['errors'], error?: string) =>
              set(produce((state: RootState) => {
                if (error) {
                  state.ui.errors[key] = error;
                } else {
                  delete state.ui.errors[key];
                }
              })),

            setModalVisibility: (key: keyof RootState['ui']['modals'], visible: boolean) =>
              set(produce((state: RootState) => {
                state.ui.modals[key] = visible;
              })),

            // Reset actions
            resetChat: () =>
              set(produce((state: RootState) => {
                state.chat = initialState.chat;
              })),

            resetClinic: () =>
              set(produce((state: RootState) => {
                state.clinic = initialState.clinic;
              })),

            resetBooking: () =>
              set(produce((state: RootState) => {
                state.booking = initialState.booking;
              })),

            resetAll: () => set(initialState),
          }))
        )
      ),
      {
        name: 'clinic-store',
        version: 1,
        migrate: (persistedState: any, version: number) => {
          if (version === 0) {
            // Add migration logic here
            return {
              ...persistedState,
              version: 1,
            };
          }
          return persistedState;
        },
      }
    )
  )
);

export default useStore;