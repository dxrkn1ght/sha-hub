sha_crm - PRODUCTION READY scaffold

Included:
- Django backend with apps: users, groups, students, payments, teachers, dashboard
- DRF + JWT auth
- Payments module supporting monthly tuition, partial payments, cash/card
- Frontend prototype with payment modal and debt list

Backend quick start:
1. cd backend
2. python -m venv .venv && source .venv/bin/activate
3. pip install -r requirements.txt
4. cp .env.example .env and edit
5. python manage.py migrate
6. python manage.py createsuperuser
7. python manage.py collectstatic --noinput
8. gunicorn config.wsgi

Railway deploy notes:
- Set DATABASE_URL and other env vars from .env.example
- Railway will run Procfile; after deploy run migrations and collectstatic in Railway console
