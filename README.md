# Escape Game Cyber — Groupe VTech

Animation interactive pour écran digital tactile (salons & foires).
Site 100 % autonome : HTML + CSS + JavaScript vanilla, aucune installation requise.

## Lancer le jeu

Double-cliquer sur `index.html` (Chrome ou Edge), puis passer en plein écran (`F11`).

Pour un vrai mode borne (plein écran verrouillé, sans barre d'adresse) :

```
chrome --kiosk "chemin/vers/index.html"
```

## Liens à personnaliser

Ouvrir `script.js` — tout est regroupé en haut du fichier dans le bloc `CONFIG` :

| Variable | Rôle |
|---|---|
| `GUIDE_URL` | Lien du « Guide des bons réflexes cyber » (remplacer le `#`) |
| `FORM_URL` | Lien du formulaire Google (tirage au sort) |
| `IDLE_RESET_SECONDS` | Retour auto à l'accueil après inactivité (mode borne) — `0` pour désactiver |
| `SOUND_DEFAULT` | Son activé par défaut (`true` / `false`) |

## Contenu modifiable

- **Missions, choix, textes des conséquences** : tableau `MISSIONS` dans `script.js` (section 3).
- **Textes de l'introduction** : constante `INTRO_LINES`.
- **Niveaux et commentaires du score final** : constantes `SECURITY_LEVELS` et `FINAL_RANKS`.
- **Couleurs de la charte** : variables CSS en tête de `styles.css` (`--yellow`, `--gray`, `--blue`).

## Fonctionnalités

- 6 missions scénarisées avec conséquences animées (malware, propagation réseau, fraude au RIB, Wi-Fi public, ransomware, sauvegardes).
- Score sur 100, niveau de sécurité en temps réel, temps de réaction mesuré.
- Diagnostic personnalisé téléchargeable en PDF (bouton « Télécharger mon diagnostic » → boîte de dialogue d'impression → « Enregistrer au format PDF »).
- Page concours reliée au formulaire Google.
- Mode borne : retour automatique à l'accueil après inactivité, bouton son, anti-zoom tactile.
- Sons générés en interne (aucun fichier audio) — seule dépendance externe : les polices Google Fonts (le jeu reste fonctionnel sans connexion, avec les polices système).
