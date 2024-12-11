const express = require('express');
const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const nodemailer = require('nodemailer');
const fontkit = require('@pdf-lib/fontkit');

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

// Tableau des utilisateurs autorisés
const authorizedUsers = [
  { firstName: 'junior' },
  { firstName: 'KOUADIO' },
  { firstName: 'SILUE' },
  { firstName: 'AKA' },
  { firstName: 'KOUAHO' },
  { firstName: 'SOGODOGO' },
  { firstName: 'COULIBALY' },
  { firstName: 'SORO' },
  { firstName: 'BERTHE' },
  { firstName: 'OUATTARA' },
  { firstName: 'TRAORE' },
  { firstName: 'N’GUESSAN' },
  { firstName: 'SIDIBE' },
  { firstName: 'KONE' },
  { firstName: 'KONE' },
  { firstName: 'TRIA' },
  { firstName: 'SAGOU' },
  { firstName: 'GNANKAN' },
  { firstName: 'BAMBA' },
  { firstName: 'KANGA' },
  { firstName: 'KOUACOU' },
  { firstName: 'ASSOUKOU' },
  { firstName: 'DIARRA' },
  { firstName: 'OUATTARA' },
  { firstName: 'DIARRASSOUBA' },
  { firstName: 'THIEMELE' },
  { firstName: 'KOFFI' },
  { firstName: 'N’ZI' },
  { firstName: 'ASSALE' },
  { firstName: 'KOUAME' },
  { firstName: 'NANDO' },
  { firstName: 'SIDIBE' },
  { firstName: 'AMANGOUA' },
  { firstName: 'TANO' },
  { firstName: 'KONE' },
  { firstName: 'OUATTARA' },
  { firstName: 'TOURE' },
  { firstName: 'DIABAGATE' },
  { firstName: 'VAHBI' },
  { firstName: 'OUEDRAOGO' },
  { firstName: 'SANGARE' },
  { firstName: 'SIDIBE' },
  { firstName: 'OUATTARA' },
  { firstName: 'SYLLA' },
  { firstName: 'DIALLO' },
  { firstName: 'BONKOUNGOU' },
  { firstName: 'ADIOTSO' },
  { firstName: 'KOUADIO' },
  { firstName: 'M’BROH' },
  { firstName: 'BAMBA' },
  { firstName: 'SABI' },
  { firstName: 'BAHOU' },
  { firstName: 'MAMBO' },
  { firstName: 'OUAYOGODE' },
  { firstName: 'N’GUESSAN' },
  { firstName: 'DOH' },
  { firstName: 'YOBOU' },
  { firstName: 'BILSON' },
  { firstName: 'GOH' },
  { firstName: 'KONATE' },
  { firstName: 'KOROGO' },
  { firstName: 'CISSE' },
  { firstName: 'ZOUKROU' },
  { firstName: 'TIONON' },
  { firstName: 'ADOU' },
  { firstName: 'ABLI' },
  { firstName: 'TRAORE' },
  { firstName: 'OSSEY' },
  { firstName: 'KOFFI' },
  { firstName: 'OUATTARA' },
  { firstName: 'KOUAKOU' },
  { firstName: 'ASSAMBAN' },
  { firstName: 'N’DIAYE' },
  { firstName: 'KONATE' },
  { firstName: 'SEKONGO' },
  { firstName: 'KOAMBA' },
  { firstName: 'KOFFI' },
  { firstName: 'DIALLO' },
  { firstName: 'DIALLO' },
  { firstName: 'GNAMIEN' },
  { firstName: 'TRA LOU' },
  { firstName: 'DIABY' },
  { firstName: 'TITI' },
  { firstName: 'ATILADE' },
  { firstName: 'DJIBO' },
  { firstName: 'TRAORE' },
  { firstName: 'KACOU' },
  { firstName: 'DIEMAN' },
  { firstName: 'YAVO' },
  { firstName: 'AGOUA' },
  { firstName: 'KOFFI' },
  { firstName: 'KINIMO' },
  { firstName: 'DIAMOUTENE' },
  { firstName: 'KOUAKOU' },
  { firstName: 'YODE' },
  { firstName: 'CISSE' },
  { firstName: 'DEKPETI' },
];



// Endpoint pour générer le PDF
app.post('/generate-pdf', async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;

    if (!firstName || !lastName || !email) {
      throw new Error('Les champs firstName, lastName et email sont obligatoires.');
    }

    // Vérification si l'utilisateur est autorisé
    const isAuthorized = authorizedUsers.some(
      (user) =>
        console.log('tab',user.firstName)
        console.log('champ',firstName)
        user.firstName.toLowerCase() === firstName.toLowerCase()  
    );

    if (!isAuthorized) {
      return res.status(403).send({ error: 'Accès refusé. Vous n’êtes pas autorisé à générer un PDF.' });
    }

    // Charger le modèle PDF
    const pdfTemplatePath = path.join(__dirname, 'certificat1.pdf');
    if (!fs.existsSync(pdfTemplatePath)) {
      throw new Error('Le modèle PDF est introuvable.');
    }
    const pdfTemplate = fs.readFileSync(pdfTemplatePath);
    const pdfDoc = await PDFDocument.load(pdfTemplate);

    // Enregistrer fontkit
    pdfDoc.registerFontkit(fontkit);

    // Charger la police personnalisée
    const fontPath = path.join(__dirname, 'poppins-bold.ttf');
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
    const textWidth = customFont.widthOfTextAtSize(text, 50);
    const x = (width - textWidth) / 2;

    // Ajustement de la position du texte
    firstPage.drawText(text, {
      x: x,
      y: height - 600, // Position ajustée pour que le texte soit plus haut
      size: 50,
      font: customFont,
      color: rgb(0, 0, 0),
    });

    // Enregistrer le fichier PDF généré
    const pdfBytes = await pdfDoc.save();
    const pdfFileName = `${firstName}_${lastName}_certificat.pdf`;
    const pdfFilePath = path.join(__dirname, 'generated_certificates', pdfFileName);

    if (!fs.existsSync(path.dirname(pdfFilePath))) {
      fs.mkdirSync(path.dirname(pdfFilePath));
    }
    fs.writeFileSync(pdfFilePath, pdfBytes);

    // Envoi de l'e-mail avec le PDF en pièce jointe
    const mailOptions = {
      from: 'textjuniortexte@gmail.com',
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
        console.error('Erreur lors de l\'envoi de l\'e-mail :', error.message);
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
