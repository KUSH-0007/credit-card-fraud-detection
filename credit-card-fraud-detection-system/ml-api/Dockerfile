FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Create the ML model on startup
RUN python create_fraud_model.py

CMD ["python", "app.py"]