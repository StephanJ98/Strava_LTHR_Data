import { useState } from 'react'
import DropZone from './components/DropZone'
import Header from './components/Header'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import FitParser from 'fit-file-parser'
import { GradeExtractor, GradePercentage, HeartRateExtractor, LTHRZonesPercentage } from './utils/tools'
import Chart from './components/Chart'

function App() {
  const [heartRateZones, setHeartRateZones] = useState({ Recover: '', Endurance: '', Aerobic: '', Threshold: '', Anaerobic: '' })
  const [gradeZones, setGradeZones] = useState({ zu_0: '', z0_3: '', z3_5: '', z5_8: '', z8_10: '', z10: '' })
  const [gender, setGender] = useState<string>('w')
  const [age, setAge] = useState<number>(0)
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (rawfile !== undefined && rawfile?.path.endsWith('.fit') && age !== 0) {
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
          setHeartRateZones(LTHRZonesPercentage(age, gender, heartRates))
          const grades: number[] = GradeExtractor(result)
          setGradeZones(GradePercentage(grades))
        })
      } catch (error) {
        console.error(error)
      }
      setFlag(true)
    }
  }

  const handleFilesDropped = (acceptedFiles: File[]) => {
    main(acceptedFiles[0])
  }

  return (
    <div className='text-center w-full h-full flex flex-col items-center gap-8 py-8 px-2'>
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

          </div>
          <DropZone onFilesDropped={handleFilesDropped} />
        </div>
      ) : (
        <div className='flex flex-col justify-center items-center w-full'>
          <div className='w-auto'>
            <button className='p-1 m-1 border-2 border-solid border-neutral-600 bg-neutral-300 rounded-md font-semibold print:hidden' onClick={() => window.location.reload()}>Go Back</button>
            <button className='p-1 m-1 border-2 border-solid border-neutral-600 bg-neutral-300 rounded-md font-semibold print:hidden' onClick={() => window.print()}>Print</button>
          </div>
          <div className='flex flex-col lg:flex-row flex-wrap w-full justify-center items-center lg:justify-evenly'>
            <Chart
              data={heartRateZones}
              name='HeartRate Percentages'
              type='radar'
            />

            <Chart
              data={gradeZones}
              name='Slope'
              type='line'
            />

          </div>
        </div>
      )}
    </div>
  )
}

export default App
