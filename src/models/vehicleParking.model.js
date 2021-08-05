import SnowflakeCondon from 'snowflake-codon'
import _ from 'lodash';
import constants from '../utils/constants';

module.exports = function (sequelize, DataTypes) {
	const generator = new SnowflakeCondon();
	const vehicleParking = sequelize.define('vehicleParking', {
		id: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true
		},
		vehicleNumber: {
			type: DataTypes.STRING,
			allowNull: false,
			field: 'vehicle_number'
		},
        startTime: {
			type: DataTypes.BIGINT,
			allowNull: false,
			field: 'start_time'
		},
		endTime: {
			type: DataTypes.BIGINT,
			allowNull: true,
			field: 'end_time'
		},
        charge : {
            type: DataTypes.INTEGER,
			allowNull: true,
			field: 'charge'
        },
		createdAt: {
			type: DataTypes.DATE,
			allowNull: true,
			field: 'created_at'
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false,
			field: 'updated_at'
		},
		deletedAt: {
			type: DataTypes.DATE,
			allowNull: true,
			field: 'deleted_at'
		}
	}, {
		tableName: 'vehicle_parking',
		timestamps: true,
		paranoid: true
	});

	vehicleParking.associate = function (models) {
		vehicleParking.belongsTo(models.parkingLot, {
			onDelete: "CASCADE",
			as: 'parkingLot',
			foreignKey: {
				name: 'parkingLotId',
				field: 'parking_lot_id',
				allowNull: false
			}
		});
	};

	vehicleParking.beforeValidate((com) => {
		com.id = generator.nextId();
		return com;
	});
	return vehicleParking;
};