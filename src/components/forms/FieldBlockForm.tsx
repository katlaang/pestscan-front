// src/components/forms/FieldBlockForm.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { CreateFieldBlockRequest, FieldBlockDto } from '../../types/api.types';
import { colors, spacing, typography, borderRadius } from '../../theme/theme';

interface FieldBlockFormProps {
  initialData?: Partial<FieldBlockDto>;
  onSubmit: (data: CreateFieldBlockRequest) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const FieldBlockForm: React.FC<FieldBlockFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    bayCount: initialData?.bayCount?.toString() || '',
    spotChecksPerBay: initialData?.spotChecksPerBay?.toString() || '',
    active: initialData?.active ?? true,
  });

  const [bayTags, setBayTags] = useState<string[]>(initialData?.bayTags || []);
  const [newBayTag, setNewBayTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addBayTag = () => {
    const tag = newBayTag.trim();
    if (tag && !bayTags.includes(tag)) {
      setBayTags([...bayTags, tag]);
      setNewBayTag('');
    }
  };

  const removeBayTag = (tag: string) => {
    setBayTags(bayTags.filter(t => t !== tag));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Field block name is required';
    }

    if (!formData.bayCount) {
      newErrors.bayCount = 'Bay count is required';
    } else if (isNaN(Number(formData.bayCount)) || Number(formData.bayCount) <= 0) {
      newErrors.bayCount = 'Must be a positive number';
    }

    if (!formData.spotChecksPerBay) {
      newErrors.spotChecksPerBay = 'Spot checks per bay is required';
    } else if (isNaN(Number(formData.spotChecksPerBay)) || Number(formData.spotChecksPerBay) <= 0) {
      newErrors.spotChecksPerBay = 'Must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const submitData: CreateFieldBlockRequest = {
      name: formData.name.trim(),
      bayCount: Number(formData.bayCount),
      spotChecksPerBay: Number(formData.spotChecksPerBay),
      bayTags: bayTags.length > 0 ? bayTags : undefined,
      active: formData.active,
    };

    onSubmit(submitData);
  };

  const totalSpotChecks = (Number(formData.bayCount) || 0) * (Number(formData.spotChecksPerBay) || 0);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Input
          label="Field Block Name"
          value={formData.name}
          onChangeText={(value) => updateField('name', value)}
          placeholder="Enter field block name"
          error={errors.name}
          leftIcon="leaf"
          required
        />
      </View>

      <View style={styles.section}>
        <Input
          label="Bay Count"
          value={formData.bayCount}
          onChangeText={(value) => updateField('bayCount', value)}
          placeholder="0"
          keyboardType="number-pad"
          error={errors.bayCount}
          leftIcon="grid"
          required
        />

        <Input
          label="Spot Checks per Bay"
          value={formData.spotChecksPerBay}
          onChangeText={(value) => updateField('spotChecksPerBay', value)}
          placeholder="0"
          keyboardType="number-pad"
          error={errors.spotChecksPerBay}
          leftIcon="checkmark-circle"
          required
        />

        {(formData.bayCount || formData.spotChecksPerBay) && (
          <View style={styles.summary}>
            <Text style={styles.summaryTitle}>Calculated Total</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Spot Checks:</Text>
              <Text style={styles.summaryValue}>{totalSpotChecks}</Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bay Tags</Text>
        <View style={styles.tagInputContainer}>
          <Input
            value={newBayTag}
            onChangeText={setNewBayTag}
            placeholder="Enter bay tag"
            containerStyle={styles.tagInput}
            leftIcon="pricetag"
          />
          <TouchableOpacity style={styles.addTagButton} onPress={addBayTag} activeOpacity={0.8}>
            <Ionicons name="add" size={20} color={colors.surface} />
          </TouchableOpacity>
        </View>

        {bayTags.length > 0 && (
          <View style={styles.tagsContainer}>
            {bayTags.map(tag => (
              <TouchableOpacity key={tag} onPress={() => removeBayTag(tag)} activeOpacity={0.7}>
                <Badge label={tag} icon="close" variant="neutral" style={styles.tagBadge} />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View style={styles.buttonRow}>
        <Button title="Cancel" onPress={onCancel} variant="outline" fullWidth style={styles.button} />
        <Button
          title={loading ? 'Saving...' : 'Save Field Block'}
          onPress={handleSubmit}
          loading={loading}
          fullWidth
          style={styles.button}
          icon="save"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  section: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  sectionTitle: {
    ...typography.bodyBold,
    fontSize: 16,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  summary: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
  },
  summaryTitle: {
    ...typography.bodyBold,
    marginBottom: spacing.sm,
    color: colors.text,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    color: colors.textSecondary,
  },
  summaryValue: {
    ...typography.bodyBold,
    color: colors.text,
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  tagInput: {
    flex: 1,
  },
  addTagButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  tagBadge: {
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  button: {
    flex: 1,
    borderRadius: borderRadius.md,
  },
});
