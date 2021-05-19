import { useState } from 'react'
import { DropzoneArea } from 'material-ui-dropzone'
import { VictoryAxis, VictoryBar, VictoryChart } from 'victory'
import { Button } from '@material-ui/core'
import styles from './DropDownBody.module.css'
const lthr = require('lthrmodule')
const path = require('path')

interface Zones {
    z1: String;
    z2: String;
    z3: String;
    z4: String;
    z5a: String;
    z5b: String;
    z5c: String;
}

export default function DropDownBody() {
    const [zones, setZones] = useState<Zones>({ z1: '', z2: '', z3: '', z4: '', z5a: '', z5b: '', z5c: '' })
    const [gender, setGender] = useState<String>('w')
    const [age, setAge] = useState<Number>(0)
    const [sport, setSport] = useState<String>('c')
    const [flag, setFlag] = useState<Boolean>(false)

    const mainFunc = async (rawfile: File) => {
        if (age !== 0) {
            setFlag(true)
        }
        if ((rawfile !== undefined) && (path.extname(rawfile.name) === '.fit')) {
            setZones(lthr.LTHRZonesPercentage(age, gender, sport, lthr.HeartRateExtractor(Buffer.from(await rawfile.arrayBuffer()))))
        }
    }


    const printFunc = async () => {
        document.getElementById('gbBTN')!.style.display= 'none'
        document.getElementById('pBTN')!.style.display= 'none'
        document.getElementById('chart')!.style.width= '90%'
        window.print()
        document.getElementById('gbBTN')!.style.display= 'inline'
        document.getElementById('pBTN')!.style.display= 'inline'
        document.getElementById('chart')!.style.width= '60%'
    }

    return (
        <section className={styles.main}>
            {(flag !== true) ? (
                <div className={styles.dropdown}>
                    <div className={styles.inputsGroup}>
                        <div className={styles.inputsSubGroup}>
                            <p>Gender: </p>
                            <select name="gender" onChange={(e) => setGender(e.target.value)}>
                                <option value='f'>Woman</option>
                                <option value='m'>Man</option>
                            </select>
                        </div>
                        <div className={styles.inputsSubGroup}>
                            <p>Age: </p>
                            <input type='number' name='age' onChange={(e) => setAge(Number(e.target.value))} />
                        </div>
                        <div className={styles.inputsSubGroup}>
                            <p>Sport: </p>
                            <select name="sport" onChange={(e) => setSport(e.target.value)}>
                                <option value='c'>Cycling</option>
                                <option value='r'>Running</option>
                            </select>
                        </div>
                    </div>
                    <DropzoneArea
                        onChange={(rawfile) => mainFunc(rawfile[0])}
                        filesLimit={1}
                    />
                </div>
            ) : (
                <div className={styles.chart} id='chart'>
                    <Button variant="contained" id='gbBTN' onClick={() => window.location.reload()}>Go Back</Button>
                    <Button variant="contained" id='pBTN' onClick={() => printFunc()}>Print</Button>
                    <VictoryChart
                        domainPadding={20}
                    >
                        <VictoryAxis
                            tickValues={[1, 2, 3, 4, 5, 6, 7]}
                            tickFormat={["Zone 1", "Zone 2", "Zone 3", "Zone 4", "Zone 5a", "Zone 5b", "Zone 5c"]}
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
                                { x: 5, y: Number(zones.z5a) },
                                { x: 6, y: Number(zones.z5b) },
                                { x: 7, y: Number(zones.z5c) },
                            ]}
                            labels={({ datum }) => `${datum.y}%`}
                        />
                    </VictoryChart>
                </div>
            )}
        </section>
    )
}
