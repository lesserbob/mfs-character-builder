import {
  PrismaClient,
  ClassClassification,
  ClassFeatureType,
} from '@prisma/client';

export async function seedClasses(prisma: PrismaClient) {
  // Upsert Classes
  console.log('Upserting Classes...');
  const classes = [
    { id: 1, name: 'Human', classification: ClassClassification.RACE },
    {
      id: 2,
      name: 'Stormer(Malice)',
      classification: ClassClassification.RACE,
      minMight: 2,
    },
    { id: 3, name: 'Warrior', classification: ClassClassification.PATH },
    {
      id: 4,
      name: 'Ebonite',
      classification: ClassClassification.RACE,
      minIntellect: 1,
      minSpirit: 1,
    },
    { id: 5, name: 'Ebb Master', classification: ClassClassification.PATH },
    { id: 6, name: 'Soldier', classification: ClassClassification.PATH },
    {
      id: 7,
      name: 'Frother',
      classification: ClassClassification.RACE,
      minMight: 1,
      minAgility: 1,
    },
    {
      id: 8,
      name: 'Wraithen',
      classification: ClassClassification.RACE,
      minAgility: 2,
    },
    { id: 9, name: 'Specialist', classification: ClassClassification.PATH },
    {
      id: 10,
      name: 'Shakter',
      classification: ClassClassification.RACE,
      minMight: 1,
      minSpirit: 1,
    },
    {
      id: 11,
      name: 'Neophron',
      classification: ClassClassification.RACE,
      minIntellect: 2,
    },
    { id: 12, name: 'Leader', classification: ClassClassification.PATH },
    {
      id: 13,
      name: 'Stormer(Xeno)',
      classification: ClassClassification.RACE,
      minAgility: 2,
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

  // Upsert Class Levels
  console.log('Upserting Class Levels...');
  const classLevels = [
    // Human
    { id: 1, classId: 1, level: 1, health: 11, statBonus: 0 },
    { id: 3, classId: 1, level: 4, health: 2, statBonus: 2 },
    { id: 4, classId: 1, level: 7, health: 2, statBonus: 3 },
    // Stormer(Malice)
    { id: 2, classId: 2, level: 1, health: 13, statBonus: 0 },
    { id: 16, classId: 2, level: 4, health: 3, statBonus: 2 },
    { id: 17, classId: 2, level: 7, health: 3, statBonus: 3 },
    // Warrior
    { id: 5, classId: 3, level: 2, health: 3, statBonus: 0 },
    { id: 6, classId: 3, level: 3, health: 3, statBonus: 0 },
    { id: 7, classId: 3, level: 5, health: 3, statBonus: 0 },
    { id: 8, classId: 3, level: 8, health: 3, statBonus: 0 },
    // Ebonite
    { id: 9, classId: 4, level: 1, health: 9, statBonus: 0 },
    { id: 10, classId: 4, level: 4, health: 1, statBonus: 2 },
    { id: 11, classId: 4, level: 7, health: 1, statBonus: 3 },
    // Ebb Master
    { id: 12, classId: 5, level: 2, health: 1, statBonus: 0 },
    { id: 13, classId: 5, level: 3, health: 1, statBonus: 0 },
    { id: 14, classId: 5, level: 5, health: 1, statBonus: 0 },
    { id: 15, classId: 5, level: 8, health: 1, statBonus: 0 },
    // Soldier
    { id: 18, classId: 6, level: 2, health: 2, statBonus: 0 },
    { id: 19, classId: 6, level: 3, health: 2, statBonus: 0 },
    { id: 20, classId: 6, level: 5, health: 2, statBonus: 0 },
    { id: 21, classId: 6, level: 8, health: 2, statBonus: 0 },
    // Frother
    { id: 22, classId: 7, level: 1, health: 12, statBonus: 0 },
    { id: 23, classId: 7, level: 4, health: 2, statBonus: 2 },
    { id: 24, classId: 7, level: 7, health: 2, statBonus: 3 },
    // Wraithen
    { id: 25, classId: 8, level: 1, health: 10, statBonus: 0 },
    { id: 26, classId: 8, level: 4, health: 2, statBonus: 2 },
    { id: 27, classId: 8, level: 7, health: 2, statBonus: 3 },
    // Specialist
    { id: 28, classId: 9, level: 2, health: 2, statBonus: 0 },
    { id: 29, classId: 9, level: 3, health: 2, statBonus: 0 },
    { id: 30, classId: 9, level: 5, health: 2, statBonus: 0 },
    { id: 31, classId: 9, level: 8, health: 2, statBonus: 0 },
    // Shaktar
    { id: 32, classId: 10, level: 1, health: 12, statBonus: 0 },
    { id: 33, classId: 10, level: 4, health: 2, statBonus: 2 },
    { id: 34, classId: 10, level: 7, health: 2, statBonus: 3 },
    // Neophron
    { id: 35, classId: 11, level: 1, health: 10, statBonus: 0 },
    { id: 36, classId: 11, level: 4, health: 1, statBonus: 2 },
    { id: 37, classId: 11, level: 7, health: 1, statBonus: 3 },
    // Leader
    { id: 38, classId: 12, level: 2, health: 2, statBonus: 0 },
    { id: 39, classId: 12, level: 3, health: 2, statBonus: 0 },
    { id: 40, classId: 12, level: 5, health: 2, statBonus: 0 },
    { id: 41, classId: 12, level: 8, health: 2, statBonus: 0 },
    // Stormer (Xeno)
    { id: 42, classId: 13, level: 1, health: 11, statBonus: 0 },
    { id: 43, classId: 13, level: 4, health: 2, statBonus: 2 },
    { id: 44, classId: 13, level: 7, health: 2, statBonus: 3 },
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
    {
      id: 44,
      name: 'Knowing the Clans',
      description:
        'All apptitude checks related to clans get +1 Boon. Checks related to your own clan get +2',
      classLevelId: 22,
      type: ClassFeatureType.BASE,
      display: true,
    },
    {
      id: 45,
      name: 'Magic Time',
      description:
        'Any time you fail a resolve check to continue an active drugs effect, or fail a crash check, you can spend a point of momentum to turn the result into a success.',
      classLevelId: 22,
      type: ClassFeatureType.BASE,
      display: true,
    },
    {
      id: 46,
      name: 'Frothy',
      description:
        'When under the effects of at least one drug(excluding crash effects), you also go into a blind rage. You get +2 damage to all attacks and +5 max and current endurance.',
      classLevelId: 23,
      type: ClassFeatureType.BASE,
      display: true,
    },
    {
      id: 47,
      name: 'Clan Supplier',
      description:
        'Wealth cost of drugs is reduced. If you have at least 1 drug your misecallneous item count is reduced by 1.',
      classLevelId: 24,
      type: ClassFeatureType.BASE,
      display: true,
    },
    {
      id: 48,
      name: 'Survivor',
      description:
        'When you make a saving throw or dodge check you can spend a point of momentum to gain +2 Boons on that save.',
      classLevelId: 25,
      type: ClassFeatureType.BASE,
      display: true,
    },
    {
      id: 49,
      name: 'Danger Sense',
      description:
        'Whenever you make an aptitude roll which is to avoid danger (e.g. perception vs ambush, persuasion to avoid a fight) you get +1 Adv.',
      classLevelId: 25,
      type: ClassFeatureType.BASE,
      display: true,
    },
    {
      id: 50,
      name: 'Run away!',
      description:
        'When a creature would engage with you, you can make a Agility(Aptitude) check. On success, you have a right to take the move action as a reaction, allowing you to leave the zone and deny the attacker.',
      classLevelId: 26,
      type: ClassFeatureType.BASE,
      display: true,
    },
    {
      id: 51,
      name: 'Speed Demon',
      description:
        'Once per round you can take the "change zone” action on your turn as a free action. This does not count toward your limit on move actions.',
      classLevelId: 27,
      type: ClassFeatureType.BASE,
      display: true,
    },
    {
      id: 52,
      name: 'Application',
      description:
        'You can, as a free action, spend a point of momentum to grant yourself +1 Boon to an aptitude check, attack roll or dodge roll. If applied to an attack, you also get +1d6 damage.',
      classLevelId: 28,
      type: ClassFeatureType.BASE,
      display: true,
    },
    {
      id: 53,
      name: 'Handy Trick',
      description:
        'You have access to handy tricks, Pick one at level 2 and another at level 5.',
      classLevelId: 28,
      type: ClassFeatureType.SELECT,
      display: true,
      selectableFeatureListId: 8,
      selectableFeatureCount: 1,
    },
    {
      id: 54,
      name: 'Expert Escape',
      description:
        'When you use the second wind action you can take another action that would be a move action as a free action. This is limited to disengage and change zone actions',
      classLevelId: 29,
      type: ClassFeatureType.BASE,
      display: true,
    },
    {
      id: 55,
      name: 'Professional',
      description: 'Pick a stat. All aptitude rolls with that stat get +1 Boon',
      classLevelId: 29,
      type: ClassFeatureType.SELECT,
      display: true,
      selectableFeatureListId: 9,
      selectableFeatureCount: 1,
    },
    {
      id: 56,
      name: 'Another Handy Trick',
      description: 'Pick another',
      classLevelId: 30,
      type: ClassFeatureType.SELECT,
      display: false,
      selectableFeatureListId: 8,
      selectableFeatureCount: 1,
    },
    {
      id: 57,
      name: 'Uncanny Dodge',
      description:
        'When you dodge attacks against you get +1 Bane till the start of the party phase. This does not stack',
      classLevelId: 31,
      type: ClassFeatureType.BASE,
      display: true,
    },
    {
      id: 58,
      name: 'Shaktars Honor',
      description:
        'Free action when a nearby ally is attacked by a creature it is not engaged with. Spend a momentum point and the attack is redirected to you in the same way as an intercept. Till end of round you gain a +1 Boon and +1d6 damage when attacking the attacker',
      classLevelId: 32,
      type: ClassFeatureType.BASE,
      display: true,
    },
    {
      id: 59,
      name: 'Helpful',
      description:
        'When making an aptitude check and it is solely to aid another without benefit to self, Gain +1 Boon',
      classLevelId: 32,
      type: ClassFeatureType.BASE,
      display: true,
    },
    {
      id: 60,
      name: 'Shaktarian Courage',
      description: 'Gain +2 Boons to Spirit Saves vs fear effects',
      classLevelId: 33,
      type: ClassFeatureType.BASE,
      display: true,
    },
    {
      id: 61,
      name: 'Avenge the fallen',
      description:
        'If an ally is ever reduced to zero health and falls unconscious and is dieing, you gain a +2 to Tactical Surge checks. This benefit stacks and lasts till end of the current situation. This can be applied once per ally',
      classLevelId: 34,
      type: ClassFeatureType.BASE,
      display: true,
    },
    {
      id: 62,
      name: 'Neophron Alertness',
      description:
        'You get +2 Boons to perception checks to avoid ambushes. In addition, Until you have finished a turn (not including surprise round actions if you took one) you can spend a point of momentum to get an automatic tactical surge without needing to roll and with no penalty to subsequent rolls',
      classLevelId: 35,
      type: ClassFeatureType.BASE,
      display: true,
    },
    {
      id: 63,
      name: 'Damned Clever',
      description: 'You get +1 boons to all intellect aptitude checks',
      classLevelId: 35,
      type: ClassFeatureType.BASE,
      display: true,
    },
    {
      id: 64,
      name: 'Spot the weakness',
      description: 'When making attacks, +1 threat on attacks',
      classLevelId: 36,
      type: ClassFeatureType.BASE,
      display: true,
    },
    {
      id: 65,
      name: 'Damned Damned Clever',
      description: 'Increase bonus on intellect apptitude checks to +2',
      classLevelId: 36,
      type: ClassFeatureType.BASE,
      display: true,
    },
    {
      id: 66,
      name: 'Genius',
      description:
        'In addition to all other benefits, when making an Intellect aptitude check, roll the d20 twice and take the better result',
      classLevelId: 37,
      type: ClassFeatureType.BASE,
      display: true,
    },
    // 38-41
    {
      id: 67,
      name: 'Aid Ally',
      description:
        'As a reaction can spend a point of momentum to grant an ally a boon to an attack roll, saving throw, dodge or aptitude check',
      classLevelId: 38,
      type: ClassFeatureType.BASE,
      display: true,
    },
    {
      id: 68,
      name: 'Inspiring Presence',
      description:
        'Unique action. As a minor action you can grant one ally to recover 3 endurance. This can be done at most once per turn. This increases to 4 at 3rd and 5 at fifth',
      classLevelId: 38,
      type: ClassFeatureType.BASE,
      display: true,
    },
    {
      id: 69,
      name: 'Shared recovery',
      description:
        'When you take the second wind action, pick an ally in close range. That ally also recovers endurance as if it had used its second wind',
      classLevelId: 39,
      type: ClassFeatureType.BASE,
      display: true,
    },
    {
      id: 70,
      name: 'Improved Inspiring Presence',
      description: 'Now 4',
      classLevelId: 39,
      type: ClassFeatureType.BASE,
      display: false,
    },
    {
      id: 71,
      name: 'Tactical Presence',
      description: 'You and All nearby allies get +1 to Tactical Surge checks',
      classLevelId: 40,
      type: ClassFeatureType.BASE,
      display: true,
    },
    {
      id: 72,
      name: 'Master Inspiring Presence',
      description: 'Now 5',
      classLevelId: 40,
      type: ClassFeatureType.BASE,
      display: false,
    },
    {
      id: 73,
      name: 'Wolf pack tactics',
      description:
        'In the same turn as you have attacked a target, you can spend a minor action to make that target draw an AOP from one designated ally. The ally must be near you or the target',
      classLevelId: 41,
      type: ClassFeatureType.BASE,
      display: true,
    },
    {
      id: 74,
      name: 'Shroud',
      description:
        'As a minor action, spend a point of momentum to become nearly invisible, an active camouflage. You cannot be targeted at long or extreme range and detecting you requires a detection action with +3 Bane. This lasts one minute and requires you are not wearing heavy armor. Any interaction with environment (including attacks) ends the invisibility',
      classLevelId: 42,
      type: ClassFeatureType.BASE,
      display: true,
    },
    {
      id: 75,
      name: 'Night walker',
      description: '+2 Boon to Agility(Stealth) checks',
      classLevelId: 42,
      type: ClassFeatureType.BASE,
      display: true,
    },
    {
      id: 76,
      name: 'Night killer',
      description: 'When attacking from surprise you gain +1d6 damage',
      classLevelId: 43,
      type: ClassFeatureType.BASE,
      display: true,
    },
    {
      id: 77,
      name: 'Night sights',
      description:
        'You have no banes to perception checks due to poor lighting, nor would an opposing creature get boon on stealth due to poor lighting vs you',
      classLevelId: 44,
      type: ClassFeatureType.BASE,
      display: true,
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
}
