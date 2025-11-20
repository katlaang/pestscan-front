interface ErrorMessageProps {
    message: string;
    onRetry?: () => void;
  }
  
  export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
    return (
      <View style={errorStyles.container}>
        <Ionicons name="alert-circle" size={48} color={colors.error} />
        <Text style={errorStyles.message}>{message}</Text>
        {onRetry && (
          <Button mode="contained" onPress={onRetry} style={errorStyles.button}>
            Try Again
          </Button>
        )}
      </View>
    );
  };
  
  import { Ionicons } from '@expo/vector-icons';
  import { Button } from 'react-native-paper';
  
  const errorStyles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.xl,
    },
    message: {
      ...typography.body,
      color: colors.text,
      marginTop: spacing.md,
      marginBottom: spacing.lg,
      textAlign: 'center',
    },
    button: {
      marginTop: spacing.md,
    },
  });