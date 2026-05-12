import { DataTypes } from "sequelize";
import sequelize from "../config/db_pg.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },

    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "TEAM",
      validate: {
        isIn: [["ADMIN", "TEAM", "CUSTOMER", "ARTIST"]],
      },
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "users",

    timestamps: true,

    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default User;