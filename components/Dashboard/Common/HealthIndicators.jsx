'use client'


const HealthIndicators = ({ data }) => {

    return (
        <>
            <div>
                <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-2 lg:grid-cols-3">
                    {[
                        { label: 'Health Overall', value: data.tbMDHealthOverall, title: 'Overall Health' },
                        { label: 'Health Cost', value: data.tbMDHealthCost, title: 'Cost Health' },
                        { label: 'Health Hours', value: data.tbMDHealthHours, title: 'Hours Health' },
                        { label: 'Health Risk', value: data.tbMDHealthRisk, title: 'Risk Health' },
                        { label: 'Health Schedule', value: data.tbMDHealthSchedule, title: 'Schedule Health' },
                        { label: 'Health Scope', value: data.tbMDHealthScope, title: 'Scope Health' },
                        { label: 'Health Issues', value: data.tbMDHealthIssues, title: 'Issues Health' },
                    ].map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <p className="font-semibold text-gray-700">{item.label}</p>
                            <div
                                title={`${item.title}: ${item.value || 'N/A'}`}
                                className={`w-[25px] h-[25px] rounded-full ${item.value === 'Not Assessed'
                                        ? 'bg-orange-400'
                                        : item.value
                                            ? `bg-${item.value.toLowerCase()}-500`
                                            : 'bg-gray-300'
                                    }`}
                            ></div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}
export default HealthIndicators