//Test all the methods in the AccountRepository
const expect = require('chai').expect;
const registerRepo = require('./register-repository');


describe('Register Repository Test Suite', () => {


    describe('Owner test suite', async () => {
        //owner stuff
        it('getOwners() should return an Array ', async () => {

            let owners = await registerRepo.getOwners();
            expect(owners).to.be.a('array')
        });
        it('getOwner(123) should return an object with qId 123', async () => {
            expect(await registerRepo.getOwner(123)).to.have.property("qId", 123);
        });
        it('getOwner(123) should have property name  and its equal to Alaaeldin Said', async () => {
            expect(await registerRepo.getOwner(123)).to.be.a('object').and.to.have.property("name", "Alaaeldin Said");
        });
        it('getOwner(123) should have property address and its equal to Alsadd street', async () => {
            expect(await registerRepo.getOwner(123)).to.have.property("address", "Alsadd street");
        });
        it('getOwner(123) should have property phone and its equal to 66800725', async () => {
            expect(await registerRepo.getOwner(123)).to.have.property("phoneNumber", "66800725");
        });
        it('getOwner(123) should have property vehicle and its array', async () => {
            expect(await registerRepo.getOwner(123)).and.to.have.property("vehicles").to.be.a('array');
        });
        it('saveOwners(owners) should return success', async () => {
            let owners = await registerRepo.getOwners();
            const expectedCount = owners.length;
            await registerRepo.saveOwners(owners);

            //Read again and make sure the accounts are there
            owners = await registerRepo.getOwners();
            expect(owners)
                .to.be.a('array').and
                .have.a.have.property('length', expectedCount);
        });

    });


    describe('Vehicle test suite', async () => {
        //vehicle stuff
        it('getVehicles() should return an Array ', async () => {

            let owners = await registerRepo.getVehicles();
            expect(owners).to.be.a('array')
        });
        it('getVehicle(v111) should return an object with vin v111', async () => {
            expect(await registerRepo.getVehicle("v111")).to.have.property("vin", "v111");
        });
        it('getVehicle(v111) should have property model  and its equal to Camry', async () => {
            expect(await registerRepo.getVehicle("v111")).to.be.a('object').and.to.have.property("model", "Camry");
        });
        it('getVehicle(v111) should have property make and its equal to Toyota', async () => {
            expect(await registerRepo.getVehicle("v111")).to.have.property("make", "Toyota");
        });
        it('getVehicle(v111) should have property productionYear and its equal to 2012', async () => {
            expect(await registerRepo.getVehicle("v111")).to.have.property("productionYear", 2012);
        });
        it('getVehicle(v111) should have property violations and its array', async () => {
            expect(await registerRepo.getVehicle("v111")).and.to.have.property("violations").to.be.a('array');
        });
        it('getVehicle(v111) should have property fitnessCert and its array', async () => {
            expect(await registerRepo.getVehicle("v111")).and.to.have.property("fitnessCert").to.be.a('array');
        });
        it('getVehicle(v111) should have property insurancePolicy and its object', async () => {
            expect(await registerRepo.getVehicle("v111")).and.to.have.property("insurancePolicy").to.be.a('object');
        });
        it('getVehicle(v111) should have property accidents and its array', async () => {
            expect(await registerRepo.getVehicle("v111")).and.to.have.property("accidents").to.be.a('array');
        });

        it('saveVehicles(vehicles) should return success', async () => {
            let vehicles = await registerRepo.getVehicles();
            const expectedCount = vehicles.length;
            await registerRepo.saveVehicles(vehicles);

            //Read again and make sure the accounts are there
            vehicles = await registerRepo.getVehicles();
            expect(vehicles)
                .to.be.a('array').and
                .have.a.have.property('length', expectedCount);
        });

    });

 describe('Use cases test suite', async () => {
     
        //Transfer ownership
        it('Transfer ownership use case ', async () => {

            //save the original data to retrive it back, so no effect on the original data
            let originaOwnerData = await registerRepo.getOwners();

            let vehiclePrevOwner = await registerRepo.getOwner("123");
            let vehicleNewOwner = await registerRepo.getOwner("124");
            let transferObject = {
                vin:vehiclePrevOwner.vehicles[0],
                pQID:vehiclePrevOwner.qId,
                nQID:vehicleNewOwner.qId,
                name:vehiclePrevOwner.name
            };

            //check the length of vehicles array before transfering to the new owner
            let vehiclesLengthBeforeTransfer = vehicleNewOwner.vehicles.length;

            //do the transfer
            await registerRepo.transferOwnership(transferObject);
            //check if its done
            let newVehicleOwner = await registerRepo.getOwner(vehicleNewOwner.qId);

            expect(newVehicleOwner).to.be.a('object')
            expect(newVehicleOwner.vehicles)
                .to.be.a('array').and
                .have.a.have.property('length', vehiclesLengthBeforeTransfer+1);

            //retrive the data back
            await registerRepo.saveOwners(originaOwnerData);

        });



        //Transfer ownership
        it('Manage Accident use case ', async () => {

            const testingVIN="v111";
            //save the original data to retrive it back, so no effect on the original data
            let originalVehiclesData = await registerRepo.getVehicles();
            let vehicle = await registerRepo.getVehicle(testingVIN);
            let accident = {
                vin:testingVIN,
                victimVin:"v112",
                date:"01-01-2018",
                time:"10:00",
                desc:"He stopped suddenly before entering the roundabout",
                loc:"Al sadd street"
            };

            //check the length of vehicles array before transfering to the new owner
            let accidentCount = vehicle.accidents.length;

            //report an accident
            await registerRepo.reportAccident(accident);
            //check if its done
            let vehicleAfterReporting = await registerRepo.getVehicle(testingVIN);
            //verify that its object
            expect(vehicleAfterReporting).to.be.a('object')
            expect(vehicleAfterReporting.accidents)
                .to.be.a('array').and
                .have.a.have.property('length', accidentCount+1);

            //retrive the data back
            await registerRepo.saveVehicles(originalVehiclesData);

        });


});




});