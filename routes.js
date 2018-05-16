let router = require('express').Router();
let regService = require('./services/reg-service');

router.get('/api/vehicle/', (req, res) => regService.getVehicles(req, res));
router.post('/api/vehicle/renew/:vin', regService.renewRegisteration);
router.post('/api/vehicle/reportAccident', regService.reportAccident);
router.post('/api/vehicle/transfer/', regService.transferOwnership);


module.exports = router;