**구성**  
BE: typescript / Nest.js  
DB: Sqlite3  (2023/1/1~31 기본 정보는 저장돼있습니다)
Storage: AWS S3  
(AccessKey와 SecretAccessKey는 카톡 통해 별도로 전달드리겠습니다)  
```
Bucket_NAME=dates-temp  
AWS_S3_REGION=ap-northeast-2  
```

**Sequence diagram**  
로그인 관련 사항 / 이미지 업로드(w.S3)만 있고, 다른건 단순 API 호출이라 별도로 그리진 않았습니다  
확인해보시고 수정할거나 추가할거 있으면 말씀해주세요~!  
https://drive.google.com/file/d/1MkXP2NrPMbktdwvZLfHujIIsMS1FW0hT/view?usp=sharing


**API (Swagger)**
```
https://clesson-dev.duckdns.org:8888/api
```
swagger 통해서 로그인 및 jwt 필요한 API 호출 가능하도록, 로그인 시 signature 검증은 주석처리해놨습니다

**BE 서버 접속 경로**
```
https://clesson-dev.duckdns.org:8888/
```
CORS 문제가 발생할 수 있습니다. 우선 localhost:3000은 허용해놨으니, 로컬에서 FE 실행 시 3000 포트로 실행해보고 이상있으면 말씀해주세요

**Local 실행 방법**
```
docker build -t dates-be .
docker run -itd -p 8888:3000 --name dates-be dates-be
```

