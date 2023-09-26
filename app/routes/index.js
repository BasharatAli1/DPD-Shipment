const router = require('express').Router();

// DSP APIs
router.use(require('./dsp/dsp.routes'));

router.use('/', function (req, res, next) {
	res.statusMessage = "Route don't found";
	res.status(404).end();
});

module.exports = router;