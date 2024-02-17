# Use the official Nginx image from Docker Hub
FROM nginx:latest
COPY public /usr/share/nginx/html
