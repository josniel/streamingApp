'use strict'

/*
|--------------------------------------------------------------------------
| UserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

const User = use("App/Models/User")
const Hash = use('Hash')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

const userData = [
  {
    _id: '5e90d6e6f75366526a680091',
    email: 'admin@streaming.com',
    password: 'streaming2021',
    full_name: 'Administrador del Sistema',
    roles: [1]
  }
]

class UserSeeder {
  async run () {
    for (let i of userData) {
      let user = await User.find(i._id)
      if (!user) {
        await User.create(i)
      }
      else {
        user.email = i.email
        user.password = i.password
        user.name = i.name
        user.lastName = i.lastName
        user.roles = i.roles
        user.country_id = i.country_id ? i.country_id : null
        await user.save()
      }
    }
    console.log('Finished User')
  }
}

module.exports = UserSeeder
