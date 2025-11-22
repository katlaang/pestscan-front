import * as React from 'react';

declare namespace ReactNative {
  type StyleProp<T> = T | T[] | null | undefined;
  interface ViewStyle { [key: string]: any }
  interface TextStyle { [key: string]: any }
  interface ImageStyle { [key: string]: any }

  const View: React.ComponentType<any>;
  const Text: React.ComponentType<any>;
  const ScrollView: React.ComponentType<any>;
  const TouchableOpacity: React.ComponentType<any>;
  const KeyboardAvoidingView: React.ComponentType<any>;
  const Platform: { OS: string; select: (spec: Record<string, any>) => any };
  const StyleSheet: {
    create<T extends { [key: string]: any }>(styles: T): T;
  };
}

declare module 'react-native' {
  export = ReactNative;
}
