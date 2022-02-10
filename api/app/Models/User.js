'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

class User extends Model {
  /* static get objectIDs () {
    return ['country', 'city', '_id'];
  } */
  static get fillable() {
    return ['email', 'full_name', 'password']
  }
  static fieldValidationRules() {
    const rulesUser = {
      full_name: 'string',
      password:'required|string',
      rols: 'number',
    }
    return rulesUser
  }
  static boot() {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
  }

  /* specialty () {
    return this.hasOne('App/Models/Specialty', 'specialty_id', '_id')
  } */

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens() {
    return this.hasMany('App/Models/Token')
  }
  // static get objectIDs () { return [ 'country_id','_id', 'city_id' ] }
}

module.exports = User
