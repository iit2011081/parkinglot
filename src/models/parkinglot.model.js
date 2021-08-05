import SnowflakeCondon from 'snowflake-codon'
import _ from 'lodash';
import constants from '../utils/constants';

module.exports = function (sequelize, DataTypes) {
	const generator = new SnowflakeCondon();
	const parkingLot = sequelize.define('parkingLot', {
		id: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			field: 'name'
		},
		isAvailable: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			field: 'is_available'
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
		tableName: 'parking_lot',
		timestamps: true,
		paranoid: true
	});

	parkingLot.associate = function (models) {
		parkingLot.belongsTo(models.user, {
			onDelete: "CASCADE",
			as: 'createdBy',
			foreignKey: {
				name: 'createdById',
				field: 'created_by',
				allowNull: false
			}
		});
		parkingLot.belongsTo(models.category, {
			onDelete: "CASCADE",
			as: 'category',
			foreignKey: {
				name: 'categoryId',
				field: 'category_id',
				allowNull: false
			}
		});
		parkingLot.hasMany(models.access, {
			onDelete: "RESTRICT",
			as: 'assignedTo',
			foreignKey: {
				name: 'parkingLotId',
				field: 'parkingLot_id',
				allowNull: false
			}
		});
	};

	parkingLot.beforeValidate((com) => {
		com.id = generator.nextId();
		return com;
	});
	return parkingLot;
};