import {
  PrismaClient,
  ClassClassification,
  ClassFeatureType,
  GearType,
  RateOfFire,
  Range,
  Reliability,
  ArmorType,
  ActionType,
  UserType,
} from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding static data...');

  // Upsert Classes
  console.log('Upserting Classes...');
  const classes = [
    {
      id: 1,
      name: 'Human',
      classification: ClassClassification.RACE,
    },
    {
      id: 2,
      name: 'Stormer(Malice)',
      classification: ClassClassification.RACE,
      minMight: 2,
    },
    {
      id: 3,
      name: 'Warrior',
      classification: ClassClassification.PATH,
    },
    {
      id: 4,
      name: 'Ebonite',
      classification: ClassClassification.RACE,
      minIntellect: 1,
      minSpirit: 1,
    },
    {
      id: 5,
      name: 'Ebb Master',
      classification: ClassClassification.PATH,
    },
    {
      id: 6,
      name: 'Soldier',
      classification: ClassClassification.PATH,
    },
  ];

  for (const cls of classes) {
    const { id, ...classData } = cls;
    await prisma.class.upsert({
      where: { id },
      update: classData,
      create: { id, ...classData },
    });
  }

  console.log('Upserting Class Levels...');
  // Upsert Class Levels
  const classLevels = [
    { id: 1, classId: 1, level: 1, health: 11, statBonus: 0 },
    { id: 3, classId: 1, level: 4, health: 2, statBonus: 2 },
    { id: 4, classId: 1, level: 7, health: 2, statBonus: 3 },
    { id: 2, classId: 2, level: 1, health: 13, statBonus: 0 },
    { id: 16, classId: 2, level: 4, health: 3, statBonus: 2 },
    { id: 17, classId: 2, level: 7, health: 3, statBonus: 3 },
    { id: 5, classId: 3, level: 2, health: 3, statBonus: 0 },
    { id: 6, classId: 3, level: 3, health: 3, statBonus: 0 },
    { id: 7, classId: 3, level: 5, health: 3, statBonus: 0 },
    { id: 8, classId: 3, level: 8, health: 3, statBonus: 0 },
    { id: 9, classId: 4, level: 1, health: 9, statBonus: 0 },
    { id: 10, classId: 4, level: 4, health: 1, statBonus: 2 },
    { id: 11, classId: 4, level: 7, health: 1, statBonus: 3 },
    { id: 12, classId: 5, level: 2, health: 1, statBonus: 0 },
    { id: 13, classId: 5, level: 3, health: 1, statBonus: 0 },
    { id: 14, classId: 5, level: 5, health: 1, statBonus: 0 },
    { id: 15, classId: 5, level: 8, health: 1, statBonus: 0 },
    { id: 18, classId: 6, level: 2, health: 2, statBonus: 0 },
    { id: 19, classId: 6, level: 3, health: 2, statBonus: 0 },
    { id: 20, classId: 6, level: 5, health: 2, statBonus: 0 },
    { id: 21, classId: 6, level: 8, health: 2, statBonus: 0 },
  ];

  for (const level of classLevels) {
    const { id, ...levelData } = level;
    await prisma.classLevel.upsert({
      where: { id },
      update: levelData,
      create: { id, ...levelData },
    });
  }

  // Upsert Class Features
  console.log('Upserting Class Features...');
  const classFeatures: Array<{
    id: number;
    name: string;
    description: string;
    classLevelId: number;
    type: ClassFeatureType;
    display: boolean;
    enduranceRegeneration?: number | null;
    selectableFeatureListId?: number | null;
    selectableFeatureCount?: number | null;
  }> = [
    {
      id: 1,
      name: 'Adaptable',
      description: '+1 Boon on all aptitude checks',
      classLevelId: 1,
      type: ClassFeatureType.BASE,
      display: true,
    },
    {
      id: 2,
      name: 'Determined',
      description:
        'When making any check can, as a free action action, spend a momentum to get a +1 Boon',
      classLevelId: 1,
      type: ClassFeatureType.BASE,
      display: true,
    },
    {
      id: 3,
      name: 'Genesis Protocol',
      description:
        'Once per turn on your turn you can, as a free action, spend a point of momentum to recover 1d6 health',
      classLevelId: 2,
      type: ClassFeatureType.BASE,
      display: true,
    },
    {
      id: 4,
      name: 'Large',
      description:
        'You are bigger than normal humanoids. This has no direct impact but can restrict certain options in game (for instance, certain armors wont be available) as well as role playing considerations',
      classLevelId: 2,
      type: ClassFeatureType.BASE,
      display: true,
    },
    {
      id: 5,
      name: 'Bullet Sponge',
      description:
        'Every round at the end of the round you recover 2 endurance. Increases to 3 at 4, 4 at 7',
      classLevelId: 2,
      type: ClassFeatureType.BASE,
      display: true,
      enduranceRegeneration: 2,
    },
    {
      id: 6,
      name: 'Alternate Thinking',
      description:
        'If you fail an aptitude check, and later use a different approach in the cause of solving the same issue within the span of the current scene, the subsequent skill roll gets +2 boon. This can only happen once per scene',
      classLevelId: 3,
      type: ClassFeatureType.BASE,
      display: true,
    },
    {
      id: 7,
      name: 'Never Give Up',
      description:
        'The first time you become injured in a scene (injured = lose health) the next time during this scene you use an ability which would require a point of momentum, it requires no momentum instead. ',
      classLevelId: 4,
      type: ClassFeatureType.BASE,
      display: true,
    },
    {
      id: 8,
      name: 'Warriors Stance',
      description:
        'You learn to adapt combat stances, which amount to self-buff. Adopting a combat stance requires a minor action and a point of momentum and all stance last for as long as you can maintain resolve, or until you adopt another stance. Pick 2 stances from the following list, another at 5 and 8',
      classLevelId: 5,
      type: ClassFeatureType.SELECT,
      display: true,
      selectableFeatureListId: 1,
      selectableFeatureCount: 2,
    },
    {
      id: 9,
      name: 'Hard To Kill',
      description:
        'At the end of your teams phase you regain 2 endurance. Increases to 3 at 3, 4 at 5, 5 at 8',
      classLevelId: 5,
      type: ClassFeatureType.BASE,
      display: true,
      enduranceRegeneration: 2,
    },
    {
      id: 10,
      name: 'Warriors Comback',
      description:
        'When you use second wind, you can do so as a minor action (normally standard). You also have the option to use it as a reaction if an attack results in you losing health (apply the recovered endurance after the damage is applied) ',
      classLevelId: 6,
      type: ClassFeatureType.BASE,
      display: true,
    },
    {
      id: 11,
      name: 'Harder to kill',
      description: 'Hard to kill now recovers 3 ',
      classLevelId: 6,
      type: ClassFeatureType.BASE,
      display: false,
      enduranceRegeneration: 1,
    },
    {
      id: 12,
      name: 'Stance mastery',
      description: 'Your resolve checks to continue stances get +1 Boon',
      classLevelId: 6,
      type: ClassFeatureType.BASE,
      display: true,
    },
    {
      id: 13,
      name: 'Combat Expertise',
      description:
        'Your melee weapon attacks have +1d6 damage when the attack roll is a natural even number',
      classLevelId: 7,
      type: ClassFeatureType.BASE,
      display: true,
    },
    {
      id: 14,
      name: 'Even Harder to kill',
      description: 'Hard to kill now recovers 4 ',
      classLevelId: 7,
      type: ClassFeatureType.BASE,
      display: false,
      enduranceRegeneration: 1,
    },
    {
      id: 15,
      name: 'Extra stance',
      description: 'Pick 1 more stance',
      classLevelId: 7,
      type: ClassFeatureType.SELECT,
      display: false,
      selectableFeatureListId: 1,
      selectableFeatureCount: 1,
    },
    {
      id: 16,
      name: 'Flux School',
      description: 'Unlock 1 Flux School. Unlock 1 more at level 4',
      classLevelId: 9,
      type: ClassFeatureType.SELECT,
      display: false,
      selectableFeatureListId: 2,
      selectableFeatureCount: 1,
    },
    {
      id: 17,
      name: 'Novice Powers',
      description: 'Pick 2 Novice Powers. Pick 1 more at level 4',
      classLevelId: 9,
      type: ClassFeatureType.SELECT,
      display: false,
      selectableFeatureListId: 3,
      selectableFeatureCount: 2,
    },
    {
      id: 18,
      name: 'Flux Meditation',
      description:
        'Take five minutes and spend 2 momentum. You recover all uses of 1 novice power',
      classLevelId: 9,
      type: ClassFeatureType.BASE,
      display: true,
    },
    {
      id: 19,
      name: 'Flux School',
      description: 'Unlock 1 Flux School',
      classLevelId: 10,
      type: ClassFeatureType.BASE,
      display: false,
      selectableFeatureListId: 2,
      selectableFeatureCount: 1,
    },
    {
      id: 20,
      name: 'Novice Powers',
      description: 'Pick 1 Novice Powers',
      classLevelId: 10,
      type: ClassFeatureType.SELECT,
      display: false,
      selectableFeatureListId: 3,
      selectableFeatureCount: 1,
    },
    {
      id: 21,
      name: 'Expert Powers',
      description: 'Unlock 1 Expert Power',
      classLevelId: 11,
      type: ClassFeatureType.SELECT,
      display: false,
      selectableFeatureListId: 4,
      selectableFeatureCount: 1,
    },
    {
      id: 22,
      name: 'Improved Flux Meditation',
      description:
        'You have the option to spend 3 momentum to recover all uses of 1 expert power',
      classLevelId: 11,
      type: ClassFeatureType.BASE,
      display: true,
    },
    {
      id: 23,
      name: 'Flux School',
      description: 'Unlock 1 Flux School',
      classLevelId: 12,
      type: ClassFeatureType.SELECT,
      display: false,
      selectableFeatureListId: 2,
      selectableFeatureCount: 1,
    },
    {
      id: 24,
      name: 'Novice Powers',
      description: 'Pick 2 Novice Powers',
      classLevelId: 12,
      type: ClassFeatureType.SELECT,
      display: false,
      selectableFeatureListId: 3,
      selectableFeatureCount: 2,
    },
    {
      id: 25,
      name: 'Power Unleashed',
      description:
        'Pick 2 Meta-Ebb capabilities. These represent options for increasing power efficacy when using an ebb ability. In all cases, you can use one of these abilities as a free action when using an ebb power, but they cost a point of momentum. Pick another at level 5',
      classLevelId: 12,
      type: ClassFeatureType.SELECT,
      display: false,
      selectableFeatureListId: 5,
      selectableFeatureCount: 2,
    },
    {
      id: 26,
      name: 'Expert Powers',
      description: 'Pick 1 expert power. Pick another at level 5',
      classLevelId: 13,
      type: ClassFeatureType.SELECT,
      display: false,
      selectableFeatureListId: 4,
      selectableFeatureCount: 1,
    },
    {
      id: 27,
      name: 'Expert Power',
      description: 'Pick 1 Expert power',
      classLevelId: 14,
      type: ClassFeatureType.SELECT,
      display: false,
      selectableFeatureListId: 4,
      selectableFeatureCount: 1,
    },
    {
      id: 28,
      name: 'Master Power',
      description: 'Pick 1 master power',
      classLevelId: 15,
      type: ClassFeatureType.SELECT,
      display: false,
      selectableFeatureListId: 6,
      selectableFeatureCount: 1,
    },
    {
      id: 29,
      name: 'Power Unleashed II',
      description: 'Pick 1 Meta Ebb capability',
      classLevelId: 14,
      type: ClassFeatureType.SELECT,
      display: false,
      selectableFeatureListId: 5,
      selectableFeatureCount: 1,
    },
    {
      id: 30,
      name: 'Stormers Presence',
      description:
        'When you try to intimidate or scare an opponent, you make your Spirit attempt with 1 boon and they save with 1 Bane',
      classLevelId: 16,
      type: ClassFeatureType.BASE,
      display: true,
    },
    {
      id: 31,
      name: 'Spongier',
      description: 'The benefit from bullet sponge increases to 3 ',
      classLevelId: 16,
      type: ClassFeatureType.BASE,
      display: false,
      enduranceRegeneration: 1,
    },
    {
      id: 32,
      name: 'Unstoppable',
      description:
        'Whenever you are reduced to zero health, you avoid unconsciousness (and the dying state) and are conscious with 1 health. This can happen at most once per chapter ',
      classLevelId: 17,
      type: ClassFeatureType.BASE,
      display: true,
    },
    {
      id: 33,
      name: 'Hard to kill',
      description: 'Gain 1 boon on death saves',
      classLevelId: 17,
      type: ClassFeatureType.BASE,
      display: true,
      enduranceRegeneration: 0,
    },
    {
      id: 34,
      name: 'Spongiest',
      description: 'The benefit from bullet sponge increases to 4 ',
      classLevelId: 17,
      type: ClassFeatureType.BASE,
      display: false,
      enduranceRegeneration: 1,
    },
    {
      id: 35,
      name: 'Rifleman',
      description: 'Reduce banes from range by 1',
      classLevelId: 18,
      type: ClassFeatureType.BASE,
      display: true,
    },
    {
      id: 36,
      name: 'Combat Stances',
      description:
        'You learn to adopt combat stances, which amount to self-buff. Adopting a combat stance requires a minor action and a point of momentum and all stance last for as long as you can maintain resolve, or until you adopt another stance. Pick 2 stances, and another at 5th and 8th',
      classLevelId: 18,
      type: ClassFeatureType.SELECT,
      display: true,
      selectableFeatureListId: 7,
      selectableFeatureCount: 2,
    },
    {
      id: 37,
      name: 'Adaptive Recovery',
      description:
        'When you use the second wind action, you can take another action as a free action. This includes Reload weapon, Swap weapons and Take cover (Light)',
      classLevelId: 19,
      type: ClassFeatureType.BASE,
      display: true,
    },
    {
      id: 38,
      name: 'Stance Mastery',
      description: 'Your resolve checks to continue stances get +1 Boon ',
      classLevelId: 19,
      type: ClassFeatureType.BASE,
      display: true,
    },
    {
      id: 39,
      name: 'Combat Expertise',
      description:
        'Your ranged weapon attacks have +1d6 damage when the attack roll is a natural even number',
      classLevelId: 20,
      type: ClassFeatureType.BASE,
      display: true,
    },
    {
      id: 41,
      name: 'Extra stance',
      description: 'Pick 1 more stance',
      classLevelId: 20,
      type: ClassFeatureType.SELECT,
      display: false,
      selectableFeatureListId: 7,
      selectableFeatureCount: 1,
    },
    {
      id: 42,
      name: 'Armor Training',
      description:
        'You get a bonus based on the type of armor you are wearing. Outfit: +1 Tactical surge checks, Armoured: +2 Soak',
      classLevelId: 21,
      type: ClassFeatureType.BASE,
      display: true,
    },
    {
      id: 43,
      name: 'Extra stance',
      description: 'Pick 1 more stance',
      classLevelId: 21,
      type: ClassFeatureType.SELECT,
      display: false,
      selectableFeatureListId: 7,
      selectableFeatureCount: 1,
    },
  ];

  for (const feature of classFeatures) {
    const { id, ...featureData } = feature;
    await prisma.classFeature.upsert({
      where: { id },
      update: featureData,
      create: { id, ...featureData },
    });
  }

  // Upsert Items
  console.log('Upserting Items...');
  const items = [
    {
      id: 1,
      name: 'Dagger',
      type: GearType.MELEE,
      rank: 1,
      damageUnarmored: 2,
      damageArmored: -4,
      concealable: true,
      twoHanded: false,
      reach: false,
      finesse: true,
      thrown: true,
      range: Range.NEARBY,
      scatter: false,
      sniper: false,
      brace: false,
    },
    {
      id: 2,
      name: 'Pistol - Automatic',
      type: GearType.RANGED,
      rank: 1,
      damageUnarmored: 3,
      damageArmored: -3,
      concealable: false,
      twoHanded: false,
      reach: false,
      finesse: false,
      thrown: false,
      attacksWorthOfAmmo: 6,
      rateOfFire: RateOfFire.BURST,
      range: Range.MEDIUM,
      reliability: Reliability.NORMAL,
      scatter: false,
      sniper: false,
      brace: false,
    },
    {
      id: 3,
      name: 'Shotgun - Pump',
      type: GearType.RANGED,
      rank: 1,
      damageUnarmored: 4,
      damageArmored: -4,
      concealable: false,
      twoHanded: true,
      reach: false,
      finesse: false,
      thrown: false,
      attacksWorthOfAmmo: 6,
      rateOfFire: RateOfFire.SINGLE,
      range: Range.MEDIUM,
      scatter: true,
      sniper: false,
      brace: false,
    },
    {
      id: 4,
      name: 'Clothing',
      type: GearType.ARMOR,
      rank: 1,
      concealable: false,
      twoHanded: false,
      reach: false,
      finesse: false,
      thrown: false,
      scatter: false,
      sniper: false,
      brace: false,
      armorType: ArmorType.OUTFIT,
      soak: 0,
    },
    {
      id: 5,
      name: 'Body Blocker',
      type: GearType.ARMOR,
      rank: 1,
      concealable: false,
      twoHanded: false,
      reach: false,
      finesse: false,
      thrown: false,
      scatter: false,
      sniper: false,
      brace: false,
      armorType: ArmorType.HARDENED,
      soak: 0,
    },
  ];

  for (const item of items) {
    const { id, ...itemData } = item;
    await prisma.item.upsert({
      where: { id },
      update: itemData,
      create: { id, ...itemData },
    });
  }

  // Upsert Selectable Feature Lists
  console.log('Upserting Selectable Feature Lists...');
  const selectableFeatureLists = [
    { id: 1, name: 'Warrior Stances' },
    { id: 2, name: 'Flux Schools' },
    { id: 3, name: 'Novice Powers' },
    { id: 4, name: 'Expert Powers' },
    { id: 5, name: 'Meta Ebb' },
    { id: 6, name: 'Master Powers' },
    { id: 7, name: 'Soldier Stances' },
  ];

  for (const list of selectableFeatureLists) {
    const { id, ...listData } = list;
    await prisma.selectableFeatureList.upsert({
      where: { id },
      update: listData,
      create: { id, ...listData },
    });
  }

  // Upsert Selectable Features
  console.log('Upserting Selectable Features...');
  const selectableFeatures = [
    {
      id: 1,
      name: 'All Out',
      description:
        'You gain +1 Boon on melee attacks and +1d6 to damage. You cannot take cover or dodge whilst in this stance and attacks against you gain +1 Boon ',
      selectableFeatureListId: 1,
    },
    {
      id: 2,
      name: 'Defender',
      description:
        'Attacks against you have +1 Bane and you gain +1 Boon on dodge attempts. Your attacks have +1 Bane',
      selectableFeatureListId: 1,
    },
    {
      id: 3,
      name: 'Brawlers',
      description:
        'Once per round when you land a melee attack, the defender must make a save (your choice which) or suffer an effect   Physique save or pushed back   Agility save or knocked prone ',
      selectableFeatureListId: 1,
    },
    {
      id: 4,
      name: 'Great Weapon',
      description:
        'When using a melee weapon two handed you gain +1d6 bonus damage. You can opt to forgo this damage to be able to attack two targets you are engaged with as part of a single attack action.',
      selectableFeatureListId: 1,
    },
    {
      id: 5,
      name: 'Dervish',
      description:
        'You when using dual melee weapons, if you strike a foe with both weapons in the same turn, the target takes an additional 1d6 from each attack ',
      selectableFeatureListId: 1,
    },
    {
      id: 6,
      name: 'Duelist',
      description:
        'When using a one-handed melee weapon with no weapon in your off hand, your attacks crit range in increased by 1 and your dodge gets +1 Boon ',
      selectableFeatureListId: 1,
    },
    {
      id: 7,
      name: 'Fire',
      description: 'Some people want to watch the world burn',
      selectableFeatureListId: 2,
    },
    {
      id: 8,
      name: 'Ice',
      description: 'Using cold to freeze and shatter',
      selectableFeatureListId: 2,
    },
    {
      id: 9,
      name: 'Telekinesis',
      description: 'Moving the physical with a thought',
      selectableFeatureListId: 2,
    },
    {
      id: 10,
      name: 'Telepathy',
      description: 'Conecting you thoughts with the thoughts of others',
      selectableFeatureListId: 2,
    },
    {
      id: 11,
      name: 'Spacial / Temporal',
      description: 'Manipulation of space and time',
      selectableFeatureListId: 2,
    },
    {
      id: 12,
      name: 'Ehancement',
      description: 'Changing your physical and biological state',
      selectableFeatureListId: 2,
    },
    {
      id: 13,
      name: 'Entropy',
      description: 'The natural force that brings the end of all things',
      selectableFeatureListId: 2,
    },
    {
      id: 14,
      name: 'Creation',
      description: 'The ability to create',
      selectableFeatureListId: 2,
    },
    {
      id: 15,
      name: 'Light',
      description: 'Control of light and the electromagnetic',
      selectableFeatureListId: 2,
    },
    {
      id: 16,
      name: 'Flame Bolt',
      description:
        'You conjure a small ball of fire which you can project at a target at up to long range.   This does 10/8 damage. The target gets an agility save with 1 bane, on success the damage is halved ',
      selectableFeatureListId: 3,
      requiredSelectableFeatureId: 7,
      uses: 3,
      actionType: ActionType.STANDARD,
    },
    {
      id: 17,
      name: 'Fan of Flame',
      description:
        'You throw out a cone of fire. Pick 3 nearby targets. Each takes 8/6 damage. Each target then makes an Agility save. On success the damage is halved ',
      selectableFeatureListId: 3,
      requiredSelectableFeatureId: 7,
      uses: 3,
      actionType: ActionType.STANDARD,
    },
    {
      id: 18,
      name: 'Ice Bolt',
      description:
        'You conjure a shard of ice which you can project at a target at up to long range.   This does 8/6 damage. The target gets an agility save with 1 bane, on success the damage is halved ',
      selectableFeatureListId: 3,
      requiredSelectableFeatureId: 8,
      uses: 3,
      actionType: ActionType.STANDARD,
    },
    {
      id: 19,
      name: 'Ice Wall',
      description:
        'You create a wall of ice. This wall is 3 squares long and 2 squares high. It has 10 health and can be destroyed. The wall lasts until resolve (+1 Boon) ',
      selectableFeatureListId: 3,
      requiredSelectableFeatureId: 8,
      uses: 3,
      actionType: ActionType.STANDARD,
    },
    {
      id: 20,
      name: 'Blade of Ice',
      description:
        'You can summon a blade made of pure ice. This lasts until resolve (+1 Boon)   In addition, you can elect to make the blade shatter on contact, increasing the damage by 4/2 (Total 8/2) ',
      selectableFeatureListId: 3,
      requiredSelectableFeatureId: 8,
      uses: 3,
      actionType: ActionType.MINOR,
    },
    {
      id: 21,
      name: 'Frost Beam',
      description:
        'You can project a beam of pure cold at a single target at up to Long range. The target takes 6/2 damage and is slowed till resolve (Slowed: Move actions take 2 action points). The Target gets a physique save. On success, the damage is halved and the target does is not slowed. ',
      selectableFeatureListId: 3,
      requiredSelectableFeatureId: 8,
      uses: 3,
      actionType: ActionType.STANDARD,
    },
    {
      id: 22,
      name: 'Sleet Storm',
      description:
        'Pick 1 zone at up to medium range. The area is obscured till end next enemy phase (+1 Bane to any action involving sight) and all targets in the zone at time of casting must make an Agility save or fall prone as the floor temporarily becomes icy. ',
      selectableFeatureListId: 3,
      requiredSelectableFeatureId: 8,
      uses: 1,
      actionType: ActionType.STANDARD,
    },
    {
      id: 23,
      name: 'Armor of Frost',
      description:
        'Your armor become infused with ice. Till resolve (+1 boon) you have +10 max and current endurance and anyone hitting you in melee while you have endurance automatically take 1d6 damage',
      selectableFeatureListId: 3,
      requiredSelectableFeatureId: 8,
      uses: 1,
      actionType: ActionType.STANDARD,
    },
    {
      id: 24,
      name: 'Empower',
      description:
        'When you roll damage with an ability, instead of rolling 1d10, do 10 damage automatically',
      selectableFeatureListId: 5,
    },
    {
      id: 25,
      name: 'Split',
      description:
        'Strictly for powers which target a single enemy. Power can target two enemies. The enemies must each be viably targetable and be nearby each other',
      selectableFeatureListId: 5,
    },
    {
      id: 26,
      name: 'Refresh',
      description:
        'When a power targets yourself or an ally, that recipient of the spell recovers 2d6 endurance. If the power affects multiple targets, you must choose which will receives this benefit',
      selectableFeatureListId: 5,
    },
    {
      id: 27,
      name: 'Heighten',
      description: 'Targets get +1 Bane on saves (if any) ',
      selectableFeatureListId: 5,
    },
    {
      id: 28,
      name: 'Permeance',
      description:
        'The power will have +1 Boon to resolve checks (if beneficial) or +1 Bane to resolve checks (if harmful) ',
      selectableFeatureListId: 5,
    },
    {
      id: 29,
      name: 'Quicken',
      description:
        'For powers which are a standard action, you can use these as a minor action. This costs 2 momentum instead of 1.',
      selectableFeatureListId: 5,
    },
    {
      id: 30,
      name: 'Crown of Flame',
      description:
        'A crown of flame appears over your head.   Whilst active, you have resistance to fire and cold damage, and your melee attacks get +1d6 fire damage.   Whilst active you can also, as a minor action, cause an adjacent target to take 1d6 fire damage (ignores armor) ',
      selectableFeatureListId: 4,
      requiredSelectableFeatureId: 7,
      uses: 3,
      actionType: ActionType.STANDARD,
    },
    {
      id: 31,
      name: 'Ignite',
      description:
        'A target of your choice up to medium range takes 10 fire damage. In addition, they catch fire for 2d6 health damage per round Whilst burning from this effect they take a 1 Bane penalty to all actions due to pain.   Lasts till resolve. ',
      selectableFeatureListId: 4,
      requiredSelectableFeatureId: 7,
      uses: 1,
      actionType: ActionType.STANDARD,
    },
    {
      id: 32,
      name: 'Fireball',
      description:
        'Pick a zone at up to extreme range that you can see. You fling a dart of fire which explodes, hitting all within   Targets take 8/6  damage. Targets are allowed an agility save for half ',
      selectableFeatureListId: 4,
      requiredSelectableFeatureId: 7,
      uses: 1,
      actionType: ActionType.STANDARD,
    },
    {
      id: 33,
      name: 'Wall of fire',
      description:
        'You erect a wall of fire. When cast pick 2 zones that are adjacent to one and other, this wall of fire is considered to be between these zones.   Anyone moving from one zone to the other without a means of circumventing (its gotta be special...can you fly? teleport?) Takes 5 damage. Additionally, the flames obstruct vision granting a +1 Bane on attacks and perception checks through the wall ',
      selectableFeatureListId: 4,
      requiredSelectableFeatureId: 7,
      uses: 1,
      actionType: ActionType.STANDARD,
    },
    {
      id: 34,
      name: 'Freeze',
      description:
        'Pick a target up to medium range. Target takes 4 damage. The target is also locked in Ice. Whilst in this state they lose all action points and cant gain them, they cant act in any way, they have resistance to all damage.   Lasts till resolve   The target is allowed a physique save with 1 Bane. In success damage is halved and the target is not encased ',
      selectableFeatureListId: 4,
      requiredSelectableFeatureId: 8,
      uses: 1,
      actionType: ActionType.STANDARD,
    },
    {
      id: 35,
      name: 'Encase',
      description:
        'You encase yourself on a coffin of ice. Whilst in this coffin you cant act or effect the world around you. You are immune to all damage bar entropic.   This can be used as a reaction after having taken damage   Last till resolve or you choose to drop it. ',
      selectableFeatureListId: 4,
      requiredSelectableFeatureId: 8,
      uses: 1,
      actionType: ActionType.REACTION,
    },
    {
      id: 36,
      name: 'Brittle Ice',
      description:
        'Pick a target up to Long range. Target takes 6 damage and is brittle till resolve.   Brittle targets take an extra 1d6 damage from all sources.   The target gets a Physique save with 1 bane. On success, the damage is halved and the target is not brittle. ',
      selectableFeatureListId: 4,
      requiredSelectableFeatureId: 8,
      uses: 3,
      actionType: ActionType.STANDARD,
    },
    {
      id: 37,
      name: 'Ice Storm',
      description:
        'Pick a zone up top long range. This target all creatures in the zone   Targets take 6/2 damage and are knocked prone.   Targets get an Agility save on success the damage is halved and they are no knocked prone.   The zone becomes difficult terrain till end of combat. ',
      selectableFeatureListId: 4,
      requiredSelectableFeatureId: 8,
      uses: 1,
      actionType: ActionType.STANDARD,
    },
    {
      id: 38,
      name: 'Flame Blade',
      description:
        'You conjure a sword made of flame(5/3, finesse). This produces warmth and light, and can easily be used to start fires. Lasts till resolve (+2 Boon) This can be used to start fires and provides illumination at short range',
      selectableFeatureListId: 3,
      requiredSelectableFeatureId: 7,
      uses: 3,
      actionType: ActionType.MINOR,
    },
    {
      id: 39,
      name: 'Pyrotechnics',
      description:
        'You throw out a blast of fireworks at a zone up to long range. This is a bright flash of light and sound. All in the zone must make an Intellect Save. On fail they lose 1 Action point and are blinded until the end of their next phase.',
      selectableFeatureListId: 3,
      requiredSelectableFeatureId: 7,
      uses: 1,
      actionType: ActionType.STANDARD,
    },

    {
      id: 40,
      name: 'Skirmisher',
      description:
        'You can disengage as a minor action. In addition, if you change zone before attacking, you gain +1 Boon to your attack and ignore light cover',
      selectableFeatureListId: 7,
    },
    {
      id: 41,
      name: 'Marksman',
      description:
        'You gain +1 boon to attacks at medium range or greater. You cannot dodge.',
      selectableFeatureListId: 7,
    },
    {
      id: 42,
      name: 'Overwatch',
      description:
        'Enemies that move trigger an attack of opportunity. Taking this attack instantly ends the stance (Special: Overwatch lasts till it used, you move or change stances, no resolve checks required)',
      selectableFeatureListId: 7,
    },
    {
      id: 43,
      name: 'Defenders',
      description:
        'Attacks against you have +1 Bane and you gain +1 Boon on dodge attempts. Your attacks have +1 Bane.',
      selectableFeatureListId: 7,
    },
    {
      id: 44,
      name: 'Tactical',
      description:
        'You get +2 to Tactical Surge Checks. This ends as soon as you successfully tactical surge',
      selectableFeatureListId: 7,
    },
    {
      id: 45,
      name: 'Auto Support',
      description:
        'You brace well and get the most out of burst fire. All burst fire gets an additional +1 damage bonus. In addition, the “Brace” feature has its penalty reduced by 1 (i.e. 1 Bane instead of 2). You cannot use the aim action.',
      selectableFeatureListId: 7,
    },
    {
      id: 46,
      name: 'Grenadier',
      description:
        'When using grenade weapons (or other explosive attacks) the saving throw made by targets gets +1 bane',
      selectableFeatureListId: 7,
    },
    {
      id: 47,
      name: 'Gun Slinger',
      description:
        'You when using dual ranged weapons, if you strike a foe with both weapons in the same turn, the target takes an additional 1d6 from each attack',
      selectableFeatureListId: 7,
    },
  ];

  for (const feature of selectableFeatures) {
    const { id, ...featureData } = feature;
    await prisma.selectableFeature.upsert({
      where: { id },
      update: featureData,
      create: { id, ...featureData },
    });
  }

  console.log('Static data seeding finished.');
  console.log('Note: Dynamic data (creatures, etc.) was preserved.');
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
