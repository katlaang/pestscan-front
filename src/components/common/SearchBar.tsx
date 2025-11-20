interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    onClear?: () => void;
  }
  
  export const SearchBar: React.FC<SearchBarProps> = ({
    value,
    onChangeText,
    placeholder = 'Search...',
    onClear,
  }) => {
    return (
      <View style={searchStyles.container}>
        <Ionicons name="search" size={20} color={colors.textSecondary} style={searchStyles.icon} />
        <TextInput
          style={searchStyles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={onClear || (() => onChangeText(''))}>
            <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
    );
  };
  
  import { TextInput, TouchableOpacity } from 'react-native';
  
  const searchStyles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      marginBottom: spacing.md,
      ...shadows.sm,
    },
    icon: {
      marginRight: spacing.sm,
    },
    input: {
      flex: 1,
      ...typography.body,
      color: colors.text,
    },
  });
  
  import { borderRadius, shadows } from '../../theme/theme';