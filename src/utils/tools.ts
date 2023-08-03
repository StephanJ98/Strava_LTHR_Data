export const TheoricalMaxHeartRate = (age: number, gender: string) => {
    switch (String(gender).toLocaleLowerCase()) {
        case 'm':
            return 220 - age
        case 'f':
            return 226 - age
        default:
            return 223 - age
    }
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const HeartRateExtractor = (contenido): number[] => {
    try {
        const records = contenido.records
        const arr: number[] = []

        for (let i = 0; i < records.length; i++) {
            if (records[i].heart_rate != undefined) arr.push(records[i].heart_rate)
        }
        return arr
    }
    catch (error) {
        console.log(error);
    }
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const GradeExtractor = (contenido): number[] => {
    try {
        const records = contenido.records
        const arr: number[] = []

        for (let i = 0; i < records.length; i++) {
            if (records[i].grade != undefined) arr.push(records[i].grade)
        }
        return arr
    }
    catch (error) {
        console.log(error);
    }
}

export const LTHRZones = (age: number, gender: string) => {
    const maxHeartRate = TheoricalMaxHeartRate(age, gender)
    return {
        "Recover": (maxHeartRate * 0.56).toFixed(0),
        "Endurance": (maxHeartRate * 0.66).toFixed(0),
        "Aerobic": (maxHeartRate * 0.75).toFixed(0),
        "Threshold": (maxHeartRate * 0.85).toFixed(0),
        "Anaerobic": (maxHeartRate).toFixed(0)
    }
}

export const LTHRZone = (age: number, gender: string, heartRate: number) => {
    const maxHeartRate = TheoricalMaxHeartRate(age, gender)
    if (heartRate < (maxHeartRate * 0.56)) {
        return 'Recover'
    } else if ((heartRate >= (maxHeartRate * 0.56)) && (heartRate <= (maxHeartRate * 0.66))) {
        return 'Endurance'
    } else if ((heartRate > (maxHeartRate * 0.66)) && (heartRate <= (maxHeartRate * 0.75))) {
        return 'Aerobic'
    } else if ((heartRate > (maxHeartRate * 0.75)) && (heartRate <= (maxHeartRate * 0.85))) {
        return 'Threshold'
    } else if (heartRate > (maxHeartRate * 0.85)) {
        return 'Anaerobic'
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const LTHRZonesPercentage = (age: number, gender: string, arr: any[]) => {
    const zones = {
        Recover: 0,
        Endurance: 0,
        Aerobic: 0,
        Threshold: 0,
        Anaerobic: 0
    }
    let count = 0
    arr.forEach((elem) => {
        const zone = LTHRZone(age, gender, elem)
        switch (zone) {
            case 'Recover':
                zones.Recover += 1
                break;
            case 'Endurance':
                zones.Endurance += 1
                break;
            case 'Aerobic':
                zones.Aerobic += 1
                break;
            case 'Threshold':
                zones.Threshold += 1
                break;
            case 'Anaerobic':
                zones.Anaerobic += 1
                break;
            default:
                console.log('Error: Key not found.')
                break;
        }
        count++
    })

    return {
        Recover: ((zones.Recover / count) * 100).toFixed(1),
        Endurance: ((zones.Endurance / count) * 100).toFixed(1),
        Aerobic: ((zones.Aerobic / count) * 100).toFixed(1),
        Threshold: ((zones.Threshold / count) * 100).toFixed(1),
        Anaerobic: ((zones.Anaerobic / count) * 100).toFixed(1)
    }
}

export const GradePercentage = (arr: number[]) => {
    const zones = {
        zu_0: 0,
        z0_3: 0,
        z3_5: 0,
        z5_8: 0,
        z8_10: 0,
        z10: 0
    }
    let count = 0
    arr.forEach(elem => {
        if (elem <= 0) { zones.zu_0 += 1 }
        if (elem > 0 && elem <= 3) { zones.z0_3 += 1 }
        if (elem > 3 && elem <= 5) { zones.z3_5 += 1 }
        if (elem > 5 && elem <= 8) { zones.z5_8 += 1 }
        if (elem > 8 && elem <= 10) { zones.z8_10 += 1 }
        if (elem > 10) { zones.z10 += 1 }

        count++
    })

    return {
        zu_0: ((zones.zu_0 / count) * 100).toFixed(1),
        z0_3: ((zones.z0_3 / count) * 100).toFixed(1),
        z3_5: ((zones.z3_5 / count) * 100).toFixed(1),
        z5_8: ((zones.z5_8 / count) * 100).toFixed(1),
        z8_10: ((zones.z8_10 / count) * 100).toFixed(1),
        z10: ((zones.z10 / count) * 100).toFixed(1)
    }
}