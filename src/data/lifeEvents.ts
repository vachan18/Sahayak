import { LifeEvent } from '../types';

// schemeCount mirrors the browsable catalogue (allSchemes in ./schemes.ts).

export const lifeEventsData: LifeEvent[] = [
  {
    id: "farming",
    iconName: "Wheat",
    schemeCount: 2,
    titleKey: "lifeEvent_farming",
    descriptionKey: "lifeEvent_farming_desc"
  },
  {
    id: "health_elder",
    iconName: "HeartPulse",
    schemeCount: 1,
    titleKey: "lifeEvent_health_elder",
    descriptionKey: "lifeEvent_health_elder_desc"
  },
  {
    id: "women_child",
    iconName: "ShieldAlert",
    schemeCount: 3,
    titleKey: "lifeEvent_women_child",
    descriptionKey: "lifeEvent_women_child_desc"
  },
  {
    id: "education_youth",
    iconName: "GraduationCap",
    schemeCount: 2,
    titleKey: "lifeEvent_education_youth",
    descriptionKey: "lifeEvent_education_youth_desc"
  },
  {
    id: "business_artisan",
    iconName: "Briefcase",
    schemeCount: 2,
    titleKey: "lifeEvent_business_artisan",
    descriptionKey: "lifeEvent_business_artisan_desc"
  },
  {
    id: "housing_utilities",
    iconName: "Home",
    schemeCount: 2,
    titleKey: "lifeEvent_housing_utilities",
    descriptionKey: "lifeEvent_housing_utilities_desc"
  }
];
