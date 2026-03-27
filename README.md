# Guess The Word WASM

Petit jeu de mots en JavaScript, jouable directement dans le navigateur.

Le joueur choisit d'abord son pseudo et son niveau de difficulte, puis tente de deviner un mot lettre par lettre. A la fin de la manche, un ecran de resultat indique si la partie est gagnee ou perdue, avec le score obtenu.

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

Comme le jeu charge les mots depuis le dossier `words/`, il vaut mieux utiliser un petit serveur local.

### Option 1: avec VS Code

1. Installer l'extension `Live Server`
2. Ouvrir le dossier du projet
3. Faire clic droit sur `index.html`
4. Cliquer sur `Open with Live Server`

### Option 2: avec Python

Si Python est installe:

```bash
python -m http.server 8000
```

Puis ouvrir:

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

## Publication sur GitHub

### Initialiser git dans le dossier

```bash
git init
git add .
git commit -m "Initial commit"
```

### Creer un depot GitHub

Creer un nouveau repository sur GitHub, par exemple:

```text
GuessTheWordWASM
```

Ne pas cocher l'option pour ajouter un README distant, puisque ce projet en contient deja un.

### Connecter le depot local au depot GitHub

Remplacer `TON-UTILISATEUR` par ton nom GitHub:

```bash
git branch -M main
git remote add origin https://github.com/TON-UTILISATEUR/GuessTheWordWASM.git
git push -u origin main
```

## Deploiement GitHub Pages

Tu peux aussi heberger le jeu avec GitHub Pages.

1. Push le projet sur GitHub
2. Aller dans `Settings`
3. Aller dans `Pages`
4. Choisir la branche `main`
5. Choisir le dossier `/root`
6. Enregistrer

Le jeu sera ensuite disponible sur une URL du type:

```text
https://TON-UTILISATEUR.github.io/GuessTheWordWASM/
```

## Ameliorations possibles

- Ajouter un vrai mode multimanche
- Ajouter des categories de mots
- Ajouter des animations de victoire et defaite
- Ajouter des effets sonores
- Ajouter un classement en ligne
