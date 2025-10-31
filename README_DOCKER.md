Docker + Nginx setup

Build & start:
    docker-compose build --no-cache
    docker-compose up -d

After first start run migrations inside web container:
    docker-compose exec web python manage.py migrate
    docker-compose exec web python manage.py createsuperuser

Open app at http://localhost:8080
