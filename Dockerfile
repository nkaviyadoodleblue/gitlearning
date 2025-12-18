FROM nginx:alpine
COPY /dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.con
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]


