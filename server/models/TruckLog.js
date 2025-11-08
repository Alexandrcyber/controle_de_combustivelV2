const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const TruckLog = sequelize.define('TruckLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  truckModel: { type: DataTypes.STRING, allowNull: false },
  licensePlate: { type: DataTypes.STRING, allowNull: false },
  month: { type: DataTypes.STRING, allowNull: false },
  initialKm: { type: DataTypes.FLOAT, allowNull: false },
  finalKm: { type: DataTypes.FLOAT, allowNull: false },
  fuelPricePerLiter: { type: DataTypes.FLOAT, allowNull: false },
  totalFuelCost: { type: DataTypes.FLOAT, allowNull: false },
  idealKmLRoute: { type: DataTypes.FLOAT, allowNull: false },
  route: { type: DataTypes.STRING, allowNull: false },
  gasStation: { type: DataTypes.STRING, allowNull: false },
});

module.exports = TruckLog;
