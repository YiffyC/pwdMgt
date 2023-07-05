# Gestionnaire de mots de passe (version Electron)

## Description du projet

Le projet consiste en un gestionnaire de mots de passe utilisant la technologie Electron, qui permet de créer des applications de bureau multiplateformes avec des technologies web (HTML, CSS et JavaScript). Le gestionnaire de mots de passe offre les mêmes fonctionnalités que la version en ligne de commande, mais avec une interface graphique utilisateur (GUI) plus conviviale.

## Technologies utilisées

Le projet utilise les technologies suivantes :

- **Electron**: un framework permettant de développer des applications de bureau multiplateformes en utilisant des technologies web.
- **Node.js**: une plateforme de développement côté serveur qui permet d'exécuter du code JavaScript en dehors d'un navigateur.
- **HTML**: le langage de balisage utilisé pour structurer le contenu de l'application.
- **CSS**: le langage de style utilisé pour personnaliser l'apparence de l'application.
- **JavaScript**: le langage de programmation utilisé pour ajouter des fonctionnalités interactives à l'application.

## Parties intéressantes du code

### Chiffrement et déchiffrement des mots de passe

La fonction `encrypt` utilise l'algorithme AES-256-CBC pour chiffrer le texte donné en utilisant la clé de chiffrement et un vecteur d'initialisation aléatoire.

La fonction `decrypt` déchiffre le texte chiffré en utilisant la clé de chiffrement et le vecteur d'initialisation correspondants.

### Enregistrement d'un mot de passe

La fonction `savePassword` permet d'enregistrer un mot de passe dans un fichier. Elle lit d'abord les mots de passe existants à partir du fichier, puis ajoute le nouveau mot de passe à la liste et chiffre le tout avant de sauvegarder les données.

### Récupération d'un mot de passe

La fonction `getPassword` récupère un mot de passe en fonction de l'URL et du nom d'utilisateur fournis. Elle lit les mots de passe à partir du fichier, déchiffre les données, puis recherche le mot de passe correspondant dans la liste.

### Gestion des actions de l'utilisateur

La fonction principale `main` utilise l'interface de ligne de commande pour proposer différentes options à l'utilisateur. Selon le choix de l'utilisateur, il peut enregistrer un mot de passe, récupérer un mot de passe ou quitter le programme.

La fonction `chooseURL` permet à l'utilisateur de choisir une URL parmi celles disponibles et affiche les noms d'utilisateur associés. Une fois l'URL et le nom d'utilisateur sélectionnés, la fonction récupère le mot de passe correspondant et l'affiche.

### Lecture de la clé de chiffrement

La clé de chiffrement est lue à partir d'un fichier `encryption-key.txt` en utilisant la fonction `readFileSync` de `fs`.
