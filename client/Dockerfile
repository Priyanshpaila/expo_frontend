FROM node:18 AS build

ENV PORT=81
ENV NODE_OPTIONS="--max-old-space-size=2048"
ENV VITE_API_BASE_URL=https://expobe.rrispat.in

WORKDIR /app
COPY package.json /app/
COPY package-lock.json /app/

# Clean npm cache and force esbuild rebuild
RUN npm cache clean --force
RUN npm install --legacy-peer-deps
RUN npm rebuild esbuild

COPY . /app/

# Build the application
RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx.conf to replace default nginx.conf
COPY ./nginx.conf /etc/nginx/nginx.conf

EXPOSE ${PORT}

CMD ["nginx", "-g", "daemon off;"]


# docker build  --no-cache -t 192.168.13.72:5000/expofe_3dec2025 .      
# docker run -d --name expofe_3dec2025 -p 81:81 expofe_3dec2025_image

# docker tag expofe_3dec2025_image 192.168.13.72:5000/expofe_3dec2025
# docker push 192.168.13.72:5000/expofe_3dec2025
# docker pull 192.168.13.72:5000/expofe_3dec2025
# docker run -d --name expofe_3dec2025 -p 81:81 192.168.13.72:5000/expofe_3dec2025

