const moment = require('moment');
exports.dpdShipmentObj = () => {
  const collectionDateAndTimeTemp = dpdDeliveryTime();
  const collectionDateAndTime = moment(collectionDateAndTimeTemp).format();
  
	const obj = {
    "jobId": null,
    "collectionOnDelivery": false,
    "invoice": null,
    "collectionDate": collectionDateAndTime,
    "consignment": [
        {
            "consignmentNumber": null,
            "consignmentRef": null,
            "parcel": [],
            "collectionDetails": {
                "address": {
                    "organisation": "",
                    "countryCode": "GB",
                    "postcode": "",
                    "street": "",
                    "town": "",
                    "county": "",
                    "locality": ""
                },
                "contactDetails": {
                    "contactName": "",
                    "telephone": ""
                }
            },
            "deliveryDetails": {
                "contactDetails": {
                    "contactName": " ",
                    "telephone": ""
                },
                "address": {
                    "countryCode": "GB",
                    "postcode": "",
                    "street": "",
                    "locality": " ",
                    "town": "",
                    "county": ""
                }
            },
            "numberOfParcels": 0,
            "totalWeight": 0,
            "consolidate": false,
            "liabilityValue": null,
            "networkCode": "",
            "liability": false,
            "parcelDescription": "",
            "shippingRef1": "",
            "shippingRef2": "",
            "shippingRef3": "",
            "deliveryInstructions": ""
        }
    ]
  }
  return obj;
}

function dpdDeliveryTime() {
  const currentTime = moment();

  // If today is Saturday or Sunday, return 11:00 a.m. current time is before 11:00 a.m.
  if (currentTime.hour() < 11 && (currentTime.day() === 0 || currentTime.day() === 6)) {
    return currentTime.clone().set({ hour: 11, minute: 0, second: 0, millisecond: 0 }).format('YYYY-MM-DD HH:mm:ss');
  }

  // If today is Saturday, current time is after 11:00 a.m.
  if (currentTime.hour() >= 11 && (currentTime.day() === 6 || currentTime.day() === 5)) {
    return currentTime.clone().add(1, 'day').set({ hour: 11, minute: 0, second: 0, millisecond: 0 }).format('YYYY-MM-DD HH:mm:ss');
  }

  // If today is Sunday, current time is after 11:00 a.m.
  if (currentTime.hour() >= 11 && currentTime.day() === 0) {
    return currentTime.clone().add(1, 'day').set({ hour: 16, minute: 0, second: 0, millisecond: 0 }).format('YYYY-MM-DD HH:mm:ss');
  }
  
  // If today is Saturday or Sunday, return 11:00 a.m.
  if (currentTime.hour() >= 11 && currentTime.day() === 0 || currentTime.day() === 6) {
    return currentTime.clone().set({ hour: 11, minute: 0, second: 0, millisecond: 0 }).format('YYYY-MM-DD HH:mm:ss');
  }
  
  // If the current time is before 4:00 p.m., return 4:00 p.m. today
  if (currentTime.hour() < 16) {
    return currentTime.clone().set({ hour: 16, minute: 0, second: 0, millisecond: 0 }).format('YYYY-MM-DD HH:mm:ss');
  }

  // If it's after 4:00 p.m. but not a weekend, return 4:00 p.m. tomorrow
  if (currentTime.hour() >= 16 && currentTime.day() !== 0 && currentTime.day() !== 6) {
    return currentTime.clone().add(1, 'day').set({ hour: 16, minute: 0, second: 0, millisecond: 0 }).format('YYYY-MM-DD HH:mm:ss');
  }
}