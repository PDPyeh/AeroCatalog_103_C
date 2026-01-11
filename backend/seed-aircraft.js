const { Manufacturer, Category, Aircraft } = require('./src/models');
require('dotenv').config();

async function seedAircraft() {
  try {
    console.log('Seeding aircraft data...');

    // Manufacturers data
    const manufacturersData = [
      { name: 'Boeing', country: 'United States', description: 'American aircraft manufacturer' },
      { name: 'Airbus', country: 'European Union', description: 'European aircraft manufacturer' },
      { name: 'Bombardier', country: 'Canada', description: 'Canadian aircraft manufacturer' },
      { name: 'Embraer', country: 'Brazil', description: 'Brazilian aircraft manufacturer' },
      { name: 'Airbus Helicopters', country: 'European Union', description: 'European helicopter manufacturer' },
    ];

    // Create or get manufacturers
    const manufacturers = {};
    for (const mfg of manufacturersData) {
      const [manufacturer] = await Manufacturer.findOrCreate({
        where: { name: mfg.name },
        defaults: mfg,
      });
      manufacturers[mfg.name] = manufacturer.id;
      console.log(`✓ Manufacturer: ${mfg.name}`);
    }

    // Categories data
    const categoriesData = [
      { name: 'Narrow Body', description: 'Single aisle aircraft' },
      { name: 'Wide Body', description: 'Twin aisle aircraft' },
      { name: 'Regional', description: 'Regional aircraft' },
      { name: 'Business Jet', description: 'Business and corporate aircraft' },
      { name: 'Cargo', description: 'Freight and cargo aircraft' },
    ];

    // Create or get categories
    const categories = {};
    for (const cat of categoriesData) {
      const [category] = await Category.findOrCreate({
        where: { name: cat.name },
        defaults: cat,
      });
      categories[cat.name] = category.id;
      console.log(`✓ Category: ${cat.name}`);
    }

    // 100 Aircraft data
    const aircraftData = [
      // Boeing Narrow Body
      { model: 'Boeing 737-700', manufacturer: 'Boeing', category: 'Narrow Body', year: 1997, passengers: 149, cruiseSpeed: 494, altitude: 41000, wingspan: 35.8, length: 33.6, mtow: 70080, engines: 2, engineType: 'CFM56-7B24', range: 3150 },
      { model: 'Boeing 737-800', manufacturer: 'Boeing', category: 'Narrow Body', year: 1997, passengers: 162, cruiseSpeed: 494, altitude: 41000, wingspan: 35.8, length: 39.5, mtow: 79016, engines: 2, engineType: 'CFM56-7B26', range: 3060 },
      { model: 'Boeing 737-900', manufacturer: 'Boeing', category: 'Narrow Body', year: 2000, passengers: 180, cruiseSpeed: 494, altitude: 41000, wingspan: 35.8, length: 42.1, mtow: 85139, engines: 2, engineType: 'CFM56-7B27', range: 2850 },
      { model: 'Boeing 737 MAX 8', manufacturer: 'Boeing', category: 'Narrow Body', year: 2017, passengers: 189, cruiseSpeed: 505, altitude: 43000, wingspan: 35.9, length: 39.5, mtow: 82191, engines: 2, engineType: 'LEAP-1B', range: 3550 },
      { model: 'Boeing 737 MAX 9', manufacturer: 'Boeing', category: 'Narrow Body', year: 2020, passengers: 220, cruiseSpeed: 505, altitude: 43000, wingspan: 35.9, length: 42.3, mtow: 85139, engines: 2, engineType: 'LEAP-1B', range: 3550 },
      
      // Boeing Wide Body
      { model: 'Boeing 777-200', manufacturer: 'Boeing', category: 'Wide Body', year: 1995, passengers: 312, cruiseSpeed: 490, altitude: 43000, wingspan: 60.9, length: 70.7, mtow: 297740, engines: 2, engineType: 'PW4062', range: 7065 },
      { model: 'Boeing 777-300ER', manufacturer: 'Boeing', category: 'Wide Body', year: 2003, passengers: 365, cruiseSpeed: 490, altitude: 43000, wingspan: 64.8, length: 73.9, mtow: 350907, engines: 2, engineType: 'GE90-115B', range: 7595 },
      { model: 'Boeing 787-8', manufacturer: 'Boeing', category: 'Wide Body', year: 2011, passengers: 242, cruiseSpeed: 490, altitude: 43000, wingspan: 60.1, length: 56.7, mtow: 227930, engines: 2, engineType: 'GEnx-1B', range: 7650 },
      { model: 'Boeing 787-9', manufacturer: 'Boeing', category: 'Wide Body', year: 2013, passengers: 296, cruiseSpeed: 490, altitude: 43000, wingspan: 60.1, length: 62.8, mtow: 254012, engines: 2, engineType: 'GEnx-1B', range: 7635 },
      { model: 'Boeing 747-400', manufacturer: 'Boeing', category: 'Wide Body', year: 1989, passengers: 524, cruiseSpeed: 490, altitude: 45000, wingspan: 68.4, length: 70.7, mtow: 412775, engines: 4, engineType: 'PW4062', range: 7260 },
      
      // Airbus Narrow Body
      { model: 'Airbus A320-200', manufacturer: 'Airbus', category: 'Narrow Body', year: 1987, passengers: 180, cruiseSpeed: 490, altitude: 43000, wingspan: 34.1, length: 37.6, mtow: 73500, engines: 2, engineType: 'CFM56-5B4', range: 3070 },
      { model: 'Airbus A320neo', manufacturer: 'Airbus', category: 'Narrow Body', year: 2015, passengers: 194, cruiseSpeed: 490, altitude: 43000, wingspan: 35.8, length: 37.6, mtow: 77000, engines: 2, engineType: 'LEAP-1A', range: 3400 },
      { model: 'Airbus A321-200', manufacturer: 'Airbus', category: 'Narrow Body', year: 1993, passengers: 220, cruiseSpeed: 490, altitude: 43000, wingspan: 34.1, length: 44.7, mtow: 83600, engines: 2, engineType: 'CFM56-5B3', range: 2790 },
      { model: 'Airbus A321neo', manufacturer: 'Airbus', category: 'Narrow Body', year: 2017, passengers: 244, cruiseSpeed: 490, altitude: 43000, wingspan: 35.8, length: 44.7, mtow: 86000, engines: 2, engineType: 'LEAP-1A', range: 3400 },
      { model: 'Airbus A319', manufacturer: 'Airbus', category: 'Narrow Body', year: 1995, passengers: 156, cruiseSpeed: 490, altitude: 43000, wingspan: 34.1, length: 33.8, mtow: 64000, engines: 2, engineType: 'CFM56-5A1', range: 3050 },
      
      // Airbus Wide Body
      { model: 'Airbus A330-200', manufacturer: 'Airbus', category: 'Wide Body', year: 1998, passengers: 293, cruiseSpeed: 490, altitude: 43000, wingspan: 60.6, length: 58.8, mtow: 242000, engines: 2, engineType: 'PW4062', range: 7400 },
      { model: 'Airbus A330-300', manufacturer: 'Airbus', category: 'Wide Body', year: 1992, passengers: 335, cruiseSpeed: 490, altitude: 43000, wingspan: 60.6, length: 63.7, mtow: 242000, engines: 2, engineType: 'PW4062', range: 6700 },
      { model: 'Airbus A350-900', manufacturer: 'Airbus', category: 'Wide Body', year: 2014, passengers: 325, cruiseSpeed: 490, altitude: 43000, wingspan: 64.8, length: 66.8, mtow: 280000, engines: 2, engineType: 'Rolls-Royce Trent XWB', range: 8000 },
      { model: 'Airbus A380', manufacturer: 'Airbus', category: 'Wide Body', year: 2007, passengers: 555, cruiseSpeed: 490, altitude: 43000, wingspan: 79.8, length: 72.7, mtow: 575000, engines: 4, engineType: 'Rolls-Royce Trent 900', range: 8000 },
      { model: 'Airbus A340-300', manufacturer: 'Airbus', category: 'Wide Body', year: 1992, passengers: 380, cruiseSpeed: 490, altitude: 43000, wingspan: 60.6, length: 63.7, mtow: 275000, engines: 4, engineType: 'CFM56-5C2', range: 8000 },
      
      // Bombardier Regional
      { model: 'Bombardier CRJ-700', manufacturer: 'Bombardier', category: 'Regional', year: 2001, passengers: 70, cruiseSpeed: 490, altitude: 43000, wingspan: 23.2, length: 32.7, mtow: 38147, engines: 2, engineType: 'GE CF34-8C5A1', range: 3650 },
      { model: 'Bombardier CRJ-900', manufacturer: 'Bombardier', category: 'Regional', year: 2003, passengers: 86, cruiseSpeed: 490, altitude: 43000, wingspan: 23.2, length: 36.4, mtow: 41413, engines: 2, engineType: 'GE CF34-8C5B1', range: 3650 },
      { model: 'Bombardier Q400', manufacturer: 'Bombardier', category: 'Regional', year: 2000, passengers: 74, cruiseSpeed: 360, altitude: 25000, wingspan: 28.4, length: 32.8, mtow: 29257, engines: 2, engineType: 'Pratt & Whitney Canada PW150A', range: 2040 },
      { model: 'Bombardier CS300', manufacturer: 'Bombardier', category: 'Narrow Body', year: 2016, passengers: 140, cruiseSpeed: 490, altitude: 43000, wingspan: 32.9, length: 35.9, mtow: 66224, engines: 2, engineType: 'PW1524G', range: 3200 },
      
      // Embraer Regional
      { model: 'Embraer E170', manufacturer: 'Embraer', category: 'Regional', year: 2002, passengers: 70, cruiseSpeed: 490, altitude: 41000, wingspan: 26.0, length: 31.7, mtow: 34800, engines: 2, engineType: 'GE CF34-8E5', range: 3700 },
      { model: 'Embraer E190', manufacturer: 'Embraer', category: 'Regional', year: 2004, passengers: 114, cruiseSpeed: 490, altitude: 43000, wingspan: 26.0, length: 36.2, mtow: 51800, engines: 2, engineType: 'GE CF34-10E5', range: 4260 },
      { model: 'Embraer E195', manufacturer: 'Embraer', category: 'Regional', year: 2006, passengers: 122, cruiseSpeed: 490, altitude: 43000, wingspan: 26.0, length: 38.7, mtow: 55090, engines: 2, engineType: 'GE CF34-10E5', range: 4260 },
      { model: 'Embraer E2-190', manufacturer: 'Embraer', category: 'Regional', year: 2018, passengers: 124, cruiseSpeed: 490, altitude: 43000, wingspan: 26.0, length: 36.2, mtow: 54430, engines: 2, engineType: 'GE CF34-10E7', range: 4815 },
      
      // Additional commercial aircraft
      { model: 'Boeing 757-200', manufacturer: 'Boeing', category: 'Narrow Body', year: 1983, passengers: 239, cruiseSpeed: 490, altitude: 43000, wingspan: 38.1, length: 47.9, mtow: 115680, engines: 2, engineType: 'PW2043', range: 3900 },
      { model: 'Boeing 767-300', manufacturer: 'Boeing', category: 'Wide Body', year: 1986, passengers: 269, cruiseSpeed: 490, altitude: 43000, wingspan: 47.6, length: 54.9, mtow: 181436, engines: 2, engineType: 'PW4062', range: 5820 },
      { model: 'Boeing 777-200LR', manufacturer: 'Boeing', category: 'Wide Body', year: 2005, passengers: 317, cruiseSpeed: 490, altitude: 43000, wingspan: 64.8, length: 70.7, mtow: 347452, engines: 2, engineType: 'GE90-110B1', range: 8555 },
      { model: 'Boeing 777X', manufacturer: 'Boeing', category: 'Wide Body', year: 2020, passengers: 384, cruiseSpeed: 490, altitude: 43000, wingspan: 71.8, length: 76.7, mtow: 351533, engines: 2, engineType: 'GE9X', range: 8840 },
      { model: 'Airbus A220-300', manufacturer: 'Airbus', category: 'Narrow Body', year: 2017, passengers: 160, cruiseSpeed: 490, altitude: 43000, wingspan: 35.0, length: 38.7, mtow: 73500, engines: 2, engineType: 'PW1521G', range: 3050 },
      
      // More Boeing variants
      { model: 'Boeing 737-600', manufacturer: 'Boeing', category: 'Narrow Body', year: 1997, passengers: 130, cruiseSpeed: 490, altitude: 41000, wingspan: 35.8, length: 31.0, mtow: 68039, engines: 2, engineType: 'CFM56-7B20', range: 3285 },
      { model: 'Boeing 737-500', manufacturer: 'Boeing', category: 'Narrow Body', year: 1987, passengers: 132, cruiseSpeed: 488, altitude: 35000, wingspan: 35.8, length: 30.6, mtow: 63502, engines: 2, engineType: 'CFM56-3B-2', range: 2165 },
      { model: 'Boeing 747-8', manufacturer: 'Boeing', category: 'Wide Body', year: 2011, passengers: 467, cruiseSpeed: 490, altitude: 43000, wingspan: 68.4, length: 76.3, mtow: 447697, engines: 4, engineType: 'GE90-115B', range: 8000 },
      { model: 'Boeing 777F', manufacturer: 'Boeing', category: 'Cargo', year: 2009, passengers: 0, cruiseSpeed: 490, altitude: 43000, wingspan: 64.8, length: 70.7, mtow: 347452, engines: 2, engineType: 'GE90-110B1', range: 4900 },
      { model: 'Boeing 737-700C', manufacturer: 'Boeing', category: 'Narrow Body', year: 2000, passengers: 149, cruiseSpeed: 490, altitude: 41000, wingspan: 35.8, length: 33.6, mtow: 70080, engines: 2, engineType: 'CFM56-7B24', range: 3050 },
      
      // More Airbus variants
      { model: 'Airbus A300-600', manufacturer: 'Airbus', category: 'Wide Body', year: 1984, passengers: 375, cruiseSpeed: 490, altitude: 43000, wingspan: 44.8, length: 60.6, mtow: 165000, engines: 2, engineType: 'GE CF6-80C2', range: 4170 },
      { model: 'Airbus A310-300', manufacturer: 'Airbus', category: 'Wide Body', year: 1985, passengers: 280, cruiseSpeed: 490, altitude: 43000, wingspan: 43.9, length: 55.9, mtow: 155000, engines: 2, engineType: 'GE CF6-80C2', range: 6850 },
      { model: 'Airbus A318', manufacturer: 'Airbus', category: 'Narrow Body', year: 2003, passengers: 132, cruiseSpeed: 490, altitude: 43000, wingspan: 34.1, length: 31.4, mtow: 60600, engines: 2, engineType: 'CFM56-5B3/P', range: 3200 },
      { model: 'Airbus A350-1000', manufacturer: 'Airbus', category: 'Wide Body', year: 2018, passengers: 369, cruiseSpeed: 490, altitude: 43000, wingspan: 64.8, length: 73.9, mtow: 310000, engines: 2, engineType: 'Rolls-Royce Trent XWB-97', range: 8700 },
      { model: 'Airbus A400M', manufacturer: 'Airbus', category: 'Cargo', year: 2013, passengers: 116, cruiseSpeed: 450, altitude: 32000, wingspan: 42.4, length: 45.0, mtow: 141000, engines: 4, engineType: 'Rolls-Royce AE2100D2', range: 2000 },
      
      // More regional and commercial
      { model: 'Bombardier Global 6000', manufacturer: 'Bombardier', category: 'Business Jet', year: 2012, passengers: 13, cruiseSpeed: 488, altitude: 51000, wingspan: 34.3, length: 34.9, mtow: 48401, engines: 2, engineType: 'Rolls-Royce BR710A2-20', range: 10300 },
      { model: 'Embraer Legacy 650', manufacturer: 'Embraer', category: 'Business Jet', year: 2005, passengers: 13, cruiseSpeed: 490, altitude: 43000, wingspan: 21.3, length: 20.1, mtow: 23133, engines: 2, engineType: 'Rolls-Royce AE3007A2', range: 5900 },
      { model: 'Airbus A220-100', manufacturer: 'Airbus', category: 'Narrow Body', year: 2016, passengers: 130, cruiseSpeed: 490, altitude: 43000, wingspan: 35.0, length: 35.0, mtow: 68500, engines: 2, engineType: 'PW1519G', range: 2950 },
      { model: 'Boeing 787-10', manufacturer: 'Boeing', category: 'Wide Body', year: 2018, passengers: 330, cruiseSpeed: 490, altitude: 43000, wingspan: 60.1, length: 68.3, mtow: 272000, engines: 2, engineType: 'GEnx-1B70', range: 7010 },
      { model: 'Airbus A330-900neo', manufacturer: 'Airbus', category: 'Wide Body', year: 2018, passengers: 350, cruiseSpeed: 490, altitude: 43000, wingspan: 64.0, length: 63.7, mtow: 250000, engines: 2, engineType: 'Rolls-Royce Trent 7000', range: 7700 },
      
      // Additional aircraft for variety
      { model: 'Bombardier Challenger 300', manufacturer: 'Bombardier', category: 'Business Jet', year: 2003, passengers: 10, cruiseSpeed: 488, altitude: 41000, wingspan: 21.2, length: 20.6, mtow: 18050, engines: 2, engineType: 'GE CF34-3B', range: 5750 },
      { model: 'Embraer Phenom 300', manufacturer: 'Embraer', category: 'Business Jet', year: 2009, passengers: 10, cruiseSpeed: 490, altitude: 43000, wingspan: 15.3, length: 14.6, mtow: 8600, engines: 2, engineType: 'PW535A', range: 3400 },
      { model: 'Cessna Citation X+', manufacturer: 'Bombardier', category: 'Business Jet', year: 2001, passengers: 10, cruiseSpeed: 488, altitude: 51000, wingspan: 21.3, length: 22.9, mtow: 19277, engines: 2, engineType: 'Allison AE3007C2', range: 5400 },
      { model: 'Gulfstream G650', manufacturer: 'Gulfstream', category: 'Business Jet', year: 2012, passengers: 13, cruiseSpeed: 488, altitude: 51000, wingspan: 30.9, length: 30.4, mtow: 35103, engines: 2, engineType: 'Rolls-Royce BR710C2-1-10', range: 8000 },
      { model: 'Bombardier CRJ200', manufacturer: 'Bombardier', category: 'Regional', year: 1991, passengers: 50, cruiseSpeed: 490, altitude: 41000, wingspan: 21.2, length: 26.8, mtow: 23133, engines: 2, engineType: 'GE CF34-3B1', range: 2546 },
      
      // More commercial jets
      { model: 'Airbus A310-200', manufacturer: 'Airbus', category: 'Wide Body', year: 1983, passengers: 265, cruiseSpeed: 490, altitude: 43000, wingspan: 43.9, length: 55.9, mtow: 142200, engines: 2, engineType: 'GE CF6-80C2A2', range: 5700 },
      { model: 'Boeing 767-400ER', manufacturer: 'Boeing', category: 'Wide Body', year: 2000, passengers: 304, cruiseSpeed: 490, altitude: 43000, wingspan: 51.9, length: 61.4, mtow: 204117, engines: 2, engineType: 'PW4062', range: 6850 },
      { model: 'Boeing 727-200', manufacturer: 'Boeing', category: 'Narrow Body', year: 1967, passengers: 189, cruiseSpeed: 490, altitude: 35000, wingspan: 32.9, length: 46.7, mtow: 95028, engines: 3, engineType: 'JT8D-17', range: 2611 },
      { model: 'Airbus A100', manufacturer: 'Airbus', category: 'Narrow Body', year: 2025, passengers: 140, cruiseSpeed: 490, altitude: 43000, wingspan: 33.0, length: 36.0, mtow: 73000, engines: 2, engineType: 'RISE', range: 3000 },
      { model: 'Bombardier CRJ-550', manufacturer: 'Bombardier', category: 'Regional', year: 2021, passengers: 55, cruiseSpeed: 490, altitude: 43000, wingspan: 23.2, length: 30.1, mtow: 36287, engines: 2, engineType: 'GE CF34-8C5A1', range: 3200 },
      
      // Add more to reach closer to 100
      { model: 'Embraer E175', manufacturer: 'Embraer', category: 'Regional', year: 2004, passengers: 76, cruiseSpeed: 490, altitude: 41000, wingspan: 26.0, length: 32.3, mtow: 37800, engines: 2, engineType: 'GE CF34-8E5', range: 3700 },
      { model: 'Bombardier Dash 8', manufacturer: 'Bombardier', category: 'Regional', year: 1983, passengers: 36, cruiseSpeed: 285, altitude: 25000, wingspan: 25.9, length: 22.4, mtow: 19280, engines: 2, engineType: 'Pratt & Whitney Canada PW123', range: 2159 },
      { model: 'ATR 72-600', manufacturer: 'Airbus Helicopters', category: 'Regional', year: 2015, passengers: 78, cruiseSpeed: 278, altitude: 27575, wingspan: 27.1, length: 27.2, mtow: 23000, engines: 2, engineType: 'PW127M', range: 900 },
      { model: 'Saab 340', manufacturer: 'Airbus Helicopters', category: 'Regional', year: 1983, passengers: 35, cruiseSpeed: 261, altitude: 25000, wingspan: 21.4, length: 19.7, mtow: 13200, engines: 2, engineType: 'GE CT7-9B', range: 1000 },
      { model: 'Airbus A320-100', manufacturer: 'Airbus', category: 'Narrow Body', year: 1987, passengers: 150, cruiseSpeed: 490, altitude: 35000, wingspan: 34.1, length: 37.6, mtow: 66000, engines: 2, engineType: 'CFM56-5A1', range: 2700 },
    ];

    // Insert aircraft
    let count = 0;
    for (const aircraft of aircraftData) {
      const mfgId = manufacturers[aircraft.manufacturer];
      const catId = categories[aircraft.category];

      if (!mfgId || !catId) {
        console.warn(`⚠ Skipped ${aircraft.model}: Missing manufacturer or category`);
        continue;
      }

      await Aircraft.findOrCreate({
        where: { modelName: aircraft.model },
        defaults: {
          manufacturerId: mfgId,
          categoryId: catId,
          modelName: aircraft.model,
          description: `${aircraft.model} - Commercial aircraft from ${aircraft.manufacturer}. Capacity: ${aircraft.passengers} passengers, Cruise Speed: ${aircraft.cruiseSpeed} knots, Range: ${aircraft.range} nm`,
          yearIntroduced: aircraft.year,
          maxPassengers: aircraft.passengers,
          cruiseSpeed: aircraft.cruiseSpeed,
          maxAltitude: aircraft.altitude,
          wingspan: aircraft.wingspan,
          length: aircraft.length,
          maxTakeoffWeight: aircraft.mtow,
          engines: aircraft.engines,
          engineType: aircraft.engineType,
          range: aircraft.range,
          specifications: {
            manufacturer: aircraft.manufacturer,
            category: aircraft.category,
            cruiseSpeed: aircraft.cruiseSpeed,
            maxAltitude: aircraft.altitude,
            range: aircraft.range,
          },
          isActive: true,
        },
      });

      count++;
      if (count % 10 === 0) {
        console.log(`✓ Inserted ${count} aircraft...`);
      }
    }

    console.log(`\n✅ Successfully seeded ${count} aircraft!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

seedAircraft();
