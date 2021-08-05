import Router from 'koa-router';
import parkingCtrl from '../controllers/parking.ctrl'

const router = new Router({
	prefix: '/api/v1'
});


//App APIs
/***************************parking routes******************************/
router.post('/web/parking', parkingCtrl.createParking);
router.post('/web/rate', parkingCtrl.createRate);
router.post('/web/park-vehcile', parkingCtrl.parkVehicle);
router.post('/web/exit-vehcile', parkingCtrl.exitVehicle);
export default router;