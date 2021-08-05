import models from '../models'
import moment from 'moment'
import appHelper from '../utils/appHelper';
class Parking {
    async createParking(data) {
        try {
            let parkingLot = await models.parking.findOne({
                where : {
                    name : data.name
                }
            });
            if(!parkingLot) {
                parkingLot = await models.parking.create({
                    name : data.name
                });
                for(const vehicleCapacity of vehicleCapacities) {
                    this.createVehicleCapacity(parkingLot.id, vehicleCapacity.vehicleType, capacity)
                }
                return {
                    id : parkingLot.id
                }
            } else {
                const err = appHelper.getAppErrorObject("INVALID_REQUEST_DATA");
                err.message = "Parking already created";
                return err;
            }
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async createVehicleCapacity(parkingLotId, vehicleType, capacity) {
        let vehicleCapacity = await models.vehicleCapacity.findOne({
            where : {
                parkingLotId : parkingLotId,
                vehicleType : vehicleType
            }
        });
        if(!vehicleCapacity) {
            vehicleCapacity = await models.vehicleCapacity.create({
                parkingLotId : parkingLotId,
                vehicleType : vehicleType,
                capacity : capacity
            })
            return {
                id : vehicleCapacity.id
            }
        } else {
            const err = appHelper.getAppErrorObject("INVALID_REQUEST_DATA");
            err.message = "vehicle capacity already created";
            return err;
        }
    }

    async addRate(data) {
        try {
            let rate = await models.Rate.findOne({
                where : {
                    vehicleType : data.vehicleType,
                    start : data.start,
                    end : data.start,
                    amount : data.amount
                }
            })
            if(!rate) {
                rate = await models.Rate.create({
                    vehicleType : data.vehicleType,
                    start : data.start,
                    end : data.start,
                    amount : data.amount
                })
                return {
                    id : rate.id
                }
            }
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async parkVehicle(data) {
        try {
            let vehicleParking = await models.vehicleParking.findOne({
                where : {
                    vehicleNumber : data.vehicleNumber,
                    endTime : null
                }
            })
            if(vehicleParking) {
                const err = appHelper.getAppErrorObject("INVALID_REQUEST_DATA");
                err.message = "This vehicle is already parked";
                return err; 
            }
            let parkingLot = await models.parkingLot.findOne({
                where : {
                    isAvailable : true
                },
                include : [
                    {
                        model : models.vehicleCapacity,
                        as : 'vehicleCapacities',
                        where : {
                            vehicleType : data.vehicleType
                        },
                        required : true
                    }
                ]
            });
            if(parking) {
                let anyOtherCapacityAvailability = false;
                    particularCapacity = false;

                for(const vehicleCapacity of parkingLot.vehicleCapacities) {
                    if(vehicleCapacity.vehicleType == data.vehicleType) {
                        particularCapacity = vehicleCapacity;
                    } else if(vehicleCapacity.allocatedCapacity < vehicleCapacity.capacity) {
                        anyOtherCapacityAvailability = true
                    }
                }
                if(particularCapacity.capacity - particularCapacity.allocatedCapacity >= 1) {
                    let vehicleParking = await models.vehicleParking.create({
                        parkingLotId : parkingLot.id,
                        vehicleNumber : data.vehicleNumber,
                        start : moment() //in unit timestamp
                    })
                    let parkingLotAvailability = true;
                    if(!anyOtherCapacityAvailability) {
                        if(particularCapacity.capacity - particularCapacity.allocatedCapacity == 1) {
                            parkingLotAvailability = false;
                        }
                    }
                    models.parkingLot.update({isAvailable : parkingLotAvailability}, {where : {
                        id : parkingLot.id
                    }})
                    models.vehicleCapacity.update({allocatedCapacity : particularCapacity.allocatedCapacity+1}, {
                        where : {
                            id : particularCapacity.id
                        }
                    });
                    return {
                        id : vehicleParking.id
                    }
                } else {
                    const err = appHelper.getAppErrorObject("INVALID_REQUEST_DATA");
                    err.message = "No parking available";
                    return err;
                }
            } else {
                const err = appHelper.getAppErrorObject("INVALID_REQUEST_DATA");
                err.message = "No parking available";
                return err;
            }
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async calculateAmount(startTime, endTime) {
        const d1 = moment(startTime),
            d2 = moment(endTime);
        let hours = d2.diff(d1, 'hours'); //Not sure
        let rates = await models.Rate.findAll({
            where : {
                $or : [
                    {
                        end : {
                            $lte : hours
                        }
                    },
                    {
                        end : null
                    }
                ]
            },
            order : ['start'] //desc
        });
        let amount = 0;
        for(const rate of rates) {
            let hoursInThatCategory = hours - rate.start;
            amount += hoursInThatCategory*rate.amount;
            hours = hours - rate.start;
            if(hours <= 0 || (rate.start == 0)) {
                break;
            }
        }
        return amount;
    }

    async exitVehicle(data) {
        try {
            let vehicleParking = await models.vehicleParking.findOne({
                where : {
                    vehicleNumber : data.vehicleNumber,
                    endTime : null
                }
            })
            if(vehicleParking) {
                let endTime = moment();
                let charge = await this.calculateAmount(vehicleParking.startTime, endTime);
                models.vehicleParking.update({endTime, charge}, {where : {
                    id : vehicleParking.id
                }});
                return {
                    charge
                };
            } else {

            }
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
}
const parking = new Parking();
export default parking;