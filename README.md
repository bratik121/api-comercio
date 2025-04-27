# 📖 Descripción

API robusta para la gestión de comercios electrónicos, construida con **NestJS** implementando patrones avanzados de arquitectura. Ofrece:

- **Gestión completa de órdenes y productos**
- **Sistema de autenticación JWT** (Registro/Login)
- **Arquitectura CQRS** con separación de lecturas/escrituras
- **Dominio protegido** con **DDD** y **Arquitectura Hexagonal**
- **Doble base de datos** (**PostgreSQL** + **MongoDB**)
- **Eventos de dominio** manejados mediante colas con **RabbitMQ**

Esta API proporciona las herramientas necesarias para manejar eficazmente **autenticaciones seguras**, **operaciones comerciales** y **procesos de consulta** de alta demanda, todo dentro de un marco escalable y mantenible.

---

# 🚀 Requisitos para ejecución

Para poner en marcha el proyecto de forma rápida y segura, asegúrate de seguir estos pasos:

1. Levanta los servicios necesarios (bases de datos, colas, etc.) ejecutando:

    ```bash
    docker-compose up -d
    ```

2. Luego, inicia el servidor en modo desarrollo con:

    ```bash
    npm run dev
    ```

✅ ¡Y listo! Con esos dos pasos tendrás un entorno de desarrollo funcional.

---

# 🏗 Arquitectura y Tecnologías

Este proyecto fue diseñado aplicando **buenas prácticas de arquitectura de software**, optimizado para entornos modernos de desarrollo.

## ⚙️ Tecnologías principales

- **NestJS**: Framework principal para construir la API en Node.js.
- **TypeScript**: Tipado estático para mejorar la mantenibilidad.
- **PostgreSQL**: Base de datos relacional para almacenamiento de comandos (escrituras).
- **MongoDB**: Base de datos NoSQL orientada a consultas eficientes (lecturas).
- **RabbitMQ**: Gestión de eventos de dominio y mensajería entre microservicios.
- **Docker**: Contenerización de servicios para fácil despliegue.

---

# 🧩 Patrones Estructurales

| **CQRS** | **DDD** | **Hexagonal** |
|:--------:|:-------:|:-------------:|
| Separación clara entre comandos (escrituras) y consultas (lecturas) | Aplicación del Diseño Orientado al Dominio (DDD), identificando tres agregados principales: `User`, `Product`, `Order` | Estructura en capas donde el Core de negocio se mantiene aislado mediante puertos y adaptadores |

---

# 🗃️ Bases de Datos

| **PostgreSQL** (Escrituras) | **MongoDB** (Lecturas) |
|:---------------------------:|:----------------------:|
| Modelo relacional. Soporte de transacciones ACID. Ideal para comandos y consistencia de datos. | Modelo flexible. Rápido acceso y consultas. Ideal para proyecciones y vistas de lectura. |

---

