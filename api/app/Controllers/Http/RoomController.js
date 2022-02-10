'use strict'
const Room = use("App/Models/Room")
const moment = require('moment')
var ObjectId = require('mongodb').ObjectId;
const Helpers = use('Helpers')
const mkdirp = use('mkdirp')
var randomize = require('randomatic');
const fs = require('fs')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with rooms
 */
class RoomController {
  /**
   * Show a list of all rooms.
   * GET rooms
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    const data = (await Room.query().where({}).fetch()).toJSON()
    console.log('llega aqui');
    response.send(data)
  }

  /**
   * Render a form to be used for creating a new room.
   * GET rooms/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new room.
   * POST rooms
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, auth }) {
    const user = ((await auth.getUser()).toJSON())._id
    let body = request.all()
    body.user_id = user
    const room = (await Room.create(body)).toJSON()
    response.send(room)
  }

  /**
   * Display a single room.
   * GET rooms/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, response }) {
    const data = (await Room.query().find(params.id)).toJSON()
    response.send(data)
  }

  /**
   * Render a form to update an existing room.
   * GET rooms/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update room details.
   * PUT or PATCH rooms/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a room with id.
   * DELETE rooms/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = RoomController
