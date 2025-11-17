📘 ANCR – Sitio Oficial de la Asociación Norte de Costa Rica
Proyecto Web · Iglesia Adventista del Séptimo Día

Este es el código del sitio web oficial de la Asociación Norte de Costa Rica (ANCR), diseñado para ofrecer noticias, recursos, eventos y herramientas internas para el Ministerio Joven y otros departamentos de la iglesia.

El proyecto está construido con una arquitectura moderna basada en:

React + Vite (Frontend rápido y modular)

Tailwind CSS (Estilos responsivos y diseño limpio)

Supabase (Base de datos, autenticación y almacenamiento)

TypeScript (Robustez y tipado estático)

🖥️ Características principales
✔️ Diseño institucional profesional

Inspirado en páginas oficiales de la Iglesia Adventista (UMCH, Unión Mexicana, Unión Chilena).

✔️ Hero dinámico + Banner informativo

Secciones configuradas con colores institucionales (azul y dorado).

✔️ Noticias en tiempo real

Cargadas desde Supabase usando consultas directas.

✔️ Eventos del Ministerio Joven

Mostrados cronológicamente desde la base de datos.

✔️ Código modular y fácil de extender

Componentes separados: Navbar, Footer, Home, Recursos, Noticias, Eventos.

✔️ Preparado para autenticación

Lista para integrarse con Supabase Auth (email, Google, etc.).

🏗️ Tecnologías
Tecnología	Uso
React + Vite	SPA moderna y rápida
TypeScript	Mejores tipos y seguridad
Tailwind CSS	Estilos utilitarios
Supabase	BD, API y autenticación
PostCSS	Estilos procesados
Vercel / Netlify	(Opcional) despliegue del frontend
📁 Estructura del proyecto
ancr-frontend/
 ├── public/
 ├── src/
 │   ├── assets/
 │   ├── components/
 │   │   ├── Navbar.tsx
 │   │   └── Footer.tsx
 │   ├── pages/
 │   │   ├── Home.tsx
 │   │   ├── Noticias.tsx
 │   │   ├── Eventos.tsx
 │   │   ├── Recursos.tsx
 │   │   └── NuestraIglesia.tsx
 │   ├── supabaseClient.ts
 │   ├── main.tsx
 │   └── App.tsx
 ├── .env
 ├── package.json
 ├── tailwind.config.js
 ├── vite.config.ts
 └── README.md

⚙️ Configuración del entorno
1. Instalar dependencias:
npm install

2. Crear archivo .env en la raíz del frontend:
VITE_SUPABASE_URL=https://TUPROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anon_publica


⚠️ El archivo .env está en .gitignore, por lo que NO se subirá a GitHub para proteger tus claves.

3. Ejecutar en modo desarrollo:
npm run dev


Aplicación disponible en:

http://localhost:5173

🗄️ Base de datos en Supabase
Tablas principales
news
create table news (
  id bigint generated always as identity primary key,
  title text not null,
  summary text not null,
  created_at timestamp with time zone default now()
);

events
create table events (
  id bigint generated always as identity primary key,
  title text not null,
  date date not null,
  place text
);

🔌 Conexión con Supabase

El archivo supabaseClient.ts crea el cliente global:

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseKey);

📰 Cargar noticias (ejemplo)
const { data: news } = await supabase
  .from("news")
  .select("*")
  .order("created_at", { ascending: false });

☁️ Despliegue recomendado
✔️ Frontend → Vercel

Rápido, gratuito y optimizado para Vite.

Pasos:

Conectar el repo de GitHub

Crear variables de entorno en el panel de Vercel

Deploy automático con cada push

🛠️ Próximas funcionalidades sugeridas

✔ Autenticación con Supabase Auth

✔ Panel administrativo (Dashboard)

✔ CRUD de noticias y eventos

✔ Subida de imágenes (Supabase Storage)

✔ Páginas de departamentos y clubes

✔ Sistema de roles: Administrador / Líder / Miembro

📄 Licencia

Proyecto para fines educativos y misioneros.
Cualquier iglesia o ministerio puede usarlo y adaptarlo.

🙌 Autor

Desarrollado por Kemuel Mayorga Hernández
Para la Asociación Norte de Costa Rica
Iglesia Adventista del Séptimo Día.
