interface SummaryCardProps {
    title: string
    value: number | string
    subtitle: string
    icon: string
  }
  
  export function SummaryCard({ title, value, subtitle, icon }: SummaryCardProps) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border" style={{ borderColor: '#E8D7F1' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium font-roboto" style={{ color: '#333745', opacity: 0.7 }}>
            {title}
          </h3>
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="text-3xl font-bold font-roboto mb-1" style={{ color: '#333745' }}>
          {value}
        </div>
        <div className="text-sm font-roboto" style={{ color: '#333745', opacity: 0.6 }}>
          {subtitle}
        </div>
      </div>
    )
  }