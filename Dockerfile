FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# 모델 다운로드 스크립트 추가
CMD ["sh", "-c", "python download_model.py && uvicorn main:app --host 0.0.0.0 --port 8000"]
