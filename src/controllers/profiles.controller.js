import {
  getProfilesService,
  getProfileByIdService,
  getProfileBySlugService,
  getMyProfileService,
  createProfileService,
  updateProfileService,
  deleteProfileService,
  getLinksByProfileService,
  createLinkService,
  updateLinkService,
  deleteLinkService,
} from '../services/profiles.service.js';
import { successResponse } from '../utils/apiResponse.js';

// GET /profiles (PUBLIC)
export const getProfiles = async (req, res, next) => {
  try {
    const data = await getProfilesService(req.query);
    res.json(successResponse(data));
  } catch (err) {
    next(err);
  }
};

// GET /profiles/:id (ADMIN)
export const getProfileById = async (req, res, next) => {
  try {
    const profile = await getProfileByIdService(req.params.id);
    res.json(successResponse(profile));
  } catch (err) {
    next(err);
  }
};

// GET /profiles/public/:slug (PUBLIC)
export const getProfileBySlug = async (req, res, next) => {
  try {
    const profile = await getProfileBySlugService(req.params.slug);
    res.json(successResponse(profile));
  } catch (err) {
    next(err);
  }
};

// GET /profiles/me (AUTH)
export const getMyProfile = async (req, res, next) => {
  try {
    const profile = await getMyProfileService(req.user.id);
    res.json(successResponse(profile));
  } catch (err) {
    next(err);
  }
};

// POST /profiles (ADMIN)
export const createProfile = async (req, res, next) => {
  try {
    const profile = await createProfileService(req.body);
    res.status(201).json(successResponse(profile));
  } catch (err) {
    next(err);
  }
};

// PUT /profiles/:id (ADMIN or OWNER via middleware)
export const updateProfile = async (req, res, next) => {
  try {
    const profile = await updateProfileService(req.profile, req.body);
    res.json(successResponse(profile));
  } catch (err) {
    next(err);
  }
};

// DELETE /profiles/:id
export const deleteProfile = async (req, res, next) => {
  try {
    await deleteProfileService(req.profile);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

// LINKS

// GET /profiles/:id/links
export const getLinksByProfile = async (req, res, next) => {
  try {
    const links = await getLinksByProfileService(req.params.id);
    res.json(successResponse(links));
  } catch (err) {
    next(err);
  }
};

// POST /profiles/:id/links
export const createLink = async (req, res, next) => {
  try {
    const link = await createLinkService(req.params.id, req.body);
    res.status(201).json(successResponse(link));
  } catch (err) {
    next(err);
  }
};

// PUT /profiles/:id/links/:linkId
export const updateLink = async (req, res, next) => {
  try {
    const link = await updateLinkService(req.link, req.body);
    res.json(successResponse(link));
  } catch (err) {
    next(err);
  }
};

// DELETE /profiles/:id/links/:linkId
export const deleteLink = async (req, res, next) => {
  try {
    await deleteLinkService(req.link);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
