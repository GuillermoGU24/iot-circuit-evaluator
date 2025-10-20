# Etapa 1: Build
FROM node:20-alpine AS builder

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de definición de dependencias primero (para aprovechar cache)
COPY pnpm-lock.yaml package.json ./

# Instalar dependencias sin devtools innecesarios
RUN pnpm install --frozen-lockfile

# Copiar el resto del código del proyecto
COPY . .

# Compilar el proyecto (por ejemplo con Vite o CRA)
RUN pnpm run build

# Etapa 2: Servir con Nginx (más liviano y rápido)
FROM nginx:stable-alpine

# Copiar el archivo de configuración personalizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos generados a la carpeta pública de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponer el puerto
EXPOSE 80

# Comando de inicio
CMD ["nginx", "-g", "daemon off;"]
