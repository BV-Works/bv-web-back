import { DataTypes } from 'sequelize';
import sequelize from '../config/db_pg.js';

const Profile = sequelize.define(
  'Profile',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    user_id: {
      type: DataTypes.UUID,
      allowNull: true,
      unique: true,
    },

    profile_type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['TEAM', 'ARTIST']],
      },
    },

    display_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    bio_web: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    bio_slug: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    avatar_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    secondary_image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    is_public: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },

    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: 'profiles',

    timestamps: true,

    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);

export default Profile;
