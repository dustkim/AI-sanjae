from sentence_transformers import SentenceTransformer
import os

# 환경 변수에서 모델 이름을 가져옴
model_name = os.getenv('MODEL_NAME')

# 모델 다운로드
model = SentenceTransformer(model_name)

# 모델을 저장할 경로
model_save_path = 'model'

# 모델 저장
model.save(model_save_path)