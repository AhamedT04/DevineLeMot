# Guess The Word WASM

Petit jeu de mots en JavaScript, jouable directement dans le navigateur.

Le joueur choisit d'abord son pseudo et son niveau de difficulte, puis tente de deviner un mot lettre par lettre. A la fin de la manche, un ecran de resultat indique si la partie est gagnee ou perdue, avec le score obtenu.

## Recuperer le projet

Tu peux recuperer les fichiers de deux manieres.

### Option 1: telecharger le projet en ZIP

1. Ouvrir la page du depot GitHub
2. Cliquer sur `Code`
3. Cliquer sur `Download ZIP`
4. Extraire le fichier ZIP dans un dossier

### Option 2: cloner le depot

Si Git est installe:

```bash
git clone https://github.com/TON-UTILISATEUR/GuessTheWordWASM.git
```

Puis ouvrir le dossier du projet.

## Fonctionnalites

- Ecran de configuration avant la partie
- Trois niveaux de difficulte: facile, moyen, difficile
- Clavier visuel et saisie clavier
- Systeme de score local
- Historique des dernieres parties
- Meilleur score sauvegarde en local
- Ecran de resultat en fin de manche

## Fichiers du projet

- `index.html`: structure de l'interface
- `style.css`: style du jeu
- `script.js`: logique du jeu
- `words/`: listes de mots par niveau

## Lancer le projet en local

Il y a deux facons simples de lancer le jeu.

### Option 1: double-clic sur le fichier HTML

1. Mettre `index.html`, `style.css`, `script.js` et le dossier `words/` dans le meme dossier principal
2. Ouvrir ce dossier
3. Double-cliquer sur `index.html`

Si le navigateur accepte le chargement local des fichiers, le jeu fonctionne directement.

### Option 2: avec un petit serveur local

Si le chargement local ne fonctionne pas correctement, utiliser un serveur local.

Avec Python installe:

```bash
python -m http.server 8000
```

Puis ouvrir dans le navigateur:

```text
http://localhost:8000
```

## Comment jouer

1. Entrer un pseudo
2. Choisir un niveau
3. Lancer la partie
4. Proposer des lettres une par une
5. Utiliser l'indice seulement si necessaire
6. A la fin, consulter l'ecran de victoire ou de defaite
7. Cliquer sur `Nouvelle partie` pour revenir a l'ecran de configuration

## NB 
!!! 
J'ai fait ce mini jeu principalement avec l'IA juste pour le fun et laisser mon frere s'entrainer sur les jeu de mots 
Libre a vous de le modifier comme il vous convient ou je changer la difficulter des mots dans le fichier de texte
