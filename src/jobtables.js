/* Job Board default tables (from Job Board v1) */
const DEFAULT_JOB_TABLES = {
  version:2,
  tiers:["Iron","Bronze","Silver","Gold","Platinum"],
  jobTypes:{ // weights per tier [Iron,Bronze,Silver,Gold,Platinum]
    "Fetch":[20,14,8,5,3],"Extermination":[18,14,10,8,6],"Escort":[14,12,10,8,6],
    "Investigation":[12,14,14,12,10],"Hunt":[12,14,14,14,12],"Rescue":[10,10,12,12,12],
    "Diplomacy":[6,8,12,14,14],"Heist":[4,8,10,12,12],"World Crisis":[1,3,6,10,15]
  },
  sizes:{ // [Small,Standard,Major] per tier
    weights:[[50,40,10],[35,45,20],[30,45,25],[25,45,30],[20,45,35]],
    names:["Small","Standard","Major"],
    blurb:{"Small":"one session, ~1 fight","Standard":"1–2 sessions","Major":"multi-session arc"},
    goldMult:{"Small":0.5,"Standard":1,"Major":2.5},
    contribution:{"Small":1,"Standard":3,"Major":8}
  },
  locations:{ // per tier
    names:["The City (base bazaar)","Inside the Tree","The Trunk","A nearby world","A distant world","A strange, far-flung world"],
    weights:[[25,20,8,40,7,0],[15,15,10,42,16,2],[8,10,10,40,27,5],[5,8,10,30,32,15],[3,5,10,20,37,25]]
  },
  fantasyShare:{iron:0.8,platinum:0.6},
  /* Each genre/locale has its own places, quirks (grounded-but-wacky), and fill overrides so jobs fit the world. */
  genres:{
    fantasy:{
      "High fantasy":{w:40,places:["a river kingdom","an elven forest-realm","a mountain dwarfhold","a sprawling wizard-republic","a kingdom of floating isles"],
        quirks:["the royal wizards tax every spell cast inside city walls","knighthood is granted by a talking sword that is very picky","river spirits demand a loaf of bread at every bridge","dragons are a protected species, to everyone's annoyance","the king's heralds sing every proclamation, badly","griffon-post beats the roads, but the griffons just unionized"],
        fill:{spot:["a ruined elven shrine","the king's old hunting lodge","a goblin-infested mine","a wizard's abandoned tower"],beast:["owlbear","wyvern","young green dragon","feral griffon"],pests:["goblins","kobolds","giant spiders"],item:["a knight's lost signet","a runaway spellbook","an enchanted harp"],person:["a squire on his first errand","an elven envoy","a hedge-wizard's apprentice"]}},
      "Low fantasy / medieval":{w:15,places:["a mud-and-timber valley","a feuding border march","a market town","a fen of stilt villages"],
        quirks:["the local lord owns every road and charges by the hoof","the harvest festival is mandatory, and the fines are steep","everyone blames witches, and one of them actually is one","the miller is the richest man in three valleys and acts like it","nobody trusts coin, so goats change hands instead"],
        fill:{spot:["the lord's tithe barn","a bog-side shrine","the old mill","a bandit-held toll bridge"],beast:["dire wolf","boar of unusual size","bog troll"],pests:["bandits","giant rats","wolves"],item:["the village tithe chest","a holy relic (probably a pig bone)","the lord's seal"],person:["the miller's daughter","a traveling friar","the reeve"]}},
      "Dark fantasy / grimdark":{w:10,places:["a cathedral city under martial law","a land of endless dusk","a war-scarred duchy","a vampire-tithed province"],
        quirks:["the church sells indulgences against monster attacks","curfew bells ring at dusk and nobody asks about latecomers","graves are padlocked by law","the nobles drink something red at every banquet and call it wine","the sun hasn't fully risen in a generation, so lanterns are taxed"],
        fill:{spot:["a padlocked graveyard","the inquisition's cellars","a plague-sealed district","a burned chapel"],beast:["ghoul pack leader","wight","vampire spawn","wraith"],pests:["ghouls","zombies","cultists"],item:["a saint's finger-bone","a forbidden prayer book","the inquisitor's ledger"],person:["a condemned heretic","a gravedigger's son","a disgraced paladin"]}},
      "Fey / whimsical":{w:8,places:["a realm ruled by rival seasonal courts","a mushroom-cap country","a storybook kingdom","a candy-glass archipelago"],
        quirks:["the seasons change whenever the rival courts lose a bet","promises are legally binding, even in jest","names are currency, so everyone uses fake ones","the mushrooms vote, and they're stubbornly conservative","time runs differently on either side of every hedge"],
        fill:{spot:["the Summer Court's hedge-maze","a mushroom ring","a pond that reflects tomorrow","the Winter Queen's ice garden"],beast:["displacer beast","will-o'-wisp","green hag"],pests:["pixies (very rude)","quicklings","twig blights"],item:["a bottled laugh","a borrowed name","the Autumn Prince's crown"],person:["a changeling child","a satyr bard","a mortal who ate fey food"]}},
      "Swashbuckling / nautical":{w:6,places:["an island chain of pirate republics","a sky-sea of airship ports","a coral-city archipelago"],
        quirks:["every captain is technically a pirate, it just depends on the paperwork","the sea demands a song as toll at the reef gates","ports elect harbormasters by drinking contest","the tides follow a sleeping sea serpent's breathing","maps are illegal, so navigators memorize everything"],
        fill:{spot:["a smuggler's sea cave","a sunken galleon","a reef-ringed island","the free port's harbor"],beast:["giant octopus","sea hag","merrow chieftain","plesiosaurus"],pests:["sahuagin raiders","pirates","giant crabs"],item:["a letter of marque","a cursed compass","a chest of salt-crusted gold"],person:["a shipwrecked noble","a cabin boy who saw too much","a retired privateer"]}}
    },
    other:{
      "Steampunk / gaslamp":{w:6,places:["a brass canal city","a smog-wrapped industrial empire","a clockwork guild-state"],
        quirks:["clockwork constables ticket anyone loitering near machinery","every guild holds a patent on something you need","the smog is so thick that streets are named by smell","airship mail is reliable except on Tuesdays (union rules)","the city's great engine must be wound by hand each dawn"],
        fill:{spot:["a boiler works","the airship docks","a sealed patent-office vault","the canal locks"],beast:["rogue iron golem","clockwork spider","escaped lab chimera"],pests:["haywire modrons","brass-plated sewer rats","mechanical vermin"],item:["a stolen blueprint","a prototype aether-cell","an inventor's diary"],person:["an eccentric inventor","a chimney-sweep child","a factory whistleblower"]}},
      "Frontier / weird west":{w:4,places:["a mana-rush frontier town","a railroad-cut badland","a mesa country of ghost towns"],
        quirks:["mana-rich ore turned every prospector into a hedge-wizard","the railroad company owns the sheriff","duels are legal, but the paperwork is brutal","the dead don't always stay buried in the badlands","water is worth more than gold out here"],
        fill:{spot:["a played-out mana mine","the rail camp","a ghost-town saloon","a mesa-top shrine"],beast:["bulette","giant eagle (thunderbird)","ankheg"],pests:["claim jumpers","giant scorpions","outlaws"],item:["a mining claim deed","a payroll strongbox","a medicine bundle"],person:["a rail surveyor","a frontier marshal","a prospector's widow"]}},
      "Post-apocalyptic":{w:4,places:["the ruins of a world that already died once","a fungal wasteland","a drowned-coast salvage town"],
        quirks:["the old world's machines still run, but nobody knows what for","clean water is the only currency anyone trusts","settlements trade by radio, mostly in riddles","the ash storms keep a schedule, sort of","scavengers revere the old world's vending machines"],
        fill:{spot:["a collapsed transit tunnel","a scrap-walled settlement","an old-world bunker","the ash dunes"],beast:["mutated owlbear","gorgon","purple worm"],pests:["raiders","ghouls","giant mutant insects"],item:["a working water purifier","an old-world keycard","a cache of seed stock"],person:["a scavenger kid","a settlement doctor","a bunker-born archivist"]}},
      "Planar / elemental":{w:3,places:["a world made of slow fire","a sky of drifting earth-motes","an ocean with no surface"],
        quirks:["fire elementals run the bureaucracy, and it shows","gravity is a suggestion near the motes","everyone carries a warding charm or ends up as weather","the lava rivers are polite but strict about trespassing","efreeti merchants haggle as a form of greeting"],
        fill:{spot:["the brass bazaar","an earth-mote quarry","an elemental vortex","a salamander forge"],beast:["fire elemental","xorn","air elemental","salamander"],pests:["magmins","mephits","striking azers"],item:["a bottled efreeti contract","a cooled ember of the world's core","a mote anchor"],person:["a genasi diplomat","a lost azer smith","a djinni's stranded servant"]}},
      "Modern":{w:2,places:["a rainy commuter city","a sleepy suburb","a megacity where magic is illegal"],
        quirks:["magic is real but everyone pretends it's an app","the subway runs one extra station that isn't on any map","half the city council are vampires, and everyone knows","coffee shops double as wizard libraries","phones work, but only if you're polite to them"],
        fill:{spot:["a closed subway station","a corporate tower's sublevel","an antique shop","a parking garage at 3am"],beast:["doppelganger","werewolf","gargoyle"],pests:["imps in the walls","goblins in the vents","a nest of shadows"],item:["a cursed smartphone","a stolen briefcase","a vintage tarot deck"],person:["an influencer","a night-shift nurse","a librarian who knows too much"]}},
      "Cyberpunk / sci-fi":{w:2,places:["a neon arcology","a generation starship","a terraformed moon colony"],
        quirks:["memories trade on the open market","the megacorps sponsor the weather","citizens' lifespans run on subscription","the arcology's AI has opinions about adventurers","street magic is outlawed, so it's everywhere"],
        fill:{spot:["a data vault","the undercity markets","an orbital elevator","a derelict cargo hold"],beast:["rogue war-construct","helmed horror (security drone)","mind flayer in a corporate suit"],pests:["gangers","malfunctioning drones","nanite swarms"],item:["a data chip","an experimental cyberarm","a corporate prototype"],person:["a runaway clone","a hacker","a corporate defector"]}}
    }
  },
  locales:{
    "The City (base bazaar)":{quirks:["stall rents rise and fall with the Tree's moods","merchants from a hundred worlds argue over whose coins are real (the CCV settles it)","street signs translate themselves, unreliably","a new species arrives every week and someone has to explain sidewalks"],
      fill:{spot:["the bazaar's night market","a warehouse by the root docks","a back-alley spice vault"],pests:["giant rats","pickpocket imps","escaped market beasts"],person:["a stall-keeper from another world","a lost tourist","a bazaar courier"]}},
    "Inside the Tree":{quirks:["the carved halls rearrange slightly each season","sap leaks count as a civic emergency","the Tree hums when guilds argue","the Iron Quarter's lifts are pulled by very tired beetles"],
      fill:{spot:["a sap-flooded gallery","the Iron Quarter's lift shafts","a sealed heartwood chamber","the undercellars of the Iron Quarter"],pests:["bark beetles the size of dogs","sap slimes","giant rats"],person:["an Iron Quarter landlord","a guild apprentice","a Council courier"]}},
    "The Trunk":{quirks:["paths shift when no one is watching","chalk waymarks sometimes rewrite themselves","echoes of other worlds leak through the bark"],
      fill:{spot:["a forgotten trunk waystation","a crossroads of three branches","a knot-hollow off the main path"],pests:["trunk-mites","lost wanderers turned feral","gray oozes"],person:["a stranded traveler","a waystation keeper","a mapmaker"]}}
  },
  worldBlock:{
    magic:["Magic is a myth here","Magic is rare and feared","Magic is uncommon but known","Magic is everyday","Magic is everywhere, even the dirt hums"],
    factions:["a tax-collecting priesthood","a guild of smugglers","a reclusive mages' circle","a peasant militia","a merchant cartel","an old noble house","a cult of the Tree","a mercenary company","a bureaucracy that runs on paperwork","a resistance movement"],
    threats:["a creeping rot in the local branch","a necromancer gathering the restless dead","a monster awakened by mining","a tyrant with an artifact","a rival guild cutting corners","a planar rift leaking strangeness","famine and the bandits it breeds","a dragon claiming tribute","a severed root starving the land","a plague of wrongness nobody can name"]
  },
  patrons:{
    "Local commoner":{w:24,wealth:0.6,archetypes:{
      "Farmer":["favor","food"],"Innkeeper":["favor","food"],"Fisher":["favor","wondrous"],"Baker":["food","favor"],"Street urchin crew":["favor","info"],"Retired adventurer":["weapon","armor"]}},
    "Merchant":{w:24,wealth:1.0,archetypes:{
      "Alchemist":["potion"],"Blacksmith":["weapon","armor"],"Bookseller":["scroll"],"Caravan master":["favor","wondrous"],"Jeweler":["wondrous"],"Herbalist":["potion"],"Curio dealer":["wondrous","scroll"]}},
    "Noble":{w:12,wealth:1.4,archetypes:{
      "Minor lord":["weapon","favor"],"Exiled heir":["favor","wondrous"],"Dowager":["wondrous","favor"],"Ambitious magistrate":["favor","info"]}},
    "Guild":{w:16,wealth:1.1,archetypes:{
      "Mages' guild":["scroll","wondrous"],"Healers' hall":["potion","favor"],"Thieves' guild":["info","wondrous"],"Higher-tier guild (outsourcing)":["weapon","armor","favor"],"Cartographers' guild":["info","wondrous"]}},
    "Council":{w:10,wealth:1.2,archetypes:{
      "Iron seat clerk":["favor","info"],"Council archivist":["scroll","info"],"Tier-mandated order":["favor","wondrous"]}},
    "Otherworldly being":{w:14,wealth:1.3,archetypes:{
      "Fey courtier":["wondrous","favor"],"Lost celestial":["potion","favor"],"Talking tree":["wondrous","potion"],"Bored dragon":["wondrous","weapon"],"Ghost with unfinished business":["info","wondrous"]}}
  },
  patronNames:["Odessa Brindle","Fennick Laux","Mother Quill","Sir Pellam Vane","Grubb","Ilsabet Marrow","Tamsin Rook","Old Hobb","Vasha Dunmere","Corwin Teague","Pip Larkspur","Hesper Thrane","Barnaby Coil","Yselde of the Hollow","Marrow-and-Ash","Jory Fenwick","Lady Ottoline Crest","Kettle","Brother Amsel","Nim Whistledown"],
  patronQuirks:["talks to their hat","overpays and then regrets it","insists on a signed contract in triplicate","is clearly lying about one detail","weeps easily","is suspicious of anyone taller than them","only speaks in questions","brings snacks to every meeting","keeps checking over their shoulder","is far too cheerful about the danger","is related to someone important (and mentions it)","cannot remember the party's names"],
  objectives:{
    "Fetch":["retrieve {item} from {spot}","deliver {item} to {spot} before it spoils","gather {count} {ingredient} from {spot}"],
    "Extermination":["clear {pests} out of {spot}","stop whatever keeps eating the {livestock}","drive {pests} away from {spot} for good"],
    "Escort":["escort {person} safely through {spot}","guard a shipment of {item} bound for {spot}"],
    "Investigation":["find out why {mystery}","track down whoever has been {crime}"],
    "Hunt":["hunt the {beast} stalking {spot}","bring back proof that the {beast} is dead"],
    "Rescue":["rescue {person}, taken to {spot}","find {person}, last seen near {spot}"],
    "Diplomacy":["broker peace between {faction} and {faction2}","deliver terms to {faction} without starting a war"],
    "Heist":["recover {item}, now held in {spot}","quietly swap {item} for a fake at {spot}"],
    "World Crisis":["stop the {doom} consuming this world's branch","find the source of the {doom} spreading up the roots"]
  },
  fill:{
    item:["a sealed lockbox","grandmother's recipe book","a cracked crystal egg","a bag of very angry seeds","the deed to a windmill","a tuning fork that hums alone","a jar of bottled starlight","a stolen family portrait"],
    spot:["the old mill","a flooded crypt","the undercellars of the Iron Quarter","a hollow in the Tree's bark","an abandoned watchtower","the bog road","a sunken library","the bandits' quarry camp","a root-tunnel nobody maps"],
    count:["a dozen","three bushels of","twenty","a cartload of"],
    ingredient:["glowcaps","frost-thistle","sap blisters","owlbear feathers","giggling moss"],
    pests:["giant rats","stirges","a goblin squat","overgrown beetles","kobold tunnelers","sentient weeds"],
    livestock:["sheep","prize hogs","chickens","messenger pigeons"],
    person:["a nervous scholar","the mayor's nephew","a retired priest","a pregnant merchant","a stubborn goat-herder","a lost child","a minor celebrity bard"],
    mystery:["the well water tastes of copper","the town clock runs backward","people forget their names at dusk","the harvest rots overnight","the dogs won't stop howling at the Tree"],
    crime:["stealing gravestones","forging guild seals","poisoning the cisterns","kidnapping cats","selling fake planar maps"],
    beast:["owlbear","dire wolf pack leader","wyvern","basilisk","hill troll","manticore","bulette"],
    faction:["the river barons","the mushroom folk","a dwarven clan","the toll-keepers","the hill tribes","a rival guild"],
    faction2:["their estranged cousins","the city watch","a druid circle","the mill owners","a fey court"],
    doom:["rot","blight","necrotic bloom","silence","crystal plague","root-severing"]
  },
  complications:["The patron is lying about what the job really is.","A rival guild has taken the same job.","There's a hard time limit nobody mentioned.","The target is sympathetic, maybe even right.","The reward is in a currency the CCV hates (it complains).","Someone important is secretly the culprit.","The weather (or the world) turns against them.","An innocent is caught in the middle.","The job is bait for a trap aimed at the guild.","A second patron offers more to do the opposite.","Local law forbids exactly what the job requires.","The 'monster' is guarding something worse.","The patron dies, disappears, or changes their mind mid-job.","Something follows them back to the Tree."],
  goldBaseByLevel:[0,30,60,100,150,250,350,500,650,850,1100,1500,2000,2600,3300,4200,5300,6800,8500,10500,13000],
  rarityByTier:[["common","uncommon"],["uncommon"],["uncommon","rare"],["rare","very rare"],["very rare","legendary"]],
  items:{
    potion:{"common":["Potion of Healing","Potion of Climbing"],"uncommon":["Potion of Greater Healing","Potion of Water Breathing","Potion of Fire Breath","Potion of Resistance"],"rare":["Potion of Superior Healing","Potion of Heroism","Potion of Invisibility"],"very rare":["Potion of Supreme Healing","Potion of Flying","Potion of Speed"],"legendary":["Potion of Storm Giant Strength"]},
    scroll:{"common":["Spell Scroll (cantrip or 1st level)"],"uncommon":["Spell Scroll (2nd–3rd level)"],"rare":["Spell Scroll (4th–5th level)"],"very rare":["Spell Scroll (6th–8th level)"],"legendary":["Spell Scroll (9th level)"]},
    weapon:{"common":["Silvered weapon","Weapon with a harmless magical quirk"],"uncommon":["+1 Weapon","Weapon of Warning","Moon Sickle"],"rare":["+2 Weapon","Flame Tongue","Dragon Slayer"],"very rare":["+3 Weapon","Oathbow","Dancing Sword"],"legendary":["Vorpal Sword","Holy Avenger"]},
    armor:{"common":["Armor of Gleaming","Cast-Off Armor"],"uncommon":["+1 Shield","Mithral Armor","Adamantine Armor"],"rare":["+1 Armor","Armor of Resistance","+2 Shield"],"very rare":["+2 Armor","Animated Shield"],"legendary":["+3 Armor","Armor of Invulnerability"]},
    wondrous:{"common":["Cloak of Many Fashions","Pot of Awakening","Charlatan's Die","Candle of the Deep"],"uncommon":["Bag of Holding","Cloak of Protection","Goggles of Night","Driftglobe"],"rare":["Cloak of Displacement","Necklace of Fireballs","Ring of Protection"],"very rare":["Cloak of Arachnida","Manual of Bodily Health"],"legendary":["Cloak of Invisibility","Ring of Three Wishes"]},
    favor:{"common":["A small favor owed"],"uncommon":["A standing discount with the patron"],"rare":["Introductions to powerful people"],"very rare":["A powerful ally's debt"],"legendary":["A boon from a mighty being"]},
    food:{"common":["Free meals for a week"],"uncommon":["A month of free lodging and meals"],"rare":["A feast in the guild's honor"],"very rare":["A standing table at a famous house"],"legendary":["A legendary banquet (heroes' boon)"]},
    info:{"common":["A useful rumor"],"uncommon":["A map or secret route"],"rare":["Blackmail on a rival"],"very rare":["The location of a lost relic"],"legendary":["A truth about the First"]}
  },
  xpBudget:[[0,0,0],[50,75,100],[100,150,200],[150,225,400],[250,375,500],[500,750,1100],[600,1000,1400],[750,1300,1700],[1000,1700,2100],[1300,2000,2600],[1600,2300,3100],[1900,2900,4100],[2200,3700,4700],[2600,4200,5400],[2900,4900,6200],[3300,5400,7800],[3800,6100,9800],[4500,7200,11700],[5000,8700,14200],[5500,10700,17200],[6400,13200,22000]],
  fightPlan:{"Small":"1 fight (Moderate)","Standard":"1–2 fights (e.g. one High, or Moderate + Low across a rest)","Major":"Per session: 1–2 fights, respecting ~1 per short rest / 2 per long rest"}
};
