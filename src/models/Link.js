import { DataTypes } from 'sequelize';
import sequelize from '../config/db_pg.js';

const Link = sequelize.define(
  'Link',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    profile_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    platform: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [
          [
            //validación de aplicación flexible
            'spotify',
            'instagram',
            'youtube',
            'tiktok',
            'applemusic',
            'twitch',
            'custom',
          ],
        ],
      },
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: true,
      },
    },

    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    is_visible: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: 'links',

    timestamps: true,

    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);

export default Link;
