export const TheoricalMaxHeartRate = (age: number, gender: any) => {
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

export const LTHRZones = (age: any, gender: any, sport: any) => {
    const maxHeartRate = TheoricalMaxHeartRate(age, gender)
    if (String(sport).toLocaleLowerCase() === 'c') {
        return {
            "zone1": (maxHeartRate * 0.56).toFixed(0),
            "zone2": (maxHeartRate * 0.66).toFixed(0),
            "zone3": (maxHeartRate * 0.75).toFixed(0),
            "zone4": (maxHeartRate * 0.85).toFixed(0),
            "zone5": (maxHeartRate).toFixed(0)
        }
    } else if (String(sport).toLocaleLowerCase() === 'r') {
        return {
            "zone1": (maxHeartRate * 0.58).toFixed(0),
            "zone2": (maxHeartRate * 0.68).toFixed(0),
            "zone3": (maxHeartRate * 0.77).toFixed(0),
            "zone4": (maxHeartRate * 0.87).toFixed(0),
            "zone5": (maxHeartRate).toFixed(0)
        }
    } else {
        console.log('Error: Sport not found.')
        console.log('Sports available are [c] for cycling or [r] for running.')
    }
}

export const LTHRZone = (age: any, gender: any, heartRate: number, sport: any) => {
    const maxHeartRate = TheoricalMaxHeartRate(age, gender)
    if (String(sport).toLocaleLowerCase() === 'c') {
        if (heartRate < (maxHeartRate * 0.56)) {
            return 'zone1'
        } else if ((heartRate >= (maxHeartRate * 0.56)) && (heartRate <= (maxHeartRate * 0.66))) {
            return 'zone2'
        } else if ((heartRate > (maxHeartRate * 0.66)) && (heartRate <= (maxHeartRate * 0.75))) {
            return 'zone3'
        } else if ((heartRate > (maxHeartRate * 0.75)) && (heartRate <= (maxHeartRate * 0.85))) {
            return 'zone4'
        } else if (heartRate > (maxHeartRate * 0.85)) {
            return 'zone5'
        }
    } else if (String(sport).toLocaleLowerCase() === 'r') {
        if (heartRate < (maxHeartRate * 0.56)) {
            return 'zone1'
        } else if ((heartRate >= (maxHeartRate * 0.58)) && (heartRate <= (maxHeartRate * 0.68))) {
            return 'zone2'
        } else if ((heartRate > (maxHeartRate * 0.68)) && (heartRate <= (maxHeartRate * 0.77))) {
            return 'zone3'
        } else if ((heartRate > (maxHeartRate * 0.77)) && (heartRate <= (maxHeartRate * 0.87))) {
            return 'zone4'
        } else if (heartRate > (maxHeartRate * 0.87)) {
            return 'zone5'
        }
    } else {
        console.log('Error: Sport not found.')
        console.log('Sports available are [c] for cycling and [r] for running.')
    }
}

export const LTHRZonesPercentage = (age: any, gender: any, sport: any, arr: any[]) => {
    const zones = {
        z1: 0,
        z2: 0,
        z3: 0,
        z4: 0,
        z5: 0
    }
    let count = 0
    arr.forEach((elem: any) => {
        const zone = LTHRZone(age, gender, elem, sport)
        switch (zone) {
            case 'zone1':
                zones.z1 = zones.z1 + 1
                count++
                break;
            case 'zone2':
                zones.z2 = zones.z2 + 1
                count++
                break;
            case 'zone3':
                zones.z3 = zones.z3 + 1
                count++
                break;
            case 'zone4':
                zones.z4 = zones.z4 + 1
                count++
                break;
            case 'zone5':
                zones.z5 = zones.z5 + 1
                count++
                break;
            default:
                console.log('Error: Key not found.')
                break;
        }
    })

    return {
        z1: ((zones.z1 / count) * 100).toFixed(2),
        z2: ((zones.z2 / count) * 100).toFixed(2),
        z3: ((zones.z3 / count) * 100).toFixed(2),
        z4: ((zones.z4 / count) * 100).toFixed(2),
        z5: ((zones.z5 / count) * 100).toFixed(2)
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
        zu_0: ((zones.zu_0 / count) * 100).toFixed(2),
        z0_3: ((zones.z0_3 / count) * 100).toFixed(2),
        z3_5: ((zones.z3_5 / count) * 100).toFixed(2),
        z5_8: ((zones.z5_8 / count) * 100).toFixed(2),
        z8_10: ((zones.z8_10 / count) * 100).toFixed(2),
        z10: ((zones.z10 / count) * 100).toFixed(2)
    }
}