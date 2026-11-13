/* Job Board default tables (content v3: expanded quirks, places, items, names) */
const DEFAULT_JOB_TABLES={
 "version": 4,
 "tiers": [
  "Iron",
  "Bronze",
  "Silver",
  "Gold",
  "Platinum"
 ],
 "jobTypes": {
  "Fetch": [
   20,
   14,
   8,
   5,
   3
  ],
  "Extermination": [
   18,
   14,
   10,
   8,
   6
  ],
  "Escort": [
   14,
   12,
   10,
   8,
   6
  ],
  "Investigation": [
   12,
   14,
   14,
   12,
   10
  ],
  "Hunt": [
   12,
   14,
   14,
   14,
   12
  ],
  "Rescue": [
   10,
   10,
   12,
   12,
   12
  ],
  "Diplomacy": [
   6,
   8,
   12,
   14,
   14
  ],
  "Heist": [
   4,
   8,
   10,
   12,
   12
  ],
  "World Crisis": [
   1,
   3,
   6,
   10,
   15
  ]
 },
 "sizes": {
  "weights": [
   [
    50,
    40,
    10
   ],
   [
    35,
    45,
    20
   ],
   [
    30,
    45,
    25
   ],
   [
    25,
    45,
    30
   ],
   [
    20,
    45,
    35
   ]
  ],
  "names": [
   "Small",
   "Standard",
   "Major"
  ],
  "blurb": {
   "Small": "one session, ~1 fight",
   "Standard": "1–2 sessions",
   "Major": "multi-session arc"
  },
  "goldMult": {
   "Small": 0.5,
   "Standard": 1,
   "Major": 2.5
  },
  "contribution": {
   "Small": 1,
   "Standard": 3,
   "Major": 8
  }
 },
 "locations": {
  "names": [
   "The City (base bazaar)",
   "Inside the Tree",
   "The Roots",
   "A nearby world",
   "A distant world",
   "A strange, far-flung world"
  ],
  "weights": [
   [
    25,
    20,
    8,
    40,
    7,
    0
   ],
   [
    15,
    15,
    10,
    42,
    16,
    2
   ],
   [
    8,
    10,
    10,
    40,
    27,
    5
   ],
   [
    5,
    8,
    10,
    30,
    32,
    15
   ],
   [
    3,
    5,
    10,
    20,
    37,
    25
   ]
  ]
 },
 "fantasyShare": {
  "iron": 0.8,
  "platinum": 0.6
 },
 "genres": {
  "fantasy": {
   "High fantasy": {
    "w": 40,
    "places": [
     "a river kingdom",
     "an elven forest-realm",
     "a mountain dwarfhold",
     "a sprawling wizard-republic",
     "a kingdom of floating isles",
     "a city of white towers and ancient wards",
     "an elven forest older than its kingdoms",
     "a dwarven hold carved into a living mountain",
     "a crossroads kingdom with seven rival heirs",
     "a coast of sleeping dragons",
     "a valley where the gods once walked",
     "a wizard-ruled archipelago"
    ],
    "quirks": [
     "the royal wizards tax every spell cast inside city walls",
     "knighthood is granted by a talking sword that is very picky",
     "river spirits demand a loaf of bread at every bridge",
     "dragons are a protected species, to everyone's annoyance",
     "the king's heralds sing every proclamation, badly",
     "griffon-post beats the roads, but the griffons just unionized",
     "the old gods answer prayers, just slowly",
     "every family has a heraldic beast, and some are real",
     "knights must keep a vow or lose their armor's shine",
     "dragons pay taxes, grudgingly",
     "elves remember everything and forgive nothing",
     "the stars spell out prophecies anyone can read",
     "bards are legally required to tell the truth",
     "rings of power are surprisingly common and mostly useless",
     "heroes are licensed and there's a waiting list",
     "griffons are the local post"
    ],
    "fill": {
     "spot": [
      "a ruined elven shrine",
      "the king's old hunting lodge",
      "a goblin-infested mine",
      "a wizard's abandoned tower",
      "a ruined watchtower",
      "an elven waystone circle",
      "a dragon's abandoned lair"
     ],
     "beast": [
      "owlbear",
      "wyvern",
      "young green dragon",
      "feral griffon",
      "young blue dragon",
      "chimera",
      "griffon pride",
      "stone giant",
      "wyvern matriarch"
     ],
     "pests": [
      "goblins",
      "kobolds",
      "giant spiders",
      "kobold diggers",
      "stirges"
     ],
     "item": [
      "a knight's lost signet",
      "a runaway spellbook",
      "an enchanted harp",
      "a wizard's lost spellbook",
      "a dwarven runestone",
      "a knight's oathblade"
     ],
     "person": [
      "a squire on his first errand",
      "an elven envoy",
      "a hedge-wizard's apprentice",
      "a hedge knight",
      "a dragon-scholar"
     ]
    }
   },
   "Low fantasy / medieval": {
    "w": 15,
    "places": [
     "a mud-and-timber valley",
     "a feuding border march",
     "a market town",
     "a fen of stilt villages",
     "a muddy river kingdom at war with itself",
     "a monastery town on a pilgrim road",
     "a mining valley owned by one family",
     "a market city ruled by guilds",
     "a frontier barony on the edge of the wilds",
     "a plague-scarred county recovering slowly"
    ],
    "quirks": [
     "the local lord owns every road and charges by the hoof",
     "the harvest festival is mandatory, and the fines are steep",
     "everyone blames witches, and one of them actually is one",
     "the miller is the richest man in three valleys and acts like it",
     "nobody trusts coin, so goats change hands instead",
     "bread is currency when coin runs short",
     "the church keeps the only clocks",
     "anyone who can read is assumed to be a witch",
     "harvest festivals settle every grudge with a wrestling match",
     "the lord's word is law until the next lord",
     "wolves are hunted for bounties that never get paid",
     "tolls are charged on every bridge, even tiny ones",
     "people trust saints' relics more than doctors",
     "travelling players carry all the news",
     "a bad winter is coming and everyone knows it"
    ],
    "fill": {
     "spot": [
      "the lord's tithe barn",
      "a bog-side shrine",
      "the old mill",
      "a bandit-held toll bridge",
      "the abbey cellars",
      "the toll bridge"
     ],
     "beast": [
      "dire wolf",
      "boar of unusual size",
      "bog troll",
      "bandit-trained war dogs",
      "cave bear",
      "wolf pack",
      "ogre"
     ],
     "pests": [
      "bandits",
      "giant rats",
      "wolves",
      "poachers",
      "rat swarms",
      "boar"
     ],
     "item": [
      "the village tithe chest",
      "a holy relic (probably a pig bone)",
      "the lord's seal",
      "a parish ledger",
      "a sealed letter of pardon",
      "a saint's finger bone"
     ],
     "person": [
      "the miller's daughter",
      "a traveling friar",
      "the reeve",
      "a reeve",
      "a runaway apprentice",
      "a tax collector"
     ]
    }
   },
   "Dark fantasy / grimdark": {
    "w": 10,
    "places": [
     "a cathedral city under martial law",
     "a land of endless dusk",
     "a war-scarred duchy",
     "a vampire-tithed province",
     "a city built inside a dead god",
     "a marsh of hanged witches",
     "a fortress that has never stopped being besieged",
     "a land under a sun that never fully rises",
     "a plague city behind walls",
     "a cathedral-state ruled by inquisitors"
    ],
    "quirks": [
     "the church sells indulgences against monster attacks",
     "curfew bells ring at dusk and nobody asks about latecomers",
     "graves are padlocked by law",
     "the nobles drink something red at every banquet and call it wine",
     "the sun hasn't fully risen in a generation, so lanterns are taxed",
     "mercy is considered a weakness",
     "the dead must be burned within a day or they rise",
     "every oath is binding, literally",
     "the nobility drink blood and call it tradition",
     "bells ring for each death, and they never stop",
     "hope is a banned word in some districts",
     "debts pass to your children, and theirs",
     "the church sells indulgences for crimes not yet committed",
     "shadows sometimes stay behind when people leave",
     "the rain is warm and slightly red"
    ],
    "fill": {
     "spot": [
      "a padlocked graveyard",
      "the inquisition's cellars",
      "a plague-sealed district",
      "a burned chapel",
      "the charnel pits",
      "the gallows hill",
      "the inquisition's archive"
     ],
     "beast": [
      "ghoul pack leader",
      "wight",
      "vampire spawn",
      "wraith",
      "ghoul pack",
      "wight lord",
      "flesh golem",
      "night hag"
     ],
     "pests": [
      "ghouls",
      "zombies",
      "cultists",
      "carrion crows that talk",
      "plague rats"
     ],
     "item": [
      "a saint's finger-bone",
      "a forbidden prayer book",
      "the inquisitor's ledger",
      "a martyr's heart in a reliquary",
      "a cursed crown",
      "a list of the condemned"
     ],
     "person": [
      "a condemned heretic",
      "a gravedigger's son",
      "a disgraced paladin",
      "a repentant torturer",
      "a plague doctor",
      "an orphan with sight"
     ]
    }
   },
   "Fey / whimsical": {
    "w": 8,
    "places": [
     "a realm ruled by rival seasonal courts",
     "a mushroom-cap country",
     "a storybook kingdom",
     "a candy-glass archipelago",
     "a teacup kingdom ruled by a mouse queen",
     "a forest where the seasons argue",
     "a giant's garden turned into a country",
     "a carnival that never closes",
     "a moonlit court of masks",
     "a river that flows uphill on Tuesdays"
    ],
    "quirks": [
     "the seasons change whenever the rival courts lose a bet",
     "promises are legally binding, even in jest",
     "names are currency, so everyone uses fake ones",
     "the mushrooms vote, and they're stubbornly conservative",
     "time runs differently on either side of every hedge",
     "names have power, so everyone uses nicknames",
     "gifts must be repaid in kind, or else",
     "time runs differently for every visitor",
     "lying is impossible, so everyone is very creative",
     "mushrooms are citizens",
     "the weather reflects the queen's mood",
     "all roads lead to a tea party eventually",
     "shadows can be traded",
     "laughter is a currency",
     "every door is a riddle"
    ],
    "fill": {
     "spot": [
      "the Summer Court's hedge-maze",
      "a mushroom ring",
      "a pond that reflects tomorrow",
      "the Winter Queen's ice garden",
      "the Hall of Mirrors",
      "a hedge maze that moves"
     ],
     "beast": [
      "displacer beast",
      "will-o'-wisp",
      "green hag",
      "owlbear in a ruff collar",
      "will-o'-wisp swarm"
     ],
     "pests": [
      "pixies (very rude)",
      "quicklings",
      "twig blights",
      "mischievous sprites",
      "biting blink dogs",
      "enchanted brooms"
     ],
     "item": [
      "a bottled laugh",
      "a borrowed name",
      "the Autumn Prince's crown",
      "a crown of dew",
      "the queen's lost shadow"
     ],
     "person": [
      "a changeling child",
      "a satyr bard",
      "a mortal who ate fey food",
      "a lovesick satyr",
      "a pixie diplomat"
     ]
    }
   },
   "Swashbuckling / nautical": {
    "w": 6,
    "places": [
     "an island chain of pirate republics",
     "a sky-sea of airship ports",
     "a coral-city archipelago",
     "an island chain ruled by pirate lords",
     "a floating city of lashed-together ships",
     "a jungle port with three flags",
     "a storm sea full of ghost lights",
     "a merchant republic of canals",
     "a kraken-haunted strait"
    ],
    "quirks": [
     "every captain is technically a pirate, it just depends on the paperwork",
     "the sea demands a song as toll at the reef gates",
     "ports elect harbormasters by drinking contest",
     "the tides follow a sleeping sea serpent's breathing",
     "maps are illegal, so navigators memorize everything",
     "the navy and the pirates are the same people on different days",
     "a ship's name is sacred; renaming one is a crime",
     "mermaids run the best banks",
     "everyone has a treasure map, and most are fake",
     "parrots are licensed witnesses",
     "the tide schedule decides when courts meet",
     "duels at dawn are a social event",
     "rum is safer to drink than water",
     "the sea goddess takes one in ten ships, fairly",
     "maps are drawn on tattoos"
    ],
    "fill": {
     "spot": [
      "a smuggler's sea cave",
      "a sunken galleon",
      "a reef-ringed island",
      "the free port's harbor",
      "the smugglers' cove",
      "a sunken temple",
      "the harbor fort"
     ],
     "beast": [
      "giant octopus",
      "sea hag",
      "merrow chieftain",
      "plesiosaurus",
      "kraken spawn",
      "giant shark",
      "dragon turtle hatchling",
      "sea serpent"
     ],
     "pests": [
      "sahuagin raiders",
      "pirates",
      "giant crabs",
      "bilge rats",
      "harpies"
     ],
     "item": [
      "a letter of marque",
      "a cursed compass",
      "a chest of salt-crusted gold",
      "a ship's figurehead with a secret",
      "the captain's sextant"
     ],
     "person": [
      "a shipwrecked noble",
      "a cabin boy who saw too much",
      "a retired privateer",
      "a stowaway noble",
      "a disgraced admiral",
      "a cartographer with one eye"
     ]
    }
   }
  },
  "other": {
   "Steampunk / gaslamp": {
    "w": 6,
    "places": [
     "a brass canal city",
     "a smog-wrapped industrial empire",
     "a clockwork guild-state",
     "a smog-choked industrial capital",
     "an airship port above the clouds",
     "a clockwork city that must be wound daily",
     "a gaslit metropolis of rival inventors",
     "a rail empire crossing a desert",
     "a mining colony under a dome"
    ],
    "quirks": [
     "clockwork constables ticket anyone loitering near machinery",
     "every guild holds a patent on something you need",
     "the smog is so thick that streets are named by smell",
     "airship mail is reliable except on Tuesdays (union rules)",
     "the city's great engine must be wound by hand each dawn",
     "patents are enforced by duel",
     "steam pressure is a civic obsession",
     "automatons have unionized",
     "the gentry wear goggles as jewelry",
     "every lamplighter belongs to a secret society",
     "the trains always run on time, even when they shouldn't",
     "ghosts can be captured with the right valve",
     "tea is served at every negotiation, even hostage ones",
     "the sky is crowded with private airships",
     "the Queen is half machine and no one mentions it"
    ],
    "fill": {
     "spot": [
      "a boiler works",
      "the airship docks",
      "a sealed patent-office vault",
      "the canal locks",
      "the foundry district",
      "an airship dry-dock",
      "the patent office vault"
     ],
     "beast": [
      "rogue iron golem",
      "clockwork spider",
      "escaped lab chimera",
      "rogue steam golem",
      "sky-squid",
      "brass dragon automaton"
     ],
     "pests": [
      "haywire modrons",
      "brass-plated sewer rats",
      "mechanical vermin",
      "sewer gremlins",
      "rust mites",
      "mechanical rats"
     ],
     "item": [
      "a stolen blueprint",
      "a prototype aether-cell",
      "an inventor's diary",
      "a prototype engine core",
      "stolen schematics",
      "a pocketwatch that stops time"
     ],
     "person": [
      "an eccentric inventor",
      "a chimney-sweep child",
      "a factory whistleblower",
      "a mad inventor",
      "a chimney-sweep informant",
      "a lady detective"
     ]
    }
   },
   "Frontier / weird west": {
    "w": 4,
    "places": [
     "a mana-rush frontier town",
     "a railroad-cut badland",
     "a mesa country of ghost towns",
     "a gold-rush town on cursed land",
     "a railroad camp at the edge of the map",
     "a canyon of talking stones",
     "a ghost town that still has a mayor",
     "a salt flat where mirages are solid",
     "a mesa ruled by a preacher with a hidden past"
    ],
    "quirks": [
     "mana-rich ore turned every prospector into a hedge-wizard",
     "the railroad company owns the sheriff",
     "duels are legal, but the paperwork is brutal",
     "the dead don't always stay buried in the badlands",
     "water is worth more than gold out here",
     "the sheriff's star grants real authority over the dead",
     "silver bullets are legal tender",
     "coyotes carry messages between outlaws",
     "the stagecoach is the only safe road",
     "every saloon has a piano that plays itself",
     "rain hasn't fallen in seven years",
     "the railroad company owns the water",
     "spirits demand a toll at every river",
     "duels are resolved by the crowd's vote",
     "the desert keeps what it buries, mostly"
    ],
    "fill": {
     "spot": [
      "a played-out mana mine",
      "the rail camp",
      "a ghost-town saloon",
      "a mesa-top shrine",
      "the abandoned mine",
      "the railroad trestle",
      "the saloon's back room"
     ],
     "beast": [
      "bulette",
      "giant eagle (thunderbird)",
      "ankheg",
      "thunderbird",
      "dust devil elemental",
      "giant scorpion",
      "wendigo"
     ],
     "pests": [
      "claim jumpers",
      "giant scorpions",
      "outlaws",
      "claim-jumpers",
      "rattlesnake swarms",
      "bone-dry zombies"
     ],
     "item": [
      "a mining claim deed",
      "a payroll strongbox",
      "a medicine bundle",
      "a deed to a gold claim",
      "a sacred medicine bundle",
      "a wanted poster with a secret"
     ],
     "person": [
      "a rail surveyor",
      "a frontier marshal",
      "a prospector's widow",
      "a deputy in over their head",
      "a snake-oil salesman",
      "a lost prospector"
     ]
    }
   },
   "Post-apocalyptic": {
    "w": 4,
    "places": [
     "the ruins of a world that already died once",
     "a fungal wasteland",
     "a drowned-coast salvage town",
     "a ruined city reclaimed by forest",
     "a bunker society that just opened its doors",
     "a caravan town crossing the wastes",
     "a flooded megacity of rooftop villages",
     "a crater where the end began",
     "a fortress built from old highway"
    ],
    "quirks": [
     "the old world's machines still run, but nobody knows what for",
     "clean water is the only currency anyone trusts",
     "settlements trade by radio, mostly in riddles",
     "the ash storms keep a schedule, sort of",
     "scavengers revere the old world's vending machines",
     "clean water is the only real currency",
     "old-world tech is worshipped",
     "the sky glows green after dark",
     "everyone has a tattoo showing their vault or tribe",
     "children have never seen a bird",
     "music from before is sacred",
     "radiation storms roll in like weather",
     "the dead stay dead, mostly",
     "trading posts never ask where things came from",
     "the old maps are lies"
    ],
    "fill": {
     "spot": [
      "a collapsed transit tunnel",
      "a scrap-walled settlement",
      "an old-world bunker",
      "the ash dunes",
      "the dead mall",
      "a collapsed overpass",
      "the old reactor"
     ],
     "beast": [
      "mutated owlbear",
      "gorgon",
      "purple worm",
      "mutant bear",
      "sand wurm",
      "scrap golem",
      "rad-wolf pack"
     ],
     "pests": [
      "raiders",
      "ghouls",
      "giant mutant insects",
      "giant roaches",
      "feral drones"
     ],
     "item": [
      "a working water purifier",
      "an old-world keycard",
      "a cache of seed stock",
      "a sealed seed vault key",
      "an old-world data disk"
     ],
     "person": [
      "a scavenger kid",
      "a settlement doctor",
      "a bunker-born archivist",
      "a vault-born scout",
      "a scavenger king",
      "a doctor with real medicine"
     ]
    }
   },
   "Planar / elemental": {
    "w": 3,
    "places": [
     "a world made of slow fire",
     "a sky of drifting earth-motes",
     "an ocean with no surface",
     "a city of brass on a sea of fire",
     "an island of solid wind",
     "an earth-plane maze of crystal",
     "a market at the crossroads of four elements",
     "a demiplane shaped like a library"
    ],
    "quirks": [
     "fire elementals run the bureaucracy, and it shows",
     "gravity is a suggestion near the motes",
     "everyone carries a warding charm or ends up as weather",
     "the lava rivers are polite but strict about trespassing",
     "efreeti merchants haggle as a form of greeting",
     "gravity points toward the nearest strong emotion",
     "genies own most of the property",
     "fire is a citizen with rights",
     "contracts are written in the air and stay there",
     "the elements hold elections",
     "every visitor gains a minor elemental trait",
     "stone remembers what's said near it",
     "time is measured in tides of flame",
     "mortals need a sponsor to stay longer than a week",
     "rainbows are highways"
    ],
    "fill": {
     "spot": [
      "the brass bazaar",
      "an earth-mote quarry",
      "an elemental vortex",
      "a salamander forge",
      "a storm-locked island",
      "the crystal labyrinth"
     ],
     "beast": [
      "fire elemental",
      "xorn",
      "air elemental",
      "salamander",
      "efreeti",
      "earth elemental myrmidon",
      "invisible stalker"
     ],
     "pests": [
      "magmins",
      "mephits",
      "striking azers",
      "mephit swarms",
      "gust spirits"
     ],
     "item": [
      "a bottled efreeti contract",
      "a cooled ember of the world's core",
      "a mote anchor",
      "a bound djinni's ring",
      "a shard of elemental chaos",
      "a planar contract"
     ],
     "person": [
      "a genasi diplomat",
      "a lost azer smith",
      "a djinni's stranded servant",
      "a lost mortal sailor",
      "a genie's servant",
      "an elemental ambassador"
     ]
    }
   },
   "Modern": {
    "w": 2,
    "places": [
     "a rainy commuter city",
     "a sleepy suburb",
     "a megacity where magic is illegal",
     "a sprawling city with a hidden magical district",
     "a small town with a big secret",
     "a research campus near something buried",
     "a suburb where the Tree's branch grows through a mall",
     "a coastal resort town off-season",
     "a capital city on the eve of an election"
    ],
    "quirks": [
     "magic is real but everyone pretends it's an app",
     "the subway runs one extra station that isn't on any map",
     "half the city council are vampires, and everyone knows",
     "coffee shops double as wizard libraries",
     "phones work, but only if you're polite to them",
     "magic exists, but the internet calls it fake",
     "everyone films everything",
     "the branch is a tourist attraction with a gift shop",
     "paperwork beats swords",
     "coffee shops are neutral ground",
     "the police have a 'weird stuff' division",
     "streaming fame can make you powerful, literally",
     "nobody believes the party is from another world",
     "cellphones work in the Roots, sort of",
     "the vending machines are haunted"
    ],
    "fill": {
     "spot": [
      "a closed subway station",
      "a corporate tower's sublevel",
      "an antique shop",
      "a parking garage at 3am",
      "the abandoned subway line",
      "a corporate rooftop",
      "the 24-hour diner"
     ],
     "beast": [
      "doppelganger",
      "werewolf",
      "gargoyle",
      "hellhound loose downtown",
      "sewer gator",
      "werewolf influencer",
      "basilisk in a parking garage"
     ],
     "pests": [
      "imps in the walls",
      "goblins in the vents",
      "a nest of shadows",
      "poltergeists",
      "stray imps",
      "paparazzi"
     ],
     "item": [
      "a cursed smartphone",
      "a stolen briefcase",
      "a vintage tarot deck",
      "a laptop with incriminating files",
      "a museum artifact",
      "a stolen car with a dragon egg in the trunk"
     ],
     "person": [
      "an influencer",
      "a night-shift nurse",
      "a librarian who knows too much",
      "a conspiracy podcaster",
      "a city councilmember"
     ]
    }
   },
   "Cyberpunk / sci-fi": {
    "w": 2,
    "places": [
     "a neon arcology",
     "a generation starship",
     "a terraformed moon colony",
     "a neon arcology stacked to the clouds",
     "a generation ship that forgot it's a ship",
     "a mining moon run by a corporation",
     "a space station market",
     "a desert planet of moisture farms",
     "an orbital city falling slowly"
    ],
    "quirks": [
     "memories trade on the open market",
     "the megacorps sponsor the weather",
     "citizens' lifespans run on subscription",
     "the arcology's AI has opinions about adventurers",
     "street magic is outlawed, so it's everywhere",
     "corporations own the weather",
     "memories can be bought and sold",
     "everyone has a credit score that's visible",
     "AIs have legal rights and lawyers",
     "gravity is a subscription",
     "the network sees everything except the Tree",
     "augmented limbs are fashion",
     "real food is a luxury",
     "ships' computers gossip",
     "the stars are owned"
    ],
    "fill": {
     "spot": [
      "a data vault",
      "the undercity markets",
      "an orbital elevator",
      "a derelict cargo hold",
      "the undercity",
      "a data fortress"
     ],
     "beast": [
      "rogue war-construct",
      "helmed horror (security drone)",
      "mind flayer in a corporate suit",
      "rogue combat mech",
      "xenomorph-like hunter",
      "nanite swarm",
      "void leviathan"
     ],
     "pests": [
      "gangers",
      "malfunctioning drones",
      "nanite swarms",
      "maintenance drones gone rogue",
      "gang runners",
      "space mites"
     ],
     "item": [
      "a data chip",
      "an experimental cyberarm",
      "a corporate prototype",
      "a stolen AI core",
      "a corporate keycard",
      "a cryo-pod with someone inside"
     ],
     "person": [
      "a runaway clone",
      "a hacker",
      "a corporate defector",
      "a burned-out netrunner",
      "a synthetic seeking freedom"
     ]
    }
   }
  }
 },
 "locales": {
  "The City (base bazaar)": {
   "quirks": [
    "stall rents rise and fall with the Tree's moods",
    "merchants from a hundred worlds argue over whose coins are real (the CCV settles it)",
    "street signs translate themselves, unreliably",
    "a new species arrives every week and someone has to explain sidewalks",
    "the bazaar's lost-and-found is a whole district",
    "prices are posted in nine currencies and one barter system",
    "the night market sells things that don't exist yet",
    "guild recruiters prowl every corner",
    "street food comes from worlds that no longer exist",
    "the Watch is underpaid and very creative"
   ],
   "fill": {
    "spot": [
     "the bazaar's night market",
     "a warehouse by the root docks",
     "a back-alley spice vault"
    ],
    "pests": [
     "giant rats",
     "pickpocket imps",
     "escaped market beasts"
    ],
    "person": [
     "a stall-keeper from another world",
     "a lost tourist",
     "a bazaar courier"
    ]
   }
  },
  "Inside the Tree": {
   "quirks": [
    "the carved halls rearrange slightly each season",
    "sap leaks count as a civic emergency",
    "the Tree hums when guilds argue",
    "the Iron Quarter's lifts are pulled by very tired beetles",
    "corridors rearrange during heavy rain",
    "sap lanterns light everything amber",
    "some rooms are bigger inside than the Tree is",
    "the bark whispers to people who sleep against it",
    "the deeper halls are older than the city",
    "guilds compete over the best knotholes"
   ],
   "fill": {
    "spot": [
     "a sap-flooded gallery",
     "the Iron Quarter's lift shafts",
     "a sealed heartwood chamber",
     "the undercellars of the Iron Quarter"
    ],
    "pests": [
     "bark beetles the size of dogs",
     "sap slimes",
     "giant rats"
    ],
    "person": [
     "an Iron Quarter landlord",
     "a guild apprentice",
     "a Council courier"
    ]
   }
  },
  "The Roots": {
   "quirks": [
    "paths shift when no one is watching",
    "chalk waymarks sometimes rewrite themselves",
    "echoes of other worlds leak through the bark",
    "the paths shift with the Tree's heartbeat",
    "travelers age a day or a year, no one knows which",
    "echoes arrive before the sound",
    "lost things from every world drift here",
    "the light comes from nowhere",
    "some branches lead to worlds that have died"
   ],
   "fill": {
    "spot": [
     "a forgotten root waystation",
     "a crossroads of three branches",
     "a knot-hollow off the main path"
    ],
    "pests": [
     "root-mites",
     "lost wanderers turned feral",
     "gray oozes"
    ],
    "person": [
     "a stranded traveler",
     "a waystation keeper",
     "a mapmaker"
    ]
   }
  }
 },
 "worldBlock": {
  "magic": [
   "Magic is a myth here",
   "Magic is rare and feared",
   "Magic is uncommon but known",
   "Magic is everyday",
   "Magic is everywhere, even the dirt hums",
   "Magic is outlawed and heavily policed",
   "Magic is fading, and everyone is scared",
   "Magic belongs only to the nobility",
   "Magic works, but always at a strange price",
   "Magic is replaced by gadgets that act like it",
   "Magic is new here; the first wizards are teenagers",
   "Magic is tied to music and fails in silence",
   "Magic is weather: it drifts, pools, and storms",
   "Magic is sold by the ounce",
   "Magic only works near the Tree's branch"
  ],
  "factions": [
   "a tax-collecting priesthood",
   "a guild of smugglers",
   "a reclusive mages' circle",
   "a peasant militia",
   "a merchant cartel",
   "an old noble house",
   "a cult of the Tree",
   "a mercenary company",
   "a bureaucracy that runs on paperwork",
   "a resistance movement",
   "a children's crusade with surprising competence",
   "a court of talking animals",
   "a company town's board of directors",
   "a monastery that controls the only clean water",
   "a bandit queen and her loyal hundreds",
   "a puppet monarch and the vizier behind them",
   "an order of knights who've lost their purpose",
   "a sewer-dwelling kingdom with better laws than the surface",
   "an academy that treats the world as an experiment",
   "a beloved folk hero who is secretly a tyrant",
   "a union of dockworkers and smugglers",
   "a dragon who considers the city its hoard",
   "a hive-mind of polite insects",
   "refugees from a world whose Tree died",
   "a cartel of weather-witches",
   "a goblin startup with venture capital",
   "a dying line of prophets",
   "a museum that steals history",
   "a council of retired adventurers",
   "a fan club of the First (they're wrong about everything)",
   "a church of the coming apocalypse",
   "a circus that never leaves town",
   "a frontier sheriff with too much power",
   "a secret society of librarians",
   "a rival planar trading company"
  ],
  "threats": [
   "a creeping rot in the local branch",
   "a necromancer gathering the restless dead",
   "a monster awakened by mining",
   "a tyrant with an artifact",
   "a rival guild cutting corners",
   "a planar rift leaking strangeness",
   "famine and the bandits it breeds",
   "a dragon claiming tribute",
   "a severed root starving the land",
   "a plague of wrongness nobody can name",
   "a plague of sleep that won't end",
   "a cult trying to sever the branch",
   "a war about to spill over",
   "famine from blighted crops",
   "a monster migration",
   "a sorcerer collecting the world's names",
   "an invasion from a neighboring world",
   "the sun is getting closer",
   "a tyrant's coronation",
   "a festival that turns into a riot every year",
   "something under the ice is waking",
   "a predatory rival guild",
   "rot spreading from the branch's roots",
   "a counterfeit-coin crisis",
   "the dead are voting",
   "a magical arms race",
   "a dragon's egg about to hatch",
   "a curse on everyone born this year",
   "reality is thinning near the branch",
   "a missing heir and a contested throne",
   "an inquisition hunting outsiders",
   "a bridge-world collapsing into the Roots",
   "a disease that turns people to glass",
   "the local gods have gone silent",
   "a heist targeting the Tree itself"
  ]
 },
 "patrons": {
  "Local commoner": {
   "w": 24,
   "wealth": 0.6,
   "archetypes": {
    "Farmer": [
     "favor",
     "food"
    ],
    "Innkeeper": [
     "favor",
     "food"
    ],
    "Fisher": [
     "favor",
     "wondrous"
    ],
    "Baker": [
     "food",
     "favor"
    ],
    "Street urchin crew": [
     "favor",
     "info"
    ],
    "Retired adventurer": [
     "weapon",
     "armor"
    ]
   }
  },
  "Merchant": {
   "w": 24,
   "wealth": 1,
   "archetypes": {
    "Alchemist": [
     "potion"
    ],
    "Blacksmith": [
     "weapon",
     "armor"
    ],
    "Bookseller": [
     "scroll"
    ],
    "Caravan master": [
     "favor",
     "wondrous"
    ],
    "Jeweler": [
     "wondrous"
    ],
    "Herbalist": [
     "potion"
    ],
    "Curio dealer": [
     "wondrous",
     "scroll"
    ]
   }
  },
  "Noble": {
   "w": 12,
   "wealth": 1.4,
   "archetypes": {
    "Minor lord": [
     "weapon",
     "favor"
    ],
    "Exiled heir": [
     "favor",
     "wondrous"
    ],
    "Dowager": [
     "wondrous",
     "favor"
    ],
    "Ambitious magistrate": [
     "favor",
     "info"
    ]
   }
  },
  "Guild": {
   "w": 16,
   "wealth": 1.1,
   "archetypes": {
    "Mages' guild": [
     "scroll",
     "wondrous"
    ],
    "Healers' hall": [
     "potion",
     "favor"
    ],
    "Thieves' guild": [
     "info",
     "wondrous"
    ],
    "Higher-tier guild (outsourcing)": [
     "weapon",
     "armor",
     "favor"
    ],
    "Cartographers' guild": [
     "info",
     "wondrous"
    ]
   }
  },
  "Council": {
   "w": 10,
   "wealth": 1.2,
   "archetypes": {
    "Iron seat clerk": [
     "favor",
     "info"
    ],
    "Council archivist": [
     "scroll",
     "info"
    ],
    "Tier-mandated order": [
     "favor",
     "wondrous"
    ]
   }
  },
  "Otherworldly being": {
   "w": 14,
   "wealth": 1.3,
   "archetypes": {
    "Fey courtier": [
     "wondrous",
     "favor"
    ],
    "Lost celestial": [
     "potion",
     "favor"
    ],
    "Talking tree": [
     "wondrous",
     "potion"
    ],
    "Bored dragon": [
     "wondrous",
     "weapon"
    ],
    "Ghost with unfinished business": [
     "info",
     "wondrous"
    ]
   }
  }
 },
 "patronNames": [
  "Odessa Brindle",
  "Fennick Laux",
  "Mother Quill",
  "Sir Pellam Vane",
  "Grubb",
  "Ilsabet Marrow",
  "Tamsin Rook",
  "Old Hobb",
  "Vasha Dunmere",
  "Corwin Teague",
  "Pip Larkspur",
  "Hesper Thrane",
  "Barnaby Coil",
  "Yselde of the Hollow",
  "Marrow-and-Ash",
  "Jory Fenwick",
  "Lady Ottoline Crest",
  "Kettle",
  "Brother Amsel",
  "Nim Whistledown"
 ],
 "patronQuirks": [
  "talks to their hat",
  "overpays and then regrets it",
  "insists on a signed contract in triplicate",
  "is clearly lying about one detail",
  "weeps easily",
  "is suspicious of anyone taller than them",
  "only speaks in questions",
  "brings snacks to every meeting",
  "keeps checking over their shoulder",
  "is far too cheerful about the danger",
  "is related to someone important (and mentions it)",
  "cannot remember the party's names",
  "speaks only in questions",
  "is accompanied by a very judgmental goose",
  "insists on paying in exact change",
  "has clearly done this before and won't say how it went",
  "is allergic to magic and sneezes at spellcasters",
  "writes everything down, including your names, twice",
  "calls everyone 'friend' in a way that feels like a threat",
  "is wearing a disguise that fools no one",
  "keeps a pet that is definitely not a cat",
  "is a terrible liar and knows it",
  "haggles over the reward, then overpays out of guilt",
  "is from a world where handshakes are a grave insult",
  "won't stop humming the same three notes",
  "smells faintly of smoke and lavender",
  "refers to themselves in the third person",
  "is fourteen and extremely serious",
  "is ancient and extremely unserious",
  "has a prosthetic that clicks when they're nervous",
  "only meets after sundown",
  "is desperate and trying hard not to show it",
  "is obviously royalty pretending not to be",
  "owes money to someone in the room",
  "keeps quoting a philosopher nobody's heard of",
  "is a retired version of the party, give or take",
  "won't step inside the guild hall (bad memories)",
  "carries a ledger of every favor ever owed to them",
  "tests the party with a riddle first",
  "laughs at the worst possible moments",
  "is sending a proxy and pretending to be the proxy",
  "has already hired another guild and is hedging their bets",
  "keeps apologizing for things that haven't happened yet",
  "insists the job is 'simple' every few sentences",
  "is visibly haunted, literally",
  "collects a souvenir from every adventurer they hire",
  "wants a signed contract in triplicate",
  "is a little too interested in the party's backstories",
  "whispers everything",
  "can't stop touching the Tree's bark for luck",
  "is grieving and hides it with jokes",
  "is clearly a shapeshifter but no one's mentioned it",
  "is newly rich and bad at it",
  "always arrives with a different bandage",
  "communicates through an increasingly annoyed translator",
  "has a deadline they keep moving"
 ],
 "objectives": {
  "Fetch": [
   "retrieve {item} from {spot}",
   "deliver {item} to {spot} before it spoils",
   "gather {count} {ingredient} from {spot}",
   "bring back {count} {ingredient} before the season ends",
   "collect a debt of {item} from {spot}",
   "find a replacement for {item}, lost at {spot}",
   "recover a package that fell through the Roots near {spot}"
  ],
  "Extermination": [
   "clear {pests} out of {spot}",
   "stop whatever keeps eating the {livestock}",
   "drive {pests} away from {spot} for good",
   "purge a nest of {pests} from under {spot}",
   "deal with the {beast} that moved into {spot}",
   "cull the {pests} before they breed again",
   "end a {pests} infestation without damaging {spot}"
  ],
  "Escort": [
   "escort {person} safely through {spot}",
   "guard a shipment of {item} bound for {spot}",
   "get {person} to {spot} before their rivals do",
   "escort a wagon of {livestock} through {spot}",
   "protect {person} for one very long night",
   "see {person} safely home through the Roots"
  ],
  "Investigation": [
   "find out why {mystery}",
   "track down whoever has been {crime}",
   "learn who is behind the rumors that {mystery}",
   "discover what's buried under {spot}",
   "find out why {person} has gone silent",
   "prove who has been {crime}"
  ],
  "Hunt": [
   "hunt the {beast} stalking {spot}",
   "bring back proof that the {beast} is dead",
   "track the {beast} to its den near {spot}",
   "capture the {beast} alive",
   "stop the {beast} before the next full moon",
   "find out what the {beast} is fleeing from"
  ],
  "Rescue": [
   "rescue {person}, taken to {spot}",
   "find {person}, last seen near {spot}",
   "bring {person} back from {spot} before dawn",
   "free {person} from a bad contract at {spot}",
   "pull survivors out of {spot}",
   "negotiate {person}'s release from {faction}"
  ],
  "Diplomacy": [
   "broker peace between {faction} and {faction2}",
   "deliver terms to {faction} without starting a war",
   "host a peace dinner for {faction} and {faction2}",
   "convince {faction} to sign the Tree's accords",
   "settle a border dispute over {spot}",
   "win over {faction} before a rival guild does"
  ],
  "Heist": [
   "recover {item}, now held in {spot}",
   "quietly swap {item} for a fake at {spot}",
   "steal back {item} from {faction}",
   "break into {spot} and leave no trace",
   "plant {item} in {spot}",
   "lift the ledger proving {faction} has been {crime}"
  ],
  "World Crisis": [
   "stop the {doom} consuming this world's branch",
   "find the source of the {doom} spreading up the roots",
   "seal the breach where the {doom} pours in",
   "rally {faction} and {faction2} against the {doom}",
   "carry a cure for the {doom} to the branch's heart",
   "find the last seed that can heal this world's branch"
  ]
 },
 "fill": {
  "item": [
   "a sealed lockbox",
   "grandmother's recipe book",
   "a cracked crystal egg",
   "a bag of very angry seeds",
   "the deed to a windmill",
   "a tuning fork that hums alone",
   "a jar of bottled starlight",
   "a stolen family portrait",
   "a sealed reliquary",
   "a cartographer's last map",
   "a box of seeds from a dead world",
   "a crate of unstable alchemy",
   "a music box that won't stop",
   "a noble's signet ring",
   "a stolen painting",
   "a golem's control rod"
  ],
  "spot": [
   "the old mill",
   "a flooded crypt",
   "the undercellars of the Iron Quarter",
   "a hollow in the Tree's bark",
   "an abandoned watchtower",
   "the bog road",
   "a sunken library",
   "the bandits' quarry camp",
   "a root-tunnel nobody maps",
   "the flooded catacombs",
   "a burned-out manor",
   "a toll-keepers' fort",
   "an abandoned guild hall",
   "the old quarry",
   "a hermit's tower",
   "a festival ground after dark",
   "the root caverns"
  ],
  "count": [
   "a dozen",
   "three bushels of",
   "twenty",
   "a cartload of",
   "five"
  ],
  "ingredient": [
   "glowcaps",
   "frost-thistle",
   "sap blisters",
   "owlbear feathers",
   "giggling moss",
   "moonlit thistle",
   "basilisk feathers",
   "glowcap mushrooms",
   "frost lily",
   "bog amber",
   "phoenix ash"
  ],
  "pests": [
   "giant rats",
   "stirges",
   "a goblin squat",
   "overgrown beetles",
   "kobold tunnelers",
   "sentient weeds",
   "dire rats",
   "myconid squatters",
   "goblin squatters",
   "giant centipedes",
   "cranium rats",
   "swarming pixies"
  ],
  "livestock": [
   "sheep",
   "prize hogs",
   "chickens",
   "messenger pigeons",
   "goats",
   "silk moths",
   "giant beetles",
   "alpacas"
  ],
  "person": [
   "a nervous scholar",
   "the mayor's nephew",
   "a retired priest",
   "a pregnant merchant",
   "a stubborn goat-herder",
   "a lost child",
   "a minor celebrity bard",
   "a missing cartographer",
   "a runaway bride",
   "an apprentice who stole the wrong book",
   "a retired hero",
   "a tax inspector",
   "a famous chef",
   "a rival guild's rookie"
  ],
  "mystery": [
   "the well water tastes of copper",
   "the town clock runs backward",
   "people forget their names at dusk",
   "the harvest rots overnight",
   "the dogs won't stop howling at the Tree",
   "the bells ring at midnight with no ringer",
   "everyone's shadow points north",
   "the river ran backward for an hour",
   "statues are appearing in the square",
   "the guild's mail arrives already opened",
   "people dream the same dream"
  ],
  "crime": [
   "stealing gravestones",
   "forging guild seals",
   "poisoning the cisterns",
   "kidnapping cats",
   "selling fake planar maps",
   "poisoning the wells",
   "stealing dreams",
   "counterfeiting CCV tokens",
   "kidnapping messengers",
   "selling fake relics",
   "burning grain stores"
  ],
  "beast": [
   "owlbear",
   "dire wolf pack leader",
   "wyvern",
   "basilisk",
   "hill troll",
   "manticore",
   "bulette",
   "giant crocodile",
   "hydra",
   "gorgon",
   "roc",
   "chuul",
   "umber hulk"
  ],
  "faction": [
   "the river barons",
   "the mushroom folk",
   "a dwarven clan",
   "the toll-keepers",
   "the hill tribes",
   "a rival guild",
   "the beekeepers' guild",
   "a fallen noble house",
   "the ferrymen",
   "the mushroom folk's elders",
   "the city watch",
   "the river spirits"
  ],
  "faction2": [
   "their estranged cousins",
   "the city watch",
   "a druid circle",
   "the mill owners",
   "a fey court",
   "the miners' union",
   "a rival temple",
   "the goblin market",
   "the old families",
   "the newcomers from another world"
  ],
  "doom": [
   "rot",
   "blight",
   "necrotic bloom",
   "silence",
   "crystal plague",
   "root-severing",
   "withering",
   "hungering dark",
   "shatterfrost",
   "memory rot",
   "ash bloom",
   "hollowing"
  ]
 },
 "complications": [
  "The patron is lying about what the job really is.",
  "A rival guild has taken the same job.",
  "There's a hard time limit nobody mentioned.",
  "The target is sympathetic, maybe even right.",
  "The reward is in a currency the CCV hates (it complains).",
  "Someone important is secretly the culprit.",
  "The weather (or the world) turns against them.",
  "An innocent is caught in the middle.",
  "The job is bait for a trap aimed at the guild.",
  "A second patron offers more to do the opposite.",
  "Local law forbids exactly what the job requires.",
  "The 'monster' is guarding something worse.",
  "The patron dies, disappears, or changes their mind mid-job.",
  "Something follows them back to the Tree.",
  "The patron's rival hires a second party to sabotage the job.",
  "The 'monster' is a misunderstood creature protecting its young.",
  "An informant has fed the patron false information.",
  "The route the party planned has collapsed or flooded.",
  "A key NPC wants to join the party and won't take no for an answer.",
  "Someone on the patron's staff is quietly working against them.",
  "The reward is cursed, mildly.",
  "A storm, festival, or eclipse changes everything on the day.",
  "The target has already been taken by someone else.",
  "Two factions each think the party works for them.",
  "The job is a test set by the Council, and they're watching.",
  "The place they need to go is sacred and outsiders are barred.",
  "Payment depends on proof that's hard to carry home.",
  "An old enemy of a party member is involved.",
  "The patron wants it done in a way that's needlessly dramatic.",
  "A child has followed the party and refuses to go home.",
  "The local Tree branch is sick, and magic misbehaves near it.",
  "The 'easy' job is actually twice as big as described.",
  "Something the party does here will be on the news in another world.",
  "The patron dies, disappears, or is replaced partway through.",
  "A natural hazard (wildfire, quakes, ice) sets a hidden clock.",
  "The party is mistaken for prophesied heroes.",
  "The thing to retrieve is alive and has opinions.",
  "A rival guild offers to split the reward if the party fails on purpose.",
  "Language barrier: the CCV handles coins, not conversations.",
  "The locals have a ritual the party must complete first.",
  "The only guide is unreliable, but the only guide.",
  "The job overlaps with a holy day, and violence is taboo.",
  "The quarry is famous, beloved, and the public will be furious.",
  "A debt collector follows the party, looking for someone else.",
  "An insect, plant, or fungus here causes vivid hallucinations.",
  "Nobody mentioned the job needs to stay secret until halfway through.",
  "The patron's family wants the opposite outcome.",
  "Two of the job's clues contradict each other, and both are true.",
  "A wild magic or tech surge hits at the worst time."
 ],
 "goldBaseByLevel": [
  0,
  30,
  60,
  100,
  150,
  250,
  350,
  500,
  650,
  850,
  1100,
  1500,
  2000,
  2600,
  3300,
  4200,
  5300,
  6800,
  8500,
  10500,
  13000
 ],
 "rarityByTier": [
  [
   "common",
   "uncommon"
  ],
  [
   "uncommon"
  ],
  [
   "uncommon",
   "rare"
  ],
  [
   "rare",
   "very rare"
  ],
  [
   "very rare",
   "legendary"
  ]
 ],
 "items": {
  "potion": {
   "common": [
    "Potion of Healing",
    "Potion of Climbing"
   ],
   "uncommon": [
    "Potion of Greater Healing",
    "Potion of Water Breathing",
    "Potion of Fire Breath",
    "Potion of Resistance",
    "Potion of Hill Giant Strength",
    "Potion of Growth",
    "Potion of Animal Friendship",
    "Oil of Slipperiness",
    "Philter of Love",
    "Potion of Poison (cursed)"
   ],
   "rare": [
    "Potion of Superior Healing",
    "Potion of Heroism",
    "Potion of Clairvoyance",
    "Potion of Diminution",
    "Potion of Gaseous Form",
    "Potion of Frost Giant Strength",
    "Potion of Stone Giant Strength",
    "Potion of Fire Giant Strength",
    "Potion of Invulnerability",
    "Potion of Mind Reading",
    "Oil of Etherealness",
    "Elixir of Health"
   ],
   "very rare": [
    "Potion of Supreme Healing",
    "Potion of Flying",
    "Potion of Speed",
    "Potion of Invisibility",
    "Potion of Longevity",
    "Potion of Vitality",
    "Potion of Cloud Giant Strength",
    "Oil of Sharpness"
   ],
   "legendary": [
    "Potion of Storm Giant Strength"
   ]
  },
  "scroll": {
   "common": [
    "Spell Scroll (cantrip or 1st level)",
    "Spell Scroll (cantrip)",
    "Spell Scroll (1st level)"
   ],
   "uncommon": [
    "Spell Scroll (2nd–3rd level)",
    "Spell Scroll (2nd level)",
    "Spell Scroll (3rd level)"
   ],
   "rare": [
    "Spell Scroll (4th–5th level)",
    "Spell Scroll (4th level)",
    "Spell Scroll (5th level)"
   ],
   "very rare": [
    "Spell Scroll (6th–8th level)",
    "Spell Scroll (6th level)",
    "Spell Scroll (7th level)",
    "Spell Scroll (8th level)"
   ],
   "legendary": [
    "Spell Scroll (9th level)"
   ]
  },
  "weapon": {
   "common": [
    "Silvered weapon",
    "Weapon with a harmless magical quirk",
    "Moon-Touched Sword",
    "Unbreakable Arrow (bundle)",
    "Walloping Ammunition (10)",
    "Veteran's Cane"
   ],
   "uncommon": [
    "+1 Weapon",
    "Weapon of Warning",
    "Moon Sickle",
    "+1 Ammunition (20)",
    "Javelin of Lightning",
    "Trident of Fish Command",
    "Sword of Vengeance (cursed)"
   ],
   "rare": [
    "+2 Weapon",
    "Flame Tongue",
    "Dragon Slayer",
    "+2 Ammunition (20)",
    "Giant Slayer",
    "Mace of Disruption",
    "Mace of Smiting",
    "Mace of Terror",
    "Sun Blade",
    "Sword of Life Stealing",
    "Sword of Wounding",
    "Vicious Weapon",
    "Berserker Axe",
    "Dagger of Venom"
   ],
   "very rare": [
    "+3 Weapon",
    "Oathbow",
    "Dancing Sword",
    "+3 Ammunition (20)",
    "Arrow of Slaying",
    "Dwarven Thrower",
    "Frost Brand",
    "Nine Lives Stealer",
    "Scimitar of Speed",
    "Sword of Sharpness"
   ],
   "legendary": [
    "Vorpal Sword",
    "Holy Avenger",
    "Defender",
    "Hammer of Thunderbolts",
    "Luck Blade",
    "Sword of Answering"
   ]
  },
  "armor": {
   "common": [
    "Armor of Gleaming",
    "Cast-Off Armor",
    "Smoldering Armor",
    "Shield of Expression"
   ],
   "uncommon": [
    "+1 Shield",
    "Mithral Armor",
    "Adamantine Armor",
    "Mariner's Armor",
    "Sentinel Shield"
   ],
   "rare": [
    "+1 Armor",
    "Armor of Resistance",
    "+2 Shield",
    "Arrow-Catching Shield",
    "Elven Chain",
    "Glamoured Studded Leather",
    "Armor of Vulnerability (cursed)"
   ],
   "very rare": [
    "+2 Armor",
    "Animated Shield",
    "+3 Shield",
    "Demon Armor",
    "Dragon Scale Mail",
    "Dwarven Plate",
    "Spellguard Shield"
   ],
   "legendary": [
    "+3 Armor",
    "Armor of Invulnerability",
    "Efreeti Chain",
    "Plate Armor of Etherealness"
   ]
  },
  "wondrous": {
   "common": [
    "Cloak of Many Fashions",
    "Pot of Awakening",
    "Charlatan's Die",
    "Candle of the Deep",
    "Bead of Nourishment",
    "Bead of Refreshment",
    "Boots of False Tracks",
    "Cloak of Billowing",
    "Clockwork Amulet",
    "Clothes of Mending",
    "Dark Shard Amulet",
    "Dread Helm",
    "Ear Horn of Hearing",
    "Enduring Spellbook",
    "Ersatz Eye",
    "Hat of Vermin",
    "Hat of Wizardry",
    "Heward's Handy Spice Pouch",
    "Horn of Silent Alarm",
    "Instrument of Illusions",
    "Instrument of Scribing",
    "Lock of Trickery",
    "Mystery Key",
    "Orb of Direction",
    "Orb of Time",
    "Perfume of Bewitching",
    "Pipe of Smoke Monsters",
    "Pole of Angling",
    "Pole of Collapsing",
    "Rope of Mending",
    "Ruby of the War Mage",
    "Staff of Adornment",
    "Staff of Birdcalls",
    "Staff of Flowers",
    "Talking Doll",
    "Tankard of Sobriety",
    "Wand of Conducting",
    "Wand of Pyrotechnics",
    "Wand of Scowls",
    "Wand of Smiles"
   ],
   "uncommon": [
    "Bag of Holding",
    "Cloak of Protection",
    "Goggles of Night",
    "Driftglobe",
    "Alchemy Jug",
    "Amulet of Proof against Detection and Location",
    "Bag of Tricks",
    "Boots of Elvenkind",
    "Boots of Striding and Springing",
    "Boots of the Winterlands",
    "Bracers of Archery",
    "Brooch of Shielding",
    "Broom of Flying",
    "Cap of Water Breathing",
    "Circlet of Blasting",
    "Cloak of Elvenkind",
    "Cloak of the Manta Ray",
    "Decanter of Endless Water",
    "Deck of Illusions",
    "Dust of Disappearance",
    "Dust of Dryness",
    "Dust of Sneezing and Choking",
    "Eversmoking Bottle",
    "Eyes of Charming",
    "Eyes of Minute Seeing",
    "Eyes of the Eagle",
    "Gauntlets of Ogre Power",
    "Gem of Brightness",
    "Gloves of Missile Snaring",
    "Gloves of Swimming and Climbing",
    "Gloves of Thievery",
    "Hat of Disguise",
    "Headband of Intellect",
    "Helm of Comprehending Languages",
    "Helm of Telepathy",
    "Immovable Rod",
    "Lantern of Revealing",
    "Medallion of Thoughts",
    "Necklace of Adaptation",
    "Pearl of Power",
    "Periapt of Health",
    "Periapt of Wound Closure",
    "Pipes of Haunting",
    "Pipes of the Sewers",
    "Quiver of Ehlonna",
    "Ring of Jumping",
    "Ring of Mind Shielding",
    "Ring of Swimming",
    "Ring of Warmth",
    "Ring of Water Walking",
    "Robe of Useful Items",
    "Rope of Climbing",
    "Saddle of the Cavalier",
    "Sending Stones",
    "Slippers of Spider Climbing",
    "Stone of Good Luck",
    "Wand of Magic Detection",
    "Wand of Magic Missiles",
    "Wand of Secrets",
    "Wand of Web",
    "Wand of the War Mage +1",
    "Wind Fan",
    "Winged Boots"
   ],
   "rare": [
    "Cloak of Displacement",
    "Necklace of Fireballs",
    "Ring of Protection",
    "Amulet of Health",
    "Belt of Dwarvenkind",
    "Belt of Hill Giant Strength",
    "Boots of Levitation",
    "Boots of Speed",
    "Bowl of Commanding Water Elementals",
    "Bracers of Defense",
    "Brazier of Commanding Fire Elementals",
    "Cape of the Mountebank",
    "Censer of Controlling Air Elementals",
    "Chime of Opening",
    "Cloak of the Bat",
    "Cube of Force",
    "Daern's Instant Fortress",
    "Dimensional Shackles",
    "Elemental Gem",
    "Folding Boat",
    "Gem of Seeing",
    "Helm of Teleportation",
    "Heward's Handy Haversack",
    "Horn of Blasting",
    "Horseshoes of Speed",
    "Ioun Stone (Awareness)",
    "Ioun Stone (Protection)",
    "Ioun Stone (Reserve)",
    "Ioun Stone (Sustenance)",
    "Iron Bands of Bilarro",
    "Mantle of Spell Resistance",
    "Necklace of Prayer Beads",
    "Periapt of Proof against Poison",
    "Portable Hole",
    "Ring of Animal Influence",
    "Ring of Evasion",
    "Ring of Feather Falling",
    "Ring of Free Action",
    "Ring of Resistance",
    "Ring of Spell Storing",
    "Ring of the Ram",
    "Ring of X-ray Vision",
    "Robe of Eyes",
    "Rod of the Pact Keeper +2",
    "Rope of Entanglement",
    "Staff of Charming",
    "Staff of Healing",
    "Staff of Swarming Insects",
    "Staff of the Woodlands",
    "Stone of Controlling Earth Elementals",
    "Wand of Binding",
    "Wand of Enemy Detection",
    "Wand of Fear",
    "Wand of Fireballs",
    "Wand of Lightning Bolts",
    "Wand of Paralysis",
    "Wand of Wonder",
    "Wings of Flying"
   ],
   "very rare": [
    "Cloak of Arachnida",
    "Manual of Bodily Health",
    "Amulet of the Planes",
    "Belt of Fire Giant Strength",
    "Belt of Frost Giant Strength",
    "Belt of Stone Giant Strength",
    "Carpet of Flying",
    "Crystal Ball",
    "Efreeti Bottle",
    "Horseshoes of a Zephyr",
    "Ioun Stone (Absorption)",
    "Ioun Stone (Agility)",
    "Ioun Stone (Fortitude)",
    "Ioun Stone (Insight)",
    "Ioun Stone (Intellect)",
    "Ioun Stone (Leadership)",
    "Ioun Stone (Strength)",
    "Manual of Gainful Exercise",
    "Manual of Quickness of Action",
    "Mirror of Life Trapping",
    "Nolzur's Marvelous Pigments",
    "Ring of Regeneration",
    "Ring of Shooting Stars",
    "Ring of Telekinesis",
    "Robe of Scintillating Colors",
    "Robe of Stars",
    "Rod of Absorption",
    "Rod of Alertness",
    "Rod of Security",
    "Staff of Fire",
    "Staff of Frost",
    "Staff of Power",
    "Staff of Striking",
    "Staff of Thunder and Lightning",
    "Tome of Clear Thought",
    "Tome of Leadership and Influence",
    "Tome of Understanding",
    "Wand of Polymorph"
   ],
   "legendary": [
    "Cloak of Invisibility",
    "Ring of Three Wishes",
    "Apparatus of Kwalish",
    "Belt of Cloud Giant Strength",
    "Belt of Storm Giant Strength",
    "Cubic Gate",
    "Deck of Many Things",
    "Ioun Stone (Greater Absorption)",
    "Ioun Stone (Mastery)",
    "Ioun Stone (Regeneration)",
    "Iron Flask",
    "Ring of Djinni Summoning",
    "Ring of Elemental Command",
    "Ring of Invisibility",
    "Ring of Spell Turning",
    "Robe of the Archmagi",
    "Rod of Lordly Might",
    "Rod of Resurrection",
    "Scarab of Protection",
    "Sovereign Glue",
    "Sphere of Annihilation",
    "Staff of the Magi",
    "Talisman of Pure Good",
    "Talisman of the Sphere",
    "Talisman of Ultimate Evil",
    "Tome of the Stilled Tongue",
    "Universal Solvent",
    "Well of Many Worlds"
   ]
  },
  "favor": {
   "common": [
    "A small favor owed",
    "A free drink at the patron's establishment, forever",
    "An introduction to a useful local",
    "A promise to put in a good word",
    "Directions nobody else knows",
    "A spare room whenever you're in town"
   ],
   "uncommon": [
    "A standing discount with the patron",
    "A loaned mount or vehicle for a month",
    "Access to a private library or archive",
    "A letter of recommendation to a guild",
    "A safe house in this world",
    "A local's lifelong loyalty"
   ],
   "rare": [
    "Introductions to powerful people",
    "A seat at a noble's table",
    "Legal immunity in one city, once",
    "A trade route opened for the guild",
    "An apprentice who wants to join the guild",
    "A rare crafting material on request"
   ],
   "very rare": [
    "A powerful ally's debt",
    "A fortress available as a base",
    "Command of a small company for one battle",
    "A pardon for any one crime",
    "A noble title (minor, inconvenient)"
   ],
   "legendary": [
    "A boon from a mighty being",
    "A wish, carefully worded, from someone who can grant one",
    "A world's gratitude: a statue, a holiday, a name in the songs",
    "A favor from a Council member"
   ]
  },
  "food": {
   "common": [
    "Free meals for a week",
    "A basket of fresh bread and local cheese",
    "A cask of local ale",
    "A jar of honey that tastes like sunlight",
    "A recipe from the patron's grandmother"
   ],
   "uncommon": [
    "A month of free lodging and meals",
    "A crate of preserved delicacies from another world",
    "A cook who'll visit the guild hall once a season",
    "Rare spices worth 50 gp",
    "A barrel of exceptional wine"
   ],
   "rare": [
    "A feast in the guild's honor",
    "A living sourdough starter from a dead world",
    "A standing order of fresh food delivered weekly",
    "A season's harvest share"
   ],
   "very rare": [
    "A standing table at a famous house",
    "A seed that grows a food-bearing tree in the guild hall",
    "A chef from a legendary kitchen for a year"
   ],
   "legendary": [
    "A legendary banquet (heroes' boon)",
    "An ever-full pantry enchantment"
   ]
  },
  "info": {
   "common": [
    "A useful rumor",
    "Gossip about a rival guild",
    "The location of a decent tavern in every nearby world",
    "Who to bribe at the docks",
    "A hint about an upcoming Council job"
   ],
   "uncommon": [
    "A map or secret route",
    "A shortcut through the Roots",
    "The weakness of a monster the party will meet",
    "A list of who's hiring in three worlds",
    "The real name of a fey"
   ],
   "rare": [
    "Blackmail on a rival",
    "A map to a forgotten vault",
    "The password to a secret society",
    "Proof of a noble's crime",
    "Where a lost artifact was last seen"
   ],
   "very rare": [
    "The location of a lost relic",
    "A dragon's true name",
    "How a dead world's Tree died",
    "A Council member's secret"
   ],
   "legendary": [
    "A truth about the First",
    "The location of a living seed of a new Tree",
    "The name of the world the Tree grew from"
   ]
  }
 },
 "xpBudget": [
  [
   0,
   0,
   0
  ],
  [
   50,
   75,
   100
  ],
  [
   100,
   150,
   200
  ],
  [
   150,
   225,
   400
  ],
  [
   250,
   375,
   500
  ],
  [
   500,
   750,
   1100
  ],
  [
   600,
   1000,
   1400
  ],
  [
   750,
   1300,
   1700
  ],
  [
   1000,
   1700,
   2100
  ],
  [
   1300,
   2000,
   2600
  ],
  [
   1600,
   2300,
   3100
  ],
  [
   1900,
   2900,
   4100
  ],
  [
   2200,
   3700,
   4700
  ],
  [
   2600,
   4200,
   5400
  ],
  [
   2900,
   4900,
   6200
  ],
  [
   3300,
   5400,
   7800
  ],
  [
   3800,
   6100,
   9800
  ],
  [
   4500,
   7200,
   11700
  ],
  [
   5000,
   8700,
   14200
  ],
  [
   5500,
   10700,
   17200
  ],
  [
   6400,
   13200,
   22000
  ]
 ],
 "fightPlan": {
  "Small": "1 fight (Moderate)",
  "Standard": "1–2 fights (e.g. one High, or Moderate + Low across a rest)",
  "Major": "Per session: 1–2 fights, respecting ~1 per short rest / 2 per long rest"
 },
 "names": {
  "recurringChance": 0.15,
  "first": [
   "Aldric",
   "Amara",
   "Anselm",
   "Aoife",
   "Arlo",
   "Astrid",
   "Bartholomew",
   "Beatrix",
   "Bellamy",
   "Benedikt",
   "Bramble",
   "Briony",
   "Caius",
   "Calla",
   "Casimir",
   "Cedric",
   "Celandine",
   "Cyrus",
   "Dagny",
   "Dashiell",
   "Delphine",
   "Desmond",
   "Dorian",
   "Edda",
   "Eamon",
   "Elowen",
   "Emeric",
   "Esme",
   "Ezra",
   "Fable",
   "Faustine",
   "Fenwick",
   "Fiora",
   "Florian",
   "Freya",
   "Gideon",
   "Ginevra",
   "Gorm",
   "Greta",
   "Gunnar",
   "Halcyon",
   "Hamish",
   "Hazel",
   "Henrike",
   "Horatio",
   "Idris",
   "Ilse",
   "Imogen",
   "Ingram",
   "Isolde",
   "Ivo",
   "Jasper",
   "Jessamy",
   "Jory",
   "Juno",
   "Kasimir",
   "Kestrel",
   "Kit",
   "Lachlan",
   "Lark",
   "Leopold",
   "Liesel",
   "Linus",
   "Lorcan",
   "Lucan",
   "Mabel",
   "Magnus",
   "Marisol",
   "Mathis",
   "Mireille",
   "Morwenna",
   "Nadia",
   "Niall",
   "Nim",
   "Odalys",
   "Oleander",
   "Orrin",
   "Osgood",
   "Paloma",
   "Percival",
   "Petra",
   "Quill",
   "Quentin",
   "Rafferty",
   "Rhiannon",
   "Roderick",
   "Rosalind",
   "Ruairi",
   "Sabine",
   "Saoirse",
   "Seraphine",
   "Silas",
   "Solveig",
   "Soren",
   "Sybil",
   "Tancred",
   "Tavish",
   "Temperance",
   "Thaddeus",
   "Theda",
   "Tobias",
   "Ulric",
   "Una",
   "Valentin",
   "Vesna",
   "Wilhelmina",
   "Winifred",
   "Wystan",
   "Xavi",
   "Yara",
   "Yorick",
   "Ysolde",
   "Zephyrine",
   "Zoltan",
   "Adaeze",
   "Kofi",
   "Amaru",
   "Itzel",
   "Hoku",
   "Leilani",
   "Ravi",
   "Anjali",
   "Kenji",
   "Haruka",
   "Mei",
   "Jun",
   "Dmitri",
   "Oksana",
   "Farid",
   "Layla",
   "Tariq",
   "Zahra",
   "Bao",
   "Linh",
   "Tupac",
   "Nayeli",
   "Olu",
   "Chidi",
   "Sigrun",
   "Torvald",
   "Ione",
   "Thalia",
   "Cosimo",
   "Ottavia",
   "Mateus",
   "Inês",
   "Bronwen",
   "Dai"
  ],
  "last": [
   "Ashdown",
   "Blackthorn",
   "Bramblewood",
   "Brightwater",
   "Burrowes",
   "Candlewick",
   "Cinderfell",
   "Coldbrook",
   "Copperpot",
   "Crane",
   "Crowley",
   "Dunmore",
   "Eastwind",
   "Emberly",
   "Fairweather",
   "Featherstone",
   "Fenn",
   "Fletcher",
   "Foxglove",
   "Gallowglass",
   "Gearhart",
   "Goldleaf",
   "Greaves",
   "Greenhollow",
   "Hale",
   "Hartwell",
   "Hawthorne",
   "Hearthstone",
   "Holloway",
   "Inkwell",
   "Ironside",
   "Jessop",
   "Kettlewell",
   "Kingsley",
   "Larkin",
   "Lightfoot",
   "Lockwood",
   "Longbottom",
   "Marlowe",
   "Merriweather",
   "Mistral",
   "Moonwhistle",
   "Mossgrave",
   "Nettlefield",
   "Nightingale",
   "Oakenshield",
   "Oddfellow",
   "Pemberton",
   "Pennywhistle",
   "Quickwater",
   "Ravenscroft",
   "Redcliffe",
   "Rookwood",
   "Rosethorn",
   "Saltwhistle",
   "Shadowmere",
   "Silverbell",
   "Sparrowhawk",
   "Starling",
   "Stonebridge",
   "Strand",
   "Swiftbrook",
   "Tallow",
   "Thistledown",
   "Thorne",
   "Tinderbox",
   "Underhill",
   "Vantablack",
   "Vesper",
   "Wainwright",
   "Waxwing",
   "Whitlock",
   "Wickham",
   "Wildermuth",
   "Winterbourne",
   "Wren",
   "Yarrow",
   "Zeal",
   "Okonkwo",
   "Adeyemi",
   "Mendoza",
   "Quispe",
   "Kahale",
   "Nakamura",
   "Takeda",
   "Chen",
   "Nguyen",
   "Petrov",
   "Volkova",
   "Haddad",
   "Nasser",
   "Singh",
   "Rao",
   "Kowalski",
   "Lindqvist",
   "Halvorsen",
   "Moreau",
   "Bellini",
   "Castell",
   "Duarte",
   "Mac Lir",
   "ap Rhys",
   "of the Ninth Branch",
   "from Below",
   "Twice-Born"
  ],
  "monikers": [
   "Grubb",
   "Old Wick",
   "Mother Hen",
   "the Widow Pell",
   "Three-Fingers Tam",
   "Lucky",
   "Mister Buttons",
   "Auntie Sorrel",
   "the Tallyman",
   "Crumb",
   "Big Hettie",
   "Little Oswin",
   "the Mapmaker",
   "Smudge",
   "Brother Ash",
   "Sister Vell",
   "Captain Nobody",
   "the Ferryman",
   "Gristle",
   "Professor Pip",
   "Saint Agathe (not a saint)",
   "the Quiet Gentleman",
   "Nana Goss",
   "Patchwork",
   "the Lamplighter",
   "Dame Rattle",
   "Snip",
   "Old Crow",
   "the Moth",
   "Tuesday"
  ],
  "titles": [
   "Captain",
   "Sister",
   "Brother",
   "Lady",
   "Lord",
   "Doctor",
   "Master",
   "Mistress",
   "Elder",
   "Sergeant",
   "Professor",
   "Madame",
   "Sir",
   "Dame",
   "Mayor",
   "Reverend"
  ]
 }
};
