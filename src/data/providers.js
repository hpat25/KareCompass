const providers = [
  {
    id: 1,
    name: "KC Family Clinic",
    lat: 39.0997,
    lng: -94.5786,

    baseCost: 120,
    acceptsInsurance: ["Aetna", "BlueCross"],

    waitTimeDays: 3,
    rating: 4.2,

    services: ["primary"],
    distanceMiles: 5,
    telehealth: true
  },
  {
    id: 2,
    name: "Sunrise Health Center",
    lat: 39.05,
    lng: -94.6,

    baseCost: 80,
    acceptsInsurance: ["Medicaid"],

    waitTimeDays: 7,
    rating: 3.8,

    services: ["primary"],
    distanceMiles: 8,
    telehealth: false
  },

  {
  id: 3,
  name: "Downtown Urgent Care",
  lat: 39.103,
  lng: -94.583,
  baseCost: 150,
  acceptsInsurance: ["Aetna", "Cigna"],
  waitTimeDays: 1,
  rating: 4.5,
  services: ["urgent care"],
  distanceMiles: 2,
  telehealth: false
},
{
  id: 4,
  name: "Midtown Health Clinic",
  lat: 39.09,
  lng: -94.57,
  baseCost: 95,
  acceptsInsurance: ["BlueCross"],
  waitTimeDays: 4,
  rating: 4.0,
  services: ["primary"],
  distanceMiles: 4,
  telehealth: true
},
{
  id: 5,
  name: "Westside Medical Center",
  lat: 39.08,
  lng: -94.62,
  baseCost: 200,
  acceptsInsurance: ["Aetna", "United"],
  waitTimeDays: 6,
  rating: 4.3,
  services: ["specialist"],
  distanceMiles: 7,
  telehealth: false
},
{
  id: 6,
  name: "QuickCare Clinic",
  lat: 39.11,
  lng: -94.55,
  baseCost: 70,
  acceptsInsurance: ["Medicaid"],
  waitTimeDays: 2,
  rating: 3.9,
  services: ["urgent care"],
  distanceMiles: 3,
  telehealth: true
},
{
  id: 7,
  name: "Community Health Center",
  lat: 39.07,
  lng: -94.58,
  baseCost: 60,
  acceptsInsurance: ["Medicaid", "Medicare"],
  waitTimeDays: 5,
  rating: 3.7,
  services: ["primary"],
  distanceMiles: 6,
  telehealth: true
},
{
  id: 8,
  name: "North KC Family Practice",
  lat: 39.15,
  lng: -94.57,
  baseCost: 110,
  acceptsInsurance: ["BlueCross", "United"],
  waitTimeDays: 3,
  rating: 4.1,
  services: ["primary"],
  distanceMiles: 8,
  telehealth: false
},
{
  id: 9,
  name: "Express Health Clinic",
  lat: 39.095,
  lng: -94.54,
  baseCost: 85,
  acceptsInsurance: ["Cigna"],
  waitTimeDays: 1,
  rating: 4.0,
  services: ["urgent care"],
  distanceMiles: 2,
  telehealth: true
},
{
  id: 10,
  name: "Premier Specialty Care",
  lat: 39.085,
  lng: -94.6,
  baseCost: 250,
  acceptsInsurance: ["Aetna"],
  waitTimeDays: 10,
  rating: 4.6,
  services: ["specialist"],
  distanceMiles: 9,
  telehealth: false
}
];

export default providers;