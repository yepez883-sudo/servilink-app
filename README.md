# ServiLink — MVP

Plataforma que conecta clientes con técnicos/instaladores verificados y proveedores.

## Stack
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Lucide React** (íconos)

## Instalación local

```bash
# 1. Instalar dependencias
npm install

# 2. Correr en modo desarrollo
npm run dev

# 3. Abrir en el navegador
http://localhost:3000
```

## Deploy en Vercel (gratis)

1. Crear cuenta en [vercel.com](https://vercel.com)
2. Conectar con GitHub y subir esta carpeta
3. Vercel detecta Next.js automáticamente → click en **Deploy**
4. Tu app queda en `https://tu-proyecto.vercel.app`

## Páginas

| Ruta | Descripción |
|------|-------------|
| `/` | Landing page pública |
| `/auth/login` | Login con selector de rol |
| `/auth/registro` | Registro con flujo KYC paso a paso |
| `/cliente` | Panel del cliente: buscar, filtrar, firmar conformidad, calificar |
| `/tecnico` | Panel del técnico: dashboard, visibilidad, boosts, KYC |
| `/proveedor` | Panel del proveedor: planes, publicar ofertas, estadísticas |
| `/admin` | Panel de plataforma: ingresos, KYC pendientes, boosts |

## Modelo de negocio implementado

- ✅ 0% comisión sobre servicios (pago directo entre partes)
- ✅ Firma de conformidad (exime responsabilidad a ServiLink)
- ✅ Calificaciones verificadas (solo clientes que contrataron)
- ✅ Boosts de visibilidad para técnicos (1x gratis → 2x/5x/10x pago por día)
- ✅ Planes de proveedor: Starter (gratis, 5 ofertas) / Pro / Enterprise
- ✅ KYC completo: DNI, selfie, certificación de oficio

## Próximos pasos para producción

1. **Base de datos**: conectar Supabase (ver `lib/data.ts` para reemplazar con queries reales)
2. **Auth**: Supabase Auth o NextAuth.js
3. **Pagos**: Mercado Pago SDK para cobrar boosts y suscripciones
4. **KYC real**: integrar con servicio de validación (ej: MetaMap, Truora)
5. **Emails**: Resend para notificaciones transaccionales
6. **Maps**: Google Maps API para geolocalización de técnicos
