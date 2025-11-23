// src/constants/config.ts

export const config = {
    // API Configuration
    api: {
      baseUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080/api',
      timeout: 30000,
      retryAttempts: 3,
    },
  
    // App Configuration
    app: {
      name: 'PestScan',
      version: '1.0.0',
      buildNumber: 1,
    },
  
    // Pagination
    pagination: {
      defaultPageSize: 20,
      maxPageSize: 100,
    },
  
    // Session Configuration
    session: {
      defaultSpotChecksPerBench: 5,
      defaultBenchesPerBay: 4,
      defaultBayCount: 10,
      maxObservationsPerSession: 1000,
    },
  
    // File Upload
    upload: {
      maxFileSizeMB: 10,
      allowedImageTypes: ['image/jpeg', 'image/png', 'image/jpg'],
      allowedDocumentTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    },
  
    // Cache Configuration
    cache: {
      ttl: 300000, // 5 minutes in milliseconds
      maxSize: 100,
    },
  
    // Notification Configuration
    notifications: {
      enabled: true,
      soundEnabled: true,
      vibrationEnabled: true,
    },
  
    // Map Configuration
    map: {
      defaultLatitude: 0,
      defaultLongitude: 0,
      defaultZoom: 15,
    },
  
    // Chart Configuration
    charts: {
      defaultHeight: 220,
      animationDuration: 300,
      colors: {
        primary: '#4CAF50',
        secondary: '#2196F3',
        tertiary: '#FF9800',
        quaternary: '#9C27B0',
      },
    },
  
    // Date Format
    dateFormat: {
      display: 'MMM DD, YYYY',
      api: 'YYYY-MM-DD',
      displayWithTime: 'MMM DD, YYYY HH:mm',
      time: 'HH:mm',
    },
  
    // Heatmap Configuration
    heatmap: {
      cellSize: 40,
      minCellSize: 30,
      maxCellSize: 60,
    },
  
    // Search Configuration
    search: {
      debounceMs: 300,
      minCharacters: 2,
    },
  
    // Feature Flags
    features: {
      enableAnalytics: true,
      enableHeatmaps: true,
      enableNotifications: true,
      enableOfflineMode: false,
      enableBiometrics: false,
    },
  } as const;
  
  export type Config = typeof config;