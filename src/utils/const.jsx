// Aqui se dejaran las constantes para la aplicación


// Contantes para los roles de usuario

export const ROLE = {
    ADMIN: 1,
    USER: 2
}

/* --------------------------------------------- */

// Estas son las rutas de los ENDPOINTS O PATH de las APIs
export const ENDPOINTS = {
    // EndPoints del LOGIN
    LOGIN_AUTH: 'http://10.208.31.18:3000/api/login',
    USERS_ACTIVE: 'http://10.208.31.18:3000/api/users/1',
    
    // EndPoints para los Tickets
    CREATE_TICKET: "/ticket/ticket/",
    GET_TICKETS: "/ticket/tickets/",
    GET_FILTERS: "/ticket/filters/",
    UPDATE_TICKET: "/ticket/update/",
    
    // EndPoint para la Categoría del Ticket
    GET_CATEGORIES: "/category/categories/",
    // EndPoint para el estado de los Tickets
    GET_STATES: "/state/states/",
    // EndPoint para el usuario
    GET_USERS: "/user/users/",
    GET_USERS_BY_ROLE: "/user/users/"

}

/* --------------------------------------------- */

// Estas son las rutas de la navegación
export const ROUTES = {
    MAIN:"/",
    // Rutas Publicas
    LOGIN: "/login",
    SIGNUP: "/signup",

    // Rutas Privadas
    HOME: "/home",
    NOTICES: "/notices",
    SETTINGS: "/settings",
    TICKETS: "/ticket",

    // Rutas Alternativas
    ROUTE_404: "/404",
    REDIRECT: "*"

}

/* ---------------------------------------------- */

// Estas son los estados posibles de un ticket

export const STATES = {
    REQUESTED: 1,
    ASSIGNED: 2,
    FINISHED: 3,
    CANCELED: 4, 
    REFUSED: 5
}