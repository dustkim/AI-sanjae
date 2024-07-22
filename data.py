from pymongo import MongoClient
# from openai import OpenAI
from dotenv import load_dotenv
import os
from model import preprocess, modelstart
import random

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"))

# OpenAI API 키 설정
api_key = os.environ["API_KEY"]

mogodbURL = f"mongodb+srv://{os.environ['MONGODB_KEY']}@cluster0.siectcp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
# MomgoDB 연결
client = MongoClient(mogodbURL)
database = client["project2"]
collection = database["CaseLaw"]
collections = database["Nomusa"]

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
        client.close()
        
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

# model에서 결과 받기
def findanswer(text, select):
    if ("JAVA_HOME" in os.environ) == False:
        os.environ["JAVA_HOME"] = r"C:\Program Files\Java\jdk-22\bin\server"
        print("JAVA_HOME" in os.environ)

    Cleantext = preprocess(text)
    result = modelstart(Cleantext, select)
    print(result[0])
    if result[0]["similarity"] > 0.5:
        if result[0]["kinda"] == "기각":
            return f"'산재 불가능' 확률이 높습니다."
        else:
            return f"'산재 가능' 확률이 높습니다."
    else:
        return f"진단시 받았던 병명/상황을 좀 더 상세하게 작성해 주세요."

    # client = OpenAI(api_key=api_key)

    # response = client.chat.completions.create(
    #     model = "gpt-3.5-turbo-0125",
    #     messages = [{"role": "user", "content": f"'{text}' 이러한 상황인데/n/n 판례문 중에 {result[0]['content']}인 판례내용이 있어 그럼 현재 상황에 대해 산재를 받을 수 있을까?"}],
    #     temperature=0.7,
    #     top_p=0.7,
    #     frequency_penalty=0.2
    # )
    # return response

# _id 제거
def idremove(doc):
    doc.pop('_id', None)
    return doc

# MongoDB에서 노무사 정보 찾기
def findNomusa():
    Nomusa = collections.find({})
    randomdata = list(Nomusa)
    idremovedata =  random.sample(randomdata, k=5)
    randomdatapost = [idremove(doc) for doc in idremovedata]

    return randomdatapost