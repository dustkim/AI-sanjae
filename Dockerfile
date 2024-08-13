FROM python:3.9-slim

WORKDIR /app

ENV PORT=8000
ENV MONGODB_KEY=a77643675:47sRiC4WdWmy4M5a
ENV MODEL_NAME=distiluse-base-multilingual-cased-v1

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

# 모델 다운로드 스크립트를 실행
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]