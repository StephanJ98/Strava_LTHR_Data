import { memo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from 'recharts'

type Props = {
    data: object
    name: string
    type?: 'line' | 'radar' | 'bar'
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CustomizedAxisTick = memo(({ x, y, stroke, payload }) => {
    return (
        <g transform={`translate(${x},${y})`}>
            <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(300)">
                {payload.value}
            </text>
        </g>
    )
})

const Chart = ({ data, name, type = 'line' }: Props) => {

    const transformJson = (originalJson: object): object[] => {
        const toret: object[] = []
        for (const [name, value] of Object.entries(originalJson)) {
            toret.push({
                name,
                value: parseFloat(value)
            })
        }
        return toret
    }

    const transformedData = transformJson(data)

    if (type === 'line' && transformedData) {
        return (
            <div className={'w-full lg:w-1/2 min-h-[500px] flex flex-col justify-center items-center'} >
                <p>{name}</p>
                <ResponsiveContainer className={'min-h-[500px]'} width="100%" height="100%">
                    <LineChart
                        width={600}
                        height={400}
                        data={transformedData}
                    >
                        <XAxis dataKey="name" height={100} tick={<CustomizedAxisTick />} />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke="#82ca9d" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        )
    }

    if (type === 'radar' && transformedData) {
        return (
            <div className={'w-full lg:w-1/2 min-h-[500px] flex flex-col justify-center items-center'} >
                <p>{name}</p>
                <RadarChart
                    width={600}
                    height={500}
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
                    data={transformedData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" />
                    <PolarRadiusAxis />
                    <Tooltip />
                    <Radar name="% of time" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                </RadarChart>
            </div>
        )
    }
}

export default Chart