

const express  = require ('express');

const multer  = require ('multer');


const bodyParser  =  require('body-parser');

const path  = require ('path');



const app = express();


app.use(bodyParser.json());

const storage  = multer.diskStorage({destination:function (req, file, cb){
      cb(null, "./uploads/");
    } , filename: function (req, file, cb){
     cb(null,  Date.now() + path.extname(file.originalname) );
    },
});

const upload   =  multer({ storage: storage  , limits:{fileSize : 50 * 1024 *1024}});

const  fs = require("fs");

const  uploadDir   = './uploads';

if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}




let  items  = [] ;
const router = express.Router();

router.post('/api/items', (req, res) => {
    const { name, description } = req.body;
    const newItem = { id: items.length + 1, name, description };
    items.push(newItem);
    res.status(201).json(newItem);
});

// CRUD - Lire tous les items
router.get('/api/items', (req, res) => {
    res.status(200).json(items);
});

// CRUD - Lire un item spécifique
router.get('/api/items/:id', (req, res) => {
    const item = items.find(i => i.id === parseInt(req.params.id));
    if (item) {
        res.status(200).json(item);
    } else {
        res.status(404).json({ message: 'Item non trouvé' });
    }
});

// CRUD - Mettre à jour un item
router.put('/api/items/:id', (req, res) => {
    const { name, description } = req.body;
    const item = items.find(i => i.id === parseInt(req.params.id));
    if (item) {
        item.name = name;
        item.description = description;
        res.status(200).json(item);
    } else {
        res.status(404).json({ message: 'Item non trouvé' });
    }
});

// CRUD - Supprimer un item
router.delete('/api/items/:id', (req, res) => {
    const index = items.findIndex(i => i.id === parseInt(req.params.id));
    if (index !== -1) {
        items.splice(index, 1);
        res.status(200).json({ message: 'Item supprimé' });
    } else {
        res.status(404).json({ message: 'Item non trouvé' });
    }
});

// Route pour l'upload d'un fichier
router.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Aucun fichier téléchargé' });
    }
    res.status(200).json({
        message: 'Fichier téléchargé avec succès',
        file: req.file
    });
});

module.exports = router;





