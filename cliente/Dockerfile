# Usar una imagen oficial de Node.js como base.
# Elige una versión LTS (Long Term Support) que sea compatible con tu proyecto.
FROM node:18-alpine as builder

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar package.json y package-lock.json (o yarn.lock)
COPY package*.json ./

# Instalar las dependencias del proyecto
RUN npm install

# Copiar todo el código fuente del proyecto al directorio de trabajo
COPY . .

# Construir la aplicación para producción (Vite usa 'build')
RUN npm run build

# Etapa de producción: servir los archivos estáticos con un servidor ligero
FROM nginx:stable-alpine

# Copiar los archivos construidos de la etapa 'builder' al directorio de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar una configuración personalizada de Nginx (opcional pero recomendado)
# Si no tienes una, Nginx usará su configuración por defecto que podría funcionar para SPA.
# COPY nginx.conf /etc/nginx/conf.d/default.conf 

# Exponer el puerto 80 (Nginx escucha en el puerto 80 por defecto)
EXPOSE 80

# Comando para iniciar Nginx cuando el contenedor arranque
CMD ["nginx", "-g", "daemon off;"]
