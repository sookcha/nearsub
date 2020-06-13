import 'dotenv/config'
import serverless = require('serverless-http');
import axios from 'axios';
import Koa = require('koa');

const app = new Koa();

interface TrainStatus {
  code: number
  message1: string
  message2: string
}

interface Station {
  id: number
  name: string|null
}

interface TrainInfo {
  current_station: Station
  prev_station: Station
  next_station: Station

  heading: string
  isExpress: boolean
  eta: number
  final_station: Station
  status: TrainStatus
}

interface TrainResponse {
  statnFid: number // 이전지하철역ID
  statnTid: number // 다음지하철역ID
  statnId: number // 지하철역ID
  statnNm: string // 지하철역명
  btrainSttus: string //열차종류 (급행,ITX)  
  barvlDt: number // 열차도착예정시간 (단위:초)
  bstatnId: number // 종착지하철역ID
  bstatnNm: string // 종착지하철역명
  arvlMsg2: string //  첫번째도착메세지 (전역 진입, 전역 도착 등)
  arvlMsg3: string // 두번째도착메세지 (종합운동장 도착, 12분 후 (광명사거리) 등)
  arvlCd: number // 도착코드 (0:진입, 1:도착, 2:출발, 3:전역출발, 4:전역진입, 5:전역도착, 99:운행중)
  trainLineNm: string // 도착지방면 (성수행 - 구로디지털단지방면)
}

interface Response extends JSON {
  realtimeArrivalList: Array<TrainResponse>
}

app.use(async (ctx) => {
  const key = process.env.SEOUL_OPEN_API_KEY
  const stationName = ctx.request.query['stationName']
  if (!stationName || !key) {
    ctx.throw(400)
  }

  const encodedStationName = encodeURI(stationName)
  const url = `http://swopenapi.seoul.go.kr/api/subway/${key}/json/realtimeStationArrival/0/5/${encodedStationName}`

  const response = await axios.get(url)

  ctx.body = parseData(response.data)
});

const parseData = (data: Response): Array<TrainInfo> => {
  const responsedTrains = data.realtimeArrivalList
  if (!responsedTrains) {
    return []
  }
  return responsedTrains.map((responsedTrain: TrainResponse) => {
    const train: TrainInfo = {
      current_station: {
        id: responsedTrain.statnId,
        name: responsedTrain.statnNm
      },
      eta: responsedTrain.barvlDt,
      heading: responsedTrain.trainLineNm,
      isExpress: responsedTrain.btrainSttus === '급행',
      next_station: {
        id: responsedTrain.statnId,
        name: null
      },
      prev_station: {
        id: responsedTrain.statnFid,
        name: null
      },
      final_station: {
        id: responsedTrain.bstatnId,
        name: responsedTrain.bstatnNm
      },
      status: {
        code: responsedTrain.arvlCd,
        message1: responsedTrain.arvlMsg2,
        message2: responsedTrain.arvlMsg3
      }
    }
    return train
  })
}

export const handler = serverless(app);
