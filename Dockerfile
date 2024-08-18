FROM python:3.11-slim

RUN apt-get update && apt-get install -y \
    gcc \
    gettext \
    && rm -rf /var/lib/apt/lists/*

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install django gunicorn

COPY . .

RUN python manage.py collectstatic --noinput
RUN django-admin compilemessages

CMD ["gunicorn", "wishlist_project.wsgi:application", "--bind", "0.0.0.0:8000"]

EXPOSE 8000
