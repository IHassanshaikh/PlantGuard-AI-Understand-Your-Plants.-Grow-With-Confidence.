import { Plant, SpecimenSample, LibraryPlant, JournalEntry, DoctorMessage, CareReminder, ComparisonPair } from '../types';

export const SAMPLE_SPECIMENS: SpecimenSample[] = [
  {
    id: 'specimen-tomato-blight',
    name: 'Tomato (Early Blight)',
    species: 'Solanum lycopersicum',
    condition: 'Alternaria solani fungal infection',
    severity: 'Moderate Concern',
    imageUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80',
    description: 'Concentric ring spots (bullseye pattern) with yellow chlorotic halos on lower foliage.',
    simulatedLocalScore: 48,
    sampleHotspots: [
      {
        id: 'hs-1',
        x: 48,
        y: 42,
        title: 'Primary Concentric Bullseye',
        description: 'Alternaria solani fungal spore germination creating dead cellular tissue with concentric growth rings.',
        severity: 'severe'
      },
      {
        id: 'hs-2',
        x: 32,
        y: 62,
        title: 'Chlorotic Marginal Halo',
        description: 'Toxic fungal metabolites degrading chlorophyll synthesis in adjacent leaf tissue.',
        severity: 'moderate'
      },
      {
        id: 'hs-3',
        x: 68,
        y: 28,
        title: 'Secondary Spore Inoculation',
        description: 'Early pinhead lesions developing from overhead water splash droplets.',
        severity: 'mild'
      }
    ]
  },
  {
    id: 'specimen-monstera-cercospora',
    name: 'Monstera (Leaf Spot)',
    species: 'Monstera deliciosa',
    condition: 'Fungal leaf spot & foliar edema',
    severity: 'Mild',
    imageUrl: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80',
    description: 'Small dark necrotic lesions surrounded by faint chlorosis on older leaves.',
    simulatedLocalScore: 72,
    sampleHotspots: [
      {
        id: 'hs-m1',
        x: 55,
        y: 38,
        title: 'Cercospora Fungal Spot',
        description: 'Necrotic center with raised margin caused by persistent water sitting on tropical leaf cuticle.',
        severity: 'moderate'
      },
      {
        id: 'hs-m2',
        x: 28,
        y: 70,
        title: 'Healthy Fenestration Margin',
        description: 'Normal natural leaf incision with healthy cell turgor and epidermal wax coating.',
        severity: 'healthy'
      }
    ]
  },
  {
    id: 'specimen-basil-healthy',
    name: 'Sweet Basil (Healthy)',
    species: 'Ocimum basilicum',
    condition: 'Optimal physiological vigor',
    severity: 'None (Healthy)',
    imageUrl: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&w=800&q=80',
    description: 'Vibrant emerald leaves, crisp venation, uniform cell turgor, zero chlorosis.',
    simulatedLocalScore: 96,
    sampleHotspots: [
      {
        id: 'hs-b1',
        x: 50,
        y: 50,
        title: 'Optimal Photosynthetic Saturation',
        description: 'High chlorophyll A/B density with active stomatal transpiration and strong vascular venation.',
        severity: 'healthy'
      }
    ]
  },
  {
    id: 'specimen-apple-scab',
    name: 'Apple Foliage (Scab)',
    species: 'Malus domestica',
    condition: 'Venturia inaequalis',
    severity: 'Moderate Concern',
    imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80',
    description: 'Olive-green to velvety brown lesions on upper leaf surfaces causing premature drop.',
    simulatedLocalScore: 54,
    sampleHotspots: [
      {
        id: 'hs-a1',
        x: 44,
        y: 48,
        title: 'Velvety Olive Scab Spot',
        description: 'Subcuticular stroma producing conidiophores on upper leaf surface.',
        severity: 'moderate'
      }
    ]
  },
  {
    id: 'specimen-citrus-chlorosis',
    name: 'Lemon Tree (Chlorosis)',
    species: 'Citrus limon',
    condition: 'Micronutrient deficiency (Iron/Zinc)',
    severity: 'Mild',
    imageUrl: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=800&q=80',
    description: 'Interveinal yellowing while prominent veins retain dark botanical green hue.',
    simulatedLocalScore: 64,
    sampleHotspots: [
      {
        id: 'hs-c1',
        x: 52,
        y: 54,
        title: 'Interveinal Chlorosis Band',
        description: 'Chlorophyll synthesis blocked due to lack of bioavailable ferrous iron at roots.',
        severity: 'mild'
      },
      {
        id: 'hs-c2',
        x: 38,
        y: 35,
        title: 'Vascular Green Retention',
        description: 'Primary and secondary leaf veins retain localized chlorophyll deposits.',
        severity: 'healthy'
      }
    ]
  }
];

export const INITIAL_PLANTS: Plant[] = [
  {
    id: 'plant-tomato-01',
    userId: 'guest-user',
    name: 'Heritage Tomato',
    species: 'Solanum lycopersicum',
    commonName: 'San Marzano Vine',
    imageUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80',
    status: 'attention',
    healthScore: 52,
    lastScanned: new Date(Date.now() - 3600000 * 4).toISOString(),
    location: 'Sunny Balcony',
    wateringFrequency: 'Every 2 days',
    notes: 'Early Blight diagnosed on lower leaflets. Pruning treatment scheduled.',
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'plant-monstera-02',
    userId: 'guest-user',
    name: 'Living Room Monstera',
    species: 'Monstera deliciosa',
    commonName: 'Swiss Cheese Plant',
    imageUrl: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80',
    status: 'healthy',
    healthScore: 89,
    lastScanned: new Date(Date.now() - 86400000 * 2).toISOString(),
    location: 'Living Room Window',
    wateringFrequency: 'Weekly',
    notes: 'Unfurling two new fenestrated leaves. Excellent turgor.',
    createdAt: new Date(Date.now() - 86400000 * 45).toISOString(),
  },
  {
    id: 'plant-basil-03',
    userId: 'guest-user',
    name: 'Genovese Basil',
    species: 'Ocimum basilicum',
    commonName: 'Sweet Italian Basil',
    imageUrl: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&w=800&q=80',
    status: 'healthy',
    healthScore: 94,
    lastScanned: new Date(Date.now() - 86400000 * 1).toISOString(),
    location: 'Kitchen Herb Planter',
    wateringFrequency: 'Daily light misting',
    notes: 'Pruned tops to encourage lateral branching.',
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
  },
  {
    id: 'plant-lemon-04',
    userId: 'guest-user',
    name: 'Meyer Lemon Bush',
    species: 'Citrus limon',
    commonName: 'Meyer Lemon',
    imageUrl: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=800&q=80',
    status: 'attention',
    healthScore: 61,
    lastScanned: new Date(Date.now() - 86400000 * 3).toISOString(),
    location: 'Patio Sun Deck',
    wateringFrequency: 'When top 2 inches dry',
    notes: 'Interveinal chlorosis observed. Responded well to iron chelate.',
    createdAt: new Date(Date.now() - 86400000 * 60).toISOString(),
  }
];

export const INITIAL_REMINDERS: CareReminder[] = [
  {
    id: 'rem-1',
    plantId: 'plant-tomato-01',
    plantName: 'Heritage Tomato',
    taskType: 'prune',
    title: 'Sanitize & Prune Lower Blighted Leaves',
    frequencyDays: 3,
    dueDate: new Date(Date.now() + 3600000 * 6).toISOString(),
    isCompleted: false,
    priority: 'urgent',
  },
  {
    id: 'rem-2',
    plantId: 'plant-tomato-01',
    plantName: 'Heritage Tomato',
    taskType: 'fertilize',
    title: 'Apply Organic Copper Bio-Fungicide Spray',
    frequencyDays: 7,
    dueDate: new Date(Date.now() + 86400000 * 1).toISOString(),
    isCompleted: false,
    priority: 'urgent',
  },
  {
    id: 'rem-3',
    plantId: 'plant-monstera-02',
    plantName: 'Living Room Monstera',
    taskType: 'water',
    title: 'Aerated Aroid Substrate Knuckle Soak',
    frequencyDays: 7,
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    isCompleted: false,
    priority: 'normal',
  },
  {
    id: 'rem-4',
    plantId: 'plant-lemon-04',
    plantName: 'Meyer Lemon Bush',
    taskType: 'fertilize',
    title: 'Chelated Iron Soil Drench (Correct Chlorosis)',
    frequencyDays: 14,
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    isCompleted: false,
    priority: 'normal',
  },
  {
    id: 'rem-5',
    plantId: 'plant-basil-03',
    plantName: 'Genovese Basil',
    taskType: 'mist',
    title: 'Morning Foliar Hydration & Herb Pinching',
    frequencyDays: 1,
    dueDate: new Date(Date.now() - 3600000 * 2).toISOString(),
    isCompleted: true,
    priority: 'low',
  }
];

export const INITIAL_COMPARISONS: ComparisonPair[] = [
  {
    id: 'comp-1',
    plantId: 'plant-tomato-01',
    plantName: 'Heritage Tomato',
    beforeDate: new Date(Date.now() - 86400000 * 12).toISOString(),
    beforeImageUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80',
    beforeScore: 42,
    beforeDiagnosis: 'Severe Concentric Alternaria Blight',
    afterDate: new Date().toISOString(),
    afterImageUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80',
    afterScore: 78,
    afterDiagnosis: 'Post-Sanitation Foliar Recovery & Regeneration',
    recoverySummary: 'Pruning of 5 lower blighted leaflets followed by soil-drench watering halted fungal spore propagation. Fresh axillary shoots emerged.'
  }
];

export const INITIAL_JOURNAL: JournalEntry[] = [
  {
    id: 'entry-01',
    plantId: 'plant-tomato-01',
    plantName: 'Heritage Tomato',
    date: new Date(Date.now() - 3600000 * 4).toISOString(),
    title: 'Blight Diagnosis & Leaf Removal',
    notes: 'Isolated suspicious lower branches showing concentric target rings. Removed 4 affected leaflets using sterilized shears.',
    treatmentApplied: 'Manual leaf sanitization + organic copper fungicide spray scheduled.',
    healthScore: 52,
    imageUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80',
    type: 'treatment',
  },
  {
    id: 'entry-02',
    plantId: 'plant-monstera-02',
    plantName: 'Living Room Monstera',
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    title: 'Routine Health Checkup',
    notes: 'Foliage is glossy with deep green chlorophyll saturation. No sign of thrips or spider mites.',
    treatmentApplied: 'Applied diluted seaweed extract liquid fertilizer.',
    healthScore: 89,
    imageUrl: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80',
    type: 'watering',
  },
  {
    id: 'entry-03',
    plantId: 'plant-lemon-04',
    plantName: 'Meyer Lemon Bush',
    date: new Date(Date.now() - 86400000 * 3).toISOString(),
    title: 'Interveinal Chlorosis Detected',
    notes: 'Upper leaves showing pale yellow margins with green veins, indicative of iron uptake block due to high soil pH.',
    treatmentApplied: 'Applied acidifying elemental sulfur and chelated iron drench.',
    healthScore: 61,
    imageUrl: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=800&q=80',
    type: 'treatment',
  }
];

export const INITIAL_DOCTOR_MESSAGES: Record<string, DoctorMessage[]> = {
  'plant-tomato-01': [
    {
      id: 'doc-msg-1',
      plantId: 'plant-tomato-01',
      sender: 'doctor',
      text: "Hello Hassan. I reviewed your Heritage Tomato's latest scan. We detected preliminary markers for Early Blight (Alternaria solani). Notice the concentric rings on the lower leaf?",
      timestamp: new Date(Date.now() - 3600000 * 3.5).toISOString(),
      suggestedActions: [
        'How quickly does early blight spread?',
        'Can I still harvest fruit safely?',
        'Should I use neem oil or copper spray?'
      ]
    }
  ],
  'plant-monstera-02': [
    {
      id: 'doc-msg-2',
      plantId: 'plant-monstera-02',
      sender: 'doctor',
      text: "Your Monstera is looking exemplary! With a health score of 89/100, its fenestrations show abundant light capture. Keep the soil slightly airy between waterings.",
      timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
      suggestedActions: [
        'When should I repot into a larger planter?',
        'How to propagate using aerial root cuttings?',
        'Why do aerial roots look dry?'
      ]
    }
  ]
};

export const PLANT_LIBRARY: LibraryPlant[] = [
  {
    id: 'lib-tomato',
    name: 'Garden Tomato',
    scientificName: 'Solanum lycopersicum',
    category: 'Vegetables',
    imageUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80',
    difficulty: 'Moderate',
    sunlight: '6-8 hours direct full sunlight',
    watering: 'Deep consistent moisture at root zone; avoid wetting leaves',
    soil: 'Rich, loamy, well-draining pH 6.2 - 6.8',
    humidity: '40% - 70%',
    description: 'One of the most rewarding garden vegetables, but susceptible to foliage fungi in warm, humid microclimates.',
    commonDiseases: [
      {
        name: 'Early Blight (Alternaria solani)',
        symptoms: 'Target-like concentric brown spots on older foliage with yellow chlorosis halos.',
        treatment: 'Prune affected lower leaves, mulch base to prevent soil splash, apply copper fungicide.',
        recommendedDosage: '2 tbsp copper octanoate per gallon of water every 7-10 days.'
      },
      {
        name: 'Blossom End Rot',
        symptoms: 'Dark, leathery sunken patch on the bottom blossom end of developing fruit.',
        treatment: 'Maintain consistent soil moisture to enable calcium uptake; avoid extreme wet-dry cycles.',
        recommendedDosage: 'Foliar calcium chloride spray (0.5%) during fruit sizing.'
      }
    ]
  },
  {
    id: 'lib-monstera',
    name: 'Swiss Cheese Plant',
    scientificName: 'Monstera deliciosa',
    category: 'Indoor',
    imageUrl: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80',
    difficulty: 'Easy',
    sunlight: 'Bright, indirect sunlight; avoid harsh noon rays',
    watering: 'Allow top 2-3 inches of potting medium to dry between thorough waterings',
    soil: 'Chunky aroid mix (orchid bark, perlite, peat moss, charcoal)',
    humidity: '60% - 80% preferred',
    description: 'Iconic jungle epiphyte famous for natural leaf holes (fenestrations) adapted to hurricane winds and dappled forest canopy light.',
    commonDiseases: [
      {
        name: 'Root Rot (Pythium / Phytophthora)',
        symptoms: 'Yellowing limp leaves, blackened soft stems, musty wet soil smell.',
        treatment: 'Unpot immediately, trim black mushy roots, soak in diluted hydrogen peroxide, repot in fresh aroid mix.',
        recommendedDosage: '1 part 3% H2O2 to 3 parts water root rinse.'
      },
      {
        name: 'Fungal Leaf Spot (Cercospora)',
        symptoms: 'Brown spots surrounded by yellow halos appearing after water sits on leaves.',
        treatment: 'Isolate plant, improve air circulation, avoid misting foliage, treat with organic bio-fungicide.',
        recommendedDosage: 'Bio-fungicide (Bacillus amyloliquefaciens) weekly until lesions cease expansion.'
      }
    ]
  },
  {
    id: 'lib-basil',
    name: 'Genovese Sweet Basil',
    scientificName: 'Ocimum basilicum',
    category: 'Herbs',
    imageUrl: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&w=800&q=80',
    difficulty: 'Easy',
    sunlight: '6+ hours direct sun or high-output grow light',
    watering: 'Keep evenly moist, never waterlogged; water at dawn',
    soil: 'Nutrient-rich, fertile, free-draining potting soil',
    humidity: '40% - 60%',
    description: 'Culinary staple prized for intense aromatic essential oils. Frequent leaf pinching above leaf nodes promotes lush bushy architecture.',
    commonDiseases: [
      {
        name: 'Basil Downy Mildew',
        symptoms: 'Yellowing on top of leaf between veins; purplish-grey fungal spores underneath.',
        treatment: 'Ensure great airflow, keep leaves bone dry, prune infected stems, plant resistant cultivars.',
        recommendedDosage: 'Potassium bicarbonate foliar spray (5g/L) for preventative organic protection.'
      }
    ]
  },
  {
    id: 'lib-fiddle-leaf',
    name: 'Fiddle Leaf Fig',
    scientificName: 'Ficus lyrata',
    category: 'Indoor',
    imageUrl: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80',
    difficulty: 'Demanding',
    sunlight: 'Bright filtered sunlight near south or east facing windows',
    watering: 'Thoroughly saturate until draining freely, then let top 50% soil dry',
    soil: 'Well-aerated indoor potting mix with peat and vermiculite',
    humidity: '50% - 70%',
    description: 'A striking sculptural centerpiece with violin-shaped emerald leaves, sensitive to drafts, light shifts, and overwatering.',
    commonDiseases: [
      {
        name: 'Bacterial Leaf Spot (Xanthomonas)',
        symptoms: 'Brownish-black irregular lesions across the leaf blade, not restricted to edges.',
        treatment: 'Remove infected foliage, sanitize tools with 70% alcohol, avoid overhead watering.',
        recommendedDosage: 'Copper soap bactericide applied at 14-day intervals.'
      }
    ]
  },
  {
    id: 'lib-lemon',
    name: 'Meyer Lemon',
    scientificName: 'Citrus limon x meyeri',
    category: 'Fruits',
    imageUrl: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=800&q=80',
    difficulty: 'Moderate',
    sunlight: '8+ hours full direct sun',
    watering: 'Deep root soaking; allow top 2 inches to dry between waterings',
    soil: 'Acidic, gritty citrus potting blend (pH 5.5 - 6.5)',
    humidity: '50%+',
    description: 'Compact hybrid citrus producing fragrant sweet-tart lemons year-round when given abundant sunlight and balanced micronutrients.',
    commonDiseases: [
      {
        name: 'Citrus Greening / Huanglongbing',
        symptoms: 'Asymmetric yellow blotches on leaves, small lopsided bitter fruit.',
        treatment: 'Manage psyllid vectors, apply balanced foliar micronutrients.',
        recommendedDosage: 'Chelated iron (Fe-EDDHA) drench (15g per pot) every 3 weeks.'
      }
    ]
  }
];
