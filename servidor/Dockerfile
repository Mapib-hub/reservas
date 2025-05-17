# Usar una imagen oficial de Node.js como base.
# Elige una versión LTS que sea compatible con tu proyecto.
FROM node:18-alpine

# Crear y establecer el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json (o yarn.lock)
# El asterisco asegura que ambos sean copiados si existen
COPY package*.json ./

# Instalar las dependencias del proyecto
# Si tienes dependencias que solo son para desarrollo y no las necesitas en producción,
# podrías usar 'npm ci --only=production' después de copiar todo el código.
# Pero para 'npm run dev', usualmente necesitas todas.
RUN npm install

# Copiar todo el código fuente del backend al directorio de trabajo
COPY . .

# Exponer el puerto en el que tu aplicación backend se ejecuta
# Cambia el 3000 si tu backend usa un puerto diferente (revisa tu .env o código)
EXPOSE 3000

# Comando para iniciar la aplicación
# Usamos "npm run dev" como nos indicaste. Para producción, usualmente se usa "npm start".
CMD [ "npm", "run", "dev" ]