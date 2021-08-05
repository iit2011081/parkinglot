import SnowflakeCondon from 'snowflake-codon'
import _ from 'lodash';
// import constants from '../utils/constants';

module.exports = function (sequelize, DataTypes) {
	const generator = new SnowflakeCondon();
	const rate = sequelize.define('rate', {
		id: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true
		},
		start: {
			type: DataTypes.INTEGER,
			allowNull: false,
			field: 'start'
		},
        end: {
			type: DataTypes.INTEGER,
			allowNull: false,
			field: 'end'
		},
        amount: {
			type: DataTypes.INTEGER,
			allowNull: false,
			field: 'amount'
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
		tableName: 'rate',
		timestamps: true,
		paranoid: true
	});

	rate.beforeValidate((com) => {
		com.id = generator.nextId();
		return com;
	});
	return rate;
};