# Sistema de Gestão de Veículos e Reservas - Estrutura do Projeto

## Estrutura de Pastas

```
src/
├── domain/
│   ├── entities/
│   │   ├── Entity.ts
│   │   ├── Vehicle.ts
│   │   ├── Reservation.ts
│   │   └── User.ts
│   ├── value-objects/
│   │   ├── VehicleClassification.ts
│   │   ├── Money.ts
│   │   ├── TimeRange.ts
│   │   ├── Email.ts
│   │   ├── Password.ts
│   │   └── AuthToken.ts
│   ├── services/
│   │   ├── VehicleDomainService.ts
│   │   ├── ReservationDomainService.ts
│   │   └── UserDomainService.ts
│   ├── aggregates/
│   │   └── ReservationAggregate.ts
│   ├── events/
│   │   ├── DomainEventPublisher.ts
│   │   ├── ReservationCreatedEvent.ts
│   │   └── ReservationCanceledEvent.ts
│   ├── interfaces/
│   │   ├── IVehicleRepository.ts
│   │   ├── IReservationRepository.ts
│   │   └── IUserRepository.ts
│   ├── errors/
│   │   └── ValidationError.ts
│   └── shared/
│       └── ValueObject.ts
├── application/
│   ├── services/
│   │   ├── VehicleApplicationService.ts
│   │   ├── ReservationApplicationService.ts
│   │   ├── UserApplicationService.ts
│   │   └── AuthenticationService.ts
│   ├── dtos/
│   │   ├── VehicleDTO.ts
│   │   ├── ReservationDTO.ts
│   │   ├── UserDTO.ts
│   │   └── AuthDTO.ts
│   ├── interfaces/
│   │   └── IPaymentGateway.ts
│   └── handlers/
│       └── ReservationCreatedHandler.ts
├── infrastructure/
│   ├── repositories/
│   │   ├── PrismaVehicleRepository.ts
│   │   ├── PrismaReservationRepository.ts
│   │   └── PrismaUserRepository.ts
│   ├── database/
│   │   └── prisma/
│   │       └── schema.prisma
│   ├── logging/
│   │   └── Logger.ts
│   ├── external-services/
│   │   └── StripePaymentGateway.ts
│   └── mappers/
│       ├── VehicleMapper.ts
│       ├── ReservationMapper.ts
│       └── UserMapper.ts
└── presentation/
    ├── controllers/
    │   ├── VehicleController.ts
    │   ├── ReservationController.ts
    │   ├── UserController.ts
    │   └── AuthController.ts
    ├── middlewares/
    │   ├── authentication.ts
    │   └── validation.ts
    ├── routes/
    │   ├── vehicleRoutes.ts
    │   ├── reservationRoutes.ts
    │   ├── userRoutes.ts
    │   └── authRoutes.ts
    └── schemas/
        ├── vehicleSchemas.ts
        ├── reservationSchemas.ts
        ├── userSchemas.ts
        └── authSchemas.ts

frontend/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   ├── vehicles/
│   │   ├── reservations/
│   │   └── ui/
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useApi.ts
│   ├── services/
│   │   └── api.ts
│   └── pages/
│       ├── auth/
│       ├── vehicles/
│       └── reservations/
```

## Padrões Implementados
- Domain-Driven Design (DDD)
- Clean Architecture
- SOLID Principles
- Repository Pattern
- Factory Pattern
- Service Pattern
- Value Objects
- Aggregates
- Domain Events