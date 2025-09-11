Explicación del Proyecto FutbolYa.WebAPI

  Tu proyecto es una API REST para la gestión de canchas de fútbol y reservas. Te explico la estructura y cómo funciona:

  Estructura General

  Es una Web API de ASP.NET Core 6 con:
  - Base de datos: SQL Server con Entity Framework Core
  - Autenticación: JWT (JSON Web Tokens)
  - Arquitectura: Patrón Repository con Controllers + Models
  - CORS: Configurado para React (puerto 3000)

  Componentes Principales

  1. Program.cs (línea 106)

  Archivo de configuración principal que configura:
  - Base de datos SQL Server
  - Autenticación JWT
  - CORS para frontend React
  - Swagger para documentación API
  - Middleware de autorización

  2. Modelos/Entidades (AppDbContext.cs:6-65)

  - Usuario: Jugadores, establecimientos, administradores
  - Cancha: Canchas de fútbol con precios y horarios
  - Reserva: Reservas de canchas con jugadores
  - Partido: Partidos organizados
  - Calificacion/Rendimientos: Sistema de evaluación
  - Mensaje: Sistema de mensajería

  3. Controladores (API Endpoints)

  AuthController.cs: Autenticación
  - /api/auth/registro - Registrar usuarios
  - /api/auth/login - Iniciar sesión (genera JWT)

  CanchasController.cs: Gestión de canchas
  - POST /api/canchas - Crear cancha (solo establecimientos)
  - GET /api/canchas/disponibles - Listar canchas públicas
  - PUT /api/canchas/{id} - Editar cancha propia
  - GET /api/canchas/mis-canchas - Ver canchas del establecimiento

  ReservasController.cs: Sistema de reservas
  - POST /api/reservas - Crear reserva
  - GET /api/reservas/mis - Ver reservas propias
  - POST /api/reservas/{id}/unirse - Unirse a reserva
  - GET /api/reservas/disponibles - Ver reservas con cupos
  - DELETE /api/reservas/{id}/salir - Salir de reserva

  PartidosController.cs: Organizar partidos
  - GET /api/partidos - Listar partidos
  - POST /api/partidos - Crear partido
  - POST /api/partidos/{id}/inscribirse - Inscribirse a partido

  Roles de Usuario

  1. jugador (por defecto): Puede crear reservas y unirse a partidos
  2. establecimiento: Gestiona canchas y ve reservas
  3. administrador: Acceso completo al sistema

  Flujo de Funcionamiento

  1. Registro/Login: Usuario se registra → Recibe JWT token
  2. Gestión de Canchas: Establecimientos crean y gestionan sus canchas
  3. Reservas: Jugadores reservan canchas → Se unen otros jugadores
  4. Partidos: Organización de eventos deportivos

  Conexiones entre Componentes

  - Usuario → puede tener múltiples Reservas
  - Cancha → pertenece a un Usuario (establecimiento)
  - Reserva → vincula Cancha + múltiples Usuarios (jugadores)
  - Partido → tiene Organizador (Usuario) + Jugadores (Usuarios)

  Funcionalidades Clave

  - Sistema de capacidades por tipo de cancha (F5:10, F7:14, F11:22 jugadores)
  - Validación de horarios y disponibilidad
  - Control de acceso basado en roles JWT
  - Gestión de precios variables (base, nocturno, fin de semana)

  ¿Hay alguna parte específica que querés que te explique más detalladamente?