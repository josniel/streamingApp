'use strict'
var ObjectId = require('mongodb').ObjectId;
/*
|--------------------------------------------------------------------------
| SpecialtySeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Specialty = use("App/Models/Specialty")
const specialtyData = [
  {
    id: 1,
    name: 'Medicina General',
  },
  {
    id: 2,
    name: 'Medicina Interna',
  },
  {
    id: 3,
    name: 'Emergencias',
  },
  {
    id: 4,
    name: 'Cardiología',
  },
  {
    id: 5,
    name: 'Pediatría',
  },
  {
    id: 6,
    name: 'Ginecología',
  },
  {
    id: 7,
    name: 'Obstetricia',
  },
  {
    id: 8,
    name: 'Nutrición',
  },
  {
    id: 9,
    name: 'Psicología',
  },
  {
    id: 10,
    name: 'Fisiatría',
  },
  

]

class SpecialtySeeder {
  async run () {
    for (let i in specialtyData) {
      let specialty = await Specialty.findBy('_id', specialtyData[i].id)
      if (!specialty) {
        await Specialty.create(specialtyData[i])
      } else {
        specialty.name = specialtyData[i].name
        await specialty.save()
      }
    }
    console.log('Finished Specialty')
  }
}

module.exports = SpecialtySeeder
