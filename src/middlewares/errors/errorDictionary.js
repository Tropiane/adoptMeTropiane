const errorDictionary = {
    USER_NOT_FOUND: {
      code: 404,
      message: 'Usuario no encontrado.',
    },
    ALL_FIELDS_REQUIRED: {
      code: 400,
      message: 'Todos los campos son obligatorios.',
    },
    PET_NOT_FOUND: {
      code: 404,
      message: 'Mascota no encontrada.',
    },
    INVALID_INPUT: {
      code: 400,
      message: 'Los datos ingresados no son válidos.',
    },
    UNAUTHORIZED: {
      code: 401,
      message: 'No tienes autorización para realizar esta acción.',
    },
    SERVER_ERROR: {
      code: 500,
      message: 'Error interno del servidor. Por favor, intenta nuevamente más tarde.',
    },
  };
  
  export default errorDictionary;
  