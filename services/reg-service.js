const regRepo = require('../repositories/register-repository');

class RegService {

    async getVehicles(req, res) {
        const vehicles = await regRepo.getVehicles();
        res.status(200).json(vehicles);
    }

    async reportAccident(req, res) {
        try{
            let accident = req.body;
            const response = await regRepo.reportAccident(accident);
            res.status(200).json(response);
        }catch (err){
            res.status(500).send(err);
        }

    }

    async renewRegisteration(req, res) {
        const vin = req.params.vin;
        console.log(vin);
        try {
            let response = await regRepo.renewRegisteration(vin);
            res.status(201).send(response);

        }
        catch (err) {
            res.status(500).send(err);
        }
    }

    async transferOwnership(req, res) {
        const transferObject = req.body;
        //console.log(vin);
        try {
            let response = await regRepo.transferOwnership(transferObject);
            res.status(201).send(response);
        }
        catch (err) {
            res.status(500).send(err);
            console.log(err)
        }
    }


}

module.exports = new RegService();