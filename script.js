/* ============================================================
    ____  _______     _______ _   _ ___ _____ _     ____
   |  _ \| ____\ \   / / ___|| | | |_ _| ____| |   |  _ \
   | | | |  _|  \ \ / /\___ \| |_| || ||  _| | |   | | | |
   | |_| | |___  \ V /  ___) |  _  || || |___| |___| |_| |
   |____/|_____|  \_/  |____/|_| |_|___|_____|_____|____/

   Développé par DevShield — sites web premium & cybersécurité
   ============================================================ */

/* ============================================================
   ESCAPE GAME CYBER — Groupe VTech
   Moteur de jeu (Vanilla JS, aucune dépendance)
   ------------------------------------------------------------
   SOMMAIRE
     1. CONFIGURATION (liens modifiables ici)
     2. Icônes SVG
     3. Données des missions
     4. État du jeu
     5. Utilitaires (écrans, sons, notifications, effets)
     6. Fond animé (pluie de code)
     7. Écran d'accueil & introduction
     8. Missions & choix
     9. Scènes de conséquence
    10. Résultats, diagnostic & PDF
    11. Concours & rejouer
    12. Mode borne : inactivité & easter eggs
   ============================================================ */

'use strict';

/* ============================================================
   1. CONFIGURATION — MODIFIEZ CES VALEURS FACILEMENT
   ============================================================ */
const CONFIG = {
  /* Lien du Guide des bons réflexes cyber (PDF ou page web) */
  GUIDE_URL: '#',

  /* Lien du formulaire de participation au tirage au sort */
  FORM_URL: 'https://docs.google.com/forms/d/e/1FAIpQLSfca4J2AijMA4DzImaU2_XUYGqHVDRFXqX9zQbXY8ztbLGQdQ/viewform?usp=header',

  /* Retour automatique à l'accueil après X secondes d'inactivité (mode borne).
     Mettre 0 pour désactiver. */
  IDLE_RESET_SECONDS: 150,

  /* Son activé par défaut (le visiteur peut couper via le HUD) */
  SOUND_DEFAULT: true,
};

/* ============================================================
   2. ICÔNES SVG (réutilisées partout)
   ============================================================ */
const ICONS = {
  mail: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="m4 7 8 6 8-6" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  usb: '<svg viewBox="0 0 24 24"><rect x="8" y="9" width="8" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M10 9V5h4v4M11.2 6.8h.1M12.8 6.8h.1" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M10.5 13h3M12 13v4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  bank: '<svg viewBox="0 0 24 24"><path d="m4 9 8-5 8 5M5 9v8m4.5-8v8m5-8v8M19 9v8M3.5 20h17M3.5 17h17" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  wifi: '<svg viewBox="0 0 24 24"><path d="M2.5 9a15 15 0 0 1 19 0M5.5 12.5a10.5 10.5 0 0 1 13 0M8.5 16a6 6 0 0 1 7 0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="19.2" r="1.4" fill="currentColor"/></svg>',
  skull: '<svg viewBox="0 0 24 24"><path d="M12 3a8 8 0 0 0-8 8c0 2.7 1.2 4.6 3 5.8V20a1.5 1.5 0 0 0 1.5 1.5h7A1.5 1.5 0 0 0 17 20v-3.2c1.8-1.2 3-3.1 3-5.8a8 8 0 0 0-8-8z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="9" cy="11.5" r="1.6" fill="currentColor"/><circle cx="15" cy="11.5" r="1.6" fill="currentColor"/><path d="M10.5 17.5v2M13.5 17.5v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  save: '<svg viewBox="0 0 24 24"><ellipse cx="12" cy="6" rx="7.5" ry="3" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M4.5 6v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V6M4.5 12v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-6" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>',
  shield: '<svg viewBox="0 0 24 24"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  lock: '<svg viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8 10V7a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="15" r="1.6" fill="currentColor"/></svg>',
  phone: '<svg viewBox="0 0 24 24"><path d="M6 4h4l2 5-2.5 1.5a11 11 0 0 0 4 4L15 12l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 4 6a2 2 0 0 1 2-2z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  alert: '<svg viewBox="0 0 24 24"><path d="M12 4 2.8 20h18.4L12 4z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 10v4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="17.4" r="1.1" fill="currentColor"/></svg>',
  file: '<svg viewBox="0 0 24 24"><path d="M6 3h8l4 4v14H6V3z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M14 3v4h4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
  clip: '<svg viewBox="0 0 24 24"><path d="m8 12 6.5-6.5a3.2 3.2 0 0 1 4.5 4.5L10.5 18.5a5 5 0 0 1-7-7L11 4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  check: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m8 12.5 2.6 2.6L16 9.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};

/* ============================================================
   3. DONNÉES DES MISSIONS
   ------------------------------------------------------------
   quality : 'excellent' (+10) | 'good' (+5) | 'warn' (-5) | 'bad' (-15 à -25)
   stage   : type de scène de conséquence (voir section 9)
   ============================================================ */
const MISSIONS = [
  /* ---------- MISSION 1 : le mail piégé ---------- */
  {
    icon: 'mail',
    title: 'Un mail urgent ?',
    context: '08:47 — BUREAU · BOÎTE DE RÉCEPTION',
    situation: 'Un message vient d’arriver. L’expéditeur ressemble à votre fournisseur habituel et le ton est pressant. Une pièce jointe est attachée.',
    exhibit: 'mail',
    diagnostic: {
      strength: 'Vous vérifiez l’identité des expéditeurs avant d’ouvrir une pièce jointe.',
      improvement: 'Méfiez-vous des mails « urgents » : vérifiez toujours l’expéditeur avant d’ouvrir une pièce jointe.',
    },
    choices: [
      {
        label: 'Ouvrir immédiatement la pièce jointe',
        quality: 'bad', delta: -20,
        stage: 'malware',
        headline: 'Le pirate vient d’accéder à votre réseau.',
        detail: 'La pièce jointe contenait un malware. En quelques secondes, il s’est installé et a ouvert une porte dérobée sur votre système.',
        notifs: [
          ['bad', 'Alerte sécurité', '12 postes infectés sur le réseau.'],
          ['bad', 'Service comptabilité', 'Votre comptabilité est inaccessible.'],
        ],
      },
      {
        label: 'Vérifier l’adresse de l’expéditeur',
        quality: 'good', delta: 5,
        stage: 'fraud-mail',
        headline: 'Adresse frauduleuse détectée.',
        detail: 'L’adresse imite celle de votre fournisseur à une lettre près. Le mail est supprimé, la menace est écartée.',
        notifs: [['good', 'Protection active', 'Expéditeur ajouté à la liste noire.']],
      },
      {
        label: 'Appeler le fournisseur pour vérifier',
        quality: 'excellent', delta: 10,
        stage: 'phone-good',
        headline: 'Excellent réflexe : la fraude est confirmée.',
        detail: 'Votre fournisseur n’a jamais envoyé ce mail. Vous alertez vos équipes : personne ne tombera dans le piège.',
        notifs: [
          ['good', 'Menace neutralisée', 'Le mail frauduleux est signalé et bloqué.'],
          ['info', 'Équipe informée', 'Vos collaborateurs sont prévenus de la tentative.'],
        ],
      },
    ],
  },

  /* ---------- MISSION 2 : la clé USB ---------- */
  {
    icon: 'usb',
    title: 'La clé USB mystérieuse',
    context: '10:12 — PARKING DE L’ENTREPRISE',
    situation: 'Un collaborateur a trouvé une clé USB sur le parking. Curieux, il souhaite la brancher sur son poste pour voir ce qu’elle contient.',
    diagnostic: {
      strength: 'Vous avez le bon réflexe face aux supports USB inconnus.',
      improvement: 'Sensibilisez vos collaborateurs : une clé USB trouvée ne se branche jamais sur le réseau.',
    },
    choices: [
      {
        label: 'Le laisser faire, c’est sûrement anodin',
        quality: 'bad', delta: -20,
        stage: 'network-spread',
        headline: 'La clé contenait un ver informatique.',
        detail: 'C’était un piège volontairement déposé sur le parking. Le ver se propage de poste en poste à travers votre réseau.',
        notifs: [
          ['bad', 'Propagation détectée', '12 postes infectés en 3 minutes.'],
          ['bad', 'Production', 'Vos clients ne peuvent plus être livrés.'],
        ],
      },
      {
        label: 'Lui demander de ne surtout pas la brancher',
        quality: 'good', delta: 5,
        stage: 'shield',
        headline: 'Menace écartée.',
        detail: 'Bonne décision : les clés USB « trouvées » sont un grand classique du piratage. Le poste de travail reste sain.',
        notifs: [['good', 'Réseau stable', 'Aucune activité suspecte détectée.']],
      },
      {
        label: 'La transmettre au service informatique',
        quality: 'excellent', delta: 10,
        stage: 'scan-clean',
        headline: 'Clé piégée neutralisée.',
        detail: 'Analysée dans un environnement isolé, la clé contenait bien un logiciel espion. Votre réflexe protège toute l’entreprise.',
        notifs: [
          ['good', 'Analyse terminée', 'Logiciel espion identifié et neutralisé.'],
          ['info', 'Signalement', 'L’incident est documenté pour vos équipes.'],
        ],
      },
    ],
  },

  /* ---------- MISSION 3 : la fraude au RIB ---------- */
  {
    icon: 'bank',
    title: 'Changement de RIB',
    context: '11:30 — SERVICE COMPTABILITÉ',
    situation: 'Votre comptable reçoit un mail de votre fournisseur principal : « Merci de régler la facture de 25 000 € sur notre nouveau compte bancaire. » Le RIB a changé.',
    diagnostic: {
      strength: 'Vous vérifiez les demandes de virement par un second canal (téléphone).',
      improvement: 'Instaurez une double vérification systématique pour tout changement de RIB.',
    },
    choices: [
      {
        label: 'Faire immédiatement le virement',
        quality: 'bad', delta: -20,
        stage: 'money-lost',
        headline: '25 000 € viennent de partir chez un escroc.',
        detail: 'C’était une « fraude au faux fournisseur ». Le compte est à l’étranger, l’argent est irrécupérable.',
        notifs: [
          ['bad', 'Banque', 'Virement exécuté — annulation impossible.'],
          ['bad', 'Trésorerie', 'Votre fournisseur réclame toujours son paiement.'],
        ],
      },
      {
        label: 'Téléphoner au fournisseur au numéro habituel',
        quality: 'excellent', delta: 10,
        stage: 'phone-good',
        headline: 'Fraude au faux RIB déjouée.',
        detail: 'Votre fournisseur n’a jamais changé de compte. Un appel de 2 minutes vient de sauver 25 000 €.',
        notifs: [
          ['good', 'Fraude évitée', '25 000 € restent sur votre compte.'],
          ['info', 'Bon réflexe', 'Toujours vérifier par un canal différent du mail.'],
        ],
      },
      {
        label: 'Attendre quelques jours pour voir',
        quality: 'warn', delta: -5,
        stage: 'warn-wait',
        headline: 'Vous avez eu chaud.',
        detail: 'Le faux fournisseur vous relance avec insistance… ce qui finit par éveiller les soupçons. La fraude est découverte de justesse, mais sans procédure claire, le risque reste entier.',
        notifs: [['warn', 'Procédure manquante', 'Aucune règle de vérification des RIB n’existe.']],
      },
    ],
  },

  /* ---------- MISSION 4 : le télétravail ---------- */
  {
    icon: 'wifi',
    title: 'Travail à distance',
    context: '14:05 — CAFÉ DU CENTRE-VILLE',
    situation: 'Un de vos salariés travaille depuis un café. Il doit accéder aux dossiers clients de l’entreprise. Comment se connecte-t-il ?',
    diagnostic: {
      strength: 'Vous sécurisez le télétravail avec un VPN d’entreprise.',
      improvement: 'Sécurisez le télétravail : proscrivez le Wi-Fi public sans protection, déployez un VPN.',
    },
    choices: [
      {
        label: 'Sur le Wi-Fi public gratuit du café',
        quality: 'bad', delta: -15,
        stage: 'wifi-sniff',
        headline: 'Ses identifiants ont été interceptés.',
        detail: 'Sur un Wi-Fi public, un pirate installé à la table d’à côté peut capter les échanges. Vos accès clients sont compromis.',
        notifs: [
          ['bad', 'Connexion suspecte', 'Accès au serveur depuis un pays inconnu.'],
          ['warn', 'Mots de passe', 'Réinitialisation d’urgence nécessaire.'],
        ],
      },
      {
        label: 'En partage de connexion avec son téléphone',
        quality: 'good', delta: 5,
        stage: 'shield',
        headline: 'Connexion correcte.',
        detail: 'Le partage de connexion 4G/5G est bien plus sûr qu’un Wi-Fi public. Pour les données sensibles, le VPN reste la référence.',
        notifs: [['good', 'Connexion privée', 'Aucune interception possible sur ce canal.']],
      },
      {
        label: 'Via le VPN de l’entreprise',
        quality: 'excellent', delta: 10,
        stage: 'vpn-tunnel',
        headline: 'Tunnel chiffré établi.',
        detail: 'Toutes les données transitent dans un tunnel chiffré. Même sur un réseau public, personne ne peut les lire.',
        notifs: [
          ['good', 'VPN actif', 'Trafic chiffré de bout en bout.'],
          ['info', 'Accès validé', 'Connexion authentifiée au serveur de fichiers.'],
        ],
      },
    ],
  },

  /* ---------- MISSION 5 : le ransomware ---------- */
  {
    icon: 'skull',
    title: 'Attaque en cours !',
    context: '16:40 — TOUS LES ÉCRANS DE L’ENTREPRISE',
    situation: 'Malgré vos efforts, un rançongiciel s’est infiltré. Vos fichiers se chiffrent un à un. Le pirate exige 25 000 € pour vous rendre vos données. Chaque seconde compte.',
    preScene: true,           /* déclenche la prise de contrôle "ransomware" avant les choix */
    diagnostic: {
      strength: 'Vous réagissez vite et bien face à une attaque en cours.',
      improvement: 'Préparez un plan de réponse à incident — et ne payez jamais la rançon.',
    },
    choices: [
      {
        label: 'Payer les 25 000 € pour récupérer les fichiers',
        quality: 'bad', delta: -25,
        stage: 'pay-ransom',
        headline: 'L’argent est parti. Aucune clé reçue.',
        detail: 'Moins d’une victime sur deux récupère ses données après paiement. Pire : vous êtes désormais fiché comme « bon payeur ».',
        notifs: [
          ['bad', 'Transaction confirmée', '25 000 € transférés — aucun retour du pirate.'],
          ['bad', 'Menace persistante', 'Les attaquants reviennent souvent vers ceux qui paient.'],
        ],
      },
      {
        label: 'Déconnecter immédiatement le réseau',
        quality: 'excellent', delta: 10,
        stage: 'disconnect',
        headline: 'Propagation stoppée net.',
        detail: 'En isolant les machines, vous empêchez le chiffrement de se propager. Une grande partie de vos données est préservée.',
        notifs: [
          ['good', 'Réseau isolé', 'Le chiffrement s’arrête à 34 % des fichiers.'],
          ['info', 'Prochaine étape', 'Analyse et restauration en environnement sain.'],
        ],
      },
      {
        label: 'Appeler votre prestataire informatique',
        quality: 'good', delta: 5,
        stage: 'phone-good',
        headline: 'Les experts prennent la main.',
        detail: 'Votre prestataire isole les machines à distance et lance la procédure d’urgence. Quelques minutes ont été perdues, mais la situation est maîtrisée.',
        notifs: [
          ['good', 'Intervention en cours', 'Postes critiques isolés par le prestataire.'],
          ['warn', 'Délai', 'Le chiffrement a progressé pendant l’appel.'],
        ],
      },
    ],
  },

  /* ---------- MISSION 6 : les sauvegardes ---------- */
  {
    icon: 'save',
    title: 'Dernière chance : vos sauvegardes',
    context: '17:15 — CELLULE DE CRISE',
    situation: 'Pour restaurer votre activité sans payer, une seule solution : vos sauvegardes. En avez-vous ? Et surtout… étaient-elles connectées au réseau au moment de l’attaque ?',
    diagnostic: {
      strength: 'Vous disposez d’une stratégie de sauvegarde qui vous rend imprenable.',
      improvement: 'Mettez en place des sauvegardes régulières, testées et déconnectées du réseau (hors ligne).',
    },
    choices: [
      {
        label: 'Oui, des sauvegardes connectées au réseau',
        quality: 'good', delta: 5,
        stage: 'restore-partial',
        headline: 'Restauration partielle réussie.',
        detail: 'Une partie de vos sauvegardes a été chiffrée avec le reste du réseau… mais les plus anciennes ont survécu. Vous repartez, en ayant perdu quelques jours de travail.',
        notifs: [
          ['warn', 'Restauration', '72 % des données récupérées.'],
          ['info', 'Leçon retenue', 'Des sauvegardes hors ligne auraient tout sauvé.'],
        ],
      },
      {
        label: 'Non, aucune sauvegarde',
        quality: 'bad', delta: -20,
        stage: 'no-backup',
        headline: 'Vos données sont définitivement perdues.',
        detail: 'Sans sauvegarde, il faut tout reconstruire : comptabilité, fichiers clients, devis… Une PME sur deux ne s’en relève pas.',
        notifs: [
          ['bad', 'Activité à l’arrêt', 'Plusieurs semaines de reconstruction estimées.'],
          ['bad', 'Impact clients', 'Commandes et historiques irrécupérables.'],
        ],
      },
      {
        label: 'Oui, des sauvegardes déconnectées (hors ligne)',
        quality: 'excellent', delta: 10,
        stage: 'restore-full',
        headline: 'Restauration complète. Vous avez gagné.',
        detail: 'Vos sauvegardes hors ligne étaient hors d’atteinte du pirate. En quelques heures, l’entreprise redémarre comme si de rien n’était — sans payer un centime.',
        notifs: [
          ['good', 'Données restaurées', '100 % des fichiers récupérés.'],
          ['good', 'Rançon ignorée', 'Le pirate repart les mains vides.'],
        ],
      },
    ],
  },
];

/* Textes de l'introduction */
const INTRO_LINES = [
  'Il est 8h45.',
  'Vous arrivez dans votre entreprise.',
  'Tout semble normal…',
  '…jusqu’à maintenant.',
];

/* Niveaux de sécurité (HUD) et niveaux finaux */
const SECURITY_LEVELS = [
  { min: 85, label: 'Excellent',   color: '#3DD68C', segments: 5 },
  { min: 70, label: 'Bon',         color: '#70C3C7', segments: 4 },
  { min: 55, label: 'Correct',     color: '#F0AC2D', segments: 3 },
  { min: 35, label: 'Faible',      color: '#E58A2D', segments: 2 },
  { min: 0,  label: 'Très faible', color: '#E5484D', segments: 1 },
];

const FINAL_RANKS = [
  { min: 90, rank: 'Cyber Expert',            risk: 'Minime',   comment: 'Réflexes irréprochables : votre entreprise résisterait à la plupart des attaques courantes.' },
  { min: 70, rank: 'Cyber Vigilant',          risk: 'Modéré',   comment: 'De très bons réflexes. Quelques ajustements et votre entreprise sera exemplaire.' },
  { min: 50, rank: 'À améliorer',             risk: 'Élevé',    comment: 'Certaines décisions auraient coûté cher. Un accompagnement et quelques bonnes pratiques changeraient tout.' },
  { min: 0,  rank: 'Entreprise très exposée', risk: 'Critique', comment: 'Dans la réalité, cette journée aurait pu être fatale à votre activité. Il est urgent d’agir.' },
];

/* ============================================================
   4. ÉTAT DU JEU
   ============================================================ */
const state = {
  score: 100,
  missionIndex: 0,
  results: [],            /* { quality, delta, reactionMs } par mission */
  missionShownAt: 0,
  soundOn: CONFIG.SOUND_DEFAULT,
  timers: [],             /* timeouts en cours (annulés au changement d'écran) */
  currentChoice: null,
};

/* Raccourci querySelector */
const $ = (sel) => document.querySelector(sel);

/* setTimeout suivi (annulable au reset / changement d'écran) */
function later(fn, ms) {
  const id = setTimeout(fn, ms);
  state.timers.push(id);
  return id;
}
function clearTimers() {
  state.timers.forEach(clearTimeout);
  state.timers = [];
}

/* ============================================================
   5. UTILITAIRES — écrans, sons, notifications, effets
   ============================================================ */

/* --- Navigation entre écrans --- */
function showScreen(id) {
  clearTimers();
  document.querySelectorAll('.screen.active').forEach((s) => s.classList.remove('active'));
  $(id).classList.add('active');
  $('#hud').classList.toggle('hidden', id === '#screen-home');
}

/* --- Audio : petits sons synthétisés (aucun fichier externe) --- */
let audioCtx = null;
function ensureAudio() {
  if (!audioCtx) {
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { /* audio indisponible */ }
  }
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
}
function tone(freq, duration, type = 'sine', volume = 0.06, when = 0) {
  if (!state.soundOn || !audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const t = audioCtx.currentTime + when;
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(volume, t + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  osc.connect(gain).connect(audioCtx.destination);
  osc.start(t);
  osc.stop(t + duration + 0.05);
}
const sfx = {
  tap:   () => tone(660, 0.08, 'triangle', 0.05),
  good:  () => { tone(523, 0.12, 'sine', 0.06); tone(784, 0.22, 'sine', 0.06, 0.1); },
  bad:   () => { tone(196, 0.3, 'sawtooth', 0.05); tone(130, 0.45, 'sawtooth', 0.05, 0.12); },
  alarm: () => { for (let i = 0; i < 3; i++) { tone(880, 0.14, 'square', 0.03, i * 0.3); tone(620, 0.14, 'square', 0.03, i * 0.3 + 0.15); } },
  notif: () => tone(987, 0.1, 'triangle', 0.04),
  type:  () => tone(1200 + Math.random() * 300, 0.03, 'square', 0.015),
  drum:  () => tone(80, 0.4, 'sine', 0.09),
};

/* --- Notifications type "toast" --- */
function pushNotif(tone_, title, text, delay = 0) {
  later(() => {
    sfx.notif();
    const el = document.createElement('div');
    el.className = `notif n-${tone_}`;
    const icon = tone_ === 'bad' ? ICONS.alert : tone_ === 'good' ? ICONS.check : tone_ === 'warn' ? ICONS.alert : ICONS.shield;
    el.innerHTML = `<div class="notif-icon">${icon}</div><div class="notif-body"><strong>${title}</strong><span>${text}</span></div>`;
    $('#notif-stack').appendChild(el);
    later(() => {
      el.classList.add('out');
      later(() => el.remove(), 450);
    }, 5200);
  }, delay);
}
function clearNotifs() {
  $('#notif-stack').innerHTML = '';
}

/* --- Effets visuels globaux --- */
function flash(color) {                    /* color : 'red' | 'green' */
  const el = $('#fx-flash');
  el.className = `flash-${color}`;
  setTimeout(() => { el.className = ''; }, 700);
}
function shake() {
  document.body.classList.remove('shake');
  void document.body.offsetWidth;          /* relance l'animation CSS */
  document.body.classList.add('shake');
  setTimeout(() => document.body.classList.remove('shake'), 600);
}
function setRedAlert(on) {
  document.body.classList.toggle('red-alert', on);
  codeRain.setDanger(on);
}

/* ============================================================
   6. FOND ANIMÉ — pluie de lignes de code (canvas)
   ============================================================ */
const codeRain = (() => {
  const canvas = $('#fx-code');
  const ctx = canvas.getContext('2d');
  const GLYPHS = '01<>/{}();=+#$&%!?ABCDEF';
  let columns = [];
  let danger = false;
  let boost = 1;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const count = Math.floor(canvas.width / 26);
    columns = Array.from({ length: count }, (_, i) => ({
      x: i * 26 + 8,
      y: Math.random() * canvas.height,
      speed: 0.4 + Math.random() * 1.1,
    }));
  }

  function frame() {
    /* voile semi-transparent = traînée des caractères */
    ctx.fillStyle = 'rgba(11, 17, 20, 0.16)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '13px "JetBrains Mono", monospace';
    columns.forEach((c) => {
      const glyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      ctx.fillStyle = danger
        ? 'rgba(229, 72, 77, 0.30)'
        : Math.random() > 0.975 ? 'rgba(240, 172, 45, 0.5)' : 'rgba(112, 195, 199, 0.22)';
      ctx.fillText(glyph, c.x, c.y);
      c.y += c.speed * 4 * boost;
      if (c.y > canvas.height + 20) { c.y = -20; c.speed = 0.4 + Math.random() * 1.1; }
    });
    requestAnimationFrame(frame);
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(frame);

  return {
    setDanger: (d) => { danger = d; },
    setBoost:  (b) => { boost = b; },
  };
})();

/* ============================================================
   7. ÉCRAN D'ACCUEIL & INTRODUCTION
   ============================================================ */

/* Faux terminal de l'accueil : lignes de log en boucle */
const HOME_LOGS = [
  ['tl-dim',  '> initialisation du poste de supervision…'],
  ['tl-ok',   '> pare-feu ………………………… ACTIF'],
  ['tl-ok',   '> antivirus ……………………… À JOUR'],
  ['',        '> analyse du trafic entrant…'],
  ['tl-dim',  '> 1 402 paquets inspectés'],
  ['tl-warn', '> tentative de connexion inhabituelle détectée'],
  ['',        '> origine : 185.220.xx.xx — bloquée'],
  ['tl-ok',   '> système protégé — surveillance continue'],
  ['tl-dim',  '> …'],
];
function homeTerminalLoop() {
  const body = $('#home-terminal');
  let i = 0;
  function next() {
    if (!$('#screen-home').classList.contains('active')) return; /* stop hors accueil */
    if (i >= HOME_LOGS.length) {
      i = 0;
      setTimeout(() => { body.innerHTML = ''; next(); }, 2600);
      return;
    }
    const [cls, text] = HOME_LOGS[i++];
    const div = document.createElement('div');
    if (cls) div.className = cls;
    div.textContent = text;
    body.appendChild(div);
    while (body.children.length > 9) body.removeChild(body.firstChild);
    setTimeout(next, 700 + Math.random() * 500);
  }
  next();
}

/* Glitch périodique du titre (mode attractif) */
function titleGlitchLoop() {
  const title = $('.home-title');
  setInterval(() => {
    if (!$('#screen-home').classList.contains('active')) return;
    title.classList.add('glitching');
    setTimeout(() => title.classList.remove('glitching'), 350);
  }, 3400);
}

/* Introduction : lignes qui apparaissent, puis alerte */
function playIntro() {
  showScreen('#screen-intro');
  const wrap = $('#intro-lines');
  wrap.innerHTML = '';
  $('#intro-alert').classList.add('hidden');
  $('#btn-intro-next').classList.add('hidden');
  $('#intro-clock').textContent = '08:45';

  INTRO_LINES.forEach((text, i) => {
    const line = document.createElement('p');
    line.className = 'intro-line' + (i === INTRO_LINES.length - 1 ? ' accent' : '');
    line.textContent = text;
    wrap.appendChild(line);
    later(() => { sfx.type(); line.classList.add('shown'); }, 900 + i * 1500);
  });

  /* L'horloge avance pendant l'intro */
  later(() => { $('#intro-clock').textContent = '08:46'; }, 3000);

  /* L'alerte tombe après la dernière ligne */
  later(() => {
    sfx.alarm();
    flash('red');
    shake();
    $('#intro-clock').textContent = '08:47';
    $('#intro-alert').classList.remove('hidden');
    pushNotif('bad', 'Nouveau message', 'FACTURE URGENTE — pièce jointe : facture_2847.pdf.exe', 600);
    later(() => $('#btn-intro-next').classList.remove('hidden'), 1200);
  }, 900 + INTRO_LINES.length * 1500 + 400);
}

/* ============================================================
   8. MISSIONS & CHOIX
   ============================================================ */
function updateHud() {
  /* Score */
  $('#score-value').textContent = state.score;

  /* Niveau de sécurité */
  const lvl = SECURITY_LEVELS.find((l) => state.score >= l.min);
  $('#security-level').textContent = lvl.label;
  document.documentElement.style.setProperty('--seg-color', lvl.color);
  $('#security-bar').querySelectorAll('span').forEach((seg, i) => {
    seg.classList.toggle('on', i < lvl.segments);
  });

  /* Progression des missions */
  const prog = $('#hud-progress');
  prog.innerHTML = '';
  MISSIONS.forEach((_, i) => {
    const step = document.createElement('span');
    step.className = 'hud-step';
    const res = state.results[i];
    if (res) step.classList.add(res.quality === 'bad' ? 'failed' : 'done');
    else if (i === state.missionIndex) step.classList.add('current');
    prog.appendChild(step);
  });
}

function animateScore(delta) {
  state.score = Math.max(0, Math.min(100, state.score + delta));
  const el = $('#score-value');
  el.classList.remove('bump-up', 'bump-down');
  void el.offsetWidth;
  el.classList.add(delta >= 0 ? 'bump-up' : 'bump-down');
  updateHud();
}

/* Pièce à conviction de la mission 1 : le faux mail */
function buildMailExhibit() {
  return `
    <div class="exhibit-mail">
      <div class="exhibit-mail-head">
        <span class="exhibit-mail-subject">FACTURE URGENTE — RÈGLEMENT SOUS 24H</span>
        <span class="exhibit-mail-badge">NON LU</span>
      </div>
      <div class="exhibit-mail-row">De&nbsp;: <span class="mono">compta@fourniseur-buro.net</span></div>
      <div class="exhibit-mail-row">À&nbsp;: <span class="mono">direction@votre-entreprise.fr</span></div>
      <div class="exhibit-attachment">${ICONS.clip} facture_2847.pdf.exe — 1,2 Mo</div>
    </div>`;
}

function showMission(index) {
  state.missionIndex = index;
  state.currentChoice = null;
  const m = MISSIONS[index];

  /* Mission 5 : prise de contrôle "ransomware" avant les choix */
  if (m.preScene && !m._preSceneDone) {
    m._preSceneDone = true;
    playRansomTakeover(() => showMission(index));
    return;
  }

  /* La mission 5 se joue sous alerte rouge */
  setRedAlert(m.preScene === true);

  $('#mission-tag').textContent = `MISSION 0${index + 1} / 0${MISSIONS.length}`;
  $('#mission-icon').innerHTML = ICONS[m.icon];
  $('#mission-title').textContent = m.title;
  $('#mission-context').textContent = m.context;
  $('#mission-situation').textContent = m.situation;
  $('#mission-exhibit').innerHTML = m.exhibit === 'mail' ? buildMailExhibit() : '';

  const list = $('#choices-list');
  list.innerHTML = '';
  m.choices.forEach((choice, i) => {
    const btn = document.createElement('button');
    btn.className = 'choice-card';
    btn.innerHTML = `<span class="choice-letter">${'ABC'[i]}</span><span>${choice.label}</span>`;
    btn.addEventListener('click', () => pickChoice(btn, choice));
    list.appendChild(btn);
  });

  showScreen('#screen-mission');
  updateHud();
  state.missionShownAt = performance.now();
}

function pickChoice(btn, choice) {
  if (state.currentChoice) return;         /* anti double-clic */
  state.currentChoice = choice;
  sfx.tap();

  /* Temps de réaction */
  const reactionMs = performance.now() - state.missionShownAt;
  state.results[state.missionIndex] = { quality: choice.quality, delta: choice.delta, reactionMs };

  /* Feedback visuel sur la carte choisie */
  btn.classList.add('picked');
  btn.parentElement.querySelectorAll('.choice-card').forEach((c) => {
    if (c !== btn) c.classList.add('dimmed');
  });

  setTimeout(() => playConsequence(choice), 650);
}

/* ============================================================
   9. SCÈNES DE CONSÉQUENCE
   ============================================================ */
function playConsequence(choice) {
  state.currentChoice = null;
  clearNotifs();
  const stage = $('#consequence-stage');
  const verdict = $('#consequence-verdict');
  stage.innerHTML = '';
  verdict.classList.add('hidden');
  showScreen('#screen-consequence');

  /* La scène visuelle démarre ; le verdict apparaît ensuite */
  const done = () => revealVerdict(choice);
  STAGES[choice.stage](stage, done);
}

function revealVerdict(choice) {
  const isBad = choice.quality === 'bad';
  const isWarn = choice.quality === 'warn';

  if (isBad) { flash('red'); shake(); sfx.bad(); }
  else if (isWarn) { sfx.notif(); }
  else { flash('green'); sfx.good(); }

  animateScore(choice.delta);

  const deltaEl = $('#verdict-delta');
  deltaEl.textContent = `${choice.delta > 0 ? '+' : ''}${choice.delta} points`;
  deltaEl.className = `verdict-delta mono ${isBad ? 'd-bad' : isWarn ? 'd-warn' : 'd-good'}`;
  $('#verdict-headline').textContent = choice.headline;
  $('#verdict-detail').textContent = choice.detail;
  $('#consequence-verdict').classList.remove('hidden');

  (choice.notifs || []).forEach(([t, title, text], i) => pushNotif(t, title, text, 700 + i * 1100));
}

/* --- Bibliothèque de scènes --------------------------------- */

/* Terminal avec lignes qui défilent + barre de progression */
function terminalStage(stage, lines, barLabel, barClass, onDone, hexNoise = false) {
  const term = document.createElement('div');
  term.className = 'stage-terminal';
  stage.appendChild(term);

  let i = 0;
  (function nextLine() {
    if (i < lines.length) {
      const [cls, text] = lines[i++];
      const div = document.createElement('div');
      div.className = `line ${cls}`;
      div.textContent = text;
      term.appendChild(div);
      sfx.type();
      later(nextLine, 420);
      return;
    }
    /* Barre de progression */
    const label = document.createElement('div');
    label.className = 'line ' + (barClass === 'green' ? 'green' : 'red');
    term.appendChild(label);
    const shell = document.createElement('div');
    shell.className = 'progress-shell';
    const fill = document.createElement('div');
    fill.className = `progress-fill ${barClass}`;
    shell.appendChild(fill);
    term.appendChild(shell);

    let pct = 0;
    (function tick() {
      pct = Math.min(100, pct + 3 + Math.random() * 9);
      fill.style.width = pct + '%';
      label.textContent = `${barLabel} ${Math.floor(pct)}%`;
      if (hexNoise && Math.random() > 0.55) {
        /* easter egg : octets qui défilent pendant l'installation */
        const hex = document.createElement('div');
        hex.className = 'line';
        hex.textContent = '0x' + Array.from({ length: 4 }, () => Math.floor(Math.random() * 65536).toString(16).padStart(4, '0')).join(' 0x');
        term.insertBefore(hex, label);
        if (term.children.length > 11) term.removeChild(term.firstChild);
        sfx.type();
      }
      if (pct < 100) later(tick, 150);
      else later(onDone, 500);
    })();
  })();
}

/* Grand pictogramme animé */
function iconStage(stage, icon, mood, onDone, delay = 1100) {
  const el = document.createElement('div');
  el.className = `stage-icon ${mood}`;
  el.innerHTML = ICONS[icon];
  stage.appendChild(el);
  later(onDone, delay);
}

/* Carte du réseau (SVG) : propagation ou stabilisation */
function networkStage(stage, mode, onDone) {
  const NODES = [
    { id: 'srv', x: 280, y: 50,  label: 'SERVEUR' },
    { id: 'pc1', x: 110, y: 130, label: 'ACCUEIL' },
    { id: 'pc2', x: 220, y: 150, label: 'COMPTA' },
    { id: 'pc3', x: 340, y: 150, label: 'ATELIER' },
    { id: 'pc4', x: 450, y: 130, label: 'DIRECTION' },
    { id: 'nas', x: 170, y: 230, label: 'STOCKAGE' },
    { id: 'imp', x: 400, y: 230, label: 'CAISSE' },
  ];
  const LINKS = [['srv','pc1'],['srv','pc2'],['srv','pc3'],['srv','pc4'],['pc2','nas'],['pc3','imp']];

  const wrap = document.createElement('div');
  wrap.className = 'stage-network';
  wrap.innerHTML = `<svg viewBox="0 0 560 290">
    ${LINKS.map(([a, b]) => {
      const na = NODES.find(n => n.id === a), nb = NODES.find(n => n.id === b);
      return `<line class="net-link" data-link="${a}-${b}" x1="${na.x}" y1="${na.y}" x2="${nb.x}" y2="${nb.y}"/>`;
    }).join('')}
    ${NODES.map(n => `
      <g class="net-node" data-node="${n.id}">
        <circle cx="${n.x}" cy="${n.y}" r="22"/>
        <text x="${n.x}" y="${n.y + 38}">${n.label}</text>
      </g>`).join('')}
  </svg>`;
  stage.appendChild(wrap);

  const order = ['pc3', 'srv', 'pc2', 'pc1', 'pc4', 'nas', 'imp'];
  const cls = mode === 'infect' ? 'infected' : 'safe';
  order.forEach((id, i) => {
    later(() => {
      wrap.querySelector(`[data-node="${id}"]`).classList.add(cls);
      wrap.querySelectorAll('.net-link').forEach((l) => {
        const [a, b] = l.dataset.link.split('-');
        if (a === id || b === id) l.classList.add(cls);
      });
      if (mode === 'infect') { sfx.type(); if (i === 1) sfx.alarm(); }
    }, 380 * (i + 1));
  });
  later(onDone, 380 * (order.length + 1) + 300);
}

/* Grille de fichiers qui se verrouillent / se restaurent */
function filesStage(stage, mode, ratio, onDone, withNote = false) {
  const wrap = document.createElement('div');
  wrap.className = 'stage-ransom';
  const grid = document.createElement('div');
  grid.className = 'files-grid';
  const tiles = [];
  for (let i = 0; i < 16; i++) {
    const tile = document.createElement('div');
    tile.className = 'file-tile';
    tile.innerHTML = mode === 'lock' ? ICONS.file : ICONS.lock;
    if (mode !== 'lock') tile.classList.add('locked');   /* on part de fichiers chiffrés */
    grid.appendChild(tile);
    tiles.push(tile);
  }
  wrap.appendChild(grid);
  stage.appendChild(wrap);

  const count = Math.round(16 * ratio);
  const indices = [...Array(16).keys()].sort(() => Math.random() - 0.5).slice(0, count);
  indices.forEach((idx, i) => {
    later(() => {
      const t = tiles[idx];
      if (mode === 'lock') { t.classList.add('locked'); t.innerHTML = ICONS.lock; }
      else { t.classList.remove('locked'); t.classList.add('restored'); t.innerHTML = ICONS.file; }
      sfx.type();
    }, 170 * (i + 1));
  });

  later(() => {
    if (withNote) {
      const note = document.createElement('div');
      note.className = 'ransom-note';
      note.innerHTML = `
        <h3>VOS DONNÉES SONT CHIFFRÉES</h3>
        <p>Tous vos fichiers ont été verrouillés. Pour récupérer vos données, payez avant 24 heures.</p>
        <span class="ransom-amount">25 000 €</span>`;
      wrap.appendChild(note);
      sfx.alarm();
      shake();
    }
    later(onDone, withNote ? 1400 : 300);
  }, 170 * (count + 1) + 200);
}

/* Compteur d'argent qui s'envole */
function moneyStage(stage, caption, endText, onDone) {
  const el = document.createElement('div');
  el.className = 'stage-money';
  el.innerHTML = `<span class="money-counter">- 0 €</span><small>${caption}</small>`;
  stage.appendChild(el);
  let amount = 0;
  sfx.drum();
  (function tick() {
    amount = Math.min(25000, amount + 700 + Math.random() * 1000);
    el.querySelector('.money-counter').textContent = `- ${Math.floor(amount).toLocaleString('fr-FR')} €`;
    sfx.type();
    if (amount < 25000) later(tick, 90);
    else {
      if (endText) {
        const note = document.createElement('small');
        note.textContent = endText;
        el.appendChild(note);
      }
      later(onDone, endText ? 1500 : 700);
    }
  })();
}

/* --- Prise de contrôle "ransomware" (avant la mission 5) --- */
function playRansomTakeover(onDone) {
  clearNotifs();
  const stage = $('#consequence-stage');
  const verdict = $('#consequence-verdict');
  stage.innerHTML = '';
  verdict.classList.add('hidden');
  showScreen('#screen-consequence');

  setRedAlert(true);
  flash('red');
  shake();
  sfx.alarm();
  sfx.drum();

  pushNotif('bad', 'ALERTE CRITIQUE', 'Chiffrement massif détecté sur le réseau.', 400);
  pushNotif('bad', 'Postes verrouillés', 'Tous les écrans de l’entreprise deviennent rouges.', 1600);

  filesStage(stage, 'lock', 1, () => {
    /* Écran d'appel à l'action pour enchaîner sur les choix de la mission 5 */
    const deltaEl = $('#verdict-delta');
    deltaEl.textContent = 'INCIDENT EN COURS';
    deltaEl.className = 'verdict-delta mono d-bad';
    $('#verdict-headline').textContent = 'Le pirate exige une rançon.';
    $('#verdict-detail').textContent = 'Chaque minute compte : le chiffrement continue de se propager. Votre prochaine décision peut sauver l’entreprise.';
    verdict.classList.remove('hidden');
    const btn = $('#btn-continue');
    btn.textContent = 'RÉAGIR MAINTENANT';
    btn.onclick = () => {
      sfx.tap();
      btn.textContent = 'CONTINUER';
      btn.onclick = defaultContinue;
      onDone();
    };
  }, true);
}

/* --- Table des scènes : une fonction par identifiant --- */
const STAGES = {
  /* M1-A : installation du malware */
  'malware': (stage, done) => {
    setRedAlert(true);
    terminalStage(stage, [
      ['', '> ouverture de facture_2847.pdf.exe…'],
      ['yellow', '> exécution d’un processus inconnu'],
      ['red', '> connexion sortante vers 185.220.xx.xx'],
    ], 'Installation d’un malware…', '', () => { setRedAlert(false); done(); }, true);
  },

  /* M1-B : adresse frauduleuse repérée */
  'fraud-mail': (stage, done) => {
    terminalStage(stage, [
      ['', '> analyse de l’expéditeur…'],
      ['yellow', '> compta@fourniseur-buro.net'],
      ['red', '> domaine officiel : fournisseur-buro.fr — NE CORRESPOND PAS'],
      ['green', '> adresse frauduleuse détectée'],
    ], 'Blocage de l’expéditeur…', 'green', done);
  },

  /* Bon réflexe téléphonique (M1-C, M3-B, M5-C) */
  'phone-good': (stage, done) => iconStage(stage, 'phone', 'good', done),

  /* M2-A : propagation sur la carte du réseau */
  'network-spread': (stage, done) => {
    setRedAlert(true);
    networkStage(stage, 'infect', () => { setRedAlert(false); done(); });
  },

  /* Bouclier simple (M2-B, M4-B) */
  'shield': (stage, done) => iconStage(stage, 'shield', 'good', done),

  /* M2-C : scan de la clé par le service informatique */
  'scan-clean': (stage, done) => {
    terminalStage(stage, [
      ['', '> clé USB placée en environnement isolé (sandbox)'],
      ['', '> analyse antivirale en cours…'],
      ['red', '> menace détectée : spyware/keylogger.gen'],
      ['green', '> menace neutralisée — le réseau n’a jamais été exposé'],
    ], 'Analyse des secteurs…', 'green', done);
  },

  /* M3-A : l'argent s'envole */
  'money-lost': (stage, done) => {
    setRedAlert(true);
    moneyStage(stage, 'Virement en cours vers un compte à l’étranger…', '', () => { setRedAlert(false); done(); });
  },

  /* M3-C : attentisme risqué */
  'warn-wait': (stage, done) => iconStage(stage, 'alert', 'warn', done),

  /* M4-A : interception sur Wi-Fi public */
  'wifi-sniff': (stage, done) => {
    const wrap = document.createElement('div');
    wrap.className = 'stage-wifi';
    const icon = document.createElement('div');
    icon.className = 'stage-icon bad';
    icon.innerHTML = ICONS.wifi;
    wrap.appendChild(icon);
    const packets = document.createElement('div');
    packets.className = 'wifi-packets';
    ['identifiant', 'mot_de_passe', 'dossier_clients.xlsx', 'session_admin'].forEach((p, i) => {
      const el = document.createElement('span');
      el.className = 'wifi-packet';
      el.style.animationDelay = `${0.4 + i * 0.5}s`;
      el.textContent = p;
      packets.appendChild(el);
    });
    wrap.appendChild(packets);
    stage.appendChild(wrap);
    sfx.bad();
    later(done, 2800);
  },

  /* M4-C : tunnel VPN */
  'vpn-tunnel': (stage, done) => {
    terminalStage(stage, [
      ['', '> connexion au VPN d’entreprise…'],
      ['green', '> identité vérifiée (authentification forte)'],
      ['green', '> tunnel chiffré AES-256 établi'],
    ], 'Chiffrement du trafic…', 'green', done);
  },

  /* M5-A : payer la rançon */
  'pay-ransom': (stage, done) => {
    moneyStage(stage, 'Transfert vers un portefeuille anonyme…', 'En attente de la clé de déchiffrement… aucune réponse.', done);
  },

  /* M5-B : déconnexion du réseau */
  'disconnect': (stage, done) => {
    terminalStage(stage, [
      ['yellow', '> ARRÊT D’URGENCE DU RÉSEAU'],
      ['', '> déconnexion des serveurs… OK'],
      ['', '> isolation des postes de travail… OK'],
      ['green', '> propagation du chiffrement : STOPPÉE'],
    ], 'Isolation des machines…', 'green', () => { setRedAlert(false); done(); });
  },

  /* M6-A : restauration partielle */
  'restore-partial': (stage, done) => {
    setRedAlert(false);
    filesStage(stage, 'restore', 0.72, done);
  },

  /* M6-B : aucune sauvegarde */
  'no-backup': (stage, done) => {
    setRedAlert(true);
    iconStage(stage, 'skull', 'bad', () => { setRedAlert(false); done(); }, 1500);
  },

  /* M6-C : restauration complète */
  'restore-full': (stage, done) => {
    setRedAlert(false);
    filesStage(stage, 'restore', 1, done);
  },
};

/* Bouton "Continuer" : mission suivante ou résultats */
function defaultContinue() {
  sfx.tap();
  clearNotifs();
  const next = state.missionIndex + 1;
  if (next < MISSIONS.length) showMission(next);
  else showResults();
}

/* ============================================================
   10. RÉSULTATS, DIAGNOSTIC & PDF
   ============================================================ */
function showResults() {
  setRedAlert(false);
  clearNotifs();
  showScreen('#screen-results');
  updateHud();

  const score = state.score;
  const rank = FINAL_RANKS.find((r) => score >= r.min);
  const lvl = SECURITY_LEVELS.find((l) => score >= l.min);

  /* Statistiques */
  const played = state.results.filter(Boolean);
  const avoided = played.filter((r) => r.quality === 'excellent' || r.quality === 'good').length;
  const errors = played.filter((r) => r.quality === 'bad').length;
  const avgReaction = played.length
    ? played.reduce((s, r) => s + r.reactionMs, 0) / played.length / 1000
    : 0;

  /* Jauge animée + compteur */
  document.documentElement.style.setProperty('--gauge-color', lvl.color);
  const CIRCUMFERENCE = 527.8;
  later(() => {
    $('#gauge-fill').style.strokeDashoffset = CIRCUMFERENCE * (1 - score / 100);
  }, 300);

  let displayed = 0;
  (function count() {
    displayed = Math.min(score, displayed + Math.max(1, Math.round(score / 40)));
    $('#final-score').textContent = displayed;
    if (displayed < score) later(count, 30);
  })();

  $('#results-rank').textContent = rank.rank;
  $('#results-comment').textContent = rank.comment;
  $('#stat-avoided').textContent = avoided;
  $('#stat-errors').textContent = errors;
  $('#stat-risk').textContent = rank.risk;
  $('#stat-reaction').textContent = avgReaction.toFixed(1) + ' s';

  /* Diagnostic personnalisé */
  const strengths = [];
  const improvements = [];
  played.forEach((r, i) => {
    const d = MISSIONS[i].diagnostic;
    if (r.quality === 'excellent' || r.quality === 'good') strengths.push(d.strength);
    else improvements.push(d.improvement);
  });
  if (avgReaction > 0 && avgReaction < 8 && errors <= 1) strengths.push('Vous réagissez rapidement face aux situations à risque.');
  if (strengths.length === 0) strengths.push('Vous avez joué le jeu jusqu’au bout : la sensibilisation est le premier pas.');
  if (improvements.length === 0) improvements.push('Continuez ainsi — et pensez à sensibiliser régulièrement vos collaborateurs.');

  const fill = (sel, items, delayBase) => {
    const ul = $(sel);
    ul.innerHTML = '';
    items.forEach((text, i) => {
      const li = document.createElement('li');
      li.textContent = text;
      li.style.animationDelay = `${delayBase + i * 0.12}s`;
      ul.appendChild(li);
    });
  };
  fill('#diag-strengths', strengths, 0.6);
  fill('#diag-improvements', improvements, 1);

  /* Remplissage du rapport imprimable (PDF) */
  $('#pr-date').textContent = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  $('#pr-score').textContent = score;
  $('#pr-rank').textContent = rank.rank;
  $('#pr-stats').innerHTML = `
    <span>Cyberattaques évitées : <strong>${avoided}/${MISSIONS.length}</strong></span>
    <span>Erreurs : <strong>${errors}</strong></span>
    <span>Niveau de risque : <strong>${rank.risk}</strong></span>
    <span>Réaction moyenne : <strong>${avgReaction.toFixed(1)} s</strong></span>`;
  $('#pr-strengths').innerHTML = strengths.map((s) => `<li>${s}</li>`).join('');
  $('#pr-improvements').innerHTML = improvements.map((s) => `<li>${s}</li>`).join('');

  sfx.good();
}

/* ============================================================
   11. CONCOURS & REJOUER
   ============================================================ */
function resetGame() {
  clearTimers();
  clearNotifs();
  setRedAlert(false);
  state.score = 100;
  state.missionIndex = 0;
  state.results = [];
  state.currentChoice = null;
  MISSIONS.forEach((m) => { delete m._preSceneDone; });
  $('#gauge-fill').style.strokeDashoffset = 527.8;
  $('#btn-continue').textContent = 'CONTINUER';
  $('#btn-continue').onclick = defaultContinue;
  updateHud();
  showScreen('#screen-home');
  homeTerminalLoop();
}

/* ============================================================
   12. MODE BORNE : INACTIVITÉ & EASTER EGGS
   ============================================================ */
let idleTimer = null;
function armIdleReset() {
  if (!CONFIG.IDLE_RESET_SECONDS) return;
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    if (!$('#screen-home').classList.contains('active')) resetGame();
  }, CONFIG.IDLE_RESET_SECONDS * 1000);
}

/* Easter egg : 5 taps sur le logo VTech = surcharge de la pluie de code */
let logoTaps = 0;
let logoTapTimer = null;
function onLogoTap() {
  logoTaps++;
  clearTimeout(logoTapTimer);
  logoTapTimer = setTimeout(() => { logoTaps = 0; }, 1600);
  if (logoTaps >= 5) {
    logoTaps = 0;
    codeRain.setBoost(4);
    pushNotif('info', 'Mode surcharge', 'Flux de données accéléré. Joli réflexe de curiosité !');
    setTimeout(() => codeRain.setBoost(1), 4000);
  }
}

/* ============================================================
   INITIALISATION
   ============================================================ */
function init() {
  /* Sons : l'AudioContext ne peut démarrer qu'après un geste utilisateur */
  document.addEventListener('pointerdown', () => { ensureAudio(); armIdleReset(); }, { passive: true });

  /* Navigation principale */
  $('#btn-start').addEventListener('click', () => { sfx.tap(); playIntro(); });
  $('#btn-intro-next').addEventListener('click', () => { sfx.tap(); showMission(0); });
  $('#btn-intro-skip').addEventListener('click', () => { sfx.tap(); showMission(0); });
  $('#btn-continue').onclick = defaultContinue;

  /* Résultats */
  $('#btn-download-report').addEventListener('click', () => { sfx.tap(); window.print(); });
  $('#btn-download-guide').addEventListener('click', () => {
    sfx.tap();
    if (CONFIG.GUIDE_URL && CONFIG.GUIDE_URL !== '#') window.open(CONFIG.GUIDE_URL, '_blank');
    else pushNotif('info', 'Guide cyber', 'Le lien du guide sera bientôt disponible (variable GUIDE_URL).');
  });
  $('#btn-to-contest').addEventListener('click', () => { sfx.tap(); showScreen('#screen-contest'); });

  /* Concours */
  $('#btn-participate').addEventListener('click', () => { sfx.tap(); window.open(CONFIG.FORM_URL, '_blank'); });
  $('#btn-replay').addEventListener('click', () => { sfx.tap(); resetGame(); });

  /* Son on/off */
  $('#btn-sound').addEventListener('click', (e) => {
    state.soundOn = !state.soundOn;
    e.currentTarget.classList.toggle('muted', !state.soundOn);
  });

  /* Easter egg logo */
  $('#hud-brand').addEventListener('click', onLogoTap);

  updateHud();
  homeTerminalLoop();
  titleGlitchLoop();
  armIdleReset();
}

document.addEventListener('DOMContentLoaded', init);
