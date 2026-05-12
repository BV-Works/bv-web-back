import Profile from '../models/Profile.js';
import Link from '../models/Link.js';
import { errorResponse } from '../utils/apiResponse.js';

// PROFILE OWNERSHIP (para rutas que incluyen :id, ej: GET /profiles/:id)

export const checkProfileOwnership = async (req, res, next) => {
  try {
    const profileId = req.params?.id;
    const userId = req.user?.id;

    if (!profileId || !userId) {
      return res
        .status(400)
        .json(errorResponse('Missing data', 'BAD_REQUEST'));
    }

    const profile = await Profile.findByPk(profileId);

    if (!profile) {
      return res
        .status(404)
        .json(errorResponse('Profile not found', 'PROFILE_NOT_FOUND'));
    }

    // ADMIN bypass
    if (req.user.role === 'ADMIN') {
      req.profile = profile;
      return next();
    }

    if (profile.user_id !== userId) {
      return res
        .status(403)
        .json(errorResponse('Not owner of profile', 'FORBIDDEN_OWNERSHIP'));
    }

    req.profile = profile;
    return next();
  } catch (err) {
    return res
      .status(500)
      .json(errorResponse('Ownership check failed', 'OWNERSHIP_ERROR'));
  }
};

// LINK OWNERSHIP (para rutas que incluyen ambos :id y :linkId, ej: GET /profiles/:id/links/:linkId)

export const checkLinkOwnership = async (req, res, next) => {
  try {
    const profileId = req.params?.id;
    const linkId = req.params?.linkId;
    const userId = req.user?.id;

    if (!profileId || !linkId || !userId) {
      return res
        .status(400)
        .json(errorResponse('Missing data', 'BAD_REQUEST'));
    }

    const profile = await Profile.findByPk(profileId);
    if (!profile) {
      return res
        .status(404)
        .json(errorResponse('Profile not found', 'PROFILE_NOT_FOUND'));
    }

    const link = await Link.findByPk(linkId);
    if (!link) {
      return res
        .status(404)
        .json(errorResponse('Link not found', 'LINK_NOT_FOUND'));
    }

    // ADMIN bypass
    if (req.user.role === 'ADMIN') {
      req.profile = profile;
      req.link = link;
      return next();
    }

    // validamos contra el perfil real cargado
    if (link.profile_id !== profile.id) {
      return res
        .status(403)
        .json(errorResponse('Not owner of link', 'FORBIDDEN_OWNERSHIP'));
    }

    req.profile = profile;
    req.link = link;

    return next();
  } catch (err) {
    return res
      .status(500)
      .json(errorResponse('Ownership check failed', 'OWNERSHIP_ERROR'));
  }
};