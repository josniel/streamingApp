'use strict'

/*
|--------------------------------------------------------------------------
| Routes
  Existen 2 grupos de rutas: Las que necesitan autenticación del usuario y las que no. TOMAR MUY EN CUENTA ESTO
  Dentro del grupo de las que necesitan autenticación se debe especificar el middleware para verificar si el
  usuario(autenticado) tiene el permiso para acceder a esa ruta. Ejemplo: .middleware('verifyPermission:1')
  El número 1 indica el permiso que debe tener para acceder a esa ruta
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return {
    greeting: 'Hello world in JSON'
  }
})

const addPrefixToGroup = group => {
  // Grupo para rutas con prefijo /api/
  group.prefix("api");
  return group;
};


addPrefixToGroup(
  Route.group(() => {
    // Insertar rutas sin protección de autenticación aquí
    Route.post("login", "UserController.login");
    Route.post("register", "UserController.register")
    Route.get("validate_email/:email", "UserController.validateEmail")
    
    Route.get('perfil_img/:file', 'UploadController.getFileByDirectoryProfile')
    Route.get('file/:id', 'UploadController.getFile')
    Route.get('specialties', 'SpecialtyController.index')
    Route.get('getRooms', 'RoomController.index')
  })
  );
  
  addPrefixToGroup(
    Route.group(() => {
      // Insertar rutas con protección de autenticación aquí
      
      
      
      
    Route.get("user_info", "UserController.userInfo") // metodo para obtener informacion del usuario que esta logueado
    

    Route.post('setRoom', 'RoomController.store')
    Route.get('getRoomById/:id', 'RoomController.show')

    
    
    
    
  }).middleware("auth")
  );
  