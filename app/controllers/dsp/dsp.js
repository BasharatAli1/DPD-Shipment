const { dpdShipmentObj } = require('../../helpers/dspObject');
const { DPD } = require('../../lib/DspApis');

// DPD
module.exports.dpdShipment = async function (req, res, next) {
	// const reqData = req.body;
	try {
		const dpd = new DPD();
		// const data = await dpd.shipmentApi(reqData);
		const dpdReqData = dpdShipmentObj();
		const data = await dpd.shipmentApi(dpdReqData);
		return res.jsend(data.shipmentId ? "DPD shipment creates successfully" : "DPD shipment Failed");
	} catch (e) {
		return next(e);
	}
};

module.exports.dpdShipmentLabel = async function (req, res, next) {
	const { shipmentId } = req.params;
  try {
    const dpd = new DPD();
    const data = await dpd.shipmentLabel(shipmentId);
    return res.end(data);
	} catch (e) {
		return next(e);
	}
};

module.exports.dpdTracking = async function (req, res, next) {
	const { trackingNumber } = req.params;
  try {
    const dpd = new DPD();
    const data = await dpd.shipmentTracking(trackingNumber);
    return res.jsend(data);
	} catch (e) {
		return next(e);
	}
};