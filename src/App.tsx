import { useState } from 'react'
import { VictoryAxis, VictoryBar, VictoryChart } from 'victory'
import DropZone from './components/DropZone'
import Header from './components/Header'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import FitParser from 'fit-file-parser'
import { GradeExtractor, GradePercentage, HeartRateExtractor, LTHRZonesPercentage } from './utils/tools'

function App() {
  const [heartRateZones, setHeartRateZones] = useState({ z1: '', z2: '', z3: '', z4: '', z5: '' })
  const [gradeZones, setGradeZones] = useState({ zu_0: '', z0_3: '', z3_5: '', z5_8: '', z8_10: '', z10: ''})
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
          setHeartRateZones(LTHRZonesPercentage(age, gender, sport, heartRates))
          const grades: number[] = GradeExtractor(result)
          setGradeZones(GradePercentage(grades))
        })
      } catch (error) {
        console.error(error)
      }
    }
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
        <div className='flex flex-col justify-center items-center w-full'>
          <div className='w-auto'>
            <button id='gbBTN' className='p-1 m-1 border-2 border-solid border-neutral-600 bg-neutral-300 rounded-md font-semibold' onClick={() => window.location.reload()}>Go Back</button>
            <button id='pBTN' className='p-1 m-1 border-2 border-solid border-neutral-600 bg-neutral-300 rounded-md font-semibold' onClick={() => window.print()}>Print</button>
          </div>
          <div className='flex flex-col md:flex-row flex-wrap w-full justify-center items-center md:justify-evenly'>
            <div className={'w-full md:w-[50%]'} id='chart'>
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
                    { x: 1, y: Number(heartRateZones.z1) },
                    { x: 2, y: Number(heartRateZones.z2) },
                    { x: 3, y: Number(heartRateZones.z3) },
                    { x: 4, y: Number(heartRateZones.z4) },
                    { x: 5, y: Number(heartRateZones.z5) }
                  ]}
                  labels={({ datum }) => `${datum.y}%`}
                />
              </VictoryChart>
            </div>
            
            <div className={'w-full md:w-[50%]'} id='chart'>
              <VictoryChart
                domainPadding={20}
              >
                <VictoryAxis
                  tickValues={[1, 2, 3, 4, 5, 6]}
                  tickFormat={[`<0%
                  slope`, `0%-3%
                  slope`, `3%-5%
                  slope`, `5%-8%
                  slope`, `8%-10%
                  slope`, `>10%
                  slope`]}
                />
                <VictoryAxis
                  dependentAxis
                  tickFormat={(x) => (`${x}%`)}
                />
                <VictoryBar
                  data={[
                    { x: 1, y: Number(gradeZones.zu_0) },
                    { x: 2, y: Number(gradeZones.z0_3) },
                    { x: 3, y: Number(gradeZones.z3_5) },
                    { x: 4, y: Number(gradeZones.z5_8) },
                    { x: 5, y: Number(gradeZones.z8_10) },
                    { x: 6, y: Number(gradeZones.z10) }
                  ]}
                  labels={({ datum }) => `${datum.y}%`}
                />
              </VictoryChart>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
