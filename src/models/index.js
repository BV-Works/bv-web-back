import User from './User.js';
import Profile from './Profile.js';
import Link from './Link.js';

/*
|--------------------------------------------------------------------------
| USER ↔ PROFILE
|--------------------------------------------------------------------------
*/

User.hasOne(Profile, {
  foreignKey: 'user_id',
  as: 'profile',
  onDelete: 'CASCADE',
});

Profile.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

/*
|--------------------------------------------------------------------------
| PROFILE ↔ LINKS
|--------------------------------------------------------------------------
*/

Profile.hasMany(Link, {
  foreignKey: 'profile_id',
  as: 'links',
  onDelete: 'CASCADE',
});

Link.belongsTo(Profile, {
  foreignKey: 'profile_id',
  as: 'profile',
});

export { User, Profile, Link };
