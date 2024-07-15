from pymongo import MongoClient
from openai import OpenAI
from dotenv import load_dotenv
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"))


# OpenAI API 키 설정
api_key = os.environ["API_KEY"]

mogodbURL = f"mongodb+srv://{os.environ['MONGODB_KEY']}@cluster0.siectcp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
# MomgoDB 연결
client = MongoClient(mogodbURL)
database = client["project2"]
collection = database["CaseLaw"]

# 데이터에서 검색 조건에 맞는 결과 찾기
def search_caselaw(kinda, kindb, content):
    # 쿼리 조건을 담을 딕셔너리
    query = {}

    # result 값이 있으면 쿼리에 추가
    if kinda != '전체':
        query["kinda"] = kinda

    # classification 값이 있으면 쿼리에 추가
    if kindb != "전체":
        query["kindb"] = kindb

    # text 값이 있으면 content 필드를 부분 일치 검색 쿼리에 추가
    if content != '':
        print('2')
        query["content"] = {"$regex": content, "$options": "i"}

    try:
        # MongoDB에서 검색
        cursor = collection.find(query)
        
        # 검색 결과 처리
        results = []
        for doc in cursor:
        # MongoDB 문서에서 _id 필드 제외하기
            doc.pop('_id', None)
            results.append(doc)

        return results
    
    except Exception as e:
        print(f"Error occurred: {e}")
        return None
    
# 데이터에서 정보 찾기
def findcaselaw(accnum):
    data = collection.find_one({"accnum": accnum})
    if data:
        data["_id"] = str(data["_id"])
    return data

# gpt에서 결과 받기
def findanswer(text):
    client = OpenAI(api_key=api_key)

    response = client.chat.completions.create(
        model = "gpt-3.5-turbo-0125",
        messages = [{"role": "user", "content": f"{text}/n/n 위 내용으로 산재를 받을 확률이 얼마나되는지 파악하고 가능한지 불가능한지 좀 더 가능성이 있는 쪽으로 말해줘\n 산재와 관련이 없는 내용이거나 정보가 부족하면 '추가적인 정보가 필요합니다.'라고 답변해줘"}],
        temperature=0.7,
        top_p=0.7,
        frequency_penalty=0.2
    )

    # 결과 확인
    print("내용\n", response.choices[0].message.content)
    return response.choices[0].message.content