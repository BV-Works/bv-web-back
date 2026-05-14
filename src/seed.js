import { createUserService } from './services/users.service.js'
import { ROLES } from './constants/roles.constants.js'
import { User } from './models/index.js'
import { env } from './config/env.js'

const userExists = async (email) => {
  const user = await User.findOne({ where: { email } })
  return !!user
}

export const runSeed = async () => {
  try {
    const runSeed = env.seed.runSeed === 'true'

    if (!runSeed) {
      console.log('⛔ Seed skipped')
      return
    }

    console.log('🌱 Running seed...')

    // 👑 ADMIN
    const adminEmail = env.seed.adminEmail
    const adminPassword = env.seed.adminPassword

    if (!adminEmail || !adminPassword) {
      throw new Error('Missing SEED_ADMIN_EMAIL or SEED_ADMIN_PASSWORD')
    }

    if (!(await userExists(adminEmail))) {
      await createUserService({
        email: adminEmail,
        password: adminPassword,
        role: ROLES.ADMIN,
        is_active: true,
      })
      console.log('👑 Admin created')
    } else {
      console.log('👑 Admin already exists')
    }

    // 👤 USERS DEV ONLY (no depende de NODE_ENV ahora si quieres más control)
    if (env.nodeEnv !== 'production') {
      const testUsers = [
        { email: 'user1@test.com', password: '123456', role: ROLES.CUSTOMER },
        { email: 'artist@test.com', password: '123456', role: ROLES.ARTIST },
        { email: 'team@test.com', password: '123456', role: ROLES.TEAM },
      ]

      for (const u of testUsers) {
        if (!(await userExists(u.email))) {
          await createUserService({
            email: u.email,
            password: u.password,
            role: u.role,
            is_active: true,
          })
          console.log(`👤 Created ${u.email}`)
        }
      }
    }

    console.log('✅ Seed finished')
  } catch (err) {
    console.error('❌ Seed error:', err)
  }
}