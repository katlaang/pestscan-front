// src/constants/species.ts

import { SpeciesCode, ObservationCategory } from '../types/api.types';
import { colors } from '../theme/theme';

export const SPECIES_LABELS: Record<SpeciesCode, string> = {
  // Pests
  [SpeciesCode.THRIPS]: 'Thrips',
  [SpeciesCode.RED_SPIDER_MITE]: 'Red Spider Mite',
  [SpeciesCode.WHITEFLIES]: 'Whiteflies',
  [SpeciesCode.MEALYBUGS]: 'Mealybugs',
  [SpeciesCode.CATERPILLARS]: 'Caterpillars',
  [SpeciesCode.FALSE_CODLING_MOTH]: 'False Codling Moth',
  [SpeciesCode.PEST_OTHER]: 'Other Pest',

  // Diseases
  [SpeciesCode.DOWNY_MILDEW]: 'Downy Mildew',
  [SpeciesCode.POWDERY_MILDEW]: 'Powdery Mildew',
  [SpeciesCode.BOTRYTIS]: 'Botrytis',
  [SpeciesCode.VERTICILLIUM]: 'Verticillium',
  [SpeciesCode.BACTERIAL_WILT]: 'Bacterial Wilt',
  [SpeciesCode.DISEASE_OTHER]: 'Other Disease',

  // Beneficial
  [SpeciesCode.BENEFICIAL_PP]: 'Beneficial Organism',
};

export const SPECIES_DESCRIPTIONS: Partial<Record<SpeciesCode, string>> = {
  [SpeciesCode.THRIPS]: 'Small, slender insects that feed on plant tissue causing silvering and distortion',
  [SpeciesCode.RED_SPIDER_MITE]: 'Tiny arachnids that cause stippling and yellowing of leaves',
  [SpeciesCode.WHITEFLIES]: 'Small white flying insects that excrete honeydew leading to sooty mold',
  [SpeciesCode.MEALYBUGS]: 'Soft-bodied insects covered with white waxy coating',
  [SpeciesCode.CATERPILLARS]: 'Larval stage of moths and butterflies that feed on plant tissue',
  [SpeciesCode.FALSE_CODLING_MOTH]: 'Pest affecting citrus and other crops',
  [SpeciesCode.DOWNY_MILDEW]: 'Fungal disease causing yellow patches and downy growth on leaf undersides',
  [SpeciesCode.POWDERY_MILDEW]: 'Fungal disease appearing as white powdery coating on leaves',
  [SpeciesCode.BOTRYTIS]: 'Gray mold fungus causing rot in flowers, fruits, and leaves',
  [SpeciesCode.VERTICILLIUM]: 'Soil-borne fungal disease causing wilting and yellowing',
  [SpeciesCode.BACTERIAL_WILT]: 'Bacterial infection causing rapid wilting of plants',
  [SpeciesCode.BENEFICIAL_PP]: 'Beneficial organisms used for biological pest control',
};

export const SPECIES_CATEGORY_MAP: Record<SpeciesCode, ObservationCategory> = {
  [SpeciesCode.THRIPS]: ObservationCategory.PEST,
  [SpeciesCode.RED_SPIDER_MITE]: ObservationCategory.PEST,
  [SpeciesCode.WHITEFLIES]: ObservationCategory.PEST,
  [SpeciesCode.MEALYBUGS]: ObservationCategory.PEST,
  [SpeciesCode.CATERPILLARS]: ObservationCategory.PEST,
  [SpeciesCode.FALSE_CODLING_MOTH]: ObservationCategory.PEST,
  [SpeciesCode.PEST_OTHER]: ObservationCategory.PEST,
  [SpeciesCode.DOWNY_MILDEW]: ObservationCategory.DISEASE,
  [SpeciesCode.POWDERY_MILDEW]: ObservationCategory.DISEASE,
  [SpeciesCode.BOTRYTIS]: ObservationCategory.DISEASE,
  [SpeciesCode.VERTICILLIUM]: ObservationCategory.DISEASE,
  [SpeciesCode.BACTERIAL_WILT]: ObservationCategory.DISEASE,
  [SpeciesCode.DISEASE_OTHER]: ObservationCategory.DISEASE,
  [SpeciesCode.BENEFICIAL_PP]: ObservationCategory.BENEFICIAL,
};

export const SPECIES_BY_CATEGORY: Record<ObservationCategory, SpeciesCode[]> = {
  [ObservationCategory.PEST]: [
    SpeciesCode.THRIPS,
    SpeciesCode.RED_SPIDER_MITE,
    SpeciesCode.WHITEFLIES,
    SpeciesCode.MEALYBUGS,
    SpeciesCode.CATERPILLARS,
    SpeciesCode.FALSE_CODLING_MOTH,
    SpeciesCode.PEST_OTHER,
  ],
  [ObservationCategory.DISEASE]: [
    SpeciesCode.DOWNY_MILDEW,
    SpeciesCode.POWDERY_MILDEW,
    SpeciesCode.BOTRYTIS,
    SpeciesCode.VERTICILLIUM,
    SpeciesCode.BACTERIAL_WILT,
    SpeciesCode.DISEASE_OTHER,
  ],
  [ObservationCategory.BENEFICIAL]: [SpeciesCode.BENEFICIAL_PP],
};

export const SPECIES_COLORS: Record<SpeciesCode, string> = {
  // Pests - Reds
  [SpeciesCode.THRIPS]: '#EF4444',
  [SpeciesCode.RED_SPIDER_MITE]: '#DC2626',
  [SpeciesCode.WHITEFLIES]: '#F87171',
  [SpeciesCode.MEALYBUGS]: '#FCA5A5',
  [SpeciesCode.CATERPILLARS]: '#B91C1C',
  [SpeciesCode.FALSE_CODLING_MOTH]: '#991B1B',
  [SpeciesCode.PEST_OTHER]: '#7F1D1D',

  // Diseases - Oranges/Yellows
  [SpeciesCode.DOWNY_MILDEW]: '#F59E0B',
  [SpeciesCode.POWDERY_MILDEW]: '#FBBF24',
  [SpeciesCode.BOTRYTIS]: '#F97316',
  [SpeciesCode.VERTICILLIUM]: '#FB923C',
  [SpeciesCode.BACTERIAL_WILT]: '#EA580C',
  [SpeciesCode.DISEASE_OTHER]: '#C2410C',

  // Beneficial - Green
  [SpeciesCode.BENEFICIAL_PP]: '#10B981',
};

export const CATEGORY_COLORS: Record<ObservationCategory, string> = {
  [ObservationCategory.PEST]: colors.error || '#DC2626',
  [ObservationCategory.DISEASE]: colors.warning || '#F59E0B',
  [ObservationCategory.BENEFICIAL]: colors.success || '#10B981',
};

export const CATEGORY_LABELS: Record<ObservationCategory, string> = {
  [ObservationCategory.PEST]: 'Pest',
  [ObservationCategory.DISEASE]: 'Disease',
  [ObservationCategory.BENEFICIAL]: 'Beneficial',
};

export const CATEGORY_ICONS = {
  [ObservationCategory.PEST]: 'bug' as const,
  [ObservationCategory.DISEASE]: 'warning' as const,
  [ObservationCategory.BENEFICIAL]: 'shield-checkmark' as const,
};

export const getSpeciesLabel = (code: SpeciesCode): string => {
  return SPECIES_LABELS[code] || code;
};

export const getSpeciesCategory = (code: SpeciesCode): ObservationCategory => {
  return SPECIES_CATEGORY_MAP[code];
};

export const getSpeciesColor = (code: SpeciesCode): string => {
  return SPECIES_COLORS[code] || colors.textSecondary;
};

export const getCategoryColor = (category: ObservationCategory): string => {
  return CATEGORY_COLORS[category];
};

export const getSpeciesByCategory = (category: ObservationCategory): SpeciesCode[] => {
  return SPECIES_BY_CATEGORY[category] || [];
};