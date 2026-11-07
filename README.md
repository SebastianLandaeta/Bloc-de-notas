# Notas

Aplicación SPA de bloc de notas construida con React, TypeScript y Vite. Las notas se guardan en `localStorage` del navegador y no se envían a ningún servidor.

## Requisitos

- Node.js 24 o posterior
- pnpm 12

## Comandos

```sh
pnpm install
pnpm dev
pnpm test
pnpm lint
pnpm build
```

## Funcionalidades

- Crear, editar y eliminar notas con confirmación.
- Guardar título, contenido y fechas ISO de creación y modificación.
- Buscar por título o contenido y ordenar por nombre o fecha de creación.
- Mantener los datos localmente entre recargas del navegador.

El contenido se almacena únicamente en el dispositivo y perfil del navegador actuales. Borrar los datos del sitio o cambiar de dispositivo puede eliminar el acceso a las notas.
