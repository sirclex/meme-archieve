FROM python:3.12.4-bookworm

WORKDIR /app

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . .

EXPOSE 3031

CMD ["fastapi", "run", "main.py", "--port", "3031"]