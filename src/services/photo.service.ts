// src/services/photo.service.ts

import { axiosInstance } from './api.client';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as ImagePicker from 'expo-image-picker';

export interface PhotoMetadata {
  id: string;
  fileName: string;
  fileSize: number;
  contentType: string;
  uploadedAt: string;
  uploadedBy: string;
  entityType: 'OBSERVATION' | 'SESSION' | 'FARM' | 'PROFILE';
  entityId: string;
  thumbnailUrl?: string;
  url: string;
}

export interface UploadPhotoRequest {
  uri: string; // Local file URI
  name: string;
  type: string;
  entityType: 'OBSERVATION' | 'SESSION' | 'FARM' | 'PROFILE';
  entityId: string;
  caption?: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

class PhotoService {
  /**
   * Upload a photo with progress tracking
   */
  async uploadPhoto(
    request: UploadPhotoRequest,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<PhotoMetadata> {
    const formData = new FormData();
    
    // Add file to form data (React Native style)
    formData.append('file', {
      uri: request.uri,
      name: request.name,
      type: request.type,
    } as any);
    
    formData.append('entityType', request.entityType);
    formData.append('entityId', request.entityId);
    
    if (request.caption) {
      formData.append('caption', request.caption);
    }

    const response = await axiosInstance.post<PhotoMetadata>('/photos/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress({
            loaded: progressEvent.loaded,
            total: progressEvent.total,
            percentage,
          });
        }
      },
    });

    return response.data;
  }

  /**
   * Upload multiple photos
   */
  async uploadPhotos(
    photos: Array<{ uri: string; name: string; type: string }>,
    entityType: 'OBSERVATION' | 'SESSION' | 'FARM' | 'PROFILE',
    entityId: string,
    onProgress?: (index: number, progress: UploadProgress) => void
  ): Promise<PhotoMetadata[]> {
    const uploadPromises = photos.map((photo, index) =>
      this.uploadPhoto(
        { 
          uri: photo.uri,
          name: photo.name,
          type: photo.type,
          entityType, 
          entityId 
        },
        onProgress ? (progress) => onProgress(index, progress) : undefined
      )
    );

    return Promise.all(uploadPromises);
  }

  /**
   * Get photos for an entity
   */
  async getPhotos(entityType: string, entityId: string): Promise<PhotoMetadata[]> {
    const response = await axiosInstance.get<PhotoMetadata[]>('/photos', {
      params: { entityType, entityId },
    });
    return response.data;
  }

  /**
   * Get a single photo by ID
   */
  async getPhoto(photoId: string): Promise<PhotoMetadata> {
    const response = await axiosInstance.get<PhotoMetadata>(`/photos/${photoId}`);
    return response.data;
  }

  /**
   * Delete a photo
   */
  async deletePhoto(photoId: string): Promise<void> {
    await axiosInstance.delete(`/photos/${photoId}`);
  }

  /**
   * Delete multiple photos
   */
  async deletePhotos(photoIds: string[]): Promise<void> {
    await axiosInstance.post('/photos/batch-delete', { photoIds });
  }

  /**
   * Update photo caption/metadata
   */
  async updatePhoto(
    photoId: string,
    data: { caption?: string; metadata?: Record<string, any> }
  ): Promise<PhotoMetadata> {
    const response = await axiosInstance.put<PhotoMetadata>(`/photos/${photoId}`, data);
    return response.data;
  }

  /**
   * Get photo URL for display
   */
  getPhotoUrl(photoId: string): string {
    return `${axiosInstance.defaults.baseURL}/photos/${photoId}/view`;
  }

  /**
   * Get thumbnail URL
   */
  getThumbnailUrl(photoId: string): string {
    return `${axiosInstance.defaults.baseURL}/photos/${photoId}/thumbnail`;
  }

  /**
   * Download photo (React Native)
   */
  async downloadPhoto(photoId: string, filename?: string): Promise<string> {
    const downloadUrl = `${axiosInstance.defaults.baseURL}/photos/${photoId}/download`;
    const fileUri = `${FileSystem.documentDirectory}${filename || `photo-${photoId}.jpg`}`;

    const downloadResumable = FileSystem.createDownloadResumable(
      downloadUrl,
      fileUri
    );

    const result = await downloadResumable.downloadAsync();
    
    if (!result) {
      throw new Error('Download failed');
    }

    // Share the file
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(result.uri);
    }

    return result.uri;
  }

  /**
   * Batch download photos as ZIP (React Native)
   */
  async downloadPhotosAsZip(photoIds: string[], zipName?: string): Promise<string> {
    const downloadUrl = `${axiosInstance.defaults.baseURL}/photos/batch-download`;
    const fileUri = `${FileSystem.documentDirectory}${zipName || `photos-${Date.now()}.zip`}`;

    // Send POST request to get ZIP
    const response = await axiosInstance.post(
      '/photos/batch-download',
      { photoIds },
      { responseType: 'blob' }
    );

    // For React Native, we'll need to handle this differently
    // This is a simplified version - you may need to adjust based on your backend
    const downloadResumable = FileSystem.createDownloadResumable(
      downloadUrl,
      fileUri,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
      undefined,
      JSON.stringify({ photoIds })
    );

    const result = await downloadResumable.downloadAsync();
    
    if (!result) {
      throw new Error('Download failed');
    }

    // Share the ZIP file
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(result.uri);
    }

    return result.uri;
  }

  /**
   * Take photo using device camera
   */
  async takePhoto(): Promise<{ uri: string; name: string; type: string } | null> {
    // Request camera permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Camera permission not granted');
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      return {
        uri: asset.uri,
        name: `photo-${Date.now()}.jpg`,
        type: 'image/jpeg',
      };
    }

    return null;
  }

  /**
   * Pick photo from gallery
   */
  async pickPhoto(): Promise<{ uri: string; name: string; type: string } | null> {
    // Request media library permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Media library permission not granted');
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      return {
        uri: asset.uri,
        name: `photo-${Date.now()}.jpg`,
        type: 'image/jpeg',
      };
    }

    return null;
  }

  /**
   * Pick multiple photos from gallery
   */
  async pickPhotos(): Promise<Array<{ uri: string; name: string; type: string }>> {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Media library permission not granted');
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });
  
    if (!result.canceled) {
      return result.assets.map((asset, index) => ({
        uri: asset.uri,
        name: `photo-${Date.now()}-${index}.jpg`,
        type: 'image/jpeg',
      }));
    }
  
    return [];
  }
}

export const photoService = new PhotoService();