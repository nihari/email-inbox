import type { PartnerConfig, PartnerTypesRegistry } from '../types';

let partnerTypesRegistry: PartnerTypesRegistry | null = null;

// Load partner types registry
const loadPartnerTypesRegistry = async (): Promise<PartnerTypesRegistry | null> => {
  if (partnerTypesRegistry) {
    return partnerTypesRegistry;
  }
  
  const response = await fetch('/src/config/partner-types.json');
  if (!response.ok) {
    throw new Error('Failed to load partner types registry');
  }
  partnerTypesRegistry = await response.json();
  return partnerTypesRegistry;
};

// Validate partner type against registry
export const validatePartnerType = async (partnerType: string): Promise<boolean> => {
  const registry = await loadPartnerTypesRegistry();
  return registry?.partnerTypes.some(pt => pt.typeId === partnerType) ?? false;
};

// Get all valid partner types
export const getValidPartnerTypes = async (): Promise<string[]> => {
  const registry = await loadPartnerTypesRegistry();
  return registry?.partnerTypes.map(pt => pt.typeId) ?? [];
};

export const loadPartnerConfig = async (partnerId: string): Promise<PartnerConfig> => {
  const response = await fetch(`/src/config/${partnerId}.json`);
  if (!response.ok) {
    throw new Error(`Failed to load partner config: ${partnerId}`);
  }
  
  const config: PartnerConfig = await response.json();
  
  const isValidType = await validatePartnerType(config.partnerType);
  if (!isValidType) {
    const validTypes = await getValidPartnerTypes();
    console.warn(
      `Invalid partner type "${config.partnerType}" for partner "${partnerId}". ` +
      `Valid types: ${validTypes.join(', ')}`
    );
  }
  
  return config;
};

