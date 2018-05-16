const fs = require('fs-extra');
const path = require('path');

///register repo

/// register new vehicle
// renew vehicle
// transfer vehicle (transfer ownership)


class RegisterRepository {

    constructor() {
        this.ownersFilePath = path.join(__dirname, '../data/owners.json');
        this.vehicleFilePath = path.join(__dirname, '../data/vehicle.json');
    }

    async getOwners() {
        return await fs.readJSON(this.ownersFilePath);
    }

    async getOwner(qId) {
        let owners = await this.getOwners();
        return owners.find(owner => owner.qId == qId);

    }

    async saveOwners(owners) {
        return await fs.writeJSON(this.ownersFilePath, owners);
    }

    async getVehicles() {
        return await fs.readJSON(this.vehicleFilePath);
    }

    async getVehicle(vin) {
        let vehicles = await this.getVehicles();
        return vehicles.find(vehicle => vehicle.vin == vin);
    }

    async saveVehicles(vehicles) {
        return await fs.writeJSON(this.vehicleFilePath, vehicles);
    }

    async addVehicle(vehicle) {
        let vehicles = await this.getVehicles();
        vehicles.push(vehicle);
        return await this.saveVehicles(vehicles);


    }

    async transferOwnership(transferObject) {
        let owners = await this.getOwners();
        let prevOwner = owners.find(o => o.qId == transferObject.pQID);
        let newOwner = owners.find(o => o.qId == transferObject.nQID);
        let vehicle = await this.getVehicle(transferObject.vin);
        //errors handling
        if (!vehicle)
            throw "Vehicle doesn't exist";
        if (!prevOwner)
            throw "current owner doesn't exist";
        if (transferObject.name != prevOwner.name)
            throw "Owner name mismatch";
        if (transferObject.pQID != prevOwner.qId)
            throw "Owner QID mismatch";
        if (!newOwner)
            throw "new owner doesn't exist";
        //check if the owner is owning that vehicle or not
        let vehicleIndex = prevOwner.vehicles.findIndex(singleVehicle => singleVehicle == transferObject.vin);
        if (vehicleIndex == -1)
            throw "Current owner doesn't owning that vehicle";
        if (prevOwner.qId == newOwner.qId)
            throw "you can't transfer the vehicle to yourself";
        //delete the vehicle from the old owner
        prevOwner.vehicles.splice(vehicleIndex, 1);
        //assin it to the new owner
        newOwner.vehicles.push(transferObject.vin);
        //save
        await this.saveOwners(owners);
        //return that its done
        return "Vehicle transferred successfully"


    }

    async reportAccident(accident) {
        let vehicles = await this.getVehicles();
        let vehicle = vehicles.find(singleVehicle => singleVehicle.vin == accident.vin);
        let victimVehicle = vehicles.find(singleVehicle => singleVehicle.vin == accident.victimVin);
        let insurancePolicey = vehicle.insurancePolicy;
        //send the accident report to the insurance company
        //wait for insurance approval
        //store the acknolgement report
        if (!victimVehicle)
            throw "Victim vehicle doesn't exist";
        if (!vehicle)
            throw "vehicle doesn't exist";
        //save the report
        if (insurancePolicey.approved) {
            accident.date = accident.date + " " + accident.time;
            delete accident.time;
            delete accident.vin;
            vehicle.accidents.push(accident);
            await this.saveVehicles(vehicles);
            return "Accident reported";
        }
        else
            throw "Insurance Policy isn't valid"
    }


    async renewRegisteration(vin) {
        //get the current year
        let currentYear = (new Date()).getFullYear();

        let vehicles = await
            this.getVehicles();
        let vehicle = await
            vehicles.find(v => v.vin == vin);

        //if vin exists
        if (vehicle) {
            //check if its already renewed
            if (vehicle.insurancePolicy.year == currentYear)
                return "Vehicle is already renewed"
            //if the vehicle is older than 2 years
            if ((currentYear - vehicle.productionYear) > 2) {
                //if certs are not valid
                let currentYearFitnessCert = vehicle.fitnessCert.find(singleCert => singleCert.year == currentYear);
                if (!currentYearFitnessCert)
                    throw "Fitness cert has not been found";
                if (!currentYearFitnessCert.approved)
                    throw "FitnessCert doesn't approved";
            }
            vehicle.insurancePolicy.year = currentYear;
            await
                this.saveVehicles(vehicles)
            return "renewed registration successfully";
        }
        else
            throw "Vehicle doesn't exist Invalid VIN"

    }

}

module.exports = new RegisterRepository();