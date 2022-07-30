
const { Router } = require("express");
const { Travel , Purchase , Purchaseitem, Product , Businessbranch } = require('./../db')
const { getTravel } = require('../controllers/travelControllers')
const router = Router();
const {Op} = require('sequelize');

//GET trae todos los travel
router.get('/', async (req, res) => {
    const allTravel = await getTravel();
    try {
        res.status(200).send(allTravel);
    } catch (error) {
        res.status(404).send(error.message);
    }

})

//POST / CREATE Travel
// http://localhost:3001/api/travel
router.post('/', async (req, res) => {
    const { userEmail, travelProvince, travelCityId, arrivalProvince, arrivalCityId, startDate, arrivalDate } = req.body;
    if (!userEmail || !travelProvince || !travelCityId || !arrivalProvince || !arrivalCityId || !startDate || !arrivalDate) {
        res.status(404).send('Faltan datos para crear el viaje')
    } else {
        try {
            const newTravel = await Travel.create({
                userEmail,
                travelProvince,
                travelCityId,
                arrivalProvince,
                arrivalCityId,
                startDate,
                arrivalDate
            })
            res.status(201).send('Viaje creado')
        } catch (e) {
            res.send('error:' + e.message)
        }
    }
})

//PUT / UPDATE TRAVEL
// http://localhost:3001/api/travel/:id
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const modification = req.body; //json con atributos a modificar y nuevos valores
        const q = await Travel.update(modification, {
            where: { id: id }
        });
        res.status(201).send(`${q} Viajes modificados`)
    } catch (e) {
        res.send('error:' + e.message)
    }
})

//DELETE TRAVEL
// http://localhost:3001/api/travel/:id
router.delete('/:id', async (req, res) => {
    try {
        let { id } = req.params;
        await Travel.destroy({
            where: { id: id }
        });
        res.status(201).send('Viajes eliminados:')
    } catch (e) {
        res.send('error:' + e.message)
    }
})

//GET BY PURCHASE // trae todos los travels que coinciden con una purchase
// http://localhost:3001/api/travel/:idPurchase
router.get('/purchase/:idPurchase', async (req, res) => {
    try {
        const {idPurchase} = req.params;
        console.log(idPurchase);
        let purchase = await Purchase.findByPk(idPurchase, {
            include: [{model: Purchaseitem}]
        });
        
        let purchaseTravelCity = ( await Product.findByPk(purchase.purchaseitems[0].productId, {
            include: [{model: Businessbranch}]
        })).businessbranch.cityId;

        let matchTravels = await Travel.findAll({
            where: {
                travelCityId : {
                    [Op.eq]: purchaseTravelCity
                },
                arrivalCityId:{
                    [Op.eq]: purchase.arrivalCityId
                },
                arrivalDate: {
                    [Op.lt]: purchase.maxDeliveryDate
                }
            }
        })

        res.status(200).send(matchTravels.length ? matchTravels : "No existen coincidencias");
    } catch (error) {
        res.status(404).send(error.message);
    }

})


module.exports = router;