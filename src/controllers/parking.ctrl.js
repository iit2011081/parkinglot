import responseService from '../services/response.service'
import parkingService from '../services/parking.service'

class Parking {
    async createParking(ctx) {
        await parkingService.createParking(ctx.request.body).then(resp => {
			let msg = 'Parking created successfully';
			return responseService.sendSuccessResponse(ctx, resp, msg);
		}).catch(function (err) {
			return responseService.sendErrorResponse(ctx, err);
		});
    }

    async createRate(ctx) {
        await parkingService.createRate(ctx.request.body).then(resp => {
			let msg = 'Rate card created successfully';
			return responseService.sendSuccessResponse(ctx, resp, msg);
		}).catch(function (err) {
			return responseService.sendErrorResponse(ctx, err);
		});
    }

    async parkVehicle(ctx) {
        await parkingService.parkVehicle(ctx.request.body).then(resp => {
			let msg = 'Vehicle parked successfully';
			return responseService.sendSuccessResponse(ctx, resp, msg);
		}).catch(function (err) {
			return responseService.sendErrorResponse(ctx, err);
		});
    }

    async exitVehicle(ctx) {
        await parkingService.exitVehicle(ctx.request.body).then(resp => {
			let msg = 'Vehicle exited successfully';
			return responseService.sendSuccessResponse(ctx, resp, msg);
		}).catch(function (err) {
			return responseService.sendErrorResponse(ctx, err);
		});
    }
}

const ParkingCtrl = new Parking();
export default ParkingCtrl;