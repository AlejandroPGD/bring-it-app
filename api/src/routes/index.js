const { Router } = require("express");
const {Purchase, User, Travel} = require('../db');

const router = Router();
const getDbPedidos = async ()=>{
    return Purchase.findAll({
        include:{
            model: User,
            attributes: ['Email'],
            through:{
                atributes: [],
            },
        },
    });
};

router.get ('/api/pedidos', async (req, res)=>{
    try {
        return res.status(200).send(getDbPedidos);
    } catch (error) {
        return res.status(404).send(message.error);
    }
})

//CREATE travel
router.post('/api/travel', async(req,res) => {
 const { id, UserEmail, TravelProvince, TravelCity, ArrivalProvince, ArrivalCity, startDate, ArrivalDate} = req.body ; 
 if (!UserEmail || !TravelProvince || !TravelCity || !ArrivalProvince || !ArrivalCity || !startDate || !ArrivalDate) {
     res.status(404).send('Faltan datos para crear el viaje')
 } else {
     try{
         const newTravel = await Travel.create({
             id,
            UserEmail,
            TravelProvince, 
            TravelCity, 
            ArrivalProvince, 
            ArrivalCity, 
            startDate, 
            ArrivalDate
         })
         res.status(201).send('Viaje creado')
     } catch (e) {
        res.send('error:'+ e.message)
    }
 }
})

//DELETE TRAVEL
router.delete('/api/travel/:id', async(req,res) => {
        try{
            let {id} = req.params;
            await Travel.destroy({
                where: {id: id}
            });
            res.status(201).send('Viajes eliminados:')
        } catch (e) {
           res.send('error:'+ e.message)
       }
   })

//UPDATE TRAVEL
router.put('/api/travel/:id', async(req,res) => {
    try{
        const {id} = req.params;
        const modification = req.body; //json con atributos a modificar y nuevos valores
        const q = await Travel.update(modification, {
            where: {id: id}
        });
        res.status(201).send(`${q} Viajes modificados`)
    } catch (e) {
       res.send('error:'+ e.message)
   }
})

//CREATE User
router.post('/api/user', async(req,res) => {
    const {email, password, name, lastname, age, nationality} = req.body ; 
    if (!email || !password || !name || !lastname || !age|| !nationality) {
        res.status(404).send('Faltan datos para crear el usuario')
    } else {
        try{
            const newUser = await User.create({
                email, password, name, lastname, age, nationality
            })
            res.status(201).send('Usuario creado')
        } catch (e) {
           res.send('error:'+ e.message)
       }
    }
   })



module.exports = router;