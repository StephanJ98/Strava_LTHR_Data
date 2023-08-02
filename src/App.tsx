import { useState } from 'react'
import { VictoryAxis, VictoryBar, VictoryChart } from 'victory'
import DropZone from './components/DropZone'
import Header from './components/Header'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const FitParser = require('fit-file-parser')
import { HeartRateExtractor, LTHRZonesPercentage } from './utils/tools'

type Zones = {
  z1: string
  z2: string
  z3: string
  z4: string
  z5: string
}

function App() {
  const [zones, setZones] = useState<Zones>({ z1: '', z2: '', z3: '', z4: '', z5: '' })
  const [gender, setGender] = useState<string>('w')
  const [age, setAge] = useState<number>(0)
  const [sport, setSport] = useState<string>('c')
  const [flag, setFlag] = useState<boolean>(false)

  const readFileAsArrayBuffer = (file: File) => {
    return new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        if (reader.result instanceof ArrayBuffer) resolve(reader.result)
        else reject(new Error('Failed to read file as ArrayBuffer.'))
      }
      reader.onerror = () => {
        reject(reader.error)
      }
      reader.readAsArrayBuffer(file)
    })
  }

  const main = async (rawfile: File) => {
    if (age !== 0) setFlag(true)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
    if (rawfile !== undefined && rawfile?.path.endsWith('.fit')) {
      try {
        const fileContent = await readFileAsArrayBuffer(rawfile)
        const fitParser = new FitParser()
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        fitParser.parse(fileContent, (error, result) => {
          if (error) {
            console.error(error)
            return
          }

          // ToDo
          const heartRates: number[] = HeartRateExtractor(result)
          setZones(LTHRZonesPercentage(age, gender, sport, heartRates))
        })
      } catch (error) {
        console.error(error)
      }
    }
  }

  const printFunc = async () => {
    document.getElementById('gbBTN')!.style.display = 'none'
    document.getElementById('pBTN')!.style.display = 'none'
    document.getElementById('chart')!.style.width = '90%'
    window.print()
    document.getElementById('gbBTN')!.style.display = 'inline'
    document.getElementById('pBTN')!.style.display = 'inline'
    document.getElementById('chart')!.style.width = '60%'
  }

  const handleFilesDropped = (acceptedFiles: File[]) => {
    main(acceptedFiles[0])
  }

  return (
    <div className='text-center w-full h-full flex flex-col items-center gap-8 p-8'>
      <Header />
      {(flag !== true) ? (
        <div className={'w-10/12 flex flex-col justify-between items-center gap-8'}>
          <div className={'flex flex-col justify-between items-center gap-8 mb-[10px] md:flex-row'}>

            <div className={'flex flex-row justify-between text-2xl w-full'}>
              <p className='font-semibold'>Gender: </p>
              <select className='rounded-md border-2 border-solid px-1' name="gender" onChange={(e) => setGender(e.target.value)}>
                <option value='f'>Woman</option>
                <option value='m'>Man</option>
              </select>
            </div>

            <div className={'flex flex-row justify-between text-2xl w-full'}>
              <p className='font-semibold'>Age: </p>
              <input className='rounded-md border-2 border-solid px-1 w-[50%]' type='number' name='age' onChange={(e) => setAge(Number(e.target.value))} />
            </div>

            <div className={'flex flex-row justify-between text-2xl w-full'}>
              <p className='font-semibold'>Sport: </p>
              <select className='rounded-md border-2 border-solid px-1' name="sport" onChange={(e) => setSport(e.target.value)}>
                <option value='c'>Cycling</option>
                <option value='r'>Running</option>
              </select>
            </div>

          </div>
          <DropZone onFilesDropped={handleFilesDropped} />
        </div>
      ) : (
        <div className={'w-[60%]'} id='chart'>
          <button id='gbBTN' className='p-1 m-1 border-2 border-solid border-neutral-600 bg-neutral-300 rounded-md font-semibold' onClick={() => window.location.reload()}>Go Back</button>
          <button id='pBTN' className='p-1 m-1 border-2 border-solid border-neutral-600 bg-neutral-300 rounded-md font-semibold' onClick={() => printFunc()}>Print</button>
          <VictoryChart
            domainPadding={20}
          >
            <VictoryAxis
              tickValues={[1, 2, 3, 4, 5]}
              tickFormat={["Recover", "Endurance", "Aerobic", "Threshold", "Anaerobic"]}
            />
            <VictoryAxis
              dependentAxis
              tickFormat={(x) => (`${x}%`)}
            />
            <VictoryBar
              data={[
                { x: 1, y: Number(zones.z1) },
                { x: 2, y: Number(zones.z2) },
                { x: 3, y: Number(zones.z3) },
                { x: 4, y: Number(zones.z4) },
                { x: 5, y: Number(zones.z5) }
              ]}
              labels={({ datum }) => `${datum.y}%`}
            />
          </VictoryChart>
        </div>
      )}
    </div>
  )
}

export default App
