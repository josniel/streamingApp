"use strict";

const Helpers = use('Helpers')
const mkdirp = use('mkdirp')
const fs = require('fs')
var randomize = require('randomatic');
const User = use("App/Models/User")
const Role = use("App/Models/Role")
const { validate } = use("Validator")
const moment = require('moment')
var ObjectId = require('mongodb').ObjectId;


/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with users
 */
class UserController {
  /**
   * Show a list of all users.
   * GET users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {
    let users = await User.all();
    response.send(users);
  }

  async show({ request, response, auth }) {
    user_id = ((await auth.getUser()).toJSON())._id
    let modelo = {
      accion: 'show',
      modelo: 'User',
      unique_key: { field: '_id', value: user_id }
    }
    let data = await Crud.crud(modelo)
    response.send(data)
  }

  /**
   * Create/save a new user.
   * POST users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async register({ request, response }) {
    let requestAll = request.all()
    var dat = request.only(['dat'])
    dat = JSON.parse(dat.dat)
    const validation = await validate(dat, User.fieldValidationRules())
    if (validation.fails()) {
      response.unprocessableEntity(validation.messages())
    } else if (((await User.where({email: requestAll.email}).fetch()).toJSON()).length) {
      response.unprocessableEntity([{
        message: 'Correo ya registrado en el sistema!'
      }])
    } else {
      let body = { ...dat }
      const rol = body.rols
      body.roles = [rol]
      delete body.rols
      const user = await User.create(body)
      response.send(user)
    }
  }
  async updateProfile({ request, response, params }) {
    var dat = request.only(['dat'])
    dat = JSON.parse(dat.dat)
    let body = { ...dat }
    delete body.cantidadArchivosDni
    if (body.specialty_id) {
      body.specialty_id = new ObjectId(body.specialty_id)
    }
    const user = await User.query().where({ _id: params.id }).update(body)
    
    if (dat.cantidadArchivosDni && dat.cantidadArchivosDni > 0) {
      for (let i = 0; i < dat.cantidadArchivosDni; i++) {
        const idFiles = request.file('dniFiles_' + i, {
          types: ['image']
        })
        if (Helpers.appRoot('storage/uploads/dniFiles')) {
          await idFiles.move(Helpers.appRoot('storage/uploads/dniFiles'), {
            name: i + 'dniFile' + params.id,
            overwrite: true
          })
        } else {
          mkdirp.sync(`${__dirname}/storage/Excel`) 
        }
      }
    }
    const profilePic = request.file('profileFile', {
      types: ['image']
    })
    if (profilePic !== null) {
      if (Helpers.appRoot('storage/uploads/profile')) {
        await profilePic.move(Helpers.appRoot('storage/uploads/profile'), {
          name: 'profile' + params.id,
          overwrite: true
        })
      } else {
        mkdirp.sync(`${__dirname}/storage/Excel`)
      }
    }
    const certificate = request.file('certificate')
    if (certificate !== null) {
      if (Helpers.appRoot('storage/uploads/certificate')) {
        await certificate.move(Helpers.appRoot('storage/uploads/certificate'), {
          name: 'certificate' + params.id,
          overwrite: true
        })
      } else {
        mkdirp.sync(`${__dirname}/storage/Excel`)
      }
    }
    const collegeDegree = request.file('collegeDegree')
    if (collegeDegree !== null) {
      if (Helpers.appRoot('storage/uploads/collegeDegree')) {
        await collegeDegree.move(Helpers.appRoot('storage/uploads/collegeDegree'), {
          name: 'collegeDegree' + params.id,
          overwrite: true
        })
      } else {
        mkdirp.sync(`${__dirname}/storage/Excel`)
      }
    }
    response.send(user)
  }

  async validateEmail({ request, response, params }) {
    if (((await User.where({email: params.email}).fetch()).toJSON()).length) {
      response.unprocessableEntity([{
        message: 'Correo ya registrado en el sistema!',
        error: true
      }])
    } else {
      response.send({error: false})
    }
  }

  async allUser({ request, response, auth }) {
    let allUsers = (await User.query().where({}).fetch()).toJSON()
    let users = allUsers.filter(v => v.email !== 'admin@triyus.com')
    let formatearFecha = users.map(v => {
      return {
        ...v,
        fechaCreacion: moment(v.created_at).format('DD/MM/YYYY')
      }
    })
    response.send(formatearFecha)
  }

  async userInfo({ request, response, auth }) {
    const user = (await auth.getUser()).toJSON()
    response.send(user)
  }

  async doctorById({ params, response }) {
    const user = await User.query().with('specialty').find(params.id)
    response.send(user)
  }
  async userById({ params, response }) {
    const user = (await User.query().find(params.id)).toJSON()
    response.send(user)
  }

  /* async userByRol({ request, auth, response }) {
    let rol = request.all()
    const logueado = (await auth.getUser()).toJSON()
    let user
    if (logueado.roles[0] === 2) {
      user = (await User.query().where({roles: rol.rol, city: logueado.city}).fetch()).toJSON()
    } else {
      user = (await User.query().where({roles: rol.rol}).fetch()).toJSON()
    }
    for (let i = 0; i < user.length; i++) {
      let ciudad = (await City.query().where('_id', user[i].city).first()).toJSON()
      let pais = (await Country.query().where('_id', user[i].country).first()).toJSON()
      user[i].pais = pais.name
      user[i].ciudad = ciudad.name
      if (user[i].roles[0] === 3) {
        var categoriasInfo = []
        for (let c = 0; c < user[i].categorias.length; c++) {
          let categoria = (await Categorias.query().where('_id', user[i].categorias[c]).first()).toJSON()
          categoriasInfo.push(categoria)
        }
        user[i].categoriasInfo = categoriasInfo
      }
    }
    response.send(user)
  } */

  async userByStatus({ request, params, response }) {
    let rol = request.all()
    const user = (await User.query().where({roles: rol.rol, status: 0}).fetch()).toJSON()
    response.send(user)
  }

  async userEnable({ params, request, response }) {
    let dat = request.all()
    let modificar = await User.query().where('_id', params.id).update({enable: dat.enable})
    response.send(modificar)
  }

  async userStatus({ params, request, response }) {
    let dat = request.all()
    let modificar = await User.query().where('_id', params.id).update({status: dat.status})
    response.send(modificar)
  }


  async destroy({ params, request, response }) {
    const { id } = params;
    const user = await User.find(id);
    await user.delete();
  }

  async login({ auth, request }) {
    const { email, password } = request.all();
    let token = await auth.attempt(email, password)
    const user = (await User.findBy('email', email)).toJSON()
    let isUser = false
    token.roles = user.roles.map(roleMap => {
      if (roleMap === 3) {
        isUser = true
      }
      return roleMap
    })
    let userRoles = await Role.whereIn('id', token.roles).fetch()
    let permissions = userRoles.toJSON()
    token.permissions = []
    permissions.forEach(element => {
      element.permissions.forEach(element2 => {
        token.permissions.push(element2)
      })
    })
    
    token.full_name = user.full_name
    token.last_name = user.last_name
    token.enable = user.enable
    token.email = user.email
    token.verify = user.verify
    let data = {}
    data.TRI_SESSION_INFO = token
    return data
  }

  showUser({ auth, params }) {
    if (auth.user.id !== Number(params.id)) {
      return "You cannot see someone else's profile";
    }
    return auth.user;
  }

    async userData({
      response,
      auth
    }) {
      let user = (await auth.getUser()).toJSON()
      for (let x = 0; x < user.roles.length; x++) {
        var s  = [user]
        const element = user.roles[x];
         if (element == 3) {
          /*  var s = await Country.query().where({
             _id: user.country
           }).with('user').fetch() */
         }
        if (element == 4) {
           var s = await Shop.query().where({
             user_id: user._id
           }).with('user').fetch()
        }
        if (element == 5) {
          var s = await Carrier.query().where({
            user_id: user._id
          }).with('user').fetch()
        }
      }
      response.send(s)
    }

    async editarPerfil ({ params, request, response }) {
      let body = request.only(User.fillable)
      await User.query().where({_id: params.id}).update(body)
      response.send(body)
    }

    async updatedata ({ params, request, response }) {
      let body = request.only(User.fillable)
      let verificacion = body.cambioSoloClave
      let cambioClave = body.cambioClave
      let contraseña = body.password
      delete body.password
      delete body.cambioSoloClave
      if (verificacion) {
        const editarcontraseña = await User.find(params.id)
        editarcontraseña.password = contraseña
        await editarcontraseña.save()
      } else {
        body.status = 0
        await User.query().where({_id: params.id}).update(body)
        if (cambioClave) {
          const editarcontraseña = await User.find(params.id)
          editarcontraseña.password = contraseña
          await editarcontraseña.save()
        }
      }
      response.send(body)
    }

    async getUserBySpecialty ({ response }) {
      const specialties = (await Specialty.query().where({}).with('users').fetch()).toJSON()
      const data = specialties.filter(res => res.users.length > 0)
      response.send(data)
    }
}

module.exports = UserController;
