import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '../store/useAppStore';

describe('Global App State (Zustand Store)', () => {
  beforeEach(() => {
    // Reset store state where appropriate
    useAppStore.setState({
      language: 'kn',
      isDarkMode: false,
      isAudioAssistanceEnabled: true,
      savedSchemeIds: ['pm-kisan', 'pm-jay'],
      compareSchemeIds: [],
      activeProfileId: 'prof-1'
    });
  });

  it('updates language and updates documentElement lang', () => {
    useAppStore.getState().setLanguage('hi');
    expect(useAppStore.getState().language).toBe('hi');
    expect(document.documentElement.lang).toBe('hi');

    useAppStore.getState().setLanguage('en');
    expect(useAppStore.getState().language).toBe('en');
    expect(document.documentElement.lang).toBe('en');
  });

  it('toggles dark mode and sets document dark class', () => {
    expect(useAppStore.getState().isDarkMode).toBe(false);

    useAppStore.getState().toggleDarkMode();
    expect(useAppStore.getState().isDarkMode).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    useAppStore.getState().toggleDarkMode();
    expect(useAppStore.getState().isDarkMode).toBe(false);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('toggles saving and un-saving schemes for offline access', () => {
    const testSchemeId = 'pm-svanidhi';
    expect(useAppStore.getState().savedSchemeIds.includes(testSchemeId)).toBe(false);

    useAppStore.getState().toggleSaveScheme(testSchemeId);
    expect(useAppStore.getState().savedSchemeIds.includes(testSchemeId)).toBe(true);

    useAppStore.getState().toggleSaveScheme(testSchemeId);
    expect(useAppStore.getState().savedSchemeIds.includes(testSchemeId)).toBe(false);
  });

  it('limits scheme comparison to maximum of 3 items', () => {
    useAppStore.getState().clearCompareSchemes();
    expect(useAppStore.getState().compareSchemeIds).toHaveLength(0);

    useAppStore.getState().toggleCompareScheme('pm-kisan');
    useAppStore.getState().toggleCompareScheme('pm-jay');
    useAppStore.getState().toggleCompareScheme('pmmvy');
    expect(useAppStore.getState().compareSchemeIds).toHaveLength(3);

    // Attempting to add 4th item should not exceed 3
    useAppStore.getState().toggleCompareScheme('pm-svanidhi');
    expect(useAppStore.getState().compareSchemeIds).toHaveLength(3);
  });

  it('switches between family proxy profiles', () => {
    expect(useAppStore.getState().activeProfileId).toBe('prof-1');

    useAppStore.getState().setActiveProfileId('prof-2');
    expect(useAppStore.getState().activeProfileId).toBe('prof-2');
  });

  it('records eligibility questionnaire answers accurately', () => {
    useAppStore.getState().resetEligibilityAnswers();
    expect(Object.keys(useAppStore.getState().eligibilityAnswers)).toHaveLength(0);

    useAppStore.getState().setEligibilityAnswer('occupation', 'farmer');
    useAppStore.getState().setEligibilityAnswer('landholdingAcres', 2.5);

    expect(useAppStore.getState().eligibilityAnswers.occupation).toBe('farmer');
    expect(useAppStore.getState().eligibilityAnswers.landholdingAcres).toBe(2.5);
  });
});
