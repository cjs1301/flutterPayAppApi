## Navigation
1. [Introduce](#introduce)
2. [How to Use](#how-to-use)
3. [Folder](#folder)
4. [Library](#library)
5. [Custom Color List](#custom-color-list)
6. [Section](#section)
7. [Reversal](#reversal)

# introduce

# how-to-use

1. 모듈설치하기
```
npm i
```
2. 환경변수 설정하기
> 파일명 변경후 키값들을 채워 넣으세요
> `.env.exsample` => `.env`

3. 데이터베이스 설정
> config/`config.json`
> mysql에 데이터베이스 만들기

4. 서버 실행
```
node app.js
```

## folder

> 구성
 - config `sequlize의 연결DB셋팅`
 - controllers `api function`
 - eventImg `앱 이벤트사진 업로드 저장소`
 - iconbox `앱 아이콘 보관소`
 - models `sequlize DB모델 설정`
 - modules `앱알림,토큰 관리,초기 가게 정보목록,파일 업로드 설정`
 - public `파비콘 파일`
 - router `라우팅 관리`
 - subsciptionFile `약정충전 신청서 다운로드,업로드`

## library
