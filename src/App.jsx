import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, onSnapshot } from "firebase/firestore";

// ── Firebase config ──────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyCxAeCIb9v24skB8Gjka9yufJgOvI3bAiE",
  authDomain: "ankit-french-vocab.firebaseapp.com",
  projectId: "ankit-french-vocab",
  storageBucket: "ankit-french-vocab.firebasestorage.app",
  messagingSenderId: "177857252822",
  appId: "1:177857252822:web:6e84be598dd05374842877",
  measurementId: "G-LYHN6XG51Y"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const DOC_REF = doc(db, "vocab", "ankit-words");

// ── Default word list ────────────────────────────────────────────
const DEFAULT_WORDS = [
  { id: 1, french: "le docteur", english: "the doctor", example_fr: "Le docteur examine les patients.", example_en: "The doctor examines the patients.", category: "Professions", icon: "🩺", learned: false },
  { id: 6, french: "le pompier", english: "the firefighter", example_fr: "Le pompier sauve des vies.", example_en: "The firefighter saves lives.", category: "Professions", icon: "🚒", learned: false },
  { id: 2, french: "prescrire", english: "to prescribe", example_fr: "Il prescrit des médicaments.", example_en: "He prescribes medication.", category: "Verbs", icon: "📋", learned: false },
  { id: 3, french: "soigner", english: "to treat / to care for", example_fr: "L'infirmière soigne les patients.", example_en: "The nurse treats the patients.", category: "Verbs", icon: "💊", learned: false },
  { id: 4, french: "éteindre", english: "to extinguish / to put out", example_fr: "Le pompier éteint l'incendie.", example_en: "The firefighter puts out the fire.", category: "Verbs", icon: "🔥", learned: false },
  { id: 5, french: "concevoir", english: "to design / to develop", example_fr: "L'ingénieur conçoit des solutions.", example_en: "The engineer designs solutions.", category: "Verbs", icon: "⚙️", learned: false },
  { id: 7, french: "distribuer", english: "to distribute / to deliver", example_fr: "Le facteur distribue le courrier.", example_en: "The mail carrier delivers the mail.", category: "Verbs", icon: "📬", learned: false },
  { id: 8, french: "conduire", english: "to drive", example_fr: "Il conduit les passagers à destination.", example_en: "He drives the passengers to their destination.", category: "Verbs", icon: "🚗", learned: false },
  { id: 101, french: "le transport", english: "transport", example_fr: "Le transport est cher ici.", example_en: "Transport is expensive here.", category: "Nouns", icon: "🚌", learned: false },
  { id: 102, french: "le trajet", english: "trip / route", example_fr: "Le trajet dure dix minutes.", example_en: "The trip takes ten minutes.", category: "Nouns", icon: "🗺️", learned: false },
  { id: 103, french: "le voyage", english: "travel / journey", example_fr: "Bon voyage à Paris !", example_en: "Have a good journey to Paris!", category: "Nouns", icon: "✈️", learned: false },
  { id: 104, french: "la voiture", english: "car", example_fr: "J'ai une petite voiture.", example_en: "I have a small car.", category: "Nouns", icon: "🚗", learned: false },
  { id: 105, french: "le bus / l'arrêt", english: "bus / stop", example_fr: "Le bus arrive à l'arrêt.", example_en: "The bus arrives at the stop.", category: "Nouns", icon: "🚌", learned: false },
  { id: 106, french: "le taxi", english: "taxi", example_fr: "Je prends un taxi ce soir.", example_en: "I am taking a taxi tonight.", category: "Nouns", icon: "🚕", learned: false },
  { id: 107, french: "le train / la gare", english: "train / station", example_fr: "Le train part de la gare.", example_en: "The train leaves from the station.", category: "Nouns", icon: "🚆", learned: false },
  { id: 108, french: "le métro", english: "subway", example_fr: "Le métro est rapide.", example_en: "The subway is fast.", category: "Nouns", icon: "🚇", learned: false },
  { id: 109, french: "le tramway", english: "tram", example_fr: "Le tramway traverse la ville.", example_en: "The tram crosses the city.", category: "Nouns", icon: "🚊", learned: false },
  { id: 110, french: "le vélo", english: "bicycle", example_fr: "Mon vélo est rouge.", example_en: "My bicycle is red.", category: "Nouns", icon: "🚲", learned: false },
  { id: 111, french: "la moto / le scooter", english: "motorcycle / scooter", example_fr: "Il a une nouvelle moto.", example_en: "He has a new motorcycle.", category: "Nouns", icon: "🏍️", learned: false },
  { id: 112, french: "le camion", english: "truck", example_fr: "Le camion est très grand.", example_en: "The truck is very big.", category: "Nouns", icon: "🚚", learned: false },
  { id: 113, french: "le parking", english: "parking lot", example_fr: "Le parking est gratuit.", example_en: "The parking lot is free.", category: "Nouns", icon: "🅿️", learned: false },
  { id: 114, french: "l'avion / l'aéroport", english: "airplane / airport", example_fr: "Je vais à l'aéroport.", example_en: "I am going to the airport.", category: "Nouns", icon: "✈️", learned: false },
  { id: 115, french: "le vol", english: "flight", example_fr: "Votre vol est à l'heure.", example_en: "Your flight is on time.", category: "Nouns", icon: "🛫", learned: false },
  { id: 116, french: "le bateau / le ferry", english: "boat / ferry", example_fr: "Nous prenons le bateau.", example_en: "We are taking the boat.", category: "Nouns", icon: "⛴️", learned: false },
  { id: 117, french: "le navire", english: "ship", example_fr: "Le navire est au port.", example_en: "The ship is at the port.", category: "Nouns", icon: "🚢", learned: false },
  { id: 118, french: "marcher / à pied", english: "to walk / on foot", example_fr: "Je vais au travail à pied.", example_en: "I go to work on foot.", category: "Verbs", icon: "🚶", learned: false },
  { id: 119, french: "courir", english: "to run", example_fr: "Tu cours dans le parc.", example_en: "You run in the park.", category: "Verbs", icon: "🏃", learned: false },
  { id: 120, french: "la maison", english: "house", example_fr: "Ma maison est bleue.", example_en: "My house is blue.", category: "Nouns", icon: "🏠", learned: false },
  { id: 121, french: "la chambre", english: "bedroom", example_fr: "Ma chambre est calme.", example_en: "My bedroom is quiet.", category: "Nouns", icon: "🛏️", learned: false },
  { id: 122, french: "la salle de bain", english: "bathroom", example_fr: "La salle de bain est propre.", example_en: "The bathroom is clean.", category: "Nouns", icon: "🛁", learned: false },
  { id: 123, french: "la cuisine", english: "kitchen", example_fr: "Je cuisine dans la cuisine.", example_en: "I cook in the kitchen.", category: "Nouns", icon: "🍳", learned: false },
  { id: 124, french: "le salon / le séjour", english: "living room", example_fr: "On regarde la télé au salon.", example_en: "We watch TV in the living room.", category: "Nouns", icon: "🛋️", learned: false },
  { id: 125, french: "la salle à manger", english: "dining room", example_fr: "La salle à manger est grande.", example_en: "The dining room is big.", category: "Nouns", icon: "🍽️", learned: false },
  { id: 126, french: "le bureau", english: "office / desk", example_fr: "Mon bureau est rangé.", example_en: "My desk is tidy.", category: "Nouns", icon: "🖥️", learned: false },
  { id: 127, french: "le grenier / la cave", english: "attic / basement", example_fr: "Il y a du vin à la cave.", example_en: "There is wine in the basement.", category: "Nouns", icon: "🏚️", learned: false },
  { id: 128, french: "le couloir", english: "hallway", example_fr: "Le couloir est long.", example_en: "The hallway is long.", category: "Nouns", icon: "🚪", learned: false },
  { id: 129, french: "le dressing", english: "walk-in closet", example_fr: "Mon dressing est plein.", example_en: "My closet is full.", category: "Nouns", icon: "👗", learned: false },
  { id: 130, french: "le balcon / le jardin", english: "balcony / garden", example_fr: "Le chien joue dans le jardin.", example_en: "The dog plays in the garden.", category: "Nouns", icon: "🌿", learned: false },
  { id: 131, french: "le garage", english: "garage", example_fr: "La voiture est au garage.", example_en: "The car is in the garage.", category: "Nouns", icon: "🏎️", learned: false },
  { id: 132, french: "la terrasse / véranda", english: "terrace / conservatory", example_fr: "Nous dînons sur la terrasse.", example_en: "We eat dinner on the terrace.", category: "Nouns", icon: "🌅", learned: false },
  { id: 133, french: "la salle de sport", english: "gym", example_fr: "Je vais à la salle de sport.", example_en: "I go to the gym.", category: "Nouns", icon: "💪", learned: false },
  { id: 134, french: "le lit / le canapé", english: "bed / sofa", example_fr: "Le lit est confortable.", example_en: "The bed is comfortable.", category: "Nouns", icon: "🛏️", learned: false },
  { id: 135, french: "la table / la chaise", english: "table / chair", example_fr: "Le pain est sur la table.", example_en: "The bread is on the table.", category: "Nouns", icon: "🪑", learned: false },
  { id: 136, french: "l'armoire", english: "wardrobe", example_fr: "Mes vêtements sont dans l'armoire.", example_en: "My clothes are in the wardrobe.", category: "Nouns", icon: "🚪", learned: false },
  { id: 137, french: "la commode", english: "chest of drawers", example_fr: "La commode est blanche.", example_en: "The chest of drawers is white.", category: "Nouns", icon: "🗄️", learned: false },
  { id: 138, french: "l'étagère", english: "shelf", example_fr: "Le livre est sur l'étagère.", example_en: "The book is on the shelf.", category: "Nouns", icon: "📚", learned: false },
  { id: 139, french: "le miroir", english: "mirror", example_fr: "Je regarde le miroir.", example_en: "I look at the mirror.", category: "Nouns", icon: "🪞", learned: false },
  { id: 140, french: "la lampe", english: "lamp", example_fr: "Allume la lampe.", example_en: "Turn on the lamp.", category: "Nouns", icon: "💡", learned: false },
  { id: 141, french: "le tapis / le rideau", english: "rug / curtain", example_fr: "Je ferme le rideau.", example_en: "I am closing the curtain.", category: "Nouns", icon: "🪟", learned: false },
  { id: 142, french: "la bibliothèque", english: "bookshelf", example_fr: "Ma bibliothèque est grande.", example_en: "My bookshelf is big.", category: "Nouns", icon: "📖", learned: false },
  { id: 143, french: "la porte / la fenêtre", english: "door / window", example_fr: "J'ouvre la fenêtre.", example_en: "I am opening the window.", category: "Nouns", icon: "🚪", learned: false },
  { id: 144, french: "le frigo", english: "fridge", example_fr: "Le lait est dans le frigo.", example_en: "The milk is in the fridge.", category: "Nouns", icon: "🧊", learned: false },
  { id: 145, french: "le four / la cuisinière", english: "oven / stove", example_fr: "Le gâteau est dans le four.", example_en: "The cake is in the oven.", category: "Nouns", icon: "🔥", learned: false },
  { id: 146, french: "le micro-ondes", english: "microwave", example_fr: "Je chauffe mon plat.", example_en: "I heat up my dish.", category: "Nouns", icon: "📡", learned: false },
  { id: 147, french: "l'évier", english: "sink", example_fr: "L'évier est plein.", example_en: "The sink is full.", category: "Nouns", icon: "🚰", learned: false },
  { id: 148, french: "l'assiette", english: "plate", example_fr: "Voici ton assiette.", example_en: "Here is your plate.", category: "Nouns", icon: "🍽️", learned: false },
  { id: 149, french: "le verre / la tasse", english: "glass / cup", example_fr: "Je veux une tasse de thé.", example_en: "I want a cup of tea.", category: "Nouns", icon: "☕", learned: false },
  { id: 150, french: "la fourchette", english: "fork", example_fr: "La fourchette est à gauche.", example_en: "The fork is on the left.", category: "Nouns", icon: "🍴", learned: false },
  { id: 151, french: "le couteau", english: "knife", example_fr: "Le couteau coupe bien.", example_en: "The knife cuts well.", category: "Nouns", icon: "🔪", learned: false },
  { id: 152, french: "la cuillère", english: "spoon", example_fr: "Je mange avec une cuillère.", example_en: "I eat with a spoon.", category: "Nouns", icon: "🥄", learned: false },
  { id: 153, french: "la douche / baignoire", english: "shower / bathtub", example_fr: "Je prends une douche.", example_en: "I take a shower.", category: "Nouns", icon: "🚿", learned: false },
  { id: 154, french: "le lavabo", english: "bathroom sink", example_fr: "Je lave mes mains au lavabo.", example_en: "I wash my hands at the sink.", category: "Nouns", icon: "🪥", learned: false },
  { id: 155, french: "la serviette", english: "towel", example_fr: "La serviette est sèche.", example_en: "The towel is dry.", category: "Nouns", icon: "🧺", learned: false },
  { id: 156, french: "le savon / shampoing", english: "soap / shampoo", example_fr: "Je me lave avec du savon.", example_en: "I wash myself with soap.", category: "Nouns", icon: "🧴", learned: false },
  { id: 157, french: "la brosse à dents", english: "toothbrush", example_fr: "Voici ma brosse à dents.", example_en: "Here is my toothbrush.", category: "Nouns", icon: "🪥", learned: false },
  { id: 158, french: "la machine à laver", english: "washing machine", example_fr: "Je lave mes vêtements.", example_en: "I am washing my clothes.", category: "Nouns", icon: "🫧", learned: false },
  { id: 159, french: "l'aspirateur", english: "vacuum cleaner", example_fr: "Je passe l'aspirateur.", example_en: "I am vacuuming.", category: "Nouns", icon: "🧹", learned: false },
  { id: 160, french: "le chauffage", english: "heating", example_fr: "Le chauffage est en marche.", example_en: "The heating is on.", category: "Nouns", icon: "🌡️", learned: false },
  { id: 161, french: "les parents", english: "parents", example_fr: "Mes parents sont gentils.", example_en: "My parents are kind.", category: "Nouns", icon: "👨‍👩‍👧", learned: false },
  { id: 162, french: "le père / la mère", english: "father / mother", example_fr: "Mon père est médecin.", example_en: "My father is a doctor.", category: "Nouns", icon: "👪", learned: false },
  { id: 163, french: "le fils / la fille", english: "son / daughter", example_fr: "Mon fils a cinq ans.", example_en: "My son is five years old.", category: "Nouns", icon: "👦", learned: false },
  { id: 164, french: "le frère / la sœur", english: "brother / sister", example_fr: "J'ai une sœur.", example_en: "I have a sister.", category: "Nouns", icon: "👫", learned: false },
  { id: 165, french: "le grand-père", english: "grandfather", example_fr: "Mon grand-père est vieux.", example_en: "My grandfather is old.", category: "Nouns", icon: "👴", learned: false },
  { id: 166, french: "la grand-mère", english: "grandmother", example_fr: "Ma grand-mère est ici.", example_en: "My grandmother is here.", category: "Nouns", icon: "👵", learned: false },
  { id: 167, french: "l'oncle / la tante", english: "uncle / aunt", example_fr: "Ma tante habite à Lyon.", example_en: "My aunt lives in Lyon.", category: "Nouns", icon: "🧑‍🤝‍🧑", learned: false },
  { id: 168, french: "le cousin / la cousine", english: "cousin", example_fr: "Mon cousin est étudiant.", example_en: "My cousin is a student.", category: "Nouns", icon: "🤝", learned: false },
  { id: 169, french: "le mari / la femme", english: "husband / wife", example_fr: "C'est ma femme, Marie.", example_en: "This is my wife, Marie.", category: "Nouns", icon: "💍", learned: false },
  { id: 170, french: "le petit ami / la petite amie", english: "boyfriend / girlfriend", example_fr: "Son petit ami est grand.", example_en: "Her boyfriend is tall.", category: "Nouns", icon: "❤️", learned: false },
  { id: 171, french: "le bébé", english: "baby", example_fr: "Le bébé dort maintenant.", example_en: "The baby is sleeping now.", category: "Nouns", icon: "👶", learned: false },
  { id: 172, french: "le neveu / la nièce", english: "nephew / niece", example_fr: "Mon neveu est jeune.", example_en: "My nephew is young.", category: "Nouns", icon: "🧒", learned: false },
  { id: 173, french: "le pain", english: "bread", example_fr: "J'achète du pain frais.", example_en: "I buy fresh bread.", category: "Nouns", icon: "🍞", learned: false },
  { id: 174, french: "le fromage", english: "cheese", example_fr: "Le fromage est bon.", example_en: "The cheese is good.", category: "Nouns", icon: "🧀", learned: false },
  { id: 175, french: "les œufs", english: "eggs", example_fr: "Je mange des œufs.", example_en: "I eat eggs.", category: "Nouns", icon: "🥚", learned: false },
  { id: 176, french: "le lait / le beurre", english: "milk / butter", example_fr: "Le lait est froid.", example_en: "The milk is cold.", category: "Nouns", icon: "🥛", learned: false },
  { id: 177, french: "la viande / le poulet", english: "meat / chicken", example_fr: "Nous mangeons du poulet.", example_en: "We are eating chicken.", category: "Nouns", icon: "🍗", learned: false },
  { id: 178, french: "le poisson", english: "fish", example_fr: "Le poisson est frais.", example_en: "The fish is fresh.", category: "Nouns", icon: "🐟", learned: false },
  { id: 179, french: "le riz / les pâtes", english: "rice / pasta", example_fr: "Je cuisine du riz.", example_en: "I am cooking rice.", category: "Nouns", icon: "🍚", learned: false },
  { id: 180, french: "les légumes", english: "vegetables", example_fr: "J'aime les légumes.", example_en: "I like vegetables.", category: "Nouns", icon: "🥦", learned: false },
  { id: 181, french: "les fruits", english: "fruits", example_fr: "Les fruits sont sucrés.", example_en: "The fruits are sweet.", category: "Nouns", icon: "🍎", learned: false },
  { id: 182, french: "la pomme / la carotte", english: "apple / carrot", example_fr: "Je mange une pomme.", example_en: "I am eating an apple.", category: "Nouns", icon: "🍎", learned: false },
  { id: 183, french: "le café / le thé", english: "coffee / tea", example_fr: "Je bois un thé chaud.", example_en: "I am drinking a hot tea.", category: "Nouns", icon: "☕", learned: false },
  { id: 184, french: "le jus d'orange", english: "orange juice", example_fr: "Je veux un jus d'orange.", example_en: "I want an orange juice.", category: "Nouns", icon: "🍊", learned: false },
  { id: 185, french: "l'eau", english: "water", example_fr: "Une bouteille d'eau, s'il vous plaît.", example_en: "A bottle of water, please.", category: "Nouns", icon: "💧", learned: false },
  { id: 186, french: "le vin / la bière", english: "wine / beer", example_fr: "Un verre de vin rouge.", example_en: "A glass of red wine.", category: "Nouns", icon: "🍷", learned: false },
  { id: 187, french: "les collations", english: "snacks", example_fr: "J'apporte des collations.", example_en: "I am bringing snacks.", category: "Nouns", icon: "🍿", learned: false },
  { id: 188, french: "les boissons", english: "drinks / beverages", example_fr: "Il y a des boissons fraîches.", example_en: "There are cold drinks.", category: "Nouns", icon: "🥤", learned: false },
  { id: 189, french: "lundi... dimanche", english: "Monday... Sunday", example_fr: "Lundi, je travaille.", example_en: "Monday, I work.", category: "Other", icon: "📅", learned: false },
  { id: 190, french: "janvier... décembre", english: "January... December", example_fr: "Janvier est froid.", example_en: "January is cold.", category: "Other", icon: "🗓️", learned: false },
  { id: 191, french: "aujourd'hui", english: "today", example_fr: "Aujourd'hui, c'est lundi.", example_en: "Today is Monday.", category: "Expressions", icon: "📆", learned: false },
  { id: 192, french: "le lendemain", english: "the next day", example_fr: "Le lendemain, je suis fatigué.", example_en: "The next day, I am tired.", category: "Expressions", icon: "⏭️", learned: false },
  { id: 193, french: "pendant", english: "during / for (time)", example_fr: "Je lis pendant une heure.", example_en: "I read for an hour.", category: "Grammar", icon: "⏳", learned: false },
  { id: 194, french: "chaque semaine", english: "every week", example_fr: "Je fais du sport chaque semaine.", example_en: "I exercise every week.", category: "Expressions", icon: "🔁", learned: false },
  { id: 195, french: "chaque", english: "every / each", example_fr: "Chaque matin, je bois du café.", example_en: "Every morning, I drink coffee.", category: "Grammar", icon: "🔄", learned: false },
  { id: 196, french: "tous / toutes", english: "all / every", example_fr: "Tous les jours, je marche.", example_en: "Every day, I walk.", category: "Grammar", icon: "✅", learned: false },
  { id: 197, french: "ensuite", english: "then / next", example_fr: "Je mange, ensuite je dors.", example_en: "I eat, then I sleep.", category: "Grammar", icon: "➡️", learned: false },
  { id: 198, french: "bleu / vert / rouge", english: "blue / green / red", example_fr: "La voiture est rouge.", example_en: "The car is red.", category: "Adjectives", icon: "🎨", learned: false },
  { id: 199, french: "noir / blanc / jaune", english: "black / white / yellow", example_fr: "Le chat est noir.", example_en: "The cat is black.", category: "Adjectives", icon: "🖤", learned: false },
  { id: 200, french: "le stylo / le livre", english: "pen / book", example_fr: "J'écris avec un stylo.", example_en: "I am writing with a pen.", category: "Nouns", icon: "✏️", learned: false },
  { id: 201, french: "le sac / la montre", english: "bag / watch", example_fr: "Ma montre est neuve.", example_en: "My watch is new.", category: "Nouns", icon: "👜", learned: false },
  { id: 202, french: "le téléphone", english: "telephone / phone", example_fr: "Mon téléphone sonne.", example_en: "My phone is ringing.", category: "Nouns", icon: "📱", learned: false },
  { id: 203, french: "je suis en retard", english: "I am late", example_fr: "Pardon, je suis en retard.", example_en: "Sorry, I am late.", category: "Expressions", icon: "⏰", learned: false },
  { id: 204, french: "les courses", english: "grocery shopping", example_fr: "Je fais les courses à midi.", example_en: "I am grocery shopping at noon.", category: "Expressions", icon: "🛒", learned: false },
  { id: 205, french: "combien ça coûte ?", english: "how much is it?", example_fr: "Pardon, combien ça coûte ?", example_en: "Excuse me, how much is it?", category: "Expressions", icon: "💶", learned: false },
  { id: 206, french: "félicitations", english: "congratulations", example_fr: "Félicitations pour l'examen !", example_en: "Congratulations on the exam!", category: "Expressions", icon: "🎉", learned: false },
  { id: 207, french: "tout le monde", english: "everyone", example_fr: "Tout le monde est là.", example_en: "Everyone is here.", category: "Expressions", icon: "👥", learned: false },
  { id: 208, french: "c'est parti !", english: "let's go!", example_fr: "C'est parti ! On y va.", example_en: "Let's go! We're going.", category: "Expressions", icon: "🚀", learned: false },
  { id: 209, french: "j'ai faim", english: "I am hungry", example_fr: "J'ai faim, je veux manger.", example_en: "I'm hungry, I want to eat.", category: "Expressions", icon: "🍽️", learned: false },
  { id: 210, french: "n'oubliez pas", english: "don't forget", example_fr: "N'oubliez pas votre passeport.", example_en: "Don't forget your passport.", category: "Expressions", icon: "⚠️", learned: false },
  { id: 211, french: "je ramène toujours", english: "I always bring back", example_fr: "Je ramène toujours des cadeaux.", example_en: "I always bring back gifts.", category: "Expressions", icon: "🎁", learned: false },
  { id: 212, french: "rien ne me rend", english: "nothing makes me", example_fr: "Rien ne me rend triste.", example_en: "Nothing makes me sad.", category: "Expressions", icon: "😐", learned: false },
  { id: 213, french: "m'envahit", english: "overwhelms me", example_fr: "La joie m'envahit.", example_en: "Joy overwhelms me.", category: "Expressions", icon: "🌊", learned: false },
  { id: 214, french: "jolie", english: "nice / pretty", example_fr: "Elle habite dans une jolie maison.", example_en: "She lives in a pretty house.", category: "Adjectives", icon: "✨", learned: false },
  { id: 215, french: "jeune", english: "young", example_fr: "Il est très jeune.", example_en: "He is very young.", category: "Adjectives", icon: "🧒", learned: false },
  { id: 216, french: "tranquille", english: "calm / quiet", example_fr: "Le quartier est tranquille.", example_en: "The neighbourhood is calm.", category: "Adjectives", icon: "😌", learned: false },
  { id: 217, french: "même", english: "same / even", example_fr: "Nous avons le même avis.", example_en: "We have the same opinion.", category: "Adjectives", icon: "🤝", learned: false },
  { id: 218, french: "vieil / vieille", english: "old (person/thing)", example_fr: "Ton vieil ami de l'école.", example_en: "Your old friend from school.", category: "Adjectives", icon: "👴", learned: false },
  { id: 219, french: "célibataire", english: "single / bachelor", example_fr: "Il est encore célibataire.", example_en: "He is still single.", category: "Adjectives", icon: "💔", learned: false },
  { id: 220, french: "gratuit / gratuite", english: "free (no cost)", example_fr: "Ce musée est gratuit.", example_en: "This museum is free.", category: "Adjectives", icon: "🆓", learned: false },
  { id: 221, french: "partir", english: "to leave", example_fr: "Je pars pour mon cours.", example_en: "I am leaving for my class.", category: "Verbs", icon: "🚪", learned: false },
  { id: 222, french: "ranger", english: "to tidy up / to clean", example_fr: "Je range ma chambre.", example_en: "I tidy up my bedroom.", category: "Verbs", icon: "🧹", learned: false },
  { id: 223, french: "garder", english: "to keep / to maintain / to hold", example_fr: "Il garde son calme.", example_en: "He keeps his calm.", category: "Verbs", icon: "🤲", learned: false },
  { id: 224, french: "voir", english: "to see", example_fr: "Je veux voir ce film.", example_en: "I want to see this film.", category: "Verbs", icon: "👁️", learned: false },
  { id: 225, french: "apprendre", english: "to learn", example_fr: "J'apprends le français.", example_en: "I am learning French.", category: "Verbs", icon: "📚", learned: false },
  { id: 226, french: "croire", english: "to believe", example_fr: "Je crois en toi.", example_en: "I believe in you.", category: "Verbs", icon: "🙏", learned: false },
  { id: 227, french: "sourire", english: "to smile", example_fr: "Tu as un grand sourire.", example_en: "You have a big smile.", category: "Verbs", icon: "😊", learned: false },
  { id: 228, french: "embrasser", english: "to kiss / to hug", example_fr: "Il embrasse sa mère.", example_en: "He kisses his mother.", category: "Verbs", icon: "🤗", learned: false },
  { id: 229, french: "peindre", english: "to paint", example_fr: "Elle peint un tableau.", example_en: "She paints a picture.", category: "Verbs", icon: "🎨", learned: false },
  { id: 230, french: "le quartier", english: "neighbourhood / district", example_fr: "Je n'aime pas mon quartier.", example_en: "I don't like my neighbourhood.", category: "Nouns", icon: "🏘️", learned: false },
  { id: 231, french: "le meuble", english: "furniture / piece of furniture", example_fr: "Ce meuble est ancien.", example_en: "This piece of furniture is old.", category: "Nouns", icon: "🪑", learned: false },
  { id: 232, french: "le fauteuil", english: "armchair", example_fr: "Mon grand-père dort dans le fauteuil.", example_en: "My grandfather sleeps in the armchair.", category: "Nouns", icon: "🛋️", learned: false },
  { id: 233, french: "la rue", english: "street", example_fr: "La rue est animée.", example_en: "The street is lively.", category: "Nouns", icon: "🛣️", learned: false },
  { id: 234, french: "l'accueil", english: "welcome / reception", example_fr: "L'accueil est chaleureux.", example_en: "The welcome is warm.", category: "Nouns", icon: "🤝", learned: false },
  { id: 235, french: "le cadeau", english: "gift / present", example_fr: "Je lui offre un cadeau.", example_en: "I give him a gift.", category: "Nouns", icon: "🎁", learned: false },
  { id: 236, french: "la table en bois", english: "wooden table", example_fr: "Nous avons une table en bois.", example_en: "We have a wooden table.", category: "Nouns", icon: "🪵", learned: false },
  { id: 237, french: "l'équipe", english: "team", example_fr: "L'équipe prépare les documents.", example_en: "The team prepares the documents.", category: "Nouns", icon: "👥", learned: false },
  { id: 238, french: "au-dessus", english: "above / over", example_fr: "Le livre est au-dessus de la table.", example_en: "The book is above the table.", category: "Grammar", icon: "⬆️", learned: false },
  { id: 239, french: "quelques", english: "some / a few", example_fr: "J'ai quelques questions.", example_en: "I have a few questions.", category: "Grammar", icon: "🔢", learned: false },
  { id: 240, french: "car", english: "because / for (formal)", example_fr: "Je reste car il pleut.", example_en: "I stay because it is raining.", category: "Grammar", icon: "🔗", learned: false },
  { id: 241, french: "comme", english: "like / as", example_fr: "Il chante comme un oiseau.", example_en: "He sings like a bird.", category: "Grammar", icon: "🔀", learned: false },
  { id: 242, french: "posé", english: "asked / placed / calm", example_fr: "Il m'a posé une question.", example_en: "He asked me a question.", category: "Grammar", icon: "❓", learned: false },
  { id: 243, french: "elle-même", english: "herself", example_fr: "Elle l'a fait elle-même.", example_en: "She did it herself.", category: "Grammar", icon: "👩", learned: false },
  { id: 244, french: "lui-même", english: "himself", example_fr: "Il l'a réparé lui-même.", example_en: "He repaired it himself.", category: "Grammar", icon: "👨", learned: false },
  { id: 245, french: "la gaffe", english: "mistake / blunder", example_fr: "J'ai fait une gaffe.", example_en: "I made a blunder.", category: "Nouns", icon: "😬", learned: false },

  // --- Professions (masculine/feminine pairs) ---
  { id: 301, french: "l'enseignant / l'enseignante", english: "the teacher (m/f)", example_fr: "L'enseignante explique la leçon.", example_en: "The teacher explains the lesson.", category: "Professions", icon: "👨‍🏫", learned: false },
  { id: 302, french: "le chauffeur / la chauffeuse", english: "the driver (m/f)", example_fr: "Le chauffeur conduit prudemment.", example_en: "The driver drives carefully.", category: "Professions", icon: "🚖", learned: false },
  { id: 303, french: "le mécanicien / la mécanicienne", english: "the mechanic (m/f)", example_fr: "Le mécanicien répare la voiture.", example_en: "The mechanic repairs the car.", category: "Professions", icon: "👨‍🔧", learned: false },
  { id: 304, french: "le facteur / la factrice", english: "the mail carrier (m/f)", example_fr: "La factrice distribue le courrier.", example_en: "The mail carrier delivers the mail.", category: "Professions", icon: "📬", learned: false },
  { id: 305, french: "le pompier / la pompière", english: "the firefighter (m/f)", example_fr: "La pompière éteint l'incendie.", example_en: "The firefighter puts out the fire.", category: "Professions", icon: "👨‍🚒", learned: false },
  { id: 306, french: "l'infirmier / l'infirmière", english: "the nurse (m/f)", example_fr: "L'infirmière soigne les patients.", example_en: "The nurse treats the patients.", category: "Professions", icon: "👨‍⚕️", learned: false },
  { id: 307, french: "le docteur / la docteure", english: "the doctor (m/f)", example_fr: "La docteure examine le patient.", example_en: "The doctor examines the patient.", category: "Professions", icon: "👨‍⚕️", learned: false },
  { id: 308, french: "le pharmacien / la pharmacienne", english: "the pharmacist (m/f)", example_fr: "Le pharmacien délivre les médicaments.", example_en: "The pharmacist dispenses the medication.", category: "Professions", icon: "⚖️", learned: false },
  { id: 309, french: "le serveur / la serveuse", english: "the waiter / waitress", example_fr: "La serveuse apporte le menu.", example_en: "The waitress brings the menu.", category: "Professions", icon: "🤵", learned: false },
  { id: 310, french: "le cuisinier / la cuisinière", english: "the chef / cook (m/f)", example_fr: "Le cuisinier prépare un plat délicieux.", example_en: "The chef prepares a delicious dish.", category: "Professions", icon: "👨‍🍳", learned: false },
  { id: 311, french: "le vendeur / la vendeuse", english: "the salesperson (m/f)", example_fr: "La vendeuse aide les clients.", example_en: "The saleswoman helps the customers.", category: "Professions", icon: "👨‍💼", learned: false },
  { id: 312, french: "l'électricien / l'électricienne", english: "the electrician (m/f)", example_fr: "L'électricien installe les câbles.", example_en: "The electrician installs the cables.", category: "Professions", icon: "⚡", learned: false },
  { id: 313, french: "l'ingénieur / l'ingénieure", english: "the engineer (m/f)", example_fr: "L'ingénieure conçoit le projet.", example_en: "The engineer designs the project.", category: "Professions", icon: "🏗️", learned: false },
  { id: 314, french: "le guide / la guide", english: "the tour guide (m/f)", example_fr: "Le guide explique l'histoire.", example_en: "The tour guide explains the history.", category: "Professions", icon: "🚩", learned: false },
  { id: 315, french: "le traducteur / la traductrice", english: "the translator (m/f)", example_fr: "La traductrice parle cinq langues.", example_en: "The translator speaks five languages.", category: "Professions", icon: "🗣️", learned: false },
  { id: 316, french: "le policier / la policière", english: "the police officer (m/f)", example_fr: "Le policier patrouille dans la rue.", example_en: "The police officer patrols the street.", category: "Professions", icon: "👮", learned: false },
  { id: 246, french: "quai", english: "platform / quay", example_fr: "Le train est au quai numéro deux.", example_en: "The train is at platform two.", category: "Nouns", icon: "🚉", learned: false },
];

const CATEGORIES = ["All", "Verbs", "Nouns", "Adjectives", "Professions", "Expressions", "Grammar", "Other"];
const TABS = ["📚 My Words", "🃏 Flashcards", "🧠 Quiz", "➕ Add Word"];
const CAT_COLORS = { Verbs: "#2c5f8a", Nouns: "#5a3a8a", Adjectives: "#8a5a2c", Professions: "#2c7a4a", Expressions: "#8a2c5a", Grammar: "#4a6a2c", Other: "#6a6a6a" };

export default function FrenchVocabApp() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [tab, setTab] = useState(0);
  const [filterCat, setFilterCat] = useState("All");
  const [filterLearned, setFilterLearned] = useState("all");
  const [search, setSearch] = useState("");
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [cardCat, setCardCat] = useState("All");
  const [cardShowLearned, setCardShowLearned] = useState(false);
  const [quizWords, setQuizWords] = useState([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizOptions, setQuizOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [quizCat, setQuizCat] = useState("All");
  const [quizShowLearned, setQuizShowLearned] = useState(false);
  const [form, setForm] = useState({ french: "", english: "", example_fr: "", example_en: "", category: "Other", icon: "" });
  const [addSuccess, setAddSuccess] = useState(false);
  const [editId, setEditId] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [addMode, setAddMode] = useState("single"); // single | bulk | csv
  const [bulkText, setBulkText] = useState("");
  const [bulkProcessing, setBulkProcessing] = useState(false);
  const [bulkProgress, setBulkProgress] = useState(0);
  const [bulkTotal, setBulkTotal] = useState(0);
  const [bulkDone, setBulkDone] = useState(false);

  // ── Firebase: listen for real-time updates ──────────────────────
  useEffect(() => {
    const unsub = onSnapshot(DOC_REF, (snap) => {
      if (snap.exists()) {
        setWords(snap.data().words || DEFAULT_WORDS);
      } else {
        // First time: seed the database with default words
        setDoc(DOC_REF, { words: DEFAULT_WORDS });
        setWords(DEFAULT_WORDS);
      }
      setLoading(false);
    }, () => {
      setWords(DEFAULT_WORDS);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // ── Save to Firebase whenever words change ───────────────────────
  const saveWords = async (newWords) => {
    setWords(newWords);
    setSyncing(true);
    try { await setDoc(DOC_REF, { words: newWords }); } catch {}
    setTimeout(() => setSyncing(false), 1000);
  };


  const speak = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.split('/')[0].trim());
    u.lang = 'fr-FR';
    u.rate = 0.7;
    u.pitch = 1.0;
    // Try to find a natural French voice
    const voices = window.speechSynthesis.getVoices();
    const frVoice = voices.find(v => v.lang.startsWith('fr') && v.localService) ||
                    voices.find(v => v.lang.startsWith('fr'));
    if (frVoice) u.voice = frVoice;
    window.speechSynthesis.speak(u);
  };

  const openForvo = (text) => {
    const word = text.split('/')[0].trim().replace(/^(le|la|les|l'|un|une)\s+/i, '').trim();
    window.open(`https://forvo.com/search/${encodeURIComponent(word)}/fr/`, '_blank');
  };

  const bulkAutoFill = async (wordList) => {
    setBulkProcessing(true); setBulkDone(false);
    setBulkTotal(wordList.length); setBulkProgress(0);
    const newWords = [];
    for (let i = 0; i < wordList.length; i++) {
      const french = wordList[i].trim();
      if (!french) continue;
      try {
        const res = await fetch("/.netlify/functions/autofill", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ frenchWord: french })
        });
        const data = await res.json();
        const text = data.content?.map(c => c.text || "").join("") || "";
        const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
        newWords.push({ id: Date.now() + i, french, english: parsed.english || "", example_fr: parsed.example_fr || "", example_en: parsed.example_en || "", category: parsed.category || "Other", icon: parsed.icon || "📝", learned: false });
      } catch {
        newWords.push({ id: Date.now() + i, french, english: "", example_fr: "", example_en: "", category: "Other", icon: "📝", learned: false });
      }
      setBulkProgress(i + 1);
      await new Promise(r => setTimeout(r, 500));
    }
    await saveWords([...words, ...newWords]);
    setBulkProcessing(false); setBulkDone(true); setBulkText("");
  };

  const handleBulkSubmit = () => {
    const lines = bulkText.split('\n').map(l => l.trim()).filter(Boolean);
    if (!lines.length) return;
    bulkAutoFill(lines);
  };

  const handleCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const lines = ev.target.result.split('\n').slice(1); // skip header
      const parsed = lines.map(line => {
        const cols = line.split(',').map(c => c.replace(/"/g, '').trim());
        if (!cols[0]) return null;
        return { id: Date.now() + Math.random(), french: cols[0] || "", english: cols[1] || "", example_fr: cols[2] || "", example_en: cols[3] || "", category: cols[4] || "Other", icon: cols[5] || "📝", learned: false };
      }).filter(Boolean);
      saveWords([...words, ...parsed]);
      setBulkDone(true);
    };
    reader.readAsText(file);
  };

  const toggleLearned = (id) => saveWords(words.map(w => w.id === id ? { ...w, learned: !w.learned } : w));
  const learnedCount = words.filter(w => w.learned).length;

  const filteredWords = words.filter(w => {
    const matchCat = filterCat === "All" || w.category === filterCat;
    const matchSearch = w.french.toLowerCase().includes(search.toLowerCase()) || w.english.toLowerCase().includes(search.toLowerCase());
    const matchLearned = filterLearned === "all" || (filterLearned === "learned" && w.learned) || (filterLearned === "learning" && !w.learned);
    return matchCat && matchSearch && matchLearned;
  });

  const cardPool = words.filter(w => (cardCat === "All" || w.category === cardCat) && (cardShowLearned ? true : !w.learned));
  const safeIdx = cardPool.length > 0 ? cardIndex % cardPool.length : 0;
  const currentCard = cardPool[safeIdx];
  const nextCard = () => { setFlipped(false); setTimeout(() => setCardIndex(i => (i + 1) % Math.max(cardPool.length, 1)), 150); };
  const prevCard = () => { setFlipped(false); setTimeout(() => setCardIndex(i => (i - 1 + Math.max(cardPool.length, 1)) % Math.max(cardPool.length, 1)), 150); };

  const getQuizPool = () => words.filter(w => (quizCat === "All" || w.category === quizCat) && (quizShowLearned ? true : !w.learned));
  const startQuiz = () => {
    const pool = getQuizPool();
    if (pool.length < 4) return;
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, Math.min(10, pool.length));
    setQuizWords(shuffled); setQuizIndex(0); setScore(0); setSelected(null); setQuizDone(false);
    genOpts(shuffled, 0, pool);
  };
  const genOpts = (qw, idx, pool) => {
    const correct = qw[idx];
    const others = pool.filter(w => w.id !== correct.id).sort(() => Math.random() - 0.5).slice(0, 3);
    setQuizOptions([...others, correct].sort(() => Math.random() - 0.5));
  };
  const handleAnswer = (opt) => {
    if (selected) return;
    setSelected(opt.id);
    if (opt.id === quizWords[quizIndex].id) setScore(s => s + 1);
    setTimeout(() => {
      if (quizIndex + 1 >= quizWords.length) { setQuizDone(true); return; }
      setQuizIndex(i => i + 1); setSelected(null);
      genOpts(quizWords, quizIndex + 1, getQuizPool());
    }, 1000);
  };

  const autoFill = async () => {
    if (!form.french.trim()) return;
    setAiLoading(true); setAiError("");
    try {
      const res = await fetch("/.netlify/functions/autofill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          frenchWord: form.french.trim()
        })
      });
      const data = await res.json();
      const text = data.content?.map(c => c.text || "").join("") || "";
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      setForm(f => ({ ...f, english: parsed.english || f.english, example_fr: parsed.example_fr || f.example_fr, example_en: parsed.example_en || f.example_en, category: parsed.category || f.category, icon: parsed.icon || f.icon }));
    } catch { setAiError("Couldn't auto-fill. Fill in manually."); }
    setAiLoading(false);
  };

  const handleAdd = () => {
    if (!form.french || !form.english) return;
    let newWords;
    if (editId) { newWords = words.map(w => w.id === editId ? { ...w, ...form } : w); setEditId(null); }
    else newWords = [...words, { ...form, id: Date.now(), learned: false }];
    saveWords(newWords);
    setForm({ french: "", english: "", example_fr: "", example_en: "", category: "Other", icon: "" });
    setAddSuccess(true); setTimeout(() => setAddSuccess(false), 2500);
  };

  const handleEdit = (word) => {
    setForm({ french: word.french, english: word.english, example_fr: word.example_fr || "", example_en: word.example_en || "", category: word.category, icon: word.icon || "" });
    setEditId(word.id); setTab(3);
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#f5f0e8", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
      <div style={{ fontSize: 48 }}>🇫🇷</div>
      <div style={{ fontSize: 18, color: "#1a3a5c", fontFamily: "Georgia,serif", fontWeight: "bold" }}>Loading your vocab journal...</div>
      <div style={{ width: 40, height: 40, border: "4px solid #c8973a", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Georgia', serif", minHeight: "100vh", background: "#f5f0e8", color: "#2c2416" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .lbtn { transition: all 0.18s; } .lbtn:hover { transform: scale(1.08); }
        .cflip { transition: transform 0.5s; transform-style: preserve-3d; cursor: pointer; }
        .cflip.on { transform: rotateY(180deg); }
        .cface { position:absolute; width:100%; height:100%; backface-visibility:hidden; border-radius:18px; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:24px; box-sizing:border-box; }
        .cback { transform: rotateY(180deg); }
      `}</style>

      {/* Header */}
      <div style={{ background: "#1a3a5c", padding: "20px 20px 16px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(45deg,transparent,transparent 10px,rgba(255,255,255,0.03) 10px,rgba(255,255,255,0.03) 20px)" }} />
        <div style={{ position: "relative" }}>
          <div style={{ fontSize: 11, letterSpacing: 4, color: "#a8c5e8", textTransform: "uppercase", marginBottom: 4 }}>Mon Carnet de Vocabulaire</div>
          <h1 style={{ margin: 0, fontSize: 26, color: "#fff", fontWeight: "bold" }}>🇫🇷 French Vocab Journal</h1>
          <div style={{ fontSize: 13, color: "#a8c5e8", marginTop: 6, display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
            <span>TEF Prep · August 2026</span>
            <span>📚 {words.length} words</span>
            <span>✅ {learnedCount} learned · 🔄 {words.length - learnedCount} to go</span>
            {syncing && <span style={{ fontSize: 11, background: "rgba(200,151,58,0.3)", padding: "2px 8px", borderRadius: 10, color: "#e8d090" }}>☁️ Saving...</span>}
            {!syncing && <span style={{ fontSize: 11, background: "rgba(39,174,96,0.3)", padding: "2px 8px", borderRadius: 10, color: "#90e8b0" }}>☁️ Synced</span>}
          </div>
          {words.length > 0 && (
            <div style={{ margin: "10px auto 0", maxWidth: 300, height: 5, background: "rgba(255,255,255,0.15)", borderRadius: 4 }}>
              <div style={{ height: "100%", background: "#c8973a", borderRadius: 4, width: `${Math.round((learnedCount / words.length) * 100)}%`, transition: "width 0.5s" }} />
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", background: "#13304f" }}>
        {TABS.map((t, i) => (
          <button key={i} onClick={() => setTab(i)} style={{ flex: 1, padding: "12px 6px", border: "none", background: tab === i ? "#f5f0e8" : "transparent", color: tab === i ? "#1a3a5c" : "#a8c5e8", fontSize: 13, fontWeight: tab === i ? "bold" : "normal", cursor: "pointer", borderBottom: tab === i ? "3px solid #c8973a" : "3px solid transparent", transition: "all 0.2s", whiteSpace: "nowrap" }}>{t}</button>
        ))}
      </div>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "18px 14px" }}>

        {/* MY WORDS */}
        {tab === 0 && (
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search..." style={{ flex: 1, minWidth: 120, padding: "9px 12px", border: "2px solid #c8c0b0", borderRadius: 8, fontSize: 14, background: "#fff", fontFamily: "Georgia,serif" }} />
              <select value={filterCat} onChange={e => setFilterCat(e.target.value)} style={{ padding: "9px 10px", border: "2px solid #c8c0b0", borderRadius: 8, fontSize: 13, background: "#fff", fontFamily: "Georgia,serif" }}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <select value={filterLearned} onChange={e => setFilterLearned(e.target.value)} style={{ padding: "9px 10px", border: "2px solid #c8c0b0", borderRadius: 8, fontSize: 13, background: "#fff", fontFamily: "Georgia,serif" }}>
                <option value="all">All words</option>
                <option value="learning">🔄 Still learning</option>
                <option value="learned">✅ Learned</option>
              </select>
            </div>
            {filteredWords.length === 0 && <div style={{ textAlign: "center", color: "#aaa", padding: 40 }}>No words found.</div>}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {filteredWords.map(word => (
                <div key={word.id} style={{ background: word.learned ? "#f0faf4" : "#fff", borderRadius: 12, padding: "13px 15px", boxShadow: "0 2px 8px rgba(0,0,0,0.07)", borderLeft: `4px solid ${word.learned ? "#27ae60" : "#c8973a"}`, transition: "all 0.3s" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {word.icon && <span style={{ fontSize: 26 }}>{word.icon}</span>}
                      <div>
                        <span style={{ fontSize: 18, fontWeight: "bold", color: "#1a3a5c", textDecoration: word.learned ? "line-through" : "none", opacity: word.learned ? 0.7 : 1 }}>{word.french}</span>
                        <button onClick={(e) => { e.stopPropagation(); speak(word.french); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, padding: "0 4px", opacity: 0.7 }} title="Pronounce">🔊</button>
                        <button onClick={(e) => { e.stopPropagation(); openForvo(word.french); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, padding: "0 2px", opacity: 0.6 }} title="Forvo - human pronunciation">👤</button>
                        <span style={{ fontSize: 13, color: "#888", marginLeft: 4 }}>— {word.english}</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 5, alignItems: "center", flexWrap: "wrap" }}>
                      <span style={{ fontSize: 11, background: "#eef2ff", color: CAT_COLORS[word.category] || "#555", padding: "3px 9px", borderRadius: 20, fontWeight: "bold" }}>{word.category}</span>
                      <button className="lbtn" onClick={() => toggleLearned(word.id)} style={{ border: "none", background: word.learned ? "#d4f7e0" : "#f5f5f5", color: word.learned ? "#27ae60" : "#aaa", borderRadius: 20, padding: "4px 11px", cursor: "pointer", fontSize: 12, fontWeight: "bold" }}>
                        {word.learned ? "✅ Learned" : "☐ Mark learned"}
                      </button>
                      <button onClick={() => handleEdit(word)} style={{ border: "none", background: "#eef2ff", color: "#1a3a5c", borderRadius: 6, padding: "4px 8px", cursor: "pointer", fontSize: 13 }}>✏️</button>
                      <button onClick={() => saveWords(words.filter(w => w.id !== word.id))} style={{ border: "none", background: "#fff0f0", color: "#c0392b", borderRadius: 6, padding: "4px 8px", cursor: "pointer", fontSize: 13 }}>🗑</button>
                    </div>
                  </div>
                  {word.example_fr && (
                    <div style={{ marginTop: 9, borderTop: "1px solid #f0ebe0", paddingTop: 9 }}>
                      <div style={{ fontSize: 13, color: "#2c5f8a", fontStyle: "italic" }}>🇫🇷 {word.example_fr}</div>
                      {word.example_en && <div style={{ fontSize: 12, color: "#888", marginTop: 3 }}>🇬🇧 {word.example_en}</div>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FLASHCARDS */}
        {tab === 1 && (
          <div style={{ textAlign: "center" }}>
            <div style={{ marginBottom: 14, display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
              <select value={cardCat} onChange={e => { setCardCat(e.target.value); setCardIndex(0); setFlipped(false); }} style={{ padding: "8px 12px", border: "2px solid #c8c0b0", borderRadius: 8, fontSize: 13, fontFamily: "Georgia,serif" }}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <button onClick={() => { setCardShowLearned(v => !v); setCardIndex(0); setFlipped(false); }} style={{ padding: "8px 14px", border: `2px solid ${cardShowLearned ? "#27ae60" : "#c8c0b0"}`, background: cardShowLearned ? "#e6f9ec" : "#fff", color: cardShowLearned ? "#27ae60" : "#888", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>
                {cardShowLearned ? "✅ Showing all" : "🔄 Hiding learned"}
              </button>
              <span style={{ alignSelf: "center", fontSize: 13, color: "#888" }}>{cardPool.length} cards</span>
            </div>
            {cardPool.length === 0 ? (
              <div style={{ background: "#fff", borderRadius: 16, padding: "40px 24px", color: "#999" }}>🎉 All words here are learned! Toggle the filter to review.</div>
            ) : (
              <>
                <div style={{ perspective: 700, marginBottom: 18 }}>
                  <div onClick={() => setFlipped(f => !f)} className={`cflip${flipped ? " on" : ""}`} style={{ width: "100%", maxWidth: 460, margin: "0 auto", height: 240, position: "relative" }}>
                    <div className="cface" style={{ background: "linear-gradient(135deg,#1a3a5c,#2c5f8a)", boxShadow: "0 8px 30px rgba(26,58,92,0.3)" }}>
                      <div style={{ fontSize: 10, letterSpacing: 3, color: "#a8c5e8", textTransform: "uppercase", marginBottom: 6 }}>French</div>
                      {currentCard?.icon && <div style={{ fontSize: 46, marginBottom: 8 }}>{currentCard.icon}</div>}
                      <div style={{ fontSize: 28, fontWeight: "bold", color: "#fff" }}>{currentCard?.french}</div>
                      <button onClick={(e) => { e.stopPropagation(); speak(currentCard?.french); }} style={{ marginTop: 10, background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 20, color: "#fff", padding: "6px 14px", cursor: "pointer", fontSize: 14 }}>🔊 Listen</button>
                      <div style={{ fontSize: 11, color: "#a8c5e8", marginTop: 8 }}>👆 Tap to reveal</div>
                    </div>
                    <div className="cface cback" style={{ background: "linear-gradient(135deg,#c8973a,#e8b54a)", boxShadow: "0 8px 30px rgba(200,151,58,0.3)" }}>
                      <div style={{ fontSize: 10, letterSpacing: 3, color: "#5a3a00", textTransform: "uppercase", marginBottom: 6 }}>English</div>
                      {currentCard?.icon && <div style={{ fontSize: 38, marginBottom: 6 }}>{currentCard.icon}</div>}
                      <div style={{ fontSize: 24, fontWeight: "bold", color: "#fff", textAlign: "center" }}>{currentCard?.english}</div>
                      {currentCard?.example_fr && <div style={{ fontSize: 12, color: "#fff9", fontStyle: "italic", textAlign: "center", marginTop: 8, padding: "0 10px" }}>"{currentCard.example_fr}"</div>}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12, justifyContent: "center", alignItems: "center", marginBottom: 12 }}>
                  <button onClick={prevCard} style={{ padding: "10px 22px", background: "#fff", border: "2px solid #1a3a5c", color: "#1a3a5c", borderRadius: 8, fontSize: 18, cursor: "pointer" }}>←</button>
                  <span style={{ fontSize: 14, color: "#888" }}>{safeIdx + 1} / {cardPool.length}</span>
                  <button onClick={nextCard} style={{ padding: "10px 22px", background: "#1a3a5c", border: "none", color: "#fff", borderRadius: 8, fontSize: 18, cursor: "pointer" }}>→</button>
                </div>
                {currentCard && (
                  <button className="lbtn" onClick={() => toggleLearned(currentCard.id)} style={{ padding: "8px 22px", border: `2px solid ${currentCard.learned ? "#27ae60" : "#c8c0b0"}`, background: currentCard.learned ? "#d4f7e0" : "#fff", color: currentCard.learned ? "#27ae60" : "#888", borderRadius: 20, cursor: "pointer", fontSize: 13, fontWeight: "bold" }}>
                    {currentCard.learned ? "✅ Learned — click to undo" : "☐ Mark as Learned"}
                  </button>
                )}
                <div style={{ marginTop: 10, fontSize: 12, color: "#bbb" }}>Tap card to flip · Arrows to navigate · Mark learned to skip</div>
              </>
            )}
          </div>
        )}

        {/* QUIZ */}
        {tab === 2 && (
          <div>
            {!quizWords.length || quizDone ? (
              <div style={{ textAlign: "center" }}>
                {quizDone && (
                  <div style={{ marginBottom: 18, background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                    <div style={{ fontSize: 52, marginBottom: 6 }}>{score >= quizWords.length * 0.8 ? "🏆" : score >= quizWords.length * 0.5 ? "👍" : "📖"}</div>
                    <div style={{ fontSize: 26, fontWeight: "bold", color: "#1a3a5c" }}>{score} / {quizWords.length}</div>
                    <div style={{ fontSize: 14, color: "#888", marginTop: 4 }}>{score >= quizWords.length * 0.8 ? "Excellent! Très bien! 🇫🇷" : score >= quizWords.length * 0.5 ? "Pas mal! Keep going!" : "Continuez! Courage!"}</div>
                  </div>
                )}
                <div style={{ background: "#fff", borderRadius: 12, padding: 22, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                  <div style={{ fontWeight: "bold", marginBottom: 12, color: "#1a3a5c", textAlign: "left" }}>Quiz settings:</div>
                  <div style={{ marginBottom: 10, textAlign: "left" }}>
                    <label style={{ fontSize: 13, color: "#555", display: "block", marginBottom: 4 }}>Category</label>
                    <select value={quizCat} onChange={e => setQuizCat(e.target.value)} style={{ padding: "9px 14px", border: "2px solid #c8c0b0", borderRadius: 8, fontSize: 14, fontFamily: "Georgia,serif", width: "100%" }}>
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <button onClick={() => setQuizShowLearned(v => !v)} style={{ width: "100%", padding: "9px", marginBottom: 14, border: `2px solid ${quizShowLearned ? "#27ae60" : "#c8c0b0"}`, background: quizShowLearned ? "#e6f9ec" : "#fff", color: quizShowLearned ? "#27ae60" : "#888", borderRadius: 8, cursor: "pointer", fontSize: 13, fontFamily: "Georgia,serif" }}>
                    {quizShowLearned ? "✅ Including learned words" : "🔄 Skipping learned words"}
                  </button>
                  <button onClick={startQuiz} disabled={getQuizPool().length < 4} style={{ width: "100%", padding: "13px", background: getQuizPool().length >= 4 ? "#1a3a5c" : "#ccc", color: "#fff", border: "none", borderRadius: 10, fontSize: 16, fontWeight: "bold", cursor: getQuizPool().length >= 4 ? "pointer" : "default", letterSpacing: 1 }}>
                    {quizDone ? "🔄 Try Again" : "▶ Start Quiz"}
                  </button>
                  {getQuizPool().length < 4 && <div style={{ color: "#c0392b", marginTop: 10, fontSize: 13 }}>⚠️ Need at least 4 words.</div>}
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontSize: 14, color: "#888" }}>
                  <span>Question {quizIndex + 1} / {quizWords.length}</span>
                  <span>Score: {score} ⭐</span>
                </div>
                <div style={{ background: "linear-gradient(135deg,#1a3a5c,#2c5f8a)", borderRadius: 16, padding: "26px 22px", textAlign: "center", marginBottom: 16, color: "#fff" }}>
                  <div style={{ fontSize: 11, letterSpacing: 3, color: "#a8c5e8", marginBottom: 6 }}>What does this mean in English?</div>
                    <div style={{ fontSize: 30, fontWeight: "bold" }}>{quizWords[quizIndex].french}</div>
                  {quizWords[quizIndex].example_fr && <div style={{ fontSize: 13, fontStyle: "italic", color: "#a8c5e8", marginTop: 8 }}>"{quizWords[quizIndex].example_fr}"</div>}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {quizOptions.map(opt => {
                    let bg = "#fff", border = "2px solid #e0d8cc", col = "#2c2416";
                    if (selected) {
                      if (opt.id === quizWords[quizIndex].id) { bg = "#e6f9ec"; border = "2px solid #27ae60"; col = "#1a5c2a"; }
                      else if (opt.id === selected) { bg = "#fde8e8"; border = "2px solid #c0392b"; col = "#8a1a1a"; }
                    }
                    return (
                      <button key={opt.id} onClick={() => handleAnswer(opt)} style={{ padding: "13px 10px", background: bg, border, borderRadius: 10, fontSize: 14, cursor: selected ? "default" : "pointer", color: col, fontFamily: "Georgia,serif", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                        {opt.icon && <span style={{ fontSize: 18 }}>{opt.icon}</span>}
                        <span>{opt.english}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ADD WORD */}
        {tab === 3 && (
          <div>
            {/* Mode switcher */}
            {!editId && (
              <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                {[["single","➕ Single"],["bulk","📋 Bulk List"],["csv","📂 CSV File"]].map(([m,label]) => (
                  <button key={m} onClick={() => { setAddMode(m); setBulkDone(false); }} style={{ flex: 1, padding: "10px", border: `2px solid ${addMode===m?"#1a3a5c":"#e0d8cc"}`, background: addMode===m?"#1a3a5c":"#fff", color: addMode===m?"#fff":"#888", borderRadius: 8, fontSize: 13, fontWeight: "bold", cursor: "pointer" }}>{label}</button>
                ))}
              </div>
            )}

            {/* BULK LIST MODE */}
            {addMode === "bulk" && !editId && (
              <div style={{ background: "#fff", borderRadius: 16, padding: 22, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", marginBottom: 14 }}>
                <h2 style={{ margin: "0 0 8px", color: "#1a3a5c", fontSize: 20 }}>📋 Bulk Add Words</h2>
                <p style={{ fontSize: 13, color: "#888", margin: "0 0 12px" }}>Type or paste one French word per line. Auto-Fill will fill in the meaning, examples and emoji for each one automatically!</p>
                <textarea value={bulkText} onChange={e => setBulkText(e.target.value)} placeholder={"le soleil, la lune, la forêt..."} rows={8} style={{ width: "100%", padding: "10px 13px", border: "2px solid #e0d8cc", borderRadius: 8, fontSize: 14, fontFamily: "Georgia,serif", boxSizing: "border-box", resize: "vertical" }} />
                {bulkProcessing && (
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 13, color: "#c8973a", marginBottom: 6 }}>⏳ Processing word {bulkProgress} of {bulkTotal}...</div>
                    <div style={{ height: 6, background: "#f0ebe0", borderRadius: 4 }}>
                      <div style={{ height: "100%", background: "#c8973a", borderRadius: 4, width: `${Math.round((bulkProgress/bulkTotal)*100)}%`, transition: "width 0.3s" }} />
                    </div>
                  </div>
                )}
                {bulkDone && <div style={{ marginTop: 10, color: "#27ae60", fontWeight: "bold", fontSize: 14 }}>✅ All words added & synced! ☁️</div>}
                <button onClick={handleBulkSubmit} disabled={!bulkText.trim() || bulkProcessing} style={{ marginTop: 14, width: "100%", padding: "13px", background: bulkText.trim() && !bulkProcessing ? "#1a3a5c" : "#ccc", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: "bold", cursor: bulkText.trim() && !bulkProcessing ? "pointer" : "default" }}>
                  {bulkProcessing ? `⏳ Auto-Filling ${bulkProgress}/${bulkTotal}...` : "✨ Auto-Fill All & Add"}
                </button>
              </div>
            )}

            {/* CSV MODE */}
            {addMode === "csv" && !editId && (
              <div style={{ background: "#fff", borderRadius: 16, padding: 22, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", marginBottom: 14 }}>
                <h2 style={{ margin: "0 0 8px", color: "#1a3a5c", fontSize: 20 }}>📂 Import CSV File</h2>
                <p style={{ fontSize: 13, color: "#888", margin: "0 0 8px" }}>Upload a CSV with columns: <strong>french, english, example_fr, example_en, category, icon</strong></p>
                <div style={{ background: "#f5f0e8", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#7a5a00", marginBottom: 14, fontFamily: "monospace" }}>
                  french,english,example_fr,example_en,category,icon<br/>
                  le soleil,the sun,Le soleil brille.,The sun shines.,Nouns,☀️
                </div>
                <input type="file" accept=".csv" onChange={handleCSV} style={{ width: "100%", padding: "10px", border: "2px solid #e0d8cc", borderRadius: 8, fontSize: 14, cursor: "pointer" }} />
                {bulkDone && <div style={{ marginTop: 10, color: "#27ae60", fontWeight: "bold", fontSize: 14 }}>✅ CSV imported & synced! ☁️</div>}
              </div>
            )}

            {/* SINGLE WORD MODE */}
            {(addMode === "single" || editId) && (
            <div style={{ background: "#fff", borderRadius: 16, padding: 22, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
              <h2 style={{ margin: "0 0 16px", color: "#1a3a5c", fontSize: 20 }}>{editId ? "✏️ Edit Word" : "➕ Add New Word"}</h2>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: "bold", color: "#555", marginBottom: 4 }}>French word / phrase *</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input value={form.french} onChange={e => setForm(f => ({ ...f, french: e.target.value }))} placeholder="e.g. la forêt" style={{ flex: 1, padding: "10px 13px", border: "2px solid #e0d8cc", borderRadius: 8, fontSize: 14, fontFamily: "Georgia,serif", outline: "none" }} />
                  <button onClick={autoFill} disabled={!form.french.trim() || aiLoading} style={{ padding: "10px 13px", background: form.french.trim() && !aiLoading ? "linear-gradient(135deg,#c8973a,#e8b54a)" : "#e0d8cc", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: "bold", cursor: form.french.trim() && !aiLoading ? "pointer" : "default", whiteSpace: "nowrap", minWidth: 90 }}>
                    {aiLoading ? "⏳..." : "✨ Auto-Fill"}
                  </button>
                </div>
                {aiLoading && <div style={{ marginTop: 7, fontSize: 13, color: "#c8973a", display: "flex", alignItems: "center", gap: 6 }}><span style={{ display: "inline-block", width: 13, height: 13, border: "2px solid #c8973a", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> Generating...</div>}
                {aiError && <div style={{ marginTop: 5, fontSize: 13, color: "#c0392b" }}>⚠️ {aiError}</div>}
              </div>
              <div style={{ marginBottom: 14, display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{ width: 48, height: 48, border: "2px solid #e0d8cc", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, background: "#fafafa", flexShrink: 0 }}>{form.icon || <span style={{ color: "#ccc", fontSize: 20 }}>?</span>}</div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: "bold", color: "#555", marginBottom: 4 }}>Icon / Emoji</label>
                  <input value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} placeholder="Auto-filled, or type your own 🌲" style={{ width: "100%", padding: "10px 13px", border: "2px solid #e0d8cc", borderRadius: 8, fontSize: 18, fontFamily: "Georgia,serif", boxSizing: "border-box", outline: "none" }} />
                </div>
              </div>
              {[
                { label: "English meaning *", key: "english", placeholder: "e.g. the forest" },
                { label: "🇫🇷 French example sentence", key: "example_fr", placeholder: "e.g. La forêt est belle en automne." },
                { label: "🇬🇧 English translation", key: "example_en", placeholder: "e.g. The forest is beautiful in autumn." },
              ].map(f => (
                <div key={f.key} style={{ marginBottom: 13 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: "bold", color: "#555", marginBottom: 4 }}>{f.label}</label>
                  <input value={form[f.key]} onChange={e => setForm(frm => ({ ...frm, [f.key]: e.target.value }))} placeholder={f.placeholder} style={{ width: "100%", padding: "10px 13px", border: "2px solid #e0d8cc", borderRadius: 8, fontSize: 14, fontFamily: "Georgia,serif", boxSizing: "border-box", outline: "none" }} />
                </div>
              ))}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: "bold", color: "#555", marginBottom: 4 }}>Category</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={{ width: "100%", padding: "10px 13px", border: "2px solid #e0d8cc", borderRadius: 8, fontSize: 14, fontFamily: "Georgia,serif" }}>
                  {CATEGORIES.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <button onClick={handleAdd} disabled={!form.french || !form.english} style={{ width: "100%", padding: "13px", background: form.french && form.english ? "#1a3a5c" : "#ccc", color: "#fff", border: "none", borderRadius: 10, fontSize: 16, fontWeight: "bold", cursor: form.french && form.english ? "pointer" : "default", letterSpacing: 1 }}>
                {editId ? "✅ Save Changes" : "➕ Add to Journal"}
              </button>
              {editId && <button onClick={() => { setEditId(null); setForm({ french: "", english: "", example_fr: "", example_en: "", category: "Other", icon: "" }); }} style={{ width: "100%", padding: "10px", marginTop: 8, background: "transparent", color: "#888", border: "2px solid #e0d8cc", borderRadius: 10, fontSize: 14, cursor: "pointer" }}>Cancel</button>}
              {addSuccess && <div style={{ marginTop: 13, textAlign: "center", color: "#27ae60", fontWeight: "bold", fontSize: 15 }}>✅ Word saved & synced to all devices! ☁️</div>}
            </div>
            )}
            <div style={{ marginTop: 14, background: "#fffbf0", border: "1px solid #e8d8a0", borderRadius: 10, padding: "11px 15px", fontSize: 13, color: "#7a5a00" }}>
              ☁️ <strong>Firebase sync is active.</strong> Any word you add here will instantly appear on your phone and all other devices!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
