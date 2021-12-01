# 마을이야기 페이
### _광진구 사회적 기업 지역 결제 앱_


node js, express 기반의 서버입니다.
기존앱의 서버와 연동이 되어야 사용가능합니다!
- [How to Use](#how-to-use)
- [Folder](#folder)
- ✨[Library](#library)✨

## how-to-use

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


| Plugin | 목적 |
| ------ | ------ |
| exceljs | 통계자료 제공, 엑셀로 대량의 정보 수정 |
| firebase-admin | 앱 내의 푸쉬 알림 설정 |
| jsonwebtoken | 로그인 관리 |
| node-cron | 주기적 앱 데이터 최신화 |
| sequelize | MySQL 컨트롤 |
| multer | 신청서, 이벤트 이미지 업로드 |

**Thank U**

