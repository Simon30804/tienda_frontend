# Usamos una imagen ligera de Node.js
FROM node:20-alpine

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos los archivos de dependencias primero (para aprovechar el caché de Docker)
COPY package.json package-lock.json* ./

# Instalamos las dependencias forzando la resolución de versiones (React 19 + MUI)
RUN npm install --legacy-peer-deps

# Copiamos el resto del código de tu web
COPY . .

# Construimos la aplicación Next.js para producción
RUN npm run build

# Exponemos el puerto que usará el contenedor
EXPOSE 3000

# Comando para iniciar la web
CMD ["npm", "start"]