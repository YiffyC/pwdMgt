// Importation des modules nécessaires
const readline = require('readline');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Création de l'interface pour la saisie utilisateur
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Constantes pour l'algorithme de chiffrement, le chemin du fichier de clé et la longueur du vecteur d'initialisation
const ENCRYPTION_ALGORITHM = 'aes-256-cbc';
const keyFilePath = path.join(__dirname, 'encryption-key.txt');
const IV_LENGTH = 16;

// Fonction utilitaire pour poser une question à l'utilisateur et récupérer sa réponse sous forme de Promise
function askQuestion(question) {
  return new Promise((resolve, reject) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Fonction pour chiffrer le texte donné en utilisant la clé de chiffrement
function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + encrypted;
}

// Fonction pour déchiffrer le texte chiffré donné en utilisant la clé de chiffrement
function decrypt(encryptedText) {
  const iv = Buffer.from(encryptedText.slice(0, IV_LENGTH * 2), 'hex');
  const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, ENCRYPTION_KEY, iv);
  let decrypted = decipher.update(encryptedText.slice(IV_LENGTH * 2), 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Fonction pour enregistrer un mot de passe dans le fichier
function savePassword(url, username, password) {
  let passwords = [];

  if (fs.existsSync('passwords.txt')) {
    const encryptedData = fs.readFileSync('passwords.txt', 'utf8');
    const decryptedData = decrypt(encryptedData);
    passwords = JSON.parse(decryptedData);
  }

  passwords.push({ url, username, password });

  const encryptedPasswords = encrypt(JSON.stringify(passwords));

  fs.writeFileSync('passwords.txt', encryptedPasswords);

  console.log('Mot de passe enregistré avec succès !');
}

// Fonction pour récupérer un mot de passe en fonction de l'URL et du nom d'utilisateur
function getPassword(url, username) {
  if (fs.existsSync('passwords.txt')) {
    const encryptedData = fs.readFileSync('passwords.txt', 'utf8');
    const decryptedData = decrypt(encryptedData);
    const passwords = JSON.parse(decryptedData);

    for (let password of passwords) {
      if (password.url === url && password.username === username) {
        return password.password;
      }
    }
  }

  return null;
}

// Fonction principale asynchrone pour gérer les actions de l'utilisateur
async function main() {
  console.log('Bienvenue dans le gestionnaire de mots de passe !');

  while (true) {
    console.log('Que souhaitez-vous faire ?');
    console.log('1. Enregistrer un mot de passe');
    console.log('2. Récupérer un mot de passe');
    console.log('3. Quitter');

    const choice = await askQuestion('Votre choix (1-3): ');

    if (choice === '1') {
      const url = await askQuestion('URL: ');
      const username = await askQuestion('Nom d\'utilisateur: ');
      const password = await askQuestion('Mot de passe: ');
      savePassword(url, username, password);
    } else if (choice === '2') {
      await chooseURL();
    } else if (choice === '3') {
      break;
    } else {
      console.log('Choix invalide. Veuillez réessayer.');
    }

    console.log('\n');
  }

  rl.close();
}

// Fonction asynchrone pour choisir une URL parmi celles disponibles
async function chooseURL() {
  if (fs.existsSync('passwords.txt')) {
    const encryptedData = fs.readFileSync('passwords.txt', 'utf8');
    const decryptedData = decrypt(encryptedData);
    const passwords = JSON.parse(decryptedData);

    const uniqueURLs = [...new Set(passwords.map((password) => password.url))];
    console.log('Veuillez choisir une URL parmi la liste :');
    uniqueURLs.forEach((url, index) => {
      console.log(`${index + 1}. ${url}`);
    });

    const urlIndex = parseInt(await askQuestion('Votre choix: ')) - 1;

    if (urlIndex >= 0 && urlIndex < uniqueURLs.length) {
      const selectedURL = uniqueURLs[urlIndex];
      const usernames = passwords
        .filter((password) => password.url === selectedURL)
        .map((password) => password.username);

      console.log('Noms d\'utilisateurs associés à cette URL :');
      usernames.forEach((username, index) => {
        console.log(`${index + 1}. ${username}`);
      });

      const usernameIndex = parseInt(await askQuestion('Votre choix de nom d\'utilisateur: ')) - 1;

      if (usernameIndex >= 0 && usernameIndex < usernames.length) {
        const selectedUsername = usernames[usernameIndex];
        const password = getPassword(selectedURL, selectedUsername);

        if (password) {
          console.log(`Le mot de passe pour l'utilisateur ${selectedUsername} sur ${selectedURL} est: ${password}`);
          return; // Sortir de la fonction après avoir affiché le mot de passe
        } else {
          console.log('Aucun mot de passe trouvé pour cet utilisateur et cette URL.');
        }
      }
    }
  }

  console.log('Aucune URL trouvée.');
}

// Lecture de la clé de chiffrement à partir du fichier
const ENCRYPTION_KEY = fs.readFileSync(keyFilePath, 'utf8').trim();

// Exécution de la fonction principale
main().catch((error) => console.error(error));
