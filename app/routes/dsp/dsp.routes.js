const express = require('express');
const dspController = require('../../controllers/dsp/dsp');
const router = express.Router();

// DPD
router.post(
	'/dsp/dpd/shipment',
	dspController.dpdShipment
);

router.get(
	'/dsp/dpd/shipment-label/:shipmentId',
	dspController.dpdShipmentLabel
);

router.get(
	'/dsp/dpd/tracking/:trackingNumber',
	dspController.dpdTracking
);

module.exports = router;