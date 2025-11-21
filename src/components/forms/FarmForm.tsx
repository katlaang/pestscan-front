// src/components/forms/FarmForm.tsx

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { 
  CreateFarmRequest, 
  SubscriptionStatus, 
  SubscriptionTier,
  FarmStructureType,
  FarmResponse 
} from '../../types/api.types';
import { colors, spacing } from '../../theme/theme';

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

    if (formData.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Invalid email format';
    }

    if (formData.billingEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.billingEmail)) {
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
      ownerId: initialData?.ownerId || '', // Should be passed from parent
      scoutI