// import { Router } from 'express';

// import {
//   getProfiles,
//   getProfileById,
//   getProfileBySlug,
//   getMyProfile,
//   createProfile,
//   updateProfile,
//   deleteProfile,
//   getLinksByProfile,
//   createLink,
//   updateLink,
//   deleteLink,
// } from '../controllers/profiles.controller.js';

// const router = Router();

// // PROFILES


// // GET /profiles
// // filtros:
// // ?type=TEAM | ARTIST
// // ?is_public=true
// // ?limit=10&page=1
// router.get('/', getProfiles);

// // GET público (landing pages)
// router.get('/public/:slug', getProfileBySlug);

// // GET perfil del usuario autenticado
// router.get('/me', getMyProfile);

// // GET admin / edición por ID
// router.get('/:id', getProfileById);

// // POST /profiles
// router.post('/', createProfile);

// // PUT /profiles/:id
// router.put('/:id', updateProfile);

// // DELETE /profiles/:id
// router.delete('/:id', deleteProfile);


// // LINKS (subrecurso de profile)


// // GET links de un profile
// router.get('/:id/links', getLinksByProfile);

// // POST link
// router.post('/:id/links', createLink);

// // PUT link
// router.put('/:id/links/:linkId', updateLink);

// // DELETE link
// router.delete('/:id/links/:linkId', deleteLink);

// export default router;