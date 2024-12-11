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
// Tableau des utilisateurs autorisés sans e-mail
const authorizedUsers = [
  {lastName: 'junior', firstName: 'yeo'},
  { lastName: 'KOUADIO', firstName: 'Y.PHILIPPE' },
  { lastName: 'SILUE', firstName: 'K. EMMANUEL' },
  { lastName: 'AKA', firstName: 'N. JEAN MARIE' },
  { lastName: 'KOUAHO', firstName: 'EDI LEVI MICHEE' },
  { lastName: 'SOGODOGO', firstName: 'NOURAH DJENEBA' },
  { lastName: 'COULIBALY', firstName: 'MINAN' },
  { lastName: 'SORO', firstName: 'DOGNIMIN DESIRE' },
  { lastName: 'BERTHE', firstName: 'NAMONGO' },
  { lastName: 'OUATTARA', firstName: 'NANCY' },
  { lastName: 'TRAORE', firstName: 'WATOUFOUE' },
  { lastName: 'N’GUESSAN', firstName: 'B.J.JEPHTHE' },
  { lastName: 'SIDIBE', firstName: 'A.SORAYA' },
  { lastName: 'KONE', firstName: 'ZENAB' },
  { lastName: 'KONE', firstName: 'AHMED' },
  { lastName: 'TRIA', firstName: 'B.T.FRANCOIS HENOC' },
  { lastName: 'SAGOU', firstName: 'DANIEL' },
  { lastName: 'GNANKAN', firstName: 'A.DORA ESTELLE' },
  { lastName: 'BAMBA', firstName: 'ROKIA' },
  { lastName: 'KANGA', firstName: 'ASSOA ALPHONSE' },
  { lastName: 'KOUACOU', firstName: 'KOFFI NANTILLEY C.D' },
  { lastName: 'ASSOUKOU', firstName: 'CLAUDE NATHAN' },
  { lastName: 'DIARRA', firstName: 'KALY ADJARATOU' },
  { lastName: 'OUATTARA', firstName: 'MOHAMED LAMINE' },
  { lastName: 'DIARRASSOUBA', firstName: 'SIRIKI' },
  { lastName: 'THIEMELE', firstName: 'ADOU HENRI JOEL' },
  { lastName: 'KOFFI', firstName: 'AHA KOUAO M.O' },
  { lastName: 'N’ZI', firstName: 'AKA FRANCIS' },
  { lastName: 'ASSALE', firstName: 'LOIC FARELL' },
  { lastName: 'KOUAME', firstName: 'JARDE PRUNELLE' },
  { lastName: 'NANDO', firstName: 'ALEXANDRA G.' },
  { lastName: 'SIDIBE', firstName: 'SITA' },
  { lastName: 'AMANGOUA', firstName: 'MALIKA' },
  { lastName: 'TANO', firstName: 'JOSEPH' },
  { lastName: 'KONE', firstName: 'MAKEME S.' },
  { lastName: 'OUATTARA', firstName: 'SAMIRA' },
  { lastName: 'TOURE', firstName: 'EMMANUEL' },
  { lastName: 'DIABAGATE', firstName: 'AICHATA' },
  { lastName: 'VAHBI', firstName: 'MIKE LOIC' },
  { lastName: 'OUEDRAOGO', firstName: 'SAIDOU' },
  { lastName: 'SANGARE', firstName: 'ALI' },
  { lastName: 'SIDIBE', firstName: 'MORY KADER' },
  { lastName: 'OUATTARA', firstName: 'YELLI MARIAME' },
  { lastName: 'SYLLA', firstName: 'DIASSATA' },
  { lastName: 'DIALLO', firstName: 'E.HADJ AMADOU' },
  { lastName: 'BONKOUNGOU', firstName: 'WENDYAM' },
  { lastName: 'ADIOTSO', firstName: 'KOSSI NARCISSE' },
  { lastName: 'KOUADIO', firstName: 'YAO EMMANUEL' },
  { lastName: 'M’BROH', firstName: 'OCTAV LATH' },
  { lastName: 'BAMBA', firstName: 'AMINATA' },
  { lastName: 'SABI', firstName: 'GRACE' },
  { lastName: 'BAHOU', firstName: 'KACHIE CARELLE' },
  { lastName: 'MAMBO', firstName: 'ASSEU JARVIC MICHEL' },
  { lastName: 'OUAYOGODE', firstName: 'ADAMA D.' },
  { lastName: 'N’GUESSAN', firstName: 'KRE AXEL ROMUALD' },
  { lastName: 'DOH', firstName: 'TIA KEVIN' },
  { lastName: 'YOBOU', firstName: 'GRANT AXEL' },
  { lastName: 'BILSON', firstName: 'OCEANE LAURETTE' },
  { lastName: 'GOH', firstName: 'YAO MARDOCHEE' },
  { lastName: 'KONATE', firstName: 'MAHAWA YELE' },
  { lastName: 'KOROGO', firstName: 'KOUAME ARMEL' },
  { lastName: 'CISSE', firstName: 'NABINTOU' },
  { lastName: 'ZOUKROU', firstName: 'ACKAH CHRISTOPHE' },
  { lastName: 'TIONON', firstName: 'SAFRA' },
  { lastName: 'ADOU', firstName: 'MICHAEL ANGE' },
  { lastName: 'ABLI', firstName: 'AMPO ABDOULAYE' },
  { lastName: 'TRAORE', firstName: 'AICHA' },
  { lastName: 'OSSEY', firstName: 'ATSE HENOC JAURES' },
  { lastName: 'KOFFI', firstName: 'ANNE KEREN' },
  { lastName: 'OUATTARA', firstName: 'SAMIRA' },
  { lastName: 'KOUAKOU', firstName: 'EZECKIEL' },
  { lastName: 'ASSAMBAN', firstName: 'SAMUEL' },
  { lastName: 'N’DIAYE', firstName: 'N’DEYE AHOU' },
  { lastName: 'KONATE', firstName: 'SALIMATA' },
  { lastName: 'SEKONGO', firstName: 'YELE ESTHER' },
  { lastName: 'KOAMBA', firstName: 'YOWAN' },
  { lastName: 'KOFFI', firstName: 'RENAUD SIDOINE' },
  { lastName: 'DIALLO', firstName: 'MOHAMED MOCTAR' },
  { lastName: 'DIALLO', firstName: 'MARIYAMA' },
  { lastName: 'GNAMIEN', firstName: 'MOYE JEAN DAVID A.' },
  { lastName: 'TRA LOU', firstName: 'IRIE GRACE V.E.' },
  { lastName: 'DIABY', firstName: 'MAMADOU' },
  { lastName: 'TITI', firstName: 'ANGE REBECCA' },
  { lastName: 'ATILADE', firstName: 'FARIDAT OLAYEMI' },
  { lastName: 'DJIBO', firstName: 'HAMIDOU' },
  { lastName: 'TRAORE', firstName: 'Z.MALICK' },
  { lastName: 'KACOU', firstName: 'HIFEYE' },
  { lastName: 'DIEMAN', firstName: 'CHRYS ARMEL' },
  { lastName: 'YAVO', firstName: 'DAZY ARTHUR' },
  { lastName: 'AGOUA', firstName: 'ARIEL MESCHAC' },
  { lastName: 'KOFFI', firstName: 'BAH MONDESIR' },
  { lastName: 'KINIMO', firstName: 'KAKOU MOSES G.' },
  { lastName: 'DIAMOUTENE', firstName: 'ABOUBACAR' },
  { lastName: 'KOUAKOU', firstName: 'ESSY MARC' },
  { lastName: 'YODE', firstName: 'SERY ANGE A.' },
  { lastName: 'CISSE', firstName: 'ROKIATOU' },
  { lastName: 'DEKPETI', firstName: 'W. SANDRINE' },
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
        user.firstName.toLowerCase() === firstName.toLowerCase() &&
        user.lastName.toLowerCase() === lastName.toLowerCase()
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
