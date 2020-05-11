FROM php:5.6-apache
COPY . /var/www/html/
RUN chown -R www-data:www-data /var/www/html/