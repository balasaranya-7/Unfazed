import { useState } from 'react';
import { useData } from '../context/DataContext';

/**
 * Entitlement Hook - Single source of truth for tier gating on frontend
 * Prevents direct hardcoding of tier checks in components.
 */

// Tier Configuration Definition (matches future backend Entitlement Service)
export const TIER_CONFIG = {
  starter: {
    name: 'Starter Practice',
    monthlyPrice: 0,
    clientCap: 5,
    features: {
      general_notes: true,
      soap_notes: false,
      dap_notes: false,
      basic_analytics: true,
      deep_analytics: false,
      whatsapp_notifications: false,
      custom_branding: false,
      packages_management: false,
      gst_invoicing: true
    }
  },
  pro: {
    name: 'Growth Practice Tier',
    monthlyPrice: 2499,
    clientCap: 35,
    features: {
      general_notes: true,
      soap_notes: true,
      dap_notes: true,
      basic_analytics: true,
      deep_analytics: true,
      whatsapp_notifications: true,
      custom_branding: true,
      packages_management: true,
      gst_invoicing: true
    }
  },
  practice: {
    name: 'Clinic & Group Tier',
    monthlyPrice: 5999,
    clientCap: 150,
    features: {
      general_notes: true,
      soap_notes: true,
      dap_notes: true,
      basic_analytics: true,
      deep_analytics: true,
      whatsapp_notifications: true,
      custom_branding: true,
      packages_management: true,
      gst_invoicing: true,
      multi_therapist: true,
      dedicated_concierge: true
    }
  }
};

export const useEntitlement = () => {
  const { therapist, clients } = useData();
  const [upgradeModal, setUpgradeModal] = useState({
    isOpen: false,
    featureKey: '',
    title: '',
    description: ''
  });

  const currentTierKey = therapist?.subscription?.tier || 'pro';
  const currentTier = TIER_CONFIG[currentTierKey] || TIER_CONFIG.pro;

  /**
   * Central check function: canAccess(featureKey)
   */
  const canAccess = (featureKey) => {
    // Special cap check for active clients
    if (featureKey === 'add_client') {
      const activeCount = clients.filter(c => c.status === 'Active').length;
      return activeCount < currentTier.clientCap;
    }
    return !!currentTier.features[featureKey];
  };

  /**
   * Check and automatically trigger Upgrade Modal if access is restricted
   */
  const requireAccess = (featureKey, featureLabel) => {
    if (!canAccess(featureKey)) {
      setUpgradeModal({
        isOpen: true,
        featureKey,
        title: `Upgrade to Access ${featureLabel || 'Feature'}`,
        description: `This feature is available on the Growth Practice tier and above. Upgrade your subscription to unlock clinical workflows without limits.`
      });
      return false;
    }
    return true;
  };

  const closeUpgradeModal = () => {
    setUpgradeModal(prev => ({ ...prev, isOpen: false }));
  };

  return {
    currentTier,
    currentTierKey,
    canAccess,
    requireAccess,
    upgradeModal,
    closeUpgradeModal,
    clientUsage: {
      current: clients.filter(c => c.status === 'Active').length,
      cap: currentTier.clientCap
    }
  };
};

export default useEntitlement;
