import SnowflakeCondon from 'snowflake-codon'
import _ from 'lodash';
import constants from '../utils/constants';

module.exports = function (sequelize, DataTypes) {
	const generator = new SnowflakeCondon();
	const vehicleCapacity = sequelize.define('vehicleCapacity', {
		id: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true
		},
		capacity: {
			type: DataTypes.INTEGER,
			allowNull: false,
			field: 'capacity'
		},
        allocatedCapacity: {
			type: DataTypes.INTEGER,
			allowNull: false,
            defaultValue : 0,
			field: 'allocated_capacity'
		},
		vehicleType: {
			type: DataTypes.ENUM(['TWO_WHEELER', 'FOUR_WHEELER']),
			allowNull: false,
			field: 'vehicle_type'
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
		tableName: 'vehicle_capacity',
		timestamps: true,
		paranoid: true
	});

	vehicleCapacity.associate = function (models) {
		vehicleCapacity.belongsTo(models.parkingLot, {
			onDelete: "CASCADE",
			as: 'parkingLot',
			foreignKey: {
				name: 'parkingLotId',
				field: 'parking_lot_id',
				allowNull: false
			}
		});
	};

	vehicleCapacity.beforeValidate((com) => {
		com.id = generator.nextId();
		return com;
	});
	return vehicleCapacity;
};