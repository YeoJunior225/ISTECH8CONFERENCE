const express = require('express');
const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const nodemailer = require('nodemailer'); // Pour envoyer des emails

const app = express();

// Configuration de nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'textjuniortexte@gmail.com',
    pass: 'htto htws okie ktlj',
  },
});

// Activer CORS
app.use(cors({ origin: '*' }));

// Middleware pour parser le corps des requêtes JSON
app.use(express.json());

// Vérification du PDF
async function verifyPDF(filePath) {
  try {
    const pdfBytes = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    console.log('Le PDF est valide.');
  } catch (error) {
    console.error('Le PDF est corrompu :', error.message);
  }
}

// Endpoint pour générer le PDF
const fontkit = require('@pdf-lib/fontkit'); // Importer fontkit

app.post('/generate-pdf', async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;

    if (!firstName || !lastName || !email) {
      throw new Error('Les champs firstName, lastName et email sont obligatoires.');
    }

    // Charger le modèle PDF
    const pdfTemplatePath = path.join(__dirname, 'certificat.pdf');
    if (!fs.existsSync(pdfTemplatePath)) {
      throw new Error('Le modèle PDF est introuvable.');
    }
    const pdfTemplate = fs.readFileSync(pdfTemplatePath);
    const pdfDoc = await PDFDocument.load(pdfTemplate);

    // Enregistrer fontkit
    pdfDoc.registerFontkit(fontkit);

    // Charger la police personnalisée
    const fontPath = path.join(__dirname, 'poppins-bold.ttf'); // Assurez-vous que ce fichier existe
    if (!fs.existsSync(fontPath)) {
      throw new Error('Le fichier de police est introuvable.');
    }
    const fontBytes = fs.readFileSync(fontPath);
    const customFont = await pdfDoc.embedFont(fontBytes);

    // Modifier le PDF
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { height, width } = firstPage.getSize();

    // Ajouter du texte centré horizontalement
    const text = `${firstName.toUpperCase()} ${lastName.toUpperCase()}`;
    const textWidth = customFont.widthOfTextAtSize(text, 50); // Largeur du texte
    const x = (width - textWidth) / 2; // Centrer horizontalement

    firstPage.drawText(text, {
      x: x, // Position centrée
      y: height - 700, // Position verticale
      size: 50, // Taille de la police
      font: customFont, // Utiliser la police personnalisée
      color: rgb(0, 0, 0), // Couleur du texte
    });

    // Enregistrez le fichier PDF généré
    const pdfBytes = await pdfDoc.save();

    // Chemin de stockage sur le serveur
    const pdfFileName = `${firstName}_${lastName}_certificat.pdf`;
    const pdfFilePath = path.join(__dirname, 'generated_certificates', pdfFileName);

    // Créer le dossier "generated_certificates" s'il n'existe pas
    if (!fs.existsSync(path.dirname(pdfFilePath))) {
      fs.mkdirSync(path.dirname(pdfFilePath));
    }
    fs.writeFileSync(pdfFilePath, pdfBytes);

    // Envoi de l'email avec le fichier PDF en pièce jointe
    const mailOptions = {
      from: 'votre-email@gmail.com',
      to: email,
      subject: 'Votre certificat personnalisé',
      text: 'Veuillez trouver ci-joint votre certificat.',
      attachments: [
        {
          filename: pdfFileName,
          path: pdfFilePath,
        },
      ],
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Erreur lors de l\'envoi de l\'email :', error.message);
        return res.status(500).send({ error: 'Échec de l\'envoi de l\'e-mail.' });
      }
      res.status(200).send({ message: 'PDF généré et envoyé avec succès par e-mail.' });
    });

  } catch (error) {
    console.error('Erreur lors de la génération du PDF :', error.message);
    res.status(500).send({ error: error.message });
  }
});

  
// Démarrer le serveur
app.listen(3000, () => {
  console.log('Serveur démarré sur http://localhost:3000');
});
