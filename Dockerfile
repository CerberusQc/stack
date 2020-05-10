FROM polinux/httpd-php:latest
COPY . /var/www/html/
EXPOSE 80
