const { Router } = require ("express");
const { addCategory, getCategory } = require ('../controllers/categoryControllers');
const { verifyToken } = require("../middlewares/verifyToken");
const { Category } = require('./../db');
const router = Router();

//POST JSON 
// /category/json
router.post("/json", async (req, res) => {
    try {
      const jsonCategory = req.body;
      const categoryLoad = jsonCategory.forEach( async (c) => {
        await Category.findOrCreate({
          where: {
            name: c.name
          }
        })
      }) ;
      res.status(201).send('Categories saved successfully') ;
    }catch(e){
      res.status(404).send(`error en postcategoryJson: ${e.message}`)
    }
  });

//POST Category (solo el admin puede agregar categorías)
// http://localhost:3001/category
router.post('/', verifyToken, async (req,res) => {
    if(req.userLogin.isAdmin){  
        try {
            console.log('en try del post category');
            const addedCategory = await addCategory ({...req.body});
            return res.send (`Categoría agregada correctamente`);
        } catch (error) {
            return res.status(404).send('error:'+ error.message);
        }
    } else{
        res.status(403).json(`No tiene permiso para agregar categorías`);
      }  
});

//GET Category
// http://localhost:3001/category
router.get('/', (req,res) => {    
    try {
        return getCategory().then(category => 
            typeof category === "object" ? res.status(200).json(category) : res.status(404).json(category));
            
        } catch (error) {
            return res.send(error);
        }
});

module.exports = router;