import {
  getUsersService,
  getUserByIdService,
  createUserService,
  updateUserService,
  deleteUserService,
} from '../services/users.service.js';
import { successResponse, paginatedResponse } from '../utils/apiResponse.js';

// GET /users (ADMIN)
export const getUsers = async (req, res, next) => {
  try {
    const result = await getUsersService(req.query);

    res.json(paginatedResponse(result.rows, result.meta));
  } catch (err) {
    next(err);
  }
};

// GET /users/:id (ADMIN)
export const getUserById = async (req, res, next) => {
  try {
    const user = await getUserByIdService(req.params.id);
    res.json(successResponse(user));
  } catch (err) {
    next(err);
  }
};

// POST /users (ADMIN)
export const createUser = async (req, res, next) => {
  try {
    const user = await createUserService({
      ...req.body,
      sendInvitation: true,
    });
    res.status(201).json(successResponse(user));
  } catch (err) {
    next(err);
  }
};

// PUT /users/:id (ADMIN)
export const updateUser = async (req, res, next) => {
  try {
    const user = await updateUserService(req.params.id, req.body);
    res.json(successResponse(user));
  } catch (err) {
    next(err);
  }
};

// DELETE /users/:id (ADMIN)
export const deleteUser = async (req, res, next) => {
  try {
    await deleteUserService(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
