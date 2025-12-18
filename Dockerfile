FROM nginx:alpine
COPY /dist /usr/share/nginx/html
COPY nginx.con /etc/nginx/nginx.conf
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]




