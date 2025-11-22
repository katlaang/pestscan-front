// src/components/forms/FarmForm.tsx

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import {
  CreateFarmRequest,
  SubscriptionStatus,
  SubscriptionTier,
  FarmStructureType,
  FarmResponse,
} from '../../types/api.types';
import { colors, spacing, typography, borderRadius } from '../../theme/theme';

interface FarmFormProps {
  initialData?: Partial<FarmResponse>;
  onSubmit: (data: CreateFarmRequest) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const FarmForm: React.FC<FarmFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    externalId: initialData?.externalId || '',
    address: initialData?.address || '',
    city: initialData?.city || '',
    province: initialData?.province || '',
    postalCode: initialData?.postalCode || '',
    country: initialData?.country || '',
    contactName: initialData?.contactName || '',
    contactEmail: initialData?.contactEmail || '',
    contactPhone: initialData?.contactPhone || '',
    billingEmail: initialData?.billingEmail || '',
    licensedAreaHectares: initialData?.licensedAreaHectares?.toString() || '',
    licensedUnitQuota: initialData?.licensedUnitQuota?.toString() || '',
    quotaDiscountPercentage: initialData?.quotaDiscountPercentage?.toString() || '',
    defaultBayCount: initialData?.defaultBayCount?.toString() || '',
    defaultBenchesPerBay: initialData?.defaultBenchesPerBay?.toString() || '',
    defaultSpotChecksPerBench: initialData?.defaultSpotChecksPerBench?.toString() || '',
    timezone: initialData?.timezone || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Farm name is required';
    }

    if (!formData.licensedAreaHectares) {
      newErrors.licensedAreaHectares = 'Licensed area is required';
    } else if (isNaN(Number(formData.licensedAreaHectares)) || Number(formData.licensedAreaHectares) <= 0) {
      newErrors.licensedAreaHectares = 'Must be a positive number';
    }

    if (formData.contactEmail && !/^\S+@\S+\.\S+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Invalid email format';
    }

    if (formData.billingEmail && !/^\S+@\S+\.\S+$/.test(formData.billingEmail)) {
      newErrors.billingEmail = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const submitData: CreateFarmRequest = {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      externalId: formData.externalId.trim() || undefined,
      address: formData.address.trim() || undefined,
      city: formData.city.trim() || undefined,
      province: formData.province.trim() || undefined,
      postalCode: formData.postalCode.trim() || undefined,
      country: formData.country.trim() || undefined,
      ownerId: initialData?.ownerId || '',
      scoutId: initialData?.scoutId,
      contactName: formData.contactName.trim() || undefined,
      contactEmail: formData.contactEmail.trim() || undefined,
      contactPhone: formData.contactPhone.trim() || undefined,
      subscriptionStatus: initialData?.subscriptionStatus || SubscriptionStatus.ACTIVE,
      subscriptionTier: initialData?.subscriptionTier || SubscriptionTier.BASIC,
      billingEmail: formData.billingEmail.trim() || undefined,
      licensedAreaHectares: Number(formData.licensedAreaHectares),
      licensedUnitQuota: formData.licensedUnitQuota ? Number(formData.licensedUnitQuota) : undefined,
      quotaDiscountPercentage: formData.quotaDiscountPercentage
        ? Number(formData.quotaDiscountPercentage)
        : undefined,
      structureType: initialData?.structureType || FarmStructureType.GREENHOUSE,
      defaultBayCount: formData.defaultBayCount ? Number(formData.defaultBayCount) : undefined,
      defaultBenchesPerBay: formData.defaultBenchesPerBay ? Number(formData.defaultBenchesPerBay) : undefined,
      defaultSpotChecksPerBench: formData.defaultSpotChecksPerBench
        ? Number(formData.defaultSpotChecksPerBench)
        : undefined,
      timezone: formData.timezone.trim() || undefined,
      licenseExpiryDate: initialData?.licenseExpiryDate,
      autoRenewEnabled: initialData?.autoRenewEnabled,
    };

    onSubmit(submitData);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Information</Text>
        <Input
          label="Farm Name"
          value={formData.name}
          onChangeText={(value) => updateField('name', value)}
          placeholder="Enter farm name"
          error={errors.name}
          leftIcon="leaf"
          required
        />
        <Input
          label="Description"
          value={formData.description}
          onChangeText={(value) => updateField('description', value)}
          placeholder="Description"
          multiline
        />
        <Input
          label="External ID"
          value={formData.externalId}
          onChangeText={(value) => updateField('externalId', value)}
          placeholder="External identifier"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location</Text>
        <Input
          label="Address"
          value={formData.address}
          onChangeText={(value) => updateField('address', value)}
          placeholder="Street address"
          leftIcon="location"
        />
        <Input
          label="City"
          value={formData.city}
          onChangeText={(value) => updateField('city', value)}
          placeholder="City"
        />
        <Input
          label="Province/State"
          value={formData.province}
          onChangeText={(value) => updateField('province', value)}
          placeholder="Province or state"
        />
        <Input
          label="Postal Code"
          value={formData.postalCode}
          onChangeText={(value) => updateField('postalCode', value)}
          placeholder="Postal code"
        />
        <Input
          label="Country"
          value={formData.country}
          onChangeText={(value) => updateField('country', value)}
          placeholder="Country"
        />
        <Input
          label="Timezone"
          value={formData.timezone}
          onChangeText={(value) => updateField('timezone', value)}
          placeholder="e.g. America/New_York"
          leftIcon="time"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contacts & Billing</Text>
        <Input
          label="Contact Name"
          value={formData.contactName}
          onChangeText={(value) => updateField('contactName', value)}
          placeholder="Primary contact"
          leftIcon="person"
        />
        <Input
          label="Contact Email"
          value={formData.contactEmail}
          onChangeText={(value) => updateField('contactEmail', value)}
          placeholder="name@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.contactEmail}
          leftIcon="mail"
        />
        <Input
          label="Contact Phone"
          value={formData.contactPhone}
          onChangeText={(value) => updateField('contactPhone', value)}
          placeholder="Phone number"
          keyboardType="phone-pad"
          leftIcon="call"
        />
        <Input
          label="Billing Email"
          value={formData.billingEmail}
          onChangeText={(value) => updateField('billingEmail', value)}
          placeholder="billing@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.billingEmail}
          leftIcon="card"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Licensing</Text>
        <Input
          label="Licensed Area (hectares)"
          value={formData.licensedAreaHectares}
          onChangeText={(value) => updateField('licensedAreaHectares', value)}
          placeholder="0"
          keyboardType="numeric"
          error={errors.licensedAreaHectares}
          leftIcon="analytics"
          required
        />
        <Input
          label="Licensed Unit Quota"
          value={formData.licensedUnitQuota}
          onChangeText={(value) => updateField('licensedUnitQuota', value)}
          placeholder="Optional"
          keyboardType="numeric"
          leftIcon="cube"
        />
        <Input
          label="Quota Discount (%)"
          value={formData.quotaDiscountPercentage}
          onChangeText={(value) => updateField('quotaDiscountPercentage', value)}
          placeholder="Optional"
          keyboardType="numeric"
          leftIcon="pricetag"
        />
        <Input
          label="Default Bay Count"
          value={formData.defaultBayCount}
          onChangeText={(value) => updateField('defaultBayCount', value)}
          placeholder="Optional"
          keyboardType="number-pad"
          leftIcon="grid"
        />
        <Input
          label="Benches per Bay"
          value={formData.defaultBenchesPerBay}
          onChangeText={(value) => updateField('defaultBenchesPerBay', value)}
          placeholder="Optional"
          keyboardType="number-pad"
          leftIcon="trail-sign"
        />
        <Input
          label="Spot Checks per Bench"
          value={formData.defaultSpotChecksPerBench}
          onChangeText={(value) => updateField('defaultSpotChecksPerBench', value)}
          placeholder="Optional"
          keyboardType="number-pad"
          leftIcon="checkmark-circle"
        />
      </View>

      <View style={styles.buttonRow}>
        <Button
          title="Cancel"
          onPress={onCancel}
          variant="outline"
          fullWidth
          style={styles.button}
        />
        <Button
          title={loading ? 'Saving...' : 'Save Farm'}
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
