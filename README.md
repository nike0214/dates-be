**구성**  
BE: typescript / Nest.js  
DB: Sqlite3

**Sequence diagram**
로그인 관련 사항만 있고, 다른건 단순 API 호출이라 별도로 그리진 않았습니다  
확인해보시고 수정할거나 추가할거 있으면 말씀해주세요~!
https://drive.google.com/file/d/1MkXP2NrPMbktdwvZLfHujIIsMS1FW0hT/view?usp=sharing


**API (Swagger)**
```
https://clesson-dev.duckdns.org:8888/api
```
swagger 통해서 로그인 및 jwt 필요한 API 호출 가능하도록, signature 검증은 주석처리해놨습니다

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

