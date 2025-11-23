import { axiosInstance } from './api.client';
import {
  ScoutingSessionDetailDto,
  CreateScoutingSessionRequest,
  UpsertObservationRequest,
  ScoutingObservationDto,
  CompleteSessionRequest,
} from '../types/api.types';

class ScoutingService {
  async getSessions(farmId: string): Promise<ScoutingSessionDetailDto[]> {
    const response = await axiosInstance.get<ScoutingSessionDetailDto[]>(
      '/scouting/sessions',
      { params: { farmId } }
    );
    return response.data;
  }

  async getSession(sessionId: string): Promise<ScoutingSessionDetailDto> {
    const response = await axiosInstance.get<ScoutingSessionDetailDto>(
      `/scouting/sessions/${sessionId}`
    );
    return response.data;
  }

  async createSession(data: CreateScoutingSessionRequest): Promise<ScoutingSessionDetailDto> {
    const response = await axiosInstance.post<ScoutingSessionDetailDto>(
      '/scouting/sessions',
      data
    );
    return response.data;
  }

  async updateSession(
    sessionId: string,
    data: Partial<CreateScoutingSessionRequest>
  ): Promise<ScoutingSessionDetailDto> {
    const response = await axiosInstance.put<ScoutingSessionDetailDto>(
      `/scouting/sessions/${sessionId}`,
      data
    );
    return response.data;
  }

  async startSession(sessionId: string): Promise<ScoutingSessionDetailDto> {
    const response = await axiosInstance.post<ScoutingSessionDetailDto>(
      `/scouting/sessions/${sessionId}/start`
    );
    return response.data;
  }

  async completeSession(
    sessionId: string,
    data: CompleteSessionRequest
  ): Promise<ScoutingSessionDetailDto> {
    const response = await axiosInstance.post<ScoutingSessionDetailDto>(
      `/scouting/sessions/${sessionId}/complete`,
      data
    );
    return response.data;
  }

  async reopenSession(sessionId: string): Promise<ScoutingSessionDetailDto> {
    const response = await axiosInstance.post<ScoutingSessionDetailDto>(
      `/scouting/sessions/${sessionId}/reopen`
    );
    return response.data;
  }

  async upsertObservation(
    sessionId: string,
    data: UpsertObservationRequest
  ): Promise<ScoutingObservationDto> {
    const response = await axiosInstance.post<ScoutingObservationDto>(
      `/scouting/sessions/${sessionId}/observations`,
      data
    );
    return response.data;
  }

  async deleteObservation(sessionId: string, observationId: string): Promise<void> {
    await axiosInstance.delete(`/scouting/sessions/${sessionId}/observations/${observationId}`);
  }
}

export const scoutingService = new ScoutingService();