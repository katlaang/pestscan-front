import { axiosInstance } from './api.client';
import {
  HeatmapResponse,
  FarmWeeklyAnalyticsDto,
} from '../types/api.types';

class AnalyticsService {
  async getHeatmap(farmId: string, week: number, year: number): Promise<HeatmapResponse> {
    const response = await axiosInstance.get<HeatmapResponse>(
      `/farms/${farmId}/heatmap`,
      { params: { week, year } }
    );
    return response.data;
  }

  async getWeeklyAnalytics(
    farmId: string,
    week: number,
    year: number
  ): Promise<FarmWeeklyAnalyticsDto> {
    const response = await axiosInstance.get<FarmWeeklyAnalyticsDto>(
      `/analytics/farms/${farmId}/weekly`,
      { params: { week, year } }
    );
    return response.data;
  }
}

export const analyticsService = new AnalyticsService();