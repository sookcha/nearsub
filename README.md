# Nearsub

지하철 역의 열차 도착 정보 API.

## Installation

로컬에서 실행:
```bash
sls offline
```

AWS Lambda에 배포:
```bash
sls deploy
```
 AWS SSM으로 [서울시 지하철 실시간 도착정보 API Key](http://data.seoul.go.kr/dataList/OA-12764/A/1/datasetView.do) 를 관리합니다.

http://localhost:3000/dev?stationName={역이름} 으로 접근합니다.

 ## 활용

 모바일 기기에서 geofencing과 함께 활용하면 꽤 유용하게 사용할 수 있습니다.

지하철 역 근처에서 내가 지금 뛰어야 열차를 놓치지 않을 지를 간편하게 확인할 수 있습니다.
